import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthService} from "../service/Auth.service";
import {Injectable} from "@angular/core";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log("my token:"+this.authService.token)
    if (this.authService.token != null) {
      // add authorization header with jwt token if available
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.token}`
        }
      });
    } else {
      // add authorization header with jwt token if available
      request = request.clone({
        setHeaders: {
        }
      });
    }
    return next.handle(request);
  }
}
