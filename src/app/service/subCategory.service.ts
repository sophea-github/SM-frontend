import { BaseService } from './../main/base/base.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: "root"
})

export class subCategoryService{
  protected userUrl = environment.baseServer;
  protected baseUrl = environment.baseServer;

  protected URL = 'http://localhost:8080/api/v1/subCategories'

  constructor(private http:HttpClient, protected baseService: BaseService){

  }

  getData(){
    return this.http.get<any>(this.URL);

  }

  findId(id: number){
    return this.baseService.show(id);
  }

  saveData(obj: any){
    return this.http.post<any>(this.URL+'/'+obj.category_id, obj);
  }

  updateObject(obj: any) {
    return this.http.put<any>(this.URL+'/'+obj.id,obj)
  }

  deleteObj(obj: any){
    return this.http.delete<any>(obj)
  }

}
