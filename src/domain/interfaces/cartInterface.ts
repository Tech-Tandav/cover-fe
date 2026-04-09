import { IProduct } from "./productInterface";

export interface ICartItem {
  product: IProduct;
  /** Selected color, if the product has colors defined. */
  color: string;
  /** Selected size, if the product has sizes defined. */
  size: string;
  quantity: number;
}

export interface ICartSummary {
  items: ICartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}
