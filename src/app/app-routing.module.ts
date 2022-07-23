import { TestPrimeNgComponent } from './layout/test-prime-ng/test-prime-ng.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CategoryComponent } from './layout/category/category.component';
import { HomeComponent } from './layout/home/home.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'category',component: CategoryComponent},
  {path: 'primeNG',component: TestPrimeNgComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
