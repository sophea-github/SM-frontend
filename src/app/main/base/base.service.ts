import { HttpClient } from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import { environment } from 'src/environments/environment';
// import * as path from "path";

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  protected userUrl = environment.baseServer ;
  protected baseUrl = environment.baseServer;
  // public StorageRUL= "http://localhost:8080/api/v1"

  constructor(public http: HttpClient,private path:String) {
    this.userUrl = this.userUrl+path;
   }

   getObj() {
    return this.http.get<any>(this.userUrl);
  }

  show(id: number) {
    return this.http.get<any>(this.userUrl + '/' + id);
  }

  update(obj: any) {
      return this.http.put<any>(this.userUrl + '/' + obj.id, obj);
  }

  create(obj: any) {
      return this.http.post<any>(this.userUrl, obj);
  }

  delete(obj: any){
    return this.http.delete<any>(this.userUrl + '/' + obj);
  }

  // uploadImage(file: any, type: string) {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   return this.http.post(`${this.baseStorage}/upload-image-${type}`, formData);
  // }




}
