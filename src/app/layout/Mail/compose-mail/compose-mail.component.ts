import { Component, OnInit } from '@angular/core';
// @ts-ignore
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {composeMailService} from "../../../service/compose-mail.service";
import {NgToastService} from "ng-angular-popup";


@Component({
  selector: 'app-compose-mail',
  templateUrl: './compose-mail.component.html',
  styleUrls: ['./compose-mail.component.scss']
})
export class ComposeMailComponent implements OnInit {
  public Editor = ClassicEditor;
  f!: FormGroup
  tomail: any
  sj: any
  msg: any
  fl: any
  img: any
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  constructor(
    private fb: FormBuilder,
    private composemailService: composeMailService,
    private toast: NgToastService,
  ) { }

  ngOnInit(): void {
    this.initForm()
  }
  initForm(){
    this.f = this.fb.group({
      id: null,
      subject: [null, Validators.required],
      message:[null,Validators.required],
      toemail: [null, [Validators.required, Validators.pattern(this.emailPattern)]],
      file: null
    });
  }

  send(){
    this.tomail = this.f.value.toemail
    this.msg = this.f.value.message
    this.sj = this.f.value.subject
    this.fl= this.f.value.file
    this.composemailService.sendMail(this.tomail,this.sj,this.msg).subscribe(res=>{
      // console.log(res)
      this.toast.success({detail:"SUCCESS",summary:'Send Mail Success',duration:5000});
    })
  }


}
