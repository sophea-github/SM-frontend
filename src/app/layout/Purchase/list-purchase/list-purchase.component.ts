import {Component, OnInit, TemplateRef} from '@angular/core';
import {PurchaseService} from "../../../service/Purchase.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConfirmationService, ConfirmEventType, MessageService} from "primeng/api";
import {MatDialog} from "@angular/material/dialog";
import {NgToastService} from "ng-angular-popup";
import {UomService} from "../../../service/Uom.service";
import {ProductService} from "../../../service/Product.service";
import {EmployeeService} from "../../../service/employee.service";

@Component({
  selector: 'app-list-purchase',
  templateUrl: './list-purchase.component.html',
  styleUrls: ['./list-purchase.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class ListPurchaseComponent implements OnInit {

  purchaseorder: any
  f!: FormGroup
  porder: any
  deleteId: any
  uomDetail: any
  pd: any
  employee: any
  Pro: any


  constructor(
    private purchaseService: PurchaseService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    public dialog: MatDialog,
    private toast: NgToastService,
    private uomService: UomService,
    private productService: ProductService,
    private employeeService: EmployeeService

  ) { }

  ngOnInit(): void {
    this.getPurchaseOrder()
    this.initForm()
    this.getEmployee()
    this.getUomDetail()
    this.getProduct()
  }
  initForm() {
    this.f = this.fb.group({
      id: null,
      order_date: null,
      product_id: [null, Validators.required],
      employee_id: [null, Validators.required],
      item_variant_id: [null, Validators.required],
      qty: null,
      amt:null,
      price:null,
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
    this.productService.getData().subscribe(res=>{
      this.pd = res.result
      // console.log(this.product)
    })
  }

  getEmployee(){
    this.employeeService.getData().subscribe(res=>{
      this.employee = res.result
      // console.log(this.employee)
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
    console.log(po.product.id,"po edit")
    this.dialog.open(templateRef, {
      width: '65%',
      height: '85%'
    });
    this.f.patchValue(po);
    // @ts-ignore
    this.f.get('product_id').patchValue(po.product.id)
     this.f.get('order_date')?.patchValue(this.formatDate(po.purchaseOrder.order_date))
    this.f.get('description')?.patchValue(po.purchaseOrder.description)
    this.f.get('item_variant_id')?.patchValue(po.itemVariantUom.id)
    this.f.get('employee_id')?.patchValue(po.purchaseOrder.employee.id)
    // console.log(this.Pro,"pro")
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
            // console.log("reject")
            this.toast.warning({detail: "You have cancelled", summary: 'Cancelled', duration: 5000});
            break;
          case ConfirmEventType.CANCEL:
            // console.log("cancel")
            this.toast.warning({detail: "You have cancelled", summary: 'Cancelled', duration: 5000});
            break;
        }
      }
    });
  }

  getPurchaseOrder(){
    this.purchaseService.getData().subscribe(res=>{
      this.purchaseorder = res.result
      // console.log(this.purchaseorder,"po list")
    })
  }

  onSave(){
    this.purchaseService.updateObj(this.f.value).subscribe(res=>{
      // console.log(res,"update")
      this.ngOnInit()
    })
    this.onClose()
  }

  deleteObj(obj: any){
    this.deleteId = obj.id
    this.purchaseService.delete(this.deleteId).subscribe(res=>{
      // console.log(res,"Delete res")
      this.ngOnInit()
    })
  }

}
