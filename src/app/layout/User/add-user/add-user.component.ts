import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RoleService} from "../../../service/Role.service";
import {UserService} from "../../../service/User.service";
import {NgToastService} from "ng-angular-popup";
import {RoleModel} from "../../../model/role.model";
import {GenderModel} from "../../../model/Gender.model";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  f!: FormGroup
  urlLink: string | ArrayBuffer = 'assets/dist/img/user.png';
  fileUploaded: any;
  imagePath!: string;
  roles: RoleModel[]=[];
  obj: any;
  gender: GenderModel[]=[]
  selectGender!: GenderModel

  constructor(private fb: FormBuilder,
              private roleService: RoleService,
              private userService: UserService,
              private toast: NgToastService,
  ) {
    this.gender = [
      {sex: 'Male'},
      {sex: 'Female'},
    ];
  }

  ngOnInit(): void {
    this.initForm()
  }
  initForm() {
    this.f = this.fb.group({
      id: null,
      username: [null, Validators.required],
      gender:[null,Validators.required],
      contact: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      address: [null,Validators.required],
      role_id: [null,Validators.required],
      dob:null,
      photo: null,
    });
    this.getRole();
  }

  /**
   * Upload Image
   */
  onSelectFile(event: any ) {
    if (event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      // tslint:disable-next-line:no-shadowed-variable
      reader.onload = (event) => {
        // @ts-ignore
        this.urlLink = event.target.result
      };
    }
    this.fileUploaded = event.target.files[0];
    this.userService.uploadImage(this.fileUploaded, 'User_Photo').subscribe((res: any) => {
      this.imagePath = res.result.file;
      console.log(this.imagePath)
    });
  }

  getRole(){
    this.roleService.getObj().subscribe(rest=>{
      this.roles=rest.result.map((element:RoleModel)=>{
       return {
         ...element,
        name: element.name?.replace('ROLE_','')
       } ;
      });
      console.log(this.roles);
    })
  }

  saveObject(formObj: any) {
    console.log("form Obj : ",formObj);
    this.obj = formObj;
    this.obj.photo = this.imagePath;
    console.log("Role Id: "+this.obj.role_id)
    this.userService.create(this.obj).subscribe(
      (res: any) => {
        console.log("res : "+res)
        // console.log(res.total, " Status code ")
        if(res.total == 200){
          this.toast.success({detail:"SUCCESS",summary:'Your Success Message',duration:5000});
        } else if (res.total == 500){
          this.toast.warning({detail:"Error",summary:'Duplicate can not insert !!',duration:5000});
        } else{
          this.toast.error({detail:"Error",summary:'Check Field again !!',duration:5000});
        }
      });
  }



}
