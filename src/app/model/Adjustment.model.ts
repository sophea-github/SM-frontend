import {Validators} from "@angular/forms";
import {ProductModel} from "./Product.model";
import {Item_VariantModel} from "./Item_Variant.model";
import {adjustmentTypeModel} from "./adjustmentType.model";
import {EmployeeModel} from "./Employee.model";

export interface AdjustmentModel{
  id:any,
  adjustmentDate: Date,
  create_by: string,
  description: string,
  adjustmentType: adjustmentTypeModel,
  adjustmentDetail: adjustmentDetailModel
}

export interface adjustmentDetailModel{
  id: any,
  product: ProductModel,
  qty: number,
  create_by: string,
  update_by: string,
  item_variant_id: Item_VariantModel,
  employee: EmployeeModel,
  // employee_id: number,
  description: string,
}



