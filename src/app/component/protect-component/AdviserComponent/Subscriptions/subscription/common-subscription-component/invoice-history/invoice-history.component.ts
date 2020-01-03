import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { SubscriptionService } from '../../../subscription.service';
import { MatTableDataSource, MatSort } from '@angular/material';


export interface PeriodicElement {
  date: string;
  invoice: string;
  status: string;
  ddate: string;
  amount: string;
  balance: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    date: '26/08/2019',
    invoice: 'INV-19-20-103001',
    status: 'OVERDUE',
    ddate: '05/09/2019',
    amount: 'Rs.20,000',
    balance: 'Rs.20,000'
  },
  {
    date: '28/08/2019',
    invoice: 'INV-19-20-103012',
    status: 'PAID',
    ddate: '05/09/2019',
    amount: 'Rs.1,20,000',
    balance: 'Rs.0'
  },
  {
    date: '29/08/2019',
    invoice: 'INV-19-20-103001',
    status: 'SENT',
    ddate: '05/09/2019',
    amount: 'Rs.7,000',
    balance: 'Rs.7,000'
  },

];

@Component({
  selector: 'app-invoice-history',
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.scss']
})
export class InvoiceHistoryComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public subInjectService: SubscriptionInject, private subService: SubscriptionService) {

  }

  @Input() set subData(data) {
    this.invoiceDataGet(data);
  }

  displayedColumns: string[] = ['date', 'invoice', 'status', 'ddate', 'amount', 'balance'];
  showSubscription;
  invoiceData;
  dataSub;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  invoiceHisData;

  ngOnInit() {
    this.showSubscription = true;
    console.log('this.dataSub', this.dataSub);
  }

  showInvoice(value) {
    this.invoiceData = value;
    console.log(this.invoiceData);
    this.showSubscription = false;
    this.subInjectService.addSingleProfile(value);

  }

  @Input()
  invoiceHistoryData(invoiceHistoryData: object) {
    this.invoiceHisData = invoiceHistoryData;
  }

  invoiceDataGet(data) {
    if (data === undefined) {
      return;
    } else {
      const obj = {
        module: 3,
        id: data.id
      };
      this.subService.getInvoices(obj).subscribe(
        responseData => this.getInvoiceResponseData(responseData)
      );
    }
  }

  getInvoiceResponseData(data) {
    console.log('getInvoiceResponseData', data);
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;

    // this.dataSource = data;
  }

  Close(state) {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
    this.subInjectService.changeUpperRightSliderState({ state: 'close' });
  }
}

