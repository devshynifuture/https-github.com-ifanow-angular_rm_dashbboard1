import {Component, Input, OnInit} from '@angular/core';
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
  subCategoryData: any[];
  schemeWise: any[];
  mutualFundList: any[];
  totalObj: any;
  customDataSource: any;
  catObj: {};
  isLoading = false; // added for prod build
  constructor(private subInjectService: SubscriptionInject, private utilService: UtilService,
              private mfService: MfServiceService) {
  }

  @Input() mutualFund;

  ngOnInit() {
    if (this.mutualFund) {
      this.getSubCategoryWise(this.mutualFund); // get subCategoryWise list
      this.getSchemeWise(); // get scheme wise list
      this.mfSchemes(); // get mutualFund list
      this.subCatArray(); // for displaying table values as per category
    }
  }

  subCatArray() {
    const filteredArray = [];
    if (this.mutualFundList) {
      this.catObj = this.mfService.categoryFilter(this.mutualFundList);
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


  getSubCategoryWise(data) {
    this.subCategoryData = this.mfService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
  }

  getSchemeWise() {
    this.schemeWise = this.mfService.filter(this.subCategoryData, 'mutualFundSchemeMaster');
  }

  mfSchemes() {
    this.mutualFundList = this.mfService.filter(this.schemeWise, 'mutualFund');
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
      mfData:this.mutualFund,
      folioWise: this.mutualFundList,
      schemeWise: this.schemeWise,
      familyMember: this.mutualFund.family_member_list,
      category: this.mutualFund.mutualFundCategoryMastersList,
      transactionView: this.displayedColumns
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
}
