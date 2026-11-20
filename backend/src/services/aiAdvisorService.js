import Groq from "groq-sdk";
import { config } from "../config/env.js";

function buildLoanContext(prediction, explanation) {
  // Do not send Age or Gender to the AI.
  const inputFeatures = prediction.inputFeatures?.toObject
    ? prediction.inputFeatures.toObject()
    : prediction.inputFeatures || {};

  const applicantFinancialDetails = Object.fromEntries(
    Object.entries(inputFeatures).filter(
      ([key]) => !["age", "gender"].includes(key.toLowerCase())
    )
  );

  // Exclude Age and Gender from SHAP factors.
  const importantSHAPFactors = (explanation?.top_factors || [])
    .filter(
      (factor) =>
        !["age", "gender"].includes(
          String(factor.feature || "").toLowerCase()
        )
    )
    .slice(0, 5)
    .map((factor) => ({
      feature: factor.feature,
      contribution: factor.contribution,
      impact: factor.impact,
      direction: factor.direction,
    }));

  return {
    decision: prediction.decision,
    approvalProbability: `${(
      Number(prediction.approvalProbability || 0) * 100
    ).toFixed(2)}%`,
    rejectionProbability: `${(
      Number(prediction.rejectionProbability || 0) * 100
    ).toFixed(2)}%`,
    modelVersion: prediction.modelVersion,
    applicantFinancialDetails,
    importantSHAPFactors,
  };
}

function createGroqClient() {
  if (!config.groqApiKey) {
    const error = new Error(
      "Groq API key is missing. Please configure GROQ_API_KEY in the backend .env file."
    );
    error.statusCode = 503;
    throw error;
  }

  return new Groq({
    apiKey: config.groqApiKey,
  });
}

// Existing AI Loan Advisor function
export async function generateLoanAdvisorResponse({
  prediction,
  explanation,
  question,
  conversationHistory = [],
}) {
  const groq = createGroqClient();
  const loanContext = buildLoanContext(prediction, explanation);

  const systemPrompt = `
You are LoanX AI Advisor, a professional and responsible loan analysis assistant.

Your job is to help applicants understand their LoanX prediction results
and explain the financial factors that may influence their loan outcome.

IMPORTANT RULES:

1. Use only the loan information and SHAP factors provided below.
2. Never invent financial details, model results, or applicant information.
3. Never guarantee loan approval or rejection.
4. Clearly explain that a prediction is an estimate, not a final lending decision.
5. Do not provide legal, investment, or guaranteed financial advice.
6. Do not ask for passwords, OTPs, bank account numbers, or sensitive credentials.
7. Do not use Age or Gender to explain or justify a prediction.
8. SHAP contributions describe model influence, not direct percentage-point changes.
9. If information is unavailable, say so honestly.
10. Keep responses friendly, clear, and professional.
11. Prefer short paragraphs and bullet points.

LOAN PREDICTION CONTEXT:

${JSON.stringify(loanContext, null, 2)}
`;

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    ...conversationHistory.slice(-8).map(({ role, content }) => ({
      role,
      content,
    })),
    {
      role: "user",
      content: question,
    },
  ];

  try {
    const completion = await groq.chat.completions.create({
      model: config.groqModel,
      messages,
      max_completion_tokens: 700,
    });

    const answer = completion.choices?.[0]?.message?.content;

    if (!answer || !String(answer).trim()) {
      const error = new Error(
        "The AI Advisor could not generate a response. Please try again."
      );
      error.statusCode = 502;
      throw error;
    }

    return String(answer).trim();
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    console.error("Groq AI Advisor Error:", error.message);

    const advisorError = new Error(
      error.status === 429
        ? "AI Advisor is temporarily busy. Please try again shortly."
        : "Unable to get a response from the AI Advisor. Please try again."
    );

    advisorError.statusCode = error.status === 429 ? 429 : 502;
    throw advisorError;
  }
}

