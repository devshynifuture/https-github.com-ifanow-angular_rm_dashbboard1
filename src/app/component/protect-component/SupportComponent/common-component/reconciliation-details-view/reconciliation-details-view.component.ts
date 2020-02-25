import { SubscriptionInject } from './../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-reconciliation-details-view',
  templateUrl: './reconciliation-details-view.component.html',
  styleUrls: ['./reconciliation-details-view.component.scss']
})
export class ReconciliationDetailsViewComponent implements OnInit {

  data;
  displayedColumns: string[] = ['unitOne', 'unitsRta', 'difference'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  displayedColumns1: string[] = ['checkbox', 'transactionType', 'date', 'amount', 'units', 'balanceUnits', 'action'];
  displayedColumns2: string[] = ['transactionType', 'date', 'amount', 'nav', 'units', 'action'];
  dataSource1 = new MatTableDataSource<PeriodicElement1>(ELEMENT_DATA1);
  dataSource2 = new MatTableDataSource<PeriodicElement2>(ELEMENT_DATA2);
  tableEntriesType: number;

  constructor(private subscriptionInject: SubscriptionInject) { }


  ngOnInit() {
    console.log(this.data);
    if (this.data && this.data.tableType == 'all-folios') {
      this.tableEntriesType = 1;
    } else if (this.data && this.data.tableType == 'duplicate-folios') {
      this.tableEntriesType = 2;
    }

    const tableArr: PeriodicElement[] = [{
      unitsRta: this.data.unitsRta ? this.data.unitsRta : '',
      unitOne: this.data.unitsIfanow ? this.data.unitsIfanow : '',
      difference: this.data.difference ? this.data.difference : ''
    }]

    this.dataSource.data = tableArr;

  }

  dialogClose() {
    this.subscriptionInject.changeNewRightSliderState({ state: 'close' });
  }

}

export interface PeriodicElement {
  unitOne: string;
  unitsRta: string;
  difference: string;

}
const ELEMENT_DATA: PeriodicElement[] = [
  { unitOne: '0', unitsRta: '463.820', difference: '463.82', },
];

export interface PeriodicElement1 {
  checkbox: string;
  transactionType: string;
  date: string;
  amount: string;
  units: string;
  balanceUnits: string;
  action: string;
}

export interface PeriodicElement2 {
  transactionType: string;
  date: string;
  amount: string;
  nav: string;
  units: string;
  action: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { checkbox: ' ', transactionType: 'SIP', date: '07/01/2019', amount: '5,000.00', units: '156.23', balanceUnits: '156.23', action: ' ' },
  { checkbox: ' ', transactionType: 'Transfer Out Change of Broker', date: '07/01/2019', amount: '5,000.00', units: '156.23', balanceUnits: '156.23', action: ' ' },
];

const ELEMENT_DATA2: PeriodicElement2[] = [
  { transactionType: 'SIP', date: '07/01/2019', amount: '5,000.00', nav: '298.43', units: '156.23', action: ' ' },
  { transactionType: 'Transfer Out Change of Broker', date: '07/01/2019', amount: '5,000.00', nav: '348.34', units: '156.23', action: ' ' },
];
