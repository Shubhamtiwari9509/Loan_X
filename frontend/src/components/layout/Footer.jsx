import React from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  ShieldCheck,
  Landmark,
  Mail,
  Phone,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">

          {/* Brand & Mission */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-900 to-navy-700 flex items-center justify-center text-white shadow-sm border border-navy-700">
                <Landmark className="w-5 h-5" strokeWidth={2.2} />
              </div>

              <span className="text-xl font-black text-navy-900 tracking-tight">
                Loan<span className="text-brand-primary">X</span>
              </span>
            </div>

            <p className="text-sm text-navy-500 max-w-md leading-relaxed mb-5">
              AI-driven loan eligibility estimation platform engineered
              with machine learning precision. Helping borrowers assess
              their loan prospects before applying with financial institutions.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-navy-600 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Safe & Secure &bull; Zero credit bureau enquiry hit
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-4">
              Platform
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-navy-500 hover:text-brand-primary transition-colors"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/how-it-works"
                  className="text-navy-500 hover:text-brand-primary transition-colors"
                >
                  How It Works
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="text-navy-500 hover:text-brand-primary transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/new-prediction"
                  className="text-navy-500 hover:text-brand-primary transition-colors"
                >
                  Check Eligibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Credit Resources */}
          <div>
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-4">
              Credit Resources
            </h4>

            <p className="text-xs text-navy-500 leading-relaxed mb-3">
              Know your score before applying. Access your official credit
              report directly:
            </p>

            <a
              href="https://www.cibil.com/freecreditscore"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:text-brand-hover hover:underline"
            >
              TransUnion CIBIL Bureau
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <p className="text-[11px] text-navy-400 mt-2">
              RBI-regulated Credit Information Company
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-4">
              Contact Us
            </h4>

            <p className="text-xs text-navy-500 leading-relaxed mb-4">
              Have questions or feedback? Feel free to get in touch.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:shubhamtiwari9508@gmail.com"
                className="flex items-start gap-2.5 text-sm text-navy-500 hover:text-brand-primary transition-colors group"
              >
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-brand-primary" />
                <span className="break-all text-xs leading-relaxed">
                  shubhamtiwari9508@gmail.com
                </span>
              </a>

              <a
                href="tel:+919508612294"
                className="flex items-center gap-2.5 text-sm text-navy-500 hover:text-brand-primary transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0 text-brand-primary" />
                <span className="text-xs">
                  +91 9508612294
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="border-t border-slate-100 pt-6">
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200/70 mb-6">
            <p className="text-xs text-navy-500 leading-relaxed">
              <strong className="text-navy-700">
                Regulatory Disclaimer:
              </strong>{" "}
              LoanX provides automated machine learning estimations for
              informational purposes. Predictions and probability scores
              are computed using statistical models and do not guarantee
              or represent an official loan approval, sanction, or
              underwriting decision by any commercial bank or
              Non-Banking Financial Company (NBFC).
            </p>
          </div>

          {/* Copyright & Legal Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-navy-400 gap-4">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} LoanX Financial Technologies.
              All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <span className="hover:text-navy-600 transition-colors cursor-pointer">
                Privacy Policy
              </span>

              <span className="hover:text-navy-600 transition-colors cursor-pointer">
                Terms of Service
              </span>

              <span className="hover:text-navy-600 transition-colors cursor-pointer">
                Responsible AI Disclosure
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
