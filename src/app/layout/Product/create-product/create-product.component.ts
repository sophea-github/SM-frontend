import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../../service/Product.service";
import {CategoryService} from "../../../service/category.service";
import {UomService} from "../../../service/Uom.service";
import {NgToastService} from "ng-angular-popup";
import {Observable} from "rxjs";

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {

  f!: FormGroup
  urlLink: string | ArrayBuffer = 'assets/dist/img/user.png';
  fileUploaded: any;
  imagePath!: string;
  categories: any
  obj: any
  uomDetail: any
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public categoryService: CategoryService,
    private uomService: UomService,
    private toast: NgToastService,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getCategories()
    this.getUomDetail()
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

  getCategories(){
    this.categoryService.getData().subscribe(
      res=>{
        // console.log(res);
        this.categories = res.result;
      }
    )
  }

  getUomDetail() {
    this.uomService.getUomDetail().subscribe(res => {
      this.uomDetail = res.result

    })
  }

  saveObject(formObj: any) {
    this.obj = formObj;
    this.obj.photo = this.imagePath;
    this.productService.saveData(this.obj).subscribe(
      (res: any) => {
        console.log(res.total, " Status code ")
        if(res.total == 200){
          this.toast.success({detail:"SUCCESS",summary:'Your Success Message',duration:5000});
        }
        else if (res.total == 500){
          this.toast.warning({detail:"Error",summary:'Duplicate can not insert !!',duration:5000});
        }
        else{
          this.toast.error({detail:"Error",summary:'Check Field again !!',duration:5000});
        }
      });
  }



}
