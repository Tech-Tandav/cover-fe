
// --------------------------
// Booking API and frontend
// --------------------------
export interface IBookingApi {
  id: string;
  futsal_name: string;
  date: string;
  start_time: string;
  end_time: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  status: "pending" | "confirmed" | "rejected";
  created_at: string;
}

export interface IBooking {
  id: string;
  futsalName: string;
  date: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: "pending" | "confirmed" | "rejected";
  createdAt: string;
}