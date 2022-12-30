import {Injectable} from '@angular/core';
import {BaseService} from "../main/base/base.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService {

  protected URL = 'http://localhost:8080/api/v1/reportPurchase'
  protected URLAdd = 'http://localhost:8080/api/v1/reportAdjustment'

  constructor(private httpClient: HttpClient) {
    super(httpClient, "/reportPurchase")
  }

  generatePurchase(obj: any) {
    return this.http.get<any>(this.URL + '/' + obj.startDate + '/' + obj.endDate, {responseType: 'arraybuffer' as 'json'})
  }

  generateAdjustment(obj: any) {
    return this.http.get<any>(this.URLAdd + '/' + obj.adjustment + '/' + obj.startDate + '/' + obj.endDate, {responseType: 'arraybuffer' as 'json'})
  }

}
