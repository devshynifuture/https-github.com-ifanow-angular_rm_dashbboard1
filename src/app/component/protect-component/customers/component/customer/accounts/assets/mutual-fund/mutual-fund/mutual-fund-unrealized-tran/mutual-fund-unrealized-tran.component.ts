import {AuthService} from './../../../../../../../../../../auth-service/authService';
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {MfServiceService} from '../../mf-service.service';
import {RightFilterComponent} from 'src/app/component/protect-component/customers/component/common-component/right-filter/right-filter.component';
import {ExcelGenService} from 'src/app/services/excel-gen.service';
import {CustomerService} from '../../../../../customer.service';
import {EventService} from 'src/app/Data-service/event.service';
import {map} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {MFSchemeLevelHoldingsComponent} from '../mfscheme-level-holdings/mfscheme-level-holdings.component';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-mutual-fund-unrealized-tran',
  templateUrl: './mutual-fund-unrealized-tran.component.html',
  styleUrls: ['./mutual-fund-unrealized-tran.component.scss']
})
export class MutualFundUnrealizedTranComponent implements OnInit {
  displayedColumns: string[] = ['no', 'transactionType', 'transactionDate', 'transactionAmount', 'transactionNav',
    'units', 'balanceUnits', 'days', 'currentValue', 'dividendPayout', 'dividendReinvest', 'totalAmount', 'gain', 'absReturn', 'xirr', 'icons'];
  displayedColumnsTotal: string[] = ['noTotal', 'transactionTypeTotal', 'transactionDateTotal', 'transactionAmountTotal', 'transactionNavTotal',
    'unitsTotal', 'balanceUnitsTotal', 'daysTotal', 'currentValueTotal', 'dividendPayoutTotal', 'dividendReinvestTotal', 'totalAmountTotal', 'gainTotal', 'absReturnTotal', 'xirrTotal', 'iconsTotal'];
  displayedColumns2: string[] = ['categoryName', 'amtInvested', 'currentValue', 'dividendPayout', 'dividendReinvest',
    'gain', 'absReturn', 'xirr', 'allocation'];
  // subCategoryData: any[];
  // schemeWise: any[];
  mfData;
  mutualFundList: any[];
  isLoading = false;
  dataSource = new MatTableDataSource([{}, {}, {}]);
  grandTotal: any = {};
  schemeWiseForFilter: any;
  mutualFundListFilter: any[];
  type: any = {name: ''};
  isSpinner = false;
  customDataHolder = [];
  customDataSource = new MatTableDataSource([{}, {}, {}]);
  @ViewChild('tableEl', {static: false}) tableEl;
  rightFilterData: any = {reportType: ''};
  adviorData: any;
  fragmentData = {isSpinner: false};
  @Output() changeInput = new EventEmitter();
  advisorData: any;
  // displayedColumns: string[];
  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();
  viewMode: string;
  reponseData: any;
  setDefaultFilterData: any;
  mfGetData: any;
  columns = [];
  displayColArray: any[];
  saveFilterData: any;
  savedFilterData: any;
  inputData: any;
  schemeWise: any[];
  subCategoryData: any;
  transactionTypeList: any;
  returnValue: any;
  selectedLoadData: any;

  constructor(public dialog: MatDialog, private datePipe: DatePipe, private subInjectService: SubscriptionInject, private utilService: UtilService,
              private mfService: MfServiceService, private excel: ExcelGenService, private custumService: CustomerService, private eventService: EventService) {
  }

  mutualFund;

  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data ', data);
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.mfService.getViewMode()
      .subscribe(res => {
        this.viewMode = res;
      });
    this.getFilterData((this.viewMode == 'Unrealized Transactions') ? 4 : 3);

