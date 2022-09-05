import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Data, LoginModel, UserInfo} from "../login/login.model";
import {map, Observable} from "rxjs";
// @ts-ignore
import * as forge from 'node-forge';
import {JwtHelperService} from "@auth0/angular-jwt";


@Injectable({
  providedIn: "root"
})

export class AuthService {
  protected URL ='http://localhost:8080/api/auth';
  public localUserKey = 'CurrentUser';
  public isExpired = 'IsExpired';
  public token?: String | null
  // @ts-ignore
  helper = new JwtHelperService();
  public salt?: string;
  public iv?: string;
  KEY = 'aesEncryptionKey';
  IV = 'encryptionIntVec';
  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    if (localStorage.getItem('token')) {
      this.token = JSON.parse(localStorage.getItem('token') as string);
    } else if (sessionStorage.getItem('token')) {
      this.token = JSON.parse(sessionStorage.getItem('token') as string);
    }
  }

  login(data: LoginModel): Observable<any> {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    return this.http.post<any>(`${this.URL}/signin`, data);
  }


  setLoginUser(data: Data) {
    console.log('Hey data: ', data);
    sessionStorage.setItem('token', JSON.stringify(data));
  }

  rememberLoginUser(data: Data) {
    localStorage.setItem('token', JSON.stringify(data));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  logout(): void {
    this.token = null;
    sessionStorage.clear();
    localStorage.removeItem(this.localUserKey);
    localStorage.removeItem('token');
    localStorage.removeItem('REMEMBER');
    this.router.navigate(['/login']);
  }

  // @ts-ignore
  getLoginUser(): UserInfo {
    if (localStorage.getItem(this.localUserKey)) {
      return JSON.parse(localStorage.getItem(this.localUserKey) as string) as UserInfo;
    } else if (sessionStorage.getItem(this.localUserKey) as string) {
      return JSON.parse(sessionStorage.getItem(this.localUserKey) as string) as UserInfo;
    }
  }
  Encrypt(decrypted:any) {
    const salt = forge.random.getBytesSync(128);
    const key = this.KEY;
    const iv = this.IV;

    const cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv});
    cipher.update(forge.util.createBuffer(decrypted));
    cipher.finish();
    const cipherText = forge.util.encode64(cipher.output.getBytes());

    const result = forge.util.encode64(decrypted);
    this.salt = forge.util.encode64(salt);
    this.iv = forge.util.encode64(iv);
    return cipherText;
  }


  public getUserInfo(): Observable<any> {
    if (localStorage.getItem('token')) {
      this.token = JSON.parse(<string>localStorage.getItem('token'));
      console.log("local token:"+ this.token)

    } else if (sessionStorage.getItem('token')) {
      this.token = JSON.parse(<string>sessionStorage.getItem('token'));
      console.log("session token:"+ this.token)
    }
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`
      })
    };
      console.log("http"+httpOptions)
      return this.http.get(`${this.URL}/user`,httpOptions);
    }

  // @ts-ignore
  checkExpired() {
    if (localStorage.getItem(this.localUserKey)) {
      return localStorage.getItem(this.isExpired);
    } else if (sessionStorage.getItem(this.localUserKey)) {
      return sessionStorage.getItem(this.isExpired);
    }
  }


}
