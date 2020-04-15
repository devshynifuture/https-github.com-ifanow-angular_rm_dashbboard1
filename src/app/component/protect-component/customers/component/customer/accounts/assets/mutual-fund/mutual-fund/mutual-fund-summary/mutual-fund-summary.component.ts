import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {RightFilterComponent} from 'src/app/component/protect-component/customers/component/common-component/right-filter/right-filter.component';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {FolioMasterDetailsComponent} from 'src/app/component/protect-component/customers/component/common-component/folio-master-details/folio-master-details.component';
import {SipDetailsComponent} from 'src/app/component/protect-component/customers/component/common-component/sip-details/sip-details.component';
import {AddMutualFundComponent} from '../add-mutual-fund/add-mutual-fund.component';
import {MFSchemeLevelHoldingsComponent} from '../mfscheme-level-holdings/mfscheme-level-holdings.component';
import {MFSchemeLevelTransactionsComponent} from '../mfscheme-level-transactions/mfscheme-level-transactions.component';
import {MfServiceService} from '../../mf-service.service';
import {ExcelGenService} from 'src/app/services/excel-gen.service';
import {MatTableDataSource} from '@angular/material';
import {WebworkerService} from '../../../../../../../../../../services/web-worker.service';
import {MUTUAL_FUND_SUMMARY} from '../../mutual-fund.script';

@Component({
  selector: 'app-mutual-fund-summary',
  templateUrl: './mutual-fund-summary.component.html',
  styleUrls: ['./mutual-fund-summary.component.scss']
})
export class MutualFundSummaryComponent implements OnInit {

  displayedColumns: string[] = ['schemeName', 'amountInvested', 'currentValue', 'unrealizedProfit', 'absoluteReturn',
    'xirr', 'dividendPayout', 'switchOut', 'balanceUnit', 'navDate', 'sipAmount', 'icons'];
  mfData: any;
  // subCategoryData: any[];
  // schemeWise: any[];
  mutualFundList: any[];
  totalObj: any;
  customDataSource = new MatTableDataSource([{}, {}, {}]);
  catObj: {};
  isLoading = false; // added for prod build
  // schemeWiseForFilter: any[];
  // mutualFundListFilter: any[];
  rightFilterData: any;
  @ViewChild('tableEl', {static: false}) tableEl;


  constructor(private subInjectService: SubscriptionInject, private utilService: UtilService,
              private mfService: MfServiceService, private excel: ExcelGenService,
              private workerService: WebworkerService) {
  }

  @Input() mutualFund;
  @ViewChild('summaryTemplate', {static: false}) summaryTemplate: ElementRef;

  ngOnInit() {
    if (this.mutualFund.mutualFundList.length>0) {
      this.isLoading=true;
      this.mutualFundList = this.mutualFund.mutualFundList;
      // this.getSubCategoryWise(this.mutualFund); // get subCategoryWise list
      // this.getSchemeWise(); // get scheme wise list
      // this.mfSchemes(); // get mutualFund list
      // for displaying table values as per category
      // this.customDataSource.data = this.subCatArrayForSummary(this.mutualFund.mutualFundList, '', this.mfService);
      // this.getDataForRightFilter();
      const input = {
        mutualFundList: this.mutualFundList,
        type: '',
        // mfService: this.mfService
      };
      this.asyncFilter(input);
    }else{
      this.isLoading=false;
      this.customDataSource.data=[];
    }
  }

  asyncFilter(input) {
    if (typeof Worker !== 'undefined') {
      console.log(`13091830918239182390183091830912830918310938109381093809328`);
      // Create a new
      const worker = new Worker('../../mutual-fund.worker.ts', {type: 'module'});
      worker.onmessage = ({data}) => {
        this.isLoading=false;
        this.customDataSource.data = data.customDataSourceData;
        console.log(`MUTUALFUNDSummary COMPONENT page got message:`, data);
      };
      worker.postMessage(input);
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  Excel(tableTitle) {
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.excel.generateExcel(rows, tableTitle);
  }

  subCatArrayForSummary(mutualFundList, type, mfService: MfServiceService) {
    let reportType;
    (type == '' || type[0].name == 'Sub Category wise') ? reportType = 'subCategoryName' :
      (type[0].name == 'Category wise') ? reportType = 'categoryName' : reportType = 'name';
    const filteredArray = [];
    let catObj;
    if (mutualFundList) {
      catObj = mfService.categoryFilter(mutualFundList, reportType);
      Object.keys(catObj).map(key => {
        mfService.initializeValues();
        filteredArray.push({groupName: key});
        let totalObj: any = {};
        catObj[key].forEach((singleData) => {
          filteredArray.push(singleData);
          totalObj = mfService.addTwoObjectValues(mfService.calculateTotalValue(singleData), totalObj, {schemeName: true});
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
          if (sideBarData.data) {
            this.rightFilterData = sideBarData.data;
            this.customDataSource.data = this.subCatArrayForSummary(this.rightFilterData.mutualFundList,
              this.rightFilterData.reportType, this.mfService);
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
      case (flag == 'holding'):
        component = MFSchemeLevelHoldingsComponent;
        break;
      default:
        component = MFSchemeLevelTransactionsComponent;
    }
    const fragmentData = {
      flag: 'editMF',
      data,
      id: 1,
      state: 'open',
      componentName: component
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
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
    let para = document.getElementById('template');
    this.utilService.htmlToPdf(para.innerHTML, 'Test');
  }
}
