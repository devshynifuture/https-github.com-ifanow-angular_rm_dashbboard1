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
  displayedColumns2: string[] = ['srNo', 'transactionType', 'date', 'amount', 'nav', 'units', 'action'];
  dataSource1 = new MatTableDataSource<PeriodicElement1>(ELEMENT_DATA1); // with delete operation
  dataSource2 = new MatTableDataSource<PeriodicElement2>(ELEMENT_DATA2); // with keep and remove operation
  tableEntriesType: number;
  isKeepOrRemoveTransactions: any[] = [];
  tableData1: any[] = [];
  disableFreezeBtn = true;
  disableUnfreezeBtn = false;
  selection = new SelectionModel<PeriodicElement1>(true, []);
  shouldDeleteMultiple = false;
  deleteMultipleTransactionArray: any[] = [];
  upperTableArr: PeriodicElement[];
  advisorId = AuthService.getAdvisorId();
  selectedFolioUnits = 0;
  filteredValues: any[];
  arnRiaCode: any = '';
  mainLoader: boolean = false;

  filterList = [];
  deletedTransactions = [];
  tableData2: any = [];
  isUnfreezeClicked: boolean = false;
  isFreezeClicked: boolean = false;
  changesInUnitOne: string = '';

  constructor(
    private subscriptionInject: SubscriptionInject,
    private reconService: ReconciliationService,
    private eventService: EventService,
    private supportService: SupportService
  ) { }

  ngOnInit() {
    console.log(this.data);
    // this.unmapFolioTransaction();
    if (this.data.hasOwnProperty('isUnfreezeClicked')) {
      this.isUnfreezeClicked = this.data.isUnfreezeClicked;
    }
    if (this.data.hasOwnProperty('isFreezeClicked')) {
      this.isFreezeClicked = this.data.isFreezeClicked;
    }

    if (this.data && this.data.tableType == 'all-folios') {
      this.tableEntriesType = 1;
    } else if (this.data && this.data.tableType == 'duplicate-folios') {
      this.tableEntriesType = 2;
    }
    this.arnRiaCode = this.data.arnRiaCode;

    const tableArr: PeriodicElement[] = [{
      unitsRta: this.data.unitsRta ? this.data.unitsRta : '',
      unitOne: this.data.unitsIfanow ? this.data.unitsIfanow : '',
      difference: this.data.difference ? this.data.difference : ''
    }];

    this.dataSource.data = tableArr;
    this.upperTableArr = tableArr;
    if (this.data && this.data.freezeDate === null) {
      this.disableUnfreezeBtn = true;
    } else {
      this.disableUnfreezeBtn = false;
    }

    if (this.data && this.data.difference === "0.000") {
      this.disableFreezeBtn = false;
    } else {
      this.disableFreezeBtn = true;
    }

    if (this.isUnfreezeClicked) {
      this.disableUnfreezeBtn = true;
    }

    if (this.isFreezeClicked) {
      this.disableFreezeBtn = true;
    }

    // if (this.data && this.data.difference === '0.000') {
    //   this.disableFreezeBtn = false;
    // } else {
    //   this.disableFreezeBtn = true;
    // }
    this.allFolioTransactionTableDataBinding();
  }

  singleSelectionSelect(element, mainIndex) {
    if (element.canDeleteTransaction === true) {
      this.selection.toggle(element);
      const parsedValue = parseFloat((element.units).toFixed(3));
      if (this.selection.isSelected(element)) {
        this.shouldDeleteMultiple = true;
        this.selectedFolioUnits = this.selectedFolioUnits + parsedValue;
        this.selectedFolioUnits = parseFloat(this.selectedFolioUnits.toFixed(3));
        this.deleteMultipleTransactionArray.push(element.id);
        this.deletedTransactions.push(mainIndex);
      } else {
        // this.selectedFolioUnits = 0;
        const index = this.deleteMultipleTransactionArray.indexOf(element.id);
        this.deleteMultipleTransactionArray.splice(index, 1);

        const index1 = this.deletedTransactions.indexOf(mainIndex);
        this.deletedTransactions.splice(index1, 1);

        this.selectedFolioUnits = this.selectedFolioUnits - parsedValue;
        this.selectedFolioUnits = parseFloat(this.selectedFolioUnits.toFixed(3));
        if (this.selectedFolioUnits < 0.000) {
          this.selectedFolioUnits = 0.000;
        }
        if (this.deleteMultipleTransactionArray.length === 0) {
          this.shouldDeleteMultiple = false;
        }
      }
    } else {
      this.selection.clear();
      this.eventService.openSnackBarNoDuration("Kindly unfreeze folio first!", "DISMISS");
    }
    console.log(this.deleteMultipleTransactionArray);
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.deleteMultipleTransactionArray = [];
      this.deletedTransactions = [];
      this.shouldDeleteMultiple = false;
      this.selectedFolioUnits = 0;
    } else {
      // this need change

      if (!(this.dataSource1.data.some(item => item.canDeleteTransaction === false))) {
        this.shouldDeleteMultiple = true;
        this.dataSource1.data.forEach((row, index) => {
          if (row.canDeleteTransaction) {
            this.selection.select(row);
            if (this.deleteMultipleTransactionArray.includes(row.id)) {
              return;
            }
            if (this.deletedTransactions.includes(index)) {
              return;
            }
            this.deletedTransactions.push(index);
            const parsedValue = parseFloat(row.units);
            this.selectedFolioUnits = this.selectedFolioUnits + parsedValue;
            this.deleteMultipleTransactionArray.push(row.id);
          }
        });
      } else {
        this.selection.clear()
        this.eventService.openSnackBarNoDuration("Cannot Delete Transaction, Please unfreeze Folio!", "DISMISS");
      }
      ////
    }
    console.log(this.deleteMultipleTransactionArray);
  }

  validationForCanDeleteCheck(event, elRef) {
    if (this.dataSource1.data.some(item => item.canDeleteTransaction === false)) {
      elRef.disableRipple = true;
    }
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
      this.eventService.openSnackBar('Please select atleast one transaction', 'Dismiss');
    }
  }

  freezeFolioData() {
    if (this.data.mutualFundId) {
      this.reconService.putFreezeFolioData(this.data.mutualFundId)
        .subscribe(res => {
          console.log(res);

          this.disableFreezeBtn = true;
          this.disableUnfreezeBtn = false;

          this.dataSource1.data.forEach(item => {
            item.canDeleteTransaction = false
          });

          this.eventService.openSnackBar("Freezed Folio Successfully", "DISMISS");
          // this.canDeleteTransaction = false;
        }, err => {
          console.error(err);
        });
    }
  }

  unfreezeFolioData() {
    this.isUnfreezeClicked = true;
    if (this.data && this.data.mutualFundId) {
      this.reconService.putUnfreezeFolio(this.data.mutualFundId)
        .subscribe(res => {
          console.log(res);

          this.disableUnfreezeBtn = true;
          if (this.data.difference === '0.000') {
            this.disableFreezeBtn = false;
          }
          // this.canDeleteTransaction = true;
          this.dataSource1.data.forEach(item => {
            item.canDeleteTransaction = true;
          });
          this.eventService.openSnackBar("Unfreezed Folio Successfully", "DISMISS");
        }, err => {
          console.error(err);
        });
    } else {
      console.error('no mutual fund id found');
    }

  }


  deleteTransactionApi(value) {
    // value = value.map(element => String(element));
    this.selection.clear();
    this.mainLoader = true;
    // let dateObj = new Date(this.data.aumDate);
    // let dateFormat = dateObj.getFullYear() + '-' + `${(dateObj.getMonth() + 1) < 10 ? '0' : ''}` + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
    // value.unshift(dateFormat);

    this.reconService.deleteAumTransaction(value)
      .subscribe(res => {
        console.log('this transactions are deleted:::', res);
        this.dataSource1.data = this.tableData1.filter(item => {
          return (!value.includes(item.id)) ? item : null;
        });
        this.dataSource.data.map(item => {
          item.unitOne = String(res.units);
          this.changesInUnitOne = String(res.units);
          item.difference = String((parseFloat(res.units) - parseFloat(item.unitsRta)).toFixed(3));
          this.data.difference = String((parseFloat(item.unitOne) - parseFloat(item.unitsRta)).toFixed(3));
          if (this.data && (Math.round(parseFloat(item.difference)) === 0)) {
            this.disableFreezeBtn = false;
          } else {
            this.disableFreezeBtn = true;
          }
        });
        this.mainLoader = false;
        this.shouldDeleteMultiple = false;

        this.eventService.openSnackBar("Deleted Transaction Successfully", "DISMISS");
        // this.dataSource.data['unitOne'] = this.dataSource.data['unitOne'] - res.units;
        // this.dataSource.data['difference'] = this.dataSource.data['unitOne'] - this.dataSource.data['unitsRta'];
        // this.supportService.sendDataThroughObs(res);
      });
  }

  deleteSingleTransaction(element, index) {
    this.deletedTransactions.push(index);
    this.deleteTransactionApi([element.id]);
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

  filterTableValues(filterBasedOn, whichTable) {
    // this.filteredValues = [];
    if (whichTable === 1) {
      if (filterBasedOn === 'all') {
        this.dataSource1.data = this.tableData1;
      } else {
        let filteredArray = [];
        filteredArray = this.tableData1.filter(item => {
          return item.transactionType === filterBasedOn ? item : null;
        });
        this.dataSource1.data = filteredArray;
      }
    }
    if (whichTable === 2) {
      if (filterBasedOn === 'all') {
        this.dataSource2.data = this.tableData1;
      } else {
        let filteredArray = [];
        filteredArray = this.tableData1.filter(item => {
          return item.transactionType === filterBasedOn ? item : null;
        });
        this.dataSource2.data = filteredArray;
      }
    }
    // console.log('data filtered', this.dataSource1.data);
  }

  allFolioTransactionTableDataBinding() {

    if (this.data && this.data.tableData.length !== 0) {
      let canDeleteTransaction;
      this.data.tableData.forEach((element, index1) => {
        if (this.data.hasOwnProperty('freezeDate') && this.data.freezeDate) {
          let date1 = new Date(element.transactionDate);
          let date2 = new Date(element.freezeDate);
          if (date1.getTime() > date2.getTime()) {
            canDeleteTransaction = true;
          } else {
            canDeleteTransaction = false;
          }
        } else {
          canDeleteTransaction = true;
        }
        this.tableData1.push({
          srNo: index1 + 1,
          id: element.id,
          transactionType: element.fwTransactionType,
          date: element.transactionDate,
          amount: element.amount,
          units: element.unit,
          balanceUnits: element.balanceUnits,
          actions: '',
          keep: element.keep,
          nav: element.purchasePrice ? element.purchasePrice : null,
          canDeleteTransaction
        });
        if (!(this.filterList.includes(element.fwTransactionType))) {
          this.filterList.push(element.fwTransactionType);
        }
      });
      // populate table filters

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
    const isKeepArray = [];
    this.dataSource2.data.forEach(item => {
      isKeepArray.push({
        id: item.id,
        isKeep: item.keep
      });
    });
    this.isKeepOrRemoveTransactions = isKeepArray;
    console.log(this.isKeepOrRemoveTransactions);
    this.supportService.putAumTransactionKeepOrRemove(this.isKeepOrRemoveTransactions)
      .subscribe(res => {
        console.log(res);
        this.dataSource.data.map(element => {
          element.unitOne = String(parseFloat(res.units).toFixed(3));
          this.changesInUnitOne = String(parseFloat(res.units).toFixed(3));
          element.difference = String((parseFloat(res.units) - parseFloat(element.unitsRta)).toFixed(3));
          if (element.difference === '0.000') {
            this.disableFreezeBtn = false;
          }
        });
      });
  }

  shouldKeepOrRemove(value, element) {
    const id = this.dataSource2.data.indexOf(element);
    this.dataSource2.data[id].keep = (value === 1 ? true : false);
  }

  dialogClose() {
    let refreshRequired = (this.data.difference === '0.000') ? true : false;
    this.subscriptionInject
      .changeNewRightSliderState({
        state: 'close',
        refreshRequired,
        fromAllFolioOrDuplicateTab: this.data.fromAllFolioOrDuplicateTab,
        deletedTransactionsIndexes: this.deletedTransactions,
        isUnfreezeClicked: this.isUnfreezeClicked,
        isFreezeClicked: this.isFreezeClicked,
        changesInUnitOne: this.changesInUnitOne
      });
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
  id: number;
  canDeleteTransaction: boolean;
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
  { position: 1, checkbox: '', transactionType: '', date: '', amount: '', units: '', balanceUnits: '', action: ' ', id: 0, canDeleteTransaction: false },
  { position: 2, checkbox: '', transactionType: '', date: '', amount: '', units: '', balanceUnits: '', action: ' ', id: 0, canDeleteTransaction: false },
];

const ELEMENT_DATA2: PeriodicElement2[] = [
  { transactionType: '', date: '', amount: '', nav: '', units: '', action: ' ', keep: false, id: 0 },
  { transactionType: '', date: '', amount: '', nav: '', units: '', action: ' ', keep: true, id: 0 },
];
