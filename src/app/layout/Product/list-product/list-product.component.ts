import {Component, OnInit, TemplateRef} from '@angular/core';
import {ProductService} from "../../../service/Product.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {NgToastService} from "ng-angular-popup";
import {ConfirmationService, ConfirmEventType, MessageService} from "primeng/api";
import {UomService} from "../../../service/Uom.service";
import {CategoryService} from "../../../service/category.service";
import {CategoryModel} from "../../../model/Category.model";
import {UomDetailModel, UomModel} from "../../../model/Uom.model";

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class ListProductComponent implements OnInit {
  product: any
  f!: FormGroup
  fileUploaded: any;
  imagePath!: string;
  uomDetails: UomDetailModel[]=[];
  categories: any;
  imageId: any;
  deleteId: any;
  urlLink: string | ArrayBuffer = 'assets/dist/img/user.png';
  public Storage= "http://localhost:8080/api/v1";

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private http: HttpClient,
    public dialog: MatDialog,
    private toast: NgToastService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private uomService: UomService,
    public categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getproduct()
    this.getCategories()
    this.getUomDetail()
  }
  getEventValue($event:any) :string {
    return $event.target.value;
  }

  initForm() {
    this.f = this.fb.group({
      id: null,
      name: [null, Validators.required],
      code:[null,Validators.required],
      category_id: [null, Validators.required],
      item_variant_id: [null, Validators.required],
      qty: null,
      amt:null,
      price:null,
      active: null,
      photo: null,
      stock_alert: null,
      create_by: null,
      description: null
    });
  }
  openEdit(templateRef: TemplateRef<any>,pt: any) {
    this.dialog.open(templateRef, {
      width: '65%',
      height: '85%'
    });
    this.f.patchValue({
      ...pt,
      category_id:pt.category.id,
      item_variant_id:pt.itemVariantUom.id
    });
    this.imageId = pt.id
    this.imagePath = pt.photo
  }

  getproduct(){
    this.productService.getObj().subscribe(res=>{
      this.product = res.result
      // console.log(this.product)
    });
  }
  getCategories(){
    this.categoryService.getObj().subscribe(
      res=>{
        // console.log(res);
        this.categories = res.result;
      }
    )
  }

  getUomDetail() {
    this.uomService.getUomDetail().subscribe(res => {
      this.uomDetails = res.result

    })
  }

  confirmDelete(ptobj: any){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.onDelete(ptobj);
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
    this.productService.uploadImage(this.fileUploaded, 'Product_Photo').subscribe((res: any) => {
      this.imagePath = res.result.file;
      // console.log(this.imagePath)
    });
  }

  onSave(){
    this.productService.updateObj(this.f.value).subscribe(res=>{
      // console.log(this.imageId,"Image Id")
      console.log(res,'work')
        this.uploadImageProfile(this.imageId);
        this.getproduct();
        this.toast.success({detail:"SUCCESS",summary:'Your Success Message',duration:5000});
      }
    )
    this.onClose()
  }

  onClose(){
    this.dialog.closeAll()
  }

  getExport(){
    this.productService.export().subscribe(res=>{
      console.log(res,"export")
      let file = new Blob([res],{type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'})
      var fileUrl =URL.createObjectURL(file)
      window.open(fileUrl)
    })
  }

  uploadImageProfile(id:any) {
    this.productService.uploadImageProfile(id, this.imagePath).subscribe((res: any) => {
      // console.log(res,"upload profile");
      this.ngOnInit()
    });
  }

  onDelete(obj: any){
    this.deleteId = obj.id
    this.productService.delete(this.deleteId).subscribe(res=>{
      this.ngOnInit()
      // console.log(res," Deleted")
    });
  }



}
