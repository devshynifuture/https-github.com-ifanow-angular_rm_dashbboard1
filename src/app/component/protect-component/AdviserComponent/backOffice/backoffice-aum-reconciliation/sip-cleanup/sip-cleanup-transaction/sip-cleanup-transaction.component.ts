import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { BackOfficeService } from '../../../back-office.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-sip-cleanup-transaction',
  templateUrl: './sip-cleanup-transaction.component.html',
  styleUrls: ['./sip-cleanup-transaction.component.scss']
})
export class SipCleanupTransactionComponent implements OnInit {
  displayedColumns1: string[] = ['checkbox', 'transactionType', 'date', 'amount', 'units', 'balanceUnits', 'action'];
  displayedColumns2: string[] = ['srNo', 'transactionType', 'date', 'amount', 'nav', 'units',];
  dataSource1 = new MatTableDataSource<PeriodicElement1>(ELEMENT_DATA1); // with delete operation
  //dataSource2 = new MatTableDataSource<PeriodicElement2>(ELEMENT_DATA2); // with keep and remove operation
  data;
  isLoading: boolean;
  transactionType: boolean = true;
  historicalTransaction: boolean = true;
  checktran: any;
  checktranHistorical: any;
  sendObj: { showAllTransactionType: number; showHistoricTransaction: number; sipId: any; };
  statusData: any;
  dataSource2: any[];
  constructor(private backOfficeService: BackOfficeService,
    private subInjectService: SubscriptionInject,
    private eventService: EventService) { }

  ngOnInit() {
    this.statusData = []
    console.log(this.data)
    this.statusData.push(this.data)
    this.getSipCleanupTransaction(null)
  }
  selectAllTransaction(eve) {
    this.checktran = eve.checked
    let data = {
      showAllTransactionType: (this.checktran == false) ? 0 : 1,
      showHistoricTransaction: (this.checktranHistorical == false) ? 0 : 1,
      sipId: this.data.id
    }
    this.getSipCleanupTransaction(data)
  }
  selectHistoricalTransaction(eve) {
    this.checktranHistorical = eve.checked
    let data = {
      showAllTransactionType: (this.checktran == false) ? 0 : 1,
      showHistoricTransaction: (this.checktranHistorical == false) ? 0 : 1,
      sipId: this.data.id
    }
    this.getSipCleanupTransaction(data)
  }
  getSipCleanupTransaction(obj) {
    this.isLoading = true
    this.dataSource2 = []
    if (obj) {
      this.sendObj = obj
    } else {
      this.sendObj = {
        showAllTransactionType: 1,
        showHistoricTransaction: 1,
        sipId: this.data.id
      }
    }
    this.backOfficeService.getSipCleanupTransaction(this.sendObj).subscribe(
      (res) => {
        // this.isLoading = false;
        if (res) {
          console.log("this is backoffice sip cleanup data", res);
          this.dataSource2 = res;
        } else {
          this.isLoading = false;
          this.eventService.openSnackBar("No Data Found!", "DISMISS");
          this.dataSource2 = null;

        }
      },
      (err) => {
        this.dataSource2 = [];
      }
    );
  }
  dialogClose() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' })
  }
}
interface PeriodicElement1 {
  position: number;
  checkbox: string;
  transactionType: string;
  date: string;
  amount: string;
  units: string;
  balanceUnits: any;
  action: string;
  id: number;
  canDeleteTransaction: boolean;
  effect: any;
}

interface PeriodicElement2 {
  transactionType: string;
  date: string;
  amount: string;
  nav: string;
  units: string;
  action: string;
  keep: boolean;
  id: number;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { position: 1, checkbox: '', transactionType: '', date: '', amount: '', units: '', balanceUnits: '', action: ' ', id: 0, canDeleteTransaction: false, effect: '' },
  { position: 2, checkbox: '', transactionType: '', date: '', amount: '', units: '', balanceUnits: '', action: ' ', id: 0, canDeleteTransaction: false, effect: '' },
];

const ELEMENT_DATA2: PeriodicElement2[] = [
  { transactionType: '', date: '', amount: '', nav: '', units: '', action: ' ', keep: false, id: 0 },
  { transactionType: '', date: '', amount: '', nav: '', units: '', action: ' ', keep: true, id: 0 },
];

