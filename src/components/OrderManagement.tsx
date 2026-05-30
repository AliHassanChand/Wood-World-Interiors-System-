/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ShoppingCart, Plus, Calendar, CreditCard, ArrowRight, CheckCircle2, UserCheck, AlertTriangle } from "lucide-react";
import { Order, StockItem, BranchName } from "../types";

interface OrderManagementProps {
  orders: Order[];
  stockItems: StockItem[];
  activeBranch: BranchName;
  onAddNewOrder: (newOrder: Order) => void;
}

const OrderManagement = React.memo(function OrderManagement({ orders, stockItems, activeBranch, onAddNewOrder }: OrderManagementProps) {
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentType, setPaymentType] = useState<"Cash" | "Bank Transfer" | "Installments">("Cash");
  const [successMsg, setSuccessMsg] = useState("");

  const orderStatuses = ["All", "Draft", "Pending Approval", "Transfer Needed", "In Preparation", "Dispatched", "Delivered"];

  // Filter orders by active branch and selected status
  const filteredOrders = orders.filter((o) => {
    const isBranchMath = o.branch === activeBranch;
    const isStatusMatch = filterStatus === "All" || o.status === filterStatus;
    return isBranchMath && isStatusMatch;
  });

  const selectedItemMeta = stockItems.find((i) => i.id === selectedItemId);
  const availableStockInBranch = selectedItemMeta ? (selectedItemMeta.stockByBranch[activeBranch] || 0) : 0;
  const stockShortage = selectedItemMeta ? availableStockInBranch < quantity : false;

  const formatPKR = (num: number) => {
    return "₨ " + num.toLocaleString("en-PK");
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !selectedItemId) return;

    const chosenItem = stockItems.find((i) => i.id === selectedItemId)!;
    const finalBill = chosenItem.pricePKR * quantity;
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    let orderStatus: Order["status"] = "In Preparation";
    if (stockShortage) {
      orderStatus = "Transfer Needed";
    }

    const newOrder: Order = {
      id: orderId,
      customerName,
      customerPhone,
      branch: activeBranch,
      items: [{ itemId: selectedItemId, quantity, agreedPricePKR: chosenItem.pricePKR }],
      totalPKR: finalBill,
      orderDate: new Date().toISOString().split("T")[0],
      expectedDeliveryDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().split("T")[0], // 10 days
      status: orderStatus,
      paymentType,
    };

    // If installment program selected, automatically scaffold the 3-month contract ledger
    if (paymentType === "Installments") {
      const deposit = Math.round(finalBill * 0.45); // 45% upfront
      const outstanding = finalBill - deposit;
      const installmentAmount = Math.round(outstanding / 3);

      newOrder.installmentPlan = {
        id: `INS-${Math.floor(500 + Math.random() * 500)}`,
        totalOrderPricePKR: finalBill,
        initialDepositPKR: deposit,
        remainingBalancePKR: outstanding,
        installmentsCount: 3,
        payments: [
          { id: `P-${orderId}-1`, amountPKR: deposit, datePaid: new Date().toISOString().split("T")[0], status: "Paid" },
          { id: `P-${orderId}-2`, amountPKR: installmentAmount, datePaid: "", status: "Pending" },
          { id: `P-${orderId}-3`, amountPKR: installmentAmount, datePaid: "", status: "Pending" },
          { id: `P-${orderId}-4`, amountPKR: installmentAmount, datePaid: "", status: "Pending" }
        ],
        reminderSent: false,
      };
    }

    onAddNewOrder(newOrder);

    // Reset Form
    setCustomerName("");
    setCustomerPhone("");
    setSelectedItemId("");
    setQuantity(1);
    setPaymentType("Cash");
    setSuccessMsg(`Order ${orderId} created successfully for ${customerName}!`);
    setTimeout(() => {
      setSuccessMsg("");
      setShowCreateForm(false);
    }, 2500);
  };

  return (
    <div className="bg-[#151515] border border-white/5 rounded-xl p-5 space-y-4" id="sales-workspace">
      {/* Header and Add button */}
      <div className="flex justify-between items-center bg-[#1C1C1C] -m-5 p-5 rounded-t-xl border-b border-white/5">
        <div>
          <h4 className="font-serif italic font-bold text-sm sm:text-base text-[#E5E5E5] flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-[#C5A059]" />
            Showroom Orders & Ledger
          </h4>
          <p className="text-[11px] text-zinc-500 mt-0.5">Processed order logs for {activeBranch}</p>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className={`text-[10px] py-1.5 px-3 rounded font-mono uppercase tracking-widest flex items-center gap-1.5 cursor-pointer transition-all ${
            showCreateForm
              ? "bg-[#0F0F0F] border border-white/5 text-stone-400"
              : "bg-[#C5A059] text-[#0F0F0F] font-bold"
          }`}
          id="toggle-order-wizard-btn"
        >
          <Plus className="w-4 h-4" />
          <span>{showCreateForm ? "View active logs" : "Create order wizard"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-[#0F0F0F] border border-[#C5A059]/30 rounded text-[#C5A059] text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#C5A059]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Guided Order Creator Form */}
      {showCreateForm ? (
        <form onSubmit={handleCreateOrder} className="space-y-4 p-5 bg-[#0F0F0F] rounded-xl border border-white/5 max-w-2xl mx-auto" id="order-creation-form">
          <div className="border-b border-white/5 pb-2.5">
            <h5 className="font-serif italic font-bold text-sm text-[#C5A059] uppercase tracking-wider">New Custom Order Wizard</h5>
            <p className="text-[10px] text-neutral-500">Automatically cross-references live inventories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Customer Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Sarfraz Ahmed"
                className="w-full bg-[#151515] border border-white/5 focus:border-[#C5A059]/40 rounded py-2 px-3 text-xs text-neutral-200 outline-none"
              />
            </div>

            {/* Customer Phone */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Customer Contact Number</label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. 0300-1234567"
                className="w-full bg-[#151515] border border-white/5 focus:border-[#C5A059]/40 rounded py-2 px-3 text-xs text-neutral-200 outline-none"
              />
            </div>

            {/* Item Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Showroom Item Selection</label>
              <select
                required
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full bg-[#151515] border border-white/5 focus:border-[#C5A059]/40 rounded py-2 px-3 text-xs text-neutral-200 outline-none cursor-pointer"
              >
                <option value="">-- Choose fine wood product --</option>
                {stockItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({formatPKR(item.pricePKR)})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Order Volume Qty</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-[#151515] border border-white/5 focus:border-[#C5A059]/40 rounded py-2 px-3 text-xs text-neutral-200 outline-none"
              />
            </div>
          </div>

          {/* Real-Time Showroom Stock Pre-Checks */}
          {selectedItemMeta && (
            <div className={`p-4 rounded border text-xs ${
              stockShortage
                ? "bg-[#C5A059]/10 border-[#C5A059]/30 text-[#C5A059]"
                : "bg-[#151515] border-white/5 text-neutral-400"
            }`}>
              <div className="flex justify-between items-center">
                <span>Available Reserve in {activeBranch}:</span>
                <span className="font-semibold font-mono">{availableStockInBranch} units</span>
              </div>
              {stockShortage && (
                <div className="flex gap-2 mt-2.5 pt-2.5 border-t border-[#C5A059]/20 text-[11px] leading-relaxed">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#C5A059]" />
                  <p>
                    <strong>Showroom Shortage Warning!</strong> Fulfilling {quantity} units will temporarily classify this order as <strong>"Transfer Needed"</strong>. The ERP will request a stock transit from Lahore Central Warehouse.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Payment Schedule Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Billing Contract Method</label>
            <div className="grid grid-cols-3 gap-2">
              {(["Cash", "Bank Transfer", "Installments"] as const).map((pay) => (
                <button
                  key={pay}
                  type="button"
                  onClick={() => setPaymentType(pay)}
                  className={`py-2 px-3 rounded text-xs font-mono border transition-all cursor-pointer ${
                    paymentType === pay
                      ? "bg-[#C5A059]/15 border-[#C5A059] text-[#C5A059] font-bold"
                      : "bg-[#151515] border-white/5 text-zinc-500"
                  }`}
                >
                  {pay}
                </button>
              ))}
            </div>
            {paymentType === "Installments" && (
              <p className="text-[10px] text-[#C5A059]/90 font-mono italic">
                * Selects 3-Month Ledger contract. Requires 45% upfront deposit. 3 monthly automated equal payments schema.
              </p>
            )}
          </div>

          {/* Submit buttons */}
          <div className="pt-4 flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="py-1.5 px-4 rounded bg-[#1A1A1A] border border-white/5 text-stone-400 text-xs font-mono uppercase hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-1.5 px-5 rounded bg-[#C5A059] text-[#0F0F0F] text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer hover:bg-[#b08c48]"
            >
              <UserCheck className="w-4 h-4 text-[#0F0F0F]" />
              <span>Confirm & Lock Order</span>
            </button>
          </div>
        </form>
      ) : (
        /* Regular List View */
        <div className="space-y-3">
          {/* Status filters */}
          <div className="flex flex-wrap gap-1 border-b border-white/5 pb-3">
            {orderStatuses.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setFilterStatus(s)}
                className={`text-[9px] font-mono uppercase tracking-widest py-1 px-3 rounded-md border transition-all cursor-pointer ${
                  filterStatus === s
                    ? "bg-[#C5A059]/10 border-[#C5A059] text-[#C5A059] font-bold"
                    : "bg-[#0F0F0F] border-white/5 hover:border-white/10 text-stone-500"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-stone-500 italic text-xs border border-dashed border-white/5 rounded-xl">
                No orders discovered for {activeBranch} matching the status {filterStatus}.
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const itemDetails = stockItems.find((i) => i.id === ord.items[0]?.itemId);
                return (
                  <div
                    key={ord.id}
                    className="p-4 bg-[#0F0F0F] border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 leading-relaxed hover:border-[#C5A059]/30 transition-all group"
                  >
                    <div>
                      {/* Customer info */}
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] bg-[#151515] border border-white/5 text-zinc-400 py-0.5 px-2 rounded">
                          {ord.id}
                        </span>
                        <h5 className="font-sans font-semibold text-xs sm:text-sm text-[#E5E5E5] group-hover:text-[#C5A059] transition-colors">{ord.customerName}</h5>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1">
                        Phone: {ord.customerPhone} | Branch: <strong className="text-[#C5A059]/80">{ord.branch}</strong>
                      </p>

                      {/* Item summary */}
                      <p className="text-xs text-stone-300 mt-2">
                        Purchased: <strong className="text-white">{itemDetails?.name || "Solid Wood Piece"}</strong> x{ord.items[0]?.quantity || 1}
                      </p>
                      <div className="text-[10px] font-mono text-stone-500 mt-1">
                        Est. Delivery: {ord.expectedDeliveryDate}
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col justify-between items-end gap-2 border-t md:border-t-0 border-white/5 pt-2.5 md:pt-0">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Contract Bill</span>
                        <span className="text-xs sm:text-sm font-semibold font-mono text-[#C5A059]">{formatPKR(ord.totalPKR)}</span>
                      </div>

                      {/* Badges mapping statuses */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">{ord.paymentType}</span>
                        <span className={`text-[10px] font-mono uppercase py-0.5 px-2.5 rounded border ${
                          ord.status === "Delivered"
                            ? "bg-green-950/20 border-green-900/40 text-green-400"
                            : ord.status === "Transfer Needed"
                            ? "bg-[#C5A059]/10 border-[#C5A059]/30 text-[#C5A059] animate-pulse"
                            : "bg-[#151515] border-white/5 text-[#C5A059]/80"
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default OrderManagement;
