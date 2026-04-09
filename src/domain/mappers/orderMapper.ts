import {
  IOrder,
  IOrderApi,
  IOrderItem,
  IOrderItemApi,
} from "../interfaces/orderInterface";

const toNum = (v: number | string | null | undefined): number => {
  if (v === null || v === undefined || v === "") return 0;
  return typeof v === "number" ? v : Number(v);
};

const mapOrderItem = (api: IOrderItemApi): IOrderItem => ({
  id: String(api.id),
  productId: String(api.product_id),
  productName: api.product_name,
  productImage: api.product_image,
  unitPrice: toNum(api.unit_price),
  quantity: api.quantity,
  subtotal: toNum(api.subtotal),
});

export const mapOrder = (api: IOrderApi): IOrder => ({
  id: String(api.id),
  orderNumber: api.order_number,
  customerName: api.customer_name,
  customerPhone: api.customer_phone,
  customerEmail: api.customer_email ?? "",
  shippingAddress: api.shipping_address,
  shippingCity: api.shipping_city,
  items: (api.items ?? []).map(mapOrderItem),
  itemCount: api.item_count ?? 0,
  subtotal: toNum(api.subtotal),
  shipping: toNum(api.shipping),
  total: toNum(api.total),
  status: api.status,
  paymentMethod: api.payment_method,
  createdAt: api.created_at,
});
