import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "../../home/home.component";
import {CategoryComponent} from "../../category/category.component";
import {SubCategoryComponent} from "../../sub-category/sub-category.component";
import {SupplierComponent} from "../../supplier/supplier.component";
import {ListEmployeeComponent} from "../../employee/list-employee/list-employee.component";
import {CreateEmployeeComponent} from "../../employee/create-employee/create-employee.component";
import {UomComponent} from "../../uom/uom.component";
import {ListProductComponent} from "../../Product/list-product/list-product.component";
import {CreateProductComponent} from "../../Product/create-product/create-product.component";
import {PurchaseOrderComponent} from "../../Purchase/purchase-order/purchase-order.component";
import {ListPurchaseComponent} from "../../Purchase/list-purchase/list-purchase.component";
import {ComposeMailComponent} from "../../Mail/compose-mail/compose-mail.component";
import {ChnageRateComponent} from "../../chnage-rate/chnage-rate.component";
import {UserComponent} from "../../User/user/user.component";
import {AddUserComponent} from "../../User/add-user/add-user.component";
import {DashboardComponent} from "./dashboard.component";
import {AuthGuard} from "../../../guard/auth.guard";

const routes: Routes = [
  {path:'',component:DashboardComponent,
    children:[
      {path: 'home', component:HomeComponent},
      {path: 'category', component: CategoryComponent},
      {path: 'subCategory', component: SubCategoryComponent},
      {path: 'supplier', component: SupplierComponent},
      {path: 'list-employee', component: ListEmployeeComponent},
      {path: 'create-employee', component: CreateEmployeeComponent},
      {path: 'uom', component: UomComponent},
      {path: 'list-product', component: ListProductComponent},
      {path: 'create-product', component: CreateProductComponent},
      {path: 'create-purchase-order', component: PurchaseOrderComponent},
      {path: 'list-purchase-order', component: ListPurchaseComponent},
      {path: 'compose-mail', component: ComposeMailComponent},
      {path: 'change-rate', component: ChnageRateComponent},
      {path: 'user', component: UserComponent},
      {path: 'create-user', component: AddUserComponent},
      {path: '', redirectTo:'/dashboard/home', pathMatch: 'full'}
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
