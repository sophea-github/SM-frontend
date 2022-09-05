import {Injectable} from "@angular/core";
import {BaseService} from "../main/base/base.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: "root"
})

export class RoleService extends BaseService{

  // protected URL ='http://localhost:8080/api/v1/category';

  constructor(public httpClient:HttpClient){
    super(httpClient,'/role');
  }


}
