import { EventService } from './../../../../../Data-service/event.service';
import { SupportService } from './../../support.service';
import { SubscriptionInject } from './../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ReconciliationService } from '../../../AdviserComponent/backOffice/backoffice-aum-reconciliation/reconciliation/reconciliation.service';

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
  isKeepOrRemoveTransactions: any[] = [];
  tableData1: any[] = [];
  isFreeze: boolean = false;
  selection = new SelectionModel<PeriodicElement1>(true, []);
  shouldDeleteMultiple: boolean = false;
  deleteMultipleTransactionArray: any[] = []

  constructor(
    private subscriptionInject: SubscriptionInject,
    private supportService: SupportService,
    private reconService: ReconciliationService,
    private eventService: EventService
  ) { }

  singleSelectionSelect(element) {
    this.selection.toggle(element);
    if (this.selection.isSelected(element)) {
      this.shouldDeleteMultiple = true;
      this.deleteMultipleTransactionArray.push(element.id);
    } else {
      this.shouldDeleteMultiple = false;
      let index = this.deleteMultipleTransactionArray.indexOf(element);
      this.deleteMultipleTransactionArray.splice(index, 1);
    }
    console.log(this.deleteMultipleTransactionArray);
  }


  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.shouldDeleteMultiple = false;
      this.deleteMultipleTransactionArray = [];
    } else {
      this.shouldDeleteMultiple = true;
      this.dataSource1.data.forEach(row => {
        this.selection.select(row);
        if (this.deleteMultipleTransactionArray.includes(row['id'])) {
          return;
        }
        this.deleteMultipleTransactionArray.push(row['id']);
      });
    }
    console.log(this.deleteMultipleTransactionArray);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement1): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource1.data.length;
    return numSelected === numRows;
  }

  deleteSingleOrMultipleTransaction(element) {
    console.log(this.deleteMultipleTransactionArray);
    if (this.deleteMultipleTransactionArray.length > 0) {
      this.deleteTransactionApi(this.deleteMultipleTransactionArray);
    } else {
      this.eventService.openSnackBar("Please select atleast one transaction", "DISMISS")
    }
  }

  deleteTransactionApi(value) {
    this.reconService.deleteAumTransaction(value)
      .subscribe(res => {
        console.log("this transactions are deleted:::", res);
      })
  }

  deleteSingleTransaction(element) {
    this.deleteTransactionApi([element['id']]);
  }

  ngOnInit() {
    console.log(this.data);

    if (this.data && this.data.tableType == 'all-folios') {
      this.tableEntriesType = 1;
    } else if (this.data && this.data.tableType == 'duplicate-folios') {
      this.tableEntriesType = 2;
    }

    const tableArr: PeriodicElement[] = [{
      unitsRta: this.data.unitsRta ? this.data.unitsRta : '',
      unitOne: this.data.unitsIfnow ? this.data.unitsIfnow : '',
      difference: this.data.difference ? this.data.difference : ''
    }]

    this.dataSource.data = tableArr;
    this.allFolioTransactionTableDataBinding();
  }

  allFolioTransactionTableDataBinding() {
    if (this.data.tableData.length !== 0) {
      this.data.tableData.forEach(element => {
        this.tableData1.push({
          id: element.id,
          transactionType: element.fwTransactionType,
          date: element.transactionDate,
          amount: element.amount,
          units: element.unit,
          balanceUnits: element.balanceUnits,
          actions: ''
        })
      });
      this.dataSource1.data = this.tableData1;
    }
  }

  putAumTransactionKeepOrRemove() {
    let isKeepArray = [];
    ELEMENT_DATA2.forEach((item, index) => {
      isKeepArray.push({
        id: index,
        isKeep: item.isKeep
      })
    });
    this.isKeepOrRemoveTransactions = isKeepArray;
    console.log(this.isKeepOrRemoveTransactions);
    // this.supportService.putAumTransactionKeepOrRemove(this.isKeepOrRemoveTransactions)
    //   .subscribe(res => {
    //     console.log(res);
    //   });
  }

  shouldKeepOrRemove(value, element) {
    let id = ELEMENT_DATA2.indexOf(element);
    ELEMENT_DATA2[id].isKeep = (value === 1 ? true : false);
  }

  dialogClose() {
    this.subscriptionInject.changeNewRightSliderState({ state: 'close' });
  }

}

interface PeriodicElement {
  unitOne: string;
  unitsRta: string;
  difference: string;

}
const ELEMENT_DATA: PeriodicElement[] = [
  { unitOne: '0', unitsRta: '463.820', difference: '463.82', },
];
interface PeriodicElement1 {
  position: number;
  checkbox: string;
  transactionType: string;
  date: string;
  amount: string;
  units: string;
  balanceUnits: string;
  action: string;
}

interface PeriodicElement2 {
  transactionType: string;
  date: string;
  amount: string;
  nav: string;
  units: string;
  action: string;
  isKeep: boolean;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { position: 1, checkbox: '', transactionType: 'SIP', date: '07/01/2019', amount: '5,000.00', units: '156.23', balanceUnits: '156.23', action: ' ' },
  { position: 2, checkbox: '', transactionType: 'Transfer Out Change of Broker', date: '07/01/2019', amount: '5,000.00', units: '156.23', balanceUnits: '156.23', action: ' ' },
];

const ELEMENT_DATA2: PeriodicElement2[] = [
  { transactionType: 'SIP', date: '07/01/2019', amount: '5,000.00', nav: '298.43', units: '156.23', action: ' ', isKeep: false },
  { transactionType: 'Transfer Out Change of Broker', date: '07/01/2019', amount: '5,000.00', nav: '348.34', units: '156.23', action: ' ', isKeep: true },
];
