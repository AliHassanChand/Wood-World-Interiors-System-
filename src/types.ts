/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum BranchName {
  KarachiShowroom = "Karachi Showroom",
  LahoreWarehouse = "Lahore Central Warehouse",
  IslamabadShowroom = "Islamabad Showroom"
}

export enum FileCategory {
  Sofa = "Sofa",
  Dining = "Dining",
  Bed = "Bed Set",
  Living = "Living",
  Office = "Office"
}

export interface StockItem {
  id: string;
  name: string;
  category: FileCategory;
  woodType: string;
  pricePKR: number;
  stockByBranch: Record<BranchName, number>;
  alertThreshold: number;
  image: string;
  dimensions: string;
  leadTimeDays: number;
}

export interface OrderItem {
  itemId: string;
  quantity: number;
  agreedPricePKR: number;
}

export interface InstallmentPayment {
  id: string;
  amountPKR: number;
  datePaid: string;
  status: "Paid" | "Pending" | "Overdue";
}

export interface InstallmentPlan {
  id: string;
  totalOrderPricePKR: number;
  initialDepositPKR: number;
  remainingBalancePKR: number;
  installmentsCount: number;
  payments: InstallmentPayment[];
  reminderSent: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  branch: BranchName;
  items: OrderItem[];
  totalPKR: number;
  orderDate: string;
  expectedDeliveryDate: string;
  status: "Draft" | "Pending Approval" | "Transfer Needed" | "In Preparation" | "Dispatched" | "Delivered";
  paymentType: "Cash" | "Bank Transfer" | "Installments";
  installmentPlan?: InstallmentPlan;
  approvedBy?: string;
}

export interface StockTransfer {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  source: BranchName;
  destination: BranchName;
  status: "Pending Approval" | "Approved" | "In Transit" | "Completed";
  requestedBy: string;
  requestDate: string;
}

export interface ManagerApproval {
  id: string;
  type: "Discount Request" | "Stock Transfer" | "Inventory Write-Off";
  branch: BranchName;
  details: string;
  requestedBy: string;
  amountPKR?: number;
  itemId?: string;
  qty?: number;
  status: "Pending" | "Approved" | "Declined";
  dateCreated: string;
  relatedId?: string; // Links to transfer, order etc.
}

export interface AIInsight {
  id: string;
  priority: "high" | "medium" | "low";
  category: "Stock" | "Revenue" | "Delivery" | "Finance";
  message: string;
  hint: string;
  actionLabel?: string;
  targetRef?: {
    tab: string;
    itemId?: string;
    branch?: BranchName;
  };
}

export interface StaffActivity {
  id: string;
  timestamp: string;
  staffName: string;
  branch: BranchName;
  action: string;
  status: "Success" | "Pending" | "Warning";
}
