import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  UserRound,
  Loader2,
  AlertCircle,
  MessageCircle,
} from "lucide-react";

import { aiAdvisorApi } from "../../api/client.js";

const suggestedQuestions = [
  "Why was my loan approved or rejected?",
  "Which factors affected my prediction the most?",
  "How can I improve my loan eligibility?",
  "Explain my prediction in simple words.",
];

export function AIAdvisorChat({ predictionId }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your LoanX AI Advisor. I have access to your loan prediction and its explanation. Ask me anything about your result, important financial factors, or ways to improve your loan eligibility.",
    },
  ]);

  const [conversationHistory, setConversationHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  async function handleSendQuestion(value = question) {
    const trimmedQuestion = value.trim();

    if (!trimmedQuestion || loading) return;

    if (trimmedQuestion.length > 1000) {
      setError("Your question cannot exceed 1000 characters.");
      return;
    }

    setError("");
    setQuestion("");

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: trimmedQuestion,
      },
    ]);

    try {
      const response = await aiAdvisorApi.ask(
        predictionId,
        trimmedQuestion,
        conversationHistory.slice(-8)
      );

      if (!response.success || !response.answer) {
        throw new Error(
          response.message || "Unable to get an AI response."
        );
      }

      const assistantMessage = {
        role: "assistant",
        content: response.answer,
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);

      setConversationHistory((previous) => [
        ...previous,
        {
          role: "user",
          content: trimmedQuestion,
        },
        assistantMessage,
      ]);
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleSendQuestion();
  }

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 p-6 sm:p-7">
        <div className="absolute -right-12 -top-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-20 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  LoanX AI Advisor
                </h2>

                <span className="px-2 py-1 rounded-full bg-emerald-400/15 border border-emerald-300/20 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                  AI Powered
                </span>
              </div>

              <p className="text-xs text-blue-200/80 mt-1">
                Your personal loan prediction assistant
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] font-semibold text-blue-100/80">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            Advisor ready
          </div>
        </div>

        <div className="relative mt-5 flex items-center gap-2 text-[11px] text-blue-100/80">
          <MessageCircle className="w-4 h-4" />
          <span>
            Ask questions about your actual saved prediction and SHAP insights.
          </span>
        </div>
      </div>

      {/* Chat Body */}
      <div className="p-4 sm:p-6">
        <div className="space-y-5 min-h-[260px] max-h-[480px] overflow-y-auto pr-1">
          {messages.map((message, index) => {
            const isUser = message.role === "user";

            return (
              <div
                key={`${message.role}-${index}`}
                className={`flex items-start gap-3 ${
                  isUser ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${
                    isUser
                      ? "bg-blue-600 text-white"
                      : "bg-violet-100 text-violet-700"
                  }`}
                >
                  {isUser ? (
                    <UserRound className="w-4 h-4" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    isUser
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-sm"
                  }`}
                >
                  <p className="text-xs leading-6 whitespace-pre-wrap break-words">
                    {message.content}
                  </p>

                  {!isUser && index === 0 && (
                    <div className="mt-3 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-violet-600">
                      <Sparkles className="w-3 h-3" />
                      LoanX AI Assistant
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 shrink-0 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
                  Analyzing your question...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-700 leading-5">
              {error}
            </p>
          </div>
        )}

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="mt-6 space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Suggested questions
            </p>

            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  disabled={loading}
                  onClick={() => handleSendQuestion(item)}
                  className="text-left px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 text-[11px] font-semibold text-slate-600 hover:text-blue-700 transition-all disabled:opacity-50"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 pt-5 border-t border-slate-100"
        >
          <div className="flex items-end gap-2 p-2 rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
            <textarea
              ref={inputRef}
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
                if (error) setError("");
              }}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  handleSubmit(event);
                }
              }}
              placeholder="Ask something about your loan prediction..."
              rows={1}
              maxLength={1000}
              disabled={loading}
              className="flex-1 min-w-0 resize-none bg-transparent outline-none border-none ring-0 focus:ring-0 text-xs text-slate-800 placeholder:text-slate-400 px-2 py-2.5 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="w-10 h-10 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-sm transition-all"
              aria-label="Send message"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 mt-2 px-1">
            <p className="text-[10px] text-slate-400">
              Enter to send · Shift + Enter for new line
            </p>

            <p className="text-[10px] text-slate-400 tabular-nums">
              {question.length}/1000
            </p>
          </div>
        </form>

        {/* Disclaimer */}
        <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-800 leading-5">
            AI-generated responses are informational only. They do not
            guarantee loan approval or replace professional financial
            advice. Avoid sharing passwords, OTPs, or sensitive account
            information.
          </p>
        </div>
      </div>
    </section>
  );
}
