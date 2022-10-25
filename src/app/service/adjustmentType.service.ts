import {BaseService} from "../main/base/base.service";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn:"root"
})
export class AdjustmentTypeService extends BaseService{

  constructor(protected httpClient: HttpClient) {
    super(httpClient,"/adjustmentType");
  }
}
