import {Component, OnInit, TemplateRef} from '@angular/core';
import {PurchaseReceiveService} from "../../../../../service/Purchase-Receive.service";
import {PurchaseReceiveModel} from "../../../../../model/PurchaseReceive.model";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../../service/Auth.service";
import {ProductService} from "../../../../../service/Product.service";
import {ProductModel} from "../../../../../model/Product.model";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationService, ConfirmEventType, MessageService} from "primeng/api";
import {NgToastService} from "ng-angular-popup";
import * as printJS from "print-js";
import {PurchaseModel} from "../../../../../model/Purchase.model";
import {EmployeeModel} from "../../../../../model/Employee.model";
import {PurchaseService} from "../../../../../service/Purchase.service";
import {EmployeeService} from "../../../../../service/employee.service";

@Component({
  selector: 'app-purchase-receive',
  templateUrl: './purchase-receive.component.html',
  styleUrls: ['./purchase-receive.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class PurchaseReceiveComponent implements OnInit {
  f!: FormGroup;
  fa!: FormGroup;
  purchaseReceives: PurchaseReceiveModel[]=[];
  public Storage= "http://localhost:8080/api/v1";
  userProfile: any;
  products: ProductModel[]=[];
  employees: EmployeeModel[]=[]
  po: PurchaseModel[]=[]
  purchaseReceive: any;
  deleteId!: number
  loading: boolean = true
  totalPrice?: number
  code: any
  suppId: any
  sum: any
  qtyVal: any
  priceVal: any
  constructor(
    private fb: FormBuilder,
    private toast: NgToastService,
    private confirmationService: ConfirmationService,
    private employeeService: EmployeeService,
    private purchaseService: PurchaseService,
    public dialog: MatDialog,
    private authService: AuthService,
    private productService: ProductService,
    private purchaseReceiveService: PurchaseReceiveService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getPurchaseReceive()
    this.getPo()
    this.getEmployee()
    this.getProduct()
    this.userProfile=this.authService.getLoginUser().username;
  }

  getEventValue($event: any): string {
    return $event.target.value;
  }

  initForm(){
    this.f = this.fb.group({
      id: null,
      code: null,
      supplier_id: [null, Validators.required],
      employee_id: null,
      order_date: null,
      receive_date: null,
      changeRate_id: null,
      supplier_company: null,
      supplier_contact: null,
      supplier_email: null,
      supplier_address: null,
      create_by: this.userProfile,
      description: null,
      totalPrice: null,
      purchase_order: null,
      purchaseReceiveDetail:this.fb.array([]),
    })
    this.fa = this.fb.group({
      poid: 0,
      product: [null, Validators.required],
      qty: 0,
      price:0,
      create_by: null,
      item_variant_id: [null, Validators.required],
      description: null,
      amount: 0,
    });
  }

  print(){
    printJS({
      printable: "printJS-form",
      type: "html",
      style: ".header {font-weight: 800;text-align: center;} .header {font-size: 18px;} .cm{margin-top: 5px;} .cm{margin-left: 15px;}" +
        ".vendor{margin-top: -45px;} .vendor{ margin-left: 15px;} .vendorBold{font-weight: 800;} .vendor1{margin-top: -20px} " +
        ".pleft{margin-top: -30px;} .code{margin-left: 70px;} .code{margin-top:10px;} .date{margin-left: 70px;margin-top:-100px;} " +
        ".img {margin-left: 50px;} .img{margin-top:-70px;} .body{margin-left: 70px;} .table{margin-top: -45px;} " +
        ".table{padding-right: 70px;} .price{padding-right: 30px;} .sub{padding-right:120px;} .dt{padding-left: 15px;}" +
        ".total{margin-left: 285px; color: red;font-weight: 800} .note{font-weight: 800;margin-left: 15px;}",
    });
  }

  onClose(){
    this.dialog.closeAll()
  }

  get pord(){
    return this.f.controls["purchaseReceiveDetail"] as FormArray
  }

  getPo(){
    this.purchaseService.getPo().subscribe(res=>{
      this.po = res.result
      this.po = this.po.map((x: any)=>{
        return {
          ...x,
          displayLabel: x.code + ' ' + ' ~~ '+x.supplier.company
        };
      })
    })
  }

  private formatDate(date:any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  openView(templateRef: TemplateRef<any>,po: any) {
    // console.log(po)
    this.totalPrice=po.totalPrice + po.changeRateSymbol
    const arr = this.pord
    while (arr.length){
      arr.removeAt(0)
    }
    this.dialog.open(templateRef, {
      width: '55%',
      height: '85%'
    });
    this.purchaseReceiveService.getPorById(po.id).subscribe(response=>{
      this.purchaseReceive =  response.result
      // console.log(this.purchaseReceive)
    })
  }

  // not used
  openEdit(templateRef: TemplateRef<any>,po: any) {
    this.totalPrice=po.totalPrice + po.changeRateSymbol
    const arr = this.pord
    while (arr.length){
      arr.removeAt(0)
    }
    this.dialog.open(templateRef, {
      width: '55%',
      height: '85%'
    });
    this.purchaseReceiveService.getPorById(po.id).subscribe(response=>{
      this.purchaseReceive =  response.result
      this.f.patchValue({
        ...this.purchaseReceive,
        purchase_order : this.purchaseReceive.purchase_order.code,
        supplier_id: this.purchaseReceive.supplier.company,
        receive_date : this.formatDate(this.purchaseReceive.receive_date),
        description: this.purchaseReceive.description,
        employee_id : this.purchaseReceive.employee.id,
        totalPrice : po.totalPrice
      });
      this.purchaseReceive.purchaseReceiveDetail.forEach((x: any)=>{
        // console.log('x=',x)
        // console.log('x data:', x.purchaseOrderDetail.product)
        this.qtyVal = x.purchaseOrderDetail.qty / x.purchaseOrderDetail.itemVariantUom.conversion_factor
        this.priceVal = x.purchaseOrderDetail.price
        const amt = this.qtyVal * this.priceVal
        this.pord.push(this.fb.group({
          product: x.purchaseOrderDetail.product,
          item_variant_id: x.purchaseOrderDetail.itemVariantUom.item_variant_name,
          description: x.purchaseOrderDetail.itemVariantUom.description,
          qty: this.qtyVal,
          price : this.priceVal,
          amount: amt
        }));
      });
    })
  }

  confirmDelete(pord: any){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
         this.deletePurchase(pord);
        this.toast.success({summary: 'Confirmed', detail: 'Record deleted', duration: 5000});
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.toast.warning({detail: "You have cancelled", summary: 'Cancelled', duration: 5000});
            break;
          case ConfirmEventType.CANCEL:
            this.toast.warning({detail: "You have cancelled", summary: 'Cancelled', duration: 5000});
            break;
        }
      }
    });
  }

  loadSupplier(purchase: PurchaseModel){
    this.code = purchase.code
    const { supplier } = purchase;
    this.suppId = supplier.id
    this.f.patchValue({
      supplier_id: supplier.company,
    });
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

  loadUom(product:ProductModel,index:number) {
    const { purchaseReceiveDetail} = product
    const id = product.id
    let a = product
    console.log("code :", this.code)
      this.purchaseReceiveService.getProPrice(id, this.code, this.suppId).subscribe(res=>{
        a = res.result
        console.log("status a:", a)
        if (res.total == 500){
          this.toast.warning({summary: 'Item Not Found !!', detail: 'Not have this product !!', duration: 5000});
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

  deleteRow(Index: number) {
    this.pord.removeAt(Index);
  }

  getEmployee(){
    this.employeeService.getData().subscribe(res=>{
      this.employees = res.result
    })
  }

  getPurchaseReceive(){
    this.purchaseReceiveService.getObj().subscribe(res=>{
      this.loading = false
      this.purchaseReceives = res.result
    })
  }

  getProduct(){
    this.productService.getObj().subscribe(res=>{
      this.products = res.result;
      this.products = this.products.map((x: any) => {
        return {
          ...x,
          displayLabel: x.name + ' ' + '-'+x.code
        };
      });
    })
  }

  deletePurchase(obj: any){
    this.deleteId = obj.id
    this.purchaseReceiveService.delete(this.deleteId).subscribe(res=>{
      this.getPurchaseReceive()
    })
  }
}
