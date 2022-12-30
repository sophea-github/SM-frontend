import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../main/base/base.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn:"root"
})

export class ProductService extends BaseService{

  protected URL = 'http://localhost:8080/api/v1'
  public Storage= environment.baseServer

  // protected URLExport = 'http://localhost:8080/api/v1/product/export'

  constructor(private httpClient: HttpClient) {
      super(httpClient,"/product")
  }

  saveData(obj: any){
    return this.http.post<any>(this.userUrl+'/'+obj.category_id+'/'+obj.item_variant_id,obj)
  }

  updateObj(obj: any){
    return this.http.put<any>(this.userUrl+'/'+obj.category_id+'/'+obj.item_variant_id+'/'+obj.id,obj)
  }

  export(){
    // return this.http.get<any>(this.userUrl+'/'+'export',{responseType: 'arraybuffer' as 'json'})
    return this.http.get<any>(this.URL+'/'+'reportProduct',{responseType: 'arraybuffer' as 'json'})
  }

  /*** Upload Single Image */
  uploadImage(file: any, type: string) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.Storage}/upload-image-/${type}`, formData);
  }

  uploadImageProfile(id: number, photo: string) {
    // @ts-ignore
    return this.http.post<any>(`${this.userUrl}/${id}?photo=${photo}`);
  }

}
