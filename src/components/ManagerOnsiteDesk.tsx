/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Layers,
  ShoppingCart,
  Truck,
  ClipboardList,
  Hammer,
  Sparkles,
  Check,
  AlertTriangle,
  BadgePercent,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  UserCheck,
  PackageOpen,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  FileText
} from "lucide-react";
import { BranchName, StockItem, Order, StockTransfer, ManagerApproval, StaffActivity, FileCategory } from "../types";

interface ManagerOnsiteDeskProps {
  currentRole: string; // "Owner" | "KarachiManager" | "LahoreManager" | "IslamabadManager"
  activeBranch: BranchName;
  stockItems: StockItem[];
  orders: Order[];
  transfers: StockTransfer[];
  approvals: ManagerApproval[];
  activities: StaffActivity[];
  onAddNewOrder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string, status: Order["status"]) => void;
  onAddNewApprovalRequest: (app: ManagerApproval) => void;
  onUpdateTransferStatus: (transferId: string, status: StockTransfer["status"]) => void;
  onAddDirectActivity: (activity: StaffActivity) => void;
  formatPKR: (num: number) => string;
}

// Local mock items for raw timber
interface TimberRecord {
  id: string;
  woodType: string;
  sourceForest: string;
  volumeCFT: number;
  seasoningProgress: number; // 0-100
  status: "Seasoning" | "Cured" | "Mill Ready";
  dateIngested: string;
}

// Local mock items for VIP booking consults
interface VIPBooking {
  id: string;
  clientName: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  furnitureInterest: string;
  status: "Booked" | "Completed" | "No Show";
  representative: string;
}

