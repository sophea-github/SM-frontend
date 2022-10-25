import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmployeeService} from "../../../../../service/employee.service";
import {EmployeeModel} from "../../../../../model/Employee.model";
import {ChangeRateService} from "../../../../../service/Change-Rate.service";
import {ChangeRateModel} from "../../../../../model/Change-Rate.model";
import {PurchaseService} from "../../../../../service/Purchase.service";
import {PurchaseModel} from "../../../../../model/Purchase.model";
import {AuthService} from "../../../../../service/Auth.service";
import {ProductService} from "../../../../../service/Product.service";
import {ProductModel} from "../../../../../model/Product.model";
import {PurchaseReceiveService} from "../../../../../service/Purchase-Receive.service";
import {NgToastService} from "ng-angular-popup";
import {PurchaseReceiveModel} from "../../../../../model/PurchaseReceive.model";

@Component({
  selector: 'app-new-purchase-receive',
  templateUrl: './new-purchase-receive.component.html',
  styleUrls: ['./new-purchase-receive.component.scss']
})
export class NewPurchaseReceiveComponent implements OnInit {

  f!: FormGroup
  fa!: FormGroup
  employees: EmployeeModel[]=[]
  changeRates: ChangeRateModel[]=[]
  po: PurchaseModel[]=[]
  products: ProductModel[]=[]
  purchaseReceives: PurchaseReceiveModel[]=[]
  userProfile: any
  code: any
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private changeRateService: ChangeRateService,
    private purchaseService: PurchaseService,
    private authService: AuthService,
    private productService: ProductService,
    private toast: NgToastService,
    private purchaseReceiveService: PurchaseReceiveService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getChangeRate()
    this.getEmployee()
    this.getPo()
    this.getProduct()
    this.userProfile=this.authService.getLoginUser().username;
  }

  initForm(){
    this.f = this.fb.group({
      id: null,
      code: null,
      supplier_id: [null, Validators.required],
      employee_id: null,
      receive_date: null,
      changeRate_id: null,
      create_by: this.userProfile,
      description: null,
      totalPrice: null,
      purchase_order: null,
      purchaseReceiveDetail:this.fb.array([]),
    })
  }

  get pord(){
    return this.f.controls["purchaseReceiveDetail"] as FormArray
  }

  addNewRow() {
    this.fa = this.fb.group({
      id: null,
      product: [null, Validators.required],
      qty: 0,
      price: 0,
      create_by: this.userProfile,
      item_variant_id: [null, Validators.required],
      description: null,
      amount: 0,
    });
    this.pord.push(this.fa)
  }
  deleteRow(Index: number) {
    this.pord.removeAt(Index);
  }

  loadSupplier(purchase: PurchaseModel){
    this.code = purchase.code
    const { supplier } = purchase;
    this.f.patchValue({
      supplier_id: supplier.company,
    });
  }

  getEmployee(){
    this.employeeService.getData().subscribe(res=>{
      this.employees = res.result
    })
  }

  getChangeRate(){
    this.changeRateService.getData().subscribe(res=>{
      this.changeRates = res.result
    });
  }

  getPo(){
    this.purchaseService.getPo().subscribe(res=>{
      this.po = res.result
    })
  }

  getProduct(){
    this.productService.getObj().subscribe(res=>{
      this.products = res.result;
      this.products = this.products.map((divition: any) => {
        return {
          ...divition,
          displayLabel: divition.name
            // + ' ' + '-'+divition.code
        };
      });
    })
  }

  loadUom(product:ProductModel,index:number) {
    // const { itemVariantUom } = product;
    const { purchaseReceiveDetail} = product
    const id = product.id
    let a = product
    this.purchaseReceiveService.getProPirce(id, this.code).subscribe(res=>{
      a = res.result
      if (res.total == 500){
        this.toast.warning({summary: 'Item Not Found !!', detail: 'Please Select Code  !!', duration: 5000});
        this.pord.at(index).patchValue({
          item_variant_id: '',
          description: '',
          price: 0
        });
      }else{
        this.pord.at(index).patchValue({
          item_variant_id: a.itemVariantUom?.item_variant_name,
          description: a.itemVariantUom?.description,
          price: a.price
        });
      }
    })

  }

  loadSub(index: number){
    let qtyVal = this.pord.at(index).value.qty
    let priceVal = this.pord.at(index).value.price
    this.pord.at(index).get('amount')?.patchValue(qtyVal * priceVal)
    let sum = 0;
    this.pord.value.forEach((x: any) => {
      sum += +x.amount;
    });
    this.f.get('totalPrice')?.patchValue(sum)
  }

  saveObject(purchaseReceive: PurchaseReceiveModel){
     purchaseReceive.create_by = this.userProfile
     const{purchase_order} = purchaseReceive
    purchaseReceive.id = purchase_order.id
     this.purchaseReceiveService.saveObj(purchaseReceive).subscribe(res=>{
       if(res.result.total == 500){
         this.toast.error({summary: "Product doesn't  has in purchase order !!", detail: 'Check Purchase Order Again !!', duration: 5000});
       }else
       {
         this.toast.success({summary: 'Confirmed', detail: 'Record Saved Success !!', duration: 5000});
       }
     })
  }

}
