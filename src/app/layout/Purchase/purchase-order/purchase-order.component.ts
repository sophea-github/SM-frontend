import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {PurchaseService} from "../../../service/Purchase.service";
import {UomService} from "../../../service/Uom.service";
import {ProductService} from "../../../service/Product.service";
import {EmployeeService} from "../../../service/employee.service";
import {NgToastService} from "ng-angular-popup";
import {analyticsDisabled} from "@angular/cli/src/utilities/environment-options";
import {ProductModel} from "../../../model/Product.model";
import {ChangeRateService} from "../../../service/Change-Rate.service";
import {ChangeRateModel} from "../../../model/Change-Rate.model";
import {EmployeeModel} from "../../../model/Employee.model";
import {UomDetailModel} from "../../../model/Uom.model";
import {AuthService} from "../../../service/Auth.service";
import {PurchaseModel} from "../../../model/Purchase.model";

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {
  f!: FormGroup
  uomDetails: UomDetailModel[]=[]
  products: ProductModel[]=[];
  employees: EmployeeModel[]=[]
  changeRates: ChangeRateModel[]=[]
  userProfile: any
  purchases: PurchaseModel[]=[]

  constructor(
    private purchaseService: PurchaseService,
    private fb: FormBuilder,
    private uomService: UomService,
    private productService: ProductService,
    private employeeService: EmployeeService,
    private toast: NgToastService,
    private changeRateService: ChangeRateService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getUomDetail()
    this.getProduct()
    this.getEmployee()
    this.getChangeRate()
    this.userProfile=this.authService.getLoginUser().username;
  }

  initForm() {
    this.f = this.fb.group({
      id: null,
      order_date: null,
      changeRate_id: [null,Validators.required],
      employee_id: [null, Validators.required],
      create_by: this.userProfile,
      description: null,
      pod:this.fb.array([])
    });
  }

  get pod(){
    return this.f.controls["pod"] as FormArray
  }

  addNewRow(){
    const control = this.fb.group({
      product: [null, Validators.required],
      qty: null,
      price:null,
      create_by: null,
      item_variant_id: [null, Validators.required],
      description: null
    })
    this.pod.push(control)
  }

  deleteRow(Index: number) {
    this.pod.removeAt(Index);
  }

  loadUom(product:ProductModel,index:number) {
    const { itemVariantUom } = product;
    this.pod.at(index).patchValue({
      item_variant_id: itemVariantUom?.item_variant_name,
      description:itemVariantUom?.description
    });
  }

  getUomDetail() {
    this.uomService.getUomDetail().subscribe(res => {
      this.uomDetails = res.result
    })
  }

  getProduct(){
    this.productService.getObj().subscribe(res=>{
      this.products = res.result;
      this.products = this.products.map((divition: any) => {
        return {
          ...divition,
          displayLabel: divition.name + ' ' + '<'+divition.code+'>'
        };
      });
    })
  }

  getChangeRate(){
    this.changeRateService.getData().subscribe(res=>{
      this.changeRates = res.result
    });
  }

  getEmployee(){
    this.employeeService.getData().subscribe(res=>{
      this.employees = res.result
    })
  }

  saveObject(purchase: PurchaseModel){
    purchase.create_by = this.userProfile
    this.purchaseService.saveObj(purchase).subscribe(res=>{
      // res.result.create_by = this.userProfile
      this.toast.success({summary: 'Confirmed', detail: 'Record Saved Success !!', duration: 5000});
    })
  }

}
