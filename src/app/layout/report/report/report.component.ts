import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReportService} from "../../../service/report.service";
// @ts-ignore
import {TypeModel} from "../../../model/Type.model";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  f!: FormGroup
  type: TypeModel[] = []
  selectType!: TypeModel;

  constructor(protected fb: FormBuilder,
              private reportService: ReportService,
              private toast: NgToastService,
  ) {
    this.type = [
      {type: 'Addjust Stock'},
      {type: 'Deduct Stock'},
    ];
  }

  ngOnInit(): void {
    this.initForm()

  }

  initForm() {
    this.f = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      adjustment: [null],
    })
  }

  getExport(obj: any) {
    this.reportService.generatePurchase(obj).subscribe(res => {
      console.log("res length:" , res.byteLength)
      if(res.byteLength == 0) {
        this.toast.error({summary: 'Do not have data !!', detail: 'Data Nullable !!', duration: 5000});
      } else {
        let file = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'})
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = 'Purchase.xls';
        a.click()
      }
    })
  }

  getExportAdjustment(obj: any) {
    this.reportService.generateAdjustment(obj).subscribe(res => {
      if (res.byteLength == 0) {
        this.toast.error({summary: 'Do not have data !!', detail: 'Data Nullable !!', duration: 5000});
      } else {
        let file = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'})
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = 'Adjustment.xls';
        a.click()
      }
    })
  }

}
