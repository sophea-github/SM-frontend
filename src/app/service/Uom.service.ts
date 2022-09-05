import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BaseService} from "../main/base/base.service";

@Injectable({
  providedIn: "root"
})

export class UomService extends BaseService{

  // protected URL = environment.baseServer+"/uom"
  protected URLDetail = environment.baseServer+"/uom_detail"

  constructor(private httpClient: HttpClient) {
    super(httpClient,"/uom")
  }

  // getUomData(){
  //   return this.http.get<any>(this.URL)
  // }

  getUomDetail(){
    return this.http.get<any>(this.URLDetail)
  }
  saveUomDetail(obj: any){
    return this.http.post<any>(this.URLDetail+'/'+obj.uom_id,obj)
  }

  // saveUom(obj: any){
  //   return this.http.post<any>(this.URL,obj)
  // }

  updateObj(obj: any,um_id: number){
    return this.http.put<any>(`${this.URLDetail}/${um_id}`+'/'+obj.id,obj)
  }

  deleteObj(obj: any){
    return this.http.delete<any>(this.URLDetail+'/'+obj)
  }


}
