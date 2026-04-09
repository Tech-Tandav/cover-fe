export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "esewa" | "khalti" | "bank";

export interface IOrderItemApi {
  id: number | string;
  product_id: number | string;
  product_name: string;
  product_image: string;
  variant_color: string;
  variant_size: string;
  unit_price: number | string;
  quantity: number;
  subtotal: number | string;
}

export interface IOrderApi {
  id: number | string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: string;
  shipping_city: string;
  items: IOrderItemApi[];
  item_count: number;
  subtotal: number | string;
  shipping: number | string;
  total: number | string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  created_at: string;
}

export interface IOrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantColor: string;
  variantSize: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCity: string;
  items: IOrderItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
}
