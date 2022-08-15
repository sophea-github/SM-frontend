import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: "root"
})


export class EmployeeService{

  protected URL ="http://localhost:8080/api/v1/employee"
  public Storage= "http://localhost:8080/api/v1"

  constructor(private http: HttpClient) {
  }

  getData(){
    return this.http.get<any>(this.URL)
  }

  saveData(obj: any){
    return this.http.post<any>(this.URL,obj)
  }

  updateObj(obj: any){
    return this.http.put<any>(this.URL+'/'+obj.id,obj)
  }

  deleteObj(obj: any){
    return this.http.delete<any>(this.URL+"/"+obj)
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

  // deleteImage(imagename){
  //   return this.http.delete<any>()
  // }

}
