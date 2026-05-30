/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Check, XCircle, ShieldCheck, UserCheck, AlertCircle } from "lucide-react";
import { ManagerApproval } from "../types";

interface ApprovalsQueueProps {
  approvals: ManagerApproval[];
  onProcessApproval: (id: string, action: "Approved" | "Declined") => void;
  currentRole: string;
}

export default function ApprovalsQueue({ approvals, onProcessApproval, currentRole }: ApprovalsQueueProps) {
  const pendingApprovals = approvals.filter((a) => a.status === "Pending");

  const formatPKR = (num: number) => {
    return "₨ " + num.toLocaleString("en-PK");
  };

  return (
    <div className="bg-[#151515] border border-white/5 rounded-xl p-5 space-y-4" id="approvals-queue-space">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <h4 className="font-serif italic font-bold text-sm sm:text-base text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            Executive HQ Governance & Approvals
          </h4>
          <p className="text-xs text-neutral-500">Requires CEO or Regional Director authorization to release locks</p>
        </div>
        <span className="p-1 px-3 rounded bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-mono font-bold border border-[#C5A059]/30 uppercase tracking-wider">
          {pendingApprovals.length} Actions Required
        </span>
      </div>

      <div className="space-y-3">
        {pendingApprovals.length === 0 ? (
          <div className="p-8 text-center text-stone-500 italic text-xs border border-dashed border-white/5 rounded-xl space-y-2">
            <UserCheck className="w-10 h-10 mx-auto text-stone-650" />
            <p className="text-stone-400 font-serif italic font-bold text-sm">Corporate Authorization Complete</p>
            <p className="text-[10px] text-zinc-550 uppercase tracking-widest leading-relaxed">All showrooms, discounts, and dispatch orders are running fully authorized.</p>
          </div>
        ) : (
          pendingApprovals.map((app) => (
            <div
              key={app.id}
              className="p-4 bg-[#0F0F0F] border border-white/5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 leading-relaxed hover:border-[#C5A059]/30 transition-all group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] font-mono bg-[#151515] border border-white/5 py-0.5 px-2 rounded font-semibold text-neutral-400">
                    {app.id}
                  </span>
                  <span className="text-[9px] font-mono text-[#C5A059] uppercase tracking-wider font-bold">
                    {app.type}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-550">
                    Branch: {app.branch}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-200 mt-1.5 leading-snug group-hover:text-white transition-colors">
                  {app.details}
                </p>
                <div className="text-[10px] text-zinc-500 font-mono mt-1">
                  Requested by: <strong className="text-zinc-400">{app.requestedBy}</strong> | Date: {app.dateCreated}
                </div>
                {app.amountPKR && (
                  <div className="text-xs font-mono text-[#C5A059] pt-1.5 flex items-center gap-1.5 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                    Estimated Revenue Release: {formatPKR(app.amountPKR)}
                  </div>
                )}
              </div>

              {/* CEO Affirmation buttons */}
              <div className="flex gap-2 shrink-0 justify-end border-t sm:border-0 border-white/5 pt-2.5 sm:pt-0 font-mono">
                {currentRole !== "Owner" ? (
                  <span className="text-[10px] bg-red-950/20 text-red-450 border border-red-900/30 px-3 py-2 rounded flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    Locked: CEO Authorization Only
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => onProcessApproval(app.id, "Declined")}
                      className="p-2 bg-[#1A1A1A] border border-white/5 hover:bg-red-950/20 hover:border-red-900 text-neutral-400 hover:text-red-400 rounded transition-all flex items-center gap-1 cursor-pointer"
                      title="Decline Request"
                    >
                      <XCircle className="w-4 h-4" />
                      <span className="text-[10px] font-mono uppercase tracking-wider">Decline</span>
                    </button>
                    <button
                      onClick={() => onProcessApproval(app.id, "Approved")}
                      className="p-2 bg-[#C5A059] hover:bg-[#b08c48] text-[#0F0F0F] rounded transition-all flex items-center gap-1 cursor-pointer"
                      title="Approve Request"
                    >
                      <Check className="w-4 h-4 text-[#0F0F0F]" />
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold animate-pulse">Approve Release</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3.5 bg-[#0F0F0F] rounded border border-white/5 flex gap-2.5 text-[11px] leading-snug text-stone-500">
        <AlertCircle className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
        <p>
          Corporate locks are mapped automatically. Discount approvals release locked order items to "In Preparation" status. Stock transfer approvals trigger automated logistics dispatch transit immediately.
        </p>
      </div>
    </div>
  );
}
