import {Component, OnInit, TemplateRef} from '@angular/core';
import {adjustmentTypeModel} from "../../../../model/adjustmentType.model";
import {AdjustmentTypeService} from "../../../../service/adjustmentType.service";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConfirmationService, ConfirmEventType, MessageService} from "primeng/api";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-adjustment-type',
  templateUrl: './adjustment-type.component.html',
  styleUrls: ['./adjustment-type.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class AdjustmentTypeComponent implements OnInit {

  adjustmentType: adjustmentTypeModel[]=[]
  f!:FormGroup
  deleteId: any
  loading: boolean = true;

  constructor(
    public dialog: MatDialog,
    protected fb: FormBuilder,
    protected adjustmentTypeService: AdjustmentTypeService,
    private confirmationService: ConfirmationService,
    private toast: NgToastService,
  ) { }

  ngOnInit(): void {
    this.getAdjustmentType()
    this.initForm()
  }

  initForm(){
    this.f = this.fb.group({
      id:[null],
      type:[null,Validators.required],
      description:[null,Validators.required],
    })
  }

  openAdd(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '35%',
      height: '65%'
    });
  }

  openEdit(templateRef: TemplateRef<any>,adjustmentType: any) {
    this.dialog.open(templateRef, {
      width: '35%',
      height: '65%'
    });
    this.f.patchValue(adjustmentType);
  }

  confirmDelete(adj:any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.onDelete(adj);
        this.toast.success({summary:'Confirmed', detail:'Record deleted',duration:5000});
      },
      reject: (type: any) => {
        switch(type) {
          case ConfirmEventType.REJECT:
            // console.log("reject")
            this.toast.warning({detail:"You have cancelled",summary:'Cancelled',duration:5000});
            break;
          case ConfirmEventType.CANCEL:
            // console.log("cancel")
            this.toast.warning({detail:"You have cancelled",summary:'Cancelled',duration:5000});
            break;
        }
      }
    });
  }

  update(obj: any){
    obj = this.f.value
    this.adjustmentTypeService.update(obj).subscribe(res=>{
     this.ngOnInit()
    })
    this.onClose()
  }

  saveObject(obj: any){
    this.adjustmentTypeService.create(obj).subscribe(res=>{
      this.ngOnInit()
    })
    this.onClose()
  }


  getEventValue($event: any): string {
    return $event.target.value;
  }

  onClose(){
    this.dialog.closeAll()
  }

  getAdjustmentType(){
    this.adjustmentTypeService.getObj().subscribe(res=>{
      this.loading = false
      this.adjustmentType  = res.result
    })
  }
  onDelete(adj: any){
    this.deleteId = adj.id
    this.adjustmentTypeService.delete(this.deleteId).subscribe((result)=>{
      console.log(result)
      this.ngOnInit();
    });
    this.onClose()
  }

}
