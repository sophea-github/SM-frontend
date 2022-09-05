import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../main/base/base.service";



// @ts-ignore
@Injectable({
  providedIn: "root"
})
// @ts-ignore
export class composeMailService extends BaseService{

  // protected URL = "192.168.5.51:8080/api/v1"
  protected URL = "http://localhost:8080/api/v1"

  constructor(private override http: HttpClient) {
    super(http,'/mail')
  }


  sendMail(toemail:string,subject: string,message: string){
       return this.http.get<any>(`${this.userUrl}?toEmail=${toemail}&subject=${subject}&message=${message}`)
  }

}
