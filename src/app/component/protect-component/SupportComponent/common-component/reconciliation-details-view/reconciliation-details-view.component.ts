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
  dataSource1 = new MatTableDataSource<PeriodicElement1>(ELEMENT_DATA1); // with delete operation
  dataSource2 = new MatTableDataSource<PeriodicElement2>(ELEMENT_DATA2); // with keep and remove operation
  tableEntriesType: number;
  isKeepOrRemoveTransactions: any[] = [];
  tableData1: any[] = [];
  disableFreezeBtn: boolean = false;
  disableUnfreezeBtn: boolean = false;
  selection = new SelectionModel<PeriodicElement1>(true, []);
  shouldDeleteMultiple: boolean = false;
  deleteMultipleTransactionArray: any[] = []
  upperTableArr: PeriodicElement[];
  advisorId = AuthService.getAdvisorId();
  selectedFolioUnits: number = 0;
  canDeleteTransaction: boolean = false;
  filteredValues: any[];

  constructor(
    private subscriptionInject: SubscriptionInject,
    private reconService: ReconciliationService,
    private eventService: EventService,
    private supportService: SupportService
  ) { }

  ngOnInit() {
    console.log(this.data);
    // this.unmapFolioTransaction();

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
    this.upperTableArr = tableArr;
    this.disableUnfreezeBtn = false;

    if (this.data && this.data.difference === '0.000') {
      this.disableFreezeBtn = false;
    } else {
      this.disableFreezeBtn = true;
    }
    this.allFolioTransactionTableDataBinding();
  }

  singleSelectionSelect(element) {
    this.selection.toggle(element);
    let parsedValue = parseFloat((element.units).toFixed(3));
    if (this.selection.isSelected(element)) {
      this.shouldDeleteMultiple = true;
      this.selectedFolioUnits = this.selectedFolioUnits + parsedValue;
      this.deleteMultipleTransactionArray.push(element.id);
    } else {
      // this.selectedFolioUnits = 0;
      let index = this.deleteMultipleTransactionArray.indexOf(element.id);
      this.deleteMultipleTransactionArray.splice(index, 1);
      this.selectedFolioUnits = this.selectedFolioUnits - parsedValue;
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
        let parsedValue = parseFloat(row.units);
        this.selectedFolioUnits = this.selectedFolioUnits + parsedValue;
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
    let numRows;
    if (this.dataSource1.data && this.dataSource1.data.length !== 0) {
      numRows = this.dataSource1.data.length;
    } else {
      numRows = 0;
    }
    return numSelected === numRows;
  }

  deleteSingleOrMultipleTransaction() {
    console.log(this.deleteMultipleTransactionArray);
    if (this.deleteMultipleTransactionArray.length > 0) {
      this.deleteTransactionApi(this.deleteMultipleTransactionArray);
    } else {
      this.eventService.openSnackBar("Please select atleast one transaction", "Dismiss")
    }
  }

  freezeFolioData() {
    if (this.data.mutualFundId) {
      this.reconService.putFreezeFolioData(this.data.mutualFundId)
        .subscribe(res => {
          console.log(res);

          this.disableFreezeBtn = true;
          this.disableUnfreezeBtn = false;
          this.canDeleteTransaction = false;
        }, err => {
          console.error(err)
        })
    }
  }

  unfreezeFolioData() {
    if (this.data && this.data.mutualFundId) {
      this.reconService.putUnfreezeFolio(this.data.mutualFundId)
        .subscribe(res => {
          console.log(res);

          this.disableUnfreezeBtn = true;
          this.disableFreezeBtn = false;
          this.canDeleteTransaction = true;
        }, err => {
          console.error(err);
        })
    } else {
      console.error("no mutual fund id found");
    }

  }


  deleteTransactionApi(value) {
    this.selection.clear();
    this.reconService.deleteAumTransaction(value)
      .subscribe(res => {
        console.log("this transactions are deleted:::", res);
        this.dataSource1.data = this.tableData1.filter(item => {
          return (!value.includes(item.id)) ? item : null;
        });
        this.dataSource.data.map(item => {
          item['unitOne'] = String((res.units).toFixed(3));
          item['difference'] = String((parseInt(item['unitOne']) - parseInt(item['unitsRta'])).toFixed(3));
          if (this.data && item['difference'] === '0.000') {
            this.disableFreezeBtn = true;
          } else {
            this.disableFreezeBtn = false;
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

  filterTableValues(filterBasedOn) {
    // this.filteredValues = [];
    if (filterBasedOn === 'all') {
      this.dataSource1.data = this.tableData1;
    } else {
      let filteredArray = [];
      filteredArray = this.tableData1.filter(item => {
        return item.transactionType === filterBasedOn.toUpperCase() ? item : null;
      });
      this.dataSource1.data = filteredArray
    }
    console.log("data filtered", this.dataSource1.data);
  }


  allFolioTransactionTableDataBinding() {
    if (this.data.tableData.length !== 0) {
      this.canDeleteTransaction = this.data.canDeleteTransaction ? this.data.canDeleteTransaction : false;

      this.data.tableData.forEach(element => {
        this.tableData1.push({
          id: element.id,
          transactionType: element.fwTransactionType,
          date: element.transactionDate,
          amount: element.amount,
          units: element.unit,
          balanceUnits: element.balanceUnits,
          actions: '',
          keep: element.keep,
          nav: element.purchasePrice ? element.purchasePrice : null
        });
      });
      console.log(this.tableData1);
      if (this.data.tableType == 'all-folios') {
        this.dataSource1.data = this.tableData1;
      }

      if (this.data.tableType === 'duplicate-folios') {
        this.dataSource2.data = this.tableData1;
      }
    } else {
      if (this.data.tableType == 'all-folios') {
        this.dataSource1.data = null;
      }

      if (this.data.tableType === 'duplicate-folios') {
        this.dataSource2.data = null;
      }
    }
  }

  putAumTransactionKeepOrRemove() {
    let isKeepArray = [];
    this.dataSource2.data.forEach(item => {
      isKeepArray.push({
        id: item['id'],
        isKeep: item['keep']
      })
    });
    this.isKeepOrRemoveTransactions = isKeepArray;
    console.log(this.isKeepOrRemoveTransactions);
    this.supportService.putAumTransactionKeepOrRemove(this.isKeepOrRemoveTransactions)
      .subscribe(res => {
        console.log(res);
        this.dataSource.data.map(element => {
          element.unitOne = String(parseInt(res.units).toFixed(3));
          element.difference = String((parseInt(res.units) - parseInt(element['unitsRta'])).toFixed(3))
          if (element.difference !== '0.000') {
            this.disableFreezeBtn = true;
          }
        });
      });
  }

  shouldKeepOrRemove(value, element) {
    let id = this.dataSource2.data.indexOf(element);
    this.dataSource2.data[id]['keep'] = (value === 1 ? true : false);
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
  keep: boolean;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { position: 1, checkbox: '', transactionType: '', date: '', amount: '', units: '', balanceUnits: '', action: ' ' },
  { position: 2, checkbox: '', transactionType: '', date: '', amount: '', units: '', balanceUnits: '', action: ' ' },
];

const ELEMENT_DATA2: PeriodicElement2[] = [
  { transactionType: '', date: '', amount: '', nav: '', units: '', action: ' ', keep: false },
  { transactionType: '', date: '', amount: '', nav: '', units: '', action: ' ', keep: true },
];
