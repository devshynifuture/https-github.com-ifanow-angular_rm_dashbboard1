import { AuthService } from './../../../../../auth-service/authService';
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
  enableFreezeBtn: boolean = false;
  selection = new SelectionModel<PeriodicElement1>(true, []);
  shouldDeleteMultiple: boolean = false;
  deleteMultipleTransactionArray: any[] = []
  upperTableArr: PeriodicElement[];
  advisorId = AuthService.getAdvisorId();
  selectedFolioUnits: number = 0;
  canDeleteTransaction: boolean = false;

  constructor(
    private subscriptionInject: SubscriptionInject,
    private reconService: ReconciliationService,
    private eventService: EventService,
    private supportService: SupportService
  ) { }


  ngOnInit() {
    console.log(this.data);
    this.unmapFolioTransaction();

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
    this.upperTableArr = tableArr;
    this.allFolioTransactionTableDataBinding();
  }

  singleSelectionSelect(element) {
    this.selection.toggle(element);
    if (this.selection.isSelected(element)) {
      this.shouldDeleteMultiple = true;
      this.selectedFolioUnits = this.selectedFolioUnits + parseInt(element.units.toFixed(3));
      this.deleteMultipleTransactionArray.push(element.id);
    } else {
      // this.selectedFolioUnits = 0;
      let index = this.deleteMultipleTransactionArray.indexOf(element);
      this.deleteMultipleTransactionArray.splice(index, 1);
      this.selectedFolioUnits = this.selectedFolioUnits - parseInt(element.units.toFixed(3));
      if (this.selectedFolioUnits < 0) {
        this.selectedFolioUnits = 0;
      }
      if (this.deleteMultipleTransactionArray.length === 0) {
        this.shouldDeleteMultiple = false;
      }
    }
    console.log(this.deleteMultipleTransactionArray);
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.deleteMultipleTransactionArray = [];
      this.shouldDeleteMultiple = false;
      this.selectedFolioUnits = 0;
    } else {
      this.shouldDeleteMultiple = true;
      this.dataSource1.data.forEach(row => {
        this.selection.select(row);
        if (this.deleteMultipleTransactionArray.includes(row['id'])) {
          return;
        }
        this.selectedFolioUnits = this.selectedFolioUnits + parseInt(row.units);
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

  deleteSingleOrMultipleTransaction() {
    console.log(this.deleteMultipleTransactionArray);
    if (this.deleteMultipleTransactionArray.length > 0) {
      this.deleteTransactionApi(this.deleteMultipleTransactionArray);
    } else {
      this.eventService.openSnackBar("Please select atleast one transaction", "DISMISS")
    }
  }

  freezeFolioData() {
    if (this.data.mutualFundId) {
      this.reconService.putFreezeFolioData(this.data.mutualFundId)
        .subscribe(res => {
          console.log(res);
        }, err => {
          console.error(err)
        })
    }
  }

  unfreezeFolioData() {
    const data = {
      brokerId: this.data.brokerId,
      advisorId: this.advisorId,
      rt: this.data.rtId
    }

    this.reconService.putUnfreezeFolio(data)
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.error(err);
      })
  }


  deleteTransactionApi(value) {
    this.reconService.deleteAumTransaction(value)
      .subscribe(res => {
        console.log("this transactions are deleted:::", res);
        this.dataSource1.data = this.tableData1.filter(item => {
          return (!value.includes(item.id)) ? item : null;
        });
        this.dataSource.data.map(item => {
          item['unitOne'] = String((res.units).toFixed(3));
          item['difference'] = String((parseInt(item['unitOne']) - parseInt(item['unitsRta'])).toFixed(3));
          if (this.data && this.data.freezeDate && item['difference'] === '0.000') {
            this.enableFreezeBtn = true
          } else {
            this.enableFreezeBtn = false;
          }
        });
        // this.dataSource.data['unitOne'] = this.dataSource.data['unitOne'] - res.units;
        // this.dataSource.data['difference'] = this.dataSource.data['unitOne'] - this.dataSource.data['unitsRta'];
        this.supportService.sendDataThroughObs(res);
      });
  }

  deleteSingleTransaction(element) {
    this.deleteTransactionApi([element['id']]);
  }

  unmapFolioTransaction() {
    const data = {
      id: this.data.mutualFundId
    };

    console.log(data);

    // this.reconService.putUnmapFolioTransaction(data)
    //   .subscribe(res => {
    //     console.log(res);
    //   }, err => {
    //     console.error(err);
    //   })
  }


  allFolioTransactionTableDataBinding() {
    if (this.data.tableData.length !== 0) {
      this.canDeleteTransaction = this.data.canDeleteTransaction;

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
    this.supportService.putAumTransactionKeepOrRemove(this.isKeepOrRemoveTransactions)
      .subscribe(res => {
        console.log(res);
      });
  }

  shouldKeepOrRemove(value, element) {
    let id = ELEMENT_DATA2.indexOf(element);
    ELEMENT_DATA2[id].isKeep = (value === 1 ? true : false);
  }

  dialogClose() {
    this.subscriptionInject.changeNewRightSliderState({ state: 'close', refreshRequired: true });
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
