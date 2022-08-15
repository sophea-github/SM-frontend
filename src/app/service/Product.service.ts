import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn:"root"
})

export class ProductService{

  protected URL = 'http://localhost:8080/api/v1/product'
  public Storage= "http://localhost:8080/api/v1"

  // protected URLExport = 'http://localhost:8080/api/v1/product/export'

  constructor(
    private http: HttpClient,
  ) {

  }

  getData(){
    return this.http.get<any>(this.URL)
  }

  saveData(obj: any){
    return this.http.post<any>(this.URL+'/'+obj.category_id+'/'+obj.item_variant_id,obj)
  }

  updateObj(obj: any){
    return this.http.put<any>(this.URL+'/'+obj.category_id+'/'+obj.item_variant_id+'/'+obj.id,obj)
  }

  deleteObj(obj: any){
    return this.http.delete<any>(this.URL+'/'+obj)
  }

  export(){
    return this.http.get<any>(this.URL+'/'+'export',{responseType: 'arraybuffer' as 'json'})
  }

  /*** Upload Single Image */
  uploadImage(file: any, type: string) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.Storage}/upload-image-/${type}`, formData);
  }

  uploadImageProfile(id: number, photo: string) {
    // @ts-ignore
    return this.http.post<any>(`${this.URL}/${id}?photo=${photo}`);
  }

}
