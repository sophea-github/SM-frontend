import {Component, OnInit, TemplateRef} from '@angular/core';
import {PurchaseService} from "../../../service/Purchase.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConfirmationService, ConfirmEventType, MessageService} from "primeng/api";
import {MatDialog} from "@angular/material/dialog";
import {NgToastService} from "ng-angular-popup";
import {UomService} from "../../../service/Uom.service";
import {ProductService} from "../../../service/Product.service";
import {EmployeeService} from "../../../service/employee.service";
import {ChangeRateModel} from "../../../model/Change-Rate.model";
import {UomDetailModel} from "../../../model/Uom.model";
import {EmployeeModel} from "../../../model/Employee.model";
import {ProductModel} from "../../../model/Product.model";
import {ChangeRateService} from "../../../service/Change-Rate.service";
import {PurchaseModel} from "../../../model/Purchase.model";
import {AuthService} from "../../../service/Auth.service";
import {SupplierService} from "../../../service/supplier.service";
import {supplierModel} from "../../../model/Supplier.model";
import * as printJS from "print-js";


@Component({
  selector: 'app-list-purchase',
  templateUrl: './list-purchase.component.html',
  styleUrls: ['./list-purchase.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class ListPurchaseComponent implements OnInit {

  purchaseOrder: PurchaseModel[]=[]
  f!: FormGroup
  fa!: FormGroup
  // porder: any
  deleteId: any
  uomDetail: UomDetailModel[]=[]
  products: ProductModel[]=[]
  employees: EmployeeModel[]=[]
  suppliers: supplierModel[]=[]
  Pro: any
  changeRates: ChangeRateModel[]=[]
  userProfile: any
  employeeId?: any
  purchaseDetail: any
  patch: any
  sum: any
  qtyVal: any
  priceVal: any
  loading:boolean =  true
  totalPrice!: Number
  public Storage= "http://localhost:8080/api/v1";

  constructor(
    private purchaseService: PurchaseService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    public dialog: MatDialog,
    private toast: NgToastService,
    private uomService: UomService,
    private productService: ProductService,
    private employeeService: EmployeeService,
    private changeRateService: ChangeRateService,
    private authService: AuthService,
    private supplierService: SupplierService
  ) { }

  ngOnInit(): void {
    this.getPurchaseOrder()
    this.initForm()
    this.getEmployee()
    this.getUomDetail()
    this.getProduct()
    this.getChangeRate()
    this.getSupplier()
    // this.loadSubTotal()
    this.userProfile=this.authService.getLoginUser().username;
  }
  initForm() {
    this.f = this.fb.group({
      id: null,
      code: [null,Validators.required],
      order_date: null,
      supplier_id: [null,Validators.required],
      supplier_company: [null,Validators.required],
      supplier_contact: [null,Validators.required],
      supplier_email: [null,Validators.required],
      supplier_address: [null,Validators.required],
      product_id: [null, Validators.required],
      employee_id: [null, Validators.required],
      item_variant_id: [null, Validators.required],
      changeRate_id: null,
      purchaseOrder_id: null,
      employee_email: null,
      employee_number: null,
      totalPrice: 0,
      description: null,
      purchaseOrderDetail:this.fb.array([]),
    });
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
  get pod(){
    return this.f.controls["purchaseOrderDetail"] as FormArray
  }
  deleteRow(Index: number) {
    this.pod.removeAt(Index);
  }

  loadUom(product:ProductModel,index:number) {
    this.productService.show(product).subscribe(res=>{
      const { itemVariantUom } = res.result;
      this.pod.at(index).patchValue({
        item_variant_id: itemVariantUom?.item_variant_name,
        description:itemVariantUom?.description
      });
    })
  }

  loadUoM(product:ProductModel, index:number) {
    const { itemVariantUom } = product;
    this.pod.at(index).patchValue({
      item_variant_id: itemVariantUom?.item_variant_name,
      description:itemVariantUom?.description
    });
  }

  getEventValue($event: any): string {
    return $event.target.value;
  }
  getUomDetail() {
    this.uomService.getUomDetail().subscribe(res => {
      this.uomDetail = res.result
    })
  }
  getProduct(){
    this.productService.getObj().subscribe(res=>{
      this.products = res.result
      this.products = this.products.map((divition: any) => {
        return {
          ...divition,
          displayLabel: divition.name + ' ' + '<'+divition.code+'>'
        };
      });
    })
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
  getSupplier(){
    this.supplierService.getObj().subscribe(res=>{
        this.suppliers = res.result;
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

  openEdit(templateRef: TemplateRef<any>,po: any) {
    const arr = this.pod
    while (arr.length){
      arr.removeAt(0)
    }
    this.dialog.open(templateRef, {
      width: '65%',
      height: '85%'
    });
    this.purchaseService.getPoDetailById(po.id).subscribe(response=>{
      this.purchaseDetail =  response.result
      this.f.patchValue({
        ...this.purchaseDetail,
        code : this.purchaseDetail.code,
        supplier_id: this.purchaseDetail.supplier.id,
        order_date : this.formatDate(this.purchaseDetail.order_date),
        description: this.purchaseDetail.description,
        employee_id : this.purchaseDetail.employee.id,
        changeRate_id : this.purchaseDetail.changeRate.id,
        totalPrice : po.totalPrice
      });
      this.purchaseDetail.purchaseOrderDetail.forEach((x: any)=>{
        this.qtyVal = x.qty / x.itemVariantUom.conversion_factor
        this.priceVal = x.price
        const amt = this.qtyVal * this.priceVal
        this.pod.push(this.fb.group({
          poid: x.id,
          product: x.product,
          item_variant_id: x.itemVariantUom.item_variant_name,
          description: x.itemVariantUom.description,
          qty: this.qtyVal,
          price: this.priceVal,
          amount: amt
        }));
      });
    })
  }
  openView(templateRef: TemplateRef<any>,po: any) {
    this.totalPrice=po.totalPrice + po.changeRateSymbol
    const arr = this.pod
    while (arr.length){
      arr.removeAt(0)
    }
    this.dialog.open(templateRef, {
      width: '50%',
      height: '85%'
    });
    this.purchaseService.getPoDetailById(po.id).subscribe(response=>{
      this.purchaseDetail =  response.result
      this.purchaseDetail.purchaseOrderDetail.forEach((x: any)=>{
        this.qtyVal = x.qty / x.itemVariantUom.conversion_factor
        this.priceVal = x.price
        const amt = this.qtyVal * this.priceVal
        this.pod.push(this.fb.group({
          product: x.product.name,
          item_variant_id: x.itemVariantUom.item_variant_name,
          description: x.itemVariantUom.description,
          qty: this.qtyVal,
          price: this.priceVal,
          amount: amt
        }));
      });
    })
  }

  loadSub(index: number){
    this.qtyVal = this.pod.at(index).value.qty
    this.priceVal = this.pod.at(index).value.price
    this.pod.at(index).get('amount')?.patchValue(this.qtyVal * this.priceVal)
    this.sum = 0;
    this.pod.value.forEach((x: any) => {
      this.sum += +x.amount;
    });
    this.f.get('totalPrice')?.patchValue(this.sum)
  }

  onClose(){
    this.dialog.closeAll()
  }
  confirmDelete(porder: any){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteObj(porder);
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

  getPurchaseOrder(){
    this.purchaseService.getObj().subscribe(res=>{
      this.loading = false
      this.purchaseOrder = res.result
    })
  }

  print(){
    printJS({
      printable: "printJS-form",
      type: "html",
      style: ".header {font-weight: 800;text-align: center;} .header {font-size: 18px;} .cm{margin-top: 35px;} .cm{margin-left: 15px;}" +
        ".vendor{margin-top: -45px;} .vendor{ margin-left: 15px;} .vendorBold{font-weight: 800;} .vendor1{margin-top: -20px} " +
        ".pleft{margin-top: -30px;} .code{margin-left: 170px;} .code{margin-top:10px;} .date{margin-left: 170px;margin-top:-100px;} " +
        ".img {margin-left: 150px;margin-top:-60px;} .body{margin-left: 70px;} .table{margin-top: -45px;} " +
        ".table{padding-right: 40px;} .price{padding-right: 30px;} .sub{padding-right:80px;} .dt{padding-left: 25px;}" +
        ".total{margin-left: 285px; color: red;font-weight: 800} .note{font-weight: 800;margin-left: 5px;white-space: pre;}",
       });
  }

  onSave(obj: any){
    obj = this.f.value
    this.purchaseService.updateObj(obj).subscribe(res=>{
      // console.log('my res', res)
      if(res.result.total == 200){
        this.getPurchaseOrder()
        // console.log("Hello my Updated !!")
        this.toast.success({summary: 'Confirmed', detail: 'Record Updated Success !!', duration: 5000});
      }else if(res.result.total == 501){
        this.toast.error({summary: 'Code and Supplier duplicate !!', detail: 'Duplicate !!', duration: 5000});
      }

    })
    this.onClose()
  }

  deleteObj(obj: any){
    this.deleteId = obj.id
    this.purchaseService.delete(this.deleteId).subscribe(res=>{
      this.ngOnInit()
    })
  }
}
