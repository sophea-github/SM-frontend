
import { CategoryService } from 'src/app/service/category.service';
// import { CategoryModel } from './../../model/Category.model';
import {ConfirmationService, ConfirmEventType, Message, MessageService, PrimeNGConfig} from 'primeng/api';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';

//should be create class one in model package

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class CategoryComponent implements OnInit {
  // categories: CategoryModel[]=[];
  public categories: any
  editForm: FormGroup | any;
  public category: any;
  public deleteId: any | undefined;
  loading: boolean = true;
  constructor(
    public categoryService: CategoryService,
    public dialog: MatDialog,
    private toast: NgToastService,
    public fb : FormBuilder,private confirmationService: ConfirmationService, private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getCategories(),
    this.editForm = this.fb.group({
      id: [''],
      name: [''],
      description: ['']
    })
  }

  getEventValue($event:any) :string {
    return $event.target.value;
  }
  openAdd(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '30%',
      height: '60%'
    });
  }
  openEdit(templateRef: TemplateRef<any>,cat: any) {
    console.log('cc:',cat)
    this.dialog.open(templateRef, {
      width: '30%',
      height: '60%'
    });
    this.editForm.patchValue(cat);
  }
  confirmDelete(cat:any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.onDelete(cat);
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
  getCategories(){
      this.categoryService.getData().subscribe(
        res=>{
          console.log(res);
          this.loading = false;
          this.categories = res.result;
          console.log(this.categories ,'work');
        }
      )
    }
       // submit add data
  onSubmit(f:NgForm){
    this.categoryService.saveData(f.value).subscribe((result)=>{
        console.log(result);
        this.ngOnInit();
        this.toast.success({detail:"SUCCESS",summary:'Your Success Message',duration:5000});
    }
    );
    this.dialog.closeAll();
  }
  onSave(){
    this.categoryService.updateObject(this.editForm.value)
    .subscribe((result) => {
      this.ngOnInit();
      this.toast.success({detail:"SUCCESS",summary:'Your Success Message',duration:5000});
    });
    this.dialog.closeAll();
  }

  onDelete(cat: any){
    this.deleteId = cat.id
    this.categoryService.deleteObj(this.deleteId).subscribe((result)=>{
      console.log(result)
      this.ngOnInit();
    });
    this.dialog.closeAll();
  }

}
