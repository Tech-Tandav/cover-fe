import {
  IOrder,
  IOrderApi,
  OrderStatus,
  PaymentMethod,
} from "../interfaces/orderInterface";
import { ICartItem } from "../interfaces/cartInterface";
import { IPaginatedApi } from "../interfaces/apiResponse";
import { orderApiRepository } from "../apiRepository/orderApiRepository";
import { mapOrder } from "../mappers/orderMapper";

export interface ICheckoutPayload {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCity: string;
  paymentMethod: PaymentMethod;
  items: ICartItem[];
  shipping: number;
}

const unwrapList = (data: unknown): IOrderApi[] => {
  if (Array.isArray(data)) return data as IOrderApi[];
  return ((data as IPaginatedApi<IOrderApi[]>).results ?? []) as IOrderApi[];
};

export const orderService = {
  getOrders: async (): Promise<IOrder[]> => {
    try {
      const res = await orderApiRepository.list();
      return unwrapList(res.data).map(mapOrder);
    } catch (e) {
      console.error("Failed to get orders:", e);
      return [];
    }
  },

  retrieveOrder: async (id: string): Promise<IOrder | null> => {
    try {
      const res = await orderApiRepository.retrieve(id);
      return mapOrder(res.data as IOrderApi);
    } catch (e) {
      console.error("Failed to retrieve order:", e);
      return null;
    }
  },

  createOrder: async (payload: ICheckoutPayload): Promise<IOrder> => {
    const res = await orderApiRepository.create({
      customer_name: payload.customerName,
      customer_phone: payload.customerPhone,
      customer_email: payload.customerEmail,
      shipping_address: payload.shippingAddress,
      shipping_city: payload.shippingCity,
      shipping: payload.shipping,
      payment_method: payload.paymentMethod,
      items: payload.items.map((i) => ({
        product_id: i.product.id,
        color: i.color ?? "",
        size: i.size ?? "",
        quantity: i.quantity,
      })),
    });
    return mapOrder(res.data as IOrderApi);
  },

  updateOrderStatus: async (
    id: string,
    status: OrderStatus
  ): Promise<IOrder | null> => {
    try {
      const res = await orderApiRepository.setStatus(id, status);
      return mapOrder(res.data as IOrderApi);
    } catch (e) {
      console.error("Failed to update order status:", e);
      return null;
    }
  },
};
