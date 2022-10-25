import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../main/base/base.service";

@Injectable({
  providedIn:"root"
})
export class PurchaseReceiveService extends BaseService{
  // protected URL = 'http://localhost:8080/api/v1/PurchaseOrder'
  protected URLDetail = 'http://localhost:8080/api/v1/PurchaseOrderDetail'

  constructor(private httpClient: HttpClient) {
    super(httpClient,"/PurchaseReceive")
  }
  saveObj(obj: any){
    return this.http.post<any>( this.userUrl+'/'+obj.employee_id,obj)
  }
  //
  getPorById(id: number){
    return this.http.get<any>(this.userUrl+'/por/'+id)
  }

  getProPirce(id: number, code: string){
    return this.http.get<any>(this.userUrl+'/'+id+'/'+code)
  }
  //
  // updateObj(obj: any){
  //   return this.http.put<any>(this.userUrl+'/'+obj.employee_id+'/'+obj.changeRate_id+'/'+obj.supplier_id+'/'+obj.id,obj)
  // }


}
