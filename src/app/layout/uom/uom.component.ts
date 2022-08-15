import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {UomService} from "../../service/Uom.service";
import {UomDetailModel} from "../../model/Uom.model";
import {MatDialog} from "@angular/material/dialog";
import {NgToastService} from "ng-angular-popup";
import {HttpClient} from "@angular/common/http";
import {ConfirmationService, ConfirmEventType, MessageService} from "primeng/api";

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class UomComponent implements OnInit {
  f!: FormGroup
  uom_id: UomDetailModel[] = []
  uoms: any
  uomDetail: any
  um_id: any
  deleteId: any

  constructor(
    private fb: FormBuilder,
    private uomService: UomService,
    public dialog: MatDialog,
    private toast: NgToastService,
    private http: HttpClient,
    private confirmationService: ConfirmationService,
  ) {
  }

  ngOnInit(): void {
    this.getUom()
    this.getUomDetail()
    this.initForm()

  }

  initForm() {
    this.f = this.fb.group({
      id: null,
      uom_id: [null, Validators.required],
      item_variant_name: [null, Validators.required],
      unit_value: [null, Validators.required],
      conversion_factor: [null, Validators.required],
      description: [null, Validators.required]
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

  getUom() {
    this.uomService.getUomData().subscribe(res => {
      this.uoms = res.result
    })
  }

  openAdd(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '30%',
      height: '35%'
    });
  }

  openEdit(emp: any) {
    this.f.patchValue(emp);
    // @ts-ignore
    this.f.get('uom_id').patchValue(emp.uom.id)
  }

  confirmDelete(empobj: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteObj(empobj);
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

  onSubmit(f: NgForm) {
    this.uomService.saveUom(f.value).subscribe(res => {
      this.ngOnInit()
      this.toast.success({detail: "SUCCESS", summary: 'Your Success Message', duration: 5000});
    })
  }

  onSubmitDetail(frmObj: any) {
    this.uomService.saveUomDetail(frmObj).subscribe(res => {
      this.ngOnInit()
      this.toast.success({detail: "SUCCESS", summary: 'Your Success Message', duration: 5000});
    })
  }

  updateSubmit(fobj:any){
    this.um_id = fobj.uom_id
    this.uomService.updateObj(fobj,this.um_id).subscribe(res=>{
      this.ngOnInit()
      this.toast.success({detail: "SUCCESS", summary: 'Your Success Message', duration: 5000});
    })
  }

  deleteObj(obj: any){
    this.deleteId = obj.id
    this.uomService.deleteObj(this.deleteId).subscribe(res=>{
      this.ngOnInit()
    })
  }
}
