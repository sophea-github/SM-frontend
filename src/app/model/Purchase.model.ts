import {ChangeRateModel} from "./Change-Rate.model";
import {EmployeeModel} from "./Employee.model";
import {UomDetailModel} from "./Uom.model";
import {PurchaseDetailModel} from "./PurchaseDetail.model";
import {supplierModel} from "./Supplier.model";
import {ProductModel} from "./Product.model";

export interface PurchaseModel{
  id: any,
  code: string,
  product:ProductModel,
  order_date: Date,
  employee_id: EmployeeModel,
  supplier_id: supplierModel,
  supplier_company: String,
  itemVariantUom: UomDetailModel,
  changeRate: ChangeRateModel,
  create_by: string,
  purchaseOrderDetail: PurchaseDetailModel,
  employeeName: string,
  changeRate_id: number,
  changeRateName: string
  supplier: supplierModel,
}
