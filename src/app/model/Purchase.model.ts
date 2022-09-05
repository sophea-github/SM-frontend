import {ChangeRateModel} from "./Change-Rate.model";
import {EmployeeModel} from "./Employee.model";
import {UomDetailModel} from "./Uom.model";
import {PurchaseDetailModel} from "./PurchaseDetail.model";

export interface PurchaseModel{
  id: any,
  employee_id: EmployeeModel,
  item_variant_id: UomDetailModel,
  changeRate: ChangeRateModel,
  create_by: string,
  purchaseOrderDetail: PurchaseDetailModel
}
