import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {NgToastService} from "ng-angular-popup";
import {ConfirmationService, ConfirmEventType, MessageService} from "primeng/api";
import {UserService} from "../../../service/User.service";
import {UserModel} from "../../../model/User.model";
import {GenderModel} from "../../../model/Gender.model";
import {RoleModel} from "../../../model/role.model";
import {RoleService} from "../../../service/Role.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class UserComponent implements OnInit {
  users: UserModel[]=[]
  gender: GenderModel[]=[]
  selectGender!: GenderModel
  roles: RoleModel[]=[];
  f!: FormGroup;
  imagePath!: string;
  fileUploaded: any;
  obj: any;
  imageId: any;
  deleteId: any;
  urlLink: string | ArrayBuffer = 'assets/dist/img/user.png';
  public Storage= "http://localhost:8080/api/v1";
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private roleService: RoleService,
    private toast: NgToastService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.gender = [
      {sex: 'Male'},
      {sex: 'Female'},
    ];
  }

  ngOnInit(): void {
    this.getUser()
    this.initForm()
    this.getRole()
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
  }
  getRole(){
    this.roleService.getObj().subscribe(rest=>{
      this.roles = rest.result;
    })
  }
  getEventValue($event:any) :string {
    return $event.target.value;
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

  openEdit(templateRef: TemplateRef<any>,us: any) {
    // console.log(us)
    this.dialog.open(templateRef, {
      width: '65%',
      height: '85%'
    });
    this.f.patchValue(us.user);
    // @ts-ignore
    this.f.get('dob').patchValue(this.formatDate(us.user.dob))
    this.f.get('role_id')?.patchValue(us.role.id)

    this.imageId = us.user.id
    this.imagePath = us.user.photo
    // console.log("image id: "+this.imageId)
    // console.log("imagePath: "+this.imagePath)
  }

  confirmDelete(userobj: any){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.onDelete(userobj);
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

  getUser(){
    this.userService.getData().subscribe(res=>{
      this.users = res.result
    });
  }

  uploadImageProfile(id:any) {
    this.userService.uploadImageProfile(id, this.imagePath).subscribe((res: any) => {
      // console.log(res,"user profile");
    });
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
      // console.log(this.imagePath)
    });
  }

  onSave(){
    console.log(this.f.value)
    this.userService.updateObj(this.f.value).subscribe(res=>{
      console.log("update user"+res)
        this.uploadImageProfile(this.imageId);
        this.ngOnInit();
        this.toast.success({detail:"SUCCESS",summary:'Your Success Message',duration:5000});
      }
    )
    this.dialog.closeAll()
  }

  onDelete(userObj: any){
    this.deleteId = userObj.id
    this.userService.delete(this.deleteId).subscribe(res=>{
      // console.log("delete: "+res)
      this.ngOnInit()
    })

  }
}
