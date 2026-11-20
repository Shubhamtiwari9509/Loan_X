import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  History,
  PlusCircle,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info,
  Loader2,
  RefreshCw,
  Download,
  Wallet,
  Clock3,
  Gauge,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  CircleDollarSign,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import {
  predictionApi,
  improvementApi,
} from "../api/client.js";

import { LoadingSpinner } from "../components/common/LoadingSpinner.jsx";
import { AIAdvisorChat } from "../components/common/AIAdvisorChat.jsx";
import { AIImprovementSuggestions } from "../components/common/AIImprovementSuggestions.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function formatFeatureName(feature) {
  const names = {
    Applicant_Income: "Applicant Income",
    Coapplicant_Income: "Co-applicant Income",
    Employment_Status: "Employment Status",
    Marital_Status: "Marital Status",
    Credit_Score: "Credit Score",
    Existing_Loans: "Existing Loans",
    DTI_Ratio: "Debt-to-Income Ratio",
    Collateral_Value: "Collateral Value",
    Loan_Amount: "Loan Amount",
    Loan_Term: "Loan Term",
    Loan_Purpose: "Loan Purpose",
    Property_Area: "Property Area",
    Education_Level: "Education Level",
    Employer_Category: "Employer Category",
    Savings: "Savings",
  };

  return names[feature] || feature.replaceAll("_", " ");
}

function formatFeatureValue(feature, value) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  const currencyFeatures = [
    "Applicant_Income",
    "Coapplicant_Income",
    "Savings",
    "Collateral_Value",
    "Loan_Amount",
  ];

  if (currencyFeatures.includes(feature)) {
    return `Rs. ${Number(value).toLocaleString("en-IN")}`;
  }

  if (feature === "DTI_Ratio") {
    return `${Math.round(Number(value) * 100)}%`;
  }

  if (feature === "Loan_Term") {
    return `${value} months`;
  }

  return String(value);
}

