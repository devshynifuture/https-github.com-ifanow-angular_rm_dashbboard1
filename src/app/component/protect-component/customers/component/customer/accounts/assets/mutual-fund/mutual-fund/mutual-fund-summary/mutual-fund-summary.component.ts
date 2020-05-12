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

  displayedColumns: string[] = ['schemeName', 'amountInvested', 'currentValue', 'unrealizedProfit', 'absoluteReturn',
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
    this.getMutualFund();
  }

  calculationOninit() {
    if (this.mutualFund.mutualFundList.length > 0) {
      this.isLoading = true;
      this.changeInput.emit(true);
      this.mutualFundList = this.mutualFund.mutualFundList;
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
      this.mutualFund = data;
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
    if (typeof Worker !== 'undefined') {
      console.log(`13091830918239182390183091830912830918310938109381093809328`);
      const input = {
        mutualFundList: mutualFund,
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
    this.fragmentData.isSpinner = true;
    let rows = this.tableEl._elementRef.nativeElement.rows;
    const data = this.excel.generateExcel(rows, tableTitle);
    if (data) {
      this.fragmentData.isSpinner = false;
    }
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
      folioWise: this.mutualFund.mutualFundList,
      schemeWise: this.mutualFund.schemeWise,
      familyMember: this.mutualFund.family_member_list,
      category: this.mutualFund.mutualFundCategoryMastersList,
      transactionView: this.displayedColumns
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
            this.rightFilterData = sideBarData.data;
            this.asyncFilter(this.rightFilterData.mutualFundList);
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
    this.fragmentData.isSpinner = true;
    let para = document.getElementById('template');
    this.utilService.htmlToPdf(para.innerHTML, 'Test', this.fragmentData);
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
                this.eventService.openSnackBar('Deleted Successfully', "DISMISS");
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
    this.mfService.getMutualFundData()
      .subscribe(res => {
        const fragmentData = {
          flag: 'editTransaction',
          data: { family_member_list: res['family_member_list'], flag, ...element },
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
