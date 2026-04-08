import { timeSlotApiRepository } from "@/domain/apiRepository/timeSlotApiRepository";
import { ITimeSlotApi, ITimeSlot, IBookingDetailApi, IBookingDetail } from "@/domain/interfaces/timeSlotInterface";
import { mapTimeSlot } from "@/domain/mappers/timeSlotMapper";

export const timeSlotService = {
  // getTimeSlots: async (): Promise<ITimeSlot[]> => {
  //   try {
  //     const response = await timeSlotApiRepository.getTimeSlots();
  //     if (response?.status !== 200) return [];
  //     const rawData: ITimeSlotApi[] = response.data;
  //     return rawData.map(mapTimeSlot);
  //   } catch (e) {
  //     console.error("Failed to get time slots: ", e);
  //     return [];
  //   }
  // },

  retrieveTimeSlot: async (id: string): Promise<ITimeSlot | null> => {
    try {
      const response = await timeSlotApiRepository.retrieveTimeSlot(id);
      return mapTimeSlot(response.data);
    } catch (e) {
      console.error("Failed to retrieve time slot: ", e);
      throw null
    }
  },

  createTimeSlot: async (data: any) => {
    try {
      const response = await timeSlotApiRepository.createTimeSlot(data);
      return response.data;
    } catch (e) {
      console.error("Failed to create time slot: ", e);
    }
  },

  updateTimeSlot: async (id: number, data: any) => {
    try {
      const response = await timeSlotApiRepository.updateTimeSlot(id, data);
      return response.data;
    } catch (e) {
      console.error("Failed to update time slot: ", e);
    }
  },

  deleteTimeSlot: async (id: number) => {
    try {
      await timeSlotApiRepository.deleteTimeSlot(id);
    } catch (e) {
      console.error("Failed to delete time slot: ", e);
    }
  },
  filterTimeSlotByFutsalID: async (id: string): Promise<ITimeSlot[]> => {
    try {
      const response = await timeSlotApiRepository.filterTimeSlotByFutsalID(id);
      if (response?.status !== 200) return [];
      const rawData: ITimeSlotApi[] = response.data;
      return  rawData.map((slot: ITimeSlotApi): ITimeSlot => ({
        id: slot.id,
        futsalId: slot.futsal,
        futsalName: slot.futsal_name,
        dayOfWeek: slot.day_of_week,
        startTime: slot.start_time,
        endTime: slot.end_time,
        status: slot.status,
        dayName: slot.day_name,
        booking: slot.booking.map((book:IBookingDetailApi): IBookingDetail=>({
          customerName:book.customer_name,
          id:book.id,
          customerPhone:book.customer_phone,
          status:book.status,
          created_at:book.created_at
        }))
      }))
    } catch (e) {
      console.error("Failed to get time slots: ", e);
      return [];
    }
  },

};
