import { Component, ElementRef, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { RightFilterComponent } from 'src/app/component/protect-component/customers/component/common-component/right-filter/right-filter.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { FolioMasterDetailsComponent } from 'src/app/component/protect-component/customers/component/common-component/folio-master-details/folio-master-details.component';
import { SipDetailsComponent } from 'src/app/component/protect-component/customers/component/common-component/sip-details/sip-details.component';
import { AddMutualFundComponent } from '../add-mutual-fund/add-mutual-fund.component';
import { MFSchemeLevelHoldingsComponent } from '../mfscheme-level-holdings/mfscheme-level-holdings.component';
import { MFSchemeLevelTransactionsComponent } from '../mfscheme-level-transactions/mfscheme-level-transactions.component';
import { MfServiceService } from '../../mf-service.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { WebworkerService } from '../../../../../../../../../../services/web-worker.service';
import { MUTUAL_FUND_SUMMARY } from '../../mutual-fund.script';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { UpperCustomerComponent } from 'src/app/component/protect-component/customers/component/common-component/upper-customer/upper-customer.component';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from '../../../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-mutual-fund-summary',
  templateUrl: './mutual-fund-summary.component.html',
  styleUrls: ['./mutual-fund-summary.component.scss']
})
export class MutualFundSummaryComponent implements OnInit {

  displayedColumns = ['schemeName', 'amountInvested', 'currentValue', 'unrealizedProfit', 'absoluteReturn',
    'xirr', 'dividendPayout', 'switchOut', 'balanceUnit', 'navDate', 'sipAmount', 'icons'];
  mfData: any;
  grandTotal: any = {};
  // subCategoryData: any[];
  // schemeWise: any[];
  mutualFundList: any[];
  rightFilterData: any = { reportType: '' };
  totalObj: any;
  customDataSource = new MatTableDataSource([{}, {}, {}]);
  catObj: {};
  isLoading = false; // added for prod build
  displayColumnsPDf: any;
  fragmentData = { isSpinner: false };
  advisorData: any;

  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();
  // schemeWiseForFilter: any[];
  // mutualFundListFilter: any[];
  @ViewChild('tableEl', { static: false }) tableEl;
  @Output() changeInput = new EventEmitter();
  viewMode: string;
  reponseData: any;
  setDefaultFilterData: any;

