import React, { useState, useRef } from "react";
import { CreditCard, FileText, CheckCircle, Printer, Download, ArrowRight, CornerDownRight, Landmark, BadgePercent, Send, Sparkles } from "lucide-react";
import { Order, StockItem, BranchName } from "../types";

interface DigitalInvoiceCenterProps {
  orders: Order[];
  stockItems: StockItem[];
  activeBranch: BranchName;
  formatPKR: (num: number) => string;
}

export default function DigitalInvoiceCenter({ orders, stockItems, activeBranch, formatPKR }: DigitalInvoiceCenterProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || "");
  const [taxRate, setTaxRate] = useState<number>(18); // default 18% GST in Pakistan
  const [signatureDone, setSignatureDone] = useState<boolean>(false);
  const [isThermalView, setIsThermalView] = useState<boolean>(false);
  const [customDiscount, setCustomDiscount] = useState<number>(0);
  const [showInvoiceSentMsg, setShowInvoiceSentMsg] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Active chosen order
  const order = orders.find(o => o.id === selectedOrderId);

  // Drawing canvas signature simulation
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#C5A059";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const drawSignature = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setSignatureDone(true);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDone(false);
  };

  // Calculations
  const getCalculatedValues = () => {
    if (!order) return { subtotal: 0, discount: 0, tax: 0, grandTotal: 0 };
    const subtotal = order.totalPKR; // order total has subtotal
    const discount = (subtotal * (customDiscount / 100));
    const tax = ((subtotal - discount) * (taxRate / 100));
    const grandTotal = subtotal - discount + tax;
    return { subtotal, discount, tax, grandTotal };
  };

  const { subtotal, discount, tax, grandTotal } = getCalculatedValues();

  return (
    <div className="space-y-6 select-text">
      
      {/* Search selection tools */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-[#151515] p-4 rounded-xl border border-white/5 font-mono text-xs items-center">
        <div className="space-y-1">
          <label className="text-[9px] text-stone-400 uppercase tracking-wider font-bold block">Focus Sales Order Ticket ID</label>
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="w-full bg-[#0F0F0F] border border-white/5 p-2 rounded text-xs text-stone-300 outline-none"
          >
            {orders.map(o => (
              <option key={o.id} value={o.id}>{o.id} - {o.customerName} ({o.branch.split(" ")[0]})</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] text-[#C5A059] uppercase tracking-wider font-bold block">Pakistan Sales Tax Adjustment %</label>
          <select
            value={taxRate}
            onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)}
            className="w-full bg-[#0F0F0F] border border-white/5 p-2 rounded text-xs text-white"
          >
            <option value="18">18% GST (Standard Punjab/Sindh Retail)</option>
            <option value="15">15% GST (Reduced B2B Contract)</option>
            <option value="0">0% Zero-Rated (Tax Exempt Diplomatic)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] text-stone-400 uppercase tracking-wider block">Additional Spot Discount %</label>
          <input
            type="number"
            min="0"
            max="25"
            value={customDiscount}
            onChange={(e) => setCustomDiscount(Math.min(25, parseInt(e.target.value) || 0))}
            placeholder="0"
            className="w-full bg-[#0F0F0F] border border-white/5 p-2 rounded text-xs text-white outline-none"
          />
        </div>

        <div className="flex gap-2 justify-end self-end">
          <button
            onClick={() => setIsThermalView(prev => !prev)}
            className="py-2 px-3 bg-[#0F0F0F] hover:bg-[#1A1A1A] text-stone-300 border border-white/5 hover:border-[#C5A059]/30 rounded text-xs uppercase font-bold cursor-pointer font-mono"
          >
            {isThermalView ? "Show Letterhead PDF" : "Show Thermal Receipt"}
          </button>
        </div>
      </div>

      {order ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Visual Print Output layout rendering (Col-7) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            
            {showInvoiceSentMsg && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-900 rounded-xl text-emerald-300 text-xs flex items-center gap-2 mb-4 font-mono">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Invoice message sent via WhatsApp to {order.customerPhone}. Dispatch cleared.</span>
              </div>
            )}

            {isThermalView ? (
              /* THERMAL RECEIPT VIEW (3-inch POS printer simulation) */
              <div className="bg-[#FFFFFE] text-black p-6 font-mono text-[11px] select-text shadow-2xl max-w-sm mx-auto border-t-8 border-[#C5A059] space-y-4">
                <div className="text-center font-bold">
                  <h4 className="text-sm font-serif italic tracking-wide">WOOD WORLD ENTERPRISE</h4>
                  <p className="text-[9px] uppercase tracking-widest mt-0.5">Showroom POS Node Terminal</p>
                  <p className="text-[9px] tracking-tight">{order.branch}</p>
                </div>

                <div className="border-b-2 border-dashed border-zinc-300 pb-2 text-[10px]">
                  <p>Invc Ref: {order.id}</p>
                  <p>Date: {order.orderDate}</p>
                  <p>Loader: VIP Carriage Gate</p>
                  <p>Client: {order.customerName}</p>
                  <p>Phone: {order.customerPhone}</p>
                </div>

                {/* Receipt Items list */}
                <div className="space-y-1.5 py-1 text-[10px]">
                  {order.items.map((it, idx) => {
                    const matchItem = stockItems.find(s => s.id === it.itemId);
                    return (
                      <div key={idx} className="flex justify-between font-medium">
                        <span className="truncate pr-3">
                          {idx+1}. {matchItem?.name || "Premium Item"} x {it.quantity}
                        </span>
                        <span>₨ {(it.agreedPricePKR * it.quantity).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Subordinate Taxes and Total list */}
                <div className="border-t border-dashed border-zinc-300 pt-2 text-right space-y-1 text-[10px]">
                  <p>Subtotal: ₨ {subtotal.toLocaleString()}</p>
                  {customDiscount > 0 && <p className="text-red-650">Spot Disc ({customDiscount}%): -₨ {discount.toLocaleString()}</p>}
                  <p className="font-bold">GST Tax ({taxRate}%): ₨ {tax.toLocaleString()}</p>
                  <div className="border-t-2 border-dashed border-zinc-400 pt-1.5 text-xs font-bold text-center block bg-zinc-100 p-1 rounded">
                    GRAND TOTAL: ₨ {grandTotal.toLocaleString()}
                  </div>
                </div>

                <div className="text-center text-[8px] pt-4 leading-normal space-y-1 border-t border-dashed border-zinc-200">
                  <p>★ ALL WOOD SEASONING CLEARANCE 5-YEAR WARRANTY ★</p>
                  <p>Settle payment balances as per contract program.</p>
                  <p>Thank you for buying Wood World fine woodworking!</p>
                </div>
              </div>
            ) : (
              /* PREMIUM LETTERHEAD PDF VIEW */
              <div className="bg-[#121212] border border-white/5 p-8 rounded-2xl space-y-6 shadow-xl relative overflow-hidden text-neutral-300 select-text">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#C5A059]/10 blur-3xl"></div>
                
                {/* PDF Header Logo and address */}
                <div className="flex justify-between items-start border-b border-white/5 pb-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#C5A059] rounded-xs flex items-center justify-center">
                        <span className="text-xs text-[#0F0F0F] font-bold">W</span>
                      </div>
                      <span className="text-base font-serif italic font-bold tracking-tight text-white">Wood World Enterprise</span>
                    </div>
                    <p className="text-[9px] font-mono text-stone-500 uppercase tracking-widest mt-1">Luxury Furniture • Seasoned Craftsmanship</p>
                  </div>

                  <div className="text-right font-mono text-[9px] text-stone-550 leading-normal">
                    <p>HQ Office Address: II Chundrigar Rd, Karachi, Pakistan</p>
                    <p>Phone: 021-34582910 | Email: office@woodworld-hq.com.pk</p>
                  </div>
                </div>

                {/* Invoice Meta information */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-stone-500 block">PATRON INFO</span>
                    <strong className="text-stone-200 font-sans block text-sm mt-0.5">{order.customerName}</strong>
                    <p className="text-stone-400 mt-1 leading-normal font-sans">Shipment Address: {order.customerPhone ? "DHA Complex Residency Site Area" : "Showroom Pick-Up"}</p>
                    <p className="text-stone-500 mt-0.5 font-mono text-[10.5px]">Client Cell No: {order.customerPhone}</p>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[9px] uppercase tracking-wider text-stone-500 block">OFFICIAL MEMORANDUM</span>
                    <strong className="text-white text-sm block mt-0.5">{order.id}</strong>
                    <p className="text-stone-400 mt-1">Stamp Date: {order.orderDate}</p>
                    <p className="text-[#C5A059] font-bold">Payment channel: {order.paymentType}</p>
                  </div>
                </div>

                {/* Ledger Items Table */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block font-mono">BOOKED CATALOG ASSETS</span>
                  
                  <div className="w-full border border-white/5 rounded-xl overflow-hidden font-mono text-xs">
                    <div className="grid grid-cols-4 bg-[#0A0A0A] p-2.5 text-[9px] uppercase tracking-wider text-stone-550 font-bold border-b border-white/5">
                      <span>Item / Spec</span>
                      <span className="text-center">Rate (PKR)</span>
                      <span className="text-center">Qty</span>
                      <span className="text-right">Total (PKR)</span>
                    </div>

                    {order.items.map((it, idx) => {
                      const matchItem = stockItems.find(s => s.id === it.itemId);
                      return (
                        <div key={idx} className="grid grid-cols-4 p-3 border-b border-white/5 last:border-none hover:bg-white/[0.01]">
                          <div className="font-sans">
                            <strong className="text-stone-200 text-xs block">{matchItem?.name || "Furniture Catalog Asset"}</strong>
                            <span className="text-[10px] font-mono text-stone-550">Material: {matchItem?.woodType} • ID: {it.itemId}</span>
                          </div>
                          <span className="text-center self-center">{formatPKR(it.agreedPricePKR)}</span>
                          <span className="text-center self-center">{it.quantity}</span>
                          <span className="text-right self-center text-[#C5A059] font-bold">{formatPKR(it.agreedPricePKR * it.quantity)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Summary Math Block */}
                <div className="grid grid-cols-2 gap-4 items-end pt-4 border-t border-white/5 font-mono">
                  
                  {/* Digital Signature box inside invoice */}
                  <div className="space-y-1 text-left self-start">
                    <span className="text-[9px] text-stone-500 uppercase font-bold block mb-1">Authentic Client Authorization Sign</span>
                    {signatureDone ? (
                      <div className="p-3 bg-[#0A0A0A] border border-[#C5A059]/30 rounded-lg text-center text-xs text-[#C5A059] font-sans flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Client authorization signature secured • Certified Ledger Document</span>
                      </div>
                    ) : (
                      <div className="p-3 bg-[#0A0A0A] border border-red-500/20 border-dashed rounded-lg text-center text-[10px] text-zinc-500">
                        🔒 Signature release pending. Draw seal on authorization panel below.
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 text-right text-xs">
                    <p className="flex justify-between"><span>Subtotal Book:</span> <strong className="text-stone-300">{formatPKR(subtotal)}</strong></p>
                    {customDiscount > 0 && <p className="flex justify-between text-red-400"><span>Spot Discount ({customDiscount}%):</span> <strong>-{formatPKR(discount)}</strong></p>}
                    <p className="flex justify-between text-zinc-400 border-b border-white/5 pb-1"><span>PST Sales Tax ({taxRate}%):</span> <strong>+{formatPKR(tax)}</strong></p>
                    <p className="flex justify-between text-[#C5A059] font-sans text-sm font-bold pt-1">
                      <span>MEMORANDUM TOTAL:</span>
                      <span>{formatPKR(grandTotal)}</span>
                    </p>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Right Column: Signature Pad Authorization panel (Col-5) */}
          <div className="lg:col-span-5 p-6 bg-[#151515] border border-white/5 rounded-2xl flex flex-col justify-between font-mono text-xs">
            
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <CreditCard className="w-5 h-5 text-[#C5A059]" />
                <div>
                  <h3 className="font-serif italic text-base text-stone-100 font-bold">Secure Settlement Seal</h3>
                  <p className="text-[9px] font-mono text-stone-500 uppercase tracking-widest leading-none mt-1">Handwritten Tablet Sign Pad</p>
                </div>
              </div>

              <p className="text-xs text-stone-400 leading-normal font-sans">
                Instruct the corporate client (e.g. Dr. Sarfraz) to draw their official authorization signature seal inside the secure canvas block below. This binds the 5-Year Wood Polish Protection warranty.
              </p>

              {/* Signature Drawing Canvas Pad */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-stone-500 font-bold mb-1">
                  <span>Sign Box Canvas Area</span>
                  {signatureDone && (
                    <button
                      onClick={clearSignature}
                      className="text-red-400 hover:underline cursor-pointer font-bold"
                    >
                      Clear Seal Pad
                    </button>
                  )}
                </div>
                
                <canvas
                  ref={canvasRef}
                  width="320"
                  height="110"
                  onMouseDown={startDrawing}
                  onMouseMove={drawSignature}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-28 bg-[#0A0A0A] border border-white/5 rounded-xl cursor-crosshair transition-all hover:border-[#C5A059]/20"
                />
              </div>

            </div>

            <div className="space-y-3 mt-6 border-t border-white/5 pt-4">
              <span className="text-[9px] text-[#C5A059] uppercase tracking-wider block font-bold">Dispatch Actions queue</span>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    alert(`Finalized invoice ${order.id}. Total amount ${formatPKR(grandTotal)} has been successfully posted with PST tax parameters to corporate ledger.`);
                  }}
                  className="w-full py-2 bg-gradient-to-r from-[#C5A059] to-[#b08c48] hover:from-[#b08c48] hover:to-[#9f7d3e] text-[#0F0F0F] font-bold uppercase rounded-lg cursor-pointer text-center text-[10px] tracking-widest block"
                >
                  Post Invoice & Settle Ledger
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      alert(`Exporting high fidelity invoice PDF... download trigger completed for MEMORANDUM-${order.id}.pdf.`);
                    }}
                    className="py-1.5 px-3 bg-[#0F0F0F] hover:bg-[#1A1A1A] text-stone-300 border border-white/5 hover:border-[#C5A059]/20 rounded-lg text-center uppercase font-bold text-[9px] cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowInvoiceSentMsg(true);
                      setTimeout(() => setShowInvoiceSentMsg(false), 5000);
                    }}
                    className="py-1.5 px-3 bg-[#0F0F0F] hover:bg-[#1A1A1A] text-stone-300 border border-white/5 hover:border-emerald-580/20 rounded-lg text-center uppercase font-bold text-[9px] cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-stone-400" />
                    <span>WhatsApp Link</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        <div className="p-12 bg-[#151515] text-center text-zinc-550 border border-white/15 rounded-2xl select-none font-mono text-xs">
          Loading order parameters from showroom inventory records...
        </div>
      )}

    </div>
  );
}
