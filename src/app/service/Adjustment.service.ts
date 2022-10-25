import {BaseService} from "../main/base/base.service";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn:"root"
})
export class AdjustmentService extends BaseService{

  constructor(protected httpClient: HttpClient) {
    super(httpClient,"/adjustment");
  }

  saveAdjustment(obj: any){
    return this.http.post<any>(this.userUrl+'/'+obj.adjustmentType_id, obj)
  }

  ListEditAdjustment(obj: any){
    return this.http.post<any>(this.userUrl+'/'+obj.id, obj)
  }
  saveUpdate(obj: any){
    return this.http.put<any>(this.userUrl+'/'+obj.adjustmentType_id+'/'+obj.id, obj)
  }



}
