import { BaseService } from './../main/base/base.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: "root"
})

export class CategoryService extends BaseService{

  // protected URL ='http://localhost:8080/api/v1/category';

  constructor(public httpClient:HttpClient){
  super(httpClient,'/category');
  }

  // getData(){
  //   return this.httpClient.get<any>(this.userUrl);
  //
  // }

}
