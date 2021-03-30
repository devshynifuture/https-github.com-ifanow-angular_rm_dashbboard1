import { MisAumDataStorageService } from './../../../AdviserComponent/backOffice/backoffice-mis/mutual-funds/aum/mis-aum-data-storage.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { style } from '@angular/animations';
import { AuthService } from './../../../../../auth-service/authService';
import { EventService } from './../../../../../Data-service/event.service';
import { SupportService } from './../../support.service';
import { SubscriptionInject } from './../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit, HostListener, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ReconciliationService } from '../../../AdviserComponent/backOffice/backoffice-aum-reconciliation/reconciliation/reconciliation.service';

@Component({
  selector: 'app-reconciliation-details-view',
  templateUrl: './reconciliation-details-view.component.html',
  styleUrls: ['./reconciliation-details-view.component.scss']
})
export class ReconciliationDetailsViewComponent implements OnInit, OnDestroy {

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
  deleteMultipleTransactionArray: any[] = [];
  upperTableArr: PeriodicElement[];
  advisorId = AuthService.getAdvisorId();
  selectedFolioUnits = 0;
  filteredValues: any[];
  arnRiaCode: any = '';
  mainLoader: boolean = false;
  filterTransactionListTab1 = new FormControl();
  filterTransactionListTab2 = new FormControl();
  filterList = [];
  deletedTransactions = [];
  tableData2: any = [];
  isUnfreezeClicked: boolean = false;
  isFreezeClicked: boolean = false;
  changesInUnitOne: string = '';
  canUpdateTransactions = false;
  keepStatus = [];
  disableDeletionForTable2: boolean = false;
  refreshAfterUpdateKeepOrRemove = false;
  isKeepArray = [];
  duplicateTransactionList: any;
  isLoading: boolean;
  changedBalanceUnits: any = [];
  outsideClickCount = 0;
  filterBasedOn: any = null;
  filterOnWhichTable: any = null;
  filterSub: any;
  filterBasedOnArr: any = [];
  filterSubTab1: any;
  shouldShowSelectedFilteredUnits: boolean;
  shouldShowMultipleDelete: boolean = false;
  selectedBalanceUnits: any = 0;
  selectedFolioUnitsFiltered: any = 0;
  freezeDate: any;
  isTransactionDeleted: boolean;
  refreshRequired = false;
  constructor(
    private eRef: ElementRef,
    private renderer2: Renderer2,
    private subscriptionInject: SubscriptionInject,
    private reconService: ReconciliationService,
    private eventService: EventService,
    private supportService: SupportService,
    private router: Router,
    private misAumDataStorageService: MisAumDataStorageService
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
    this.freezeDate = this.data.freezeDate;

    if (this.router.url.includes('folio-query')) {
      let temArr = [];
      this.data.tableData.forEach(element => {
        if (this.data.aumDate && element.transactionDate) {
          if (element.transactionDate <= this.data.aumDate) {
            temArr.push(element);
          }
        }
      });

      let tableArr: PeriodicElement[];
      if (temArr.length > 0) {
        if (this.data && this.data.hasOwnProperty('id') && this.data.id !== 0) {
          if (this.data && this.data.hasOwnProperty('mutualFundId') && (this.data.mutualFundId !== null || this.data.mutualFundId !== undefined) && this.data.mutualFundId !== 0) {
            tableArr = [{
              unitsRta: this.data.unitsRta ? this.data.unitsRta : (typeof this.data.unitsRta === 'number' ? this.data.unitsRta : ''),
              unitOne: temArr[temArr.length - 1].balanceUnits,
              difference: (this.data.unitsRta - temArr[temArr.length - 1].balanceUnits).toFixed(3),
            }];
          } else if ((this.data && !this.data.hasOwnProperty('mutualFundId')) || ((this.data.mutualFundId !== null || this.data.mutualFundId !== undefined) && this.data.mutualFundId === 0)) {
            tableArr = [{
              unitsRta: this.data.unitsRta ? this.data.unitsRta : (typeof this.data.unitsRta === 'number' ? this.data.unitsRta : ''),
              unitOne: '-',
              difference: '-',
            }];
          }
        } else if ((this.data && this.data.hasOwnProperty('id') && this.data.id === 0) || (this.data && !this.data.hasOwnProperty('id'))) {
          if (this.data && this.data.hasOwnProperty('mutualFundId') && (this.data.mutualFundId !== null || this.data.mutualFundId !== undefined) && this.data.mutualFundId !== 0) {
            tableArr = [{
              unitsRta: '-',
              unitOne: temArr[temArr.length - 1].balanceUnits,
              difference: '-',
            }];
          } else if ((this.data && !this.data.hasOwnProperty('mutualFundId')) || (this.data.hasOwnProperty('mutualFundId') && this.data.mutualFundId === 0)) {
            tableArr = [{
              unitsRta: '-',
              unitOne: '-',
              difference: '-',
            }];
          }
        }
        this.data.difference = (this.data.unitsRta - temArr[temArr.length - 1].balanceUnits).toFixed(3);
      } else {

        if (this.data && this.data.id && this.data.id !== 0) {
          if (this.data && this.data.hasOwnProperty('mutualFundId') && (this.data.mutualFundId !== null || this.data.mutualFundId !== undefined) && this.data.mutualFundId !== 0) {
            tableArr = [{
              unitsRta: this.data.unitsRta ? this.data.unitsRta : (typeof this.data.unitsRta === 'number' ? this.data.unitsRta : ''),
              unitOne: this.data.unitsIfanow ? this.data.unitsIfanow : (typeof this.data.unitsIfanow === 'number' ? this.data.unitsIfanow : ''),
              difference: String(this.data.unitsIfanow - this.data.unitsRta),
            }];
          } else if ((this.data && !this.data.hasOwnProperty('mutualFundId')) || ((this.data.mutualFundId !== null || this.data.mutualFundId !== undefined) && this.data.mutualFundId === 0)) {
            tableArr = [{
              unitsRta: this.data.unitsRta ? this.data.unitsRta : (typeof this.data.unitsRta === 'number' ? this.data.unitsRta : ''),
              unitOne: '-',
              difference: '-',
            }];
          }
        } else if ((this.data && this.data.hasOwnProperty('id') && this.data.id === 0) || (this.data && !this.data.hasOwnProperty('id'))) {
          if (this.data && this.data.hasOwnProperty('mutualFundId') && (this.data.mutualFundId !== null || this.data.mutualFundId !== undefined) && this.data.mutualFundId !== 0) {
            tableArr = [{
              unitsRta: '-',
              unitOne: this.data.unitsIfanow ? this.data.unitsIfanow : (typeof this.data.unitsIfanow === 'number' ? this.data.unitsIfanow : ''),
              difference: '-',
            }];
          } else if ((this.data && !this.data.hasOwnProperty('mutualFundId')) || (this.data.hasOwnProperty('mutualFundId') && this.data.mutualFundId === 0)) {
            tableArr = [{
              unitsRta: '-',
              unitOne: '-',
              difference: '-',
            }];
          }
        }
        // tableArr = [{
        //   unitsRta: this.data.unitsRta ? this.data.unitsRta : (typeof this.data.unitsRta === 'number' ? this.data.unitsRta : ''),
        //   unitOne: this.data.unitsIfanow ? this.data.unitsIfanow : (typeof this.data.unitsIfanow === 'number' ? this.data.unitsIfanow : ''),
        //   difference: this.data.difference ? this.data.difference : (typeof this.data.difference === 'number' ? this.data.difference : ''),
        // }];
      }

      this.dataSource.data = tableArr;
      this.upperTableArr = tableArr;

    } else {
      let tableArr;
      if (this.data && this.data.hasOwnProperty('id') && this.data.id !== 0) {
        if (this.data && this.data.hasOwnProperty('mutualFundId') && this.data.mutualFundId && this.data.mutualFundId !== 0) {
          tableArr = [{
            unitsRta: this.data.unitsRta ? this.data.unitsRta : (typeof this.data.unitsRta === 'number' ? this.data.unitsRta : ''),
            unitOne: this.data.unitsIfanow ? this.data.unitsIfanow : (typeof this.data.unitsIfanow === 'number' ? this.data.unitsIfanow : ''),
            difference: this.data.difference ? this.data.difference : (typeof this.data.difference === 'number' ? this.data.difference : ''),
          }];
        } else if ((this.data && !this.data.hasOwnProperty('mutualFundId')) || (this.data.mutualFundId && this.data.mutualFundId === 0)) {
          tableArr = [{
            unitsRta: this.data.unitsRta ? this.data.unitsRta : (typeof this.data.unitsRta === 'number' ? this.data.unitsRta : ''),
            unitOne: '-',
            difference: '-',
          }];
        }
      } else if ((this.data && this.data.hasOwnProperty('id') && this.data.id === 0) || (this.data && !this.data.hasOwnProperty('id'))) {
        if (this.data && this.data.hasOwnProperty('mutualFundId') && (this.data.mutualFundId !== null || this.data.mutualFundId !== undefined) && this.data.mutualFundId !== 0) {
          tableArr = [{
            unitsRta: '-',
            unitOne: this.data.unitsIfanow ? this.data.unitsIfanow : (typeof this.data.unitsIfanow === 'number' ? this.data.unitsIfanow : ''),
            difference: '-',
          }];
        } else if ((!this.data.hasOwnProperty('mutualFundId')) || (this.data.hasOwnProperty('mutualFundId') && this.data.mutualFundId === 0)) {
          tableArr = [{
            unitsRta: '-',
            unitOne: '-',
            difference: '-',
          }];
        }
      }
      // tableArr = [{
      //   unitsRta: this.data.unitsRta ? this.data.unitsRta : (typeof this.data.unitsRta === 'number' ? this.data.unitsRta : ''),
      //   unitOne: this.data.unitsIfanow ? this.data.unitsIfanow : (typeof this.data.unitsIfanow === 'number' ? this.data.unitsIfanow : ''),
      //   difference: this.data.difference ? this.data.difference : (typeof this.data.difference === 'number' ? this.data.difference : ''),
      // }];
      this.dataSource.data = tableArr;
      this.upperTableArr = tableArr;
    }


    if (this.data && this.data.freezeDate === null) {
      this.disableUnfreezeBtn = true;
    } else {
      this.disableUnfreezeBtn = false;
    }

    if (this.data && this.data.difference === "0.000") {
      if (this.data && this.data.freezeDate === null) {
        this.disableFreezeBtn = false;
      } else {
        this.disableFreezeBtn = true;
      }
    } else {
      this.disableFreezeBtn = true;
    }

    if (this.isUnfreezeClicked) {
      this.disableUnfreezeBtn = true;
    }

    if (this.isFreezeClicked) {
      this.disableFreezeBtn = true;
    }

    this.filterSubTab1 = this.filterTransactionListTab1.valueChanges
      .subscribe(res => {
        this.filterBasedOn = res;
        this.filterTableValues(res, 1);
      })

    this.filterSub = this.filterTransactionListTab2.valueChanges
      .subscribe(res => {
        this.filterBasedOn = res;
        this.filterTableValues(res, 2)
      })

    // if (this.data && this.data.difference === '0.000') {
    //   this.disableFreezeBtn = false;
    // } else {
    //   this.disableFreezeBtn = true;
    // }
    this.allFolioTransactionTableDataBinding();
  }
  unmappedFolio(data) {
    console.log('unmapped data', data)
    const obj = {
      mutualFundId: this.data.mutualFundId
    };

    console.log(data);

    this.reconService.unmappedFolio(obj)
      .subscribe(res => {
        console.log(res);
        this.eventService.openSnackBar("Unmapped folio successfully!", "DISMISS");
        this.dialogClose()
      }, err => {
        console.error(err);
      })

  }
  singleSelectionSelect(element, mainIndex) {
    if (element.canDeleteTransaction === true) {
      this.selection.toggle(element);
      // const parsedValue = parseFloat((element.units).toFixed(3));
      if (this.selection.isSelected(element)) {

        this.shouldShowMultipleDelete = true;
        this.selectedFolioUnits = this.selectedFolioUnits + (parseFloat(element.units.toFixed(3)) * element.effect);
        // this.selectedFolioUnits = parseFloat((this.selectedFolioUnits + parsedValue).toFixed(3));
        this.selectedFolioUnits = parseFloat(this.selectedFolioUnits.toFixed(3));

        this.deleteMultipleTransactionArray.push(element.id);
        this.deletedTransactions.push(mainIndex);
      } else {
        // this.selectedFolioUnits = 0;
        const index = this.deleteMultipleTransactionArray.indexOf(element.id);
        this.deleteMultipleTransactionArray.splice(index, 1);

        const index1 = this.deletedTransactions.indexOf(mainIndex);
        this.deletedTransactions.splice(index1, 1);
        this.selectedFolioUnits = this.selectedFolioUnits - (parseFloat(element.units.toFixed(3)) * element.effect);
        // this.selectedFolioUnits = parseFloat((this.selectedFolioUnits - parsedValue).toFixed(3));
        // if (this.selectedFolioUnits < 0.000) {
        //   this.selectedFolioUnits = 0.000;
        this.selectedFolioUnits = parseFloat(this.selectedFolioUnits.toFixed(3));
        // }
        if (this.deleteMultipleTransactionArray.length === 0) {
          this.shouldShowMultipleDelete = false;
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
      this.shouldShowMultipleDelete = false;
      this.selectedFolioUnits = 0;
    } else {

      if (!(this.dataSource1.data.some(item => item.canDeleteTransaction === false))) {

        this.shouldShowMultipleDelete = true;
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
            // const parsedValue = parseFloat(parseFloat(row.units).toFixed(3));
            this.selectedFolioUnits = this.selectedFolioUnits + parseFloat(row.units) * row.effect;
            this.selectedFolioUnits = parseFloat(this.selectedFolioUnits.toFixed(3));
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

  ngOnDestroy(): void {
    if (this.filterSub) {
      this.filterSub.unsubscribe();
    }

    if (this.filterSubTab1) {
      this.filterSubTab1.unsubscribe()
    }
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
      if (this.deleteMultipleTransactionArray.length === 1) {
        let val = this.deleteMultipleTransactionArray[0];
        let desiredObj = this.dataSource1.data.find(item => item.id === val);
        let index = this.dataSource1.data.indexOf(desiredObj);

        this.deleteTransactionApi(this.deleteMultipleTransactionArray, index);
      } else {
        this.deleteTransactionApi(this.deleteMultipleTransactionArray, null);
      }
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

          this.freezeDate = res;

          if (this.filterBasedOn && this.filterBasedOn.length !== 0 && this.filterOnWhichTable) {
            this.filterTableValues(this.filterBasedOn, this.filterOnWhichTable);
          }

          if (this.dataSource1.data.length !== 0) {
            this.dataSource1.data.map(item => {
              item.canDeleteTransaction = false
            });
          }

          this.tableData1 = [...this.dataSource1.data];
          this.sendValueToParent();
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
          // console.log(res);

          this.disableDeletionForTable2 = false;
          this.disableUnfreezeBtn = true;
          if (Math.round(parseFloat(this.dataSource.data[0].difference)) === 0) {
            this.disableFreezeBtn = false;
          }
          this.freezeDate = null;

          if (this.filterBasedOn && this.filterBasedOn.length !== 0 && this.filterOnWhichTable) {
            this.filterTableValues(this.filterBasedOn, this.filterOnWhichTable);
          }
          // this.canDeleteTransaction = true;
          if (this.dataSource1.data.length !== 0) {
            this.dataSource1.data.map(item => {
              item.canDeleteTransaction = true;
            });
          }

          this.tableData1 = this.dataSource1.data;
          this.refreshRequired = true;
          this.sendValueToParent();
          this.eventService.openSnackBar("Unfreezed Folio Successfully", "DISMISS");
        }, err => {
          console.error(err);
        });
    } else {
      console.error('no mutual fund id found');
    }

  }


  deleteTransactionApi(value, index) {
    value = value.map(element => String(element));
    this.selection.clear();
    this.mainLoader = true;
    let dateObj = new Date(this.data.aumDate);
    let dateFormat = dateObj.getFullYear() + '-' + `${(dateObj.getMonth() + 1) < 10 ? '0' : ''}` + (dateObj.getMonth() + 1) + '-' + `${(dateObj.getDate()) < 10 ? '0' : ''}` + dateObj.getDate();
    value.unshift(dateFormat);

    this.reconService.deleteAumTransaction(value)
      .subscribe(res => {
        console.log('this transactions are deleted:::', res);
        value.shift();
        this.isTransactionDeleted = true;
        this.misAumDataStorageService.clearStorage();
        this.misAumDataStorageService.callApiData();
        if (this.dataSource1 && this.dataSource1.data.length > 0) {
          this.dataSource1.data = this.tableData1.filter(item => {
            return (!value.includes(String(item.id))) ? item : null;
          });
          this.tableData1 = [...this.dataSource1.data];
        }

        if (this.filterBasedOn && this.filterBasedOn.length !== 0 && this.filterOnWhichTable) {
          this.filterTableValues(this.filterBasedOn, this.filterOnWhichTable);
        }

        if (this.dataSource && this.dataSource.data) {
          this.dataSource.data.map(item => {
            item.unitOne = String(res.units);
            this.changesInUnitOne = String(res.units);
            item.difference = String((parseFloat(res.units) - parseFloat(item.unitsRta)).toFixed(3));
            this.data.difference = String((parseFloat(item.unitOne) - parseFloat(item.unitsRta)).toFixed(3));
            if (this.data && (parseFloat(item.difference) === 0.000)) {
              this.disableFreezeBtn = false;
            } else {
              this.disableFreezeBtn = true;
            }
          });
        }

        this.deleteMultipleTransactionArray = [];

        this.selectedFolioUnits = 0;
        this.selectedFolioUnitsFiltered = 0;

        this.shouldShowSelectedFilteredUnits = false;

        if (value.length === 1) {
          this.calculateBalanceUnitOnSingleDelete(index);
        } else {
          this.calculateBalanceUnitOnMultipleDelete();
        }
        this.mainLoader = false;
        this.shouldShowMultipleDelete = false;

        this.eventService.openSnackBar("Deleted Transaction Successfully", "DISMISS");
        this.refreshRequired = true
        this.sendValueToParent();
        // this.dataSource.data['unitOne'] = this.dataSource.data['unitOne'] - res.units;
        // this.dataSource.data['difference'] = this.dataSource.data['unitOne'] - this.dataSource.data['unitsRta'];
        // this.supportService.sendDataThroughObs(res);
      });
  }

  deleteSingleTransaction(element, index) {
    this.deletedTransactions.push(index);
    this.deleteTransactionApi([element.id], index);
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

  calculateBalanceUnitOnMultipleDelete() {
    // balance units of previous record +(units of current record* effect)
    this.changedBalanceUnits = [];
    this.tableData1.map((item, index) => {
      if (index === 0) {
        item.balanceUnits = String((parseFloat(item.units) * item.effect).toFixed(3));
      } else {
        let prevBalUnit = this.tableData1[index - 1].balanceUnits;
        item.balanceUnits = String((parseFloat(prevBalUnit) + (parseFloat(item.units) * item.effect)).toFixed(3));
      }
    });

    if (this.filterBasedOnArr.length === 0) {
      this.dataSource1.data = this.tableData1;
    } else if (this.filterBasedOnArr.length > 0 && this.filterOnWhichTable) {
      this.filterTableValues(this.filterBasedOnArr, this.filterOnWhichTable)
    }

    this.tableData1.forEach(item => {
      this.changedBalanceUnits.push(item.balanceUnits);
    })
  }

  calculateBalanceUnitOnSingleDelete(index) {
    // balance units of previous record +(units of current record* effect);
    this.changedBalanceUnits = [];

    for (let i = index; i < this.dataSource1.data.length; i++) {
      let currentObj = this.dataSource1.data[i];
      if (i !== 0) {
        let prevBalUnit = parseFloat(this.dataSource1.data[i - 1].balanceUnits);
        this.dataSource1.data[i].balanceUnits = String((prevBalUnit + (parseFloat(currentObj.units) * currentObj.effect)).toFixed(3));
      } else {
        this.dataSource1.data[i].balanceUnits = String((parseFloat(currentObj.units) * currentObj.effect).toFixed(3));
      }
    }

    this.dataSource1.data.forEach(item => {
      this.changedBalanceUnits.push(item.balanceUnits);
    })
  }

  filterTableValues(filterBasedOn, whichTable) {
    // this.filteredValues = [];
    // this.filterBasedOn = filterBasedOn;
    this.selectedFolioUnitsFiltered = 0;
    this.filterOnWhichTable = whichTable;
    if (whichTable === 1) {
      if (filterBasedOn.length <= 0) {
        this.dataSource1.data = this.tableData1;
        this.selectedFolioUnitsFiltered = 0;
        this.selectedBalanceUnits = 0;
        this.shouldShowSelectedFilteredUnits = false;
      } else {
        let filteredArray = [];
        filteredArray = this.tableData1.filter((item, index) => {
          if (filterBasedOn.includes(item.transactionType)) {
            this.selectedFolioUnitsFiltered += (parseFloat(item.units.toFixed(3)) * item.effect);
            // if (index === 0) {
            //   this.selectedBalanceUnits = String((parseFloat(item.units) * item.effect).toFixed(3));
            // } else {
            //   let prevBalUnit = this.tableData1[index - 1].balanceUnits;
            //   this.selectedBalanceUnits = String((parseFloat(prevBalUnit) + (parseFloat(item.units) * item.effect)).toFixed(3));
            // }
            return item;
          }
        });

        this.selectedFolioUnitsFiltered = parseFloat(this.selectedFolioUnitsFiltered.toFixed(3));

        this.shouldShowSelectedFilteredUnits = true;
        this.dataSource1.data = filteredArray;
      }
    }
    if (whichTable === 2) {
      if (filterBasedOn.length <= 0) {
        this.dataSource2.data = this.tableData1;
        this.selectedFolioUnits = 0;
      } else {
        let filteredArray = [];
        filteredArray = this.tableData1.filter(item => {
          if (filterBasedOn.includes(item.transactionType)) {
            return item;
          }
        });
        this.shouldShowSelectedFilteredUnits = true;
        this.dataSource2.data = filteredArray;
      }
    }
    // console.log('data filtered', this.dataSource1.data);
  }

  allFolioTransactionTableDataBinding() {
    if (this.data && this.data.tableData.length !== 0) {
      let canDeleteTransaction;
      if (this.data.tableType === "duplicate-folios") {

        const data = {
          ...this.data.dataForDuplicateTransactionCall,
          aum: {
            folio: [...this.data.mutualFundId]
          }
        }
        this.isLoading = true;
        this.reconService.getDuplicateFolioDataValues(data)
          .subscribe(res => {
            this.isLoading = false;
            if (res) {
              if (res[0].mutualFundTransactions.length !== 0) {
                res[0].mutualFundTransactions.forEach((element, index1) => {
                  if (this.data.hasOwnProperty('freezeDate') && this.data.freezeDate) {
                    let date1 = new Date(element.transactionDate);
                    let date2 = new Date(element.freezeDate);
                    if (date1.getTime() > date2.getTime()) {
                      canDeleteTransaction = true;
                    } else {
                      if (this.isUnfreezeClicked) {
                        canDeleteTransaction = true;
                      } else {
                        if (element.rt === 6) {
                          canDeleteTransaction = true;
                        } else {
                          canDeleteTransaction = false;
                        }
                      }
                    }
                    this.disableDeletionForTable2 = true;
                  } else {
                    this.disableDeletionForTable2 = false;
                    canDeleteTransaction = true;
                  }
                  this.keepStatus.push(element.keep);
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
                    canDeleteTransaction,
                    rt: element.rt
                  });
                  if (!(this.filterList.includes(element.fwTransactionType))) {
                    this.filterList.push(element.fwTransactionType);
                  }
                });
                this.dataSource2.data = this.tableData1;
              } else {
                this.eventService.openSnackBar("No Transaction Found", 'DISMISS');
                this.dataSource2.data = null;
              }
            } else {
              this.eventService.openSnackBar("Transaction Fetch Failed", "DISMISS");
            }
          }, err => {
            this.isLoading = false;
            this.eventService.openSnackBar("ransaction Fetch Failed check errors", "DISMISS");
            console.error(err);
          })
      } else if (this.data.tableType === "all-folios") {
        this.data.tableData.forEach((element, index1) => {
          if (this.data.hasOwnProperty('freezeDate') && this.data.freezeDate) {
            let date1 = new Date(element.transactionDate);
            let date2 = new Date(this.data.freezeDate);
            if (date1.getTime() > date2.getTime()) {
              canDeleteTransaction = true;
            } else {
              if (this.isUnfreezeClicked) {
                canDeleteTransaction = true
              } else {
                if (element.rt === 6) {
                  canDeleteTransaction = true;
                } else {
                  canDeleteTransaction = false;
                }
              }
            }
            this.disableDeletionForTable2 = true;
          } else {
            this.disableDeletionForTable2 = false;
            canDeleteTransaction = true;
          }
          this.keepStatus.push(element.keep);
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
            canDeleteTransaction,
            effect: element.effect,
            rt: element.rt
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
    this.supportService.putAumTransactionKeepOrRemove(this.isKeepArray)
      .subscribe(res => {
        this.keepStatus = [];
        this.dataSource2.data.forEach(item => {
          this.keepStatus.push(item.keep);
        });
        this.misAumDataStorageService.clearStorage();
        this.misAumDataStorageService.callApiData();

        if (this.filterBasedOn && this.filterOnWhichTable) {
          this.filterTableValues(this.filterBasedOn, this.filterOnWhichTable);
        }
        this.canUpdateTransactions = false;
        this.refreshAfterUpdateKeepOrRemove = true;
        // console.log(res);
        this.dataSource.data.map(element => {
          element.unitOne = String(parseFloat(res.units).toFixed(3));
          this.changesInUnitOne = String(parseFloat(res.units).toFixed(3));
          element.difference = String((parseFloat(res.units) - parseFloat(element.unitsRta)).toFixed(3));
          if (Math.round(parseFloat(element.difference)) === 0) {
            this.disableFreezeBtn = false;
          } else {
            this.disableFreezeBtn = true;
          }
        });
        this.isKeepArray = [];
        this.mainLoader = false;
        this.shouldShowMultipleDelete = false;

      });
  }

  viewAllTransactions() {
    const obj = {
      mutualFundId: this.data.mutualFundId
    }
    this.isLoading = true;
    this.dataSource1.data = ELEMENT_DATA1
    this.supportService.getAllRestoreTransactions(obj).subscribe(
      data => {
        this.isLoading = false;
        if (data) {
          const arrayList = []
          let canDeleteTransaction;
          data.forEach(element => {
            if (this.data.hasOwnProperty('freezeDate') && this.data.freezeDate) {
              let date1 = new Date(element.transactionDate);
              let date2 = new Date(this.data.freezeDate);
              if (date1.getTime() > date2.getTime()) {
                canDeleteTransaction = true;
              } else {
                if (this.isUnfreezeClicked) {
                  canDeleteTransaction = true
                } else {
                  if (element.rt === 6) {
                    canDeleteTransaction = true;
                  } else {
                    canDeleteTransaction = false;
                  }
                }
              }
              this.disableDeletionForTable2 = true;
            } else {
              this.disableDeletionForTable2 = false;
              canDeleteTransaction = true;
            }
            arrayList.push({
              // srNo: index1 + 1,
              id: element.id,
              transactionType: element.fwTransactionType,
              date: element.transactionDate,
              amount: element.amount,
              units: element.unit,
              balanceUnits: element.balanceUnits,
              actions: '',
              keep: element.keep,
              nav: element.purchasePrice ? element.purchasePrice : null,
              canDeleteTransaction,
              effect: element.effect,
              rt: element.rt
            })
          });
          this.dataSource1.data = arrayList;
        } else {
          this.dataSource.data = null;
          this.isLoading = false;
        }
      }, err => {
        this.dataSource.data = null;
        this.isLoading = false;
        this.eventService.openSnackBar(err, "Dismiss");
      }
    )
  }

  restoreTransaction(data) {
    const array = [
      data.id
    ]
    this.mainLoader = true;
    this.supportService.restoreMfTranasction(array).subscribe(
      res => {
        this.mainLoader = false;
        if (res) {
          let array = this.dataSource.data;
          array[0].unitOne = res.units;
          this.dataSource.data = array;
          this.refreshRequired = true;
          this.sendValueToParent();
          this.viewAllTransactions();
        }
      }, err => {
        this.mainLoader = false;
        this.eventService.openSnackBar(err, "Dismiss");
      }
    )
  }

  shouldKeepOrRemove(value, element, index) {
    if (this.disableDeletionForTable2) {
      this.eventService.openSnackBar("Please Unfreeze Folio", "DISMISS");
    } else {
      const id = this.dataSource2.data.indexOf(element);
      let dateObj = new Date(this.data.aumDate);
      let dateFormat = dateObj.getFullYear() + '-' + `${(dateObj.getMonth() + 1) < 10 ? '0' : ''}` + (dateObj.getMonth() + 1) + '-' + `${(dateObj.getDate()) < 10 ? '0' : ''}` + dateObj.getDate();

      if (value == 1) {
        this.dataSource2.data[id].keep = true;
      } else {
        this.dataSource2.data[id].keep = false;
      }

      if (this.isKeepArray.length !== 0 && this.isKeepArray.some(item => item.id === element.id)) {
        let itemObj = this.isKeepArray.find(i => i.id === element.id);
        let index1 = this.isKeepArray.indexOf(itemObj);
        this.isKeepArray[index1] = {
          id: element.id,
          aumDate: dateFormat,
          isKeep: value == 1 ? true : false
        }
        if (this.keepStatus[index] === this.isKeepArray[index1].isKeep) {
          this.isKeepArray.splice(index1, 1);
        }
      } else if (this.isKeepArray.length === 0 || this.isKeepArray.some(item => item.id !== element.id)) {
        this.isKeepArray.push({
          id: element.id,
          aumDate: dateFormat,
          isKeep: value == 1 ? true : false
        });
      }

      console.log(this.isKeepArray);

      let changedKeepStatus = [];

      this.dataSource2.data.forEach(item => {
        changedKeepStatus.push(item.keep);
      })
      for (let i = 0; i <= this.keepStatus.length; i++) {
        if (this.keepStatus[i] !== changedKeepStatus[i]) {
          this.canUpdateTransactions = true;
          break;
        } else {
          this.canUpdateTransactions = false;
        }
      }
    }
  }

  sendValueToParent() {
    let refreshRequired = this.refreshRequired ? true : (Math.round(this.data.difference) === 0) ? true : false;
    if (refreshRequired) {
      this.subscriptionInject.setRefreshRequired()
    }

    this.subscriptionInject.setSliderData({
      fromAllFolioOrDuplicateTab: this.data.fromAllFolioOrDuplicateTab,
      deletedTransactionsIndexes: this.deletedTransactions,
      isUnfreezeClicked: this.isUnfreezeClicked,
      isFreezeClicked: this.isFreezeClicked,
      changesInUnitOne: this.changesInUnitOne,
      changedBalanceUnits: this.changedBalanceUnits
    })
  }

  dialogClose() {
    if (!this.isTransactionDeleted) {
      this.deletedTransactions = [];
    }
    let refreshRequired = this.refreshRequired ? true : (Math.round(this.data.difference) === 0) ? true : false;
    this.subscriptionInject
      .changeNewRightSliderState({
        state: 'close',
        refreshRequired,
        data: {
          fromAllFolioOrDuplicateTab: this.data.fromAllFolioOrDuplicateTab,
          deletedTransactionsIndexes: this.deletedTransactions,
          isUnfreezeClicked: this.isUnfreezeClicked,
          isFreezeClicked: this.isFreezeClicked,
          changesInUnitOne: this.changesInUnitOne,
          changedBalanceUnits: this.changedBalanceUnits
        }
      });
  }

}

interface PeriodicElement {
  unitOne: string;
  unitsRta: string;
  difference: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { unitOne: '', unitsRta: '', difference: '', },
];

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
