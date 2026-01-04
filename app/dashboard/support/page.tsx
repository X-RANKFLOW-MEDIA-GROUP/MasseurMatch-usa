"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Mail, Phone, FileText, ChevronDown, ChevronUp, Send } from "lucide-react";

const faqs = [
  {
    question: "How do I update my profile?",
    answer: "Go to Dashboard > My Ads and click on the ad you want to edit. You can update your photos, services, pricing, and availability from there.",
  },
  {
    question: "How do payments work?",
    answer: "We process payments through Stripe. Your earnings are deposited directly to your bank account weekly, minus our platform fee.",
  },
  {
    question: "How do I get more visibility?",
    answer: "Upgrade to a premium plan to boost your profile in search results. You can also improve your profile with professional photos and detailed service descriptions.",
  },
  {
    question: "Can I pause my listing?",
    answer: "Yes! Go to My Ads and click the toggle button next to your listing to pause or activate it anytime.",
  },
  {
    question: "How do I report a user?",
    answer: "Click the report button on any user's profile or message. Our trust and safety team reviews all reports within 24 hours.",
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSending(false);
    setSent(true);
    setFormData({ subject: "", message: "" });

    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-2">Support</h1>
      <p className="text-slate-400 mb-8">Get help with your account</p>

      {/* Contact Options */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {[
          { icon: MessageCircle, label: "Live Chat", desc: "Chat with us", action: "Start Chat" },
          { icon: Mail, label: "Email", desc: "support@masseurmatch.com", action: "Send Email" },
          { icon: Phone, label: "Phone", desc: "Mon-Fri 9am-5pm", action: "Call Us" },
        ].map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl border border-white/10 bg-white/5 text-left hover:bg-white/10 transition-colors"
          >
            <item.icon className="h-8 w-8 text-white mb-3" />
            <h3 className="font-semibold text-white">{item.label}</h3>
            <p className="text-sm text-slate-400 mb-2">{item.desc}</p>
            <span className="text-sm text-white">{item.action} →</span>
          </motion.button>
        ))}
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-white" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-white/5 last:border-0">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between py-4 text-left"
              >
                <span className="font-medium text-white">{faq.question}</span>
                {openFaq === index ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>
              {openFaq === index && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="pb-4 text-slate-400"
                >
                  {faq.answer}
                </motion.p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Send className="h-5 w-5 text-white" />
          Send us a message
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="What can we help you with?"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-neutral-300 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe your issue or question..."
              rows={5}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-neutral-300 focus:outline-none resize-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-xl bg-white py-3 font-semibold text-white hover:bg-neutral-200 disabled:opacity-50 transition-colors"
          >
            {sending ? "Sending..." : sent ? "Message Sent!" : "Send Message"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