const ManagerOnsiteDesk = React.memo(function ManagerOnsiteDesk({
  currentRole,
  activeBranch,
  stockItems,
  orders,
  transfers,
  approvals,
  activities,
  onAddNewOrder,
  onUpdateOrderStatus,
  onAddNewApprovalRequest,
  onUpdateTransferStatus,
  onAddDirectActivity,
  formatPKR,
}: ManagerOnsiteDeskProps) {
  // 1. STATE FOR POS CHECKOUT (Karachi Manager / Islamabad Manager / Custom Retail)
  const [posCustomerName, setPosCustomerName] = useState("");
  const [posCustomerPhone, setPosCustomerPhone] = useState("");
  const [posSelectedItemId, setPosSelectedItemId] = useState("");
  const [posQuantity, setPosQuantity] = useState(1);
  const [posPaymentType, setPosPaymentType] = useState<"Cash" | "Bank Transfer">("Cash");
  const [posSuccessMsg, setPosSuccessMsg] = useState("");

  // 2. STATE FOR DISCOUNT REQUEST (Islamabad Showroom / Retail)
  const [discSelectedItemId, setDiscSelectedItemId] = useState("");
  const [discCustomerName, setDiscCustomerName] = useState("");
  const [discPercent, setDiscPercent] = useState(10); // e.g. 10%
  const [discJustification, setDiscJustification] = useState("");
  const [discSuccessMsg, setDiscSuccessMsg] = useState("");

  // 3. STATE FOR LAHORE WAREHOUSE TIMBER RECEIPTS & LOGS
  const [timbers, setTimbers] = useState<TimberRecord[]>([
    { id: "TMB-01", woodType: "High-Grit Sheesham", sourceForest: "Changa Manga Forest Complex", volumeCFT: 450, seasoningProgress: 85, status: "Seasoning", dateIngested: "2026-05-10" },
    { id: "TMB-02", woodType: "Premium Red Oak Wood", sourceForest: "Northern Dir Valleys", volumeCFT: 280, seasoningProgress: 100, status: "Cured", dateIngested: "2026-04-20" },
    { id: "TMB-03", woodType: "Seasoned Scented Cedar", sourceForest: "Kaghan Highlands Timber", volumeCFT: 600, seasoningProgress: 40, status: "Seasoning", dateIngested: "2026-05-24" }
  ]);
  const [newTimberType, setNewTimberType] = useState("Premium Seasoned Walnut");
  const [newTimberSource, setNewTimberSource] = useState("Kashmir Highland Woods");
  const [newTimberVol, setNewTimberVol] = useState(300);

  // 4. LOCAL VIP BOOKINGS FOR ISLAMABAD SHOWROOM
  const [vipBookings, setVipBookings] = useState<VIPBooking[]>([
    { id: "VIP-101", clientName: "Justice (R) Shakirullah", phone: "0300-8889922", preferredDate: "2026-05-30", preferredTime: "04:30 PM", furnitureInterest: "Walnut Dining Set & Lounge chairs", status: "Booked", representative: "Bilal Dar" },
    { id: "VIP-102", clientName: "Embassy Secretary Dr. Hans", phone: "0321-5556600", preferredDate: "2026-06-02", preferredTime: "11:00 AM", furnitureInterest: "Red Oak Double Desk & Leather Chair", status: "Booked", representative: "Bilal Dar" }
  ]);
  const [vipName, setVipName] = useState("");
  const [vipPhone, setVipPhone] = useState("");
  const [vipDate, setVipDate] = useState("2026-05-30");
  const [vipInterest, setVipInterest] = useState("");

  // 5. VEHICLE FLEET MANAGEMENT FOR LAHORE CENTRAL WAREHOUSE
  const [selectedFleetTruck, setSelectedFleetTruck] = useState<Record<string, string>>({});

  // Trigger Local POS retail sales order submission
  const handlePOSCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!posSelectedItemId) return;

    const chosenItem = stockItems.find((itm) => itm.id === posSelectedItemId)!;
    const currentStock = chosenItem.stockByBranch[activeBranch] || 0;

    if (currentStock < posQuantity) {
      alert(`POS Error: Only ${currentStock} units of ${chosenItem.name} left in store. Choose a lower volume or request a Headquarters Stock Transfer.`);
      return;
    }

    const totalBill = chosenItem.pricePKR * posQuantity;
    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const freshOrder: Order = {
      id: newOrderId,
      customerName: posCustomerName,
      customerPhone: posCustomerPhone,
      branch: activeBranch,
      items: [{ itemId: posSelectedItemId, quantity: posQuantity, agreedPricePKR: chosenItem.pricePKR }],
      totalPKR: totalBill,
      orderDate: new Date().toISOString().split("T")[0],
      expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split("T")[0], // Onsite retail delivery 3 days
      status: "In Preparation",
      paymentType: posPaymentType,
    };

    onAddNewOrder(freshOrder);

    // Record local POS activity
    const activity: StaffActivity = {
      id: `ACT-${Math.floor(600 + Math.random() * 300)}`,
      timestamp: new Date().toISOString(),
      staffName: currentRole === "Owner" ? "Global CEO Onsite Desk" : `${activeBranch.split(" ")[0]} Manager`,
      branch: activeBranch,
      action: `Processed Walk-in POS Retail checkout (${newOrderId}) for ${posCustomerName}. Value: ${formatPKR(totalBill)}`,
      status: "Success",
    };
    onAddDirectActivity(activity);

    setPosSuccessMsg(`Point of Sale checkout success! Order ${newOrderId} generated for ${posCustomerName}. Showroom inventory adjusted.`);
    setPosCustomerName("");
    setPosCustomerPhone("");
    setPosQuantity(1);
    setPosSelectedItemId("");

    setTimeout(() => {
      setPosSuccessMsg("");
    }, 5000);
  };

  // Submit a customer special discount request from Islamabad Showroom Manager Desk
  const handleRequestDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discSelectedItemId) return;

    const chosenItem = stockItems.find((itm) => itm.id === discSelectedItemId)!;
    const originalPrice = chosenItem.pricePKR;
    const calculatedDiscountAmount = originalPrice * (discPercent / 100);

    const newApprovalId = `APP-${Math.floor(4000 + Math.random() * 999)}`;
    const newOrderId = `ORD-${Math.floor(9000 + Math.random() * 1000)}`;

    const freshDraftOrder: Order = {
      id: newOrderId,
      customerName: discCustomerName,
      customerPhone: "VIP Client Request-Inquiry",
      branch: activeBranch,
      items: [{ itemId: discSelectedItemId, quantity: 1, agreedPricePKR: originalPrice - calculatedDiscountAmount }],
      totalPKR: originalPrice - calculatedDiscountAmount,
      orderDate: new Date().toISOString().split("T")[0],
      expectedDeliveryDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split("T")[0],
      status: "Pending Approval",
      paymentType: "Bank Transfer",
    };

    // 1. Add order draft that is locked
    onAddNewOrder(freshDraftOrder);

    // 2. Submit formal executive approval request
    const discountRequest: ManagerApproval = {
      id: newApprovalId,
      type: "Discount Request",
      branch: activeBranch,
      details: `${discPercent}% Sales Discount request for customer "${discCustomerName}" on ${chosenItem.name}. Justification: ${discJustification}`,
      requestedBy: currentRole === "Owner" ? "Global Director" : "Bilal Dar (Islamabad Manager)",
      amountPKR: calculatedDiscountAmount,
      itemId: discSelectedItemId,
      qty: 1,
      status: "Pending",
      dateCreated: new Date().toISOString().split("T")[0],
      relatedId: newOrderId,
    };
    onAddNewApprovalRequest(discountRequest);

    // Log Activity
    onAddDirectActivity({
      id: `ACT-${Math.floor(700 + Math.random() * 300)}`,
      timestamp: new Date().toISOString(),
      staffName: "Bilal Dar (Islamabad manager Desk)",
      branch: activeBranch,
      action: `Locked order ${newOrderId} and initiated CEO discount clearance code ${newApprovalId} for ${discCustomerName}.`,
      status: "Pending",
    });

    setDiscSuccessMsg(`Discount request queued for CEO approval! Locked Invoice ID: ${newOrderId}. Approval Key: ${newApprovalId}`);
    setDiscCustomerName("");
    setDiscSelectedItemId("");
    setDiscJustification("");

    setTimeout(() => {
      setDiscSuccessMsg("");
    }, 6000);
  };

  // Add timber receipt at Lahore central warehouse
  const handleTimberIngestion = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `TMB-${Math.floor(10 + Math.random() * 89)}`;
    const newRecord: TimberRecord = {
      id: newId,
      woodType: newTimberType,
      sourceForest: newTimberSource,
      volumeCFT: newTimberVol,
      seasoningProgress: 10,
      status: "Seasoning",
      dateIngested: new Date().toISOString().split("T")[0],
    };

    setTimbers((prev) => [newRecord, ...prev]);

    onAddDirectActivity({
      id: `ACT-${Math.floor(500 + Math.random() * 400)}`,
      timestamp: new Date().toISOString(),
      staffName: "Azeem Butt",
      branch: BranchName.LahoreWarehouse,
      action: `Ingested ${newTimberVol} CFT raw logs of ${newTimberType} from ${newTimberSource} into seasoning kilns.`,
      status: "Success",
    });

    setNewTimberSource("");
  };

  // Advance timber curing progress manually
  const handleAdvanceTimberCuring = (id: string) => {
    setTimbers((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextProg = Math.min(t.seasoningProgress + 30, 100);
          const nextStatus = nextProg === 100 ? "Cured" : t.status;
          return {
            ...t,
            seasoningProgress: nextProg,
            status: nextStatus,
          };
        }
        return t;
      })
    );

    const tmb = timbers.find(t => t.id === id)!;
    onAddDirectActivity({
      id: `ACT-${Math.floor(500 + Math.random() * 400)}`,
      timestamp: new Date().toISOString(),
      staffName: "Azeem Butt",
      branch: BranchName.LahoreWarehouse,
      action: `Advanced curing seasoning moisture release for raw logging batch ${id} to ${Math.min(tmb.seasoningProgress + 30, 100)}%`,
      status: "Success",
    });
  };

  // Switch timber to Mill Ready
  const handleMillReadyTimber = (id: string) => {
    setTimbers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Mill Ready" as const } : t))
    );

    onAddDirectActivity({
      id: `ACT-${Math.floor(500 + Math.random() * 400)}`,
      timestamp: new Date().toISOString(),
      staffName: "Carpentry Team",
      branch: BranchName.LahoreWarehouse,
      action: `Released wood timber batch ${id} from curing tunnels directly into main lathe cutting mills for Sheesham structure frame milling.`,
      status: "Success",
    });
  };

  // Ingest VIP customer consultation schedule
  const handleAddVIPBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vipName) return;

    const newBooking: VIPBooking = {
      id: `VIP-${Math.floor(110 + Math.random() * 50)}`,
      clientName: vipName,
      phone: vipPhone,
      preferredDate: vipDate,
      preferredTime: "02:00 PM",
      furnitureInterest: vipInterest || "Bespoke Sheesham Canopy Frame",
      status: "Booked",
      representative: "Bilal Dar (Islamabad)",
    };

    setVipBookings((prev) => [newBooking, ...prev]);

    onAddDirectActivity({
      id: `ACT-${Math.floor(500 + Math.random() * 400)}`,
      timestamp: new Date().toISOString(),
      staffName: "Bilal Dar",
      branch: BranchName.IslamabadShowroom,
      action: `Scheduled high-ticket VIP on-site consultative check on ${vipDate} for client: ${vipName}`,
      status: "Success",
    });

    setVipName("");
    setVipPhone("");
    setVipInterest("");
  };

  return (
    <div className="space-y-6" id="onsite-manager-panel">
      {/* Upper Status Cards indicating current manager's login perspective */}
      <div className="bg-[#1C1C1C] border border-white/5 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#C5A059]/10 rounded border border-[#C5A059]/20">
            <ClipboardList className="w-6 h-6 text-[#C5A059]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif italic font-bold text-base sm:text-lg text-white">
                {currentRole === "Owner"
                  ? "Enterprise Master Operator Console"
                  : currentRole === "KarachiManager"
                  ? "Sohail Shah's Desk (Karachi Branch)"
                  : currentRole === "LahoreManager"
                  ? "Azeem Butt's Desk (Lahore Central Hub)"
                  : "Bilal Dar's Desk (Islamabad Region)"}
              </h3>
              <span className="text-[10px] bg-emerald-950/20 text-emerald-400 border border-emerald-900/40 rounded py-0.5 px-2.5 font-mono uppercase tracking-wider font-bold animate-pulse">
                AUTHORIZED
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Adaptable workspace displaying live on-site actions, Point-of-Sale checkouts, and dispatch boards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#0F0F0F] rounded-lg p-2.5 border border-white/5 font-mono text-[10px] text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
          <span>Active Operations Terminal</span>
        </div>
      </div>

      {/* -------------------- VIEW 1: KARACHI SHOWROOM MANAGER DESK WORKINGS -------------------- */}
      {(currentRole === "KarachiManager" || currentRole === "Owner") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section A: Live Showroom POS cashier */}
          <div className="lg:col-span-2 bg-[#151515] border border-white/5 rounded-xl p-5 space-y-4">
            <div className="border-b border-white/5 pb-3">
              <h4 className="font-serif italic font-bold text-sm sm:text-base text-[#C5A059] flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#C5A059]" />
                Karachi Direct POS Counter (Cash Desk)
              </h4>
              <p className="text-[10px] text-neutral-500 mt-0.5">Direct checkout counter for showroom walk-in visitors. Decrements live floor stock instantly.</p>
            </div>

            {posSuccessMsg && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded text-emerald-400 text-xs flex items-center gap-2 font-mono">
                <Check className="w-4 h-4 shrink-0" />
                <span>{posSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handlePOSCheckout} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Client Name</label>
                  <input
                    type="text"
                    required
                    value={posCustomerName}
                    onChange={(e) => setPosCustomerName(e.target.value)}
                    placeholder="e.g. Tariq Jameel Sahab"
                    className="w-full bg-[#0F0F0F] border border-white/5 focus:border-[#C5A059]/40 rounded py-2 px-3 text-xs text-stone-200 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={posCustomerPhone}
                    onChange={(e) => setPosCustomerPhone(e.target.value)}
                    placeholder="e.g. 0321-4455889"
                    className="w-full bg-[#0F0F0F] border border-white/5 focus:border-[#C5A059]/40 rounded py-2 px-3 text-xs text-stone-200 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Select Fine Furniture Piece</label>
                  <select
                    required
                    value={posSelectedItemId}
                    onChange={(e) => setPosSelectedItemId(e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-white/5 focus:border-[#C5A059]/40 rounded py-2.5 px-3 text-xs text-neutral-300 outline-none cursor-pointer"
                  >
                    <option value="">-- Choose local Floor stock --</option>
                    {stockItems.map((itm) => {
                      const stockVal = itm.stockByBranch[BranchName.KarachiShowroom] || 0;
                      return (
                        <option key={itm.id} value={itm.id} disabled={stockVal === 0}>
                          {itm.id} - {itm.name} ({stockVal} left) - {formatPKR(itm.pricePKR)}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Qty</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={posQuantity}
                    onChange={(e) => setPosQuantity(Number(e.target.value))}
                    className="w-full bg-[#0F0F0F] border border-white/5 focus:border-[#C5A059]/40 rounded py-2 px-3 text-xs text-stone-200 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-stone-400 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="posPayment"
                      checked={posPaymentType === "Cash"}
                      onChange={() => setPosPaymentType("Cash")}
                      className="accent-[#C5A059]"
                    />
                    <span>Showroom Physical Cash</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-stone-400 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="posPayment"
                      checked={posPaymentType === "Bank Transfer"}
                      onChange={() => setPosPaymentType("Bank Transfer")}
                      className="accent-[#C5A059]"
                    />
                    <span>Bank Transfer Payment</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="py-2 px-5 rounded bg-[#C5A059] text-[#0F0F0F] text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#b08c48] transition-colors cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Submit POS Checkout</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section B: Delivery dispatch dispatch progress tracker for Karachi orders */}
          <div className="bg-[#151515] border border-white/5 rounded-xl p-5 space-y-4">
            <div className="border-b border-white/5 pb-3">
              <h4 className="font-serif italic font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C5A059]" />
                Karachi Fleet Dispatch Board
              </h4>
              <p className="text-[10px] text-neutral-500 mt-0.5">Control order lifecycle dispatch status logic on-site.</p>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {orders.filter(o => o.branch === BranchName.KarachiShowroom).length === 0 ? (
                <p className="text-stone-500 text-xs italic p-4 text-center">No orders allocated on Karachi desk ledger.</p>
              ) : (
                orders.filter(o => o.branch === BranchName.KarachiShowroom).map((o) => {
                  return (
                    <div key={o.id} className="p-3 bg-[#0F0F0F] border border-white/5 rounded space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[9px] text-[#C5A059]">{o.id}</span>
                        <span className={`text-[9px] font-mono uppercase px-1.5 rounded ${
                          o.status === "Delivered" ? "bg-green-950/20 text-emerald-400 border border-green-900/30" : "bg-zinc-850 text-[#C5A059]/80"
                        }`}>{o.status}</span>
                      </div>
                      <div className="font-medium text-[#E5E5E5]">{o.customerName}</div>
                      
                      <div className="flex gap-1.5 justify-end pt-1">
                        {o.status === "In Preparation" && (
                          <button
                            onClick={() => onUpdateOrderStatus(o.id, "Dispatched")}
                            className="bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/35 py-1 px-2.5 rounded text-[9px] font-mono uppercase font-bold tracking-wider"
                          >
                            Mark Dispatched
                          </button>
                        )}
                        {o.status === "Dispatched" && (
                          <button
                            onClick={() => onUpdateOrderStatus(o.id, "Delivered")}
                            className="bg-green-950/20 hover:bg-green-950/40 text-emerald-400 border border-emerald-900/30 py-1 px-2.5 rounded text-[9px] font-mono uppercase font-bold tracking-wider animate-pulse"
                          >
                            Confirm Delivered
                          </button>
                        )}
                        {o.status === "Delivered" && (
                          <span className="text-[9px] text-zinc-500 italic block py-0.5">Delivery complete</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------- VIEW 2: LAHORE CENTRAL WAREHOUSE DESK WORKINGS -------------------- */}
      {(currentRole === "LahoreManager" || currentRole === "Owner") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section A: Ingestion of forestry wood lots */}
          <div className="bg-[#151515] border border-white/5 rounded-xl p-5 space-y-4">
            <div className="border-b border-white/5 pb-3">
              <h4 className="font-serif italic font-bold text-sm sm:text-base text-[#C5A059] flex items-center gap-2">
                <Hammer className="w-4 h-4 text-[#C5A059]" />
                Lahore Timber Ingestion Console
              </h4>
              <p className="text-[10px] text-neutral-500 mt-0.5">Log in shipments of raw Sheesham, Rosewood, and Walnut timber harvested from forestry centers.</p>
            </div>

            <form onSubmit={handleTimberIngestion} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Select Wood Variety</label>
                <select
                  required
                  value={newTimberType}
                  onChange={(e) => setNewTimberType(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-white/5 rounded py-2 px-3 text-stone-300 outline-none"
                >
                  <option value="Premium Seasoned Walnut">Premium Seasoned Walnut</option>
                  <option value="Raw Pure Sheesham Wood (Rosewood)">Raw Pure Sheesham Wood (Rosewood)</option>
                  <option value="Solid Wild Acacia Block">Solid Wild Acacia Block</option>
                  <option value="Aromatic Royal Deodar Wood">Aromatic Royal Deodar Wood</option>
                  <option value="Changa Manga Red Mulberry wood">Changa Manga Red Mulberry wood</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Source Forestry complex</label>
                <input
                  type="text"
                  required
                  value={newTimberSource}
                  onChange={(e) => setNewTimberSource(e.target.value)}
                  placeholder="e.g. Northern Dir Valley High Timber"
                  className="w-full bg-[#0F0F0F] border border-white/5 focus:border-[#C5A059]/40 rounded py-2 px-3 text-stone-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Volume (CFT - Cubic Feet)</label>
                <input
                  type="number"
                  min="50"
                  max="5000"
                  required
                  value={newTimberVol}
                  onChange={(e) => setNewTimberVol(Number(e.target.value))}
                  className="w-full bg-[#0F0F0F] border border-white/5 focus:border-[#C5A059]/40 rounded py-2 px-3 text-stone-200 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 bg-[#C5A059] text-[#0F0F0F] font-mono uppercase text-[10px] font-bold tracking-widest flex items-center justify-center gap-2 hover:bg-[#b08c48] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ingest Forest Logging Batch</span>
              </button>
            </form>
          </div>

          {/* Section B: Kiln Moisture and Curing Progress (Timber Records) */}
          <div className="lg:col-span-2 bg-[#151515] border border-white/5 rounded-xl p-5 space-y-4">
            <div className="border-b border-white/5 pb-3">
              <h4 className="font-serif italic font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C5A059]" />
                Lahore Kiln Seasoning & Moisture Control Ledger
              </h4>
              <p className="text-[10px] text-neutral-500 mt-0.5">Automated curing logs monitoring Sheesham & Walnut humidity release before lathe carving begins.</p>
            </div>

            <div className="space-y-3 max-h-[340px] overflow-y-auto">
              {timbers.map((t) => {
                return (
                  <div key={t.id} className="p-4 bg-[#0F0F0F] border border-white/5 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono bg-zinc-800 text-[#C5A059]/90 border border-white/5 rounded py-0.5 px-2">{t.id}</span>
                        <strong className="text-stone-100 text-sm">{t.woodType}</strong>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        Source: {t.sourceForest} | Log Volume: <strong>{t.volumeCFT} CFT</strong> | Date Ingested: {t.dateIngested}
                      </p>
                      
                      {/* Visual progress bar */}
                      <div className="pt-2 flex items-center gap-2">
                        <span className="text-[9px] font-mono text-zinc-400">Moisture Release Curing Stage:</span>
                        <div className="h-1.5 w-40 bg-[#151515] border border-white/5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#C5A059] h-full rounded-full transition-all duration-500"
                            style={{ width: `${t.seasoningProgress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-[#C5A059] font-bold">{t.seasoningProgress}%</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {t.status === "Seasoning" && (
                        <button
                          onClick={() => handleAdvanceTimberCuring(t.id)}
                          className="py-1 px-2.5 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/35 hover:border-[#C5A059] rounded text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Heat Curing (+30%)
                        </button>
                      )}
                      {t.status === "Cured" && (
                        <button
                          onClick={() => handleMillReadyTimber(t.id)}
                          className="py-1 px-3 bg-green-950/20 hover:bg-green-950/30 text-emerald-400 border border-green-900/30 rounded text-[10px] font-mono uppercase tracking-wider transition-colors animate-pulse cursor-pointer"
                        >
                          Release to Lathe Mill
                        </button>
                      )}
                      {t.status === "Mill Ready" && (
                        <span className="py-1 px-3 bg-zinc-800 text-zinc-500 rounded text-[10px] font-mono uppercase tracking-wider border border-white/5">
                          In Lathe Woodwork
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* -------------------- VIEW 3: ISLAMABAD SHOWROOM MANAGER DESK WORKINGS -------------------- */}
      {(currentRole === "IslamabadManager" || currentRole === "Owner") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section A: Onsite VIP Consult Scheduler */}
          <div className="bg-[#151515] border border-white/5 rounded-xl p-5 space-y-4">
            <div className="border-b border-white/5 pb-3">
              <h4 className="font-serif italic font-bold text-sm sm:text-base text-[#C5A059] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                VIP High-Ticket Consultation Scheduler
              </h4>
              <p className="text-[10px] text-neutral-500 mt-0.5">Register high-profile bureaucrats, diplomats, and luxury buyers for private showroom reviews.</p>
            </div>

            <form onSubmit={handleAddVIPBooking} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Dignitary / Guest Name</label>
                <input
                  type="text"
                  required
                  value={vipName}
                  onChange={(e) => setVipName(e.target.value)}
                  placeholder="e.g. Senator Chaudhry Nisar"
                  className="w-full bg-[#0F0F0F] border border-white/5 focus:border-[#C5A059]/40 rounded py-2 px-3 text-stone-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Client Contact Phone</label>
                <input
                  type="text"
                  required
                  value={vipPhone}
                  onChange={(e) => setVipPhone(e.target.value)}
                  placeholder="e.g. 0333-5123450"
                  className="w-full bg-[#0F0F0F] border border-white/5 focus:border-[#C5A059]/40 rounded py-2 px-3 text-stone-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Preferred Visit Date</label>
                <input
                  type="date"
                  required
                  value={vipDate}
                  onChange={(e) => setVipDate(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-white/5 rounded py-2 px-3 text-stone-200 outline-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Furniture Focus / Interest</label>
                <input
                  type="text"
                  required
                  value={vipInterest}
                  onChange={(e) => setVipInterest(e.target.value)}
                  placeholder="e.g. Bespoke 12-Chair Mughal Dining Table"
                  className="w-full bg-[#0F0F0F] border border-white/5 focus:border-[#C5A059]/40 rounded py-2 px-3 text-stone-200 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#C5A059] text-[#0F0F0F] font-mono uppercase text-[10px] font-bold tracking-widest flex items-center justify-center gap-2 hover:bg-[#b08c48] cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Confirm VIP Seat Schedule</span>
              </button>
            </form>
          </div>

          {/* Section B: Diplomatic discount approval trigger */}
          <div className="bg-[#151515] border border-white/5 rounded-xl p-5 space-y-4">
            <div className="border-b border-white/5 pb-3">
              <h4 className="font-serif italic font-bold text-sm sm:text-base text-[#C5A059] flex items-center gap-2">
                <BadgePercent className="w-4 h-4 text-[#C5A059]" />
                HQ Special Discount Request Terminal
              </h4>
              <p className="text-[10px] text-neutral-500 mt-0.5">Submit custom discount codes and justification directly to Owner/CEO for fast release.</p>
            </div>

            {discSuccessMsg && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded text-emerald-400 text-xs flex gap-2 font-mono">
                <Check className="w-4 h-4 shrink-0" />
                <span className="line-clamp-2">{discSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleRequestDiscount} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Client Name</label>
                <input
                  type="text"
                  required
                  value={discCustomerName}
                  onChange={(e) => setDiscCustomerName(e.target.value)}
                  placeholder="e.g. Federal Minister Khawaja"
                  className="w-full bg-[#0F0F0F] border border-white/5 focus:border-[#C5A059]/40 rounded py-2 px-3 text-stone-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Select Product</label>
                  <select
                    required
                    value={discSelectedItemId}
                    onChange={(e) => setDiscSelectedItemId(e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-white/5 rounded py-2 px-2.5 text-stone-300 outline-none text-xs"
                  >
                    <option value="">-- Choose --</option>
                    {stockItems.map((itm) => (
                      <option key={itm.id} value={itm.id}>
                        {itm.id} - {itm.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Discount %</label>
                  <select
                    value={discPercent}
                    onChange={(e) => setDiscPercent(Number(e.target.value))}
                    className="w-full bg-[#0F0F0F] border border-white/5 rounded py-2 px-2.5 text-stone-300 outline-none text-xs"
                  >
                    <option value="5">5% discount</option>
                    <option value="10">10% discount</option>
                    <option value="15">15% discount</option>
                    <option value="20">20% Master Special</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Official Justification</label>
                <textarea
                  required
                  rows={2}
                  value={discJustification}
                  onChange={(e) => setDiscJustification(e.target.value)}
                  placeholder="e.g. Federal budget commission officer. Bulk delivery reference package."
                  className="w-full bg-[#0F0F0F] border border-white/5 focus:border-[#C5A059]/40 rounded py-2 px-3 text-stone-200 outline-none resize-none text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#C5A059] text-[#0F0F0F] font-mono uppercase text-[10px] font-bold tracking-widest flex items-center justify-center gap-2 hover:bg-[#b08c48] cursor-pointer"
              >
                <BadgePercent className="w-4 h-4" />
                <span>Submit Discount Request</span>
              </button>
            </form>
          </div>

          {/* Section C: VIP Consultation List */}
          <div className="bg-[#151515] border border-white/5 rounded-xl p-5 space-y-4">
            <div className="border-b border-white/5 pb-3">
              <h4 className="font-serif italic font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#C5A059]" />
                Registered high-value VIP Bookings
              </h4>
              <p className="text-[10px] text-neutral-500 mt-0.5">Live roster for showroom diplomatic hosts.</p>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {vipBookings.map((b) => (
                <div key={b.id} className="p-3 bg-[#0F0F0F] border border-white/5 rounded text-xs space-y-1 group">
                  <div className="flex justify-between items-center bg-zinc-900 -mx-3 -mt-3 p-2 border-b border-white/5">
                    <span className="font-mono text-[9px] text-[#C5A059] font-bold">{b.id}</span>
                    <span className="text-[9px] font-mono text-zinc-500 italic">Rep: {b.representative}</span>
                  </div>
                  <div className="font-semibold text-stone-100 group-hover:text-[#C5A059] transition-colors">{b.clientName}</div>
                  <div className="text-zinc-400 text-[11px]">Interest: <strong>{b.furnitureInterest}</strong></div>
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500 pt-1 border-t border-white/[0.03]">
                    <span>{b.preferredDate} ({b.preferredTime})</span>
                    <span className="text-emerald-500">Confirmed Booking</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ManagerOnsiteDesk;
