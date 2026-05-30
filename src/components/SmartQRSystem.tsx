import React, { useState } from "react";
import { ScanLine, Search, Package, Check, Printer, AlertCircle, RefreshCw, Layers, ShieldCheck, MapPin } from "lucide-react";
import { StockItem, BranchName } from "../types";

interface SmartQRSystemProps {
  stockItems: StockItem[];
  activeBranch: BranchName;
  onAddDirectActivity?: (act: any) => void;
}

export default function SmartQRSystem({ stockItems, activeBranch, onAddDirectActivity }: SmartQRSystemProps) {
  const [selectedItemId, setSelectedItemId] = useState<string>(stockItems[0]?.id || "");
  const [scanInputCode, setScanInputCode] = useState<string>("");
  const [scannedItem, setScannedItem] = useState<StockItem | null>(null);
  const [scannedMetrics, setScannedMetrics] = useState<any | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [dispatchVerifiedId, setDispatchVerifiedId] = useState<string | null>(null);

  const selectedItem = stockItems.find(itm => itm.id === selectedItemId);

  // Simulated scan process
  const triggerSimulateScan = (code: string) => {
    setIsScanning(true);
    setScannedItem(null);
    setScannedMetrics(null);

    setTimeout(() => {
      const match = stockItems.find(
        itm => itm.id.toLowerCase() === code.trim().toLowerCase() || 
               itm.name.toLowerCase().includes(code.trim().toLowerCase())
      );

      if (match) {
        setScannedItem(match);
        // Generate interesting material & status intelligence indicators
        setScannedMetrics({
          seasoningLevel: Math.floor(75 + (parseInt(match.id.replace(/\D/g, "")) || 5) * 4) % 101, // dynamic formula for realistic values
          polishDensity: match.category === "Sofa" ? "Matte Satin Finish" : "Standard High-Gloss Walnut Lacquer",
          moistureRate: "7.2% Wood moisture (Superb)",
          warrantyStatus: "Active Premium 5-Year Protection Coverage",
          rackAddress: `BAY-B${(parseInt(match.id.replace(/\D/g, "")) || 2) % 5}-RACK3`,
          originForest: match.woodType.includes("Oak") ? "Dir Valley Highlands" : "Changa Manga Protected Forest"
        });

        if (onAddDirectActivity) {
          onAddDirectActivity({
            id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp: new Date().toISOString(),
            staffName: "QR Scan Desk",
            branch: activeBranch,
            action: `Scanned inventory QR Code label for: ${match.name} [SKU: ${match.id}]`,
            status: "Success"
          });
        }
      } else {
        setScannedItem(null);
      }
      setIsScanning(false);
    }, 850);
  };

  const handleDispatchVerification = (itemId: string) => {
    setDispatchVerifiedId(itemId);
    if (onAddDirectActivity) {
      onAddDirectActivity({
        id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        staffName: "Logistics Dispatch QR",
        branch: activeBranch,
        action: `Verified physical warehouse gates dispatch for item ${itemId} via handheld scanner.`,
        status: "Success"
      });
    }
    setTimeout(() => setDispatchVerifiedId(null), 3000);
  };

  // Generate fake SVG lines for Barcode
  const renderBarcodeSVG = (id: string) => {
    const lines = [];
    const seed = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    for (let i = 0; i < 35; i++) {
      const width = ((seed + i) % 3 === 0) ? "w-0.5" : (((seed + i) % 5 === 0) ? "w-1.5" : "w-1");
      const gap = ((seed - i) % 4 === 0) ? "mr-1" : "mr-0.5";
      const opacity = ((seed + i * 2) % 7 === 0) ? "bg-stone-550" : "bg-stone-100";
      lines.push(<div key={i} className={`h-12 ${width} ${gap} ${opacity}`} />);
    }
    return (
      <div className="flex bg-[#0A0A0A] p-2.5 rounded border border-white/5 items-center justify-center">
        {lines}
      </div>
    );
  };

  // Generate pretty styled CSS QR Box representation
  const renderStyledQRTag = (item: StockItem) => {
    return (
      <div className="aspect-square w-32 bg-white p-2 rounded-lg flex flex-col justify-between shadow-lg relative overflow-hidden shrink-0 border border-stone-200">
        {/* Mock QR details using grid pixels */}
        <div className="grid grid-cols-7 gap-0.5 w-full h-full p-1 opacity-90">
          {[...Array(49)].map((_, i) => {
            // Force QR corners anchor squares
            const row = Math.floor(i / 7);
            const col = i % 7;
            const isAnchor = (row < 2 && col < 2) || (row < 2 && col > 4) || (row > 4 && col < 2);
            const isBlack = isAnchor || Math.sin(i * 12 + row * 9) > 0;
            return (
              <div 
                key={i} 
                className={`rounded-xs ${isBlack ? "bg-[#0F0F0F]" : "bg-transparent"}`} 
              />
            );
          })}
        </div>
        <span className="absolute bottom-1 right-1 text-[7px] font-mono font-bold text-gray-500">{item.id}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-text">
        
        {/* Left Column: QR Code Tag Generator Panel */}
        <div className="lg:col-span-5 p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Layers className="w-5 h-5 text-[#C5A059]" />
              <div>
                <h3 className="font-serif italic text-base text-stone-100 font-bold">QR Tag & Barcode Generator</h3>
                <p className="text-[9px] font-mono text-stone-500 uppercase tracking-widest leading-none mt-1">Showroom Sticker Logistics Protocol</p>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Print luxury-grade product specification tags with secure QR references for showroom guest instant scanning or delivery loader validation.
            </p>

            {/* Selector dropdown */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-[9px] text-[#C5A059] uppercase tracking-wider font-bold block">Select Furniture Catalog Item</label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full bg-[#0F0F0F] border border-white/5 focus:border-[#C5A059]/30 rounded-lg p-2.5 text-xs text-stone-300 outline-none"
              >
                {stockItems.map(itm => (
                  <option key={itm.id} value={itm.id}>{itm.name} ({itm.woodType})</option>
                ))}
              </select>
            </div>

            {selectedItem && (
              <div className="p-4 bg-[#0F0F0F] border border-white/5 rounded-xl space-y-4">
                
                {/* Visual Label Tag Template representation */}
                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start justify-between bg-zinc-900/40 p-4 border border-zinc-800 rounded-lg">
                  <div className="space-y-1 flex-1 font-sans text-left">
                    <span className="text-[9px] font-mono bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 px-1.5 py-0.5 rounded leading-none uppercase font-bold inline-block">
                      {selectedItem.category}
                    </span>
                    <h4 className="text-white text-sm font-bold mt-1 tracking-tight">{selectedItem.name}</h4>
                    <p className="text-[10px] font-mono text-stone-400 mt-1">Material: {selectedItem.woodType}</p>
                    <p className="text-[10px] font-mono text-stone-400 leading-tight">Dims: {selectedItem.dimensions}</p>
                    <p className="text-xs font-serif italic text-[#C5A059] font-bold mt-2">Rs. {selectedItem.pricePKR.toLocaleString("en-PK")}</p>
                  </div>
                  {renderStyledQRTag(selectedItem)}
                </div>

                {/* Subordinate Barcode visual layout */}
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-stone-500 uppercase block text-center">Interactive Barcode SKU Tag label</span>
                  {renderBarcodeSVG(selectedItem.id)}
                  <span className="text-[10px] font-mono text-[#C5A059] block text-center mt-1 font-bold">*{selectedItem.id}*</span>
                </div>

              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (selectedItem) {
                alert(`Exporting high-resolution commercial printable design sticker PDF for: ${selectedItem.name} [SKU: ${selectedItem.id}]. Dispatching to showroom thermal logger.`);
              }
            }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-[#C5A059] to-[#b08c48] hover:from-[#b08c48] hover:to-[#9f7d3e] text-[#0F0F0F] text-[10px] font-mono uppercase tracking-widest font-bold rounded-lg cursor-pointer flex items-center justify-center gap-2 mt-4 transition-all"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>Produce Premium Print Badge</span>
          </button>
        </div>

        {/* Right Column: Laser Scanning Simulation and Intelligence Inspector */}
        <div className="lg:col-span-7 p-6 bg-[#151515] border border-white/5 rounded-2xl flex flex-col justify-between font-mono text-xs">
          
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <ScanLine className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="font-serif italic text-base text-stone-100 font-bold">Gate Dispatch & Laser Scan Inspector</h3>
                <p className="text-[9px] font-mono text-stone-500 uppercase tracking-widest leading-none mt-1">Real-time RFID Scan Simulation</p>
              </div>
            </div>

            {/* Quick interactive search scan input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type item label or SKU (e.g. ST-001, ST-002, Sofa)..."
                value={scanInputCode}
                onChange={(e) => setScanInputCode(e.target.value)}
                className="flex-1 bg-[#0F0F0F] border border-white/5 focus:border-indigo-400/40 rounded-lg p-2.5 text-xs text-white outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && scanInputCode.trim()) {
                    triggerSimulateScan(scanInputCode);
                  }
                }}
              />
              <button
                onClick={() => {
                  if (scanInputCode.trim()) triggerSimulateScan(scanInputCode);
                }}
                className="py-2.5 px-5 bg-[#0F0F0F] hover:bg-[#1C1C1C] text-[#C5A059] border border-[#C5A059]/20 hover:border-[#C5A059]/40 font-mono text-xs uppercase font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin text-amber-500" : ""}`} />
                <span>Simulate Scan</span>
              </button>
            </div>

            <div className="flex gap-2">
              <span className="text-[10px] text-stone-500">Quick Test codes:</span>
              {stockItems.slice(0, 3).map((it) => (
                <button
                  key={it.id}
                  onClick={() => {
                    setScanInputCode(it.id);
                    triggerSimulateScan(it.id);
                  }}
                  className="px-2 py-0.5 bg-[#0F0F0F] hover:bg-[#C5A059]/10 border border-white/5 text-stone-400 hover:text-[#C5A059] text-[9px] rounded font-mono"
                >
                  {it.id}
                </button>
              ))}
            </div>

            {/* Scanner HUD Overlay */}
            {isScanning ? (
              <div className="relative h-64 bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden flex flex-col items-center justify-center">
                {/* Glowing Laser Scan Line animation */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500/80 shadow-lg shadow-red-500 animate-bounce mt-10"></div>
                <ScanLine className="w-12 h-12 text-[#C5A059] animate-pulse shrink-0" />
                <span className="text-stone-500 text-[10px] mt-4 uppercase tracking-widest animate-pulse">Running laser analysis...</span>
              </div>
            ) : scannedItem ? (
              <div className="bg-[#0F0F0F] border border-emerald-950/40 p-5 rounded-xl space-y-4 shadow-xl select-text">
                <div className="flex justify-between items-start border-b border-white/5 pb-3">
                  <div>
                    <span className="text-[9px] bg-emerald-950/20 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded leading-none uppercase font-bold inline-block">
                      SKU Match Identified
                    </span>
                    <h4 className="font-serif italic text-lg text-white font-bold mt-1.5">{scannedItem.name}</h4>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Primary Key Identifier: <strong className="text-[#C5A059]">{scannedItem.id}</strong></p>
                  </div>
                  <Check className="w-6 h-6 text-emerald-555 shrink-0" />
                </div>

                {/* Grid analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-stone-500">Sub-Category:</span>
                      <span className="text-stone-200 font-sans font-bold">{scannedItem.category}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-stone-500">Material Core:</span>
                      <span className="text-stone-200 font-sans font-bold">{scannedItem.woodType}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-stone-500">Dimensions:</span>
                      <span className="text-stone-200 font-mono">{scannedItem.dimensions}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-stone-500">Lead Time:</span>
                      <span className="text-stone-200">{scannedItem.leadTimeDays} Business Days</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-stone-500">Wood Seasoning:</span>
                      <span className="text-emerald-400 font-bold">{scannedMetrics?.seasoningLevel || 85}% Seasoned</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-stone-500">Timber Origin:</span>
                      <span className="text-stone-200 text-[11px] leading-tight text-right">{scannedMetrics?.originForest}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-stone-500">Protection:</span>
                      <span className="text-indigo-400">{scannedMetrics?.warrantyStatus ? "Claim-Protected" : "Inactive"}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-stone-500">Rack Coordinate:</span>
                      <span className="text-[#C5A059] font-bold">{scannedMetrics?.rackAddress || "BAY-A1"}</span>
                    </div>
                  </div>
                </div>

                {/* Multi-Branch stock check */}
                <div className="p-3 bg-stone-900/40 rounded-lg border border-white/5 block">
                  <span className="text-[10px] text-[#C5A059] uppercase tracking-wider block font-bold mb-2">Live Showroom availability checklist</span>
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    {Object.values(BranchName).map((b) => {
                      const count = scannedItem.stockByBranch[b] || 0;
                      return (
                        <div key={b} className="p-2 bg-[#0F0F0F] rounded border border-white/5">
                          <span className="text-[9px] text-stone-500 block truncate uppercase">{b.split(" ")[0]}</span>
                          <span className={`text-[12px] font-bold block mt-1 ${count <= scannedItem.alertThreshold ? "text-amber-500" : "text-stone-200"}`}>
                            {count} Units
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Verification Logs Dispatch */}
                <div className="flex justify-end pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleDispatchVerification(scannedItem.id)}
                    className="py-1.5 px-4 bg-emerald-950/20 hover:bg-emerald-900 border border-emerald-900 hover:border-emerald-500 text-emerald-300 font-bold uppercase rounded text-[10px] cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    {dispatchVerifiedId === scannedItem.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Dispatch Log Cleared</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Gate Dispatch Authorization</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            ) : (
              <div className="h-64 bg-[#0A0A0A] border border-white/5 rounded-xl flex flex-col justify-center items-center text-zinc-550 space-y-2">
                <ScanLine className="w-8 h-8 text-stone-600" />
                <p className="text-[11px] font-sans text-stone-500 text-center uppercase tracking-widest max-w-xs">
                  Awaiting RFID pulse scan signal from central warehouse rack barcode sensor labels.
                </p>
                <button
                  onClick={() => triggerSimulateScan("ST-001")}
                  className="text-[10px] text-[#C5A059] hover:text-white bg-[#151515] border border-white/5 hover:border-[#C5A059]/30 rounded py-1 px-3 mt-4 transition-all"
                >
                  Quick Scan Sofa ST-001
                </button>
              </div>
            )}

          </div>

          <div className="p-4 bg-gradient-to-r from-red-950/10 to-transparent border border-red-950/30 rounded-xl flex items-start gap-2.5 mt-6 font-sans">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-stone-400 leading-normal">
              <strong>Regional Audit Note:</strong> If any scanned item has branch level below the threshold value (e.g. Sofa level &lt;= 3 units), please click <strong>Launch Business Copilot</strong> on the top panel to authorize central balance transfer allocations immediately.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
