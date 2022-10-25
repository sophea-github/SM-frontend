import { NgToastService } from 'ng-angular-popup';
import { Component, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {FormBuilder} from "@angular/forms";
// import { ConfirmationService, Message, MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class BaseComponent implements OnInit {

  fb!: FormBuilder
  constructor(
    private toast: NgToastService
    ) { }

  ngOnInit(): void {
  }

  showSuccess(msg: string) {
    this.toast.success({detail:msg,summary:'Your Success Message',duration:5000});
  }

  showError(msg: string) {
    this.toast.error({detail:msg,summary:'Your Error Message',sticky:true});
  }

  showInfo(msg: string) {
    this.toast.info({detail:msg,summary:'Your Info Message',sticky:true});
  }



  // showWarn(msg: string) {
  //   this.toast.warn({detail:msg,summary:'Your Warn Message',duration:5000});
  // }


}
