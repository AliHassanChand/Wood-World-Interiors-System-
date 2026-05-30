/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BranchName, FileCategory, StockItem, Order, StockTransfer, ManagerApproval, StaffActivity } from "./types";

export const initialStockItems: StockItem[] = [
  {
    id: "ST-001",
    name: "Emperor Solid Walnut Dining Set",
    category: FileCategory.Dining,
    woodType: "Premium Seasoned Walnut",
    pricePKR: 440000,
    stockByBranch: {
      [BranchName.KarachiShowroom]: 1, // Alert: Karachi has only 1!
      [BranchName.LahoreWarehouse]: 12, // Rich in stock
      [BranchName.IslamabadShowroom]: 2 // Alert: Islamabad has 2!
    },
    alertThreshold: 3,
    dimensions: "96\" L x 42\" W x 30\" H (with 8 Carved Chairs)",
    leadTimeDays: 14,
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "ST-002",
    name: "Crown Hand-Carved Rosewood Canopy Bed",
    category: FileCategory.Bed,
    woodType: "Genuine Sheesham (Rosewood)",
    pricePKR: 580000,
    stockByBranch: {
      [BranchName.KarachiShowroom]: 3,
      [BranchName.LahoreWarehouse]: 8,
      [BranchName.IslamabadShowroom]: 1 // Alert: Low stock in Islamabad
    },
    alertThreshold: 3,
    dimensions: "King Size (80\" W x 84\" L x 88\" H)",
    leadTimeDays: 21,
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "ST-003",
    name: "Royal Chesterfield Velvet Lounge",
    category: FileCategory.Sofa,
    woodType: "Solid Acacia & Velvet Fabric",
    pricePKR: 290000,
    stockByBranch: {
      [BranchName.KarachiShowroom]: 1, // Alert: Low in Karachi!
      [BranchName.LahoreWarehouse]: 14,
      [BranchName.IslamabadShowroom]: 0 // Out of Stock!
    },
    alertThreshold: 4,
    dimensions: "3-Seater (92\" W x 38\" D x 32\" H)",
    leadTimeDays: 10,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "ST-004",
    name: "Heritage Mughal-Style Carved Console",
    category: FileCategory.Living,
    woodType: "Antiqued Teak & Rosewood",
    pricePKR: 185000,
    stockByBranch: {
      [BranchName.KarachiShowroom]: 5,
      [BranchName.LahoreWarehouse]: 9,
      [BranchName.IslamabadShowroom]: 4
    },
    alertThreshold: 2,
    dimensions: "60\" W x 18\" D x 36\" H",
    leadTimeDays: 8,
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "ST-005",
    name: "Imperial Oak Executive Credenza",
    category: FileCategory.Office,
    woodType: "Selected Red Oak Block",
    pricePKR: 245000,
    stockByBranch: {
      [BranchName.KarachiShowroom]: 0, // Alert: Out of stock!
      [BranchName.LahoreWarehouse]: 7,
      [BranchName.IslamabadShowroom]: 2
    },
    alertThreshold: 2,
    dimensions: "72\" W x 22\" D x 34\" H",
    leadTimeDays: 12,
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=400"
  }
];

