import React, { useState } from "react";
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Textarea, Input, Divider
} from "@heroui/react";
import {
  HelpCircle, BookOpen, Code2, Activity, MessageSquare,
  ExternalLink, Send, CheckCircle2, Star
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

const QUICK_LINKS = [
  { label: "Documentation",       desc: "Full guides and tutorials",  icon: <BookOpen size={16} />, href: "#", color: "text-blue-400 bg-blue-500/10"   },
  { label: "API Reference",       desc: "REST & MQTT API docs",        icon: <Code2 size={16} />,    href: "#", color: "text-purple-400 bg-purple-500/10" },
  { label: "System Status",       desc: "Live infrastructure status",  icon: <Activity size={16} />, href: "#", color: "text-emerald-400 bg-emerald-500/10" },
  { label: "Community Forum",     desc: "Ask and share with peers",    icon: <MessageSquare size={16} />, href: "#", color: "text-amber-400 bg-amber-500/10" },
];

const FAQS = [
  { q: "How do I add a new IoT device?", a: "Go to Device Fleet → click 'Scan New' → follow the onboarding wizard to register your gateway or endpoint." },
  { q: "How are API keys rotated?",       a: "Navigate to Security & Governance → Active API Keys → click the refresh icon next to any key and confirm." },
  { q: "Can I export analytics data?",    a: "Yes. In the Analytics page, click 'Generate Report' to export a CSV of current metrics for the selected period." },
];

export const HelpFeedbackModal = ({ isOpen, onClose }) => {
  const [tab, setTab]           = useState("help");    // "help" | "feedback"
  const [rating, setRating]     = useState(0);
  const [subject, setSubject]   = useState("");
  const [message, setMessage]   = useState("");
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const sendFeedback = () => {
    if (!message.trim()) {
      toast({ title: "Please enter a message", type: "warning" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Feedback sent! Thank you 🎉", type: "success" });
  };

  const handleClose = (close) => {
    setSubmitted(false);
    setMessage("");
    setSubject("");
    setRating(0);
    close();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="xl"
      backdrop="blur"
      scrollBehavior="inside"
      classNames={{
        base:   "glass bg-zinc-900/95 border border-white/10 text-white",
        header: "border-b border-white/10 p-6",
        body:   "p-6",
        footer: "border-t border-white/10 p-4",
      }}
    >
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">Help & Feedback</p>
                  <p className="text-xs text-white/40 font-normal mt-0.5">Resources and support</p>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="space-y-6">
              {/* Tab switcher */}
              <div
                role="tablist"
                aria-label="Help or Feedback"
                className="flex bg-white/5 p-1 rounded-xl gap-1"
              >
                {[
                  { key: "help",     label: "Help Center" },
                  { key: "feedback", label: "Send Feedback" },
                ].map(t => (
                  <button
                    key={t.key}
                    role="tab"
                    aria-selected={tab === t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                      ${tab === t.key
                        ? "bg-white/10 text-white shadow-sm"
                        : "text-white/40 hover:text-white/70"
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {tab === "help" && (
                <div className="space-y-5" role="tabpanel" aria-label="Help Center">
                  {/* Quick links */}
                  <div className="grid grid-cols-2 gap-3">
                    {QUICK_LINKS.map(l => (
                      <a
                        key={l.label}
                        href={l.href}
                        aria-label={`${l.label} - ${l.desc}`}
                        className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] transition-colors group"
                      >
                        <span className={`p-2 rounded-lg ${l.color} shrink-0`} aria-hidden="true">
                          {l.icon}
                        </span>
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                              {l.label}
                            </p>
                            <ExternalLink size={10} className="text-white/30" aria-hidden="true" />
                          </div>
                          <p className="text-[11px] text-white/40 mt-0.5">{l.desc}</p>
                        </div>
                      </a>
                    ))}
                  </div>

                  <Divider className="bg-white/5" />

                  {/* FAQs */}
                  <div>
                    <p className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
                      Frequently Asked
                    </p>
                    <div className="space-y-2">
                      {FAQS.map((faq, i) => (
                        <details
                          key={i}
                          className="group rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden"
                        >
                          <summary className="flex justify-between items-center p-4 cursor-pointer text-sm font-medium text-white/80 hover:text-white transition-colors list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset rounded-xl">
                            {faq.q}
                            <span className="text-white/30 group-open:rotate-180 transition-transform text-lg leading-none shrink-0 ml-2">›</span>
                          </summary>
                          <div className="px-4 pb-4 text-sm text-white/50 leading-relaxed border-t border-white/5 pt-3">
                            {faq.a}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Still need help?</p>
                      <p className="text-xs text-white/40 mt-0.5">Our support team responds within 2 hours.</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shrink-0"
                      onPress={() => setTab("feedback")}
                    >
                      Contact Support
                    </Button>
                  </div>
                </div>
              )}

              {tab === "feedback" && (
                <div role="tabpanel" aria-label="Send Feedback">
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 size={28} className="text-emerald-400" />
                      </div>
                      <p className="text-xl font-bold text-white">Thank you!</p>
                      <p className="text-sm text-white/40 max-w-xs">
                        Your feedback has been submitted. We'll review it and get back to you shortly.
                      </p>
                      <Button variant="flat" size="sm" className="text-white/50 hover:text-white mt-2" onPress={() => setSubmitted(false)}>
                        Send another
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Star rating */}
                      <div>
                        <p className="text-sm text-white/60 mb-2">Rate your experience</p>
                        <div className="flex gap-1" role="group" aria-label="Star rating">
                          {[1, 2, 3, 4, 5].map(n => (
                            <button
                              key={n}
                              onClick={() => setRating(n)}
                              aria-label={`${n} star${n > 1 ? "s" : ""}`}
                              aria-pressed={rating >= n}
                              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                            >
                              <Star
                                size={24}
                                className={`transition-colors ${rating >= n ? "text-amber-400 fill-amber-400" : "text-white/20"}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <Input
                        label="Subject"
                        placeholder="What's this about?"
                        value={subject}
                        onValueChange={setSubject}
                        classNames={{
                          inputWrapper: "bg-white/5 border border-white/10",
                          label: "text-white/60",
                          input: "text-white/90",
                        }}
                      />
                      <Textarea
                        label="Your Message"
                        placeholder="Describe the issue or share your thoughts…"
                        value={message}
                        onValueChange={setMessage}
                        minRows={5}
                        classNames={{
                          inputWrapper: "bg-white/5 border border-white/10",
                          label: "text-white/60",
                          input: "text-white/90",
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button variant="light" onPress={() => handleClose(close)} className="text-white/50 hover:text-white">
                Close
              </Button>
              {tab === "feedback" && !submitted && (
                <Button
                  className="bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow-lg shadow-amber-500/20"
                  startContent={<Send size={15} />}
                  onPress={sendFeedback}
                >
                  Send Feedback
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
