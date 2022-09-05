import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {LoginModel, LoginResponse, UserInfo,Data} from "./login.model";
import {AuthService} from "../service/Auth.service";
import {flip} from "@popperjs/core";
import {Router} from "@angular/router";
import {BaseResponse} from "./BaseResponse";
import {JwtHelperService} from "@auth0/angular-jwt";
import {BaseVisitor} from "@angular/localize/tools/src/translate/translation_files/base_visitor";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userInfo= new  BehaviorSubject<UserInfo | null>(null);
  f!: FormGroup;
  loginErr?: string;
  loginSuccess?: string;
  isLoading = false;
  loading = false;
  userProfile: any;

  // @ts-ignore
  helper = new JwtHelperService();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // @ts-ignore
    document.getElementById('autofocus').focus();
  }

  initForm(): void {
    this.f = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      rememberMe: [false]
    });
    const userData = JSON.parse(<string>localStorage.getItem('REMEMBER') ) as LoginModel;
    if (userData) {
      this.f.controls['username'].setValue(userData.username);
      this.f.controls['password'].setValue(userData.password);
      this.f.controls['rememberMe'].setValue(userData.rememberMe);

    }
    // console.log(userData)

  }
  Login(loginData: LoginModel){
    // console.log('login', loginData);
    if (!loginData.username) {
      this.loginErr = 'Please enter username.';
    } else if (!loginData.password) {
      this.loginErr = 'Please enter password.';
    }else{
      this.loginErr = '';
      // this.loginSuccess = 'Login Success';
      const merge = Object.assign({
        username: loginData.username,
        // password: loginData.password
        password: this.authService.Encrypt(loginData.password)
      });
      console.log('merge'+ merge)
      this.authService.login(loginData).subscribe((res) =>{
        console.log(res.total)
        if (res.total === 200 ) {
          sessionStorage.setItem("Token :",res.result);
          if (loginData.rememberMe === true) {
            this.authService.rememberLoginUser(res.result);
            localStorage.setItem('REMEMBER', JSON.stringify(loginData));
          } else {
            console.log('not remember')
            localStorage.removeItem('REMEMBER');
            this.authService.setLoginUser(res.result);
          }
          localStorage.setItem(this.authService.localUserKey, JSON.stringify(loginData))
          this.router.navigate(['dashboard/home'])

        }else if(res.total === 404) {
          // this.isLoading = false;
          this.loginErr = "Login Failed !!";
        }else if(res.total === 401) {
          // this.isLoading = false;
          this.loginErr = "Check Password Again !!";
        }else if(res.total === 403 || res.total === 402) {
          // this.isLoading = false;
          this.loginErr = "Your Account has been locked 3 Minute !!";
        }else if( res.total === 406) {
          // this.isLoading = false;
          this.loginErr = "Your account has been unlocked please try login again !!";
        }
      });
    }
  }


  statusSuccess(data: UserInfo) {

    this.loginSuccess = 'Authentication successfully.';

    if (this.f.controls['rememberMe']) {
       localStorage.setItem(this.authService.localUserKey, JSON.stringify(data));
      console.log('localUserKey:'+ localStorage.setItem(this.authService.localUserKey, JSON.stringify(data)))
      localStorage.setItem(this.authService.isExpired, JSON.stringify(1));
    } else {
      sessionStorage.setItem(this.authService.localUserKey, JSON.stringify(data));
      sessionStorage.setItem(this.authService.isExpired, JSON.stringify(1));
    }
    setTimeout(() => {
      this.router.navigate(['dashboard/home']).then(r => {
        console.log(r);
      });
    }, 100);
  }

}
