import {Injectable} from "@angular/core";
import {BaseService} from "../main/base/base.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: "root"
})

export class UserService {

  protected URL ='http://localhost:8080/api/auth/user';
  protected Storage =environment.baseServer;

  constructor(public http:HttpClient){

  }



  /*** Upload Single Image */
  uploadImage(file: any, type: string) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.Storage}/upload-image-/${type}`, formData);
  }

  uploadImageProfile(id: number, photo: string) {
    // @ts-ignore
    return this.http.post<any>(`${this.URL}/upload/${id}?photo=${photo}`);
  }

  getData(){
    return this.http.get<any>(this.URL)
  }

  updateObj(obj: any) {
    return this.http.put<any>(this.URL + '/' + obj.role_id+'/'+obj.id, obj);
  }

  create(obj: any) {
    return this.http.post<any>(this.URL+'/'+ obj.role_id, obj);
  }

  delete(obj: any){
    return this.http.delete<any>(this.URL + '/' + obj);
  }



}