// Parse AI-generated improvement plan safely.
function parseImprovementPlan(content) {
  try {
    let jsonText = String(content || "").trim();

    // Remove Markdown code fences if the model adds them.
    jsonText = jsonText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "");

    // Extract JSON if the model adds any extra text.
    const firstBrace = jsonText.indexOf("{");
    const lastBrace = jsonText.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace > firstBrace) {
      jsonText = jsonText.slice(firstBrace, lastBrace + 1);
    }

    const result = JSON.parse(jsonText);

    if (
      !result ||
      typeof result.summary !== "string" ||
      !Array.isArray(result.suggestions)
    ) {
      throw new Error("Invalid improvement plan format.");
    }

    const suggestions = result.suggestions
      .slice(0, 3)
      .map((item) => ({
        title: String(item.title || ""),
        reason: String(item.reason || ""),
        action: String(item.action || ""),
        relatedFactor: String(item.relatedFactor || "General financial health"),
        priority: ["High", "Medium", "Low"].includes(item.priority)
          ? item.priority
          : "Medium",
      }))
      .filter(
        (item) => item.title && item.reason && item.action
      );

    if (suggestions.length === 0) {
      throw new Error("No valid improvement suggestions were generated.");
    }

    return {
      summary: result.summary,
      suggestions,
      disclaimer:
        "These are general educational suggestions based on the available prediction data. They do not guarantee loan approval or replace professional financial advice.",
    };
  } catch (error) {
    console.error("Improvement Plan Parsing Error:", error.message);

    const planError = new Error(
      "Unable to prepare the loan improvement plan. Please try again."
    );
    planError.statusCode = 502;
    throw planError;
  }
}

// NEW: AI-Powered Loan Improvement Suggestions
export async function generateLoanImprovementSuggestions({
  prediction,
  explanation,
}) {
  const groq = createGroqClient();
  const loanContext = buildLoanContext(prediction, explanation);

  const systemPrompt = `
You are LoanX AI Financial Improvement Assistant.

Your task is to create a personalized, practical loan improvement plan
using the applicant's financial details and SHAP explanation.

STRICT RULES:

1. Use only the supplied applicant financial details and SHAP factors.
2. Never use Age or Gender.
3. Never invent income, debt, credit score, EMI, or other financial values.
4. Never assume units or ranges that are not provided.
5. Prioritize factors that the model identifies as important.
6. Explain why each suggestion may help the applicant's financial profile.
7. Give realistic actions the applicant can take.
8. Do not guarantee loan approval or promise a probability increase.
9. Do not claim that changing a feature will definitely change the model result.
10. If a financial detail is missing, do not pretend it is available.
11. Do not recommend taking additional loans to improve eligibility.
12. Keep the language simple, professional, and applicant-friendly.
13. Generate exactly 3 useful suggestions when the available information supports them.
14. If the data is limited, give general financial health suggestions and clearly avoid unsupported assumptions.

SHAP EXPLANATION:
SHAP contribution indicates how a feature influenced the model's prediction.
It does not represent a direct percentage-point change in approval probability.

OUTPUT FORMAT:

Return ONLY valid JSON. Do not use Markdown or code fences.

Use this exact structure:

{
  "summary": "A short personalized overview of the applicant's financial profile.",
  "suggestions": [
    {
      "title": "Short improvement title",
      "reason": "Why this area matters based on the available information.",
      "action": "A practical action the applicant can take.",
      "relatedFactor": "The related financial feature or General financial health",
      "priority": "High"
    }
  ]
}

Priority must be High, Medium, or Low.

LOAN PREDICTION CONTEXT:

${JSON.stringify(loanContext, null, 2)}
`;

  try {
    const completion = await groq.chat.completions.create({
      model: config.groqModel,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content:
            "Analyze my loan prediction and generate my personalized improvement plan.",
        },
      ],
      max_completion_tokens: 1000,
    });

    const response = completion.choices?.[0]?.message?.content;

    if (!response || !String(response).trim()) {
      const error = new Error(
        "The AI could not generate loan improvement suggestions."
      );
      error.statusCode = 502;
      throw error;
    }

    return parseImprovementPlan(response);
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    console.error("Groq Improvement Suggestions Error:", error.message);

    const suggestionError = new Error(
      error.status === 429
        ? "AI Improvement Plan is temporarily busy. Please try again shortly."
        : "Unable to generate loan improvement suggestions. Please try again."
    );

    suggestionError.statusCode = error.status === 429 ? 429 : 502;
    throw suggestionError;
  }
}
