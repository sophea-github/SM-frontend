import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../../../service/Product.service";
import {ProductModel} from "../../../../model/Product.model";
import {AdjustmentTypeService} from "../../../../service/adjustmentType.service";
import {adjustmentTypeModel} from "../../../../model/adjustmentType.model";
import {AdjustmentService} from "../../../../service/Adjustment.service";
import {AdjustmentModel} from "../../../../model/Adjustment.model";
import {AuthService} from "../../../../service/Auth.service";
import {NgToastService} from "ng-angular-popup";
import {EmployeeService} from "../../../../service/employee.service";
import {EmployeeModel} from "../../../../model/Employee.model";

@Component({
  selector: 'app-adjustment-stock',
  templateUrl: './adjustment-stock.component.html',
  styleUrls: ['./adjustment-stock.component.scss']
})
export class AdjustmentStockComponent implements OnInit {

  f!: FormGroup
  fa!: FormGroup
  products: ProductModel[]=[]
  adjustments: AdjustmentModel[]=[]
  adjustmentType: adjustmentTypeModel[]=[]
  employees: EmployeeModel[]=[]
  userProfile: any;

  constructor(
    protected fb: FormBuilder,
    protected productService: ProductService,
    protected adjustmentTypeService:AdjustmentTypeService,
    protected adjustmentService: AdjustmentService,
    private authService: AuthService,
    private toast: NgToastService,
    protected employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getAdjustmentType()
    this.getProduct()
    this.getEmployee()
    this.userProfile=this.authService.getLoginUser().username;
  }

  initForm(){
    this.f = this.fb.group({
      adjustmentDate: [null],
      create_by: [null],
      description: [null],
      adjustmentType_id: [null],
      adjustmentDetail:this.fb.array([]),
    })
  }

  get ajd(){
    return this.f.controls["adjustmentDetail"] as FormArray
  }

  addNewRow(){
    this.fa = this.fb.group({
      id: null,
      product: [null, Validators.required],
      qty: 0,
      employee: [null],
      create_by: this.userProfile,
      update_by: this.userProfile,
      item_variant_id: [null, Validators.required],
      description: null,
    });
    this.ajd.push(this.fa)
  }

  deleteRow(Index: number) {
    this.ajd.removeAt(Index);
  }

  getProduct(){
    this.productService.getObj().subscribe(res=>{
      this.products = res.result;
      this.products = this.products.map((divition: any) => {
        return {
          ...divition,
          displayLabel: divition.name + ' ' + ' - '+divition.itemVariantUom.item_variant_name
        };
      });
    })
  }
  loadUoM(product:ProductModel, index:number) {
    const { itemVariantUom } = product;
    this.ajd.at(index).patchValue({
      item_variant_id: itemVariantUom?.item_variant_name,
      description:itemVariantUom?.description
    });
  }
  getEmployee(){
    this.employeeService.getData().subscribe(res=>{
      this.employees = res.result
      // console.log(this.employees)
    })
  }

  getAdjustmentType(){
    this.adjustmentTypeService.getObj().subscribe(res=>{
      this.adjustmentType  = res.result
    })
  }

  save(adjustment: AdjustmentModel){
    adjustment.create_by = this.userProfile
    this.adjustmentService.saveAdjustment(adjustment).subscribe(res=>{
     let code = res.result
      if(code.total == 501){
        this.toast.error({summary: 'can not be deduct stock !!', detail: 'Not Available !!', duration: 5000});
      }else{
        this.toast.success({summary: 'Confirmed', detail: 'Record Saved Success !!', duration: 5000});
      }
    })
  }

}
