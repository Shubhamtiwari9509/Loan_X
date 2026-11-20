
import React from "react";
import {
  ExternalLink,
  Layers,
  Sparkles,
  Table2,
  ShieldCheck,
  BrainCircuit,
  FileText,
  MessageCircle,
  Lightbulb,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Info,
  Download,
  Activity,
  Users,
  History,
  Target,
  Gauge,
  Landmark,
} from "lucide-react";

const numericFeatures = [
  { name: "Applicant_Income", desc: "Monthly or periodic income of the primary applicant (₹)" },
  { name: "Coapplicant_Income", desc: "Co-borrower's income supplementing repayment capacity (₹)" },
  { name: "Age", desc: "Age of the applicant in years" },
  { name: "Dependents", desc: "Number of financially dependent family members" },
  { name: "Credit_Score", desc: "Credit bureau rating score (standard range: 300–900)" },
  { name: "Existing_Loans", desc: "Active credit lines or outstanding debts" },
  { name: "DTI_Ratio", desc: "Debt-to-Income ratio" },
  { name: "Savings", desc: "Total liquid savings and emergency funds (₹)" },
  { name: "Collateral_Value", desc: "Estimated market value of pledged assets (₹)" },
  { name: "Loan_Amount", desc: "Requested principal loan amount (₹)" },
  { name: "Loan_Term", desc: "Loan duration expressed in months" },
];

const categoricalFeatures = [
  { name: "Employment_Status", options: "Contract, Salaried, Self-employed, Unemployed" },
  { name: "Marital_Status", options: "Married, Single" },
  { name: "Loan_Purpose", options: "Business, Car, Education, Home, Personal" },
  { name: "Property_Area", options: "Rural, Semiurban, Urban" },
  { name: "Education_Level", options: "Graduate, Not Graduate" },
  { name: "Gender", options: "Female, Male" },
  { name: "Employer_Category", options: "Business, Government, MNC, Private, Unemployed" },
];

const workflowSteps = [
  {
    number: "01",
    icon: LockKeyhole,
    title: "Register & Login",
    desc: "Create your account or sign in securely. LoanX provides role-based access for users and administrators.",
    tag: "Authentication",
  },
  {
    number: "02",
    icon: LayoutDashboard,
    title: "Explore Your Dashboard",
    desc: "View your prediction statistics, approval and rejection counts, approval rate and recent activity.",
    tag: "User Dashboard",
  },
  {
    number: "03",
    icon: FileText,
    title: "Submit Loan Application",
    desc: "Enter applicant income, credit score, employment details, loan amount and other required financial information.",
    tag: "Application",
  },
  {
    number: "04",
    icon: BrainCircuit,
    title: "Machine Learning Prediction",
    desc: "The trained XGBoost model evaluates the submitted application and generates a prediction result with an approval probability.",
    tag: "XGBoost",
  },
  {
    number: "05",
    icon: Gauge,
    title: "Understand Your Result",
    desc: "Explore the prediction summary and SHAP-based Explainable AI analysis to understand the factors influencing the model output.",
    tag: "Explainable AI",
  },
  {
    number: "06",
    icon: MessageCircle,
    title: "Chat with AI Loan Advisor",
    desc: "Ask questions about your saved prediction and receive AI-generated explanations based on the available application context.",
    tag: "Groq AI",
  },
  {
    number: "07",
    icon: Lightbulb,
    title: "Generate Improvement Plan",
    desc: "Get actionable AI-generated recommendations based on relevant financial details and model explanation factors.",
    tag: "AI Recommendations",
  },
  {
    number: "08",
    icon: Download,
    title: "Download Loan Report",
    desc: "Generate a PDF report containing your prediction summary, application details and available Explainable AI information.",
    tag: "PDF Report",
  },
];

const platformFeatures = [
  {
    icon: Activity,
    title: "Prediction Analytics",
    desc: "Track total predictions, approved applications, rejected applications and approval rate.",
  },
  {
    icon: History,
    title: "Prediction History",
    desc: "Review previously saved loan predictions and open individual prediction details.",
  },
  {
    icon: BrainCircuit,
    title: "SHAP Explainability",
    desc: "Explore the factors that influenced the machine learning prediction and their direction of impact.",
  },
  {
    icon: MessageCircle,
    title: "AI Loan Advisor",
    desc: "Ask questions about your prediction and receive contextual AI-powered responses.",
  },
  {
    icon: Target,
    title: "AI Improvement Plan",
    desc: "Generate practical suggestions to understand possible areas for financial improvement.",
  },
  {
    icon: FileText,
    title: "PDF Loan Report",
    desc: "Download a structured report of your loan prediction for future reference.",
  },
];

