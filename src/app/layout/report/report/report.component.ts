import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReportService} from "../../../service/report.service";
// @ts-ignore
import {TypeModel} from "../../../model/Type.model";
import {GenderModel} from "../../../model/Gender.model";

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
              private reportService: ReportService
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
      let file = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'})
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl)
    })
  }

  getExportAdjustment(obj: any) {
    this.reportService.generateAdjustment(obj).subscribe(res => {
      let file = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'})
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl)
    })
  }

}
