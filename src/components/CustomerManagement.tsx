import React, { useState } from "react";
import { Users, Search, UserPlus, Filter, Award, ShieldCheck, Mail, Phone, MapPin, Calendar, Heart, FileText, CheckCircle, UserCheck } from "lucide-react";
import { BranchName } from "../types";

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  cnic?: string;
  branch: BranchName;
  address: string;
  purchaseCount: number;
  totalSpentPKR: number;
  woodPreference: string;
  showroomClaimNotes: string;
  status: "VIP Club" | "Retail" | "Corporate Corp";
  nextRemindDate: string;
}

interface CustomerManagementProps {
  activeBranch: BranchName;
  onAddDirectActivity?: (act: any) => void;
  formatPKR: (num: number) => string;
}

export default function CustomerManagement({ activeBranch, onAddDirectActivity, formatPKR }: CustomerManagementProps) {
  // Existing baseline database representation the user can manage
  const [customers, setCustomers] = useState<CustomerProfile[]>([
    {
      id: "CUST-901",
      name: "Dr. Sarfraz Ahmed",
      phone: "0300-4758291",
      email: "sarfraz.ahmed@alliedhealth.org.pk",
      cnic: "42101-9284291-3",
      branch: BranchName.KarachiShowroom,
      address: "Mansion 42, Main Khayaban-e-Bahria, Phase 5, DHA, Karachi",
      purchaseCount: 4,
      totalSpentPKR: 1850000,
      woodPreference: "Imperial Walnut / Antique Gold Carved Details",
      showroomClaimNotes: "Requires custom high-gloss finishing seasonings. Prefers classic Mughal styling.",
      status: "VIP Club",
      nextRemindDate: "2026-06-03"
    },
    {
      id: "CUST-902",
      name: "Mrs. Parveen Khokhar",
      phone: "0321-4839211",
      email: "parveen.khokhar@lums.edu.pk",
      cnic: "35202-8392728-4",
      branch: BranchName.LahoreWarehouse,
      address: "Villa 108, Sector Z, Phase 6, DHA, Lahore",
      purchaseCount: 2,
      totalSpentPKR: 890000,
      woodPreference: "White Ash Wood, Low Polish Satin Stain",
      showroomClaimNotes: "Extremely meticulous about furniture joint seasoning moisture levels.",
      status: "Retail",
      nextRemindDate: "2026-06-12"
    },
    {
      id: "CUST-903",
      name: "Sarfraz Villas Development Corp",
      phone: "0333-5182933",
      email: "procurement@sarfrazvillas.com",
      branch: BranchName.IslamabadShowroom,
      address: "Plaza 4-B, Executive District, Phase 8, Bahria Town, Islamabad",
      purchaseCount: 8,
      totalSpentPKR: 6200000,
      woodPreference: "Red Oak Veneer / Modern Glass Inserts",
      showroomClaimNotes: "Corporate hotel contract partner. Demands standard 5-year guarantees on lacquer.",
      status: "Corporate Corp",
      nextRemindDate: "2026-05-30"
    },
    {
      id: "CUST-904",
      name: "High Commission of Canada",
      phone: "051-2086000",
      email: "isbad-consular@international.gc.ca",
      branch: BranchName.IslamabadShowroom,
      address: "Diplomatic Enclave, Sector G-5, Islamabad",
      purchaseCount: 3,
      totalSpentPKR: 2450000,
      woodPreference: "Solid Teak & Premium Matte Oak Desk Modules",
      showroomClaimNotes: "Prefers minimalist corporate design desk configurations with integrated wire boxes.",
      status: "VIP Club",
      nextRemindDate: "2026-06-05"
    }
  ]);

  // Form states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>("CUST-901");
  const [filterType, setFilterType] = useState<string>("ALL");

  // Form values to add new customer profile
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCNIC, setNewCNIC] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newPreference, setNewPreference] = useState("Solid Solid Walnut");
  const [newNotes, setNewNotes] = useState("");
  const [newStatus, setNewStatus] = useState<CustomerProfile["status"]>("Retail");

  const [addSuccessMsg, setAddSuccessMsg] = useState("");

  const handleRegisterCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    // Fast check for duplicates phone numbers
    const isDuplicate = customers.some(c => c.phone.trim() === newPhone.trim());
    if (isDuplicate) {
      alert("Registration halted: A customer profile with this mobile number already exists in Wood World central directory.");
      return;
    }

    const nextId = `CUST-${Math.floor(905 + Math.random() * 95)}`;
    const freshlyRegistered: CustomerProfile = {
      id: nextId,
      name: newName,
      phone: newPhone,
      email: newEmail || "client@inquire-woodworld.pk",
      cnic: newCNIC || undefined,
      branch: activeBranch,
      address: newAddress || "Customer Showroom Pick-Up / Pending Site Address",
      purchaseCount: 0,
      totalSpentPKR: 0,
      woodPreference: newPreference,
      showroomClaimNotes: newNotes || "No previous complaints. Inquired for modern showroom packages.",
      status: newStatus,
      nextRemindDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split("T")[0] // default 14 days follow-up
    };

    setCustomers(prev => [freshlyRegistered, ...prev]);
    setSelectedCustomerId(nextId);

    // Activity Log
    if (onAddDirectActivity) {
      onAddDirectActivity({
        id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        staffName: "Client Relations Manager",
        branch: activeBranch,
        action: `Registered complete customer dossier for: ${newName} [Reference: ${nextId}]`,
        status: "Success"
      });
    }

    // Reset Form
    setNewName("");
    setNewPhone("");
    setNewEmail("");
    setNewCNIC("");
    setNewAddress("");
    setNewPreference("Solid Solid Walnut");
    setNewNotes("");
    setNewStatus("Retail");

    setAddSuccessMsg(`Registered! Active entry ${nextId} generated for ${newName}.`);
    setTimeout(() => setAddSuccessMsg(""), 4000);
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Filter logic
  const filteredCustomers = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        c.phone.includes(searchQuery) || 
                        c.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === "ALL") return matchSearch;
    return matchSearch && c.status === filterType;
  });

  return (
    <div className="space-y-6 select-text">
      
      {/* Upper Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 bg-[#151515] border border-white/5 rounded-xl">
          <span className="text-stone-550 uppercase">Active Client Pool</span>
          <div className="flex items-baseline justify-between mt-1">
            <strong className="text-white text-lg">{customers.length} Accounts</strong>
            <span className="text-emerald-500 font-sans">100% Retained</span>
          </div>
        </div>
        <div className="p-4 bg-[#151515] border border-white/5 rounded-xl">
          <span className="text-stone-550 uppercase">VIP Club Members</span>
          <div className="flex items-baseline justify-between mt-1">
            <strong className="text-white text-lg">{customers.filter(c => c.status === "VIP Club").length} Gold Elite</strong>
            <span className="text-[#C5A059] font-serif italic text-[11px]">Showroom Valet</span>
          </div>
        </div>
        <div className="p-4 bg-[#151515] border border-white/5 rounded-xl">
          <span className="text-stone-550 uppercase">Corporate Enterprise Accounts</span>
          <div className="flex items-baseline justify-between mt-1">
            <strong className="text-white text-lg">{customers.filter(c => c.status === "Corporate Corp").length} Partners</strong>
            <span className="text-zinc-400">Total B2B</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Accounts Directory List (Col-4) */}
        <div className="lg:col-span-4 p-5 bg-[#151515] border border-white/5 rounded-2xl flex flex-col h-[520px] justify-between">
          <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C5A059]" />
                <span className="font-serif italic text-sm text-stone-100 font-bold">Client Directory</span>
              </div>
              <span className="text-[9px] font-mono text-stone-500 uppercase">{filteredCustomers.length} Records</span>
            </div>

            {/* Live Search and Filter toggles */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-550" />
                <input
                  type="text"
                  placeholder="Search clients, phone numbers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-white/5 pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none text-white focus:border-[#C5A059]/30"
                />
              </div>

              <div className="flex gap-1">
                {["ALL", "VIP Club", "Retail", "Corporate Corp"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`py-1 px-1.5 rounded text-[8px] font-mono uppercase tracking-wider transition-all border shrink-0 ${
                      filterType === type
                        ? "bg-[#C5A059]/15 border-[#C5A059]/30 text-[#C5A059]"
                        : "bg-transparent border-transparent hover:border-white/5 text-stone-500"
                    }`}
                  >
                    {type.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable list of profiles */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 mt-2">
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-12 text-zinc-550 text-xs font-mono">
                  No registered profiles found matching filters.
                </div>
              ) : (
                filteredCustomers.map((cli) => (
                  <button
                    key={cli.id}
                    onClick={() => setSelectedCustomerId(cli.id)}
                    className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      selectedCustomerId === cli.id
                        ? "bg-white/5 border-[#C5A059]/40"
                        : "bg-[#0F0F0F]/60 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="truncate pr-2 select-none">
                      <strong className="text-white text-xs block font-sans truncate">{cli.name}</strong>
                      <span className="text-[10px] text-stone-500 font-mono block mt-0.5">{cli.phone}</span>
                    </div>

                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded leading-none ${
                      cli.status === "VIP Club"
                        ? "bg-amber-950/15 text-amber-500 border border-amber-900/40"
                        : cli.status === "Corporate Corp"
                        ? "bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/20"
                        : "bg-stone-850 text-stone-400 border border-white/5"
                    }`}>
                      {cli.status.split(" ")[0]}
                    </span>
                  </button>
                ))
              )}
            </div>

          </div>
        </div>

        {/* Middle Column: Current Selected Customer Dossier Case (Col-5) */}
        <div className="lg:col-span-5 p-6 bg-[#151515] border border-white/5 rounded-2xl flex flex-col justify-between h-[520px]">
          {selectedCustomer ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              
              <div className="space-y-4">
                
                {/* Dossier header */}
                <div className="flex justify-between items-start border-b border-white/5 pb-3">
                  <div>
                    <span className="text-[8px] font-mono text-[#C5A059] uppercase tracking-widest font-bold">Client dossier reference status</span>
                    <h3 className="text-white font-serif italic text-base font-bold mt-1">{selectedCustomer.name}</h3>
                    <p className="text-[10px] font-mono text-stone-500 mt-0.5">Dossier Key: <strong className="text-[#C5A059]">{selectedCustomer.id}</strong></p>
                  </div>
                  
                  {selectedCustomer.cnic && (
                    <div className="text-right">
                      <span className="text-[8px] text-stone-600 block uppercase font-mono">Registered CNIC</span>
                      <strong className="text-[10px] text-zinc-400 font-mono block mt-0.5">{selectedCustomer.cnic}</strong>
                    </div>
                  )}
                </div>

                {/* Subordinate Details */}
                <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center text-stone-400 border-b border-white/5 pb-1">
                      <Phone className="w-3 h-3 text-stone-500 shrink-0" />
                      <span className="truncate">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex gap-2 items-center text-stone-400 border-b border-white/5 pb-1 select-all">
                      <Mail className="w-3 h-3 text-stone-500 shrink-0" />
                      <span className="truncate">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex gap-2 items-center text-stone-400 border-b border-white/5 pb-2">
                      <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                      <span className="truncate">{selectedCustomer.branch}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-stone-500">Order Count:</span>
                      <span className="text-stone-200 font-bold">{selectedCustomer.purchaseCount} Bookings</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-stone-500">Capital Spent:</span>
                      <span className="text-[#C5A059] font-bold">{formatPKR(selectedCustomer.totalSpentPKR)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1 text-[#C5A059]">
                      <span className="text-stone-500">Next Followup:</span>
                      <span className="font-bold text-[10px]">{selectedCustomer.nextRemindDate}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-1 font-sans">
                  {/* Wood styling preferences */}
                  <div className="p-3 bg-[#0F0F0F] rounded-xl border border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-[#C5A059]">
                      <Heart className="w-3.5 h-3.5" />
                      <strong className="font-mono text-[9px] uppercase tracking-wider font-bold">Woodwork Aesthetic Preferences</strong>
                    </div>
                    <p className="text-xs text-stone-300 leading-normal">{selectedCustomer.woodPreference}</p>
                  </div>

                  {/* Showroom claims log notes */}
                  <div className="p-3 bg-[#0F0F0F] rounded-xl border border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <FileText className="w-3.5 h-3.5 text-stone-500" />
                      <strong className="font-mono text-[9px] uppercase tracking-wider font-bold">Showroom Relationship log</strong>
                    </div>
                    <p className="text-xs text-stone-400 leading-normal">{selectedCustomer.showroomClaimNotes}</p>
                  </div>
                </div>

              </div>

              {/* CRM trigger reminders */}
              <div className="flex gap-2 border-t border-white/5 pt-4 mt-4 font-mono">
                <button
                  onClick={() => {
                    alert(`Dispatched automated VIP catalog teaser and current luxury showroom portfolio PDF to ${selectedCustomer.email}. WhatsApp dispatch logs triggered.`);
                  }}
                  className="flex-1 py-1 px-3 bg-[#0F0F0F] hover:bg-[#1A1A1A] border border-white/5 hover:border-[#C5A059]/30 rounded-lg text-stone-400 hover:text-[#C5A059] text-[10px] uppercase font-bold cursor-pointer transition-all"
                >
                  Teaser Catalog Email
                </button>

                <button
                  onClick={() => {
                    alert(`Follow-up calendar logged. Reminder date for ${selectedCustomer.name} deferred by +14 days.`);
                  }}
                  className="py-1 px-3 bg-white/5 hover:bg-white/10 text-stone-300 rounded-lg text-[10px] uppercase font-bold cursor-pointer transition-all"
                >
                  Log Followup Check
                </button>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-zinc-550 text-center space-y-2">
              <Users className="w-8 h-8 text-stone-600" />
              <p className="text-xs font-mono uppercase tracking-wider">Select a customer profile to inspect detailed relational logs.</p>
            </div>
          )}
        </div>

        {/* Right Column: Fast Client Register Form (Col-3) */}
        <div className="lg:col-span-3 p-5 bg-[#0F0F0F]/80 border border-white/5 rounded-2xl flex flex-col justify-between h-[520px]">
          <form onSubmit={handleRegisterCustomer} className="space-y-3.5 font-mono text-[11px] h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 border-b border-white/5 pb-2.5">
                <UserCheck className="w-4 h-4 text-[#C5A059]" />
                <h4 className="font-serif italic text-sm text-stone-100 font-bold leading-none">Register Dossier</h4>
              </div>

              {addSuccessMsg && (
                <div className="p-2 border border-emerald-900 bg-emerald-950/20 text-emerald-300 text-[10px] rounded flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>{addSuccessMsg}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[9px] text-[#C5A059] uppercase tracking-wider font-bold block">Client / Corp Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Admiral (R) Javed"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#151515] border border-white/5 p-2 rounded text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-[#C5A059] uppercase tracking-wider font-bold block">Mobile Number (PK)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0300-1234567"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-[#151515] border border-white/5 p-2 rounded text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] text-stone-400 uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-[#151515] border border-white/5 p-2 rounded text-xs text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-stone-400 uppercase tracking-wider block">CNIC (Optional)</label>
                  <input
                    type="text"
                    placeholder="42101-XXXXXXX-X"
                    value={newCNIC}
                    onChange={(e) => setNewCNIC(e.target.value)}
                    className="w-full bg-[#151515] border border-white/5 p-2 rounded text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-stone-400 uppercase tracking-wider block">Showroom Category</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full bg-[#151515] border border-white/5 p-2 rounded text-xs text-white outline-none"
                >
                  <option value="Retail">Retail Client</option>
                  <option value="VIP Club">VIP Club Elite Gold</option>
                  <option value="Corporate Corp">Corporate Hotel Partner</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-stone-400 uppercase tracking-wider block">Furniture Style Preferences</label>
                <input
                  type="text"
                  placeholder="e.g. Classic Carving Rosewood polish"
                  value={newPreference}
                  onChange={(e) => setNewPreference(e.target.value)}
                  className="w-full bg-[#151515] border border-white/5 p-2 rounded text-xs text-white outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#C5A059] hover:bg-[#b08c48] text-[#0F0F0F] text-[10px] font-mono uppercase tracking-widest font-bold rounded-lg cursor-pointer text-center mt-3 transition-all"
            >
              Confirm Account Credentials
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
