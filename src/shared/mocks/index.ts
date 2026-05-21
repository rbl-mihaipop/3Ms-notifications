// Re-export all TypeScript types
export type {
  Building,
  BuildingType,
  EnergyClass,
  ProjectStatus,
  Report,
  ReportFormat,
  ReportScope,
  ReportStatus,
  Notification,
  NotificationType,
  NotificationStatus,
  NotificationPriority,
  User,
  UserRole,
} from "../types/mockDataTypes";

// Import mock data
import buildingsData from "./buildings.json";
import reportsData from "./reports.json";
import notificationsData from "./notifications.json";
import usersData from "./users.json";

// Import types for casting
import type {
  Building,
  Report,
  Notification,
  User,
} from "../types/mockDataTypes";

// Export typed mock data
export const mockBuildings: Building[] = buildingsData as Building[];
export const mockReports: Report[] = reportsData as Report[];
export const mockNotifications: Notification[] = notificationsData as Notification[];
export const mockUsers: User[] = usersData as User[];
