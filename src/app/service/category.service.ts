import { BaseService } from './../main/base/base.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: "root"
})

export class CategoryService{

  protected URL ='http://localhost:8080/api/v1/category';

  constructor(private http:HttpClient){

  }

  getData(){
    return this.http.get<any>(this.URL);

  }

  saveData(obj: any){
    return this.http.post<any>(this.URL, obj);
  }

  updateObject(obj: any) {
    return this.http.put<any>(this.URL+'/'+obj.id,obj)
  }

  deleteObj(obj: any){
    return this.http.delete<any>(this.URL+'/'+obj)
  }

  // getData(path: string){
  //  return this.baseService.getObj(path);
  //
  // }
  //
  // saveData(obj: any){
  //   return this.baseService.create(obj);
  // }
  //
  // updateObject(obj: any) {
  //   return this.baseService.update(obj);
  //   // return this.http.put<any>(this.userUrl + '/' + obj.id, obj);
  // }
  //
  // deleteObj(obj: any){
  //   return this.baseService.delete(obj)
  // }

}
