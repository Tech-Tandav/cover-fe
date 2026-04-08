// --------------------------
// TimeSlot API and frontend
// --------------------------

export interface IBookingDetailApi{
  customer_name:string;
  customer_phone:string;
  id:string;
  status:string;
  created_at:string
}

export interface ITimeSlotApi {
  id: number;
  futsal: number;
  futsal_name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  status: "available" | "booked" | "in_queue";
  day_name: string;
  booking: IBookingDetailApi[] 
}

export interface IBookingDetail{
  customerName:string;
  customerPhone:string;
  id:string;
  status:string;
  created_at:string
}

export interface ITimeSlot {
  id: number;
  futsalId: number;
  futsalName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  status: "available" | "booked" | "in_queue";
  dayName: string;
  booking: IBookingDetail[] 
}