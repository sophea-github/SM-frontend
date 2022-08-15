import {Component, OnInit, TemplateRef} from '@angular/core';
import {SupplierService} from "../../service/supplier.service";
import {supplierModel} from "../../model/Supplier.model";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {ConfirmationService, ConfirmEventType, MessageService} from "primeng/api";

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class SupplierComponent implements OnInit {
  suppliers: any;
  editForm: FormGroup | any;
  loading: boolean = true;
  deleteId: any;
  selectedSupplier: supplierModel[] = [];
  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    public dialog: MatDialog,
    private toast: NgToastService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getSupplier(),
      this.editForm = this.fb.group({
        id: [''],
        company: ['',[Validators.required]],
        contact:['',[Validators.required]],
        email:['',[Validators.required, Validators.email]],
        address:['',[Validators.required]],
        description: ['',[Validators.required]]
      })
  }

  getEventValue($event:any) :string {
    return $event.target.value;
  }

  openAdd(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '50%',
      height: '85%'
    });
  }
  openEdit(templateRef: TemplateRef<any>,sup: any) {
    console.log(sup)
    this.dialog.open(templateRef, {
      width: '50%',
      height: '85%'
    });
    this.editForm.patchValue(sup);
  }
  getSupplier(){
    this.supplierService.getData().subscribe(
      res=>{
        console.log(res);
        this.loading = false;
        this.suppliers = res.result;
        // console.log(this.subCategories ,'work');
      }
    )
  }
  confirmDelete(sup: any){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.onDelete(sup);
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

  onClose(){
    this.dialog.closeAll()
  }

  // submit add data
  onSubmit(f:NgForm){
    this.supplierService.saveData(f.value).subscribe((result)=>{
        console.log(result);
        this.ngOnInit();
        this.toast.success({detail:"SUCCESS",summary:'Your Success Message',duration:5000});
      }
    );
    this.dialog.closeAll();
  }
  onSave(){
    this.supplierService.updateObject(this.editForm.value).subscribe(
      res=>{
        this.ngOnInit();
        this.toast.success({detail:"SUCCESS",summary:'Your Success Message',duration:5000});
      }
    )
    this.dialog.closeAll()
  }

  onDelete(sup: any){
    this.deleteId = sup.id
    this.supplierService.deleteObj(this.deleteId).subscribe(res=>{
        this.ngOnInit()
      })
    this.dialog.closeAll()
  }

}
