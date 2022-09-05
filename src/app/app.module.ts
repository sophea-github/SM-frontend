import { BaseComponent } from './main/base/base.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { MatCardModule} from '@angular/material/card'
import { MatDividerModule} from '@angular/material/divider';
import { MainHeaderComponent } from './layout/main-header/main-header.component';
import { MainFooterComponent } from './layout/main-footer/main-footer.component';
import { MainSidebarComponent } from './layout/main-sidebar/main-sidebar.component';
import { ContentWrapperComponent } from './layout/content-wrapper/content-wrapper.component';
import { ControlSidebarComponent } from './layout/control-sidebar/control-sidebar.component';
import { CategoryComponent } from './layout/category/category.component';
import { HomeComponent } from './layout/home/home.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { NgToastModule } from 'ng-angular-popup';
import {TableModule} from "primeng/table";
import {DropdownModule} from "primeng/dropdown";
import { SubCategoryComponent } from './layout/sub-category/sub-category.component';
import { SupplierComponent } from './layout/supplier/supplier.component';
import { ListEmployeeComponent } from './layout/employee/list-employee/list-employee.component';
import { CreateEmployeeComponent } from './layout/employee/create-employee/create-employee.component';
import { UomComponent } from './layout/uom/uom.component';
import { ListProductComponent } from './layout/Product/list-product/list-product.component';
import { CreateProductComponent } from './layout/Product/create-product/create-product.component';
import { PurchaseOrderComponent } from './layout/Purchase/purchase-order/purchase-order.component';
import { ListPurchaseComponent } from './layout/Purchase/list-purchase/list-purchase.component';
import { ComposeMailComponent } from './layout/Mail/compose-mail/compose-mail.component';
// import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ChnageRateComponent } from './layout/chnage-rate/chnage-rate.component';
import {NgbButtonsModule} from "@ng-bootstrap/ng-bootstrap";
import { UserComponent } from './layout/User/user/user.component';
import { AddUserComponent } from './layout/User/add-user/add-user.component';
// import { EmployeeComponent } from './layout/employee/employee.component';
import {MatSelectModule} from '@angular/material/select';
import {MultiSelectModule} from 'primeng/multiselect';
import { DashboardComponent } from './layout/Dashboard/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import {TokenInterceptor} from "./guard/token.interceptor";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {AuthGuard} from "./guard/auth.guard";


// @ts-ignore
// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    MainFooterComponent,
    MainSidebarComponent,
    ContentWrapperComponent,
    ControlSidebarComponent,
    CategoryComponent,
    HomeComponent,
    BaseComponent,
    SubCategoryComponent,
    SupplierComponent,
    ListEmployeeComponent,
    CreateEmployeeComponent,
    UomComponent,
    ListProductComponent,
    CreateProductComponent,
    PurchaseOrderComponent,
    ListPurchaseComponent,
    ComposeMailComponent,
    ChnageRateComponent,
    UserComponent,
    AddUserComponent,
    DashboardComponent,
    LoginComponent,


    // EmployeeComponent

  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatDialogModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        MatCardModule,
        MatDividerModule,
        ConfirmDialogModule,
        MessagesModule,
        NgToastModule,
        TableModule,
        DropdownModule,
        CKEditorModule,
        NgbButtonsModule,
        MatSelectModule,
        MultiSelectModule,
    ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
