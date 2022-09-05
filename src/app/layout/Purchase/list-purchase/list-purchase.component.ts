import {Component, OnInit, TemplateRef} from '@angular/core';
import {PurchaseService} from "../../../service/Purchase.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
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

@Component({
  selector: 'app-list-purchase',
  templateUrl: './list-purchase.component.html',
  styleUrls: ['./list-purchase.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class ListPurchaseComponent implements OnInit {

  purchaseOrder: PurchaseModel[]=[]
  f!: FormGroup
  // porder: any
  deleteId: any
  uomDetail: UomDetailModel[]=[]
  products: ProductModel[]=[]
  employee: EmployeeModel[]=[]
  Pro: any
  changeRates: ChangeRateModel[]=[]
  userProfile: any

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
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getPurchaseOrder()
    this.initForm()
    this.getEmployee()
    this.getUomDetail()
    this.getProduct()
    this.getChangeRate()
    this.userProfile=this.authService.getLoginUser().username;
  }
  initForm() {
    this.f = this.fb.group({
      id: null,
      order_date: null,
      product_id: [null, Validators.required],
      employee_id: [null, Validators.required],
      item_variant_id: [null, Validators.required],
      changeRate_id: null,
      purchaseOrder_id: null,
      qty: null,
      amt: null,
      price: null,
      active: null,
      create_by: null,
      description: null
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
      this.employee = res.result
    })
  }

  getChangeRate(){
    this.changeRateService.getData().subscribe(res=>{
      this.changeRates = res.result
    });
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
    // console.log(po.value.product_id)
    this.dialog.open(templateRef, {
      width: '65%',
      height: '85%'
    });

    this.f.patchValue({
      ...po,
      product_id : po.product.id,
      order_date : this.formatDate(po.purchaseOrder.order_date),
      description: po.purchaseOrder.description,
      item_variant_id: po.itemVariantUom.item_variant_name,
      employee_id : po.purchaseOrder.employee.id,
      changeRate_id : po.purchaseOrder.changeRate.id,
      purchaseOrder_id : po.purchaseOrder.id,

    });
    this.f.controls['create_by'].setValue(this.userProfile)
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
      this.purchaseOrder = res.result
    })
  }

  loadUom(product:ProductModel) {
    this.productService.show(this.f.value.product_id).subscribe(res=>{
      this.Pro = res.result;
      this.f.get('item_variant_id')?.patchValue(this.Pro.itemVariantUom.item_variant_name);
    });
  }

  onSave(){
    this.purchaseService.updateObj(this.f.value).subscribe(res=>{
      this.ngOnInit()
      this.toast.success({summary: 'Confirmed', detail: 'Record Updated Success !!', duration: 5000});
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
