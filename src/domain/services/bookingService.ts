import { bookingApiRepository } from "@/domain/apiRepository/bookingApiRepository";
import { IBookingApi, IBooking } from "@/domain/interfaces/bookingInterface";
import { mapBooking } from "../mappers/bookingMapper";
import { IResponseApi } from "../interfaces/apiResponse";


export const bookingService = {
  getBookings: async (page:number): Promise<IResponseApi<IBooking[]>> => {
    try {
      const response = await bookingApiRepository.getBookings(page);
      const apiResponse = response.data;
      const mapData = apiResponse.results.map(mapBooking);
      return {
        ...apiResponse,
        results:mapData
      }
    } catch (e) {
      console.error("Failed to get bookings: ", e);
      throw e;
    }
  },

  retrieveBooking: async (id: string): Promise<IBooking | null> => {
    try {
      const response = await bookingApiRepository.retrieveBooking(id);
      if (response?.status !== 200) return null;
      return mapBooking(response.data);
    } catch (e) {
      console.error("Failed to retrieve booking: ", e);
      throw e
    }
  },

  createBooking: async (data: any) => {
    try {
      const response = await bookingApiRepository.createBooking(data);
      return response.data;
    } catch (e) {
      console.error("Failed to create booking: ", e);
      throw e
    }
  },

  updateBookingStatus: async (id: string, status: any) => {
    try {
      const response = await bookingApiRepository.updateBookingStatus(id, status );
      return mapBooking(response.data);
    } catch (e) {
      console.error("Failed to update booking status: ", e);
      throw e
    }
  },

  deleteBooking: async (id: number) => {
    try {
      await bookingApiRepository.deleteBooking(id);
    } catch (e) {
      console.error("Failed to delete booking: ", e);
    }
  },
};