const adminFeatures = [
  "Monitor total platform predictions and approval statistics.",
  "Review approved and rejected prediction records.",
  "Explore registered user information.",
  "Access administrative analytics and prediction data.",
  "Monitor overall platform activity through the Admin Dashboard.",
];

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl space-y-2">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">
        {eyebrow}
      </p>
      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-navy-900">
        {title}
      </h2>
      {description && (
        <p className="text-sm leading-relaxed text-navy-500">
          {description}
        </p>
      )}
    </div>
  );
}

export function HowItWorks() {
  return (
    <div className="min-h-screen bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#101d3a] via-[#172d55] to-[#244b82] p-7 sm:p-10 lg:p-12 shadow-xl">
          <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute right-20 bottom-0 w-56 h-56 rounded-full bg-orange-400/10 blur-3xl" />

          <div className="relative max-w-3xl space-y-5">


            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              How <span className="text-blue-300">LoanX</span> Works
            </h1>

            <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed max-w-2xl">
              Discover how LoanX combines Machine Learning, Explainable AI
              and Generative AI to deliver an intelligent loan prediction
              and applicant assistance experience.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {["XGBoost ML", "SHAP Explainability", "Groq AI", "PDF Reports"].map(
                (item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-xs font-semibold text-white"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        {/* WORKFLOW */}
        <section className="space-y-7">
          <SectionHeading
            eyebrow="Platform Workflow"
            title="Your Journey with LoanX"
            description="Explore the complete workflow, from account registration to machine learning predictions and AI-powered recommendations."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-black tracking-widest text-brand-primary">
                          STEP {step.number}
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                          {step.tag}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-navy-900">
                        {step.title}
                      </h3>

                      <p className="text-xs sm:text-sm leading-relaxed text-navy-500">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {index !== workflowSteps.length - 1 && (
                    <div className="hidden md:block absolute -bottom-3 right-7 z-10">
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* MACHINE LEARNING */}
        <section className="space-y-7">
          <SectionHeading
            eyebrow="Machine Learning Transparency"
            title="How LoanX Evaluates Eligibility"
            description="LoanX processes applicant information through a trained machine learning pipeline with an XGBoost classifier to generate a loan prediction."
          />

          <div className="bg-gradient-to-r from-orange-50 via-white to-amber-50 p-6 rounded-2xl border border-orange-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-primary" />
                Check Your Official Credit Score
              </h3>
              <p className="text-xs text-navy-600 max-w-2xl leading-relaxed">
                Credit score is one of the inputs used by the prediction
                model. You can check your credit score through TransUnion CIBIL.
              </p>
            </div>

            <a
              href="https://www.cibil.com/freecreditscore"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-orange-50 border border-brand-primary/40 text-brand-primary text-xs font-bold rounded-xl shadow-sm transition-colors shrink-0"
            >
              Official CIBIL Bureau
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
              <div className="flex items-center gap-2.5 pb-4 mb-3 border-b border-slate-100">
                <Table2 className="w-5 h-5 text-brand-primary" />
                <h3 className="text-base font-bold text-navy-900">
                  11 Numerical Features
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {numericFeatures.map((item) => (
                  <div
                    key={item.name}
                    className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 text-xs"
                  >
                    <span className="font-mono font-bold text-navy-800">
                      {item.name}
                    </span>
                    <span className="text-navy-500 sm:text-right sm:max-w-[60%]">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
              <div className="flex items-center gap-2.5 pb-4 mb-3 border-b border-slate-100">
                <Layers className="w-5 h-5 text-brand-primary" />
                <h3 className="text-base font-bold text-navy-900">
                  7 Categorical Features
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {categoricalFeatures.map((item) => (
                  <div key={item.name} className="py-3 space-y-1.5 text-xs">
                    <div className="font-mono font-bold text-navy-800">
                      {item.name}
                    </div>
                    <div className="text-[11px] leading-relaxed text-navy-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                      {item.options}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-blue-900">
              LoanX uses 18 applicant input features: 11 numerical and
              7 categorical. The model processes these features in the
              format required for prediction.
            </p>
          </div>
        </section>

        {/* AI CAPABILITIES */}
        <section className="space-y-7">
          <SectionHeading
            eyebrow="Intelligent AI Capabilities"
            title="More Than Just a Loan Prediction"
            description="LoanX combines machine learning and Generative AI to help applicants understand their results and explore possible areas of improvement."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy-900 mb-2">
                Explainable AI with SHAP
              </h3>
              <p className="text-xs leading-relaxed text-navy-500">
                Understand which application features influenced the
                prediction and whether their contribution pushed the
                model output in a positive or negative direction.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy-900 mb-2">
                Groq-Powered AI Loan Advisor
              </h3>
              <p className="text-xs leading-relaxed text-navy-500">
                Ask questions about your saved prediction and receive
                contextual AI-generated explanations using the available
                application information.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy-900 mb-2">
                AI Loan Improvement Plan
              </h3>
              <p className="text-xs leading-relaxed text-navy-500">
                Generate actionable recommendations based on relevant
                financial details and model explanation factors.
              </p>
            </div>
          </div>
        </section>

        {/* PLATFORM FEATURES */}
        <section className="space-y-7">
          <SectionHeading
            eyebrow="Platform Experience"
            title="Explore LoanX Features"
            description="A unified workspace to manage applications, review predictions and access AI-powered assistance."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {platformFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="flex gap-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
                >
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-100 text-brand-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-navy-900">
                      {feature.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-navy-500">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PDF REPORT */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#142342] to-[#203e6b] rounded-3xl p-7 sm:p-9">
          <div className="absolute -right-10 -bottom-20 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                Downloadable Report
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Your Loan Report, All in One Place
              </h2>

              <p className="text-sm leading-relaxed text-blue-100/75">
                Download a structured PDF containing your prediction
                summary, applicant information and available Explainable
                AI analysis for future reference.
              </p>
            </div>

            <div className="shrink-0 w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
              <Download className="w-8 h-8 text-blue-200" />
            </div>
          </div>
        </section>

        {/* ADMIN DASHBOARD */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-navy-900">
                  Admin Dashboard
                </h2>
                <p className="text-xs text-navy-500">
                  Administrative platform management
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-navy-500">
              Authorized administrators can access a dedicated dashboard
              to monitor platform activity and review prediction-related data.
            </p>

            <div className="space-y-3">
              {adminFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-navy-600 leading-relaxed">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-navy-900">
                  User & Admin Access
                </h2>
                <p className="text-xs text-navy-500">
                  Role-based access control
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100">
                <h3 className="text-sm font-bold text-navy-900 mb-1">
                  User Account
                </h3>
                <p className="text-xs leading-relaxed text-navy-500">
                  Access personal dashboard, loan predictions, prediction
                  history, AI tools and downloadable reports.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100">
                <h3 className="text-sm font-bold text-navy-900 mb-1">
                  Admin Account
                </h3>
                <p className="text-xs leading-relaxed text-navy-500">
                  Access administrative analytics, user information and
                  platform-wide prediction management features.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-navy-500">
                  Administrative access is intended for authorized users.
                  Account permissions are enforced by the backend.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-amber-950">
                Important Information & Disclaimer
              </h3>
              <p className="text-xs leading-relaxed text-amber-900/80">
                LoanX is an educational and decision-support project.
                Machine learning predictions and AI-generated suggestions
                are informational outputs, not actual bank decisions,
                financial advice or guarantees of loan approval. Actual
                eligibility is determined by lenders based on their own
                policies, verification and assessment. AI recommendations
                may not always be accurate or suitable for every applicant.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER - MATCHING NAVBAR BRANDING */}
        <div className="pt-6 border-t border-slate-200 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-900 to-navy-700 flex items-center justify-center text-white shadow-sm border border-navy-700">
              <Landmark className="w-5 h-5" strokeWidth={2.2} />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-navy-900 leading-none">
                Loan<span className="text-brand-primary">X</span>
              </span>
              <span className="text-[10px] font-semibold text-navy-400 tracking-wider uppercase mt-0.5">
                AI Credit Intelligence
              </span>
            </div>
          </div>

          <p className="text-xs text-navy-400 mt-1">
            Intelligent Loan Prediction · Explainable AI · AI-Powered Guidance
          </p>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
