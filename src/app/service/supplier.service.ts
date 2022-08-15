
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: "root"
})

export class SupplierService{

  protected URL = 'http://localhost:8080/api/v1/supplier'

  constructor(private http:HttpClient){

  }

  getData(){
    return this.http.get<any>(this.URL);

  }

  // findId(id: number){
  //   return this.baseService.show(id);
  // }

  saveData(obj: any){
    return this.http.post<any>(this.URL, obj);
  }

  updateObject(obj: any) {
    return this.http.put<any>(this.URL+'/'+obj.id,obj)
  }

  deleteObj(obj: any){
    return this.http.delete<any>(this.URL+'/'+obj)
  }

}
