import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../main/base/base.service";

@Injectable({
  providedIn:"root"
})
export class PurchaseService extends BaseService{
  protected URL = 'http://localhost:8080/api/v1/po'
  protected URLDetail = 'http://localhost:8080/api/v1/PurchaseOrderDetail'

  constructor(private httpClient: HttpClient) {
    super(httpClient,"/PurchaseOrder")
  }
  saveObj(obj: any){
    return this.http.post<any>( this.userUrl+'/'+obj.changeRate_id+'/'+obj.employee_id+'/'+obj.supplier_id,obj)
  }

  getPoDetailById(id: number){
    return this.http.get<any>(this.URLDetail+'/'+id)
  }

  getPo(){
    return this.http.get<any>(this.URL)
  }

  updateObj(obj: any){
    return this.http.put<any>(this.userUrl+'/'+obj.employee_id+'/'+obj.changeRate_id+'/'+obj.supplier_id+'/'+obj.id,obj)
  }


}
