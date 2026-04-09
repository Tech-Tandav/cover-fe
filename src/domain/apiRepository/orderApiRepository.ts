import { instance } from "@/lib/axios/axiosInstance";
import { OrderStatus } from "@/domain/interfaces/orderInterface";

export interface IOrderCreatePayload {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: string;
  shipping_city: string;
  shipping: number;
  payment_method: "cod" | "esewa" | "khalti" | "bank";
  items: {
    product_id: string | number;
    color: string;
    size: string;
    quantity: number;
  }[];
}

export const orderApiRepository = {
  list: () => instance.get("orders/orders/"),
  retrieve: (id: string | number) => instance.get(`orders/orders/${id}/`),
  create: (payload: IOrderCreatePayload) =>
    instance.post("orders/orders/", payload),
  setStatus: (id: string | number, status: OrderStatus) =>
    instance.patch(`orders/orders/${id}/status/`, { status }),
};
