import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: "root"
})

export class ChangeRateService {

  protected URL = 'http://localhost:8080/api/v1/changeRate'

  constructor(private http: HttpClient) {

  }

  getData() {
    return this.http.get<any>(this.URL);

  }

  saveData(obj: any) {
    return this.http.post<any>(this.URL, obj);
  }

  updateObject(obj: any) {
    return this.http.put<any>(this.URL + '/' + obj.id, obj)
  }

  deleteObj(obj: any) {
    return this.http.delete<any>(this.URL + '/' + obj)
  }
}
