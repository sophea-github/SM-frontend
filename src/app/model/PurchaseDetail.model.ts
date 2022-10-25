import {ProductModel} from "./Product.model";
import {supplierModel} from "./Supplier.model";

export interface PurchaseDetailModel{
  id: number,
  qty: any,
  amt: any,
  price: any,
  active: string,
  create_by: string,
  description: string,
  product: ProductModel,
  supplier: supplierModel
  code: string
}