export const initialOrders: Order[] = [
  {
    id: "ORD-9462",
    customerName: "Dr. Sarfraz Ahmed",
    customerPhone: "0300-1234567",
    branch: BranchName.KarachiShowroom,
    items: [
      { itemId: "ST-001", quantity: 1, agreedPricePKR: 440000 }
    ],
    totalPKR: 440000,
    orderDate: "2026-05-24",
    expectedDeliveryDate: "2026-06-07",
    status: "In Preparation",
    paymentType: "Installments",
    installmentPlan: {
      id: "INS-501",
      totalOrderPricePKR: 440000,
      initialDepositPKR: 200000,
      remainingBalancePKR: 240000,
      installmentsCount: 3,
      payments: [
        { id: "P-501-1", amountPKR: 80000, datePaid: "2026-05-24", status: "Paid" },
        { id: "P-501-2", amountPKR: 80000, datePaid: "", status: "Pending" }, // Due June 24
        { id: "P-501-3", amountPKR: 80000, datePaid: "", status: "Pending" }  // Due July 24
      ],
      reminderSent: false
    }
  },
  {
    id: "ORD-9463",
    customerName: "Begum Zeenat Fatima",
    customerPhone: "0321-9876543",
    branch: BranchName.KarachiShowroom,
    items: [
      { itemId: "ST-003", quantity: 2, agreedPricePKR: 290000 } // Total 580k
    ],
    totalPKR: 580000,
    orderDate: "2026-05-27",
    expectedDeliveryDate: "2026-06-10",
    status: "Transfer Needed", // Karachi has only 1 in stock, needs a warehouse transfer!
    paymentType: "Cash",
    approvedBy: "N/A"
  },
  {
    id: "ORD-9464",
    customerName: "Imran Khan Niazi",
    customerPhone: "0333-5551122",
    branch: BranchName.IslamabadShowroom,
    items: [
      { itemId: "ST-002", quantity: 1, agreedPricePKR: 580000 }
    ],
    totalPKR: 580000,
    orderDate: "2026-05-28",
    expectedDeliveryDate: "2026-06-18",
    status: "Pending Approval", // Waiting for head manager approval for special 5% discount
    paymentType: "Bank Transfer"
  },
  {
    id: "ORD-9465",
    customerName: "Chaudhary Shujaat",
    customerPhone: "0312-3214560",
    branch: BranchName.IslamabadShowroom,
    items: [
      { itemId: "ST-004", quantity: 1, agreedPricePKR: 185000 }
    ],
    totalPKR: 185000,
    orderDate: "2026-05-29",
    expectedDeliveryDate: "2026-06-05",
    status: "Delivered",
    paymentType: "Cash"
  }
];

export const initialTransfers: StockTransfer[] = [
  {
    id: "TR-2001",
    itemId: "ST-003",
    itemName: "Royal Chesterfield Velvet Lounge",
    quantity: 4,
    source: BranchName.LahoreWarehouse,
    destination: BranchName.KarachiShowroom,
    status: "In Transit",
    requestedBy: "Sohail Shah (Karachi Showroom Manager)",
    requestDate: "2026-05-26"
  }
];

export const initialApprovals: ManagerApproval[] = [
  {
    id: "APP-3001",
    type: "Discount Request",
    branch: BranchName.IslamabadShowroom,
    details: "Special 10% Cash discount request on Rosewood Canopy Bed for Mr. Imran Khan.",
    requestedBy: "Bilal Dar (Islamabad Showroom Manager)",
    amountPKR: 58000,
    itemId: "ST-002",
    qty: 1,
    status: "Pending",
    dateCreated: "2026-05-28",
    relatedId: "ORD-9464"
  },
  {
    id: "APP-3002",
    type: "Stock Transfer",
    branch: BranchName.KarachiShowroom,
    details: "Urgent transfer request for 2 Emperor Solid Walnut Dining Sets from Lahore Central Warehouse to Karachi Showroom.",
    requestedBy: "Sohail Shah (Karachi Manager)",
    itemId: "ST-001",
    qty: 2,
    status: "Pending",
    dateCreated: "2026-05-29"
  }
];

export const initialActivities: StaffActivity[] = [
  {
    id: "ACT-001",
    timestamp: "2026-05-29T10:14:00Z",
    staffName: "Sohail Shah",
    branch: BranchName.KarachiShowroom,
    action: "Dispatched Order ORD-9461 to warehouse delivery logs",
    status: "Success"
  },
  {
    id: "ACT-002",
    timestamp: "2026-05-29T11:05:00Z",
    staffName: "Bilal Dar",
    branch: BranchName.IslamabadShowroom,
    action: "Requested manual 10% discount check for Customer Imran Khan",
    status: "Pending"
  },
  {
    id: "ACT-003",
    timestamp: "2026-05-29T12:45:00Z",
    staffName: "Azeem Butt",
    branch: BranchName.LahoreWarehouse,
    action: "Updated Stock count for Walnut Dining set (+12 incoming)",
    status: "Success"
  }
];
