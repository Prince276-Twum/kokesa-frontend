// Common type efinitions for the appointment system

export interface AppointmentFilter {
  status?: string[];
  serviceProvider?: string[];
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
  paymentStatus?: string[];
}

export type AppointmentStatus =
  | "accept"
  | "pending"
  | "reschedule"
  | "cancel"
  | "complete";

export type PaymentStatus = "paid" | "unpaid" | "partially_paid" | "refunded";

export interface AppointmentView {
  id: string;
  label: string;
  icon: string;
}
