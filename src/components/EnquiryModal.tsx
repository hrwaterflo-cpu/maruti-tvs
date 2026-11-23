"use client";

import { useState } from "react";
import { X, CheckCircle2, Loader2, Send, Phone, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface EnquiryModalProps {
  open: boolean;
  onClose: () => void;
  enquiryType: "vehicle" | "spare_part" | "service";
  itemName: string;
}

export default function EnquiryModal({
  open,
  onClose,
  enquiryType,
  itemName,
}: EnquiryModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error: insertError } = await supabase.from("enquiries").insert({
      customer_name: customerName.trim(),
      phone: phone.trim(),
      enquiry_type: enquiryType,
      item_name: itemName,
      message: message.trim(),
      status: "new",
    });

    setSubmitting(false);

    if (insertError) {
      setError("Could not submit right now. Please call our showroom directly.");
      return;
    }

    setSubmitted(true);
  }

  function handleResetAndClose() {
    setCustomerName("");
    setPhone("");
    setMessage("");
    setSubmitted(false);
    setError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        <button
          onClick={handleResetAndClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-[#0B1F4B]">Enquiry Received!</h3>
            <p className="text-sm text-slate-600">
              Thank you! Our <strong>Maruti TVS</strong> team will call you shortly regarding{" "}
              <span className="font-semibold text-slate-900">{itemName}</span>.
            </p>
            <button
              onClick={handleResetAndClose}
              className="mt-4 w-full rounded-xl bg-[#0B1F4B] py-2.5 text-sm font-bold text-white hover:bg-[#132d69]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <span className="inline-block rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#E31E24]">
                {enquiryType === "spare_part" ? "Spare Part Request" : "Showroom Enquiry"}
              </span>
              <h3 className="mt-1.5 text-xl font-extrabold text-[#0B1F4B]">{itemName}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Leave your number and Maruti TVS will confirm availability or schedule your visit.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rajesh Patel"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#0B1F4B] focus:ring-2 focus:ring-[#0B1F4B]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#0B1F4B] focus:ring-2 focus:ring-[#0B1F4B]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Quantity needed, preferred time, or scooter model..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-[#0B1F4B] focus:ring-2 focus:ring-[#0B1F4B]/10"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0B2265] to-[#1D4ED8] py-3 text-sm font-bold text-white shadow-md hover:brightness-110 disabled:opacity-60 transition-all"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {submitting ? "Sending..." : "Submit Request"}
              </button>

              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-500 font-medium">Or connect directly with our team:</p>
                <div className="mt-2 flex items-center justify-center gap-3 text-xs">
                  <a
                    href="tel:+919510441941"
                    className="inline-flex items-center gap-1 font-bold text-[#0B2265] hover:text-[#1D4ED8]"
                  >
                    <Phone className="h-3 w-3 text-[#1D4ED8]" />
                    Mohit: 9510441941
                  </a>
                  <span className="text-slate-300">&bull;</span>
                  <a
                    href="tel:+916355366440"
                    className="inline-flex items-center gap-1 font-bold text-[#0B2265] hover:text-[#1D4ED8]"
                  >
                    <Phone className="h-3 w-3 text-[#1D4ED8]" />
                    Sagar: 6355366440
                  </a>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
