import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {PurchaseService} from "../../../service/Purchase.service";
import {UomService} from "../../../service/Uom.service";
import {ProductService} from "../../../service/Product.service";
import {EmployeeService} from "../../../service/employee.service";
import {NgToastService} from "ng-angular-popup";
import {ProductModel} from "../../../model/Product.model";
import {ChangeRateService} from "../../../service/Change-Rate.service";
import {ChangeRateModel} from "../../../model/Change-Rate.model";
import {EmployeeModel} from "../../../model/Employee.model";
import {UomDetailModel} from "../../../model/Uom.model";
import {AuthService} from "../../../service/Auth.service";
import {PurchaseModel} from "../../../model/Purchase.model";
import {supplierModel} from "../../../model/Supplier.model";
import {SupplierService} from "../../../service/supplier.service";

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {
  f!: FormGroup
  fa!: FormGroup
  uomDetails: UomDetailModel[]=[]
  products: ProductModel[]=[];
  employees: EmployeeModel[]=[]
  changeRates: ChangeRateModel[]=[]
  suppliers: supplierModel[]=[]
  userProfile: any
  purchases: PurchaseModel[]=[]
  sum: any
  qtyVal: any
  priceVal: any
  total: any

  constructor(
    private purchaseService: PurchaseService,
    private fb: FormBuilder,
    private uomService: UomService,
    private productService: ProductService,
    private employeeService: EmployeeService,
    private toast: NgToastService,
    private changeRateService: ChangeRateService,
    private authService: AuthService,
    private supplierService: SupplierService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getUomDetail()
    this.getProduct()
    this.getEmployee()
    this.getChangeRate()
    this.getSupplier()
    this.userProfile=this.authService.getLoginUser().username;
  }

  initForm() {
    this.f = this.fb.group({
      id: null,
      code: [null,Validators.required],
      order_date: null,
      supplier_id: [null,Validators.required],
      changeRate_id: [null,Validators.required],
      employee_id: [null, Validators.required],
      create_by: this.userProfile,
      description: null,
      totalPrice: 0,
      purchaseOrderDetail:this.fb.array([]),
    });
  }

  loadSuB(index: number){
      this.qtyVal = this.PoD.at(index).value.qty
      this.priceVal = this.PoD.at(index).value.price
      this.PoD.at(index).get('amount')?.patchValue(this.qtyVal * this.priceVal)
      this.sum = 0;
      this.PoD.value.forEach((x: any) => {
        this.sum += +x.amount;
      });
      this.f.get('totalPrice')?.patchValue(this.sum)
  }

  get PoD(){
    return this.f.controls["purchaseOrderDetail"] as FormArray
  }

  addNewRow(){
    this.fa = this.fb.group({
      id: null,
      product: [null, Validators.required],
      qty: 0,
      price:0,
      create_by: null,
      item_variant_id: [null, Validators.required],
      description: null,
      amount: 0,
    });
    this.PoD.push(this.fa)
  }

  deleteRow(Index: number) {
    this.PoD.removeAt(Index);
  }

  loadUoM(product:ProductModel, index:number) {
    const { itemVariantUom } = product;
    this.PoD.at(index).patchValue({
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
          displayLabel: divition.name + ' ' + ' - '+divition.itemVariantUom.item_variant_name
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

  getSupplier(){
    this.supplierService.getObj().subscribe(res=>{
        this.suppliers = res.result;
      })
  }

  saveObject(purchase: PurchaseModel){
    purchase.create_by = this.userProfile
    this.purchaseService.saveObj(purchase).subscribe(res=>{
      if(res.result.total == 200){
        this.toast.success({summary: 'Confirmed', detail: 'Record Saved Success !!', duration: 5000});
      }else if(res.result.total == 501){
        this.toast.error({summary: 'Code and Supplier duplicate !!', detail: 'Duplicate !!', duration: 5000});

      }
    })
  }

}
