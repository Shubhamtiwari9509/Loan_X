
import React from "react";
import {
  Compass,
  HeartHandshake,
  ShieldCheck,
  BrainCircuit,
  Cpu,
  Lightbulb,
  Database,
  FileText,
  Lock,
  Sparkles,
  MessageCircle,
  Target,
  ArrowUpRight,
  CheckCircle2,
  Activity,
  Layers3,
} from "lucide-react";

export function About() {
  const values = [
    {
      icon: Compass,
      title: "Pre-Application Clarity",
      description:
        "Understand your estimated loan eligibility before applying. LoanX analyzes financial and application details to provide an initial prediction.",
      color: "orange",
    },
    {
      icon: ShieldCheck,
      title: "Transparent AI Predictions",
      description:
        "XGBoost and SHAP explainability help users understand prediction results and the factors influencing individual outcomes.",
      color: "green",
    },
    {
      icon: HeartHandshake,
      title: "Responsible Financial Guidance",
      description:
        "AI-powered assistance and personalized improvement suggestions help users explore possible ways to strengthen their financial profile.",
      color: "blue",
    },
  ];

  const workflow = [
    {
      number: "01",
      icon: Target,
      title: "Predict",
      description:
        "Submit application details and get an estimated loan eligibility prediction.",
      color: "orange",
    },
    {
      number: "02",
      icon: BrainCircuit,
      title: "Understand",
      description:
        "Explore SHAP-based insights to understand the factors behind your result.",
      color: "green",
    },
    {
      number: "03",
      icon: Lightbulb,
      title: "Improve",
      description:
        "Get AI-generated suggestions and guidance based on your prediction.",
      color: "blue",
    },
  ];

  const technologies = [
    { name: "React.js", category: "Frontend" },
    { name: "Node.js", category: "Runtime" },
    { name: "Express.js", category: "Backend" },
    { name: "MongoDB", category: "Database" },
    { name: "Python", category: "ML Language" },
    { name: "FastAPI", category: "ML API" },
    { name: "XGBoost", category: "ML Model" },
    { name: "SHAP", category: "Explainability" },
    { name: "Groq API", category: "Generative AI" },
    { name: "Tailwind CSS", category: "Styling" },
  ];

  const capabilities = [
    {
      icon: Activity,
      title: "Prediction History",
      description:
        "Access previous predictions and review saved application results.",
    },
    {
      icon: FileText,
      title: "PDF Loan Reports",
      description:
        "Download reports containing prediction summaries, application details and available insights.",
    },
    {
      icon: Lock,
      title: "Role-Based Access",
      description:
        "Dedicated User and Admin experiences with authentication and protected routes.",
    },
    {
      icon: Database,
      title: "Admin Analytics",
      description:
        "Monitor prediction activity, approval trends and registered platform users.",
    },
  ];

  const colorStyles = {
    orange: {
      icon: "bg-orange-50 text-orange-600",
      number: "text-orange-500",
    },
    green: {
      icon: "bg-emerald-50 text-emerald-600",
      number: "text-emerald-600",
    },
    blue: {
      icon: "bg-blue-50 text-blue-600",
      number: "text-blue-600",
    },
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9 space-y-12 lg:space-y-14">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[28px] bg-navy-900 px-5 py-10 sm:px-9 sm:py-14 lg:px-14 lg:py-16">
        <div className="absolute -top-28 -right-20 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-[58px] font-black text-white tracking-tight leading-[1.12]">
            Making Loan Decisions
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-500">
              More Understandable.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed mt-5">
            An AI-powered loan prediction and explainability platform that
            brings Machine Learning, Explainable AI and Generative AI together
            to deliver meaningful financial insights.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mt-7">
            {["Machine Learning", "Explainable AI", "Generative AI"].map(
              (item) => (
                <span
                  key={item}
                  className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-xs font-semibold text-slate-200"
                >
                  {item}
                </span>
              )
            )}
          </div>

          <div className="mt-10 pt-7 border-t border-white/10 grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">
                18
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
                Application Features
              </p>
            </div>

            <div className="border-x border-white/10">
              <p className="text-2xl sm:text-3xl font-black text-white">
                ML
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
                XGBoost Prediction
              </p>
            </div>

            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">
                AI
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
                Personalized Guidance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-primary">
              The LoanX Experience
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-2">
              From Prediction to Guidance
            </h2>
          </div>

          <p className="text-sm text-navy-500 max-w-sm leading-relaxed">
            Three connected steps designed to make loan insights easier to understand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workflow.map((item, index) => {
            const Icon = item.icon;
            const style = colorStyles[item.color];

            return (
              <div
                key={item.number}
                className="relative bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-orange-200 hover:shadow-lg hover:shadow-slate-200/40 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.icon}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className={`text-sm font-black ${style.number}`}>
                    {item.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-navy-900 mt-5">
                  {item.title}
                </h3>

                <p className="text-sm text-navy-500 leading-relaxed mt-2">
                  {item.description}
                </p>

                {index !== 2 && (
                  <div className="hidden md:flex absolute -right-3 top-10 z-10 w-6 h-6 rounded-full bg-white border border-slate-200 items-center justify-center">
                    <ArrowUpRight className="w-3.5 h-3.5 text-navy-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* PURPOSE */}
      <section>
        <div className="max-w-2xl mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-primary">
            Why LoanX
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-2">
            Built Around Three Principles
          </h2>
          <p className="text-sm text-navy-500 mt-2 leading-relaxed">
            Our focus is on making loan prediction more informative,
            understandable and useful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {values.map((item) => {
            const Icon = item.icon;
            const style = colorStyles[item.color];

            return (
              <div
                key={item.title}
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${style.icon}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-base font-bold text-navy-900 mt-5">
                  {item.title}
                </h3>

                <p className="text-sm text-navy-500 leading-relaxed mt-2">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI ARCHITECTURE */}
      <section className="bg-navy-900 rounded-[26px] overflow-hidden">
        <div className="p-5 sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-widest">
              <Cpu className="w-4 h-4" />
              Under the Hood
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
              The Intelligence Behind LoanX
            </h2>

            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              Different AI technologies work together to generate predictions,
              explain model behaviour and provide contextual guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8">
            <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-5">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-orange-400/10 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-orange-400" />
                </div>
                <span className="text-[11px] text-slate-500 font-bold">
                  01
                </span>
              </div>

              <h3 className="text-base font-bold text-white mt-5">
                XGBoost
              </h3>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Processes application features through a trained Machine
                Learning model to estimate loan approval probability.
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-5">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-[11px] text-slate-500 font-bold">
                  02
                </span>
              </div>

              <h3 className="text-base font-bold text-white mt-5">
                SHAP Explainability
              </h3>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Shows how different application factors contribute to an
                individual model prediction.
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-5">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-blue-400/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-[11px] text-slate-500 font-bold">
                  03
                </span>
              </div>

              <h3 className="text-base font-bold text-white mt-5">
                Groq AI
              </h3>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Powers the AI Advisor and generates personalized improvement
                suggestions using relevant prediction context.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-white/10">
            <span className="text-xs text-slate-400 mr-1">
              Working together:
            </span>

            <span className="text-xs font-semibold text-white bg-white/10 rounded-lg px-3 py-1.5">
              Prediction
            </span>

            <ArrowUpRight className="w-3.5 h-3.5 text-orange-400" />

            <span className="text-xs font-semibold text-white bg-white/10 rounded-lg px-3 py-1.5">
              Explanation
            </span>

            <ArrowUpRight className="w-3.5 h-3.5 text-orange-400" />

            <span className="text-xs font-semibold text-white bg-white/10 rounded-lg px-3 py-1.5">
              Guidance
            </span>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY STACK */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-primary">
              Built With
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-2">
              Technology Stack
            </h2>
          </div>

          <p className="text-sm text-navy-500 max-w-sm">
            A combination of modern web technologies and AI tools.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-orange-200 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <Layers3 className="w-4 h-4 text-brand-primary" />
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>

              <p className="text-sm font-bold text-navy-900 mt-4 break-words">
                {tech.name}
              </p>

              <p className="text-[11px] text-navy-500 mt-1">
                {tech.category}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section>
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-primary">
            Platform Capabilities
          </p>

          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-2">
            More Than Just a Prediction
          </h2>

          <p className="text-sm text-navy-500 mt-2">
            A complete platform experience for users and administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {capabilities.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex gap-4 bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand-primary" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-navy-900">
                    {item.title}
                  </h3>

                  <p className="text-xs text-navy-500 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0 ml-auto" />
              </div>
            );
          })}
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-2xl p-4 sm:p-5">
        <ShieldCheck className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />

        <div>
          <h3 className="text-sm font-bold text-navy-900">
            Important Disclaimer
          </h3>

          <p className="text-xs text-navy-600 mt-2 leading-relaxed">
            LoanX is an educational and decision-support project. Its
            predictions are generated by a Machine Learning model and do not
            represent an actual bank decision, loan sanction or guarantee of
            approval. AI-generated suggestions are informational and should
            not replace professional financial advice.
          </p>
        </div>
      </section>

    </main>
  );
}
