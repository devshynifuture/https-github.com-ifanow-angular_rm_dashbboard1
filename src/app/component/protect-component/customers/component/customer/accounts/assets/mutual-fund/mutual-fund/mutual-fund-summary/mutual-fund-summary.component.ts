import {Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import {RightFilterComponent} from 'src/app/component/protect-component/customers/component/common-component/right-filter/right-filter.component';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {FolioMasterDetailsComponent} from 'src/app/component/protect-component/customers/component/common-component/folio-master-details/folio-master-details.component';
import {SipDetailsComponent} from 'src/app/component/protect-component/customers/component/common-component/sip-details/sip-details.component';
import {AddMutualFundComponent} from '../add-mutual-fund/add-mutual-fund.component';
import {MFSchemeLevelHoldingsComponent} from '../mfscheme-level-holdings/mfscheme-level-holdings.component';
import {MFSchemeLevelTransactionsComponent} from '../mfscheme-level-transactions/mfscheme-level-transactions.component';
import {MfServiceService} from '../../mf-service.service';

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
  customDataSource: Array<any> = [{}, {}, {}];
  catObj: {};
  isLoading = false; // added for prod build
  schemeWiseForFilter: any[];
  mutualFundListFilter: any[];
  rightFilterData: any;
  constructor(private subInjectService: SubscriptionInject, private utilService: UtilService,
              private mfService: MfServiceService) {
  }

  @Input() mutualFund;
  @ViewChild('summaryTemplate', {static: false}) summaryTemplate: ElementRef;

  ngOnInit() {
    if (this.mutualFund.mutualFundList) {
      this.mutualFundList = this.mutualFund.mutualFundList;
      // this.getSubCategoryWise(this.mutualFund); // get subCategoryWise list
      // this.getSchemeWise(); // get scheme wise list
      // this.mfSchemes(); // get mutualFund list
      this.subCatArray(this.mutualFund.mutualFundList, ''); // for displaying table values as per category
      this.getDataForRightFilter();
    }
  }

  subCatArray(mutualFundList, type) {
      let reportType;
      (type == '' || type[0].name == 'Sub Category wise') ? reportType = 'subCategoryName' :
        (type[0].name == 'Category wise') ? reportType = 'categoryName' : reportType = 'name';
      const filteredArray = [];
      if (mutualFundList) {
      this.catObj = this.mfService.categoryFilter(mutualFundList, reportType);
      Object.keys(this.catObj).map(key => {
        this.mfService.initializeValues();
        filteredArray.push({groupName: key});
        this.catObj[key].forEach((singleData) => {
          filteredArray.push(singleData);
          this.totalObj = this.mfService.calculateTotalValue(singleData);
        });
        filteredArray.push(this.totalObj);
      });
      this.customDataSource = filteredArray;
      console.log(this.customDataSource);
      return this.customDataSource;
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
  getDataForRightFilter() {// for rightSidefilter data this does not change after generating report
    let subCatData = this.mfService.filter(this.mutualFund.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    this.schemeWiseForFilter = this.mfService.filter(subCatData, 'mutualFundSchemeMaster');
    this.mutualFundListFilter = this.mfService.filter(this.schemeWiseForFilter, 'mutualFund');
  }
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
      folioWise: this.mutualFundListFilter,
      schemeWise: this.schemeWiseForFilter,
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
            this.subCatArray(this.rightFilterData.mutualFundList, this.rightFilterData.reportType);
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
    this.utilService.htmlToPdf(para.innerHTML, 'Summary Report')
    }
}
