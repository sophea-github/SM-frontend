import { Component, OnInit } from '@angular/core';
import {ConfirmationService, ConfirmEventType, Message, MessageService, PrimeNGConfig} from 'primeng/api';

@Component({
  selector: 'app-test-prime-ng',
  templateUrl: './test-prime-ng.component.html',
  styleUrls: ['./test-prime-ng.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class TestPrimeNgComponent implements OnInit {
  msgs: Message[] = [];

  public position: string | any;
  constructor(private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }


  confirm1() {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
        },
        reject: () => {
            this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
    });
}

confirm2() {
    this.confirmationService.confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
            this.msgs = [{severity:'info', summary:'Confirmed', detail:'Record deleted'}];
        },
        reject: () => {
            this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
    });
}

// confirmPosition(position: string) {
//     this.position = position;

//     this.confirmationService.confirm({
//         message: 'Do you want to delete this record?',
//         header: 'Delete Confirmation',
//         icon: 'pi pi-info-circle',
//         accept: () => {
//             this.msgs = [{severity:'info', summary:'Confirmed', detail:'Record deleted'}];
//         },
//         reject: () => {
//             this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
//         },
//         key: "positionDialog"
//     });
// }

}
