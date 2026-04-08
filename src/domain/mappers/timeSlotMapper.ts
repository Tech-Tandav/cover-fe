import {
  ITimeSlotApi,
  ITimeSlot,
} from "../interfaces/timeSlotInterface";


// TimeSlot mapping
export const mapTimeSlot = (slot: ITimeSlotApi): ITimeSlot => ({
  id: slot.id,
  futsalId: slot.futsal,
  futsalName: slot.futsal_name,
  dayOfWeek: slot.day_of_week,
  startTime: slot.start_time,
  endTime: slot.end_time,
  status: slot.status,
  dayName: slot.day_name,
  booking : slot.booking.map((book)=>({
    customerName:book.customer_name,
    id:book.id,
    customerPhone:book.customer_phone,
    status:book.status,
    created_at:book.created_at
  }))
});

