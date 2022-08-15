import {Component, OnInit, TemplateRef} from '@angular/core';
import {EmployeeService} from "../../../service/employee.service";
import {EmployeeModel} from "../../../model/Employee.model";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {NgToastService} from "ng-angular-popup";
import {ConfirmationService, ConfirmEventType, MessageService} from "primeng/api";

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class ListEmployeeComponent  implements OnInit {
  empTbl: EmployeeModel[] =[]
  // @ts-ignore
  employee : any;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  urlLink: string | ArrayBuffer = 'assets/dist/img/user.png';
  f!: FormGroup;
  imagePath!: string ;
  fileUploaded: any;
  obj: any;
  imageId: any;
  deleteId: any;
  public Storage= "http://localhost:8080/api/v1";
  constructor(private employeeService: EmployeeService,
              private http: HttpClient,
              private fb: FormBuilder,
              public dialog: MatDialog,
              private toast: NgToastService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getEmployee();
    this.initForm();
    this.obj = {} as EmployeeModel;
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
      photo: null
    });
  }

  getEventValue($event:any) :string {
    return $event.target.value;
  }
  onClose(){
    this.dialog.closeAll()
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


  openEdit(templateRef: TemplateRef<any>,emp: any) {

    this.dialog.open(templateRef, {
      width: '65%',
      height: '85%'
    });
    this.f.patchValue(emp);
    // @ts-ignore
    this.f.get('dob').patchValue(this.formatDate(emp.dob))
    this.imageId = emp.id
    this.imagePath = emp.photo
    console.log(emp.marital_status,'status')
  }

  confirmDelete(empobj: any){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.onDelete(empobj);
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
      this.employeeService.uploadImage(this.fileUploaded, 'profileImage').subscribe((res: any) => {
      this.imagePath = res.result.file;
    });
  }

  uploadImageProfile(id:any) {
    this.employeeService.uploadImageProfile(id, this.imagePath).subscribe((res: any) => {
      console.log(res,"upload profile");
    });
  }

  getEmployee() {
    this.employeeService.getData().subscribe(res => {
      this.employee = res.result
    });
  }

  onSave(){
    this.employeeService.updateObj(this.f.value).subscribe(res=>{
        this.uploadImageProfile(this.imageId);
        this.ngOnInit();
        this.toast.success({detail:"SUCCESS",summary:'Your Success Message',duration:5000});
      }
    )
    this.dialog.closeAll()
  }

  onDelete(empObj: any){
    this.deleteId = empObj.id
    this.employeeService.deleteObj(this.deleteId).subscribe(res=>{
      this.ngOnInit()
    });
  }



}
