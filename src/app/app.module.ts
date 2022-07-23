import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule} from '@angular/material/card'
import { MatDividerModule} from '@angular/material/divider';
import { MainHeaderComponent } from './layout/main-header/main-header.component';
import { MainFooterComponent } from './layout/main-footer/main-footer.component';
import { MainSidebarComponent } from './layout/main-sidebar/main-sidebar.component';
import { ContentWrapperComponent } from './layout/content-wrapper/content-wrapper.component';
import { ControlSidebarComponent } from './layout/control-sidebar/control-sidebar.component';
import { CategoryComponent } from './layout/category/category.component';
import { HomeComponent } from './layout/home/home.component';
import { TestPrimeNgComponent } from './layout/test-prime-ng/test-prime-ng.component';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import {ToastModule} from 'primeng/toast';
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
    TestPrimeNgComponent


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
    ButtonModule,
    ConfirmDialogModule,
    MessagesModule,
    ToastModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
