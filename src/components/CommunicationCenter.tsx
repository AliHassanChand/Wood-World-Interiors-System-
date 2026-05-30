import React, { useState } from "react";
import { Mail, MessageSquare, PhoneCall, Check, Send, Sparkles, Sliders, Server, Eye, FileText, CheckCircle, Clock } from "lucide-react";
import { BranchName } from "../types";

interface CommunicationCenterProps {
  activeBranch: BranchName;
  onAddDirectActivity?: (act: any) => void;
}

interface dispatchLog {
  id: string;
  recipient: string;
  channel: "Email" | "WhatsApp" | "SMS";
  template: string;
  status: "Sent" | "Pending" | "Failed";
  timestamp: string;
}

export default function CommunicationCenter({ activeBranch, onAddDirectActivity }: CommunicationCenterProps) {
  const [activeChannel, setActiveChannel] = useState<"Email" | "WhatsApp" | "SMS">("Email");
  const [targetRecipient, setTargetRecipient] = useState("0300-4758291");
  const [selectedTemplateKey, setSelectedTemplateKey] = useState("installment");
  const [draftCustomMessage, setDraftCustomMessage] = useState("");
  const [smtpServer, setSmtpServer] = useState("smtp.woodworld-erp.com");
  const [smtpPort, setSmtpPort] = useState("465");
  const [smtpSender, setSmtpSender] = useState("notices@woodworld.com.pk");
  const [smtpStatusMsg, setSmtpStatusMsg] = useState("");
  const [testSuccessSignal, setTestSuccessSignal] = useState(false);

  const [logs, setLogs] = useState<dispatchLog[]>([
    { id: "LOG-401", recipient: "Dr. Sarfraz Ahmed (sarfraz.ahmed@alliedhealth.org.pk)", channel: "Email", template: "Mughal Suite Welcome Quotation CAD Attached", status: "Sent", timestamp: "Today, 11:30 AM" },
    { id: "LOG-402", recipient: "0321-4839211 (Mrs. Parveen Khokhar)", channel: "WhatsApp", template: "Seasoned Wood Polish Guide brochure", status: "Sent", timestamp: "Today, 09:12 AM" },
    { id: "LOG-403", recipient: "0333-5182933 (Sarfraz Villas Development)", channel: "SMS", template: "Gate Cargo Transit Release OTP code", status: "Sent", timestamp: "Yesterday" }
  ]);

  const emailTemplates: Record<string, { subject: string; body: string }> = {
    installment: {
      subject: "IMPORTANT NOTICE: Wood World Installment Credit Balance Statement",
      body: "Respected Allied Health Club Member,\n\nThis notice serves to confirm that your next structural installment is due for credit balance clearance within 5 working days.\n\nTransaction target code: REF-9283\nOriginal order: Walnut Grand Dining Series (Karachi Atelier Room)\nPending Amount: Rs. 150,050\n\nPlease find the smart digital invoice and linked scan verify QR code attached.\n\nCordial regards,\nAccounts Clearing Desk\nWood World Enterprise Ltd."
    },
    welcome_cad: {
      subject: "Luxury Studio: Your Special Mughal Wardrobe Custom CAD Blueprint Design",
      body: "Dearest Showroom Guest,\n\nOur Atelier Master Architect Engr. Noman Shah and lead carver Ustad Allah Ditta have finalized the 3D outline blueprint drawing file for your high-grit wardrobe project.\n\nCustom design notes: High-seasoned solid Sheesham with anti-corrosion velvet drawer lining.\nEstimated Seasoning seasoning duration: 12 days.\n\nPlease authorize the attached quote to lock the workshop schedule.\n\nWarmest regards,\nShowroom Director"
    },
    dispatch_transit: {
      subject: "Logistics Update: Your Premium Furniture Cargo Dispatched from Lahore Warehouse",
      body: "Dear Patron,\n\nWe are pleased to inform you that your premium handcarved furniture has been safely loaded onto our transit fleet truck (Fleet Chassis: LH-7320) and is currently in transit to your site address.\n\nUpon gateway arrival, our onsite team will require the 4-digit verification OTP prior to unpacking.\nYour OTP verify code: 9245\n\nKind regards,\nLogistics Fleet Services"
    }
  };

  const whatsAppTemplates: Record<string, string> = {
    installment: "🪵 *Wood World Enterprise Limited* 🪵\n\nRespected Client,\nThis is a courtesy reminders that your monthly furniture installment of *Rs. 150,050* is pending clearance. Please settle before the weekend to maintain active warranty coverage. \n\n_Ref: ORD-9462_",
    welcome_cad: "🎨 *Wood World Custom Design Studio* 🎨\n\nRespected Sir/Madam,\nYour bespoke rosewood console CAD sketch drawing has been uploaded to your Document Vault. Please check your dashboard or tap below to review the interactive PDF.\n\n_Wood Seasoning moisture: 7.2%_",
    dispatch_transit: "🚚 *Wood World Secure Transport* 🚚\n\nPatron,\nYour Lahore master-seasoned bed set cargo is loaded! Estimated site arrival has been set for tomorrow at 02:00 PM. \nYour verification OTP: *8451*\n\n_Thank you for choosing high craftsmanship._"
  };

  const handleSendSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRecipient) return;

    const nextLogId = `LOG-${Math.floor(404 + Math.random() * 95)}`;
    const templateName = selectedTemplateKey === "installment" ? "Installment Statement Reminder" : (selectedTemplateKey === "welcome_cad" ? "Welcome CAD Quote & Blueprint" : "Logistics Gate Release");

    const newLog: dispatchLog = {
      id: nextLogId,
      recipient: targetRecipient,
      channel: activeChannel,
      template: templateName,
      status: "Sent",
      timestamp: "Just Now"
    };

    setLogs(prev => [newLog, ...prev]);

    if (onAddDirectActivity) {
      onAddDirectActivity({
        id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        staffName: "Communication Gate",
        branch: activeBranch,
        action: `Dispatched multi-channel simulated ${activeChannel} alert to: ${targetRecipient} using [${templateName}] template.`,
        status: "Success"
      });
    }

    setTestSuccessSignal(true);
    setTimeout(() => setTestSuccessSignal(false), 3000);
  };

  const handleSMTPTestConnection = (e: React.FormEvent) => {
    e.preventDefault();
    setSmtpStatusMsg("Resolving SMTP records... checking SSL handshake port 465...");

    setTimeout(() => {
      setSmtpStatusMsg("SMTP Gateway Handshake Verified! Primary mail relay channels active and ready.");
    }, 1500);
  };

  return (
    <div className="space-y-6 select-text">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form to setup and trigger communication campaign (Col-7) */}
        <div className="lg:col-span-7 p-6 bg-[#151515] border border-white/5 rounded-2xl flex flex-col justify-between font-mono text-xs">
          
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C5A059]" />
                <div>
                  <h3 className="font-serif italic text-base text-stone-100 font-bold">Multi-Channel Client Hub</h3>
                  <p className="text-[9px] font-mono text-stone-500 uppercase tracking-widest mt-1">Simulated SMTP & WhatsApp Campaigner Router</p>
                </div>
              </div>
              
              {/* Channel Selector pills */}
              <div className="flex bg-[#0F0F0F] rounded-lg border border-white/5 p-1 shrink-0">
                {(["Email", "WhatsApp", "SMS"] as const).map((channel) => (
                  <button
                    key={channel}
                    onClick={() => setActiveChannel(channel)}
                    className={`py-1 px-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeChannel === channel
                        ? "bg-[#C5A059] text-[#0F0F0F]"
                        : "text-stone-500 hover:text-stone-300"
                    }`}
                  >
                    {channel}
                  </button>
                ))}
              </div>
            </div>

            {testSuccessSignal && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-900 border-dashed rounded-xl text-emerald-300 text-[11px] flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-400" />
                <span>Simulated dispatch successful! Recipient accounts updated and regional activity log posted.</span>
              </div>
            )}

            <form onSubmit={handleSendSimulation} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-stone-400 uppercase tracking-wider font-bold">Recipient (Phone or Email)</label>
                  <input
                    type="text"
                    required
                    value={targetRecipient}
                    onChange={(e) => setTargetRecipient(e.target.value)}
                    placeholder={activeChannel === "Email" ? "sarfraz.ahmed@alliedhealth.org.pk" : "0300-XXXXXXX"}
                    className="w-full bg-[#0F0F0F] border border-white/5 p-2.5 rounded-lg text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-stone-400 uppercase tracking-wider font-bold">Corporate MSG Template</label>
                  <select
                    value={selectedTemplateKey}
                    onChange={(e) => setSelectedTemplateKey(e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-white/5 p-2.5 rounded-lg text-xs text-white"
                  >
                    <option value="installment">Installment Due Warning Notice</option>
                    <option value="welcome_cad">Custom Design CAD Drawing Release</option>
                    <option value="dispatch_transit">Fret Logistics gate OTP Dispatch</option>
                  </select>
                </div>
              </div>

              {/* Template Body Preview block */}
              <div className="space-y-1">
                <label className="text-[9px] text-[#C5A059] uppercase tracking-wider font-bold block">Live Render Preview</label>
                <div className="w-full bg-[#0F0F0F] rounded-xl border border-white/5 p-4 space-y-2 max-h-56 overflow-y-auto">
                  {activeChannel === "Email" ? (
                    <div className="font-sans text-xs text-stone-300 leading-relaxed whitespace-pre-wrap">
                      <strong className="block border-b border-white/5 pb-1 text-sm font-serif italic text-white font-bold mb-2">
                        {emailTemplates[selectedTemplateKey].subject}
                      </strong>
                      {emailTemplates[selectedTemplateKey].body}
                    </div>
                  ) : (
                    <div className="font-mono text-xs text-stone-300 leading-relaxed whitespace-pre-wrap">
                      <span className="text-[8px] bg-emerald-950/25 text-emerald-400 border border-emerald-990 font-bold px-1.5 py-0.5 rounded leading-none uppercase mb-2 inline-block">WhatsApp Encryption format</span>
                      {whatsAppTemplates[selectedTemplateKey]}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="py-2 px-5 bg-[#C5A059] hover:bg-[#b08c48] text-[#0F0F0F] text-xs font-mono uppercase tracking-wider font-bold rounded-lg cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit simulated notice</span>
                </button>
              </div>

            </form>
          </div>

          {/* Bottom active log ledger list */}
          <div className="space-y-2 mt-6 border-t border-white/5 pt-4">
            <span className="text-[9px] text-stone-550 uppercase tracking-wider block font-bold">Campaign Delivery ledger logs</span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {logs.map((lg) => (
                <div key={lg.id} className="p-2.5 bg-[#0F0F0F] rounded-lg border border-white/5 flex justify-between items-center text-[10px] text-zinc-400">
                  <div className="truncate pr-3">
                    <span className="text-stone-550 font-bold">[{lg.channel}] </span>
                    <strong className="text-stone-300 font-sans">{lg.recipient}</strong>
                    <span className="text-stone-600 block mt-0.5 font-mono">Template: {lg.template}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-emerald-500 font-bold">{lg.status}</span>
                    <span className="text-stone-600 block text-[9px] mt-0.5">{lg.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Secure SMTP Server Settings Node (Col-5) */}
        <div className="lg:col-span-5 p-6 bg-[#151515] border border-white/5 rounded-2xl flex flex-col justify-between font-mono text-xs">
          
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Server className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="font-serif italic text-base text-stone-100 font-bold">Gate Direct SMTP Settings</h3>
                <p className="text-[9px] font-mono text-stone-500 uppercase tracking-widest leading-none mt-1">Central Corporate Mail Server</p>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-normal font-sans">
              Setup production TLS accounts to synchronize with genuine SMTP servers for corporate PDF invoices auto mailing directly from custom showrooms.
            </p>

            <form onSubmit={handleSMTPTestConnection} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[9px] text-[#C5A059] uppercase tracking-wider font-bold">SMTP Host Server</label>
                <input
                  type="text"
                  required
                  value={smtpServer}
                  onChange={(e) => setSmtpServer(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-white/5 p-2 rounded text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] text-stone-400 uppercase tracking-wider">Secure Port</label>
                  <input
                    type="text"
                    required
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-white/5 p-2 rounded text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-stone-400 uppercase tracking-wider">Sender account name</label>
                  <input
                    type="email"
                    required
                    value={smtpSender}
                    onChange={(e) => setSmtpSender(e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-white/5 p-2 rounded text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-stone-400 uppercase tracking-wider">SMTP TLS Security Credentials Password</label>
                <input
                  type="password"
                  value="••••••••••••••••"
                  disabled
                  className="w-full bg-[#0F0F0F]/60 border border-white/5 p-2 rounded text-xs text-stone-600 cursor-not-allowed select-none"
                />
                <span className="text-[9px] text-stone-650 italic leading-none mt-1 block">Authentication token configured securely in Secrets store</span>
              </div>

              {smtpStatusMsg && (
                <div className="p-3 bg-indigo-950/20 border border-indigo-900 rounded text-[11px] text-indigo-300">
                  {smtpStatusMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-[#0F0F0F] hover:bg-[#151515] border border-indigo-500/30 hover:border-indigo-500 text-indigo-300 font-bold uppercase rounded cursor-pointer text-center text-[10px]"
              >
                Test Gateway Handshake
              </button>

            </form>
          </div>

          <div className="bg-stone-900/40 p-3 rounded-lg border border-white/5 mt-6 font-sans text-xs">
            <span className="font-mono text-[9px] uppercase tracking-wider text-stone-500 block mb-1">Downstream SSL security</span>
            <p className="text-[11px] text-stone-500 leading-normal">
              Wood World communications routes are encrypted with 256-Bit SSL keys. Simulated templates do not spam actual regional telecom grids.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
