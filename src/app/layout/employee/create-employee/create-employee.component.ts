import { Component, OnInit } from '@angular/core';
import {EmployeeService} from "../../../service/employee.service";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {GenderModel} from "../../../model/Gender.model";
import {MaritalModel} from "../../../model/Marital.model";

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {

  employee:any;
  urlLink: string | ArrayBuffer = 'assets/dist/img/user.png';
  imagePath!: string ;
  gender: GenderModel[]=[];
  selectGender!: GenderModel;
  marital_status: MaritalModel[]=[];
  selectMarital!: MaritalModel;
  fileUploaded: any;
  obj: any;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  f!: FormGroup;

  constructor(
    private employeeSevice: EmployeeService,
    private toast: NgToastService,
    private fb: FormBuilder,
  ) {
    this.gender = [
      {sex: 'Male'},
      {sex: 'Female'},
    ];

    this.marital_status = [
      // @ts-ignore
      {marital: 'Single'},
      // @ts-ignore
      {marital: 'Married'},
    ];
  }

  ngOnInit(): void {

    this.initForm();
  }

  initForm() {
    this.f = this.fb.group({
      id: null,
      name: [null, Validators.required],
      gender:[null,Validators.required],
      email: [null, [Validators.required, Validators.pattern(this.emailPattern)]],
      contact: [null, Validators.required],
      address: [null, Validators.required],
      position:[null,Validators.required],
      marital_status:[null,Validators.required],
      dob: null,
      photo: null,
      description: null
    });
  }

  // onSubmit(f:NgForm){
  //   this.employeeSevice.saveData(f.value).subscribe((result)=>{
  //       console.log(result);
  //       this.toast.success({detail:"SUCCESS",summary:'Your Success Message',duration:5000});
  //     });
  // }

  /**
   * Upload Image
   */
  onSelectFile(event: any ) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      // tslint:disable-next-line:no-shadowed-variable
      reader.onload = (event) => {
        // @ts-ignore
        this.urlLink = event.target.result
      };
    }
    this.fileUploaded = event.target.files[0];
    // console.log("file upload", this.fileUploaded)
    this.employeeSevice.uploadImage(this.fileUploaded, 'Employee_Profile').subscribe((res: any) => {
        // this.obj.photo = null;
        this.imagePath = res.result.file;
      console.log(this.imagePath)
      });
  }

  saveObject(formObj: any) {
    this.obj = formObj;
    this.obj.photo = this.imagePath;
    // console.log()
    this.employeeSevice.saveData(this.obj).subscribe(
      (res: any) => {
        if (res.result.total == 403) {
          this.toast.error({detail: "employee already exist !!", summary: 'Duplicate', duration: 5000});
        } else {
          this.toast.success({detail: "Save", summary: 'Your Success Save New Record', duration: 5000});
        }
      });
  }





}
