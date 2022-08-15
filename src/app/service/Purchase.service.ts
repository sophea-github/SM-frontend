import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn:"root"
})
export class PurchaseService{
  protected URL = 'http://localhost:8080/api/v1/PurchaseOrder'
  // protected URL = 'http://localhost:8080/api/v1/PurchaseOrderDetail'

  constructor(private http: HttpClient) {

  }

  getData(){
    return this.http.get<any>(this.URL)
  }

  saveObj(obj: any){
    return this.http.post<any>( this.URL+'/'+obj.employee_id+'/'+obj.product_id+'/'+obj.item_variant_id,obj)
  }

  updateObj(obj: any){
    return this.http.put<any>(this.URL+'/'+obj.employee_id+'/'+obj.product_id+'/'+obj.item_variant_id+'/'+obj.id,obj)
  }

  delete(id: any)
  {
    return this.http.delete<any>(this.URL+'/'+id)
  }


}
