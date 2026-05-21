// ─── Building ────────────────────────────────────────────────────────────────

export type BuildingType =
  | "office"
  | "retail"
  | "logistics"
  | "mixed-use"
  | "residential";

export type EnergyClass = "A" | "A+" | "B" | "C" | "D" | "E" | "F";

export type ProjectStatus =
  | "feasibility"
  | "design"
  | "permitting"
  | "construction"
  | "refurbishment"
  | "completed"
  | "overdue";

export interface Building {
  id: string;
  name: string;
  city: string;
  country: string;
  type: BuildingType;
  portfolioManagerId: string;
  objectManagerId: string;
  energyClass: EnergyClass;
  totalAreaSqm: number;
  refurbishmentCostEur: number;
  projectStartYear: number;
  expectedClosingYear: number;
  projectStatus: ProjectStatus;
}

// ─── Report ──────────────────────────────────────────────────────────────────

export type ReportFormat = "PDF" | "Excel";

export type ReportScope =
  | "portfolio"
  | "building"
  | "financial"
  | "energy"
  | "compliance";

export type ReportStatus = "generating" | "ready" | "failed" | "archived";

export interface Report {
  id: string;
  title: string;
  format: ReportFormat;
  scope: ReportScope;
  relatedBuildingIds: string[];
  generatedAt: string; // ISO 8601
  generatedByUserId: string;
  status: ReportStatus;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotificationType = "report" | "assignment" | "project";

export type NotificationStatus = "unread" | "read";

export type NotificationPriority = "low" | "medium" | "high";

export type NotificationCategory = "action_required" | "new_reports" | "fyi";

export type NotificationSubtype =
  | "past_closing_date"
  | "phase_transition"
  | "parameter_change"
  | "report_ready"
  | "object_assigned";

export interface ValueChange {
  label: string;
  from: string;
  to: string;
}

export type NotificationStatusBadge = "new" | "in_progress" | "resolved";

export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  subtype: NotificationSubtype;
  statusBadge: NotificationStatusBadge;
  title: string;
  description: string;
  entityName: string;
  entityId: string;
  relatedEntityId: string;
  relatedEntityName: string;
  note?: string;
  pinned?: boolean;
  expectedCloseDate?: string; // YYYY-MM-DD
  clearCondition?: string;
  valueChange?: ValueChange;
  createdAt: string; // ISO 8601
  status: NotificationStatus;
  priority: NotificationPriority;
  ctaLabel: string;
}

// ─── User / Manager ───────────────────────────────────────────────────────────

export type UserRole = "portfolio_manager" | "object_manager" | "admin" | "viewer";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone?: string;
  department?: string;
}
