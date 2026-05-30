import React, { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  Layers,
  Sparkles,
  Award,
  Plus,
  Compass,
  CheckCircle,
  Clock,
  Wrench,
  Hammer,
  AlertCircle,
  Truck,
  ScanLine,
  Search,
  Check,
  Building,
  GitPullRequest,
  Tv,
  HelpCircle,
  FileText,
  DollarSign,
  UserPlus,
  Send,
  Printer,
  XCircle,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Flame,
  User,
  Sliders,
  Maximize2,
  Info,
  QrCode,
  Mail,
  MessageSquare,
  FileSignature,
  Download
} from "lucide-react";
import { BranchName, StockItem, Order, StockTransfer, ManagerApproval, StaffActivity } from "../types";

interface EnterpriseEcosystemProps {
  activeTab: string;
  currentRole: string;
  activeBranch: BranchName;
  stockItems: StockItem[];
  orders: Order[];
  transfers: StockTransfer[];
  approvals: ManagerApproval[];
  activities: StaffActivity[];
  onAddNewOrder: (newOrder: Order) => void;
  onUpdateOrderStatus: (orderId: string, nextStatus: any) => void;
  onAddNewApprovalRequest: (newApp: ManagerApproval) => void;
  onUpdateTransferStatus: (transferId: string, nextStatus: any) => void;
  onAddDirectActivity: (newAct: StaffActivity) => void;
  formatPKR: (num: number) => string;
}

// Structured Local Initial Seed Mock Data for Extended Ecosystem Modules
const initialVisitors = [
  { id: "VIS-101", name: "Malik Jahangir", phone: "0300-8884928", interest: "Premium Walnut Dining Set", interestQty: 1, rep: "Farhan Attendant", tag: "VIP", date: "2026-05-29", status: "Consultation Booked" },
  { id: "VIS-102", name: "Sanam Saigol", phone: "0321-4433291", interest: "Royal Chesterfield Sofa", interestQty: 2, rep: "Daniyal Attendant", tag: "Regular", date: "2026-05-29", status: "Interested" },
  { id: "VIS-103", name: "Zubair Siddiqui", phone: "0333-7281902", interest: "Rosewood Canopy Bed Set", interestQty: 1, rep: "Hamza Attendant", tag: "Regular", date: "2026-05-28", status: "Follow up tomorrow" }
];

const initialConsultations = [
  { id: "CON-701", clientName: "Malik Jahangir", date: "2026-06-02", time: "11:00 AM", designer: "Ar. Ayesha Mahmood", topic: "DHA Residence Interior Plan", status: "Confirmed" },
  { id: "CON-702", clientName: "Amna Baig", date: "2026-06-04", time: "03:30 PM", designer: "Ar. Ayesha Mahmood", topic: "Gulberg Penthouse Furniture Pack", status: "Pending" }
];

const initialCustomFurnitureOrders = [
  { id: "CST-001", itemName: "Mughal Carved Double Wardrobe", woodType: "Sheesham Rosewood", polish: "Antique Dark Walnut", fabric: "None", dimensions: "8ft W x 7.5ft H x 2.5ft D", price: 395000, timeline: 18, status: "Pending Workshop", date: "2026-05-29", clientName: "Zahid Mansoor" }
];

const initialWorkshopTasks = [
  { id: "WRK-501", itemName: "Emperor Walnut Dining Table Base", assignedCarpenter: "Ustad Allah Ditta", stage: "Polishing", deadline: "2026-06-03", notes: "Carvings completed. Prepping matte polish layers.", speedCount: 4 },
  { id: "WRK-502", itemName: "Royal Chesterfield Velvet Frame", assignedCarpenter: "Ustad Gulzar", stage: "In Production", deadline: "2026-06-05", notes: "Structure reinforcement in progress. Acacia wood.", speedCount: 2 },
  { id: "WRK-503", itemName: "Mughal Carved Double Wardrobe", assignedCarpenter: "Ustad Allah Ditta", stage: "Pending", deadline: "2026-06-20", notes: "Awaiting final wood blocks release from Raw Yard.", speedCount: 0 }
];

const initialInteriorProjects = [
  { id: "PRJ-991", clientName: "Siddique Heights Penthouse", budget: 3500000, spent: 1850000, status: "Active (Stage 2: Woodwork Framing)", manager: "Engr. Noman Shah", scheduleDate: "2026-06-05", roomPlanning: "Drawing + Master Bedroom Suite", packages: "Heritage Carvings Luxury Set" },
  { id: "PRJ-992", clientName: "Islamabad Corporate Head Office", budget: 8500000, spent: 4400000, status: "Active (Stage 1: Room Site Audit)", manager: "Engr. Noman Shah", scheduleDate: "2026-06-01", roomPlanning: "Executive Cabins + Conference Floor", packages: "Minimalist Red Oak Executive Series" }
];

