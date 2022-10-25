import {Component, OnInit, TemplateRef} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {NgToastService} from "ng-angular-popup";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {ChangeRateService} from "../../service/Change-Rate.service";
import {ConfirmationService, ConfirmEventType, MessageService} from "primeng/api";
import {validateOptions} from "@angular/localize/tools/src/extract/translation_files/format_options";

@Component({
  selector: 'app-chnage-rate',
  templateUrl: './chnage-rate.component.html',
  styleUrls: ['./chnage-rate.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class ChnageRateComponent implements OnInit {
  rate: any
  f!: FormGroup
  loading: boolean = true;
  deleteId: any
  constructor(
    public changeRateService: ChangeRateService,
    public dialog: MatDialog,
    private toast: NgToastService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getChangeRate()
  }

  initForm() {
    this.f = this.fb.group({
      id: null,
      type: [null, Validators.required],
      rate:[null,Validators.required],
      symbol: [null, Validators.required],
      description: [null],
    });
  }

  getEventValue($event:any) :string {
    return $event.target.value;
  }

  onClose(){
    this.dialog.closeAll()
  }
  getChangeRate(){
    this.changeRateService.getData().subscribe(
      res=>{
        this.loading = false;
        this.rate = res.result;
      }
    )
  }
  openAdd(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '50%',
      height: '85%'
    });
  }
  openEdit(templateRef: TemplateRef<any>,rt: any) {
    this.dialog.open(templateRef, {
      width: '40%',
      height: '75%'
    });
    this.f.patchValue(rt);
  }
  // submit add data
  onSubmit(f:NgForm){
    this.changeRateService.saveData(f.value).subscribe((result)=>{
        this.ngOnInit();
        this.toast.success({detail:"SUCCESS",summary:'Your Success Message',duration:5000});
      }
    );
    this.onClose()
  }
  onSave(){
    this.changeRateService.updateObject(this.f.value).subscribe(
      res=>{
        this.ngOnInit();
        this.toast.success({detail:"SUCCESS",summary:'Your Success Message',duration:5000});
      }
    )
    this.onClose()
  }

  confirmDelete(rt: any){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.onDelete(rt);
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

  onDelete(obj: any){
    this.deleteId = obj.id
    this.changeRateService.deleteObj(this.deleteId).subscribe(res=>{
      this.ngOnInit()
    })

  }

}