    if (this.viewMode == 'Unrealized Transactions') {
      this.displayedColumns = ['no', 'transactionType', 'transactionDate', 'transactionAmount', 'transactionNav',
        'units', 'currentValue', 'dividendPayout', 'dividendReinvest', 'totalAmount', 'gain', 'absReturn', 'xirr'];
      this.displayedColumnsTotal = ['noTotal', 'transactionTypeTotal', 'transactionDateTotal', 'transactionAmountTotal', 'transactionNavTotal',
        'unitsTotal', 'currentValueTotal', 'dividendPayoutTotal', 'dividendReinvestTotal', 'totalAmountTotal', 'gainTotal', 'absReturnTotal',
        'xirrTotal'];

    } else {
      this.displayedColumns = ['no', 'transactionType', 'transactionDate', 'transactionAmount', 'transactionNav',
        'units', 'balanceUnits', 'days', 'icons'];
    }
  }


  getFilterData(value) {
    this.mfService.getMfData()
      .subscribe(res => {
        this.mutualFund = res;
      });
    this.mfService.getFilterValues()
      .subscribe(res => {
        this.setDefaultFilterData = res;
      });
    this.mfService.getDataForMfGet()
      .subscribe(res => {
        this.mfGetData = res;
      });
    this.mfService.getTransactionType()
      .subscribe(res => {
        this.getTransactionType(res);
      });
    this.isLoading = true;
    this.changeInput.emit(true);
    const obj = {
      advisor_id: this.advisorId,
      clientId: this.clientId,
      reportId: value
    };
    this.custumService.getSaveFilters(obj).subscribe(
      data => {
        if (data) {
          let allClient = [];
          let currentClient = [];
          let transactionView = [];
          let getList = [];
          // let displaycopy =[];
          this.displayedColumns = [];
          this.displayedColumnsTotal = [];
          data.forEach(element => {
            if (element.clientId == 0) {
              const obj = {
                displayName: element.columnName,
                selected: element.selected
              };
              allClient.push(obj);
            } else {
              const obj = {
                displayName: element.columnName,
                selected: element.selected
              };
              getList.push(element);
              currentClient.push(obj);
            }
          });
          if (getList.length > 0) {
            transactionView = currentClient;
          } else {
            transactionView = allClient;
          }
          transactionView.forEach(element => {
            if (element.selected == true) {
              this.displayedColumns.push(element.displayName);
              this.displayedColumnsTotal.push(element.displayName + 'Total');
            }
          });

          this.saveFilterData = {
            transactionView: transactionView,
            showFolio: (getList.length > 0) ? ((getList[0].showZeroFolios == true) ? '1' : '2') : (data[0].showZeroFolios == true) ? '1' : '2',
            reportType: (getList.length > 0) ? (getList[0].reportType) : data[0].reportType,
            selectFilter: (currentClient.length > 0) ? this.clientId : 0
          };
          this.mfData = this.mfGetData;
          if (this.viewMode == 'Unrealized Transactions') {
            this.isLoading = true;
            this.getUnrealizedData();
          } else if (this.viewMode != 'Unrealized Transactions' && this.mfGetData != '') {
            this.isLoading = true;
            this.changeInput.emit(true);
            this.getMutualFundResponse(this.mfGetData);
          } else if (this.viewMode != 'Unrealized Transactions' && this.mutualFund) {
            this.isLoading = true;
            this.changeInput.emit(true);
            this.getMutualFundResponse(this.mutualFund);
          } else {
            this.getMutualFund();
          }
        }
      },
      (error) => {
        this.mfData = this.mfGetData;
        if (this.viewMode == 'Unrealized Transactions') {
          this.isLoading = true;
          this.getUnrealizedData();
        } else if (this.viewMode != 'Unrealized Transactions' && this.mfGetData != '') {
          this.isLoading = true;
          this.changeInput.emit(true);
          this.getMutualFundResponse(this.mfGetData);
        } else if (this.viewMode != 'Unrealized Transactions' && this.mutualFund) {
          this.isLoading = true;
          this.changeInput.emit(true);
          this.getMutualFundResponse(this.mutualFund);
        } else {
          this.getMutualFund();
        }
      }
    );

  }

  initValueOnInit() {

    if (this.mutualFund.mutualFundList.length > 0) {
      this.isLoading = true;
      this.changeInput.emit(true);
      this.advisorData = this.mutualFund.advisorData;

      // this.getSubCategoryWise(this.mutualFund);
      // this.getSchemeWise();
      // this.mfSchemes();
      // this.dataSource.data = this.getCategory(this.mutualFundList, '', this.mfService);
      // this.grandTotal = this.getfinalTotalValue(this.mutualFundList, this.mfService);
      // for displaying table values as per category
      // this.customDataSource.data = this.subCatArray(this.mutualFundList, '', this.mfService);
      // this.getDataForRightFilter();
    } else {
      this.isLoading = false;
      this.changeInput.emit(false);
      this.customDataSource.data = [];
      this.customDataHolder = [];
    }
  }

  getMutualFund() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.custumService.getMutualFund(obj).pipe(map((data) => {
      return this.doFiltering(data);
    })).subscribe(
      data => this.getMutualFundResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }

  doFiltering(data) {
    if (this.inputData == 'scheme wise') {
      this.rightFilterData.reportType = [];
      this.rightFilterData.reportType[0] = {
        name: 'Scheme wise',
        selected: true
      };
      data.subCategoryData = this.mfService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
      this.schemeWise = this.mfService.filter(this.subCategoryData, 'mutualFundSchemeMaster');
    } else {
      data.subCategoryData = this.mfService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
      data.schemeWise = this.mfService.filter(data.subCategoryData, 'mutualFundSchemeMaster');
      data.mutualFundList = this.mfService.filter(data.schemeWise, 'mutualFund');
    }
    return data;

    // data.subCategoryData = this.mfService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    // data.schemeWise = this.mfService.filter(data.subCategoryData, 'mutualFundSchemeMaster');
    // data.mutualFundList = this.mfService.filter(data.schemeWise, 'mutualFund');
    // return data;
  }

  getMutualFundResponse(data) {
    if (data) {
      this.mfData = data;
      // this.mutualFund = data;
      this.mfService.changeShowMutualFundDropDown(false);
      this.mutualFundList = this.mutualFund.mutualFundList;
      // this.asyncFilter(this.mutualFundList);
      this.asyncFilter(this.mfData.mutualFundList);

      // this.initValueOnInit();
      // if (this.mfData) {
      //   this.mfData.advisorData = this.mfService.getPersonalDetails(this.advisorId);
      // }
    }
  }

  // ngOnChanges(changes: SimpleChanges) {

  //   for (const propName in changes) {
  //     const chng = changes[propName];
  //     const cur = JSON.stringify(chng.currentValue);
  //     const prev = JSON.stringify(chng.previousValue);
  //     // console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
  //   }
  //   if (changes.mutualFund && !!changes.mutualFund.currentValue) {
  //     if (this.mutualFund.mutualFundList.length > 0) {
  //       if (this.mutualFund.viewMode == 'Unrealized Transactions') {
  //         this.getUnrealizedData();
  //       } else {
  //         this.mutualFundList = this.mutualFund.mutualFundList;
  //         this.asyncFilter(this.mutualFundList);
  //       }
  //     } else {
  //       this.dataSource.data = [];
  //       this.customDataSource.data = [];
  //     }

  //   }
  // }

  getUnrealizedData() {
    const myArray = (this.mfGetData) ? this.mfGetData.mutualFundList : this.mutualFund.mutualFundList;
    const list = [];
    myArray.forEach(val => list.push(Object.assign({}, val)));
    // let list =[];
    // list =(this.mfGetData) ? this.mfGetData.mutualFundList : this.mutualFund.mutualFundList;
    list.forEach(element => {
      element.navDate = this.datePipe.transform(element.navDate, 'yyyy-MM-dd');
      element.mutualFundTransactions = [];
      // element.mutualFundTransactions.forEach(element => {
      //   element.transactionDate =  this.datePipe.transform(element.transactionDate, 'yyyy-MM-dd')
      // });
    });
    const obj = {
      mutualFundList: list
    };
    this.custumService.getMfUnrealizedTransactions(obj).subscribe(
      data => {
        // console.log(data);
        // this.mutualFund.mutualFundList = data;
        // this.asyncFilter(this.mutualFund.mutualFundList);
        this.asyncFilter(data);

      }, (error) => {
        this.isLoading = false;
        this.dataSource.data = [];
        this.customDataSource.data = [];
        this.customDataHolder = [];
        this.eventService.showErrorMessage(error);
        this.changeInput.emit(false);
      }
    );
  }


  asyncFilter(mutualFund) {
    if (typeof Worker !== 'undefined') {
      // console.log(`13091830918239182390183091830912830918310938109381093809328`);
      this.rightFilterData.reportType = [];
      this.rightFilterData.reportType[0] = {
        name: (this.reponseData) ? this.setDefaultFilterData.reportType : ((this.saveFilterData) ? this.saveFilterData.reportType : this.setDefaultFilterData.reportType),
        selected: true,
      };
      const input = {
        mutualFundList: mutualFund,
        type: (this.rightFilterData.reportType) ? this.rightFilterData.reportType : '',
        nav: this.mutualFund.nav,
        // mutualFund:this.mfData,
        mutualFund: this.mutualFund,
        transactionType: this.rightFilterData.transactionType,
        viewMode: this.viewMode
        // mfService: this.mfService
      };
      // Create a new
      const worker = new Worker('./mutual-fund-unrealized.worker.ts', {type: 'module'});
      worker.onmessage = ({data}) => {
        this.grandTotal = data.totalValue;
        this.dataSource.data = (data.dataSourceData);
        this.customDataSource.data = (data.customDataSourceData);
        this.customDataHolder = data.customDataHolder;
        // console.log(`MUTUALFUND COMPONENT page got message:`, data);
        this.isLoading = false;
        this.changeInput.emit(false);
      };
      worker.postMessage(input);
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  Excel(tableTitle) {
    this.fragmentData.isSpinner = true;
    const rows = this.tableEl._elementRef.nativeElement.rows;
    const data = this.excel.generateExcel(rows, tableTitle);
    if (data) {
      this.fragmentData.isSpinner = false;
    }
  }

  mfSchemes() {// get last mf list
  }


  getDataForRightFilter() {// for rightSidefilter data this does not change after generating report
    const subCatData = this.mfService.filter(this.mutualFund.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    this.schemeWiseForFilter = this.mfService.filter(subCatData, 'mutualFundSchemeMaster');
    this.mutualFundListFilter = this.mfService.filter(this.schemeWiseForFilter, 'mutualFund');
  }

  openMutualEditFund(flag, element) {

    this.mutualFundList.forEach(ele => {
      ele.mutualFundTransactions.forEach(tran => {
        if (tran.id == element.id) {
          this.selectedLoadData = ele;
        }
      });
    });
    this.mfService.getMutualFundData()
      .subscribe(res => {
        const fragmentData = {
          flag: 'editTransaction',
          data: {family_member_list: res['family_member_list'], flag, ...element, ...this.selectedLoadData},
          id: 1,
          state: 'open',
          componentName: MFSchemeLevelHoldingsComponent
        };
        const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
          sideBarData => {
            // console.log('this is sidebardata in subs subs : ', sideBarData);
            if (UtilService.isDialogClose(sideBarData)) {
              if (UtilService.isRefreshRequired(sideBarData)) {
                this.getMutualFund();
              }
              // console.log('this is sidebardata in subs subs 2: ', sideBarData);
              rightSideDataSub.unsubscribe();
            }
          }
        );
      });

  }

  deleteModal(value, element) {
    let deletedId;
    this.mutualFund.mutualFundList.forEach(obj => {
      element.mutualFundTransactions.forEach(ele => {
        if (ele.id == element.id) {
          deletedId = obj.id;
        }
      });
    });
    // console.log("this is what im sending:::", element);
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        // this.subService.deleteInvoices(this.list).subscribe(
        //   data => {
        //     this.dataCount = 0;
        //     this.eventService.openSnackBar('invoice deleted successfully.', 'Dismiss');
        //     dialogRef.close(this.list);

        //   },
        //   error => this.eventService.showErrorMessage(error)
        // );
        // dialogRef.close(listIndex);
        if (value === 'mutualFund') {
          const obj = {id: deletedId};
          this.custumService.postMutualFundDelete(obj)
            .subscribe(res => {
              if (res) {
                this.eventService.openSnackBar('Deleted Successfully', 'DISMISS');
              }
            });
        } else if (value === 'deleteTransaction') {

          // let requestJsonObj;
          // const data = {
          //   id: element.id,
          //   unit: element.unit,
          //   effect: element.effect,
          //   mutualFundId: ''
          // };
          // requestJsonObj = {
          //   freezeDate: element.freezeDate ? element.freezeDate : null,
          //   mutualFundTransactions: [data]
          // }

          // this.custumService.postDeleteTransactionMutualFund(requestJsonObj)
          //   .subscribe(res => {
          //     if (res) {
          //       console.log("success::", res);
          //       this.eventService.openSnackBar("Deletion Completed", "DISMISS")
          //     } else {
          //       this.eventService.openSnackBar("Deletion Failed", "DISMISS")
          //     }
          //   })
        }

      },
      negativeMethod: () => {
        // console.log('2222222222222222222222222222222222222');
      }
    };
    // console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  getTransactionType(res) {
    let filterData = [];
    res.forEach(element => {
      const obj = {
        name: element,
        selected: false
      };
      filterData.push(obj);
    });
    this.transactionTypeList = filterData;
  }

  openFilter() {

    const fragmentData = {
      flag: 'openFilter',
      data: {},
      id: 1,
      state: 'open35',
      componentName: RightFilterComponent
    };
    // fragmentData.data = {
    //   name: (this.viewMode == 'Unrealized Transactions') ? 'UNREALIZED TRANSACTION REPORT' : 'ALL TRANSACTION REPORT',
    //   mfData: this.mutualFund,
    //   folioWise: this.mutualFund.mutualFundList,
    //   schemeWise: this.mutualFund.schemeWise,
    //   familyMember: this.mutualFund.family_member_list,
    //   category: this.mutualFund.mutualFundCategoryMastersList,
    //   transactionView: this.displayedColumns,
    //   fromDate:this.setDefaultFilterData.fromDate,
    //   toDate:this.setDefaultFilterData.toDate,
    //   reportType :this.setDefaultFilterData.reportType,
    //   showFolio :this.setDefaultFilterData.showFolio
    // };
    fragmentData.data = {
      name: (this.viewMode == 'Unrealized Transactions') ? 'UNREALIZED TRANSACTION REPORT' : 'ALL TRANSACTION REPORT',
      mfData: this.mutualFund,
      folioWise: this.setDefaultFilterData.folioWise,
      schemeWise: this.setDefaultFilterData.schemeWise,
      familyMember: this.mutualFund.family_member_list,
      category: this.setDefaultFilterData.category,
      transactionView: (this.saveFilterData) ? this.saveFilterData.transactionView : this.displayedColumns,
      scheme: this.setDefaultFilterData.scheme,
      reportType: (this.reponseData) ? this.setDefaultFilterData.reportType : ((this.saveFilterData) ? this.saveFilterData.reportType : this.setDefaultFilterData.reportType),
      // reportType: (this.saveFilterData) ? this.saveFilterData.reportType : this.setDefaultFilterData.reportType,
      reportAsOn: this.setDefaultFilterData.reportAsOn,
      showFolio: (this.saveFilterData) ? this.saveFilterData.showFolio : this.setDefaultFilterData.showFolio,
      fromDate: this.setDefaultFilterData.fromDate,
      toDate: this.setDefaultFilterData.toDate,
      transactionPeriod: this.setDefaultFilterData.transactionPeriod,
      transactionPeriodCheck: this.setDefaultFilterData.transactionPeriodCheck,
      selectFilter: (this.saveFilterData) ? this.saveFilterData.selectFilter : null,
      transactionTypeList: (this.rightFilterData.transactionType) ? this.rightFilterData.transactionType : this.transactionTypeList
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        // console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          // console.log('this is sidebardata in subs subs 2: ', sideBarData);
          if (sideBarData.data && sideBarData.data != 'Close') {
            this.dataSource.data = ([{}, {}, {}]);
            this.customDataSource.data = ([{}, {}, {}]);
            this.isLoading = true;
            this.changeInput.emit(true);
            this.rightFilterData = sideBarData.data;
            this.saveFilterData = {};
            // this.columns =[];
            // this.rightFilterData.transactionView.forEach(element => {
            //   if(element.selected == true){
            //     this.columns.push(element.displayName)
            //   }
            // });
            // this.displayedColumns =[];
            // this.displayedColumns = this.columns;
            // this.displayColArray=[];
            // this.rightFilterData.transactionView.forEach(element => {
            //   const obj = {
            //     displayName: element.displayName,
            //     selected:true
            //   };
            //   this.displayColArray.push(obj);
            // });
            // this.type = this.rightFilterData.reportType[0];
            this.reponseData = this.doFiltering(this.rightFilterData.mfData);
            this.mfData = this.reponseData;
            this.displayColArray = [];
            this.rightFilterData.transactionView.forEach(element => {
              const obj = {
                displayName: element.displayName,
                selected: true
              };
              this.displayColArray.push(obj);
            });
            this.setDefaultFilterData = this.mfService.setFilterData(this.mutualFund, this.rightFilterData, this.displayedColumns);
            // this.asyncFilter(this.reponseData.mutualFundList);
            this.mfService.setFilterValues(this.setDefaultFilterData);
            this.mfService.setDataForMfGet(this.rightFilterData.mfData);
            this.getFilterData((this.viewMode == 'Unrealized Transactions') ? 4 : 3);
            // this.dataSource.data = this.getCategory(this.rightFilterData.mutualFundList,
            // this.rightFilterData.reportType, this.mfService);
            // this.customDataSource.data = this.subCatArray(this.rightFilterData.mutualFundList,
            // this.rightFilterData.reportType, this.mfService);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  isTotal = (index, item) => item.total == 'Total';
  isGroup = (index, item) => item.groupName;// group category wise
  //   return item.groupName;
  // }

  isGroup2 = (index, item) => item.schemeName;// for grouping schme name
  //   return item.schemeName;
  //   return item.nav;
  // }

  isGroup3 = (index, item) => item.name;// for grouping family member name
  //   return item.name;
  //   return item.pan;
  //   return item.folio;
  // }

  isGroup4 = (index, item) => item.total;// for getting total of each scheme
  //   return item.total;
  //   return item.totalTransactionAmt;
  //   return item.totalUnit;
  //   return item.totalNav;
  //   return item.totalCurrentValue;
  //   return item.dividendPayout;
  //   return item.divReinvestment;
  //   return item.totalAmount;
  //   return item.gain;
  //   return item.absReturn;
  //   return item.xirr;
  // }

  generatePdf() {
    this.fragmentData.isSpinner = true;
    const para = document.getElementById('template');
    this.returnValue = this.utilService.htmlToPdf(para.innerHTML, 'Test', this.fragmentData);
    // if(data){
    //   this.isSpinner = false;
    // }
  }

}
