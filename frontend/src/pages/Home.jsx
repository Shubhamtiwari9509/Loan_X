import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart2,
  CheckCircle2,
  ChevronRight,
  Cpu,
  FileText,
  Lightbulb,
  Lock,
  MessageCircle,
  Percent,
  Shield,
  Landmark,
  BrainCircuit,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export function Home() {
  const { isAuthenticated } = useAuth();

  const predictionLink = isAuthenticated ? "/new-prediction" : "/register";

  const features = [
    {
      icon: Cpu,
      title: "XGBoost ML Prediction",
      description:
        "Analyze 18 financial and application features using a trained XGBoost model to estimate loan approval probability.",
      color: "orange",
    },
    {
      icon: BrainCircuit,
      title: "SHAP Explainable AI",
      description:
        "Understand which financial factors influence your prediction with feature-level explanations powered by SHAP.",
      color: "emerald",
    },
    {
      icon: MessageCircle,
      title: "Groq AI Loan Advisor",
      description:
        "Ask questions about your prediction and receive AI-generated guidance based on your saved application details.",
      color: "blue",
    },
    {
      icon: Lightbulb,
      title: "AI Improvement Plan",
      description:
        "Get practical, personalized suggestions to help improve your financial profile based on relevant prediction factors.",
      color: "purple",
    },
  ];

  const colorStyles = {
    orange: "bg-orange-50 border-orange-100 text-brand-primary",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    purple: "bg-purple-50 border-purple-100 text-purple-600",
  };

  return (
    <div className="space-y-12 sm:space-y-14 pb-10 sm:pb-14">
      {/* Hero Section */}
     <section className="relative overflow-hidden pt-5 sm:pt-8 lg:pt-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-5">


              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-navy-900 tracking-tight leading-[1.12]">
                Know Your Loan Approval Chances{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-amber-500">
                  Before Applying.
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-navy-600 max-w-xl leading-relaxed">
                LoanX combines Machine Learning, Explainable AI and Generative
                AI to help you understand your loan eligibility, explore
                prediction factors and get actionable financial guidance.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <Link
                  to={predictionLink}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <span>Check Eligibility Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-navy-800 text-sm font-semibold transition-colors"
                >
                  <span>Explore How It Works</span>
                  <ChevronRight className="w-4 h-4 text-navy-400" />
                </Link>
              </div>

              {/* Trust Highlights */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-5 border-t border-slate-200/80">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-navy-900">
                    18
                  </p>
                  <p className="text-[10px] sm:text-xs text-navy-500 font-medium">
                    Input Features
                  </p>
                </div>

                <div>
                  <p className="text-xl sm:text-2xl font-black text-brand-primary">
                    AI + ML
                  </p>
                  <p className="text-[10px] sm:text-xs text-navy-500 font-medium">
                    Intelligent Analysis
                  </p>
                </div>

                <div>
                  <p className="text-xl sm:text-2xl font-black text-emerald-600">
                    Secure
                  </p>
                  <p className="text-[10px] sm:text-xs text-navy-500 font-medium">
                    Account-Based Access
                  </p>
                </div>
              </div>
            </div>

            {/* Right Prediction Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-4 sm:p-6 space-y-4 relative">

                <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-navy-900">
                        Loan Prediction Result
                      </h4>
                      <p className="text-xs text-navy-400">
                        Illustrative Sample Response
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 shrink-0">
                    Approved
                  </span>
                </div>

                {/* Probability */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-orange-50/30 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="font-semibold text-navy-600">
                      Predicted Approval Probability
                    </span>
                    <span className="font-black text-brand-primary text-base">
                      94.2%
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-brand-primary to-emerald-500 h-full rounded-full"
                      style={{ width: "94.2%" }}
                    />
                  </div>

                  <p className="text-[11px] text-navy-400 leading-relaxed">
                    Example output generated from the model. Actual predictions
                    depend on the submitted application details.
                  </p>
                </div>

                {/* Applicant Details */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-navy-400 font-medium">Credit Score</p>
                    <p className="text-sm font-bold text-navy-900 mt-0.5">
                      780 / 900
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-navy-400 font-medium">DTI Ratio</p>
                    <p className="text-sm font-bold text-navy-900 mt-0.5">
                      22%
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-navy-400 font-medium">Loan Purpose</p>
                    <p className="text-sm font-bold text-navy-900 mt-0.5">
                      Home Loan
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-navy-400 font-medium">Loan Amount</p>
                    <p className="text-sm font-bold text-navy-900 mt-0.5">
                      &#8377; 25,00,000
                    </p>
                  </div>
                </div>

                <Link
                  to={predictionLink}
                  className="block text-center w-full py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-colors"
                >
                  Test Your Own Numbers &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-9">
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
            More Than Just Loan Prediction
          </h2>

          <p className="text-xs sm:text-sm text-navy-500 mt-2 leading-relaxed">
            An integrated platform combining Machine Learning, Explainable AI
            and Generative AI for transparent loan analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-3 ${
                    colorStyles[feature.color]
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-sm sm:text-base font-bold text-navy-900 mb-2">
                  {feature.title}
                </h3>

                <p className="text-xs text-navy-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Additional Platform Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-900 rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8">
          <div className="max-w-2xl mb-6">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              Complete Platform Experience
            </span>

            <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
              Everything You Need in One Place
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              From understanding predictions to managing applications, LoanX
              provides tools for both applicants and administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <BarChart2 className="w-5 h-5 text-orange-400 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  User & Admin Dashboards
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Role-based dashboards, application analytics and user
                  management.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <FileText className="w-5 h-5 text-orange-400 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Downloadable PDF Reports
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Download structured loan reports with prediction summaries
                  and available insights.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <Shield className="w-5 h-5 text-orange-400 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Secure Prediction History
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Authentication and account-based access to saved
                  applications and prediction records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white border-y border-slate-200 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
              Simple 3-Step Process
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight mt-1">
              How LoanX Works
            </h2>

            <p className="text-xs sm:text-sm text-navy-500 mt-2">
              A simple journey from application details to AI-powered insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="relative space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-brand-700 font-black text-sm flex items-center justify-center">
                1
              </div>

              <h4 className="text-base font-bold text-navy-900">
                Submit Your Application
              </h4>

              <p className="text-xs text-navy-500 leading-relaxed">
                Enter your financial, employment, credit score and loan
                requirement details through the application form.
              </p>
            </div>

            <div className="relative space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-brand-700 font-black text-sm flex items-center justify-center">
                2
              </div>

              <h4 className="text-base font-bold text-navy-900">
                ML Model Predicts
              </h4>

              <p className="text-xs text-navy-500 leading-relaxed">
                The Python FastAPI service processes application data through
                the trained XGBoost model and generates a prediction.
              </p>
            </div>

            <div className="relative space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-brand-700 font-black text-sm flex items-center justify-center">
                3
              </div>

              <h4 className="text-base font-bold text-navy-900">
                Explore AI Insights
              </h4>

              <p className="text-xs text-navy-500 leading-relaxed">
                Review SHAP explanations, get AI guidance and improvement
                suggestions, and download your PDF report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl sm:rounded-3xl px-5 py-8 sm:py-10">
          <div className="w-11 h-11 rounded-xl bg-white border border-orange-100 text-brand-primary flex items-center justify-center mx-auto mb-3">
  <Landmark className="w-5 h-5" strokeWidth={2.2} />
</div>

          <h2 className="text-xl sm:text-2xl font-black text-navy-900">
            Ready to Explore LoanX?
          </h2>

          <p className="text-xs sm:text-sm text-navy-500 max-w-xl mx-auto mt-2 leading-relaxed">
            Experience machine learning predictions, transparent explanations
            and AI-powered financial guidance in one platform.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-5">
            <Link
              to={predictionLink}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-sm font-bold transition-all shadow-md"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-navy-800 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Learn More
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
