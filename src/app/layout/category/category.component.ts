import { ConfirmationService, Message, MessageService, PrimeNGConfig } from 'primeng/api';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

export class Category{
  constructor(
    public id: any,
    public name: string,
    public description: string
  ){

  }
}


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class CategoryComponent implements OnInit {
  public categorys: Array<any>=[];
  editForm !: FormGroup ;
  public deleteId: number | undefined;
  msgs: Message[] = [];
  public position: any;
  constructor(
    private httpClient:HttpClient,
    public dialog: MatDialog,
    private fb : FormBuilder,
    private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig,private messageService: MessageService
  ) { }


  openAdd(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '50%',
      height: '55%'
    });
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.getCategorys(),
    this.formValidation()
  }

  formValidation()
  {
    this.editForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['',Validators.required]
    });
  }

  // get validationFormControl() {
  //   return this.editForm.controls;
  // }

  // onSubmit() {
  //   this.submitted = true;
  //   if (this.registerForm.valid) {
  //     alert('Form Submitted succesfully!!!\n Check the values in browser console.');
  //     console.table(this.registerForm.value);
  //   }
  // }

  openEdit(templateRef: TemplateRef<any>,cat:any) {
    console.log('this is',cat.id)
    this.dialog.open(templateRef, {
      width: '40%',
      height: '63%'
    });
    this.editForm.patchValue(cat);
  }

  // openDelete(templateRef: TemplateRef<any>, cat: any) {
  //   this.deleteId = cat.id;
  //   console.log(cat.id)
  //   this.dialog.open(templateRef, {
  //     width: '40%',
  //     height: '40%'
  //   });
  // }

  confirm2(cat:any) {
    this.confirmationService.confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
            this.deleteId = cat.id;
            this.onDelete();
            // this.msgs = [{severity:'success', summary:'Confirmed', detail:'Record deleted'}];
            this.messageService.add({key: 'myKey1', severity:'success', summary: 'Summary Text', detail: 'Detail Text'});
        },
        reject: () => {
            this.msgs = [{severity:'warn', summary:'Rejected', detail:'You have rejected'}];
            this.messageService.add({key: 'myKey1', severity:'warn', summary: 'Summary Text', detail: 'You have rejected'});
        }
    });
}


    //create function get url api from backend
    getCategorys(){
      this.httpClient.get<any>('http://localhost:8080/api/v1/category/read').subscribe(
        res =>{
          console.log(res);
          this.categorys = res.result;
          console.log(this.categorys,'work');
        }
      )
    }


   // submit add data
   onSubmit(){
    const url='http://localhost:8080/api/v1/category/create';
    if(this.editForm.valid)
    {
       this.httpClient.post(url,this.editForm.value).subscribe((result)=>{
        console.log(result);
        this.ngOnInit();
    });
    this.dialog.closeAll();
    }

  }

  onSave(){
    const editURL = 'http://localhost:8080/api/v1/category/update/' + this.editForm.value.id;
    this.httpClient.put(editURL, this.editForm.value)
    .subscribe((result) => {
      this.ngOnInit();
    });
    this.dialog.closeAll();
  }

  onDelete(){
    const deleteURL= 'http://localhost:8080/api/v1/category/delete/' + this.deleteId;
    console.log(deleteURL)
    this.httpClient.delete(deleteURL)
    .subscribe((result)=>{
      this.ngOnInit();
    });
    this.dialog.closeAll();
  }

}