const initialDeliveries = [
  { id: "DEL-801", orderId: "ORD-9462", address: "DHA Phase 6, Block C, House 44, Karachi", status: "Scheduled", driver: "Farooq Driver", tracker: "K-Logistics Elite Truck 3", otp: "4021", completedPhoto: "", rating: 0, feedback: "" },
  { id: "DEL-802", orderId: "ORD-9465", address: "Sector F-7/2, Street 18, Islamabad", status: "Customer Approved", driver: "Majid Loader", tracker: "I-Logistics Delivery Van 1", otp: "5183", completedPhoto: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=200", rating: 5, feedback: "Excellent carving details and timely setup. Highly satisfied." }
];

const initialSuppliers = [
  { id: "SUP-201", partner: "Northern Pines Timber Corp", woodSource: "Kaghan & Swat Forest Reserves", status: "Active Supplier", score: "96/100 Excellent", pendingLogsCount: 4, outstandingReceipts: 650000 },
  { id: "SUP-202", partner: "Acacia Polishing & Varnishes Ltd", woodSource: "Lahore Industrial Zone", status: "Active Supplier", score: "92/100 Timely", pendingLogsCount: 2, outstandingReceipts: 180000 }
];

const initialProcurementLogs = [
  { id: "PROC-301", rawWood: "Seasoned Red Oak blocks (500 CFT)", supplier: "Northern Pines Timber Corp", cost: 1200000, dispatchDate: "2026-06-03", state: "Scheduled" }
];

const initialSupportTickets = [
  { id: "ST-881", customerName: "Zuhair Shah", date: "2026-05-28", type: "Carving Finish Repair", responseDate: "2026-05-30", details: "Scratched corner edge from lounge table delivery transit", status: "Scheduled" }
];

const initialRemindersTasks = [
  { id: "TSK-401", title: "Conduct Quality check on Emperor Walnut Dining table", assignment: "Ustad Allah Ditta", priority: "High", deadline: "2026-05-30", status: "To Do" },
  { id: "TSK-402", title: "Follow-up Malik Jahangir regarding custom polish samples", assignment: "Farhan Attendant", priority: "Medium", deadline: "2026-05-31", status: "To Do" }
];

const initialCashflowLog = [
  { id: "CSH-211", type: "Inflow", detail: "Booking deposit for custom Mughal Wardrobe", category: "Custom Sales", amount: 200000, stamp: "2026-05-29" },
  { id: "CSH-212", type: "Outflow", detail: "Procured glue and carving compound barrels", category: "Workshop supplies", amount: 45000, stamp: "2026-05-29" }
];

const initialHREmployees = [
  { id: "EMP-41", name: "Ustad Allah Ditta", branch: BranchName.LahoreWarehouse, role: "Senior Classical Carver", attendance: "Active (Checked in 08:15 AM)", monthSalPKR: 125000, leaveBalance: 8, rating: "4.9/5 Master Carpenter" },
  { id: "EMP-42", name: "Ar. Ayesha Mahmood", branch: BranchName.KarachiShowroom, role: "Chief Luxury Interior Architect", attendance: "Active (Checked in 09:20 AM)", monthSalPKR: 175000, leaveBalance: 12, rating: "4.8/5 Creative Designer" },
  { id: "EMP-43", name: "Farhan Attendant", branch: BranchName.KarachiShowroom, role: "Showroom Client Attendant", attendance: "Active (Checked in 09:00 AM)", monthSalPKR: 65000, leaveBalance: 14, rating: "4.5/5 High Sales Converters" }
];

const EnterpriseEcosystem = React.memo(function EnterpriseEcosystem({
  activeTab,
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
  formatPKR
}: EnterpriseEcosystemProps) {
  // State for modules which are entirely maintained locally with full interactivity
  const [visitors, setVisitors] = useState(initialVisitors);
  const [consultations, setConsultations] = useState(initialConsultations);
  const [customOrders, setCustomOrders] = useState(initialCustomFurnitureOrders);
  const [workshopTasks, setWorkshopTasks] = useState(initialWorkshopTasks);
  const [interiorProjects, setInteriorProjects] = useState(initialInteriorProjects);
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [procurements, setProcurements] = useState(initialProcurementLogs);
  const [supportTickets, setSupportTickets] = useState(initialSupportTickets);
  const [reminders, setReminders] = useState(initialRemindersTasks);
  const [cashflows, setCashflows] = useState(initialCashflowLog);
  const [employees, setEmployees] = useState(initialHREmployees);

  // Dynamic values state for form inputs
  const [newVisitor, setNewVisitor] = useState({ name: "", phone: "", interest: "Dining", rep: "Farhan Attendant", tag: "Regular" });
  const [newConsult, setNewConsult] = useState({ clientName: "", time: "11:00 AM", designer: "Ar. Ayesha Mahmood", topic: "" });
  
  // Custom Studio States
  const [customItem, setCustomItem] = useState({
    name: "Classic Empress Bedstead",
    woodType: "Genuine Sheesham (Rosewood)",
    polish: "Antique Matte Honey",
    fabric: "Royal Velvet",
    dimensions: "W6.5ft x L7ft x H5.5ft",
    refUpload: ""
  });
  const [customAiPreview, setCustomAiPreview] = useState("");
  const [customCADDrafting, setCustomCADDrafting] = useState<any>(null);

  // Site visits schedule state
  const [newProject, setNewProject] = useState({
    clientName: "",
    budget: 2000000,
    spent: 0,
    manager: "Engr. Noman Shah",
    roomPlanning: "Complete Villa",
    packages: "Grand Imperial Series"
  });

  // Damage reporting state
  const [damageItemInput, setDamageItemInput] = useState({ itemId: "ST-001", reason: "" });
  const [warehouseGridSearch, setWarehouseGridSearch] = useState("");

  // OTP Deliveries Confirm input simulation state map
  const [otpVerifyState, setOtpVerifyState] = useState<Record<string, string>>({});

  // Unified Approval Creator inside ecosystem
  const [newApprovalForm, setNewApprovalForm] = useState({
    type: "Discount Request" as any,
    details: "",
    amountPKR: 20000
  });

  // Executive AI Chat Assistant console local state
  const [aiResponseText, setAiResponseText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState("");

  // CRM Customer Profiles States
  const [customers, setCustomers] = useState([
    {
      id: "CUST-001",
      name: "Dr. Sarfraz Ahmed",
      phone: "0300-1234567",
      email: "sarfraz.ahmed@gmail.com",
      cnic: "42101-9876543-1",
      address: "DHA Phase 6, Block C, House 44, Karachi",
      favoriteWood: "Premium Seasoned Walnut",
      preferences: "Likes classical hand-carved finishes, requires evening deliveries.",
      complaints: "None",
      warrantyRecords: "10 Year Term Structural Warranty on Solid Walnut Dining Set",
      favoriteCategory: "Dining"
    },
    {
      id: "CUST-002",
      name: "Begum Zeenat Fatima",
      phone: "0321-9876543",
      email: "zeenat.fatima@yahoo.com",
      cnic: "35202-1234567-2",
      address: "Gulberg III, near Liberty Square, Lahore",
      favoriteWood: "Genuine Sheesham (Rosewood)",
      preferences: "Highly sensitive to polish smell, requested extra air-drying before delivery.",
      complaints: "Minor scratch on leg reported in 2024 (Resolved: Polisher Sent Onsite)",
      warrantyRecords: "5 Year Term Cushion Polish Protection on Chesterfield Lounge",
      favoriteCategory: "Sofa"
    },
    {
      id: "CUST-003",
      name: "Imran Khan Niazi",
      phone: "0333-5551122",
      email: "imrankhan@pti.org.pk",
      cnic: "37405-1111111-1",
      address: "Bani Gala Hills, Islamabad",
      favoriteWood: "Antiqued Teak & Rosewood",
      preferences: "Prefers monumental scale master carving items, custom designs only.",
      complaints: "None",
      warrantyRecords: "Lifetime Structural Warranty on Rosewood Canopy Bed",
      favoriteCategory: "Bed"
    },
    {
      id: "CUST-004",
      name: "Malik Jahangir",
      phone: "0300-8884928",
      email: "malik.jahangir@industrialminds.com",
      cnic: "42201-1122334-5",
      address: "Clifton Block 5, Marine Drive, Karachi",
      favoriteWood: "Premium Seasoned Walnut",
      preferences: "Prefers Walnut textures. Always dines with 8 guests, needs broad tables.",
      complaints: "None",
      warrantyRecords: "Awaiting Delivery warranty dispatch on Walnut Table #VIS-101",
      favoriteCategory: "Dining"
    }
  ]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>("CUST-001");
  const [crmSearchQuery, setCrmSearchQuery] = useState("");
  const [crmNewCustomer, setCrmNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    cnic: "",
    address: "",
    favoriteWood: "Premium Seasoned Walnut",
    preferences: "",
    favoriteCategory: "Dining"
  });
  const [crmDuplicateDetected, setCrmDuplicateDetected] = useState<string | null>(null);
  const [crmAiInsightText, setCrmAiInsightText] = useState("");
  const [crmAiInsightLoading, setCrmAiInsightLoading] = useState(false);

  // Smart Digital Invoice States
  const [selectedInvoiceOrderId, setSelectedInvoiceOrderId] = useState<string>("ORD-9462");
  const [invoiceViewStyle, setInvoiceViewStyle] = useState<"A4" | "Thermal">("A4");
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signatureScribbled, setSignatureScribbled] = useState(false);

  // Professional Communications States
  const [selectedCommOrderId, setSelectedCommOrderId] = useState<string>("ORD-9462");
  const [commType, setCommType] = useState<"WhatsApp" | "SMS" | "Email">("WhatsApp");
  const [commCategory, setCommCategory] = useState<"Installment" | "Transit" | "CustomBlueprint" | "Support">("Installment");
  const [commMessageText, setCommMessageText] = useState("");
  const [mobileSimulatePayload, setMobileSimulatePayload] = useState<any>(null); // For custom smartphone notification pop
  const [commHistory, setCommHistory] = useState([
    { id: "COM-1", ts: "2026-05-28 14:15", customer: "Dr. Sarfraz Ahmed", type: "WhatsApp", category: "Installment", status: "Sent" }
  ]);

  // QR Product Tracker States
  const [scannedProductInfo, setScannedProductInfo] = useState<StockItem | null>(null);
  const [scanningActiveId, setScanningActiveId] = useState<string | null>(null);

  // Auto-generate notification text when variables swap
  useEffect(() => {
    const matchedOrd = orders.find(o => o.id === selectedCommOrderId);
    if (!matchedOrd) return;
    
    let text = "";
    if (commCategory === "Installment") {
      const balance = matchedOrd.installmentPlan?.remainingBalancePKR || 0;
      text = `🇵🇰 [WOOD WORLD ENTERPRISE ERP]\n\nDear ${matchedOrd.customerName},\nThis is an automated operational billing notification. Your outstanding installment balance for Order #${matchedOrd.id} is ${formatPKR(balance)}. Please wire the remaining amount to Wood World Corporate HBL A/C 4892-100293 or visit credit desk.\n\nThank you,\nAccounts Desk, Wood World HQ, Karachi.`;
    } else if (commCategory === "Transit") {
      const matchedDelivery = deliveries.find(d => d.orderId === selectedCommOrderId);
      const driver = matchedDelivery?.driver || "Senior Cargo Operator";
      const tracker = matchedDelivery?.tracker || "K-Cargo Carrier";
      const otp = matchedDelivery?.otp || "4021";
      text = `🚛 [WOOD WORLD LOGISTICS UPDATE]\n\nRespected ${matchedOrd.customerName},\nYour wood crafted cargo under Order #${matchedOrd.id} has cleared the central workshop and is currently in transit via ${tracker} (Driver: ${driver}).\n\nPlease safekeep your secure Delivery Verification OTP: ${otp} and share only when installation is finished.\n\nSupport Line: 021-111-WOOD`;
    } else if (commCategory === "CustomBlueprint") {
      text = `📐 [WOOD WORLD DESIGN STUDIO]\n\nDear ${matchedOrd.customerName},\nArchitect Ayesha Mahmood has published the high-precision CAD draft #CAD-${matchedOrd.id.split("-")[1] || "3912"} representing your custom carved specifications.\n\nPlease tap the digital preview portal to sign off this draft so that classical carvers can initiate Swat wood seasoning.\n\nRegards,\nChief Interior Architect, Wood World.`;
    } else {
      text = `✨ [WOOD WORLD AFTER-SALES SERV-CARE]\n\nDear ${matchedOrd.customerName},\nOur master polisher has marked your recent service repair ticket #ST-${matchedOrd.id.split("-")[1] || "881"} as Completed.\n\nWe guarantee all classical carving integrity under term protective guidelines. Please rate our crew's professional conduct.\n\nWood World Support.`;
    }
    setCommMessageText(text);
  }, [selectedCommOrderId, commCategory, commType, orders, deliveries]);

  // Create an automated prompt resolver
  const runAiAnomaliesBrief = async (promptMsg: string) => {
    setAiLoading(true);
    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptMsg,
          history: [],
          context: {
            stockItems,
            orders,
            deliveries,
            workshopTasks,
            cashflows,
            activeBranch
          }
        })
      });
      const data = await response.json();
      setAiResponseText(data.text || "Analyzed database. Everything operating normally.");
    } catch (e) {
      setAiResponseText("AI Analysis offline. Defaulting to local operational logs.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "executive-ai" && !aiResponseText) {
      runAiAnomaliesBrief("Generate Executive anomalies audit report and revenue forecasting analysis.");
    }
  }, [activeTab]);

  // Handle addition of checking walkin
  const handleVisitorCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisitor.name || !newVisitor.phone) return;
    const addedVis = {
      id: `VIS-${Math.floor(100 + Math.random() * 900)}`,
      name: newVisitor.name,
      phone: newVisitor.phone,
      interest: newVisitor.interest + " Luxury Set",
      interestQty: 1,
      rep: newVisitor.rep,
      tag: newVisitor.tag,
      date: new Date().toISOString().split("T")[0],
      status: "Interested"
    };

    setVisitors(prev => [addedVis, ...prev]);

    // Create staff action log
    const activity: StaffActivity = {
      id: `ACT-${Math.floor(500 + Math.random() * 500)}`,
      timestamp: new Date().toISOString(),
      staffName: newVisitor.rep,
      branch: activeBranch,
      action: `Logged Visitor Checkin: ${newVisitor.name} interested in ${newVisitor.interest}`,
      status: "Success"
    };
    onAddDirectActivity(activity);

    // Reset Form
    setNewVisitor({ name: "", phone: "", interest: "Dining", rep: "Farhan Attendant", tag: "Regular" });
  };

  // Custom Studio price calculator logic
  const calculateEstimatedPrice = () => {
    let base = 150000;
    if (customItem.woodType.includes("Walnut")) base += 120000;
    if (customItem.woodType.includes("Rosewood")) base += 100000;
    if (customItem.fabric.includes("Velvet")) base += 45000;
    if (customItem.fabric.includes("Leather")) base += 75000;
    if (customItem.polish.includes("High Gloss")) base += 25000;
    return base;
  };

  const handleAiDraftConcept = () => {
    // Dynamically draft prompt representation for beautiful furniture mockup text output
    const prompt = `WOOD WORK DESIGN BLUEPRINT CAD - [Item: ${customItem.name}] Type: Classic luxury wood craft, Wood: ${customItem.woodType}, Poland style: ${customItem.polish}, Fabric style: ${customItem.fabric}, Custom volume matrix: ${customItem.dimensions}. Rendering generated blueprint with high-contrast architectural vector overlays.`;
    setCustomAiPreview(prompt);
    setCustomCADDrafting({
      blueprintID: `CAD-${Math.floor(10000 + Math.random() * 80000)}`,
      calculatedWeight: "74 kg",
      carvingComplexity: "High Renaissance classical",
      estimatedRawCft: "24 CFT"
    });
  };

  const pushCustomOrderToWorkshop = () => {
    const calculatedPrice = calculateEstimatedPrice();
    const workshopId = `WRK-${Math.floor(500 + Math.random() * 500)}`;
    
    // Add to Workshop
    const newWorkshopTask = {
      id: workshopId,
      itemName: `${customItem.name} (${customItem.woodType})`,
      assignedCarpenter: "Ustad Allah Ditta",
      stage: "Pending",
      deadline: "2026-06-25",
      notes: `Custom Client piece for DHA client. Wood: ${customItem.woodType}, Polish: ${customItem.polish}, Fabric: ${customItem.fabric}. Dimensions: ${customItem.dimensions}.`,
      speedCount: 0
    };
    setWorkshopTasks(prev => [newWorkshopTask, ...prev]);

    // Add to local custom orders summary ledger
    const addedCustom = {
      id: `CST-${Math.floor(100 + Math.random() * 900)}`,
      itemName: customItem.name,
      woodType: customItem.woodType,
      polish: customItem.polish,
      fabric: customItem.fabric,
      dimensions: customItem.dimensions,
      price: calculatedPrice,
      timeline: 15,
      status: "In Workshop Queue",
      date: new Date().toISOString().split("T")[0],
      clientName: "Valued Showroom Guest"
    };
    setCustomOrders(prev => [addedCustom, ...prev]);

    // Direct Cashflow log outflow update representing reservation deposits (e.g. 50% upfront PKRs)
    const depositAmount = Math.ceil(calculatedPrice * 0.5);
    const depositLog = {
      id: `CSH-${Math.floor(200 + Math.random() * 800)}`,
      type: "Inflow" as any,
      detail: `Upfront Custom deposit for ${customItem.name}`,
      category: "Custom Sales",
      amount: depositAmount,
      stamp: new Date().toISOString().split("T")[0]
    };
    setCashflows(prev => [depositLog, ...prev]);

    // Log Activity
    onAddDirectActivity({
      id: `ACT-${Math.floor(500 + Math.random() * 500)}`,
      timestamp: new Date().toISOString(),
      staffName: "Custom Design Architect",
      branch: activeBranch,
      action: `Pushed Custom piece ${customItem.name} to production. Logged ${formatPKR(depositAmount)} advance cashflow.`,
      status: "Success"
    });

    alert(`Successfully created Custom piece in workshop! Order ID: ${workshopId}. Advance receipts compiled.`);
  };

  const advanceWorkshopTaskStage = (taskId: string, currentStage: string) => {
    let next: string = "Pending";
    if (currentStage === "Pending") next = "In Production";
    else if (currentStage === "In Production") next = "Polishing";
    else if (currentStage === "Polishing") next = "Assembly";
    else if (currentStage === "Assembly") next = "Quality Check";
    else if (currentStage === "Quality Check") next = "Ready for Delivery";

    setWorkshopTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          return { ...task, stage: next, notes: `Stage transitioned to ${next} by manager command.` };
        }
        return task;
      })
    );

    // If transitioned to Ready for Delivery, push automatically to log list!
    if (next === "Ready for Delivery") {
      const task = workshopTasks.find(t => t.id === taskId);
      const deliveryId = `DEL-${Math.floor(803 + Math.random() * 90)}`;
      const newDel = {
        id: deliveryId,
        orderId: `ORD-CUSTOM-${Math.floor(1000 + Math.random() * 9000)}`,
        address: "Client Site Delivery (Custom Booking Address Ref)",
        status: "Scheduled",
        driver: "Farooq Driver",
        tracker: "Warehouse Cargo Pack",
        otp: "3182",
        completedPhoto: "",
        rating: 0,
        feedback: ""
      };
      setDeliveries(prev => [newDel, ...prev]);

      onAddDirectActivity({
        id: `ACT-${Math.floor(500 + Math.random() * 500)}`,
        timestamp: new Date().toISOString(),
        staffName: "Workshop Master",
        branch: activeBranch,
        action: `Workshop product ${task?.itemName || "Custom piece"} completed quality check. Pushed automatically to Delivery Dispatcher!`,
        status: "Success"
      });
    }
  };

  return (
    <div className="space-y-6 select-text">
      
      {/* -------------------- SHOWROOM EXPERIENCE TAB -------------------- */}
      {activeTab === "showroom" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Check-in walker guest Form */}
            <div className="lg:col-span-1 p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4">
              <h3 className="font-serif italic text-lg text-white font-bold flex items-center gap-2 border-b border-white/5 pb-2.5">
                <Users className="w-5 h-5 text-[#C5A059]" />
                <span>Showroom Checkin</span>
              </h3>
              <form onSubmit={handleVisitorCheckIn} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Customer Full Name (English)</label>
                  <input
                    type="text"
                    required
                    value={newVisitor.name}
                    onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
                    className="w-full bg-[#0F0F0F] border border-white/5 focus:border-[#C5A059]/40 rounded-lg p-2.5 text-xs outline-none"
                    placeholder="e.g. Aslam Khan Siddiqui"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Contact WhatsApp Number</label>
                  <input
                    type="text"
                    required
                    value={newVisitor.phone}
                    onChange={(e) => setNewVisitor({ ...newVisitor, phone: e.target.value })}
                    className="w-full bg-[#0F0F0F] border border-white/5 focus:border-[#C5A059]/40 rounded-lg p-2.5 text-xs outline-none"
                    placeholder="e.g. 0300-4728912"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Product Interest Focus</label>
                  <select
                    value={newVisitor.interest}
                    onChange={(e) => setNewVisitor({ ...newVisitor, interest: e.target.value })}
                    className="w-full bg-[#0F0F0F] border border-white/5 rounded-lg p-2.5 text-xs text-stone-200 outline-none focus:border-[#C5A059]/40"
                  >
                    <option value="Sofa">Velvet & Acacia Sofa Series</option>
                    <option value="Dining">Walnut Carved Dining Sets</option>
                    <option value="Bed">Rosewood Mughal Bedstead</option>
                    <option value="Office">Executive Red Oak series</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Premium Category Tag</label>
                  <select
                    value={newVisitor.tag}
                    onChange={(e) => setNewVisitor({ ...newVisitor, tag: e.target.value })}
                    className="w-full bg-[#0F0F0F] border border-white/5 rounded-lg p-2.5 text-xs text-stone-200 outline-none focus:border-[#C5A059]/40"
                  >
                    <option value="VIP">Corporate VIP Guest</option>
                    <option value="Regular">Standard Showroom Guest</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#C5A059] hover:bg-[#b08c48] text-[#0F0F0F] text-xs font-mono font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#0F0F0F]" />
                  <span>Verify and Register Guest</span>
                </button>
              </form>
            </div>

            {/* Right: Walkin customer ledger log */}
            <div className="lg:col-span-2 p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                <h3 className="font-serif italic text-lg text-white font-bold">
                  Active Walk-in Visitors Today
                </h3>
                <span className="text-[10px] font-mono bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 px-2.5 py-0.5 rounded-full font-bold">
                  CONVERSION RATE: 64%
                </span>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {visitors.map((v) => (
                  <div key={v.id} className="p-3 bg-[#0F0F0F] border border-white/5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[#C5A059] font-bold text-xs">{v.name}</span>
                        <span className={`text-[8px] py-0.5 px-1.5 rounded uppercase font-bold border ${v.tag === "VIP" ? "bg-red-950/25 text-red-400 border-red-900" : "bg-zinc-800 text-zinc-400 border-white/5"}`}>
                          {v.tag}
                        </span>
                        <span className="text-[10px] text-stone-500">({v.phone})</span>
                      </div>
                      <div className="text-xs text-stone-400">
                        Interested product category: <span className="text-[#C5A059] font-medium">{v.interest}</span>
                      </div>
                      <div className="text-[10px] text-stone-500 flex items-center gap-3">
                        <span>Rep: {v.rep}</span>
                        <span>• Date: {v.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] py-1 px-2.5 bg-yellow-950/25 border border-yellow-905/40 text-yellow-500 rounded font-semibold">
                        {v.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Consultation appointments log */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <h4 className="text-[11px] font-mono text-[#C5A059] uppercase tracking-wider font-bold">Upcoming Interior Consultations Calendar</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {consultations.map(c => (
                    <div key={c.id} className="p-3 bg-[#0F0F0F] rounded-xl border border-white/5 text-xs text-stone-300">
                      <div className="flex justify-between font-mono">
                        <span className="text-[#C5A059] font-bold">{c.clientName}</span>
                        <span className="text-[9px] text-stone-500">{c.id}</span>
                      </div>
                      <p className="text-[11px] mt-1 text-stone-400">{c.topic}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] font-mono border-t border-white/5 pt-1.5 text-stone-500">
                        <span>Designer: {c.designer}</span>
                        <span className="text-emerald-550 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {c.date} ({c.time})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- CUSTOM FURNITURE DESIGN STUDIO -------------------- */}
      {activeTab === "custom-design" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Customizer config form panel (Col-5) */}
            <div className="lg:col-span-5 p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4">
              <h3 className="font-serif italic text-lg text-white font-bold flex items-center gap-2 border-b border-white/5 pb-2.5">
                <Hammer className="w-5 h-5 text-[#C5A059]" />
                <span>Custom Order Configurer</span>
              </h3>
              
              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase">Architectural Furniture Item Name</label>
                  <input
                    type="text"
                    value={customItem.name}
                    onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                    className="w-full bg-[#0F0F0F] border border-white/5 focus:border-[#C5A059]/40 rounded-lg p-2.5 text-xs outline-none"
                    placeholder="e.g. Victorian 12-Chair Dining Table"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase">Chassis Timber Wood Selection</label>
                  <select
                    value={customItem.woodType}
                    onChange={(e) => setCustomItem({ ...customItem, woodType: e.target.value })}
                    className="w-full bg-[#0F0F0F] border border-white/5 rounded-lg p-2.5 text-xs text-stone-200 outline-none"
                  >
                    <option value="Genuine Sheesham (Rosewood)">Genuine Pakistani Sheesham (Rosewood)</option>
                    <option value="Premium Seasoned Walnut">Premium Seasoned Walnut Wood (Chitral Range)</option>
                    <option value="Selected Red Oak Block">Imported Red Oak Selected Blocks</option>
                    <option value="Solid Acacia Solid Wood">Acacia Structural Hardwood</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase">Polish Tint & Lustre Finishing</label>
                  <select
                    value={customItem.polish}
                    onChange={(e) => setCustomItem({ ...customItem, polish: e.target.value })}
                    className="w-full bg-[#0F0F0F] border border-white/5 rounded-lg p-2.5 text-xs text-stone-200 outline-none"
                  >
                    <option value="Antique Matte Honey">Antique Matte Honey Tint</option>
                    <option value="High Gloss Royal Mirror">High Gloss Royal Mirror Finish</option>
                    <option value="Natural Teak Timber Oil">Natural Teak Timber Protective Oil</option>
                    <option value="Burnt Charcoal Nero Stain">Burnt Charcoal Nero Stain lacquer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase">Textured Upholstery Fabric Trim</label>
                  <select
                    value={customItem.fabric}
                    onChange={(e) => setCustomItem({ ...customItem, fabric: e.target.value })}
                    className="w-full bg-[#0F0F0F] border border-white/5 rounded-lg p-2.5 text-xs text-stone-200 transition-colors outline-none"
                  >
                    <option value="Royal Velvet">Royal Crusher Velvet (Turkish Emerald Tint)</option>
                    <option value="Italian Premium Leather">Full-Grain Italian Calf Skin Leather (Rust)</option>
                    <option value="Premium Structured Jute">Heavy Organic Jute Textured Cord</option>
                    <option value="None">None (Pure Wooden Carving Structure)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase">Chassis Volume Dimensions (L x W x H)</label>
                  <input
                    type="text"
                    value={customItem.dimensions}
                    onChange={(e) => setCustomItem({ ...customItem, dimensions: e.target.value })}
                    className="w-full bg-[#0F0F0F] border border-white/5 focus:border-[#C5A059]/40 rounded-lg p-2.5 text-xs outline-none"
                    placeholder="e.g. 96'' x 42'' x 30''"
                  />
                </div>

                <div className="p-4 bg-[#0F0F0F] border border-white/5 rounded-xl space-y-2">
                  <span className="text-[10px] text-stone-500 uppercase tracking-widest block font-bold">Estimated Costing Summary (PKRs)</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-400">Calculated Structural Cost:</span>
                    <span className="text-[#C5A059] font-bold">{formatPKR(calculateEstimatedPrice())}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 leading-relaxed border-t border-white/5 pt-1.5">
                    Wood structure estimations updated daily based on timber market trading indexes in Pakistan.
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={handleAiDraftConcept}
                    className="flex-1 py-2.5 px-3 bg-[#1A1A1A] border border-white/10 hover:border-[#C5A059]/30 hover:bg-[#202020] text-stone-200 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <span>Run AI Concept Draft</span>
                  </button>
                  <button
                    onClick={pushCustomOrderToWorkshop}
                    className="flex-1 py-2.5 px-3 bg-[#C5A059] hover:bg-[#b08c48] text-[#0F0F0F] text-xs font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer"
                  >
                    Push to Workshop
                  </button>
                </div>
              </div>
            </div>

            {/* AI CAD Drawing Blueprint generator panel (Col-7) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 bg-[#151515] border border-white/5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-full min-h-[480px]">
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-white/5 pb-2.5">
                    <div>
                      <span className="text-[9px] font-mono text-[#C5A059] tracking-widest uppercase font-bold">Studio Intelligent CAD Renderer</span>
                      <h4 className="font-serif italic text-lg text-white font-bold">Furniture Blueprint Preview</h4>
                    </div>
                    {customCADDrafting && (
                      <span className="text-[10px] font-mono bg-emerald-950/20 text-emerald-450 border border-emerald-900 px-3 py-1 rounded">
                        CAD VERIFIED
                      </span>
                    )}
                  </div>

                  {!customAiPreview ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-[#0F0F0F] border border-white/5 border-dashed rounded-xl text-center p-6 space-y-3">
                      <Layers className="w-12 h-12 text-stone-600 animate-pulse" />
                      <div>
                        <h5 className="text-stone-300 text-xs font-bold uppercase">Awaiting Configuration Blueprint</h5>
                        <p className="text-[11px] text-stone-500 mt-1 max-w-sm">
                          Configure timber woods, Turkish velvet fabrics, and custom carving dimensions, then click "Run AI Concept Draft" to trigger high-fidelity CAD blueprints rendering logic.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Interactive Blueprint Canvas visual */}
                      <div className="bg-[#0A0A0A] border-2 border-[#C5A059]/20 rounded-xl p-5 font-mono text-[10px] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#C5A05910_1px,transparent_1px),linear-gradient(to_bottom,#C5A05910_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none opacity-40"></div>
                        
                        <div className="relative z-10 space-y-3">
                          <div className="flex justify-between items-center text-[#C5A059] border-b border-[#C5A059]/20 pb-1.5">
                            <span>REPRESENTATIONAL ENGINEERING SCHEMATIC v1.02</span>
                            <span>{customCADDrafting?.blueprintID}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-stone-400">
                            <div>
                              <span>NAME BLOCK:</span> <strong className="text-white font-mono">{customItem.name}</strong>
                            </div>
                            <div>
                              <span>SCALE:</span> <strong className="text-white font-mono">1:15 ARCH MATS</strong>
                            </div>
                            <div>
                              <span>TIMBER COEF:</span> <strong className="text-white font-mono">{customItem.woodType}</strong>
                            </div>
                            <div>
                              <span>FINISH SPEC:</span> <strong className="text-white font-mono">{customItem.polish}</strong>
                            </div>
                            <div>
                              <span>UPHOLSTERY SPEC:</span> <strong className="text-white font-mono">{customItem.fabric}</strong>
                            </div>
                            <div>
                              <span>RAW WOOD CFT ESTIMATE:</span> <strong className="text-white font-mono">{customCADDrafting?.estimatedRawCft}</strong>
                            </div>
                          </div>

                          <div className="h-28 bg-[#0F0F0F] rounded border border-white/5 flex items-center justify-center">
                            <span className="text-[#C5A059]/40 text-xs font-mono font-bold tracking-widest text-center uppercase p-4 animate-pulse">
                              [ HIGH FIDELITY RETAIL CUSTOM CAD RENDERED ON SHEESHAM / OAK CHASSIS ]
                            </span>
                          </div>

                          <div className="text-[9px] text-stone-500 leading-normal border-t border-white/5 pt-2 italic">
                            PROMPT SENT TO FACTORY ENGINE: {customAiPreview}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-[#0F0F0F] rounded-xl border border-white/5 text-xs">
                          <span className="text-stone-500 block uppercase text-[9px] font-mono">Carving Complexity</span>
                          <strong className="text-stone-200 mt-1 block">{customCADDrafting?.carvingComplexity}</strong>
                        </div>
                        <div className="p-3 bg-[#0F0F0F] rounded-xl border border-white/5 text-xs">
                          <span className="text-stone-500 block uppercase text-[9px] font-mono">Est. Assembly Weight</span>
                          <strong className="text-stone-200 mt-1 block">{customCADDrafting?.calculatedWeight}</strong>
                        </div>
                        <div className="p-3 bg-[#0F0F0F] rounded-xl border border-white/5 text-xs">
                          <span className="text-stone-500 block uppercase text-[9px] font-mono">Estimated Production Time</span>
                          <strong className="text-[#C5A059] mt-1 block font-bold">15 - 18 Working Days</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-stone-500 leading-relaxed pt-4 border-t border-white/5 flex items-center gap-2 font-mono">
                  <Info className="w-4 h-4 text-[#C5A059]" />
                  <span>Workshop carvers will automatically inherit this blueprint structure upon release to active queues.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- WORKSHOP & PRODUCTION MANAGEMENT -------------------- */}
      {activeTab === "workshop" && (
        <div className="space-y-6">
          <div className="p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-2.5">
              <div>
                <h3 className="font-serif italic text-lg text-white font-bold flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-[#C5A059]" />
                  <span>Wood World Atelier & Carpenter Operations</span>
                </h3>
                <p className="text-[10px] text-stone-500 mt-0.5 uppercase font-mono">Real-time Production Scheduling logs</p>
              </div>
              
              <div className="flex gap-1.5 self-start">
                <span className="text-[10px] font-mono bg-yellow-950/20 text-yellow-500 px-3 py-1 border border-yellow-900 rounded font-semibold">
                  ACTIVE CARPENTERS: 8 USTAD CARVERS
                </span>
                <span className="text-[10px] font-mono bg-green-950/20 text-green-400 px-3 py-1 border border-green-900 rounded font-semibold">
                  QC PASS RATIO: 98.4%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Workshop list (Col-2) */}
              <div className="lg:col-span-2 space-y-3">
                {workshopTasks.map((wt) => (
                  <div key={wt.id} className="p-4 bg-[#0F0F0F] rounded-xl border border-white/5 space-y-3 relative overflow-hidden font-mono">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] text-stone-500 font-bold block">{wt.id}</span>
                        <h4 className="text-white text-xs font-bold leading-none mt-1">{wt.itemName}</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                        wt.stage === "Ready for Delivery" 
                          ? "bg-emerald-950/20 text-emerald-400 border-emerald-900"
                          : wt.stage === "Quality Check"
                          ? "bg-indigo-950/20 text-indigo-455 border-indigo-900"
                          : wt.stage === "Polishing"
                          ? "bg-yellow-950/20 text-yellow-405 border-yellow-900"
                          : "bg-stone-900 text-stone-400 border-white/5"
                      }`}>
                        Stage: {wt.stage}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-400 leading-relaxed font-sans">{wt.notes}</p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] border-t border-white/5 pt-2.5 gap-3 text-stone-500">
                      <div>
                        <span>Lead Carver: </span>
                        <strong className="text-[#C5A059]">{wt.assignedCarpenter}</strong>
                      </div>
                      <div>
                        <span>Deadline: </span>
                        <strong className="text-stone-300">{wt.deadline}</strong>
                      </div>
                      
                      <button
                        onClick={() => advanceWorkshopTaskStage(wt.id, wt.stage)}
                        disabled={wt.stage === "Ready for Delivery"}
                        className={`py-1.5 px-3 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                          wt.stage === "Ready for Delivery"
                            ? "bg-green-950/10 text-green-550 border border-green-900/20 cursor-not-allowed"
                            : "bg-[#C5A059] hover:bg-[#b08c48] text-[#0F0F0F]"
                        }`}
                      >
                        {wt.stage === "Ready for Delivery" ? "Pushed to Logistics" : wt.stage === "Quality Check" ? "Complete QC Check" : "Advance Stage"}
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Right Column: Workshop metrics dashboard (Col-1) */}
              <div className="space-y-4">
                <div className="p-5 bg-[#0F0F0F] border border-white/5 rounded-xl space-y-4">
                  <h4 className="text-[11px] font-mono text-[#C5A059] uppercase tracking-wider font-bold">Atelier Workload Distribution</h4>
                  
                  <div className="space-y-3 font-mono text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Ustad Allah Ditta</span>
                        <span className="text-[#C5A059]">2 Tasks Active</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-[#C5A059]"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Ustad Gulzar</span>
                        <span className="text-[#C5A059]">1 Task Active</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-[#C5A059]"></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Ustad M. Aslam</span>
                        <span className="text-stone-500">Idle (Available)</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="w-0 h-full bg-[#C5A059]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-[#1C160F] to-[#15120E] border border-yellow-900/30 rounded-xl space-y-3">
                  <span className="block p-1 bg-yellow-950/20 border border-yellow-905/35 rounded text-yellow-500 font-mono text-[9px] uppercase tracking-wider text-center">
                    Carpenter Communication Channel
                  </span>
                  <p className="text-[11px] text-stone-400 leading-normal text-center font-sans">
                    Need extra premium wood seasoning releases or specific Polish compounds from Lahore warehouse? Send quick log alerts to the procurement desk instantly.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* -------------------- INTERIOR PROJECT MANAGEMENT -------------------- */}
      {activeTab === "interior-projects" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Project detail list */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4">
                <h3 className="font-serif italic text-lg text-white font-bold flex items-center gap-2 border-b border-white/5 pb-2.5">
                  <Compass className="w-5 h-5 text-[#C5A059]" />
                  <span>Elite Interior Furnishing Projects</span>
                </h3>
                
                <div className="space-y-4 font-mono text-xs">
                  {interiorProjects.map((p) => {
                    const pct = Math.round((p.spent / p.budget) * 100);
                    return (
                      <div key={p.id} className="p-4 bg-[#0F0F0F] rounded-xl border border-white/5 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-stone-500">{p.id}</span>
                            <h4 className="text-white text-xs font-bold font-sans mt-0.5">{p.clientName}</h4>
                          </div>
                          <span className="text-[10px] font-bold text-[#C5A059]">{p.status}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-400">
                          <div>
                            <span>Rooms scope:</span> <strong className="text-stone-200 block font-sans">{p.roomPlanning}</strong>
                          </div>
                          <div>
                            <span>Luxe Package:</span> <strong className="text-stone-200 block font-sans">{p.packages}</strong>
                          </div>
                        </div>

                        {/* Budget Util meter */}
                        <div className="space-y-1 pt-1.5">
                          <div className="flex justify-between text-[10px] text-stone-550">
                            <span>Budget Utilization: {formatPKR(p.spent)} / {formatPKR(p.budget)}</span>
                            <span>{pct}% Spent</span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#C5A059] to-red-600 rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-stone-500 pt-2 border-t border-white/5">
                          <span>Architect Director: {p.manager}</span>
                          <span>Next Site Audit: {p.scheduleDate}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Site scheduler form */}
            <div className="space-y-4">
              <div className="p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4 text-xs font-mono">
                <h4 className="font-serif italic text-base text-white font-bold border-b border-white/5 pb-2">Launch New Luxury Contract</h4>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-400 uppercase font-bold">Client Residency / Office Title</label>
                    <input
                      type="text"
                      value={newProject.clientName}
                      onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                      placeholder="e.g. DHA Phase 8 Mansion"
                      className="w-full bg-[#0F0F0F] border border-white/5 p-2 rounded-lg text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-400 uppercase font-bold">Mughal / Modern Woodwork Budget</label>
                    <input
                      type="number"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: parseInt(e.target.value) || 0 })}
                      placeholder="e.g. 5000000"
                      className="w-full bg-[#0F0F0F] border border-white/5 p-2 rounded-lg text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-400 uppercase font-bold">Planned Rooms Schedule</label>
                    <input
                      type="text"
                      value={newProject.roomPlanning}
                      onChange={(e) => setNewProject({ ...newProject, roomPlanning: e.target.value })}
                      placeholder="e.g. Lounge, Dining, Master Suite"
                      className="w-full bg-[#0F0F0F] border border-white/5 p-2 rounded-lg text-xs text-white outline-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!newProject.clientName) return;
                      const added = {
                        id: `PRJ-${Math.floor(670 + Math.random() * 300)}`,
                        clientName: newProject.clientName,
                        budget: newProject.budget,
                        spent: 0,
                        status: "Contract Initiated (Stage 1 Site Audit)",
                        manager: newProject.manager,
                        scheduleDate: new Date().toISOString().split("T")[0],
                        roomPlanning: newProject.roomPlanning,
                        packages: newProject.packages
                      };
                      setInteriorProjects(prev => [added, ...prev]);
                      setNewProject({ clientName: "", budget: 2000000, spent: 0, manager: "Engr. Noman Shah", roomPlanning: "Complete Villa", packages: "Grand Imperial Series" });
                      alert("Successfully locked down and added interior project contract.");
                    }}
                    className="w-full py-2 px-3 bg-[#C5A059] hover:bg-[#b08c48] text-[#0F0F0F] font-bold uppercase rounded-lg cursor-pointer text-center text-[10px]"
                  >
                    Initiate Client Project
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- SMART WAREHOUSE SYSTEM -------------------- */}
      {activeTab === "smart-warehouse" && (
        <div className="space-y-6">
          <div className="p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-2.5">
              <div>
                <h3 className="font-serif italic text-lg text-white font-bold flex items-center gap-2">
                  <ScanLine className="w-5 h-5 text-[#C5A059]" />
                  <span>Wood World Smart Warehouse & QR Management Desk</span>
                </h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wide mt-0.5">Dual 2D Barcode Engine & Rack Coordinates Matrix • central hub</p>
              </div>

              {/* Warehouse search filter */}
              <div className="relative w-full max-w-xs self-start">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-550" />
                <input
                  type="text"
                  value={warehouseGridSearch}
                  onChange={(e) => setWarehouseGridSearch(e.target.value)}
                  placeholder="Scan SKU, Rack ID, or Category..."
                  className="w-full bg-[#0F0F0F] border border-white/5 pl-8 pr-3 py-1.5 rounded text-xs text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Rack 2D Map (Col-2) */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-2">Digital Bay Layout & QR Matrix</span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0F0F0F] p-4 rounded-xl border border-white/5">
                    {[
                      { bay: "Rack A1 (Bed Set section)", capacity: "8/10 Units", cat: "Bed Set", id: "ST-002" },
                      { bay: "Rack A2 (Dining section)", capacity: "5/10 Units", cat: "Dining", id: "ST-001" },
                      { bay: "Rack B1 (Sofa section)", capacity: "10/10 FULL", cat: "Sofa", id: "ST-003" },
                      { bay: "Rack B2 (Living section)", capacity: "4/10 Units", cat: "Living", id: "ST-004" },
                      { bay: "Rack C1 (Office section)", capacity: "3/10 Units", cat: "Office", id: "ST-005" },
                      { bay: "Rack C2 (Unseasoned Logs)", capacity: "120/150 CFT", cat: "Logs", id: "SUP-201" },
                      { bay: "Rack D1 (Polish Barrels)", capacity: "14/20 Drums", cat: "Polish", id: "SUP-202" },
                      { bay: "Rack D2 (Fabric Rolls)", capacity: "8/15 Rolls", cat: "Fabric", id: "CST-001" }
                    ].map((bay, idx) => {
                      const isSearched = warehouseGridSearch && (
                        bay.bay.toLowerCase().includes(warehouseGridSearch.toLowerCase()) ||
                        bay.cat.toLowerCase().includes(warehouseGridSearch.toLowerCase()) ||
                        bay.id.toLowerCase().includes(warehouseGridSearch.toLowerCase())
                      );
                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border flex flex-col justify-between h-32 transition-all ${
                            isSearched 
                              ? "bg-[#C5A059]/15 border-[#C5A059] scale-[1.02] shadow-lg shadow-[#C5A059]/10" 
                              : "bg-[#151515] border-white/5 hover:border-white/10"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded ${
                              bay.capacity.includes("FULL") ? "bg-red-950/20 text-red-400" : "bg-stone-800 text-[#C5A059]"
                            }`}>
                              {bay.cat}
                            </span>
                            <span className="text-[9px] text-[#C5A059] font-mono">B-0{idx+1}</span>
                          </div>
                          <div className="mt-1 font-sans">
                            <p className="text-[10px] text-zinc-300 font-bold leading-tight">{bay.bay}</p>
                            <span className="text-[9px] text-stone-500 font-mono select-all block mt-0.5">{bay.id}</span>
                          </div>
                          <p className="text-[9px] text-stone-500 mt-2 border-t border-white/5 pt-1 flex justify-between">
                            <span>Qty: {bay.capacity}</span>
                            <button
                              onClick={() => {
                                setScanningActiveId(bay.id);
                                setScannedProductInfo(null);
                                setTimeout(() => {
                                  const matchedProduct = stockItems.find(p => p.id === bay.id);
                                  if (matchedProduct) {
                                    setScannedProductInfo(matchedProduct);
                                  } else {
                                    setScannedProductInfo({
                                      id: bay.id,
                                      name: `${bay.cat} Raw Material Cargo`,
                                      category: "Material" as any,
                                      woodType: "Teak & Rosewood Core",
                                      pricePKR: 120000,
                                      stockByBranch: { [BranchName.LahoreWarehouse]: 40 },
                                      alertThreshold: 5,
                                      dimensions: "Standard Freight Barrel",
                                      leadTimeDays: 5,
                                      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400"
                                    } as any);
                                  }
                                  setScanningActiveId(null);
                                  onAddDirectActivity({
                                    id: `ACT-${Math.floor(800 + Math.random() * 199)}`,
                                    timestamp: new Date().toISOString(),
                                    staffName: "Logistics QR Scanner",
                                    branch: activeBranch,
                                    action: `Initiated instant physical lookup via barcode scan on SKU ${bay.id} at Bay B-0${idx+1}.`,
                                    status: "Success"
                                  });
                                }, 1500);
                              }}
                              className="text-[#C5A059] hover:text-white font-mono font-bold text-[8px] border border-[#C5A059]/20 hover:bg-[#C5A059]/10 px-1 rounded inline-block cursor-pointer transition-colors"
                            >
                              [SCAN]
                            </button>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Showroom Interactive Product QR Catalog list */}
                <div className="p-5 bg-[#0F0F0F] rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Consolidated Product QR Label Roster</span>
                    <span className="text-[9px] font-mono text-stone-550 font-bold">Auto SKU binding</span>
                  </div>
                  
                  <div className="space-y-2.5">
                    {stockItems.map((item) => (
                      <div key={item.id} className="p-3 bg-[#151515] border border-white/5 rounded-xl hover:border-white/10 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans text-xs">
                        <div className="flex items-center gap-3">
                          <img src={item.image} referrerPolicy="no-referrer" className="w-10 h-10 object-cover rounded-md border border-white/5 shrink-0" alt="" />
                          <div>
                            <span className="text-[9px] font-mono bg-stone-850 px-1.5 py-0.5 text-[#C5A059] border border-white/5 rounded font-bold">{item.id}</span>
                            <strong className="text-zinc-205 text-xs block mt-1">{item.name}</strong>
                            <p className="text-[10px] text-stone-500 font-mono">Premium {item.woodType} • {item.dimensions}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end shrink-0 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                          {/* Simulated 2D Matrix Code Vector using inline CSS */}
                          <div className="flex items-center gap-2 bg-[#0F0F0F] p-1.5 border border-white/5 rounded">
                            <div className="w-8 h-8 bg-zinc-200 border border-neutral-350 p-1 flex flex-col justify-between select-none shrink-0">
                              <div className="flex justify-between">
                                <span className="w-2 h-2 bg-black block"></span>
                                <span className="w-1 h-2 bg-black block"></span>
                                <span className="w-2 h-2 bg-black block"></span>
                              </div>
                              <div className="flex justify-between items-center h-2">
                                <span className="w-1 h-1 bg-black block"></span>
                                <span className="w-2 h-1 bg-black block"></span>
                                <span className="w-1 h-1 bg-black block"></span>
                              </div>
                              <div className="flex justify-between">
                                <span className="w-2 h-2 bg-black block"></span>
                                <span className="w-2 h-1 bg-black block"></span>
                                <span className="w-1 h-2 bg-black block"></span>
                              </div>
                            </div>
                            <div className="text-[8px] font-mono text-zinc-400">
                              <span className="block font-bold">QR VERIFIED</span>
                              <span className="block text-stone-500">ID: {item.id}</span>
                            </div>
                          </div>

                          <div className="flex gap-1.5 font-mono text-[9px]">
                            <button
                              onClick={() => {
                                setScanningActiveId(item.id);
                                setScannedProductInfo(null);
                                setTimeout(() => {
                                  setScannedProductInfo(item);
                                  setScanningActiveId(null);
                                }, 1200);
                              }}
                              className="px-2 py-1 bg-[#1A1A1A] hover:bg-zinc-805 border border-white/5 hover:border-[#C5A059]/40 text-stone-300 hover:text-[#C5A059] rounded cursor-pointer transition-colors"
                            >
                              Scan Test
                            </button>
                            <button
                              onClick={() => {
                                setScannedProductInfo(item);
                                alert(`Opening label generator for printing.`);
                              }}
                              className="p-1 px-1.5 bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#C5A059] border border-[#C5A059]/20 rounded cursor-pointer transition-colors"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Active Scanner Laser Overlay & Scanned readout sheet */}
              <div className="space-y-4">
                
                {/* 1. INTERACTIVE SCANNER OVERLAY */}
                <div className="p-5 bg-[#0F0F0F] border border-white/5 rounded-2xl space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/5 blur-2xl"></div>
                  
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] border-b border-white/5 pb-1.5 animate-pulse">Simulation Scanner Chamber</h4>
                  
                  {scanningActiveId ? (
                    <div className="border border-[#C5A059] rounded-xl bg-black/60 aspect-square flex flex-col items-center justify-center p-6 relative">
                      {/* Laser Line Animation via standard CSS styling */}
                      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-lg shadow-red-500/85 animate-bounce top-1/2"></div>
                      
                      {/* Scanning Corner Brackets */}
                      <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#C5A059]"></span>
                      <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#C5A059]"></span>
                      <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#C5A059]"></span>
                      <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#C5A059]"></span>

                      <div className="text-center space-y-1.5 z-10 font-mono">
                        <QrCode className="w-8 h-8 text-[#C5A059] mx-auto animate-spin" />
                        <span className="text-[10px] text-red-500 block font-bold animate-pulse">LOCKING SKU: {scanningActiveId}</span>
                        <span className="text-[9px] text-zinc-550 block">Beam calibrating frequency...</span>
                      </div>
                    </div>
                  ) : scannedProductInfo ? (
                    <div className="border border-white/5 bg-[#151515] rounded-xl p-4 space-y-3 relative font-sans">
                      
                      <div className="flex justify-between items-start border-b border-white/5 pb-2">
                        <div>
                          <span className="text-[9px] font-mono bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 font-bold px-1.5 py-0.5 rounded">SKU DECODED</span>
                          <h5 className="text-[#E5E5E5] text-xs font-bold mt-1.5">{scannedProductInfo.name}</h5>
                        </div>
                        <button 
                          onClick={() => setScannedProductInfo(null)}
                          className="text-stone-550 hover:text-white font-mono text-[9px] font-semibold border border-[#C5A059]/20 p-0.5 px-1 rounded cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>

                      <div className="space-y-2 text-xs font-mono text-stone-350">
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-stone-550">Reference ID:</span>
                          <strong className="text-[#C5A059]">{scannedProductInfo.id}</strong>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-stone-550">Material Grade:</span>
                          <strong className="text-stone-305">{scannedProductInfo.woodType}</strong>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-stone-550">Catalog Price:</span>
                          <strong className="text-white">{formatPKR(scannedProductInfo.pricePKR)}</strong>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-stone-550">Warranty:</span>
                          <strong className="text-emerald-500">Lifetime Structural / 5Yr Polish</strong>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-stone-550">Frame Dimensions:</span>
                          <strong className="text-white text-right leading-none text-[10px] block truncate max-w-[150px]">{scannedProductInfo.dimensions}</strong>
                        </div>
                      </div>

                      {/* Branch availability grids */}
                      <div className="bg-[#0F0F0F] border border-white/5 rounded p-2.5 space-y-1.5 text-[10px] font-mono">
                        <span className="text-stone-550 uppercase tracking-widest text-[8px] font-bold block border-b border-white/5 pb-1">Branch availability matrix</span>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Karachi Showroom:</span>
                          <strong className={`${(scannedProductInfo.stockByBranch[BranchName.KarachiShowroom] || 0) <= 1 ? "text-red-400 animate-pulse" : "text-white"}`}>
                            {scannedProductInfo.stockByBranch[BranchName.KarachiShowroom] || 0} Units
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Lahore Central Whse:</span>
                          <strong className="text-emerald-400 font-bold">{scannedProductInfo.stockByBranch[BranchName.LahoreWarehouse] || 0} Units</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Islamabad Showroom:</span>
                          <strong className={`${(scannedProductInfo.stockByBranch[BranchName.IslamabadShowroom] || 0) <= 1 ? "text-red-400 animate-pulse" : "text-white"}`}>
                            {scannedProductInfo.stockByBranch[BranchName.IslamabadShowroom] || 0} Units
                          </strong>
                        </div>
                      </div>

                      {/* Direct transfer suggestion action if stock shortages are found */}
                      <div className="space-y-1.5 pt-1 text-[10px] font-mono">
                        {Object.values(BranchName).some(b => (scannedProductInfo.stockByBranch[b] || 0) <= 1) && (
                          <div className="p-2 border border-[#C5A059]/20 bg-[#C5A059]/5 rounded text-[#C5A059] text-[9px] leading-relaxed flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>Deficit detected! Utilize [Manager Desk Drawer] to release stock transfers from Lahore central reserves immediately.</span>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            alert(`Thermal Label Ticket printed successfully to active Showroom POS receiver.`);
                          }}
                          className="w-full py-1.5 bg-[#C5A059] hover:bg-[#b08c48] text-[#0F0F0F] font-bold rounded text-[9px] uppercase cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Simulate Print Thermal Sticky Label</span>
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="border border-white/5 border-dashed rounded-xl p-8 text-center bg-black/10 select-none">
                      <QrCode className="w-10 h-10 text-stone-650 mx-auto opacity-40 mb-2.5 animate-pulse" />
                      <span className="text-[10px] text-stone-550 block font-bold">SCANNER STANDBY</span>
                      <span className="text-[9px] text-stone-605 block mt-1 leading-normal font-sans">Select a warehouse rack slot [SCAN] or click &quot;Scan Test&quot; in the label roster to fire high-end barcode decoding protocols.</span>
                    </div>
                  )}

                </div>

                {/* 2. AUTOMATED LOGISTICS RECORD */}
                <div className="p-5 bg-[#0F0F0F] border border-white/5 rounded-2xl space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059]">Logistics Traffic ledger</h4>
                  
                  <div className="space-y-2 text-[10px] font-mono">
                    <div className="p-2 border border-white/5 bg-[#151515] rounded flex justify-between items-center text-stone-400">
                      <span>OUT: ORD-9465 (Rosewood Console)</span>
                      <span className="text-stone-500">10:45 AM</span>
                    </div>
                    <div className="p-2 border border-white/5 bg-[#151515] rounded flex justify-between items-center text-stone-400">
                      <span>IN: SUP-201 Red Oak Shipment</span>
                      <span className="text-emerald-550">Yesterday</span>
                    </div>
                    <div className="p-2 border border-white/5 bg-[#151515] rounded flex justify-between items-center text-stone-400">
                      <span>OUT: ORD-9462 Dining Chair release</span>
                      <span className="text-stone-550">2 days ago</span>
                    </div>
                  </div>
                </div>

                {/* Damage Reporter Tool */}
                <div className="p-5 bg-[#0F0F0F] border border-white/4.5 rounded-xl space-y-3">
                  <span className="text-[10px] whitespace-nowrap uppercase tracking-widest text-zinc-500 font-bold block">Logger Damage Incident Reporting</span>
                  <div className="space-y-2">
                    <select
                      value={damageItemInput.itemId}
                      onChange={(e) => setDamageItemInput({ ...damageItemInput, itemId: e.target.value })}
                      className="w-full bg-[#151515] border border-white/5 rounded p-2 text-xs text-white"
                    >
                      {stockItems.map(it => (
                        <option key={it.id} value={it.id}>{it.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={damageItemInput.reason}
                      onChange={(e) => setDamageItemInput({ ...damageItemInput, reason: e.target.value })}
                      placeholder="e.g. Scratched during side movement"
                      className="w-full bg-[#151515] border border-white/5 rounded p-2 text-xs text-white outline-none"
                    />
                    <button
                      onClick={() => {
                        if (!damageItemInput.reason) return;
                        const match = stockItems.find(t=>t.id === damageItemInput.itemId);
                        onAddDirectActivity({
                          id: `ACT-${Math.floor(900 + Math.random() * 99)}`,
                          timestamp: new Date().toISOString(),
                          staffName: "Quality Inspector",
                          branch: activeBranch,
                          action: `Reported incident damaged stock: ${match?.name || "Inventory item"} - Reason: ${damageItemInput.reason}`,
                          status: "Warning"
                        });
                        alert(`Damage log committed. Action notified to regional manager for clearance.`);
                        setDamageItemInput({ itemId: "ST-001", reason: "" });
                      }}
                      className="w-full py-1.5 bg-red-950/20 hover:bg-red-900 border border-red-900 text-red-200 text-xs font-bold uppercase rounded cursor-pointer"
                    >
                      Issue Deficit/Damage Log
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* -------------------- DELIVERY & INSTALLATION MANAGEMENT -------------------- */}
      {activeTab === "deliveries" && (
        <div className="space-y-6">
          <div className="p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4 font-mono text-xs">
            <h3 className="font-serif italic text-lg text-white font-bold flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Truck className="w-5 h-5 text-[#C5A059]" />
              <span>Wood World Delivery & Installation Tracker Room</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: List of deliveries */}
              <div className="lg:col-span-2 space-y-3">
                {deliveries.map((dl) => (
                  <div key={dl.id} className="p-4 bg-[#0F0F0F] rounded-xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-stone-500 font-bold">{dl.id} • Order: {dl.orderId}</span>
                        <h4 className="text-white text-xs font-bold mt-1 max-w-sm font-sans">{dl.address}</h4>
                      </div>
                      
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        dl.status === "Customer Approved"
                          ? "bg-emerald-950/25 text-emerald-400 border-emerald-900"
                          : "bg-[#C5A059]/15 text-[#C5A059] border-[#C5A059]/30"
                      }`}>
                        {dl.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-stone-400 text-[11px] border-t border-b border-white/5 py-2">
                      <div>
                        <span>Assigned Courier:</span> <strong className="text-stone-300 block">{dl.driver}</strong>
                      </div>
                      <div>
                        <span>Logistics Fleet Route:</span> <strong className="text-stone-300 block">{dl.tracker}</strong>
                      </div>
                    </div>

                    {/* Progress actions & OTP simulation */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      {dl.status !== "Customer Approved" ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Enter 4-Digit Customer OTP"
                            value={otpVerifyState[dl.id] || ""}
                            onChange={(e) => setOtpVerifyState({ ...otpVerifyState, [dl.id]: e.target.value })}
                            className="bg-[#151515] border border-white/10 rounded px-2 py-1 text-xs w-48 text-white text-center"
                          />
                          <button
                            onClick={() => {
                              const typed = otpVerifyState[dl.id];
                              if (typed === dl.otp) {
                                setDeliveries(prev =>
                                  prev.map(del => del.id === dl.id ? { ...del, status: "Customer Approved" } : del)
                                );
                                alert("OTP Verified Successfully! Delivery confirmed and marked complete.");
                              } else {
                                alert(`Incorrect OTP code. Expected: ${dl.otp}`);
                              }
                            }}
                            className="py-1 px-3 bg-[#C5A059] hover:bg-[#b08c48] text-[#0F0F0F] font-bold rounded text-[10px] uppercase cursor-pointer"
                          >
                            Verify OTP
                          </button>
                        </div>
                      ) : (
                        <div className="text-emerald-555 flex items-center gap-1.5 uppercase tracking-wider text-[10px] font-bold">
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span>Delivered & Fully Installed • OTP verified</span>
                        </div>
                      )}

                      <div className="text-[10px] text-stone-500">
                        OTP code simulator aid: <strong className="text-[#C5A059]">{dl.otp}</strong>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Right Column: post delivery ratings log & optimization stats */}
              <div className="space-y-4">
                <div className="p-5 bg-[#0F0F0F] border border-white/5 rounded-xl space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059]">Active Transit Route Milestones</h4>
                  <div className="space-y-3 font-sans text-xs">
                    <div className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-950/20 text-emerald-400 border border-emerald-900 flex items-center justify-center text-[10px] shrink-0">1</span>
                      <div>
                        <strong className="text-stone-300 block">Clifton Hub Dispatch</strong>
                        <span className="text-[10px] text-stone-500 font-mono">Completed 09:20 AM</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 flex items-center justify-center text-[10px] shrink-0">2</span>
                      <div>
                        <strong className="text-stone-300 block">DHA Phase 6 Cargo Transit</strong>
                        <span className="text-[10px] text-stone-500 font-mono">In Route Active</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-stone-900 border border-white/5 flex items-center justify-center text-[10px] text-stone-500 shrink-0">3</span>
                      <div>
                        <strong className="text-stone-500 block">Onsite Carpentry / Installation</strong>
                        <span className="text-[10px] text-stone-500 font-mono">Pending Arrival</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* -------------------- BRANCH & MULTI-OUTLET CONTROL CENTER -------------------- */}
      {activeTab === "multi-outlet" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
            
            {/* Best performing branch indicators */}
            <div className="lg:col-span-2 p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4">
              <h3 className="font-serif italic text-lg text-white font-bold flex items-center gap-2 border-b border-white/5 pb-2.5">
                <Building className="w-5 h-5 text-[#C5A059]" />
                <span>Wood World Multi-Branch Analytics Matrix</span>
              </h3>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Karachi Showroom Target Revenue</span>
                    <strong className="text-[#C5A059]">₨ 3,500,000 / ₨ 5,000,000</strong>
                  </div>
                  <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#C5A059] to-amber-500" style={{ width: "70%" }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Lahore Central Warehouse Dispatch Progress</span>
                    <strong className="text-emerald-450">₨ 6,800,000 (Target Exceeded)</strong>
                  </div>
                  <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-580" style={{ width: "100%" }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Islamabad Showroom Focus target</span>
                    <strong className="text-red-400">₨ 1,200,000 / ₨ 4,000,000</strong>
                  </div>
                  <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                    <div className="h-full bg-red-630" style={{ width: "30%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Branch Announcements box */}
            <div className="p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4">
              <h4 className="font-serif italic text-base text-white font-bold border-b border-white/5 pb-2">HQ Regional Announcements</h4>
              
              <div className="space-y-3 font-sans text-xs">
                <div className="p-3 bg-[#0F0F0F] rounded-xl border-l-4 border-[#C5A059] border-y border-r border-white/5 space-y-1">
                  <strong className="text-stone-200 block">Seasoned Walnut Timber Shortage Alert</strong>
                  <p className="text-[11px] text-stone-500">Northern pine timber suppliers delayed. Prioritize Acacia stock transfers.</p>
                </div>
                <div className="p-3 bg-[#0F0F0F] rounded-xl border-l-4 border-emerald-500 border-y border-r border-white/5 space-y-1">
                  <strong className="text-stone-200 block">All-Pakistan Retail Commission Increase</strong>
                  <p className="text-[11px] text-stone-500">Sales crew booking values above ₨ 500k receive instant 1% rewards incentive.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- UNIFIED APPROVAL CENTER -------------------- */}
      {activeTab === "approvals-all" && (
        <div className="space-y-6">
          <div className="p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-2.5">
              <div>
                <h3 className="font-serif italic text-lg text-white font-bold flex items-center gap-2">
                  <GitPullRequest className="w-5 h-5 text-[#C5A059]" />
                  <span>Wood World Centralized Digital Approvals Suite</span>
                </h3>
                <p className="text-[10px] text-zinc-500 uppercase mt-0.5">Control room for Discounts, purchase orders, transfers, and leave clearance</p>
              </div>

              {currentRole !== "Owner" && (
                <span className="text-[10px] bg-red-950/20 text-red-400 border border-red-900 px-3 py-1.5 rounded animate-pulse">
                  CEO SECURITY RESTRICTIONS LOCK ACTIVE
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Form to create request for showroom managers */}
              <div className="p-5 bg-[#0F0F0F] border border-white/5 rounded-2xl space-y-4 self-start">
                <h4 className="font-serif italic text-base text-white font-bold border-b border-white/5 pb-2">Launch Clearance Request</h4>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Category of Clearance</label>
                    <select
                      value={newApprovalForm.type}
                      onChange={(e) => setNewApprovalForm({ ...newApprovalForm, type: e.target.value as any })}
                      className="w-full bg-[#151515] border border-white/5 rounded p-2 text-xs text-white"
                    >
                      <option value="Discount Request">Customer Order Discount Request</option>
                      <option value="Purchase Approvals">Log Timber Procurement release</option>
                      <option value="Expense Approvals">Atelier Fuel & Polishing Expense Release</option>
                      <option value="Staff leave approvals">M. Gulzar Urgent Leave check</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Details & Specific Justification</label>
                    <textarea
                      value={newApprovalForm.details}
                      onChange={(e) => setNewApprovalForm({ ...newApprovalForm, details: e.target.value })}
                      placeholder="e.g. Requesting 15% discount on Sofa set due to repeated corporate booking client."
                      className="w-full h-20 bg-[#151515] border border-white/5 rounded p-2 text-xs text-white outline-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!newApprovalForm.details) return;
                      const addedApproval: ManagerApproval = {
                        id: `APP-${Math.floor(3003 + Math.random() * 95)}`,
                        type: newApprovalForm.type,
                        branch: activeBranch,
                        details: newApprovalForm.details,
                        requestedBy: `${currentRole} Clearance Request`,
                        amountPKR: newApprovalForm.amountPKR,
                        status: "Pending",
                        dateCreated: new Date().toISOString().split("T")[0]
                      };
                      onAddNewApprovalRequest(addedApproval);
                      alert("Clearance request logged! Added to the digital approvals queue pending Master CEO review.");
                      setNewApprovalForm({ type: "Discount Request", details: "", amountPKR: 20000 });
                    }}
                    className="w-full py-2 bg-[#C5A059] hover:bg-[#b08c48] text-[#0F0F0F] font-bold uppercase rounded cursor-pointer text-center text-[10px]"
                  >
                    Transmit to Approval Board
                  </button>
                </div>
              </div>

              {/* Right Column: List of clearance pending approvals (Col-2) */}
              <div className="lg:col-span-2 space-y-3">
                <span className="text-[10px] text-zinc-405 block font-bold uppercase">Pending Enterprise authorizations queue</span>
                {approvals.filter(a => a.status === "Pending").length === 0 ? (
                  <div className="p-8 bg-[#0F0F0F] border border-white/5 rounded-xl text-center text-zinc-500">
                    No active clearance authorizations pending CEO release. Everything clean!
                  </div>
                ) : (
                  approvals.filter(a => a.status === "Pending").map((app) => (
                    <div key={app.id} className="p-4 bg-[#0F0F0F] rounded-xl border border-white/5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[#C5A059] font-bold block">{app.type} ({app.id})</span>
                          <span className="text-[10px] text-stone-500 mt-0.5 block font-sans">Origin: {app.branch} • By: {app.requestedBy}</span>
                        </div>
                        <span className="bg-yellow-950/25 text-yellow-500 border border-yellow-900/40 px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider">
                          PENDING AUTH
                        </span>
                      </div>
                      
                      <p className="text-stone-300 text-xs mt-1 font-sans">{app.details}</p>

                      {currentRole === "Owner" ? (
                        <div className="flex justify-end gap-2.5 pt-2 border-t border-white/5">
                          <button
                            onClick={() => {
                              onAddNewApprovalRequest({ ...app, status: "Declined" });
                              alert(`Decline logged for ${app.id}`);
                            }}
                            className="py-1 px-3 bg-red-950/20 hover:bg-red-900 text-red-200 border border-red-900 text-[10px] font-bold uppercase rounded cursor-pointer"
                          >
                            Decline Request
                          </button>
                          <button
                            onClick={() => {
                              onAddNewApprovalRequest({ ...app, status: "Approved" });
                              alert(`Cleared authorization for ${app.id}`);
                            }}
                            className="py-1 px-3 bg-[#C5A059] hover:bg-[#b08c48] text-[#0F0F0F] text-[10px] font-bold uppercase rounded cursor-pointer"
                          >
                            Approved Security Release
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2 text-[9px] text-red-405 italic text-right">
                          🔒 Authorization locked: Requires Master CEO/Owner Clearance.
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* -------------------- EXECUTIVE AI BUSINESS CENTER -------------------- */}
      {activeTab === "executive-ai" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
            
            {/* AI Assistant Question Box */}
            <div className="lg:col-span-2 p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4">
              <h3 className="font-serif italic text-lg text-white font-bold flex items-center gap-2 border-b border-white/5 pb-2.5">
                <Sparkles className="w-5 h-5 text-[#C5A059] animate-pulse" />
                <span>Wood World Gemini Business Intelligence Cockpit</span>
              </h3>

              <div className="bg-[#0F0F0F] border border-white/5 rounded-xl p-4 min-h-[220px] max-h-[380px] overflow-y-auto leading-relaxed">
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-stone-500 text-xs">
                    <Clock className="w-6 h-6 text-[#C5A059] animate-spin mb-2" />
                    <span>Querying regional timber metrics & customer rosters...</span>
                  </div>
                ) : (
                  <div className="text-zinc-300 text-xs space-y-3 prose prose-invert font-sans max-w-none">
                    <span className="text-[10px] font-mono text-[#C5A059] border border-[#C5A059]/30 bg-[#C5A059]/5 py-0.5 px-2 rounded tracking-widest uppercase font-bold block w-max">
                      Gemini Advisory Brief
                    </span>
                    <p className="whitespace-pre-line leading-relaxed">{aiResponseText || "Ready for advice."}</p>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPromptInput}
                  onChange={(e) => setAiPromptInput(e.target.value)}
                  placeholder="Ask any operations advice, e.g. 'Predict Lahore revenue' or 'Audit low stock warnings'..."
                  className="flex-1 bg-[#0F0F0F] border border-white/5 focus:border-[#C5A059]/40 rounded-lg p-2.5 text-xs text-white outline-none"
                />
                <button
                  onClick={() => {
                    if (!aiPromptInput.trim()) return;
                    runAiAnomaliesBrief(aiPromptInput);
                    setAiPromptInput("");
                  }}
                  className="py-2.5 px-4 bg-[#C5A059] hover:bg-[#b08c48] text-[#0F0F0F] font-bold uppercase rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick action recommendations */}
            <div className="p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4">
              <h4 className="font-serif italic text-base text-white font-bold border-b border-white/5 pb-2">Operational Suggestions</h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-[#0F0F0F] border border-white/5 rounded-xl space-y-2">
                  <div className="flex gap-1.5 items-center text-red-400">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-[10px] font-bold uppercase">Sofa Stock Warning</span>
                  </div>
                  <p className="text-[11px] text-stone-400 font-sans leading-relaxed">
                    Karachi is dangerously low on Velvet Lounge sofas. Recommending auto stock balance from Lahore Hub racks.
                  </p>
                  <button
                    onClick={() => {
                      alert("Dispensing auto stock transfer request: 2 Chesterfield series sofas from Lahore to Karachi showroom.");
                    }}
                    className="w-full mt-2 py-1.5 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border border-[#C5A059]/30 text-[#C5A059] text-[9px] font-bold uppercase rounded cursor-pointer"
                  >
                    Authorize Auto-Balance Transfer
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- CUSTOMER SUPPORT & AFTER-SALES CENTER -------------------- */}
      {activeTab === "after-sales" && (
        <div className="space-y-6">
          {/* Header Row */}
          <div className="p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4 font-mono text-xs">
            <h3 className="font-serif italic text-lg text-white font-bold flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Users className="w-5 h-5 text-[#C5A059]" />
              <span>Wood World Advanced CRM Customer Directory & Support Hub</span>
            </h3>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 font-sans">
              
              {/* Column 1: Customer profiles search ledger (Col-4) */}
              <div className="xl:col-span-4 space-y-4 font-normal text-xs text-stone-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block pb-1">Registered Customers List</span>
                  {crmDuplicateDetected && (
                    <span className="text-[9px] bg-red-950/20 text-red-400 font-mono font-bold px-1 rounded animate-pulse">
                      Duplicate Detected
                    </span>
                  )}
                </div>

                {/* Local search input for CRM Directory */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-550" />
                  <input
                    type="text"
                    value={crmSearchQuery}
                    onChange={(e) => setCrmSearchQuery(e.target.value)}
                    placeholder="Search client by Name, phone, or CNIC..."
                    className="w-full bg-[#0F0F0F] border border-white/5 pl-8 pr-3 py-1.5 rounded-lg text-xs text-white outline-none font-mono"
                  />
                </div>

                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {customers
                    .filter(c => 
                      c.name.toLowerCase().includes(crmSearchQuery.toLowerCase()) ||
                      c.phone.includes(crmSearchQuery) ||
                      c.cnic.includes(crmSearchQuery)
                    )
                    .map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedCustomerId(c.id);
                          setCrmAiInsightText("");
                        }}
                        className={`p-3 rounded-xl border transition-all text-left cursor-pointer ${
                          selectedCustomerId === c.id
                            ? "bg-[#C5A059]/10 border-[#C5A059]"
                            : "bg-[#0F0F0F] border-white/5 hover:border-white/10"
                        }`}
                      >
                        <div className="flex justify-between items-start font-mono">
                          <strong className="text-zinc-205 text-xs font-bold font-sans">{c.name}</strong>
                          <span className="text-[8px] bg-stone-850 px-1.5 py-0.5 rounded text-[#C5A059] border border-white/5">
                            {c.id}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 font-mono mt-1">{c.phone} • {c.email.split("@")[0]}</p>
                        <div className="text-[9px] text-zinc-450 mt-1.5 border-t border-white/5 pt-1.5 flex justify-between font-mono">
                          <span>Material: {c.favoriteCategory}</span>
                          <span className="text-[#C5A059] font-bold">Details [→]</span>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Sub-Panel: Add New Showroom Customer */}
                <div className="p-4 bg-[#0F0F0F] border border-white/5 rounded-xl space-y-3">
                  <h4 className="text-[10px] uppercase font-bold text-zinc-300 font-mono">Register Showroom Customer</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Customer Full Name"
                      value={crmNewCustomer.name}
                      onChange={(e) => {
                        setCrmNewCustomer({ ...crmNewCustomer, name: e.target.value });
                        setCrmDuplicateDetected(null);
                      }}
                      className="w-full bg-[#151515] border border-white/10 rounded p-1.5 text-xs text-white outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Phone (03xx-xxxxxxx)"
                        value={crmNewCustomer.phone}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCrmNewCustomer({ ...crmNewCustomer, phone: val });
                          // Duplicate detection simulation
                          const isDup = customers.some(c => c.phone === val || c.phone.replaceAll("-","") === val.replaceAll("-",""));
                          if (isDup) {
                            setCrmDuplicateDetected(`Phone mobile matches active account record!`);
                          } else {
                            setCrmDuplicateDetected(null);
                          }
                        }}
                        className={`w-full bg-[#151515] border rounded p-1.5 text-xs text-white outline-none font-mono ${
                          crmDuplicateDetected ? "border-red-500 bg-red-950/10 text-red-200" : "border-white/10"
                        }`}
                      />
                      <input
                        type="text"
                        placeholder="CNIC (xxxxx-xxxxxxx-x)"
                        value={crmNewCustomer.cnic}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCrmNewCustomer({ ...crmNewCustomer, cnic: val });
                          const isDup = customers.some(c => c.cnic === val);
                          if (isDup) {
                            setCrmDuplicateDetected(`CNIC matches active premium account!`);
                          } else {
                            setCrmDuplicateDetected(null);
                          }
                        }}
                        className="w-full bg-[#151515] border border-white/10 rounded p-1.5 text-xs text-white outline-none font-mono"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Home Delivery Address (e.g. DHA Karachi)"
                      value={crmNewCustomer.address}
                      onChange={(e) => setCrmNewCustomer({ ...crmNewCustomer, address: e.target.value })}
                      className="w-full bg-[#151515] border border-white/10 rounded p-1.5 text-xs text-white outline-none"
                    />
                    <button
                      onClick={() => {
                        if (!crmNewCustomer.name || !crmNewCustomer.phone) {
                          alert("Customer Name and Phone are required parameters.");
                          return;
                        }
                        if (crmDuplicateDetected) {
                          alert(`Blocked Duplicate Check: Another customer profile utilizes this identical credential parameter.`);
                          return;
                        }

                        const added = {
                          id: `CUST-00${customers.length + 1}`,
                          name: crmNewCustomer.name,
                          phone: crmNewCustomer.phone,
                          email: crmNewCustomer.email || `${crmNewCustomer.name.toLowerCase().replaceAll(" ", "")}@WoodWorldHQ.pk`,
                          cnic: crmNewCustomer.cnic || "Pending Verification",
                          address: crmNewCustomer.address || "Showroom Walk-in Client",
                          favoriteWood: crmNewCustomer.favoriteWood,
                          preferences: "Registered via active Showroom check-in portal.",
                          complaints: "None",
                          warrantyRecords: "Term Warranty Certificate dispatch pending on current order checkout.",
                          favoriteCategory: crmNewCustomer.favoriteCategory
                        };

                        setCustomers([added, ...customers]);
                        onAddDirectActivity({
                          id: `ACT-${Math.floor(700 + Math.random() * 299)}`,
                          timestamp: new Date().toISOString(),
                          staffName: "Guest Reception CRM",
                          branch: activeBranch,
                          action: `Registered brand new customer parameter profile database record: ${added.name}.`,
                          status: "Success"
                        });

                        setSelectedCustomerId(added.id);
                        setCrmNewCustomer({
                          name: "",
                          phone: "",
                          email: "",
                          cnic: "",
                          address: "",
                          favoriteWood: "Premium Seasoned Walnut",
                          preferences: "",
                          favoriteCategory: "Dining"
                        });
                        alert("Customer locked down successfully into CRM cloud ledger.");
                      }}
                      className="w-full py-1.5 bg-[#C5A059] hover:bg-[#b08c48] text-[#0F0F0F] font-bold text-[10px] uppercase rounded cursor-pointer"
                    >
                      Lock Customer Record
                    </button>
                  </div>
                </div>
              </div>

              {/* Column 2: Selected Customer Profile Detail View (Col-4) */}
              <div className="xl:col-span-4 space-y-4 text-xs font-normal text-stone-300">
                {selectedCustomerId ? (() => {
                  const cust = customers.find(c => c.id === selectedCustomerId);
                  if (!cust) return <p className="text-zinc-500 font-mono">No profile selected.</p>;
                  return (
                    <div className="p-5 bg-[#0F0F0F] border border-white/5 rounded-2xl space-y-4">
                      <div className="border-b border-white/5 pb-3">
                        <span className="text-[9px] font-mono uppercase bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/15 px-1.5 py-0.5 rounded font-bold">
                          Primary CRM Account File
                        </span>
                        <h4 className="text-white text-base font-serif italic font-bold mt-2">{cust.name}</h4>
                        <span className="text-[10px] text-stone-500 font-mono mt-0.5 block">Verified CNIC: {cust.cnic}</span>
                      </div>

                      <div className="space-y-2 font-mono text-[11px] text-zinc-300">
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-stone-550">Mobile Phone:</span>
                          <strong>{cust.phone}</strong>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1 font-mono">
                          <span className="text-stone-550">Corporate Email:</span>
                          <span className="text-stone-200 select-all truncate max-w-[180px] font-mono">{cust.email}</span>
                        </div>
                        <div className="border-b border-white/5 pb-1">
                          <span className="text-stone-550 block mb-0.5">Shipping Residence:</span>
                          <span className="text-zinc-300 font-sans text-[11px] leading-snug block">{cust.address}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-stone-550">Fabric/Wood Pref:</span>
                          <strong className="text-[#C5A059]">{cust.favoriteWood}</strong>
                        </div>
                        <div className="border-b border-white/5 pb-1">
                          <span className="text-stone-550 block mb-0.5">Active Term Warranty:</span>
                          <span className="text-emerald-500 font-sans text-[10px] leading-tight block">{cust.warrantyRecords}</span>
                        </div>
                        <div className="border-b border-white/5 pb-1">
                          <span className="text-stone-550 block mb-0.5 font-mono">Special Requests:</span>
                          <p className="text-stone-400 font-sans text-[11px] leading-relaxed italic">&quot;{cust.preferences}&quot;</p>
                        </div>
                      </div>

                      {/* Dynamic Customer Interaction & Purchase history direct linking */}
                      <div className="bg-[#151515] border border-white/5 p-3 rounded-xl space-y-2">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">Central Purchase History Link</span>
                        {orders.filter(o => o.customerName === cust.name).length > 0 ? (
                          orders.filter(o => o.customerName === cust.name).map((ord) => (
                            <div key={ord.id} className="p-2 bg-[#0F0F0F] rounded border border-white/5 flex justify-between items-center font-mono text-[10px]">
                              <div>
                                <span className="text-stone-400 font-sans font-bold">{ord.id}</span>
                                <span className="text-[8px] text-zinc-505 block">Total: {formatPKR(ord.totalPKR)}</span>
                              </div>
                              <span className={`text-[8px] px-1.5 py-0.5 font-bold rounded ${
                                ord.status === "Delivered" ? "bg-emerald-950/20 text-emerald-400" : "bg-yellow-950/20 text-yellow-500 animate-pulse"
                              }`}>
                                {ord.status}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-[10px] text-stone-500 leading-normal font-sans pt-1">No transactions routed in current session state yet. Matches will auto-resolve on sales checkout.</p>
                        )}
                      </div>

                      {/* Copilot insight trigger and display */}
                      <div className="space-y-1.5 pt-1 font-mono">
                        <button
                          onClick={async () => {
                            setCrmAiInsightLoading(true);
                            try {
                              const dynamicPrompt = `Extract strategic upscale proposals and furniture loyalty target rules for Wood World Enterprise Pakistan Client:
Name: ${cust.name}
Wood Choice: ${cust.favoriteWood}
Category Rank: ${cust.favoriteCategory}
Requests: ${cust.preferences}
Complaints: ${cust.complaints}
Active Warranty: ${cust.warrantyRecords}

Generate exactly 3 professional bulleted items highlighting customized catalog recommendations and targeted marketing loyalty discount guidelines. Keep bullet items humble and Pakistan-business focused.`;
                              
                              const response = await fetch("/api/copilot", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  message: dynamicPrompt,
                                  context: "You are the Senior Artificial Intelligent CRM Consultant of Wood World Enterprise.",
                                  history: []
                                })
                              });
                              if (response.ok) {
                                const data = await response.json();
                                setCrmAiInsightText(data.reply);
                              } else {
                                setCrmAiInsightText("• Propose Classic Empress Solid Walnut Console Set with a complimentary 10% loyalty voucher.\n• Assign onsite polisher to evaluate the air-drying varnish requirements to prevent polish odor.\n• Issue immediate VIP Club gold card priority for bespoke carving custom requests.");
                              }
                            } catch (e) {
                              setCrmAiInsightText("• Recommendation: Upsell Emperor Classic Dining Set matched to Walnut preferences.\n• Care Advice: Ensure kiln drying seasoning is verified before polishing.\n• Discount: Standard 5% term voucher assigned for his next showroom visit.");
                            } finally {
                              setCrmAiInsightLoading(false);
                            }
                          }}
                          className="w-full py-2 bg-[#C5A059]/15 hover:bg-[#C5A059]/25 border border-[#C5A059]/20 text-[#C5A059] rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1 text-[10px] font-bold uppercase"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Request CRM AI Customer Intelligence</span>
                        </button>

                        {crmAiInsightLoading ? (
                          <div className="p-3 bg-[#151515] border border-white/5 rounded text-stone-450 animate-pulse text-[10px] leading-relaxed">
                            Securing real-time Gemini assessment on customer choices...
                          </div>
                        ) : crmAiInsightText ? (
                          <div className="p-3 bg-[#1A1A1A] border border-white/5 rounded text-left text-[10.5px] leading-relaxed text-zinc-350 space-y-1.5 font-sans whitespace-pre-line border-l-2 border-l-[#C5A059]">
                            {crmAiInsightText}
                          </div>
                        ) : null}
                      </div>

                    </div>
                  );
                })() : (
                  <div className="p-5 bg-[#0F0F0F] border border-white/5 rounded-2xl text-center text-stone-500 font-mono py-12">
                    Select a client profile card to pull physical contact files and dynamic accounts linkage.
                  </div>
                )}
              </div>

              {/* Column 3: Active Support Tickets Room & Form (Col-4) */}
              <div className="xl:col-span-4 space-y-4">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block pb-0.5 font-bold">Showroom Service Tickets Locker</span>

                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {supportTickets.map(tk => (
                    <div key={tk.id} className="p-3.5 bg-[#0F0F0F] rounded-xl border border-white/5 space-y-2 font-mono text-[10px]">
                      <div className="flex justify-between items-start font-sans">
                        <div>
                          <strong className="text-zinc-200 text-xs font-bold block text-left">{tk.customerName}</strong>
                          <span className="text-[8px] text-[#C5A059] font-bold uppercase block mt-0.5 text-left">{tk.type}</span>
                        </div>
                        <span className={`px-1.5 py-0.5 text-[8px] uppercase font-bold rounded shrink-0 ${
                          tk.status === "Resolved"
                            ? "bg-emerald-950/25 text-emerald-400"
                            : "bg-amber-950/25 text-amber-505 animate-pulse"
                        }`}>
                          {tk.status}
                        </span>
                      </div>
                      <p className="text-zinc-350 font-sans leading-relaxed my-1 font-normal text-xs text-left">{tk.details}</p>
                      
                      <div className="text-[9px] text-stone-550 border-t border-white/5 pt-1.5 flex justify-between uppercase font-mono">
                        <span>Ref Case ID: {tk.id}</span>
                        <span>Dispatch: {tk.responseDate}</span>
                      </div>

                      {tk.status !== "Resolved" && (
                        <div className="pt-1.5 border-t border-white/5 flex justify-end">
                          <button
                            onClick={() => {
                              setSupportTickets(supportTickets.map(t => t.id === tk.id ? { ...t, status: "Resolved" } : t));
                              onAddDirectActivity({
                                id: `ACT-${Math.floor(600 + Math.random() * 399)}`,
                                timestamp: new Date().toISOString(),
                                staffName: "Chief Polisher Onsite",
                                branch: activeBranch,
                                action: `Onsite carpenter completed repair ticket ${tk.id} for customer ${tk.customerName}.`,
                                status: "Success"
                              });
                            }}
                            className="px-2 py-0.5 bg-emerald-900/40 hover:bg-emerald-800 border border-emerald-800/30 hover:border-emerald-700 text-emerald-200 text-[8px] rounded cursor-pointer transition-all uppercase font-bold"
                          >
                            Mark Handover Complete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-5 bg-[#0F0F0F] border border-white/5 rounded-xl space-y-3 font-mono">
                  <h4 className="font-serif italic text-sm text-white font-bold border-b border-white/5 pb-2">Log Warranty Claim Incident</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Customer Full Name"
                      id="claim-name"
                      className="w-full bg-[#151515] border border-white/5 p-2 rounded text-xs text-white placeholder-stone-605 outline-none font-sans"
                    />
                    <select
                      id="claim-type"
                      className="w-full bg-[#151515] border border-white/5 p-2 rounded text-xs text-white outline-none font-sans"
                    >
                      <option value="Polish Term Scratch Repair">Polish Term Scratch Repair</option>
                      <option value="Bespoke Joint Seasoning Inspection">Bespoke Joint Seasoning Inspection</option>
                      <option value="Carving Structural Alignment">Carving Structural Alignment</option>
                      <option value="Upholstery Cushion Protection Audit">Upholstery Cushion Protection Audit</option>
                    </select>
                    <textarea
                      placeholder="Specify wood damage, structural problems or polisher requirements..."
                      id="claim-details"
                      className="w-full bg-[#151515] border border-white/5 p-2 rounded text-xs text-white h-16 placeholder-stone-605 outline-none font-sans"
                    />
                    <button
                      onClick={() => {
                        const name = (document.getElementById("claim-name") as HTMLInputElement)?.value;
                        const typeVal = (document.getElementById("claim-type") as HTMLSelectElement)?.value;
                        const det = (document.getElementById("claim-details") as HTMLTextAreaElement)?.value;
                        if (!name || !det) {
                          alert("Name and description are mandatory parameters.");
                          return;
                        }
                        const addedTicket = {
                          id: `ST-${Math.floor(100 + Math.random() * 900)}`,
                          customerName: name,
                          date: new Date().toISOString().split("T")[0],
                          type: typeVal,
                          responseDate: "2026-06-03",
                          details: det,
                          status: "Scheduled" as any
                        };
                        setSupportTickets([...supportTickets, addedTicket]);
                        onAddDirectActivity({
                          id: `ACT-${Math.floor(900 + Math.random() * 99)}`,
                          timestamp: new Date().toISOString(),
                          staffName: "Quality Inspector Desk",
                          branch: activeBranch,
                          action: `Dispatched carpentry crew to resolve warranty polisher request for client ${name}.`,
                          status: "Success"
                        });
                        alert("Support incident dispatched. Carpenter roster slot assigned.");
                        (document.getElementById("claim-name") as HTMLInputElement).value = "";
                        (document.getElementById("claim-details") as HTMLTextAreaElement).value = "";
                      }}
                      className="w-full py-2 bg-[#C5A059] hover:bg-[#b08c48] text-[#0F0F0F] font-bold uppercase rounded cursor-pointer text-center text-[10px]"
                    >
                      Issue Incident Ticket
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* -------------------- SUPPLY CHAIN & PROCUREMENT -------------------- */}
      {activeTab === "procurement" && (
        <div className="p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4 font-mono text-xs">
          <h3 className="font-serif italic text-lg text-white font-bold flex items-center gap-2 border-b border-white/5 pb-2.5">
            <Building className="w-5 h-5 text-[#C5A059]" />
            <span>procurement & Timber Raw Material Logistics</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Suppliers cards (Col-2) */}
            <div className="lg:col-span-2 space-y-3">
              <span className="text-[10px] uppercase font-bold text-zinc-405 block">Timber Logging Partners Ledger</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suppliers.map(sp => (
                  <div key={sp.id} className="p-4 bg-[#0F0F0F] rounded-xl border border-white/5 space-y-2">
                    <strong className="text-white text-xs block">{sp.partner}</strong>
                    <p className="text-stone-400 text-xs">Harvest Timber Source: {sp.woodSource}</p>
                    <div className="text-[10px] text-stone-500 border-t border-white/5 pt-1.5 flex justify-between font-mono">
                      <span>Rating Score: {sp.score}</span>
                      <span>Logs dispatched: {sp.pendingLogsCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timber procurement logger */}
            <div className="p-5 bg-[#0F0F0F] border border-white/5 rounded-2xl space-y-4 h-full self-start">
              <h4 className="font-serif italic text-base text-white font-bold border-b border-white/5 pb-2">Lock raw timber order</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Wood Type Volume CFT, e.g. Seasoned Walnut 400 CFT"
                  id="proc-wood"
                  className="w-full bg-[#151515] border border-white/5 p-2 rounded text-xs text-white"
                />
                <input
                  type="number"
                  placeholder="Cost Estimation (PKR)"
                  id="proc-cost"
                  className="w-full bg-[#151515] border border-white/5 p-2 rounded text-xs text-white"
                />
                <button
                  onClick={() => {
                    const wood = (document.getElementById("proc-wood") as HTMLInputElement)?.value;
                    const cst = parseInt((document.getElementById("proc-cost") as HTMLInputElement)?.value) || 0;
                    if (!wood) return;
                    setProcurements([...procurements, {
                      id: `PROC-${Math.floor(100 + Math.random() * 900)}`,
                      rawWood: wood,
                      supplier: "Northern Pines Timber Corp",
                      cost: cst,
                      dispatchDate: "2026-06-05",
                      state: "Scheduled"
                    }]);
                    alert("Procurement order finalized. Pending regional transfer release.");
                  }}
                  className="w-full py-2 bg-[#C5A059] hover:bg-[#b08c48] text-[#0F0F0F] font-bold uppercase rounded cursor-pointer"
                >
                  Confirm Log Procurement
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- DIGITAL DOCUMENT CENTER -------------------- */}
      {activeTab === "documents" && (
        <div className="p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4 font-mono text-xs">
          <h3 className="font-serif italic text-lg text-white font-bold flex items-center gap-2 border-b border-white/5 pb-2.5">
            <FileText className="w-5 h-5 text-[#C5A059]" />
            <span>Digital Document Vault & Print Invoices</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* List of documents */}
            <div className="lg:col-span-2 space-y-3">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block"> Wood World Consolidated Documents Ledger</span>
              <div className="space-y-2">
                {[
                  { title: "Invoice #ORD-9462 (Dr. Sarfraz Ahmed)", date: "2026-05-24", size: "14 KB", type: "Invoice-PDF" },
                  { title: "Custom Mughal Wardrobe CAD Blueprint #CAD-8392", date: "2026-05-29", size: "1.2 MB", type: "CAD Blueprint" },
                  { title: "Supplier Timber Cargo Challan #Northern Pines-301", date: "2026-05-27", size: "48 KB", type: "Cargo Challan" },
                  { title: "Active Franchise Agreement - Islamabad Showroom", date: "2026-03-12", size: "4.8 MB", type: "Contract Agreement" }
                ].map((doc, idx) => (
                  <div key={idx} className="p-3 bg-[#0F0F0F] rounded-xl border border-white/5 flex items-center justify-between text-xs hover:border-white/10 transition-colors">
                    <div>
                      <strong className="text-zinc-200 block">{doc.title}</strong>
                      <span className="text-[10px] text-stone-500">Stamp Date: {doc.date} • Size: {doc.size}</span>
                    </div>
                    <button
                      onClick={() => {
                        alert(`Exporting representational PDF printout for document: ${doc.title}. PDF saved locally.`);
                      }}
                      className="p-1.5 bg-[#1A1A1A] border border-white/5 hover:border-[#C5A059]/40 hover:bg-[#202020] text-stone-400 hover:text-[#C5A059] cursor-pointer rounded transition-all"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* General secure digital file uploading */}
            <div className="p-5 bg-[#0F0F0F] border border-white/5 rounded-xl space-y-3 flex flex-col justify-between h-full">
              <div>
                <h4 className="font-serif italic text-base text-white font-bold border-b border-white/0.5 pb-2">Backup Document Backup Log</h4>
                <p className="text-[11px] text-stone-400 leading-normal font-sans">
                  Drag and drop scans of custom design reference sketches or transport challan logs directly to sync with central Lahore HQ servers immediately.
                </p>
                
                <div className="mt-4 border-2 border-[#C5A059]/20 border-dashed rounded-xl p-6 text-center text-zinc-500 hover:border-[#C5A059]/40 transition-colors cursor-pointer">
                  <span>Click to browse PDFs or Images</span>
                </div>
              </div>

              <div className="text-[10px] text-stone-500 leading-relaxed font-mono">
                Wood World digital ledger is mirrored securely to redundancy hubs in Pakistan.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- DAILY OPERATIONS CONTROL CENTER -------------------- */}
      {activeTab === "daily-ops" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[#151515] border border-white/5 rounded-xl text-xs font-mono">
              <span className="text-stone-500 block uppercase text-[10px]">Today's Sales Total</span>
              <strong className="text-[#C5A059] text-lg block mt-1">{formatPKR(820000)}</strong>
              <span className="text-emerald-555 block text-[10px] mt-0.5">▲ +12% vs Yesterday</span>
            </div>
            <div className="p-4 bg-[#151515] border border-white/5 rounded-xl text-xs font-mono">
              <span className="text-stone-500 block uppercase text-[10px]">Active Workshop Tasks</span>
              <strong className="text-stone-200 text-lg block mt-1">{workshopTasks.length} Active</strong>
              <span className="text-stone-500 block text-[10px] mt-0.5">Ready for release: 1</span>
            </div>
            <div className="p-4 bg-[#151515] border border-white/5 rounded-xl text-xs font-mono">
              <span className="text-stone-500 block uppercase text-[10px]">Pending Deliveries</span>
              <strong className="text-zinc-300 text-lg block mt-1">{deliveries.filter(d => d.status !== "Customer Approved").length} Orders</strong>
              <span className="text-yellow-501 block text-[10px] mt-0.5">OTP verification active</span>
            </div>
            <div className="p-4 bg-[#151515] border border-white/5 rounded-xl text-xs font-mono">
              <span className="text-stone-500 block uppercase text-[10px]">Low stock inventory alerts</span>
              <strong className="text-red-400 text-lg block mt-1">
                {stockItems.filter(item => (item.stockByBranch[activeBranch] || 0) <= item.alertThreshold).length} items
              </strong>
              <span className="text-stone-500 block text-[10px] mt-0.5">Lahore warehouse transfers clearance: 2</span>
            </div>
          </div>

          <div className="p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-3 font-sans">
            <div className="flex items-center gap-1.5 pb-2 border-b border-white/5">
              <Sparkles className="w-4 h-4 text-[#C5A059] animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">Wood World Copilot Operations briefing today</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Karachi branch showroom is currently pacing ahead of the Islamabad showroom booking goals. 2 stock releases of red oak executive desks will restore local buffers. Workshop Ustad Allah Ditta is on track with custom carvings blueprints.
            </p>
          </div>
        </div>
      )}

      {/* -------------------- SMART TASK & REMINDER SYSTEM -------------------- */}
      {activeTab === "tasks" && (
        <div className="p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4 font-mono text-xs">
          <h3 className="font-serif italic text-lg text-white font-bold flex items-center gap-2 border-b border-white/5 pb-2.5">
            <Calendar className="w-5 h-5 text-[#C5A059]" />
            <span>Showroom tasks & Operations Board</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* List of reminders */}
            <div className="lg:col-span-2 space-y-3">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Workspace To-Do checklist queue</span>
              <div className="space-y-2">
                {reminders.map(tk => (
                  <div key={tk.id} className="p-3 bg-[#0F0F0F] rounded-xl border border-white/5 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-stone-200 block">{tk.title}</strong>
                      <span className="text-[10px] text-stone-500">Assignee: {tk.assignment} • Deadline: {tk.deadline}</span>
                    </div>
                    <button
                      onClick={() => {
                        setReminders(prev => prev.filter(r => r.id !== tk.id));
                        alert("Task finished and archived from database checklist.");
                      }}
                      className="py-1 px-3 bg-[#C5A059] hover:bg-[#b08c48] text-[#0F0F0F] font-bold text-[9px] uppercase tracking-wider rounded cursor-pointer"
                    >
                      Complete Task
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Create task helper tool */}
            <div className="p-5 bg-[#0F0F0F] border border-white/5 rounded-xl space-y-3 self-start">
              <h4 className="font-serif italic text-base text-white font-bold border-b border-white/5 pb-2">Launch Quick Task</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Task brief description..."
                  id="task-title"
                  className="w-full bg-[#151515] border border-white/5 p-2 rounded text-xs text-white"
                />
                <select
                  id="task-assign"
                  className="w-full bg-[#151515] border border-white/5 p-2 rounded text-xs text-white"
                >
                  <option value="Farhan Attendant">Farhan Attendant</option>
                  <option value="Ustad Allah Ditta">Ustad Allah Ditta</option>
                  <option value="Ar. Ayesha Mahmood">Ar. Ayesha Mahmood</option>
                </select>
                <button
                  onClick={() => {
                    const title = (document.getElementById("task-title") as HTMLInputElement)?.value;
                    const assign = (document.getElementById("task-assign") as HTMLSelectElement)?.value;
                    if (!title) return;
                    setReminders([...reminders, {
                      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
                      title,
                      assignment: assign,
                      priority: "Medium",
                      deadline: "2026-06-02",
                      status: "To Do"
                    }]);
                    alert("Task created successfully!");
                  }}
                  className="w-full py-2 bg-[#C5A059] hover:bg-[#b08c48] text-[#0F0F0F] font-bold uppercase rounded cursor-pointer"
                >
                  Create Board Task
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- FINANCE & CASHFLOW CONTROL CENTER -------------------- */}
      {activeTab === "finance" && (
        <div className="space-y-6">
          <div className="p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4 font-mono text-xs">
            <h3 className="font-serif italic text-lg text-white font-bold flex items-center gap-2 border-b border-white/5 pb-2.5">
              <DollarSign className="w-5 h-5 text-[#C5A059]" />
              <span>Wood World Multi-outlet corporate Cashflow & Ledger</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Ledger lists (Col-2) */}
              <div className="lg:col-span-2 space-y-4">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Today's Transactions log checklist</span>
                <div className="space-y-2">
                  {cashflows.map(cf => (
                    <div key={cf.id} className="p-3 bg-[#0F0F0F] rounded-xl border border-white/5 flex items-center justify-between text-xs transition-colors">
                      <div>
                        <strong className="text-stone-200 block">{cf.detail}</strong>
                        <span className="text-[10px] text-stone-500">Category: {cf.category} • Date: {cf.stamp}</span>
                      </div>
                      <span className={`text-xs font-bold leading-normal ${cf.type === "Inflow" ? "text-emerald-500" : "text-amber-500"}`}>
                        {cf.type === "Inflow" ? "+" : "-"} {formatPKR(cf.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Record manual expense item */}
              <div className="p-5 bg-[#0F0F0F] border border-white/5 rounded-xl space-y-3 self-start">
                <h4 className="font-serif italic text-base text-white font-bold border-b border-white/5 pb-2">Record Corporate Expense</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Expense Detail statement..."
                    id="exp-detail"
                    className="w-full bg-[#151515] border border-white/5 p-2 rounded text-xs text-white"
                  />
                  <input
                    type="number"
                    placeholder="Amount to debit (PKR)"
                    id="exp-amount"
                    className="w-full bg-[#151515] border border-white/5 p-2 rounded text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      const det = (document.getElementById("exp-detail") as HTMLInputElement)?.value;
                      const amt = parseInt((document.getElementById("exp-amount") as HTMLInputElement)?.value) || 0;
                      if (!det || !amt) return;
                      setCashflows([...cashflows, {
                        id: `CSH-${Math.floor(100 + Math.random() * 900)}`,
                        type: "Outflow" as any,
                        detail: det,
                        category: "Manual Expense",
                        amount: amt,
                        stamp: new Date().toISOString().split("T")[0]
                      }]);
                      alert("Corporate expense logged inside active central ledger.");
                      (document.getElementById("exp-detail") as HTMLInputElement).value = "";
                      (document.getElementById("exp-amount") as HTMLInputElement).value = "";
                    }}
                    className="w-full py-2 bg-[#C5A059] hover:bg-[#b08c48] text-[#0F0F0F] font-bold uppercase rounded cursor-pointer"
                  >
                    Confirm Ledger Expense
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* -------------------- EMPLOYEE PERFORMANCE & HR CENTER -------------------- */}
      {activeTab === "hr" && (
        <div className="p-6 bg-[#151515] border border-white/5 rounded-2xl space-y-4 font-mono text-xs">
          <h3 className="font-serif italic text-lg text-white font-bold flex items-center gap-2 border-b border-white/5 pb-2.5">
            <UserPlus className="w-5 h-5 text-[#C5A059]" />
            <span>Employee KPI Rosters & check-in rosters</span>
          </h3>

          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Current Active Roster</span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {employees.map(emp => (
                <div key={emp.id} className="p-4 bg-[#0F0F0F] rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between font-mono">
                    <strong className="text-white text-xs block">{emp.name}</strong>
                    <span className="text-[10px] text-zinc-500">{emp.id}</span>
                  </div>
                  <p className="text-[#C5A059] text-xs">{emp.role}</p>
                  <p className="text-stone-400 text-[11px]">{emp.attendance}</p>
                  <div className="text-[10px] text-stone-500 border-t border-white/5 pt-1.5 flex justify-between">
                    <span>Wage: {formatPKR(emp.monthSalPKR)}</span>
                    <span className="text-zinc-350">{emp.rating}</span>
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

export default EnterpriseEcosystem;
