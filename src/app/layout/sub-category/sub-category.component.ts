import {Component, OnInit, TemplateRef} from '@angular/core';
import {ConfirmationService, ConfirmEventType, MessageService} from "primeng/api";
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {NgToastService} from "ng-angular-popup";
import {subCategoryService} from "../../service/subCategory.service";
import {CategoryModel} from "../../model/Category.model";
import {SubCategoryModel} from "../../model/subCategory.model";
import {CategoryService} from "../../service/category.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {
  public subCategories: any;
  editForm: FormGroup | any;
  public subcategory: any;
  public deleteId: any | undefined;
  public categories: CategoryModel[]=[];
  // public catId: any | undefined
  loading: boolean = true;
  constructor( public subcategoryService : subCategoryService,
               public dialog: MatDialog,
               private toast: NgToastService,
               private categoryService: CategoryService,
               private http: HttpClient,
               public fb : FormBuilder) { }

  ngOnInit(): void {
    this.getsubCategorys(),
      // this.getCategorys()
      // this.getCategoryById()
      this.editForm = this.fb.group({
        id: [''],
        subname: [''],
        description: ['']
      })
  }
  getEventValue($event:any) :string {
    return $event.target.value;
  }
  openAdd(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '30%',
      height: '73%'
    });
  }
  // openEdit(templateRef: TemplateRef<any>,subcat: any) {
  //   console.log('cc:',subcat)
  //   this.dialog.open(templateRef, {
  //     width: '30%',
  //     height: '60%'
  //   });
  //   this.editForm.patchValue(subcat);
  // }
  // confirmDelete(cat:any) {
  //   this.confirmationService.confirm({
  //     message: 'Do you want to delete this record?',
  //     header: 'Delete Confirmation',
  //     icon: 'pi pi-info-circle',
  //     accept: () => {
  //       this.onDelete(cat);
  //       this.toast.success({summary:'Confirmed', detail:'Record deleted',duration:5000});
  //     },
  //     reject: (type: any) => {
  //       switch(type) {
  //         case ConfirmEventType.REJECT:
  //           // console.log("reject")
  //           this.toast.warning({detail:"You have cancelled",summary:'Cancelled',duration:5000});
  //           break;
  //         case ConfirmEventType.CANCEL:
  //           // console.log("cancel")
  //           this.toast.warning({detail:"You have cancelled",summary:'Cancelled',duration:5000});
  //           break;
  //       }
  //     }
  //   });
  // }
  // getCategorys(){
  //   this.categoryService.getData("/read").subscribe(
  //     res=>{
  //       console.log(res);
  //       this.loading = false;
  //       this.categories = res.result;
  //       console.log(this.categories ,'work');
  //     }
  //   )
  // }

  //should be do it in service package
  getsubCategorys(){
    this.subcategoryService.getData().subscribe(
      res=>{
        // console.log(res);
        this.loading = false;
        this.subCategories = res.result;
        // console.log(this.subCategories ,'work');
      }
    )
  }
  // submit add data
  onSubmit(f:NgForm){
    console.log(f.value.category_id)
    // const url ='http://localhost:8080/api/v1'
    // this.http.post<any>('http://localhost:8080/api/v1/subCategories/'+f.value.category_id,f.value)
      this.subcategoryService.saveData(f.value).subscribe((result)=>{
        console.log(result);
        this.ngOnInit();
        this.toast.success({detail:"SUCCESS",summary:'Your Success Message',duration:5000});
      }
    );
    this.dialog.closeAll();
  }
  // onSave(){
  //   this.subcategoryService.updateObject(this.editForm.value)
  //     .subscribe((result) => {
  //       this.ngOnInit();
  //       this.toast.success({detail:"SUCCESS",summary:'Your Success Message',duration:5000});
  //     });
  //   this.dialog.closeAll();
  // }

  // onDelete(cat: any){
  //   this.deleteId = cat.id
  //   this.subcategoryService.deleteObj(this.deleteId).subscribe((result)=>{
  //     console.log(result)
  //     this.ngOnInit();
  //   });
  //   this.dialog.closeAll();
  // }


}
