import { Component, OnInit } from '@angular/core';
import {NgToastService} from "ng-angular-popup";
import {ConfirmationService, MessageService} from "primeng/api";
import {AuthService} from "../../service/Auth.service";
import {Router} from "@angular/router";
import {UserInfo} from "../../login/login.model";

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class MainSidebarComponent implements OnInit {
  userProfile?: string

  constructor(
    private toast: NgToastService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
    private route: Router
  ) { }

  ngOnInit(): void {
    // console.log('main side: '+this.authService.localUserKey)
    this.userProfile = this.authService.getLoginUser().username
    // console.log(this.userProfile)
  }

  logout() {
    // event.preventDefault();
    this.confirmationService.confirm({
      message: 'Are you sure, you require to sign out?',
      header: 'Sign Out',
      icon: 'fa fa-sign-in',
      accept: () => {
        this.authService.logout();
      }
    });
  }

}