  inputData: any;
  mfGetData: string;
  displayColArray = [];
  resData: any;
  columns = [];
  saveFilterData: any;
  savedFilterData: any;
  returnValue: any;
  selectedDataLoad: any;
  showDownload: boolean = false;
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data ', data);
  }
  get data() {
    return this.inputData;
  }

  constructor(
    private subInjectService: SubscriptionInject,
    private utilService: UtilService,
    private mfService: MfServiceService,
    private excel: ExcelGenService,
    private workerService: WebworkerService,
    public dialog: MatDialog,
    public eventService: EventService,
    private customerService: CustomerService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  mutualFund;
  @ViewChild('summaryTemplate', { static: false }) summaryTemplate: ElementRef;

  ngOnInit() {
    this.mfService.getViewMode()
      .subscribe(res => {
        this.viewMode = res;
      })
      this.getFilterData(2);
  }
  getFilterData(value) {
    this.isLoading = true;
      this.changeInput.emit(true);
    this.mfService.getMfData()
    .subscribe(res => {
      this.mutualFund = res;
    })
  this.mfService.getFilterValues()
    .subscribe(res => {
      this.setDefaultFilterData = res;
    })
  this.mfService.getDataForMfGet()
    .subscribe(res => {
      this.mfGetData = res;
    })
    const obj = {
      advisor_id: this.advisorId,
      clientId: this.clientId,
      reportId: value
    }
    this.customerService.getSaveFilters(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          let allClient = [];
          let currentClient = [];
          let transactionView = [];
          let getList = [];
          // let displaycopy =[];
          this.displayedColumns = [];
          data.forEach(element => {
            if (element.clientId == 0) {
              const obj = {
                displayName: element.columnName,
                selected: element.selected
              }
              allClient.push(obj);
              // if(element.selected == true){
              //   this.displayedColumns.push(element.columnName)
              // }
            } else {
              const obj = {
                displayName: element.columnName,
                selected: element.selected
              }
              getList.push(element);
              currentClient.push(obj);
              // if(element.selected == true){
              //   this.displayedColumns.push(element.columnName)
              // }
            }
          });
          if (getList.length > 0) {
            transactionView = currentClient
          } else {
            transactionView = allClient
          }
          transactionView.forEach(element => {
            if (element.selected == true) {
              this.displayedColumns.push(element.displayName)
            }
          });


          this.saveFilterData = {
            transactionView: transactionView,
            showFolio: (getList.length > 0) ? ((getList[0].showZeroFolios == true) ? '1' : '2') :  (data[0].showZeroFolios == true) ? '1' : '2',
            reportType: (getList.length > 0) ? (getList[0].reportType) : data[0].reportType,
            selectFilter: (getList.length > 0) ? this.clientId : 0
          }
          if (this.mfGetData) {
            this.getMutualFundResponse(this.mfGetData)
          } else if (this.mutualFund) {
            this.getMutualFundResponse(this.mutualFund)
          } else {
            this.getMutualFund();
          }
        }
      },
      (error)=>{
        if (this.mfGetData) {
          this.getMutualFundResponse(this.mfGetData)
        } else if (this.mutualFund) {
          this.getMutualFundResponse(this.mutualFund)
        } else {
          this.getMutualFund();
        }
      }

    );

  }
  calculationOninit() {
    if (this.mutualFund.mutualFundList.length > 0) {
      this.isLoading = true;
      this.changeInput.emit(true);
      // this.mutualFundList = this.mutualFund.mutualFundList;
      this.mutualFundList = this.mfData.mutualFundList;
      this.advisorData = this.mutualFund.advisorData;
      // this.getListForPdf(this.displayedColumns);
      // this.getSubCategoryWise(this.mutualFund); // get subCategoryWise list
      // this.getSchemeWise(); // get scheme wise list
      // this.mfSchemes(); // get mutualFund list
      // for displaying table values as per category
      // this.customDataSource.data = this.subCatArrayForSummary(this.mutualFund.mutualFundList, '', this.mfService);
      // this.getDataForRightFilter();
      // const input = {
      //   mutualFundList: this.mutualFundList,
      //   type: '',
      // mfService: this.mfService
      // };
      this.asyncFilter(this.mutualFundList);
    } else {
      this.isLoading = false;
      this.changeInput.emit(false);
      this.customDataSource.data = [];
    }
  }

  getMutualFund() {
    this.isLoading = true;
    this.customDataSource.data = [{}, {}, {}];
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.customerService.getMutualFund(obj).pipe(map((data) => {
      return this.doFiltering(data);
    })).subscribe(
      data => this.getMutualFundResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }

  doFiltering(data) {
    data.subCategoryData = this.mfService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    data.schemeWise = this.mfService.filter(data.subCategoryData, 'mutualFundSchemeMaster');
    data.mutualFundList = this.mfService.filter(data.schemeWise, 'mutualFund');
    return data;
  }

  getMutualFundResponse(data) {
    if (data) {
      this.mfData = data;
      // this.mutualFund = data;
      this.mfService.changeShowMutualFundDropDown(false);
      this.calculationOninit();
    } else {
      this.isLoading = false;
    }
  }

  getListForPdf(columns) {
    // this.displayColumnsPDf[0].name=(columns[0] = 'schemeName')?this.displayColumnsPDf.push('Scheme name'):null;
    // this.displayColumnsPDf[1].name=(columns[1] = 'amountInvested')?'Amount invested':null;
    // this.displayColumnsPDf[2].name=(columns[2] = 'currentValue')?'Current value':null;
    // this.displayColumnsPDf[3].name=(columns[3] = 'unrealizedProfit')?'Unrealized profit (loss)':null;
    // this.displayColumnsPDf[4].name=(columns[4] = 'absoluteReturn')?'Abs Ret %':null;
    // this.displayColumnsPDf[5].name=(columns[5] = 'xirr')?'XIRR %':null;
    // this.displayColumnsPDf[6].name=(columns[6] = 'dividendPayout')?'Dividend payout':null;
    // this.displayColumnsPDf[7].name=(columns[7] = 'switchOut')?'Withdrawals Switch outs':null;
    // this.displayColumnsPDf[8].name=(columns[8] = 'balanceUnit')?'Balance Unit':null;
    // this.displayColumnsPDf[9].name=(columns[9] = 'navDate')?'NAV Date':null;
    // this.displayColumnsPDf[10].name=(columns[10] = 'sipAmount')?' SIP':null;
    let filterArray = []
    var name;
    columns.forEach(element => {

      if (element == 'schemeName') { name = 'Scheme name' };
      if (element == 'amountInvested') { name = 'Amount invested' };
      if (element == 'currentValue') { name = 'Current value' };
      if (element == 'unrealizedProfit') { name = 'Unrealized profit (loss)' };
      if (element == 'absoluteReturn') { name = 'Abs Ret %' };
      if (element == 'xirr') { name = 'XIRR %' };
      if (element == 'dividendPayout') { name = 'Dividend payout' };
      if (element == 'switchOut') { name = 'Withdrawals Switch outs' };
      if (element == 'balanceUnit') { name = 'Balance Unit' };
      if (element == 'navDate') { name = 'NAV Date' };
      if (element == 'sipAmount') { name = 'SIP' };

      const obj = {
        name: name
      }
      filterArray.push(obj)
    });
    this.displayColumnsPDf = filterArray;

  }
  asyncFilter(mutualFund) {
    if (this.inputData == 'category wise') {
      this.rightFilterData.reportType = []
      this.rightFilterData.reportType[0] = {
        name: 'Category wise',
        selected: true
      }
    } else if (this.inputData == 'investor wise') {
      this.rightFilterData.reportType = []
      this.rightFilterData.reportType[0] = {
        name: 'Investor wise',
        selected: true
      }
    } else if (this.inputData == 'Sub Category wise') {
      this.rightFilterData.reportType = []
      this.rightFilterData.reportType[0] = {
        name: 'Sub Category wise',
        selected: true
      }
    } else {
      console.log('do nothing')
      // this.rightFilterData.reportType = []
      // this.rightFilterData.reportType[0] = {
      //   name : 'Sub Category wise',
      //   selected : true
      // }
    }
    if (typeof Worker !== 'undefined') {
      if (!this.inputData) {
        this.rightFilterData.reportType = [];
        this.rightFilterData.reportType[0] = {
          name:(this.reponseData) ? this.setDefaultFilterData.reportType : ((this.saveFilterData) ? this.saveFilterData.reportType : this.setDefaultFilterData.reportType),
          selected: true
        }
      }
      console.log(`13091830918239182390183091830912830918310938109381093809328`);
      const input = {
        mutualFundList: mutualFund,
        // mutualFund: this.mfData,
        mutualFund: this.mutualFund,
        type: (this.rightFilterData.reportType) ? this.rightFilterData.reportType : '',
        // mfService: this.mfService
      };
      // Create a new
      const worker = new Worker('../../mutual-fund.worker.ts', { type: 'module' });
      worker.onmessage = ({ data }) => {
        this.grandTotal = data.totalValue;
        this.customDataSource.data = data.customDataSourceData;
        console.log(`MUTUALFUNDSummary COMPONENT page got message:`, data);
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
    this.showDownload = true
    setTimeout(() => {
      var blob = new Blob([document.getElementById('template').innerHTML], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
      });
      saveAs(blob, tableTitle + ".xls");
    }, 200);
    // if (data) {
    //   this.fragmentData.isSpinner = false;
    // }
  }

  subCatArrayForSummary(mutualFundList, type, mfService: MfServiceService) {
    let reportType;
    (type == '' || type[0].name == 'Sub Category wise') ? reportType = 'subCategoryName' :
      (type[0].name == 'Category wise') ? reportType = 'categoryName' : reportType = 'ownerName';
    const filteredArray = [];
    let catObj;
    if (mutualFundList) {
      catObj = mfService.categoryFilter(mutualFundList, reportType);
      Object.keys(catObj).map(key => {
        mfService.initializeValues();
        filteredArray.push({ groupName: key });
        let totalObj: any = {};
        catObj[key].forEach((singleData) => {
          filteredArray.push(singleData);
          totalObj = mfService.addTwoObjectValues(mfService.calculateTotalValue(singleData), totalObj, { schemeName: true });
        });
        filteredArray.push(totalObj);
      });
      console.log(filteredArray);
      return filteredArray;
    }
  }


  // getSubCategoryWise(data) {
  //   this.subCategoryData = this.mfService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
  // }
  //
  // getSchemeWise() {
  //   this.schemeWise = this.mfService.filter(this.subCategoryData, 'mutualFundSchemeMaster');
  // }
  //
  // mfSchemes() {
  //   this.mutualFundList = this.mfService.filter(this.schemeWise, 'mutualFund');
  // }
  // getDataForRightFilter() {// for rightSidefilter data this does not change after generating report
  //   let subCatData = this.mfService.filter(this.mutualFund.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
  //   this.schemeWiseForFilter = this.mfService.filter(subCatData, 'mutualFundSchemeMaster');
  //   this.mutualFundListFilter = this.mfService.filter(this.schemeWiseForFilter, 'mutualFund');
  // }

  openFilter() {
    // if(!this.resData){
    //   this.displayColArray = this.displayedColumns;
    //   let data =[];
    //   this.displayColArray.forEach(element => {
    //     const obj = {
    //       displayName: element,
    //       selected:true
    //     };
    //     data.push(obj);
    //   });
    //   this.displayColArray = data;
    // }

    const fragmentData = {
      flag: 'openFilter',
      data: {},
      id: 1,
      state: 'open35',
      componentName: RightFilterComponent
    };
    fragmentData.data = {
      name: 'SUMMARY REPORT',
      mfData: this.mutualFund,
      folioWise: this.setDefaultFilterData.folioWise,
      schemeWise: this.setDefaultFilterData.schemeWise,
      familyMember: this.setDefaultFilterData.familyMember,
      category: this.setDefaultFilterData.category,
      // transactionView: (this.setDefaultFilterData.transactionView.length>0) ? this.setDefaultFilterData.transactionView : this.displayedColumns,
      transactionView: (this.saveFilterData) ? this.saveFilterData.transactionView : this.displayedColumns,
      overviewFilter: (this.saveFilterData) ? this.saveFilterData.overviewFilter : this.setDefaultFilterData.overviewFilter,
      scheme: this.setDefaultFilterData.scheme,
      reportType:(this.reponseData) ? this.setDefaultFilterData.reportType : ((this.saveFilterData) ? this.saveFilterData.reportType : this.setDefaultFilterData.reportType),
      reportAsOn: this.setDefaultFilterData.reportAsOn,
      showFolio: (this.saveFilterData) ? this.saveFilterData.showFolio : this.setDefaultFilterData.showFolio,
      transactionPeriod: this.setDefaultFilterData.transactionPeriod,
      transactionPeriodCheck: this.setDefaultFilterData.transactionPeriodCheck,
      fromDate: this.setDefaultFilterData.fromDate,
      toDate: this.setDefaultFilterData.toDate,
      savedFilterData: this.savedFilterData,
      selectFilter: (this.saveFilterData) ? this.saveFilterData.selectFilter : null,
      // transactionTypeList:this.setDefaultFilterData.transactionTypeList
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          if (sideBarData.data && sideBarData.data != 'Close') {
            this.customDataSource = new MatTableDataSource([{}, {}, {}]);
            this.isLoading = true;
            this.changeInput.emit(true);
            this.resData = sideBarData.data;
            this.rightFilterData = sideBarData.data;
            this.columns = [];
            this.rightFilterData.transactionView.forEach(element => {
              if (element.selected == true) {
                this.columns.push(element.displayName)
              }
            });
            this.displayedColumns = [];
            this.displayedColumns = this.columns;
            this.displayColArray = [];
            this.rightFilterData.transactionView.forEach(element => {
              const obj = {
                displayName: element.displayName,
                selected: true
              };
              this.displayColArray.push(obj);
            });
            this.reponseData = this.doFiltering(this.rightFilterData.mfData)
            this.mfData = this.reponseData;
            this.setDefaultFilterData = this.mfService.setFilterData(this.mutualFund, this.rightFilterData, this.displayColArray);
            // this.asyncFilter(this.reponseData.mutualFundList);
            this.mfService.setFilterValues(this.setDefaultFilterData);
            this.mfService.setDataForMfGet(this.rightFilterData.mfData);
            this.getFilterData(2)
            // this.getListForPdf(this.rightFilterData.transactionView);
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openFolioMaster(data) {
    const fragmentData = {
      flag: 'openfolioMaster',
      data,
      id: 1,
      state: 'open45',
      componentName: FolioMasterDetailsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // code to refresh...
          }
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openSipDetails(data) {
    const fragmentData = {
      flag: 'openSipDetails',
      data,
      id: 1,
      state: 'open45',
      componentName: SipDetailsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // code to refresh...
          }
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openMutualFund(flag, data) {
    let component;
    switch (true) {
      case (flag == 'addPortfolio'):
        component = AddMutualFundComponent;
        break;
      case (flag == 'addMutualFund'):
        component = MFSchemeLevelHoldingsComponent;
        break;
      default:
        component = MFSchemeLevelTransactionsComponent;
    }
    const fragmentData = {
      flag,
      data: { flag },
      id: 1,
      state: 'open',
      componentName: component
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // code to refresh
            this.getMutualFund();
          }
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  isGroup(index, item): boolean {// for display name as per category
    return item.groupName;
  }

  isGroup2(index, item) {// for displaying total as per category
    return item.total;
    return item.amountInvested;
    return item.currentValue;
    return item.unrealizedGain;
    return item.absoluteReturn;
    return item.xirr;
    return item.dividendPayout;
    return item.switchOut;
    return item.balanceUnit;
    return item.sipAmount;
  }

  generatePdf() {
    this.showDownload = true
    this.fragmentData.isSpinner = true;
    setTimeout(() => {
      const para = document.getElementById('template');
      this.returnValue = this.utilService.htmlToPdf(para.innerHTML, 'Mutualfundsummary', this.fragmentData,'','');
    });

  }

  deleteModal(value, element) {
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
          const obj = { id: element.id }
          this.customerService.postMutualFundDelete(obj)
            .subscribe(res => {
              if (res) {
                this.eventService.openSnackBar('Deleted Successfully', "Dismiss");
              }
            })
        }

      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openMutualEditFund(flag, element) {
    this.mutualFundList.forEach(ele => {
      ele.mutualFundTransactions.forEach(trsn => {
        if(trsn.id == element.id){
          this.selectedDataLoad = ele
        }
      });
    });
    this.mfService.getMutualFundData()
      .subscribe(res => {
        const fragmentData = {
          flag: 'editTransaction',
          data: { family_member_list: res['family_member_list'], flag, ...element,...this.selectedDataLoad },
          id: 1,
          state: 'open',
          componentName: MFSchemeLevelHoldingsComponent
        };
        const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
          sideBarData => {
            console.log('this is sidebardata in subs subs : ', sideBarData);
            if (UtilService.isDialogClose(sideBarData)) {
              if (UtilService.isRefreshRequired(sideBarData)) {
                this.getMutualFund();
              }
              console.log('this is sidebardata in subs subs 2: ', sideBarData);
              rightSideDataSub.unsubscribe();
            }
          }
        );
      })

  }

  openUpperFragment(flag, element) {
    console.log("this is what element is:::", element);
    this.mfService.getMutualFundData()
      .subscribe(res => {
        const fragmentData = {
          flag: 'app-upper-customer',
          id: 1,
          data: { family_member_list: res['family_member_list'], flag: 'addTransaction', ...element },
          direction: 'top',
          componentName: UpperCustomerComponent,
          state: 'open'
        };
        const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
          upperSliderData => {
            if (UtilService.isDialogClose(upperSliderData)) {
              if (UtilService.isRefreshRequired(upperSliderData)) {
                // code to refresh ...
                this.getMutualFund();
              }
              // this.getClientSubscriptionList();
              subscription.unsubscribe();
            }
          }
        );
      });
  }
}
