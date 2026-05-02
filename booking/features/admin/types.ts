export type AdminStats = {
  totalUsers: number;
  totalProviders: number;
  totalAppointments: number;
  newUsersThisWeek: number;
  newProvidersThisWeek: number;
  appointmentsToday: number;
};

export type RecentBooking = {
  id: string;
  customer_name: string;
  service_name: string;
  provider_name: string;
  slot_date: string;
  start_time: string;
  status: string;
};

export type AdminUser = {
  id: string;
  full_name: string;
  email: string;
  role: "customer" | "organiser" | "provider" | "admin";
  is_active: number;
  is_verified: number;
  created_at: number;
};