function getImpactDescription(direction) {
  if (direction === "approval") return "Supports approval";
  if (direction === "rejection") return "Pushes toward rejection";
  return "Neutral impact";
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
  color = "blue",
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <div className="min-w-0">
        <h2 className="text-sm sm:text-base font-black text-slate-900">
          {title}
        </h2>

        {subtitle && (
          <p className="text-[11px] text-slate-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
      <div className="flex items-center gap-1.5 text-slate-400 mb-2">
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[10px] font-semibold">{label}</span>
      </div>

      <p className="text-xs sm:text-sm font-bold text-slate-800 break-words">
        {value ?? "N/A"}
      </p>
    </div>
  );
}

function ContributionCard({ item, maxImpact }) {
  const isApproval = item.direction === "approval";
  const isRejection = item.direction === "rejection";

  const impactWidth =
    maxImpact > 0
      ? Math.max(
          3,
          (Math.abs(item.contribution) / maxImpact) * 100
        )
      : 0;

  return (
    <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-800">
            {formatFeatureName(item.feature)}
          </p>

          <p className="text-[10px] text-slate-400 mt-1">
            Value: {formatFeatureValue(item.feature, item.value)}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p
            className={`text-xs font-black ${
              isApproval
                ? "text-emerald-600"
                : isRejection
                ? "text-rose-600"
                : "text-slate-500"
            }`}
          >
            {item.contribution > 0 ? "+" : ""}
            {Number(item.contribution).toFixed(4)}
          </p>

          <p className="text-[9px] text-slate-400 mt-1">
            {getImpactDescription(item.direction)}
          </p>
        </div>
      </div>

      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${
            isApproval
              ? "bg-emerald-500"
              : isRejection
              ? "bg-rose-500"
              : "bg-slate-400"
          }`}
          style={{ width: `${impactWidth}%` }}
        />
      </div>
    </div>
  );
}

export function PredictionResult() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  const [prediction, setPrediction] = useState(
    location.state?.prediction || null
  );

  const [loading, setLoading] = useState(!prediction);
  const [error, setError] = useState(null);

  const [explanation, setExplanation] = useState(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationError, setExplanationError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const resultTopRef = useRef(null);

  useEffect(() => {
    async function fetchResult() {
      if (prediction) return;

      try {
        setLoading(true);

        const res = await predictionApi.getById(id);

        if (res.success && res.prediction) {
          setPrediction(res.prediction);
        }
      } catch (err) {
        setError(
          err.message || "Failed to load prediction details."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [id, prediction]);

  useEffect(() => {
    if (!loading && prediction && resultTopRef.current) {
      requestAnimationFrame(() => {
        resultTopRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [loading, prediction]);

  async function handleGetExplanation() {
    try {
      setExplanationLoading(true);
      setExplanationError(null);

      const response = await predictionApi.getExplanation(id);

      if (response.success && response.explanation) {
        setExplanation(response.explanation);
      } else {
        throw new Error(
          "Unable to generate prediction explanation."
        );
      }
    } catch (err) {
      setExplanationError(
        err.message ||
          "Failed to generate explanation. Please try again."
      );
    } finally {
      setExplanationLoading(false);
    }
  }

  // PDF REPORT GENERATION WITH AI IMPROVEMENT PLAN
  async function handleDownloadReport() {
    if (!prediction || pdfLoading) return;

    try {
      setPdfLoading(true);

      // STEP 1: Automatically generate/fetch AI Improvement Plan
      let improvementPlan = null;
      let improvementPlanError = null;

      try {
        const improvementResponse =
          await improvementApi.getSuggestions(
            prediction._id || id
          );

        if (
          improvementResponse?.success &&
          improvementResponse?.improvementPlan
        ) {
          improvementPlan = improvementResponse.improvementPlan;
        } else {
          throw new Error(
            "AI Improvement Plan was not returned by the server."
          );
        }
      } catch (aiError) {
        console.error(
          "AI Improvement Plan PDF error:",
          aiError
        );

        improvementPlanError =
          aiError.message ||
          "AI Improvement Plan could not be generated.";
      }

      // STEP 2: Create PDF
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;

      const isApproved = prediction.decision === "Approved";

      const approvalPercent = Math.round(
        Number(prediction.approvalProbability || 0) * 100
      );

      const rejectionPercent = Math.round(
        Number(prediction.rejectionProbability || 0) * 100
      );

      const features = prediction.inputFeatures || {};
      const contributions = explanation?.contributions || [];
      const topFactors = explanation?.top_factors || [];

      const applicantName =
        prediction.userId?.name || user?.name || "Not available";

      const applicantEmail =
        prediction.userId?.email || user?.email || "Not available";

      const reportDate = new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      const predictionDate = prediction.createdAt
        ? new Date(prediction.createdAt).toLocaleDateString("en-IN")
        : "Not available";

      const reportId = String(prediction._id || id || "N/A");

      const colors = {
        navy: [15, 23, 42],
        blue: [37, 99, 235],
        lightBlue: [239, 246, 255],
        slate: [71, 85, 105],
        muted: [100, 116, 139],
        border: [226, 232, 240],
        green: [5, 150, 105],
        lightGreen: [236, 253, 245],
        red: [225, 29, 72],
        lightRed: [255, 241, 242],
        white: [255, 255, 255],
        amber: [217, 119, 6],
        lightAmber: [255, 251, 235],
      };

      const addSectionTitle = (title, y) => {
        doc.setFillColor(...colors.lightBlue);
        doc.roundedRect(
          margin,
          y,
          contentWidth,
          9,
          2,
          2,
          "F"
        );

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...colors.navy);
        doc.text(title, margin + 4, y + 6);

        return y + 14;
      };

      const drawTable = (options) => {
        autoTable(doc, {
          margin: {
            left: margin,
            right: margin,
            bottom: 20,
          },
          theme: "grid",
          styles: {
            font: "helvetica",
            fontSize: 8,
            cellPadding: 3,
            textColor: colors.navy,
            lineColor: colors.border,
            lineWidth: 0.2,
            overflow: "linebreak",
          },
          headStyles: {
            fillColor: colors.navy,
            textColor: colors.white,
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252],
          },
          ...options,
        });
      };

      // HEADER
      doc.setFillColor(...colors.navy);
      doc.rect(0, 0, pageWidth, 49, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(25);
      doc.setTextColor(...colors.white);
      doc.text("LoanX", margin, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(203, 213, 225);
      doc.text(
        "AI-POWERED LOAN ASSESSMENT PLATFORM",
        margin,
        27
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.setTextColor(...colors.white);
      doc.text("LOAN ASSESSMENT REPORT", margin, 40);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(203, 213, 225);

      doc.text(
        `Generated: ${reportDate}`,
        pageWidth - margin,
        18,
        { align: "right" }
      );

      doc.text(
        `Report ID: ${reportId.slice(-16)}`,
        pageWidth - margin,
        25,
        { align: "right" }
      );

      let y = 60;

      // 01 PREDICTION SUMMARY
      y = addSectionTitle("01  |  PREDICTION SUMMARY", y);

      const verdictColor = isApproved
        ? colors.green
        : colors.red;

      const verdictBg = isApproved
        ? colors.lightGreen
        : colors.lightRed;

      doc.setFillColor(...verdictBg);
      doc.roundedRect(
        margin,
        y,
        contentWidth,
        31,
        3,
        3,
        "F"
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(...verdictColor);

      doc.text(
        `MODEL VERDICT: ${String(
          prediction.decision || "N/A"
        ).toUpperCase()}`,
        margin + 6,
        y + 11
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...colors.slate);

      doc.text(
        isApproved
          ? "The model indicates a higher likelihood of loan approval."
          : "The model indicates a higher likelihood of loan rejection.",
        margin + 6,
        y + 20
      );

      y += 39;

      const cardGap = 5;
      const cardWidth = (contentWidth - cardGap) / 2;

      doc.setFillColor(239, 246, 255);
      doc.roundedRect(
        margin,
        y,
        cardWidth,
        25,
        2,
        2,
        "F"
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...colors.slate);
      doc.text(
        "APPROVAL PROBABILITY",
        margin + 5,
        y + 8
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(17);
      doc.setTextColor(...colors.blue);
      doc.text(`${approvalPercent}%`, margin + 5, y + 19);

      const secondCardX = margin + cardWidth + cardGap;

      doc.setFillColor(255, 241, 242);
      doc.roundedRect(
        secondCardX,
        y,
        cardWidth,
        25,
        2,
        2,
        "F"
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...colors.slate);
      doc.text(
        "REJECTION PROBABILITY",
        secondCardX + 5,
        y + 8
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(17);
      doc.setTextColor(...colors.red);
      doc.text(
        `${rejectionPercent}%`,
        secondCardX + 5,
        y + 19
      );

      y += 34;

      // 02 APPLICANT INFORMATION
      y = addSectionTitle(
        "02  |  APPLICANT & REPORT INFORMATION",
        y
      );

      drawTable({
        startY: y,
        head: [["Field", "Details"]],
        body: [
          ["Applicant Name", applicantName],
          ["Applicant Email", applicantEmail],
          ["Prediction ID", reportId],
          ["Prediction Date", predictionDate],
          ["Report Generated", reportDate],
          ["Model Decision", prediction.decision || "N/A"],
          ["Approval Probability", `${approvalPercent}%`],
          ["Rejection Probability", `${rejectionPercent}%`],
        ],
        columnStyles: {
          0: { cellWidth: 60, fontStyle: "bold" },
        },
      });

      y = doc.lastAutoTable.finalY + 10;

      if (y > pageHeight - 45) {
        doc.addPage();
        y = 20;
      }

      // 03 APPLICATION DETAILS
      y = addSectionTitle("03  |  APPLICATION DETAILS", y);

      const featureRows = Object.entries(features)
        .filter(
          ([key]) =>
            !["Age", "Gender"].includes(key)
        )
        .map(([key, value]) => [
          formatFeatureName(key),
          formatFeatureValue(key, value),
        ]);

      if (featureRows.length) {
        drawTable({
          startY: y,
          head: [
            ["Application Parameter", "Submitted Value"],
          ],
          body: featureRows,
          columnStyles: {
            0: { cellWidth: 75, fontStyle: "bold" },
          },
        });

        y = doc.lastAutoTable.finalY + 10;
      }

      if (y > pageHeight - 50) {
        doc.addPage();
        y = 20;
      }

      // 04 EXPLAINABLE AI
      y = addSectionTitle(
        "04  |  EXPLAINABLE AI INSIGHTS",
        y
      );

      if (explanation) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...colors.slate);

        const intro = doc.splitTextToSize(
          "The following insights describe how individual input features influenced the machine learning model's prediction.",
          contentWidth
        );

        doc.text(intro, margin, y);
        y += intro.length * 4 + 5;

        if (topFactors.length) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(...colors.navy);
          doc.text("Top Influential Factors", margin, y);
          y += 4;

          drawTable({
            startY: y,
            head: [
              [
                "Feature",
                "Impact Direction",
                "Contribution",
              ],
            ],
            body: topFactors.map((item) => [
              formatFeatureName(item.feature),
              getImpactDescription(item.direction),
              Number(item.contribution).toFixed(4),
            ]),
          });

          y = doc.lastAutoTable.finalY + 9;
        }

        if (contributions.length) {
          if (y > pageHeight - 50) {
            doc.addPage();
            y = 20;
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(...colors.navy);
          doc.text("Feature Contributions", margin, y);
          y += 4;

          drawTable({
            startY: y,
            head: [
              [
                "Feature",
                "Submitted Value",
                "Impact",
                "Contribution",
              ],
            ],
            body: contributions.map((item) => [
              formatFeatureName(item.feature),
              formatFeatureValue(item.feature, item.value),
              getImpactDescription(item.direction),
              Number(item.contribution).toFixed(4),
            ]),
          });

          y = doc.lastAutoTable.finalY + 9;
        }

        if (y > pageHeight - 40) {
          doc.addPage();
          y = 20;
        }

        doc.setFillColor(...colors.lightBlue);
        doc.roundedRect(
          margin,
          y,
          contentWidth,
          27,
          2,
          2,
          "F"
        );

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...colors.navy);
        doc.text(
          "Understanding SHAP Contributions",
          margin + 4,
          y + 6
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(...colors.slate);

        const shapNote = doc.splitTextToSize(
          "Positive contributions push the model toward approval, while negative contributions push it toward rejection. These values are raw log-odds contributions, not probability percentages. They explain model behavior and do not establish causation.",
          contentWidth - 8
        );

        doc.text(shapNote, margin + 4, y + 12);
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...colors.muted);

        doc.text(
          "SHAP explanation was not generated when this report was downloaded.",
          margin,
          y + 3
        );
      }

      // 05 AI IMPROVEMENT PLAN
      // Start on a fresh page for a clean report layout.
      doc.addPage();
      y = 20;

      y = addSectionTitle(
        "05  |  AI-POWERED LOAN IMPROVEMENT PLAN",
        y
      );

      if (
        improvementPlan &&
        Array.isArray(improvementPlan.suggestions) &&
        improvementPlan.suggestions.length > 0
      ) {
        // AI PLAN SUMMARY
        doc.setFillColor(...colors.lightBlue);
        doc.roundedRect(
          margin,
          y,
          contentWidth,
          30,
          2,
          2,
          "F"
        );

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...colors.navy);
        doc.text("AI ANALYSIS SUMMARY", margin + 4, y + 7);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...colors.slate);

        const summaryLines = doc.splitTextToSize(
          String(
            improvementPlan.summary ||
              "AI-generated improvement recommendations based on your application."
          ),
          contentWidth - 8
        );

        doc.text(
          summaryLines.slice(0, 4),
          margin + 4,
          y + 14
        );

        y += 38;

        // SUGGESTION TABLE
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...colors.navy);
        doc.text("RECOMMENDED ACTIONS", margin, y);

        y += 5;

        const suggestionRows =
          improvementPlan.suggestions
            .slice(0, 3)
            .map((suggestion, index) => [
              `#${index + 1}`,
              String(suggestion.priority || "Medium"),
              String(suggestion.title || "Improvement Suggestion"),
              String(suggestion.reason || "No reason provided."),
              String(suggestion.action || "No action provided."),
              String(suggestion.relatedFactor || "General"),
            ]);

        drawTable({
          startY: y,
          head: [[
            "No.",
            "Priority",
            "Suggestion",
            "Why It Matters",
            "Recommended Action",
            "Related Factor",
          ]],
          body: suggestionRows,
          styles: {
            font: "helvetica",
            fontSize: 7,
            cellPadding: 2.5,
            overflow: "linebreak",
            valign: "top",
          },
          headStyles: {
            fillColor: colors.navy,
            textColor: colors.white,
            fontStyle: "bold",
            fontSize: 7,
          },
          columnStyles: {
            0: { cellWidth: 8 },
            1: { cellWidth: 17 },
            2: { cellWidth: 30 },
            3: { cellWidth: 38 },
            4: { cellWidth: 48 },
            5: { cellWidth: 34 },
          },
        });

        y = doc.lastAutoTable.finalY + 12;

        // PRIORITY LEGEND
        if (y > pageHeight - 48) {
          doc.addPage();
          y = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...colors.navy);
        doc.text("PRIORITY GUIDE", margin, y);

        y += 6;

        const priorityItems = [
          {
            label: "HIGH",
            description: "Requires attention first",
            color: colors.red,
          },
          {
            label: "MEDIUM",
            description: "Consider improving",
            color: colors.amber,
          },
          {
            label: "LOW",
            description: "Long-term improvement",
            color: colors.green,
          },
        ];

        let priorityX = margin;

        priorityItems.forEach((item) => {
          doc.setFillColor(...item.color);
          doc.roundedRect(
            priorityX,
            y,
            19,
            7,
            1.5,
            1.5,
            "F"
          );

          doc.setFont("helvetica", "bold");
          doc.setFontSize(6.5);
          doc.setTextColor(...colors.white);
          doc.text(item.label, priorityX + 2, y + 4.7);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(6.5);
          doc.setTextColor(...colors.slate);
          doc.text(item.description, priorityX + 22, y + 4.7);

          priorityX += 62;
        });

        y += 17;

        // AI DISCLAIMER
        if (y > pageHeight - 35) {
          doc.addPage();
          y = 20;
        }

        doc.setFillColor(...colors.lightAmber);
        doc.roundedRect(
          margin,
          y,
          contentWidth,
          23,
          2,
          2,
          "F"
        );

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...colors.amber);
        doc.text(
          "IMPORTANT: AI-GENERATED GUIDANCE",
          margin + 4,
          y + 6
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(...colors.slate);

        const aiDisclaimerLines = doc.splitTextToSize(
          "These recommendations are generated using AI and your application insights. They are suggestions, not guarantees of loan approval. Only make financial decisions after verifying your circumstances and consulting an appropriate financial professional where necessary.",
          contentWidth - 8
        );

        doc.text(
          aiDisclaimerLines,
          margin + 4,
          y + 12
        );
      } else {
        // PLAN NOT AVAILABLE
        doc.setFillColor(...colors.lightAmber);
        doc.roundedRect(
          margin,
          y,
          contentWidth,
          30,
          2,
          2,
          "F"
        );

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...colors.amber);

        doc.text(
          "AI Improvement Plan Unavailable",
          margin + 5,
          y + 9
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...colors.slate);

        const unavailableMessage = doc.splitTextToSize(
          improvementPlanError ||
            "The AI improvement plan could not be generated for this report. Please try downloading the report again later.",
          contentWidth - 10
        );

        doc.text(
          unavailableMessage,
          margin + 5,
          y + 17
        );
      }

      // FINAL DISCLAIMER PAGE
      doc.addPage();
      y = 20;

      y = addSectionTitle(
        "IMPORTANT INFORMATION & DISCLAIMER",
        y
      );

      const disclaimer =
        prediction.disclaimer ||
        "This prediction is an automated statistical estimate generated by a machine learning model and does not constitute a guaranteed loan sanction or credit decision by a financial institution.";

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...colors.slate);

      const disclaimerLines = doc.splitTextToSize(
        disclaimer,
        contentWidth
      );

      doc.text(disclaimerLines, margin, y + 2);

      y += disclaimerLines.length * 5 + 12;

      const additionalNotice =
        "This report is generated for informational and demonstration purposes. The model's output is not a loan offer, financial advice, or a substitute for a lender's independent verification and underwriting process. Actual loan approval depends on the lender's policies, eligibility checks, documentation, and other factors.";

      const noticeLines = doc.splitTextToSize(
        additionalNotice,
        contentWidth
      );

      doc.text(noticeLines, margin, y);

      y += noticeLines.length * 5 + 15;

      doc.setDrawColor(...colors.border);
      doc.line(
        margin,
        y,
        pageWidth - margin,
        y
      );

      y += 10;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...colors.navy);
      doc.text("LoanX", margin, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...colors.muted);
      doc.text(
        "AI-Powered Loan Assessment Platform",
        margin,
        y + 6
      );

      // PAGE NUMBERS
      const totalPages = doc.internal.getNumberOfPages();

      for (let page = 1; page <= totalPages; page++) {
        doc.setPage(page);

        doc.setDrawColor(...colors.border);
        doc.line(
          margin,
          pageHeight - 13,
          pageWidth - margin,
          pageHeight - 13
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...colors.muted);

        doc.text(
          "LoanX | AI-Powered Loan Assessment",
          margin,
          pageHeight - 8
        );

        doc.text(
          `Page ${page} of ${totalPages}`,
          pageWidth - margin,
          pageHeight - 8,
          { align: "right" }
        );
      }

      const safeId = reportId
        .slice(-8)
        .replace(/[^a-zA-Z0-9]/g, "");

      doc.save(
        `LoanX_Loan_Report_${safeId || "Report"}.pdf`
      );
    } catch (err) {
      console.error("PDF generation error:", err);

      alert(
        "Unable to generate the PDF report. Please try again."
      );
    } finally {
      setPdfLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <LoadingSpinner text="Retrieving prediction outcome..." />
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          Prediction Not Found
        </h2>

        <p className="text-xs text-slate-500">
          {error || "Unable to retrieve this record."}
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isApproved = prediction.decision === "Approved";

  const approvalPercent = Math.round(
    Number(prediction.approvalProbability || 0) * 100
  );

  const rejectionPercent = Math.round(
    Number(prediction.rejectionProbability || 0) * 100
  );

  const features = prediction.inputFeatures || {};
  const contributions = explanation?.contributions || [];
  const topFactors = explanation?.top_factors || [];

  const approvalFactors = contributions.filter(
    (item) => item.direction === "approval"
  );

  const rejectionFactors = contributions.filter(
    (item) => item.direction === "rejection"
  );

  const maxImpact = Math.max(
    0,
    ...contributions.map((item) =>
      Math.abs(item.contribution)
    )
  );

  const applicationDetails = [
    {
      label: "Loan Amount",
      value: formatFeatureValue(
        "Loan_Amount",
        features.Loan_Amount
      ),
      icon: Wallet,
    },
    {
      label: "Loan Term",
      value: formatFeatureValue(
        "Loan_Term",
        features.Loan_Term
      ),
      icon: Clock3,
    },
    {
      label: "Credit Score",
      value: features.Credit_Score ?? "N/A",
      icon: Gauge,
    },
    {
      label: "DTI Ratio",
      value: formatFeatureValue(
        "DTI_Ratio",
        features.DTI_Ratio
      ),
      icon: CreditCard,
    },
    {
      label: "Applicant Income",
      value: formatFeatureValue(
        "Applicant_Income",
        features.Applicant_Income
      ),
      icon: CircleDollarSign,
    },
    {
      label: "Co-applicant Income",
      value: formatFeatureValue(
        "Coapplicant_Income",
        features.Coapplicant_Income
      ),
      icon: CircleDollarSign,
    },
    {
      label: "Collateral Value",
      value: formatFeatureValue(
        "Collateral_Value",
        features.Collateral_Value
      ),
      icon: Building2,
    },
    {
      label: "Savings",
      value: formatFeatureValue(
        "Savings",
        features.Savings
      ),
      icon: Wallet,
    },
    {
      label: "Employment",
      value: features.Employment_Status || "N/A",
      icon: BriefcaseBusiness,
    },
    {
      label: "Employer Category",
      value: features.Employer_Category || "N/A",
      icon: Building2,
    },
    {
      label: "Loan Purpose",
      value: features.Loan_Purpose || "N/A",
      icon: FileText,
    },
    {
      label: "Property Area",
      value: features.Property_Area || "N/A",
      icon: Building2,
    },
  ];

  return (
    <div
      ref={resultTopRef}
      className="max-w-[1500px] mx-auto px-4 sm:px-6 xl:px-8 py-7 sm:py-9 space-y-6"
    >
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Prediction Overview
          </h1>

          <p className="text-xs text-slate-400">
            Review your loan assessment, model insights and AI recommendations.
          </p>
        </div>

        <span className="text-[10px] font-mono text-slate-400">
          ID: {prediction._id}
        </span>
      </div>

      {/* TWO COLUMN DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-5 space-y-6">

          {/* VERDICT CARD */}
          <section
            className={`relative overflow-hidden rounded-3xl border shadow-sm ${
              isApproved
                ? "bg-gradient-to-br from-white via-emerald-50/50 to-emerald-100/60 border-emerald-200"
                : "bg-gradient-to-br from-white via-rose-50/50 to-rose-100/60 border-rose-200"
            }`}
          >
            <div className="absolute -right-14 -top-14 w-48 h-48 rounded-full bg-white/50 blur-3xl" />

            <div className="relative p-6 sm:p-7 space-y-6">
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isApproved
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {isApproved ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <ShieldAlert className="w-3.5 h-3.5" />
                  )}
                  {prediction.decision}
                </span>

                <span className="text-[10px] font-semibold text-slate-400">
                  MODEL VERDICT
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center shadow-sm ${
                    isApproved
                      ? "bg-emerald-500 text-white"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {isApproved ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : (
                    <ShieldAlert className="w-8 h-8" />
                  )}
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    {isApproved
                      ? "High Approval Probability"
                      : "Higher Rejection Risk"}
                  </h2>

                  <p className="text-[11px] text-slate-500 mt-1">
                    Based on your submitted application data
                  </p>
                </div>
              </div>

              <div className="bg-white/80 border border-white rounded-2xl p-4">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Approval Probability
                    </p>

                    <p
                      className={`text-4xl sm:text-5xl font-black tracking-tight mt-1 ${
                        isApproved
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {approvalPercent}%
                    </p>
                  </div>

                  <div className="text-right pb-1">
                    <p className="text-[10px] font-semibold text-slate-400">
                      Rejection
                    </p>

                    <p className="text-xl font-black text-slate-700">
                      {rejectionPercent}%
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-2.5 bg-rose-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700"
                    style={{ width: `${approvalPercent}%` }}
                  />
                </div>

                <div className="flex justify-between mt-2 text-[9px] font-semibold text-slate-400">
                  <span>Rejection</span>
                  <span>Approval</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-xl bg-white/70 border border-white/80">
                <Info className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />

                <p className="text-[10px] text-slate-600 leading-relaxed">
                  {prediction.disclaimer ||
                    "This is a machine learning estimate, not a guaranteed loan sanction or final lender decision."}
                </p>
              </div>

              {/* PDF BUTTON */}
              <div className="pt-2 border-t border-white/80">
                <button
                  type="button"
                  onClick={handleDownloadReport}
                  disabled={pdfLoading}
                  className="group w-full relative overflow-hidden flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-slate-900 hover:bg-blue-700 disabled:opacity-60 text-white shadow-lg shadow-slate-900/15 transition-all duration-300"
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-600/0 via-blue-500/20 to-blue-600/0 transition-opacity" />

                  <span className="relative w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    {pdfLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                  </span>

                  <span className="relative flex-1 text-left">
                    <span className="block text-sm font-extrabold">
                      {pdfLoading
                        ? "Generating Your Report..."
                        : "Download Loan Report"}
                    </span>

                    <span className="block text-[10px] text-slate-300 mt-1">
                      {pdfLoading
                        ? "Generating AI recommendations and preparing PDF..."
                        : "Includes AI insights and improvement recommendations"}
                    </span>
                  </span>

                  {!pdfLoading && (
                    <FileText className="relative w-5 h-5 text-blue-200" />
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* APPLICATION DETAILS */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100">
              <SectionHeading
                icon={FileText}
                title="Application Details"
                subtitle="Key information from your submitted application"
              />
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-2 gap-3">
                {applicationDetails.map((item) => (
                  <DetailItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-[10px] text-slate-400">
                  Additional application parameters
                </span>

                <span className="text-[10px] font-bold text-blue-600">
                  18 model features
                </span>
              </div>
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="grid grid-cols-2 gap-3">
            <Link
              to="/history"
              className="group flex items-center justify-center gap-2 p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
            >
              <History className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />

              <span className="text-[11px] font-bold text-slate-700">
                History
              </span>
            </Link>

            <Link
              to="/new-prediction"
              className="group flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-900 hover:bg-blue-700 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-white" />

              <span className="text-[11px] font-bold text-white">
                New Prediction
              </span>
            </Link>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-7 space-y-6">

          {/* EXPLAINABLE AI */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <SectionHeading
                  icon={Sparkles}
                  title="Explainable AI Analysis"
                  subtitle="Understand what influenced your prediction"
                  color="violet"
                />

                <button
                  type="button"
                  onClick={handleGetExplanation}
                  disabled={explanationLoading}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-[11px] font-bold shadow-sm transition-all"
                >
                  {explanationLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : explanation ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      Refresh
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Explain Result
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {explanationError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{explanationError}</span>
                </div>
              )}

              {!explanation && !explanationLoading && (
                <div className="py-9 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-50 text-violet-500 flex items-center justify-center">
                    <Sparkles className="w-7 h-7" />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-800">
                    Understand your prediction
                  </h3>

                  <p className="max-w-sm mx-auto mt-2 text-[11px] text-slate-400 leading-relaxed">
                    Generate SHAP-based insights to identify which features
                    supported approval and which pushed the model toward
                    rejection.
                  </p>
                </div>
              )}

              {explanationLoading && !explanation && (
                <div className="py-10 flex flex-col items-center gap-3">
                  <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />

                  <p className="text-xs text-slate-500">
                    Analyzing your loan application...
                  </p>
                </div>
              )}

              {explanation && (
                <>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xs font-black text-slate-800">
                        Top 5 Influential Factors
                      </h3>

                      <p className="text-[10px] text-slate-400 mt-1">
                        Features with the greatest individual impact
                      </p>
                    </div>

                    {topFactors.length > 0 ? (
                      <div className="space-y-2">
                        {topFactors.map((item, index) => (
                          <div
                            key={item.feature}
                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                          >
                            <div className="w-7 h-7 shrink-0 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                              {index + 1}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold text-slate-800">
                                {formatFeatureName(item.feature)}
                              </p>

                              <p className="text-[9px] text-slate-400 mt-0.5">
                                {getImpactDescription(item.direction)}
                              </p>
                            </div>

                            <span
                              className={`text-[11px] font-black ${
                                item.direction === "approval"
                                  ? "text-emerald-600"
                                  : item.direction === "rejection"
                                  ? "text-rose-600"
                                  : "text-slate-500"
                              }`}
                            >
                              {item.contribution > 0 ? "+" : ""}
                              {Number(item.contribution).toFixed(3)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">
                        No influential factors were returned.
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />

                        <h3 className="text-xs font-black text-slate-800">
                          Supporting Approval
                        </h3>
                      </div>

                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        {approvalFactors.length} factors
                      </span>
                    </div>

                    {approvalFactors.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {approvalFactors.map((item) => (
                          <ContributionCard
                            key={item.feature}
                            item={item}
                            maxImpact={maxImpact}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400">
                        No approval-supporting factors were identified.
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-rose-600" />

                        <h3 className="text-xs font-black text-slate-800">
                          Rejection-Driving Factors
                        </h3>
                      </div>

                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
                        {rejectionFactors.length} factors
                      </span>
                    </div>

                    {rejectionFactors.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {rejectionFactors.map((item) => (
                          <ContributionCard
                            key={item.feature}
                            item={item}
                            maxImpact={maxImpact}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400">
                        No rejection-driving factors were identified.
                      </p>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-2">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Info className="w-4 h-4" />

                      <p className="text-xs font-bold">
                        Understanding SHAP Values
                      </p>
                    </div>

                    <p className="text-[10px] text-blue-800/80 leading-relaxed">
                      {explanation.disclaimer}
                    </p>

                    <p className="text-[10px] text-blue-800/80 leading-relaxed">
                      Positive contributions push the model toward approval;
                      negative contributions push it toward rejection. These
                      are raw log-odds contributions, not probability
                      percentages, and do not establish causation.
                    </p>

                    <p className="text-[9px] text-blue-700/70">
                      Method: {explanation.explanation_type} · Model:{" "}
                      {explanation.model_version}
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* AI LOAN IMPROVEMENT SUGGESTIONS */}
          <AIImprovementSuggestions
            predictionId={prediction._id || id}
          />

          {/* AI LOAN ADVISOR */}
          <AIAdvisorChat
            predictionId={prediction._id || id}
          />
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-slate-200">
        <p className="text-[10px] text-slate-400">
          LoanX · AI-Powered Loan Assessment Platform
        </p>

        <div className="flex items-center gap-3">
          <Link
            to="/history"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-600 transition-all"
          >
            <History className="w-4 h-4" />
            Prediction History
          </Link>

          <Link
            to="/new-prediction"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-[11px] font-bold text-white shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            New Prediction
          </Link>
        </div>
      </div>
    </div>
  );
}
