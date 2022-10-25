import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/Auth.service";

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  userProfile?: string
  constructor(
    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    this.userProfile = this.authService.getLoginUser().username
  }

}
