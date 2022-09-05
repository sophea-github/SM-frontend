import {ProductModel} from "./Product.model";

export interface PurchaseDetailModel{
  qty: any,
  amt: any,
  price: any,
  active: string,
  create_by: string,
  description: string,
  product: ProductModel,
}
