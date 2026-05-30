/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { TrendingUp, Package, Clock, ShieldCheck, DollarSign } from "lucide-react";
import { Order, StockItem, ManagerApproval, BranchName } from "../types";

interface KPIStatsProps {
  orders: Order[];
  stockItems: StockItem[];
  approvals: ManagerApproval[];
  onSelectAction: (tabId: string) => void;
}

const KPIStats = React.memo(function KPIStats({ orders, stockItems, approvals, onSelectAction }: KPIStatsProps) {
  // Compute Total Revenue
  const totalRevenue = orders
    .filter((o) => o.status !== "Draft")
    .reduce((sum, o) => sum + o.totalPKR, 0);

  // Compute low inventory alerts
  let lowStockCount = 0;
  stockItems.forEach((item) => {
    Object.values(item.stockByBranch).forEach((stockCount) => {
      if (stockCount <= item.alertThreshold) {
        lowStockCount++;
      }
    });
  });

  // Pending CEO Approvals
  const pendingApprovalsCount = approvals.filter((a) => a.status === "Pending").length;

  // Active Installment plans outstanding
  const activeInstallmentPaymentsPending = orders
    .filter((o) => o.paymentType === "Installments" && o.installmentPlan)
    .reduce((sum, o) => sum + (o.installmentPlan?.remainingBalancePKR || 0), 0);

  // Format to PKR currency custom format
  const formatPKR = (num: number) => {
    return "₨ " + num.toLocaleString("en-PK");
  };

  const kpis = [
    {
      id: "sales-kpi",
      title: "Total Sales Revenue",
      value: formatPKR(totalRevenue),
      subtitle: "Across all showrooms & depots",
      icon: TrendingUp,
      color: "border-white/5 from-[#151515] to-[#1F1F1F]",
      actionLabel: "Analyze Sales Overview",
      tab: "sales",
    },
    {
      id: "stock-kpi",
      title: "Stock Predictions & Alerts",
      value: `${lowStockCount} Shortages`,
      subtitle: "Items below threshold limits",
      icon: Package,
      color: lowStockCount > 0 ? "border-[#C5A059]/30 from-[#1E1C18] to-[#151515]" : "border-white/5 from-[#151515 ] to-[#1F1F1F]",
      alert: lowStockCount > 0,
      actionLabel: "Show Low Inventory",
      tab: "stock",
    },
    {
      id: "installment-kpi",
      title: "Outstanding Installments",
      value: formatPKR(activeInstallmentPaymentsPending),
      subtitle: "Pending ledger collections",
      icon: DollarSign,
      color: "border-white/5 from-[#151515] to-[#1F1F1F]",
      actionLabel: "Open Credit Ledger",
      tab: "ledger",
    },
    {
      id: "approvals-kpi",
      title: "Executive CEO Approvals",
      value: `${pendingApprovalsCount} Pending`,
      subtitle: "Discount & transfer requests",
      icon: ShieldCheck,
      color: pendingApprovalsCount > 0 ? "border-[#C5A059]/30 from-[#1E1C18] to-[#151515]" : "border-white/5 from-[#151515] to-[#1F1F1F]",
      actionLabel: "Open Approvals Queue",
      tab: "approvals",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-stats-grid">
      {kpis.map((k, idx) => {
        const Icon = k.icon;
        return (
          <div
            key={idx}
            id={k.id}
            className={`border rounded-xl p-5 bg-gradient-to-br ${k.color} flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:border-[#C5A059]/30 group`}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  {k.title}
                </span>
                <span className={`font-serif italic font-bold text-xl sm:text-2xl text-white ${k.alert ? "text-[#C5A059]" : ""}`}>
                  {k.value}
                </span>
                <span className="text-xs text-zinc-400 block mt-1">
                  {k.subtitle}
                </span>
              </div>
              <div className={`p-2.5 rounded ${k.alert ? "bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30" : "bg-white/5 text-stone-450 group-hover:text-[#C5A059] group-hover:bg-[#C5A059]/5"} transition-all`}>
                <Icon className="w-5 h-5 animate-pulse" style={{ animationDuration: "3s" }} />
              </div>
            </div>
            
            <button
              onClick={() => onSelectAction(k.tab)}
              className="mt-5 pt-4 border-t border-white/5 text-left text-[10px] font-mono text-[#C5A059] group-hover:text-white flex items-center gap-1.5 transition-all cursor-pointer uppercase tracking-widest font-semibold"
            >
              <span>{k.actionLabel}</span>
              <span className="transform translate-x-0 group-hover:translate-x-1.5 transition-transform">→</span>
            </button>
          </div>
        );
      })}
    </div>
  );
});

export default KPIStats;
