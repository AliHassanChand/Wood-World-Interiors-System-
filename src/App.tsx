/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Sparkles,
  Search,
  Layers,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  ArrowRightLeft,
  Settings,
  Bell,
  HardHat,
  Compass,
  ArrowRight,
  Info,
  Sliders,
  CheckCircle,
  Clock,
  ExternalLink,
  ShoppingCart,
  ClipboardList,
  Users,
  Hammer,
  ScanLine,
  Truck,
  Building,
  GitPullRequest,
  HelpCircle,
  FileText,
  DollarSign,
  UserPlus,
  Calendar,
  Mail,
  MessageSquare,
  Menu,
  X
} from "lucide-react";

// Types & Seed Data
import { BranchName, StockItem, Order, StockTransfer, ManagerApproval, StaffActivity } from "./types";
import {
  initialStockItems,
  initialOrders,
  initialTransfers,
  initialApprovals,
  initialActivities
} from "./data";

// Sub Components
import KPIStats from "./components/KPIStats";
import BranchPerformance from "./components/BranchPerformance";
import InventoryOverview from "./components/InventoryOverview";
import OrderManagement from "./components/OrderManagement";
import ApprovalsQueue from "./components/ApprovalsQueue";
import InstallmentsLedger from "./components/InstallmentsLedger";
import CopilotDrawer from "./components/CopilotDrawer";
import ManagerOnsiteDesk from "./components/ManagerOnsiteDesk";
import EnterpriseEcosystem from "./components/EnterpriseEcosystem";
import SmartQRSystem from "./components/SmartQRSystem";
import CustomerManagement from "./components/CustomerManagement";
import CommunicationCenter from "./components/CommunicationCenter";
import DigitalInvoiceCenter from "./components/DigitalInvoiceCenter";

