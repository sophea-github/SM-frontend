
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CategoryComponent } from './layout/category/category.component';
import { HomeComponent } from './layout/home/home.component';
import {SubCategoryComponent} from "./layout/sub-category/sub-category.component";
import {SupplierComponent} from "./layout/supplier/supplier.component";
import {ListEmployeeComponent} from "./layout/employee/list-employee/list-employee.component";
import {CreateEmployeeComponent} from "./layout/employee/create-employee/create-employee.component";
import {UomComponent} from "./layout/uom/uom.component";
import {ListProductComponent} from "./layout/Product/list-product/list-product.component";
import {CreateProductComponent} from "./layout/Product/create-product/create-product.component";
import {PurchaseOrderComponent} from "./layout/Purchase/purchase-order/purchase-order.component";
import {ListPurchaseComponent} from "./layout/Purchase/list-purchase/list-purchase.component";
import {ComposeMailComponent} from "./layout/Mail/compose-mail/compose-mail.component";
import {ChnageRateComponent} from "./layout/chnage-rate/chnage-rate.component";
import {UserComponent} from "./layout/User/user/user.component";
import {AddUserComponent} from "./layout/User/add-user/add-user.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./guard/auth.guard";
// import {EmployeeComponent} from "./layout/employee/employee.component";

const routes: Routes = [
  // {path: '', component: HomeComponent},
  // {path: 'category', component: CategoryComponent},
  // {path: 'subCategory', component: SubCategoryComponent},
  // {path: 'supplier', component: SupplierComponent},
  // {path: 'list-employee', component: ListEmployeeComponent},
  // {path:'create-employee', component: CreateEmployeeComponent},
  // {path:'uom', component: UomComponent},
  // {path:'list-product', component: ListProductComponent},
  // {path:'create-product', component: CreateProductComponent},
  // {path:'create-purchase-order', component: PurchaseOrderComponent},
  // {path:'list-purchase-order', component: ListPurchaseComponent},
  // {path: 'compose-mail', component: ComposeMailComponent},
  // {path: 'change-rate', component: ChnageRateComponent},
  // {path: 'user', component: UserComponent},
  // {path: 'create-user', component: AddUserComponent}
  {path:'login',component: LoginComponent},
  {path:'',redirectTo: '/login',pathMatch:'full'},
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: ()=> import('./layout/Dashboard/dashboard/dashboard.module').then((m)=> m.DashboardModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
