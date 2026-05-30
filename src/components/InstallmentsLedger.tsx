/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CreditCard, Send, ShieldAlert, CheckCircle2, AlertTriangle, Calendar } from "lucide-react";
import { Order, InstallmentPlan } from "../types";

interface InstallmentsLedgerProps {
  orders: Order[];
  onCollectPayment: (orderId: string, paymentId: string) => void;
  onSendReminder: (orderId: string) => void;
}

export default function InstallmentsLedger({ orders, onCollectPayment, onSendReminder }: InstallmentsLedgerProps) {
  const [successMsg, setSuccessMsg] = useState("");

  const installmentOrders = orders.filter(
    (o) => o.paymentType === "Installments" && o.installmentPlan
  );

  const formatPKR = (num: number) => {
    return "₨ " + num.toLocaleString("en-PK");
  };

  const handleTriggerCollect = (orderId: string, payId: string, amount: number, custName: string) => {
    onCollectPayment(orderId, payId);
    setSuccessMsg(`Ledger Updated: Successfully collected installment of ${formatPKR(amount)} from ${custName}.`);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const handleTriggerReminder = (orderId: string, custName: string) => {
    onSendReminder(orderId);
    setSuccessMsg(`Automated reminder SMS and payment invoice dispatched to ${custName}.`);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  return (
    <div className="bg-[#151515] border border-white/5 rounded-xl p-5 space-y-4" id="ledger-workspace">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div>
          <h4 className="font-serif italic font-bold text-sm sm:text-base text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#C5A059]" />
            Showroom Consumer Credit & Installments Ledger
          </h4>
          <p className="text-xs text-neutral-500">Tracks custom payment structures & monthly schedules</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-[#0F0F0F] border border-[#C5A059]/30 rounded text-[#C5A059] text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#C5A059]" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="space-y-4">
        {installmentOrders.length === 0 ? (
          <div className="p-8 text-center text-stone-500 italic text-xs border border-dashed border-white/5 rounded-xl">
            Currently no client is registered on the installment program.
          </div>
        ) : (
          installmentOrders.map((ord) => {
            const plan = ord.installmentPlan!;
            const nextDueInstallment = plan.payments.find((p) => p.status === "Pending");
            const overdueInstallment = plan.payments.find((p) => p.status === "Overdue");

            return (
              <div
                key={ord.id}
                className="p-5 bg-[#0F0F0F] border border-white/5 rounded-xl space-y-4"
                id={`ledger-card-${ord.id}`}
              >
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div>
                    <h5 className="font-sans font-semibold text-xs sm:text-sm text-neutral-200">
                      Customer: {ord.customerName}
                    </h5>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      Contact: {ord.customerPhone} | Invoice ID: <strong className="text-[#C5A059]">{ord.id}</strong>
                    </p>
                  </div>

                  <div className="flex gap-4 text-left sm:text-right">
                    <div>
                      <span className="text-[9px] font-mono text-zinc-550 uppercase block">Total Contract</span>
                      <span className="text-xs sm:text-sm font-semibold font-mono text-neutral-200">{formatPKR(plan.totalOrderPricePKR)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-[#C5A059]/90 uppercase block font-bold">Unpaid Balance</span>
                      <span className="text-xs sm:text-sm font-semibold font-mono text-[#C5A059]">{formatPKR(plan.remainingBalancePKR)}</span>
                    </div>
                  </div>
                </div>

                {/* Monthly ledger payments status timeline */}
                <div>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block mb-2 font-bold">Installment Payment Ledger Schedule</span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    {plan.payments.map((p, pIdx) => (
                      <div
                        key={p.id}
                        className={`p-3 rounded border text-xs flex flex-col justify-between ${
                          p.status === "Paid"
                            ? "bg-green-950/15 border-green-900/40 text-green-400"
                            : p.status === "Overdue"
                            ? "bg-red-950/15 border-red-900/45 text-red-400 animate-pulse"
                            : "bg-[#151515] border-white/5 text-stone-300"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between font-mono text-[9px] uppercase">
                            <span>Stage {pIdx + 1}</span>
                            <span className={p.status === "Paid" ? "text-green-400 font-bold" : ""}>{p.status}</span>
                          </div>
                          <div className="font-bold font-mono text-sm mt-1.5 sm:mt-2.5">
                            {formatPKR(p.amountPKR)}
                          </div>
                        </div>

                        {/* Quick trigger action to collect cash */}
                        {p.status !== "Paid" && (
                          <button
                            onClick={() => handleTriggerCollect(ord.id, p.id, p.amountPKR, ord.customerName)}
                            className="mt-3.5 w-full py-1 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] hover:text-white border border-[#C5A059]/30 rounded transition-all cursor-pointer text-[10px] font-mono uppercase tracking-widest font-bold"
                          >
                            Receive Cash
                          </button>
                        )}
                        {p.status === "Paid" && p.datePaid && (
                          <div className="text-[9px] font-mono text-stone-500 mt-2 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-green-700" />
                            <span>Paid {p.datePaid}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notifications and Dispatch reminder triggers */}
                {nextDueInstallment && (
                  <div className="p-3 bg-[#151515] border border-white/5 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs leading-relaxed">
                    <div className="flex gap-2 text-[#E5E5E5]/70">
                      <ShieldAlert className="w-4 h-4 text-[#C5A059] shrink-0" />
                      <span>
                        Next installment collection due: <strong className="text-[#C5A059]">{formatPKR(nextDueInstallment.amountPKR)}</strong>. Remaining balance after collection will automatically calculate down.
                      </span>
                    </div>

                    <button
                      onClick={() => handleTriggerReminder(ord.id, ord.customerName)}
                      className={`py-1 px-3 border rounded text-[10px] font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                        plan.reminderSent
                          ? "bg-green-950/15 border-green-905 text-green-400"
                          : "bg-[#C5A059]/10 border-[#C5A059]/30 hover:bg-[#C5A059]/20 text-[#C5A059] hover:text-white"
                      }`}
                    >
                      <Send className="w-3 h-3" />
                      <span>{plan.reminderSent ? "Reminder Dispatched" : "Send SMS reminder"}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
