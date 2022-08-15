import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {PurchaseService} from "../../../service/Purchase.service";
import {UomService} from "../../../service/Uom.service";
import {ProductService} from "../../../service/Product.service";
import {EmployeeService} from "../../../service/employee.service";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {
  f!: FormGroup
  uomDetail: any
  product: any
  employee: any
  // POrder: any
  constructor(
    private purchaseService: PurchaseService,
    private fb: FormBuilder,
    private uomService: UomService,
    private productService: ProductService,
    private employeeService: EmployeeService,
    private toast: NgToastService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getUomDetail()
    this.getProduct()
    this.getEmployee()

  }

  initForm() {
    this.f = this.fb.group({
      id: null,
      order_date: null,
      product_id: [null, Validators.required],
      employee_id: [null, Validators.required],
      item_variant_id: [null, Validators.required],
      qty: null,
      amt:null,
      price:null,
      active: null,
      create_by: null,
      description: null
    });
  }

  getUomDetail() {
    this.uomService.getUomDetail().subscribe(res => {
      this.uomDetail = res.result

    })
  }

  getProduct(){
    this.productService.getData().subscribe(res=>{
      this.product = res.result
      // console.log(this.product)
    })
  }

  getEmployee(){
    this.employeeService.getData().subscribe(res=>{
      this.employee = res.result
      // console.log(this.employee)
    })
  }



  saveObject(formObj: any){
    this.purchaseService.saveObj(formObj).subscribe(res=>{
      this.toast.success({summary: 'Confirmed', detail: 'Record deleted', duration: 5000});
    })
  }



}
