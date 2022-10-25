import {UomModel} from "./Uom.model";
import {Item_VariantModel} from "./Item_Variant.model";
import {PurchaseDetailModel} from "./PurchaseDetail.model";


export interface ProductModel{
  id: any,
  code: string,
  name: string,
  category_id: number,
  item_variant_id: number,
  qty: number,
  amt: number,
  price: any,
  photo: string,
  active: string,
  stock_alert: string,
  create_by: string,
  description: string,
  itemVariantUom?:Item_VariantModel;
  purchaseReceiveDetail: PurchaseDetailModel
}
