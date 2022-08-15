import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: "root"
})

export class UomService{

  protected URL = "http://localhost:8080/api/v1/uom"
  protected URLDetail = "http://localhost:8080/api/v1/uom_detail"

  constructor(private http: HttpClient) {
  }


  getUomData(){
    return this.http.get<any>(this.URL)
  }

  getUomDetail(){
    return this.http.get<any>(this.URLDetail)

  }
  saveUomDetail(obj: any){
    return this.http.post<any>(this.URLDetail+'/'+obj.uom_id,obj)
  }

  saveUom(obj: any){
    return this.http.post<any>(this.URL,obj)
  }

  updateObj(obj: any,um_id: number){
    return this.http.put<any>(`${this.URLDetail}/${um_id}`+'/'+obj.id,obj)
  }

  deleteObj(obj: any){
    return this.http.delete<any>(this.URLDetail+'/'+obj)
  }


}
