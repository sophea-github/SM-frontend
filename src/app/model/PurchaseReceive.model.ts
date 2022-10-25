import {ChangeRateModel} from "./Change-Rate.model";
import {EmployeeModel} from "./Employee.model";
import {UomDetailModel} from "./Uom.model";
import {PurchaseDetailModel} from "./PurchaseDetail.model";
import {supplierModel} from "./Supplier.model";
import {PurchaseModel} from "./Purchase.model";

export interface PurchaseReceiveModel{
  id: any,
  code: String,
  order_date: Date,
  receive_date: Date,
  employee_id: EmployeeModel,
  supplier_id: supplierModel,
  totalItem: number,
  supplier_company: String,
  itemVariantUom: UomDetailModel,
  changeRate: ChangeRateModel,
  create_by: string,
  purchaseOrderDetail: PurchaseDetailModel,
  employeeName: string,
  changeRate_id: number,
  changeRateName: string,
  purchase_order: PurchaseModel,
  supplier: supplierModel
}