export default function App() {
  // Master Interactive ERP states
  const [currentRole, setCurrentRole] = useState<string>("Owner");
  const [activeBranch, setActiveBranch] = useState<BranchName>(BranchName.KarachiShowroom);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockItems);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [transfers, setTransfers] = useState<StockTransfer[]>(initialTransfers);
  const [approvals, setApprovals] = useState<ManagerApproval[]>(initialApprovals);
  const [activities, setActivities] = useState<StaffActivity[]>(initialActivities);

  // Close drawer nav menu when active tab or active branch changes
  useEffect(() => {
    setMenuOpen(false);
  }, [activeTab, activeBranch]);
  
  // Folders collapsible states for Grouped Navigation sidebar
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "SHOWROOM & OPERATIONS": true,
    "MANUFACTURING & SUPPLY": true,
    "INTELLIGENT INTEGRATION": true,
    "CORPORATE SERVICES": true,
  });

  // Interface controls
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(
    "Karachi Showroom has 1 low-stock warning on Walnuts. Copilot AI suggestion recommended."
  );

  // Keyboards listeners CMD+K for search, CMD+I for Copilot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("global-search-input");
        if (searchInput) searchInput.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "i") {
        e.preventDefault();
        setCopilotOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle live global predictive search across all 20 business departments
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const q = searchQuery.toLowerCase();
    const results: any[] = [];

    // 1. Search Stock Items
    stockItems.forEach((item) => {
      if (item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q) || item.woodType.toLowerCase().includes(q)) {
        results.push({ type: "Product Stock", label: `${item.name} (${item.woodType})`, tab: "stock", id: item.id });
      }
    });

    // 2. Search Orders
    orders.forEach((ord) => {
      if (ord.id.toLowerCase().includes(q) || ord.customerName.toLowerCase().includes(q) || ord.customerPhone.includes(q)) {
        results.push({ type: "Showroom Order", label: `Order ${ord.id} - ${ord.customerName}`, tab: "sales", id: ord.id });
      }
    });

    // 3. Search Suppliers
    const suppliersList = ["Northern Pines Timber Corp", "Acacia Polishing & Varnishes Ltd"];
    suppliersList.forEach(sup => {
      if (sup.toLowerCase().includes(q)) {
        results.push({ type: "Timber Supplier", label: sup, tab: "procurement", id: sup });
      }
    });

    // 4. Search Staff / HR
    const crew = ["Ustad Allah Ditta", "Ar. Ayesha Mahmood", "Farhan Attendant", "Sohail Shah", "Azeem Butt", "Bilal Dar"];
    crew.forEach(stf => {
      if (stf.toLowerCase().includes(q)) {
        results.push({ type: "Employee Profile", label: stf, tab: "hr", id: stf });
      }
    });

    // 5. Search Documents
    const docs = ["Invoice ORD-9462", "Mughal Wardrobe Blueprint CAD-8392", "Active Franchise Agreement"];
    docs.forEach(dc => {
      if (dc.toLowerCase().includes(q)) {
        results.push({ type: "Corporate Document", label: dc, tab: "documents", id: dc });
      }
    });

    setSearchResults(results.slice(0, 7));
  }, [searchQuery, stockItems, orders]);

  // Format utility
  const formatPKR = (num: number) => {
    return "₨ " + num.toLocaleString("en-PK");
  };

  // 1. Operational stock transfer pulls (automated stock balancer)
  const handleInitiateTransfer = (
    itemId: string,
    qty: number,
    source: BranchName,
    destination: BranchName
  ) => {
    const chosenItem = stockItems.find((i) => i.id === itemId)!;

    // Check if source actually has stock
    const sourceStock = chosenItem.stockByBranch[source] || 0;
    if (sourceStock < qty) {
      setNotification(`Transfer halted: ${source} does not have sufficient units!`);
      return;
    }

    // Process Stock Transfer
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            stockByBranch: {
              ...item.stockByBranch,
              [source]: sourceStock - qty,
              [destination]: (item.stockByBranch[destination] || 0) + qty,
            },
          };
        }
        return item;
      })
    );

    // Record Stock Transfer Transit
    const newTransfer: StockTransfer = {
      id: `TR-${Math.floor(2000 + Math.random() * 8000)}`,
      itemId,
      itemName: chosenItem.name,
      quantity: qty,
      source,
      destination,
      status: "Completed",
      requestedBy: "Logistics Engine (Auto-Transfer Balance)",
      requestDate: new Date().toISOString().split("T")[0],
    };
    setTransfers((prev) => [newTransfer, ...prev]);

    // Check if downstream orders of target branch status was "Transfer Needed", and resolve it!
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.branch === destination && ord.status === "Transfer Needed" && ord.items.some(it => it.itemId === itemId)) {
          return { ...ord, status: "In Preparation" };
        }
        return ord;
      })
    );

    // Record Staff Log
    const newActivity: StaffActivity = {
      id: `ACT-${Math.floor(500 + Math.random() * 500)}`,
      timestamp: new Date().toISOString(),
      staffName: "System Automation Release",
      branch: destination,
      action: `Transferred ${qty} units of ${chosenItem.name} from ${source} to satisfy local reorder limitations.`,
      status: "Success",
    };
    setActivities((prev) => [newActivity, ...prev]);

    setNotification(`Successfully dispatched and balanced ${qty} units of ${chosenItem.name} to ${destination}!`);
  };

  // 2. Headquarter/CEO approvals triggers (Discounts / Transfers releases)
  const handleProcessApproval = (appId: string, action: "Approved" | "Declined") => {
    const targetAppObj = approvals.find((a) => a.id === appId);
    if (!targetAppObj) return;

    // Update approval queue state
    setApprovals((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: action } : a))
    );

    if (action === "Approved") {
      // If it is a discount related approval, release the downstream Showroom Order lock
      if (targetAppObj.type === "Discount Request" && targetAppObj.relatedId) {
        setOrders((prev) =>
          prev.map((ord) =>
            ord.id === targetAppObj.relatedId ? { ...ord, status: "In Preparation", approvedBy: "CEO CEO-HEAD" } : ord
          )
        );
      }

      // If it is a headquarters stock transfer approval
      if (targetAppObj.type === "Stock Transfer" && targetAppObj.itemId && targetAppObj.qty) {
        handleInitiateTransfer(targetAppObj.itemId, targetAppObj.qty, BranchName.LahoreWarehouse, targetAppObj.branch);
      }
    }

    // Record Activity
    const newAct: StaffActivity = {
      id: `ACT-${Math.floor(500 + Math.random() * 500)}`,
      timestamp: new Date().toISOString(),
      staffName: "Chief Executive Officer",
      branch: targetAppObj.branch,
      action: `${action} Headquarters Release authorization for request ${appId}.`,
      status: action === "Approved" ? "Success" : "Warning",
    };
    setActivities((prev) => [newAct, ...prev]);

    setNotification(`CEO Action Committed: Request ${appId} has been successfully ${action.toLowerCase()}.`);
  };

  // 3. Receive partial installment payment logs and recalculate customer ledger balance
  const handleCollectPayment = (orderId: string, paymentId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId && ord.installmentPlan) {
          const plan = ord.installmentPlan;
          let collectedAmount = 0;

          const updatedPayments = plan.payments.map((p) => {
            if (p.id === paymentId) {
              collectedAmount = p.amountPKR;
              return { ...p, status: "Paid" as const, datePaid: new Date().toISOString().split("T")[0] };
            }
            return p;
          });

          const newRemaining = Math.max(plan.remainingBalancePKR - collectedAmount, 0);

          // If fully paid, change status of the overall program
          return {
            ...ord,
            installmentPlan: {
              ...plan,
              payments: updatedPayments,
              remainingBalancePKR: newRemaining,
            },
          };
        }
        return ord;
      })
    );

    // Add activity
    const matchedOrd = orders.find((o) => o.id === orderId);
    const newAct: StaffActivity = {
      id: `ACT-${Math.floor(500 + Math.random() * 500)}`,
      timestamp: new Date().toISOString(),
      staffName: "Accounts Desk",
      branch: activeBranch,
      action: `Recorded successful payment installment receipt for customer: ${matchedOrd?.customerName || "Showroom Guest"}`,
      status: "Success",
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // 4. Send automated installment SMS text templates
  const handleSendReminder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId && o.installmentPlan) {
          return {
            ...o,
            installmentPlan: { ...o.installmentPlan, reminderSent: true },
          };
        }
        return o;
      })
    );

    const target = orders.find((o) => o.id === orderId);
    // Add activity
    const newAct: StaffActivity = {
      id: `ACT-${Math.floor(500 + Math.random() * 500)}`,
      timestamp: new Date().toISOString(),
      staffName: "System Automation",
      branch: activeBranch,
      action: `Dispatched SMS/invoice credit settlement alert to ${target?.customerName}.`,
      status: "Success",
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // 5. Admin restock incremental receipts
  const handleUpdateStockDirectly = (itemId: string, increment: number, targetBranch: BranchName) => {
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const currentCount = item.stockByBranch[targetBranch] || 0;
          return {
            ...item,
            stockByBranch: {
              ...item.stockByBranch,
              [targetBranch]: currentCount + increment,
            },
          };
        }
        return item;
      })
    );

    const targetItemName = stockItems.find(it => it.id === itemId)?.name || "fine product";

    // Add activity
    const newAct: StaffActivity = {
      id: `ACT-${Math.floor(500 + Math.random() * 500)}`,
      timestamp: new Date().toISOString(),
      staffName: "Warehouse Receiver",
      branch: targetBranch,
      action: `Unloaded direct restock of (+${increment}) units for ${targetItemName}.`,
      status: "Success",
    };
    setActivities((prev) => [newAct, ...prev]);

    // Check if downstream orders of target branch status was "Transfer Needed", and resolve it!
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.branch === targetBranch && ord.status === "Transfer Needed" && ord.items.some(it => it.itemId === itemId)) {
          return { ...ord, status: "In Preparation" };
        }
        return ord;
      })
    );

    setNotification(`Unloaded raw restock of 1 unit of ${targetItemName} successfully.`);
  };

  // 6. Push a new sales order
  const handleAddNewOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);

    // If order was created without a transfer needed, decrement stock from local branch
    if (newOrder.status !== "Transfer Needed") {
      const ordItem = newOrder.items[0];
      setStockItems((prev) =>
        prev.map((item) => {
          if (item.id === ordItem.itemId) {
            const currentStock = item.stockByBranch[activeBranch] || 0;
            return {
              ...item,
              stockByBranch: {
                ...item.stockByBranch,
                [activeBranch]: Math.max(currentStock - ordItem.quantity, 0),
              },
            };
          }
          return item;
        })
      );
    }

    // Add staff logging event
    const newAct: StaffActivity = {
      id: `ACT-${Math.floor(500 + Math.random() * 500)}`,
      timestamp: new Date().toISOString(),
      staffName: "Showroom Attendant",
      branch: activeBranch,
      action: `Locked down new order ${newOrder.id} for ${newOrder.customerName}.`,
      status: "Success",
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // On selecting a search result node
  const handleSelectSearchResult = (result: any) => {
    setSearchQuery("");
    setActiveTab(result.tab);
    setNotification(`Focused command center on ${result.label} [Category: ${result.type}].`);
  };

  // State context bundle parsed to the backend Copilot
  const copilotContext = useMemo(() => ({
    stockItems,
    orders: orders.map((o) => ({
      id: o.id,
      customerName: o.customerName,
      branch: o.branch,
      status: o.status,
      totalPKR: o.totalPKR,
      paymentType: o.paymentType,
      installmentPlanRemaining: o.installmentPlan?.remainingBalancePKR || 0,
    })),
    approvalsCount: approvals.filter((a) => a.status === "Pending").length,
    activeBranch,
  }), [stockItems, orders, approvals, activeBranch]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#E5E5E5] flex flex-col font-sans selection:bg-[#C5A059]/20 selection:text-[#C5A059]">
      
      {/* 1. Global Navigation Top Header */}
      <header className="border-b border-white/5 bg-[#151515] sticky top-0 z-40 px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg shadow-black/20" id="global-header">
        
        {/* Brand identity & Hamburger drawer toggle */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 mr-0.5 bg-white/5 hover:bg-white/10 active:bg-[#C5A059]/10 text-[#C5A059] border border-white/5 hover:border-white/10 rounded-lg md:hidden cursor-pointer transition-colors"
              aria-label="Toggle Navigation Drawer"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div className="w-8 h-8 bg-[#C5A059] rounded-sm flex items-center justify-center shrink-0">
              <div className="w-4 h-4 border-2 border-[#0F0F0F]"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xl font-serif italic tracking-tight font-bold text-white">Wood World <span className="text-[#C5A059] font-sans text-[10px] uppercase tracking-widest ml-1 font-semibold">Enterprise</span></span>
              </div>
              <p className="text-[9px] font-mono text-stone-500 tracking-wider mt-0.5 uppercase">Executive Control System • ERP v3.5</p>
            </div>
          </div>

          {/* Shown on mobile instead of desktop margin toggle display */}
          <span className="flex md:hidden text-[9px] font-mono text-stone-500 gap-1 items-center bg-[#0F0F0F] px-2 py-1 rounded border border-white/5 uppercase">
            <strong className="text-[#C5A059] font-bold">{activeBranch.split(" ")[0]}</strong>
          </span>
        </div>

        {/* Global Search Interface with Hotkey info */}
        <div className="relative flex-1 max-w-sm w-full md:mx-4">
          <div className="absolute inset-y-0 left-3 flex items-center text-stone-500 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, orders, customers... [⌘+K]"
            className="w-full bg-[#151515] hover:bg-[#1A1A1A] focus:bg-[#151515] border border-white/5 hover:border-white/10 focus:border-[#C5A059]/30 rounded-lg py-2 pl-9 pr-12 text-xs text-[#E5E5E5] placeholder-stone-600 outline-none transition-all"
          />
          <span className="absolute inset-y-0 right-2 flex items-center py-1.5 text-[8px] font-mono text-stone-500 border border-white/5 bg-[#0F0F0F]/60 rounded px-1.5 self-center select-none">
            ⌘ K
          </span>

          {/* Real-time interactive Global Search results overlay  */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#151515] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
              <span className="block px-3 py-1.5 text-[8px] font-mono text-neutral-500 uppercase border-b border-white/5 bg-[#0F0F0F]">Matched ERP Results</span>
              {searchResults.map((res, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSearchResult(res)}
                  className="w-full text-left px-3 py-2 hover:bg-[#1A1A1A] text-xs flex justify-between items-center transition-colors border-b border-white/5 last:border-0 cursor-pointer text-stone-300"
                >
                  <span className="font-semibold line-clamp-1">{res.label}</span>
                  <span className="text-[9px] font-mono bg-[#0F0F0F] border border-white/5 text-[#C5A059] py-0.5 px-1.5 rounded uppercase">
                    {res.tab}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick operations & AI copilot toggle button */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 w-full md:w-auto">
          {/* Executive Role Switcher */}
          <div className="flex items-center gap-1 bg-[#0F0F0F] border border-white/5 p-1 rounded-lg">
            <span className="text-[9px] font-mono text-stone-500 px-2 uppercase font-medium">Clearance:</span>
            <select
              value={currentRole}
              onChange={(e) => {
                const selectedRole = e.target.value;
                setCurrentRole(selectedRole);
                
                // Adjust active branch automatically based on role for optimal UX
                if (selectedRole === "KarachiManager") {
                  setActiveBranch(BranchName.KarachiShowroom);
                  setActiveTab("onsite");
                  setNotification("Assumed Sohail Shah credentials (Karachi Showroom Manager). Auto-switched to Onsite Desk.");
                } else if (selectedRole === "LahoreManager") {
                  setActiveBranch(BranchName.LahoreWarehouse);
                  setActiveTab("onsite");
                  setNotification("Assumed Azeem Butt credentials (Lahore Central Warehouse Manager). Auto-switched to Onsite Desk.");
                } else if (selectedRole === "IslamabadManager") {
                  setActiveBranch(BranchName.IslamabadShowroom);
                  setActiveTab("onsite");
                  setNotification("Assumed Bilal Dar credentials (Islamabad Showroom Manager). Auto-switched to Onsite Desk.");
                } else {
                  setActiveTab("dashboard");
                  setNotification("Assumed Owner / CEO Master credentials. Accessing multi-branch consolidated analytics.");
                }
              }}
              className="bg-[#151515] border-0 text-[#C5A059] font-mono text-[10px] font-bold uppercase py-1 px-2.5 rounded cursor-pointer outline-none focus:ring-1 focus:ring-[#C5A059]/30"
              id="role-clearance-switcher"
            >
              <option value="Owner">Master CEO & Owner</option>
              <option value="KarachiManager">Karachi Showroom Mgr</option>
              <option value="LahoreManager">Lahore Warehouse Mgr</option>
              <option value="IslamabadManager">Islamabad Showroom Mgr</option>
            </select>
          </div>

          {/* Active branch toggle display */}
          <span className="hidden md:flex text-[10px] font-mono text-stone-550 gap-1.5 items-center mr-2">
            <span>Showroom:</span>
            <strong className="text-[#C5A059] uppercase">{activeBranch.split(" ")[0]}</strong>
          </span>

          <button
            onClick={() => setCopilotOpen(!copilotOpen)}
            className="p-2 bg-gradient-to-br from-[#1A1A1A] to-[#252525] hover:from-[#1E1E1E] hover:to-[#2D2D2D] text-[#C5A059] border border-white/10 hover:border-[#C5A059]/40 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group font-semibold"
            id="copilot-toggle-header-btn"
          >
            <Sparkles className="w-4 h-4 text-[#C5A059] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider hidden sm:block">Copilot AI</span>
          </button>
        </div>
      </header>

      {/* 2. Automated Smart Business Alert Notification Banner */}
      {notification && (
        <div className="bg-[#151515] border-b border-white/10 px-4 py-2.5 flex items-center justify-between text-xs text-[#C5A059] gap-4" id="alert-notification-banner">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A059]"></span>
            </span>
            <span className="font-medium text-[#E5E5E5]/90">{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-[10px] font-mono uppercase text-[#C5A059] hover:text-white cursor-pointer py-0.5 px-1.5 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* 3. Outer Frame & Lateral Tabs Grid */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Mobile navigation backdrop */}
        {menuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-45 md:hidden transition-all duration-300"
            id="mobile-nav-backdrop"
          />
        )}

        {/* Navigation Sidebar Drawer with 4 Smart Grouped Folders representing the 20 departments */}
        <aside className={`fixed inset-y-0 left-0 h-full z-50 w-72 shrink-0 bg-[#0A0A0A] md:bg-[#0A0A0A]/90 border-r border-white/5 p-4 md:p-3 space-y-4 overflow-y-auto transform transition-transform duration-300 md:sticky md:top-[64px] md:h-[calc(100vh-64px)] md:z-auto md:w-64 md:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`} id="main-sidebar">

          {/* Mobile Sidebar Close Header */}
          <div className="flex items-center justify-between md:hidden pb-3 border-b border-white/5 mb-2">
            <span className="text-[10px] font-mono text-[#C5A059] font-bold uppercase tracking-widest">Enterprise Navigation</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-1.5 hover:bg-white/5 rounded border border-white/5 text-[#C5A059] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Quick Info & User Role Display inside Sidebar Header */}
          <div className="px-3 py-2 bg-gradient-to-r from-white/[0.02] to-transparent border border-white/5 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider">Enterprise Token</span>
              <span className="text-[9px] font-mono bg-[#C5A059]/15 text-[#C5A059] px-1.5 py-0.5 rounded font-bold uppercase">{currentRole}</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium mt-1 truncate">
              {activeBranch.replace("Showroom", " HQ")}
            </p>
          </div>

          {[
            {
              title: "SHOWROOM & OPERATIONS",
              color: "text-[#CBB279]",
              tabs: [
                { id: "dashboard", label: "Executive KPI", icon: Compass },
                { id: "onsite", label: "Manager Desk", icon: ClipboardList },
                { id: "showroom", label: "Walk-in Guest", icon: Users },
                { id: "customers", label: "Customer Directory", icon: Users },
                { id: "custom-design", label: "Custom Studio", icon: Hammer },
                { id: "sales", label: "Showroom Orders", icon: ShoppingCart }
              ]
            },
            {
              title: "MANUFACTURING & SUPPLY",
              color: "text-amber-500",
              tabs: [
                { id: "workshop", label: "Workshop Queue", icon: Hammer, badge: "3 Job" },
                { id: "stock", label: "Showroom Stock", icon: Sliders, badge: "Low Stock Alert" },
                { id: "qr-system", label: "QR Tag & Barcode", icon: ScanLine },
                { id: "smart-warehouse", label: "Smart Warehouse", icon: ScanLine },
                { id: "deliveries", label: "Deliveries tracking", icon: Truck, badge: "Transit" },
                { id: "procurement", label: "Timber Suppliers", icon: Building }
              ]
            },
            {
              title: "INTELLIGENT INTEGRATION",
              color: "text-violet-400",
              tabs: [
                { id: "executive-ai", label: "Gemini Intelligence", icon: Sparkles, badge: "AI Ready" },
                { id: "approvals-all", label: "Unified Approvals", icon: GitPullRequest, badge: "Pending Lock" },
                { id: "multi-outlet", label: "Branch Performance", icon: Building },
                { id: "daily-ops", label: "Daily Operations", icon: Sliders }
              ]
            },
            {
              title: "CORPORATE SERVICES",
              color: "text-emerald-400",
              tabs: [
                { id: "digital-invoices", label: "POS Billing & Invoices", icon: FileText },
                { id: "comms-center", label: "Multi-Channel CRM", icon: Mail },
                { id: "ledger", label: "Credit & Installment", icon: CreditCard },
                { id: "finance", label: "Cashflow Ledger", icon: DollarSign },
                { id: "hr", label: "Employee HR Hub", icon: UserPlus },
                { id: "documents", label: "Documents Vault", icon: FileText },
                { id: "after-sales", label: "After-Sales & CRM", icon: HelpCircle }
              ]
            }
          ].map((grp) => {
            const isExpanded = expandedGroups[grp.title];
            return (
              <div key={grp.title} className="space-y-1">
                <button
                  onClick={() => setExpandedGroups(prev => ({ ...prev, [grp.title]: !prev[grp.title] }))}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="tracking-wider">{grp.title}</span>
                  <span className="text-[9px] text-zinc-600">
                    {isExpanded ? "▼" : "▶"}
                  </span>
                </button>

                {isExpanded && (
                  <div className="flex flex-col gap-0.5 pl-1.5 border-l border-white/5 ml-2 mt-1">
                    {grp.tabs.map((tb) => {
                      const Icon = tb.icon;
                      const isSelected = activeTab === tb.id;
                      
                      // Calculate badge numbers dynamically
                      let actualBadgeText = "";
                      let isUrgent = false;

                      if (tb.id === "stock") {
                        const lowCount = stockItems.filter(item => (item.stockByBranch[activeBranch] || 0) <= item.alertThreshold).length;
                        if (lowCount > 0) {
                          actualBadgeText = `${lowCount} Alert`;
                          isUrgent = true;
                        }
                      } else if (tb.id === "approvals-all") {
                        const pendCount = approvals.filter(a => a.status === "Pending").length;
                        if (pendCount > 0) {
                          actualBadgeText = `${pendCount} Lock`;
                          isUrgent = true;
                        }
                      } else if (tb.badge) {
                        actualBadgeText = tb.badge;
                      }

                      return (
                        <button
                          key={tb.id}
                          onClick={() => setActiveTab(tb.id)}
                          className={`w-full text-left py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-all group cursor-pointer ${
                            isSelected
                              ? "bg-white/5 border-l-2 border-[#C5A059] text-[#C5A059] font-bold"
                              : "hover:bg-white/5 text-stone-400 hover:text-stone-200"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${isSelected ? "text-[#C5A059]" : "text-stone-500 group-hover:text-stone-300"}`} />
                            <span className="truncate">{tb.label}</span>
                          </div>
                          
                          {actualBadgeText && (
                            <span className={`text-[8px] font-mono tracking-tighter py-0.5 px-1.5 border rounded leading-none shrink-0 ${
                              isUrgent 
                                ? "bg-red-500/10 text-red-400 border-red-500/20" 
                                : "bg-[#151515] text-[#C5A059]/80 border-white/5"
                            }`}>
                              {actualBadgeText}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick Shortcuts status marker */}
          <div className="hidden md:block pt-4 border-t border-white/5 px-3 space-y-1.5">
            <span className="text-[9px] font-mono text-stone-600 uppercase tracking-widest block">System Hotkeys</span>
            <div className="text-[10px] font-mono text-zinc-500 space-y-1">
              <div className="flex justify-between">
                <span>[⌘+K]</span>
                <span>Search Desk</span>
              </div>
              <div className="flex justify-between">
                <span>[⌘+I]</span>
                <span>AI Copilot</span>
              </div>
            </div>
          </div>
        </aside>

        {/* 4. Active ERP Worksheets Canvas */}
        <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto" id="main-content-panel">
          
          {/* Main Title showing Branch specific control */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div>
              <div className="text-[10px] font-mono text-[#C5A059] uppercase tracking-widest mb-1">
                Wood World Enterprise Headquarters System
              </div>
              <h2 className="font-sans font-bold text-xl sm:text-2xl text-stone-100 tracking-tight flex items-center gap-2">
                <span>Branch Management Control Node</span>
                <span className="text-[11px] uppercase bg-[#151515] border border-white/10 text-stone-400 py-0.5 px-2.5 rounded-md font-mono">
                  {activeBranch}
                </span>
              </h2>
            </div>

            {/* Quick Interactive Switch Branch Button inside visual header */}
            <div className="flex items-center gap-2 bg-[#151515] p-1.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-mono text-stone-500 px-2 uppercase tracking-tight hidden lg:block">Showroom Switcher:</span>
              <div className="flex gap-1">
                {Object.values(BranchName).map((bNode) => (
                  <button
                    key={bNode}
                    onClick={() => {
                      setActiveBranch(bNode);
                      setNotification(`Context swiped: Now supervising operations at ${bNode}.`);
                    }}
                    className={`py-1 px-2.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all border cursor-pointer ${
                      activeBranch === bNode
                        ? "bg-[#C5A059]/15 border-[#C5A059]/40 text-[#C5A059] font-bold"
                        : "bg-transparent border-transparent hover:border-white/10 text-stone-500 hover:text-stone-300"
                    }`}
                  >
                    {bNode.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Conditional Active Content render mapping defined states */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 select-text">
              {/* Executive Indicators Grid */}
              <KPIStats
                orders={orders}
                stockItems={stockItems}
                approvals={approvals}
                onSelectAction={(tabId) => setActiveTab(tabId)}
              />

              {/* Comparative Multi-Branch Analysis & Activity log */}
              <BranchPerformance
                activeBranch={activeBranch}
                onBranchSelect={(b) => setActiveBranch(b)}
                orders={orders}
                stockItems={stockItems}
                activities={activities}
              />

              {/* Dynamic Automated Summary Actionable dashboard panel */}
              <div className="p-6 bg-gradient-to-br from-[#1A1A1A] to-[#252525] border border-white/10 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 blur-3xl"></div>
                <div className="space-y-1.5 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block p-1 bg-[#C5A059]/10 text-[#C5A059] rounded-sm border border-[#C5A059]/20">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    </span>
                    <span className="font-mono text-[9px] text-[#C5A059] uppercase tracking-widest font-semibold block">Wood World Copilot Executive Report Summary</span>
                  </div>
                  <h4 className="font-serif italic text-base sm:text-lg text-white font-bold">How would you like AI to assist Wood World operations today?</h4>
                  <p className="text-xs text-[#E5E5E5]/70 max-w-xl leading-relaxed">
                    Get deep analytical models regarding Lahore Central Warehouse inventories, Karachi showroom dispatch backlogs, or Islamabad discount reviews. Copilot interprets current ERP parameters instantly.
                  </p>
                </div>

                <button
                  onClick={() => setCopilotOpen(true)}
                  className="py-3 px-6 rounded-xl bg-[#C5A059] hover:bg-[#b59049] text-[#0F0F0F] text-[11px] font-mono uppercase font-bold tracking-widest flex items-center gap-2 cursor-pointer transition-all hover:translate-x-1 shrink-0 relative z-10"
                >
                  <span>Launch Business Copilot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {activeTab === "onsite" && (
            <ManagerOnsiteDesk
              currentRole={currentRole}
              activeBranch={activeBranch}
              stockItems={stockItems}
              orders={orders}
              transfers={transfers}
              approvals={approvals}
              activities={activities}
              onAddNewOrder={handleAddNewOrder}
              onUpdateOrderStatus={(orderId, nextStatus) => {
                setOrders((prev) =>
                  prev.map((ord) => (ord.id === orderId ? { ...ord, status: nextStatus } : ord))
                );
                setNotification(`Order ${orderId} status progressed to ${nextStatus}.`);
              }}
              onAddNewApprovalRequest={(newApp) => {
                setApprovals((prev) => [newApp, ...prev]);
              }}
              onUpdateTransferStatus={(transferId, nextStatus) => {
                setTransfers((prev) =>
                  prev.map((tr) => (tr.id === transferId ? { ...tr, status: nextStatus } : tr))
                );
              }}
              onAddDirectActivity={(newAct) => {
                setActivities((prev) => [newAct, ...prev]);
              }}
              formatPKR={formatPKR}
            />
          )}

          {activeTab === "stock" && (
            <InventoryOverview
              stockItems={stockItems}
              activeBranch={activeBranch}
              onInitiateTransfer={handleInitiateTransfer}
              onUpdateStockDirectly={handleUpdateStockDirectly}
            />
          )}

          {activeTab === "sales" && (
            <OrderManagement
              orders={orders}
              stockItems={stockItems}
              activeBranch={activeBranch}
              onAddNewOrder={handleAddNewOrder}
            />
          )}

          {activeTab === "approvals" && (
            <ApprovalsQueue
              approvals={approvals}
              onProcessApproval={handleProcessApproval}
              currentRole={currentRole}
            />
          )}

          {activeTab === "ledger" && (
            <InstallmentsLedger
              orders={orders}
              onCollectPayment={handleCollectPayment}
              onSendReminder={handleSendReminder}
            />
          )}

          {activeTab === "customers" && (
            <CustomerManagement
              activeBranch={activeBranch}
              onAddDirectActivity={(newAct) => setActivities((prev) => [newAct, ...prev])}
              formatPKR={formatPKR}
            />
          )}

          {activeTab === "qr-system" && (
            <SmartQRSystem
              stockItems={stockItems}
              activeBranch={activeBranch}
              onAddDirectActivity={(newAct) => setActivities((prev) => [newAct, ...prev])}
            />
          )}

          {activeTab === "comms-center" && (
            <CommunicationCenter
              activeBranch={activeBranch}
              onAddDirectActivity={(newAct) => setActivities((prev) => [newAct, ...prev])}
            />
          )}

          {activeTab === "digital-invoices" && (
            <DigitalInvoiceCenter
              orders={orders}
              stockItems={stockItems}
              activeBranch={activeBranch}
              formatPKR={formatPKR}
            />
          )}

          {["showroom", "custom-design", "workshop", "smart-warehouse", "deliveries", "procurement", "executive-ai", "approvals-all", "multi-outlet", "daily-ops", "finance", "hr", "documents", "after-sales"].includes(activeTab) && (
            <EnterpriseEcosystem
              activeTab={activeTab}
              currentRole={currentRole}
              activeBranch={activeBranch}
              stockItems={stockItems}
              orders={orders}
              transfers={transfers}
              approvals={approvals}
              activities={activities}
              onAddNewOrder={handleAddNewOrder}
              onUpdateOrderStatus={(orderId, nextStatus) => {
                setOrders((prev) =>
                  prev.map((ord) => (ord.id === orderId ? { ...ord, status: nextStatus } : ord))
                );
                setNotification(`Order ${orderId} status progressed to ${nextStatus}.`);
              }}
              onAddNewApprovalRequest={(newApp) => {
                setApprovals((prev) => [newApp, ...prev]);
              }}
              onUpdateTransferStatus={(transferId, nextStatus) => {
                setTransfers((prev) =>
                  prev.map((tr) => (tr.id === transferId ? { ...tr, status: nextStatus } : tr))
                );
              }}
              onAddDirectActivity={(newAct) => {
                setActivities((prev) => [newAct, ...prev]);
              }}
              formatPKR={formatPKR}
            />
          )}

        </main>

        {/* 5. Floating AI Business Copilot Drawer Section */}
        <CopilotDrawer
          isOpen={copilotOpen}
          onClose={() => setCopilotOpen(false)}
          contextData={copilotContext}
          onApplyAction={(type, payload) => {
            if (type === "transfer") {
              handleInitiateTransfer(payload.itemId, payload.qty, payload.source, payload.destination);
            }
          }}
        />

      </div>

      {/* Corporate footer info */}
      <footer className="h-12 bg-[#1A1A1A] border-t border-white/5 px-8 flex items-center justify-between text-[10px] font-mono text-zinc-500">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white/40">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            SYSTEMS NOMINAL
          </div>
          <div className="text-white/20 hidden sm:block">LATENCY: 12ms</div>
        </div>
        <div className="flex gap-6 items-center text-[#C5A059] uppercase tracking-widest font-bold text-[9px]">
          <span>© 2026 Wood World Enterprise Ltd.</span>
          <span className="hidden md:inline">• HQ: II Chundrigar Rd, Karachi, Pakistan.</span>
        </div>
      </footer>

    </div>
  );
}
