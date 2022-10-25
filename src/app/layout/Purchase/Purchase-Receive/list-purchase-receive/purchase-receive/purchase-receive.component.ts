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
  purchaseReceive: any;
  deleteId!: number
  loading: boolean = true
  totalPrice?: number
  constructor(
    private fb: FormBuilder,
    private toast: NgToastService,
    private confirmationService: ConfirmationService,
    public dialog: MatDialog,
    private authService: AuthService,
    private productService: ProductService,
    private purchaseReceiveService: PurchaseReceiveService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getPurchaseReceive()
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
    console.log(po)
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
      console.log(this.purchaseReceive)
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

  getPurchaseReceive(){
    this.purchaseReceiveService.getObj().subscribe(res=>{
      this.loading = false
      this.purchaseReceives = res.result
    })
  }

  getProduct(){
    this.productService.getObj().subscribe(res=>{
      this.products = res.result;
      this.products = this.products.map((divition: any) => {
        return {
          ...divition,
          displayLabel: divition.name + ' ' + '-'+divition.code
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
