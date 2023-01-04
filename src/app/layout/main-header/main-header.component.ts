import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/Auth.service";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class MainHeaderComponent implements OnInit {
  userProfile?: string
  constructor(
    private authService: AuthService,
    private confirmationService: ConfirmationService,
  ) {

  }

  ngOnInit(): void {
    this.userProfile = this.authService.getLoginUser().username
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
