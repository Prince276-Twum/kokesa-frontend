interface Service {
  id: number;
  service_name: string;
  type: string;
  type_label: string;
  service_group: string;
  price: string;
  duration_hours: number;
  duration_minutes: number;
  is_starting_price: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpcomingAppointmentType {
  id: number;
  client_name: string;
  service: Service;
  service_provider: string;
  service_name: string;
  duration_minutes: number;
  start_time: string;
  end_time: string;
  timezone: string;
  status: string;
  created_at: string;
  updated_at: string;
  price: string;
  payment_status: "paid" | "unpaid";
  payment_method: string | null;
  notes: string | null;
  location: string;
  client: number;
  business: number;
  local_start_time: string;
  local_end_time: string;
  local_timezone: string;
  intended_start_time: string;
  intended_end_time: string;
  intended_timezone: string;
  client_avatar: string;
  minutes_until_appointment: number;
}

export interface TodayAppointmentType {
  id: number;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  service_name: string;
  client_name: string;
  client_email: string;
  status: string;
  notes: string | null;
  price: number;
  payment_status: string;
  service_provider: string;
  location: string;
  client_avatar: string;
  minutes_until_appointment: number;
  time_until_formatted: string;
  hours_until: number;
  remaining_minutes: number;
}
