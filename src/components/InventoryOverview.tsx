/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Layers, RefreshCw, AlertTriangle, ArrowRightLeft, ShieldAlert } from "lucide-react";
import { BranchName, StockItem, FileCategory } from "../types";

interface InventoryOverviewProps {
  stockItems: StockItem[];
  activeBranch: BranchName;
  onInitiateTransfer: (itemId: string, qty: number, source: BranchName, destination: BranchName) => void;
  onUpdateStockDirectly: (itemId: string, increment: number, branch: BranchName) => void;
}

const InventoryOverview = React.memo(function InventoryOverview({
  stockItems,
  activeBranch,
  onInitiateTransfer,
  onUpdateStockDirectly
}: InventoryOverviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [transferTarget, setTransferTarget] = useState<{ itemId: string; qty: number } | null>(null);

  const categories = ["All", ...Object.values(FileCategory)];

  const filteredItems = stockItems.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
  );

  const formatPKR = (num: number) => {
    return "₨ " + num.toLocaleString("en-PK");
  };

  return (
    <div className="bg-[#151515] border border-white/5 rounded-xl p-5 space-y-4" id="inventory-workspace">
      {/* Filters/Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-serif italic font-bold text-sm sm:text-base text-white uppercase tracking-wide">Showroom Inventory Management</h4>
          <p className="text-xs text-neutral-500">Currently showing stock levels for <strong className="text-[#C5A059]">{activeBranch}</strong></p>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-1">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[10px] font-mono uppercase tracking-wider py-1 px-3 rounded-lg border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#C5A059]/15 border-[#C5A059] text-[#C5A059] font-bold"
                  : "bg-[#0F0F0F] border-white/5 hover:border-[#C5A059]/50 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs" id="inventory-table">
          <thead>
            <tr className="border-b border-neutral-800/80 text-neutral-500 font-mono text-[10px] uppercase">
              <th className="py-2.5 px-3">Item details</th>
              <th className="py-2.5 px-2">Wood Species & Spec</th>
              <th className="py-2.5 px-2 text-center">{activeBranch} Stock</th>
              <th className="py-2.5 px-2 text-center">Other Branch Levels</th>
              <th className="py-2.5 px-2">Unit Price</th>
              <th className="py-2.5 px-3 text-right">Operational Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-850/60 text-neutral-300">
            {filteredItems.map((item) => {
              const currentStock = item.stockByBranch[activeBranch] || 0;
              const isLow = currentStock <= item.alertThreshold;

              // Extract stocks from other branches
              const otherBranches = Object.entries(item.stockByBranch).filter(
                ([branch]) => branch !== activeBranch
              );

              return (
                <tr key={item.id} className="hover:bg-white/[0.02] group transition-all" id={`row-${item.id}`}>
                  {/* Item Detail */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded border border-white/5 shrink-0 select-none pointer-events-none"
                      />
                      <div>
                        <div className="font-medium text-neutral-100 group-hover:text-[#C5A059] transition-colors line-clamp-1">{item.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[9px] font-mono text-zinc-500">
                          <span>{item.id}</span>
                          <span>|</span>
                          <span className="text-[#C5A059]">{item.category}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Material Wood Spec */}
                  <td className="py-3 px-2">
                    <span className="text-neutral-400 text-[11px] block font-sans">{item.woodType}</span>
                    <span className="text-[9px] font-mono text-zinc-500 block">{item.dimensions}</span>
                  </td>

                  {/* Stock Level in Active Branch */}
                  <td className="py-3 px-2 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className={`text-sm font-semibold rounded py-1 px-2.5 ${
                        isLow
                          ? "bg-[#C5A059]/10 border border-[#C5A059] text-[#C5A059]"
                          : "bg-[#0F0F0F] border border-white/5 text-[#E5E5E5]"
                      }`}>
                        {currentStock} units
                      </span>
                      {isLow && (
                        <span className="text-[8px] font-mono text-[#C5A059] mt-1 uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5 text-[#C5A059]" /> Reorder limit
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Stock at other branches */}
                  <td className="py-3 px-2 text-center">
                    <div className="inline-flex flex-col text-left gap-0.5">
                      {otherBranches.map(([bName, count]) => (
                        <div key={bName} className="text-[10px] font-mono text-neutral-450 flex justify-between gap-4">
                          <span className="opacity-80 line-clamp-1 max-w-[90px]">{bName.split(" ")[0]} ({bName.includes("Warehouse") ? "WH" : "SR"}):</span>
                          <span className={count > 5 ? "text-neutral-200" : "text-neutral-500"}>{count}</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-2 font-mono text-neutral-200">{formatPKR(item.pricePKR)}</td>

                  {/* Transfers Actions */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* One Click Transfer pulling from Lahore Central Warehouse */}
                      {activeBranch !== BranchName.LahoreWarehouse && (
                        <button
                          onClick={() => onInitiateTransfer(item.id, 2, BranchName.LahoreWarehouse, activeBranch)}
                          className="flex items-center gap-1 text-[10px] uppercase font-mono py-1 px-2 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] hover:text-white border border-[#C5A059]/35 hover:border-[#C5A059] rounded transition-all cursor-pointer"
                        >
                          <ArrowRightLeft className="w-3 h-3 text-[#C5A059]" />
                          <span>Pull 2 from Lahore</span>
                        </button>
                      )}

                      {/* Admin Direct Quick Increment (Simulates Warehouse Receipts) */}
                      <button
                        onClick={() => onUpdateStockDirectly(item.id, 1, activeBranch)}
                        className="py-1 px-2 bg-[#0F0F0F] border border-white/5 hover:border-white/20 text-neutral-300 text-[10px] font-mono uppercase tracking-wider rounded transition-all cursor-pointer"
                        title="Add 1 local receipt"
                      >
                        +1 Restock
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dynamic automated suggestion box matching user operations */}
      <div className="p-4 bg-[#0F0F0F] rounded-xl border border-white/5 flex gap-3 text-xs">
        <div className="p-2 bg-[#C5A059]/10 rounded text-[#C5A059] h-fit border border-[#C5A059]/20">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div className="space-y-1 my-auto">
          <span className="font-mono text-[9px] text-[#C5A059] uppercase tracking-widest block font-bold">Proactive Logistics Advice</span>
          <p className="text-neutral-400 leading-snug">
            To prevent delays on custom orders in the capital region, we recommend initiating a transit transfer request of <strong className="text-white">Emperor Dining Sets</strong> directly to the Islamabad showroom.
          </p>
        </div>
      </div>
    </div>
  );
});

export default InventoryOverview;
