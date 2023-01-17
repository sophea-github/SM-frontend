
import {Component, OnInit, TemplateRef} from '@angular/core';
import {AdjustmentModel} from "../../../../model/Adjustment.model";
import {AdjustmentService} from "../../../../service/Adjustment.service";
import {ConfirmationService, ConfirmEventType, MessageService} from "primeng/api";
import {MatDialog} from "@angular/material/dialog";
import {NgToastService} from "ng-angular-popup";
import {AuthService} from "../../../../service/Auth.service";
import {Form, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdjustmentTypeService} from "../../../../service/adjustmentType.service";
import {adjustmentTypeModel} from "../../../../model/adjustmentType.model";
import {EmployeeService} from "../../../../service/employee.service";
import {EmployeeModel} from "../../../../model/Employee.model";
import {ProductService} from "../../../../service/Product.service";
import {ProductModel} from "../../../../model/Product.model";

@Component({
  selector: 'app-list-adjustment',
  templateUrl: './list-adjustment.component.html',
  styleUrls: ['./list-adjustment.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class ListAdjustmentComponent implements OnInit {

  adjustments: AdjustmentModel[]=[]
  f!: FormGroup
  fa!: FormGroup
  adjustmentType: adjustmentTypeModel[]=[]
  employees: EmployeeModel[]=[]
  products: ProductModel[]=[]
  adjustment: any
  userProfile: any
  deleteId: any
  loading: boolean = true
  constructor(
    protected fb: FormBuilder,
    protected adjustmentService: AdjustmentService,
    private confirmationService: ConfirmationService,
    public dialog: MatDialog,
    private toast: NgToastService,
    private authService: AuthService,
    protected adjustmentTypeService: AdjustmentTypeService,
    protected employeeService: EmployeeService,
    protected productService: ProductService
  ) {

  }

  ngOnInit(): void {
    this.initForm()
    this.getAdjustment()
    this.getAdjustmentType()
    this.getEmployee()
    this.getProduct()
  }

  initForm(){
    this.f = this.fb.group({
      id: [null],
      code: [null],
      adjustmentDate: [null],
      create_by: [null],
      description: [null],
      adjustmentType_id: [null],
      adjustmentDetail:this.fb.array([]),
    })
    this.fa = this.fb.group({
      id: null,
      pd:[null],
      product: [null, Validators.required],
      qty: 0,
      employee: [null],
      create_by: this.userProfile,
      update_by: this.userProfile,
      item_variant_id: [null, Validators.required],
      description: null,
    });
  }

  getEventValue($event: any): string {
    return $event.target.value;
  }

  get ajd(){
    return this.f.controls["adjustmentDetail"] as FormArray
  }
  getProduct(){
    this.productService.getObj().subscribe(res=>{
      this.products = res.result
      this.products = this.products.map((divition: any) => {
        return {
          ...divition,
          displayLabel: divition.name + ' ' +divition.itemVariantUom.item_variant_name
        };
      });
    })
  }

  getEmployee(){
    this.employeeService.getData().subscribe(res=>{
      this.employees = res.result
    })
  }

  getAdjustmentType(){
    this.adjustmentTypeService.getObj().subscribe(res=>{
      this.adjustmentType  = res.result
    })
  }

  getAdjustment(){
    this.adjustmentService.getObj().subscribe(res=>{
      this.loading = false
      this.adjustments = res.result
    })
  }

  onClose(){
    this.dialog.closeAll()
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

  openEdit(templateRef: TemplateRef<any>,adjustment: AdjustmentModel) {

    const arr = this.ajd
    while (arr.length){
      arr.removeAt(0)
    }
    this.dialog.open(templateRef, {
      width: '55%',
      height: '85%'
    })
    this.adjustmentService.show(adjustment.id).subscribe(res=>{
      this.adjustment = res.result
      this.f.patchValue({
        ...this.adjustment,
        code: this.adjustment.code,
        adjustmentType_id: this.adjustment.adjustmentType.id,
        adjustmentDate: this.formatDate(this.adjustment.adjustmentDate),
        description: adjustment.description,
      })
      this.adjustment.adjustmentDetail.forEach((x: any)=>{
        let qtyVal = x.qty / x.itemVariantUom.conversion_factor
        this.ajd.push(this.fb.group({
          id: x.id,
          product:x.product,
          item_variant_id: x.itemVariantUom.item_variant_name,
          description: x.itemVariantUom.description,
          employee: x.employee,
          qty: qtyVal,
        }));
      })
    })
   }

  openView(templateRef: TemplateRef<any>,adjustment: AdjustmentModel) {
    const arr = this.ajd
    while (arr.length){
      arr.removeAt(0)
    }
    this.dialog.open(templateRef, {
      width: '55%',
      height: '65%'
    })
    this.adjustmentService.show(adjustment.id).subscribe(res=>{
      this.adjustment = res.result
      console.log('data : ',this.adjustment)
      this.adjustment.adjustmentDetail.forEach((x: any)=>{
        let qtyVal = x.qty / x.itemVariantUom.conversion_factor
        this.ajd.push(this.fb.group({
          id: x.id,
          product:x.product,
          item_variant_id: x.itemVariantUom.item_variant_name,
          description: x.itemVariantUom.description,
          employee: x.employee,
          qty: qtyVal,
        }));
      })
    })
  }

   onSave(obj: any){
     this.adjustmentService.saveUpdate(obj).subscribe(res=>{
       this.getAdjustment()
       this.toast.success({summary: 'Confirmed', detail: 'Record Updated Success !!', duration: 5000});
     })
     this.onClose()
   }

  confirmDelete(adj: any){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteObj(adj);
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

  deleteObj(obj: any){
    this.deleteId = obj.id
    this.adjustmentService.delete(this.deleteId).subscribe(res=>{
      this.ngOnInit()
    })
  }
}
