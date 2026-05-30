/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MapPin, Building, ArrowRight, Layers, CreditCard, Activity } from "lucide-react";
import { BranchName, Order, StockItem, StaffActivity } from "../types";

interface BranchPerformanceProps {
  activeBranch: BranchName;
  onBranchSelect: (branch: BranchName) => void;
  orders: Order[];
  stockItems: StockItem[];
  activities: StaffActivity[];
}

const BranchPerformance = React.memo(function BranchPerformance({
  activeBranch,
  onBranchSelect,
  orders,
  stockItems,
  activities,
}: BranchPerformanceProps) {
  
  // Calculate revenue share by branch
  const calculateBranchRevenue = (b: BranchName) => {
    return orders
      .filter((o) => o.branch === b && o.status !== "Draft")
      .reduce((sum, o) => sum + o.totalPKR, 0);
  };

  const karachiRev = calculateBranchRevenue(BranchName.KarachiShowroom);
  const lahoreRev = calculateBranchRevenue(BranchName.LahoreWarehouse);
  const islamabadRev = calculateBranchRevenue(BranchName.IslamabadShowroom);
  const totalRev = karachiRev + lahoreRev + islamabadRev;

  const branchesMeta = [
    {
      name: BranchName.KarachiShowroom,
      code: "KHI-01",
      revenue: karachiRev,
      staffCount: 5,
      type: "Primary Showroom & Retail Hub",
      alertCount: stockItems.filter(item => (item.stockByBranch[BranchName.KarachiShowroom] || 0) <= item.alertThreshold).length,
    },
    {
      name: BranchName.LahoreWarehouse,
      code: "LHE-WH",
      revenue: lahoreRev,
      staffCount: 12,
      type: "Central Manufacturing & Storage Hub",
      alertCount: stockItems.filter(item => (item.stockByBranch[BranchName.LahoreWarehouse] || 0) <= item.alertThreshold).length,
    },
    {
      name: BranchName.IslamabadShowroom,
      code: "ISB-02",
      revenue: islamabadRev,
      staffCount: 4,
      type: "Luxury Client Experience Center",
      alertCount: stockItems.filter(item => (item.stockByBranch[BranchName.IslamabadShowroom] || 0) <= item.alertThreshold).length,
    },
  ];

  const formatPKR = (num: number) => {
    return "₨ " + num.toLocaleString("en-PK");
  };

  // Get active branch activities
  const activeBranchActivities = activities
    .filter((act) => act.branch === activeBranch)
    .slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="branch-performance-section">
      {/* Branch Selector Grid */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-sans font-semibold text-sm text-neutral-100 uppercase tracking-wider">Branch Operations Center</h4>
            <p className="text-xs text-neutral-500">Toggles data stream context instantly</p>
          </div>
          <span className="p-1 px-3 rounded-full bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 font-mono text-[10px] uppercase tracking-wider animate-pulse font-semibold">
            {activeBranch} Selected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {branchesMeta.map((br, idx) => {
            const isSelected = activeBranch === br.name;
            return (
              <button
                key={idx}
                onClick={() => onBranchSelect(br.name)}
                className={`border rounded-xl p-5 text-left transition-all duration-300 relative cursor-pointer group ${
                  isSelected
                    ? "bg-[#151515] border-[#C5A059]/50 shadow-md shadow-black/40"
                    : "bg-[#151515] border-white/5 hover:border-[#C5A059]/20"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded ${
                    isSelected ? "bg-[#C5A059]/10 text-[#C5A059]" : "bg-white/5 text-stone-400 group-hover:text-[#C5A059] transition-colors"
                  }`}>
                    {br.name === BranchName.LahoreWarehouse ? <Building className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">{br.code}</span>
                </div>

                <h5 className="font-serif italic font-bold text-sm sm:text-base text-neutral-200 mb-1 leading-tight group-hover:text-[#C5A059] transition-colors">
                  {br.name}
                </h5>
                <p className="text-[10px] text-zinc-500 mb-4 line-clamp-1">{br.type}</p>

                <div className="space-y-1.5 pt-3 border-t border-white/5">
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>Direct Revenue Purchases</span>
                  </div>
                  <div className="text-xs font-semibold font-mono text-neutral-200">
                    {formatPKR(br.revenue)}
                  </div>
                </div>

                {br.alertCount > 0 && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A059]"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Visual Revenue meters */}
        <div className="p-5 bg-[#151515] border border-white/5 rounded-xl space-y-4">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Comparative Sales share</span>
          <div className="space-y-3">
            {branchesMeta.map((br, idx) => {
              const maxRev = Math.max(karachiRev, lahoreRev, islamabadRev, 1);
              const percentage = Math.min((br.revenue / maxRev) * 100, 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">{br.name}</span>
                    <span className="text-neutral-300 font-semibold">{formatPKR(br.revenue)}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#0F0F0F] rounded-full overflow-hidden border border-white/5">
                    <div
                      className="bg-[#C5A059] h-full rounded-full transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Staff Activity List */}
      <div className="bg-[#151515] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <h4 className="font-serif italic font-bold text-sm text-neutral-100 uppercase tracking-wide flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#C5A059]" />
              Live Workspace Activity
            </h4>
            <p className="text-[10px] text-zinc-500">Showing staff events for {activeBranch}</p>
          </div>

          <div className="space-y-3">
            {activeBranchActivities.length === 0 ? (
              <div className="p-5 text-center text-zinc-650 text-xs italic">
                No recent staff logs for this branch. Active operations are running normally.
              </div>
            ) : (
              activeBranchActivities.map((act) => (
                <div key={act.id} className="p-3 bg-[#0F0F0F]/80 border border-white/5 rounded-lg flex flex-col gap-1.5 hover:border-[#C5A059]/20 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-neutral-200">{act.staffName}</span>
                    <span className="text-[9px] font-mono text-zinc-500">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">{act.action}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></span>
                    <span className="text-[9px] font-mono text-[#C5A059] uppercase tracking-widest">{act.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-zinc-500">
          <span>Enterprise Secure Connection</span>
          <span className="text-[#C5A059] font-semibold animate-pulse">● Active status</span>
        </div>
      </div>
    </div>
  );
});

export default BranchPerformance;
