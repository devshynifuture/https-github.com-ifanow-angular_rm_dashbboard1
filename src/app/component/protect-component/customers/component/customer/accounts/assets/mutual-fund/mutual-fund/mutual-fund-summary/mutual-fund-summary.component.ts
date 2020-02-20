import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RightFilterComponent } from 'src/app/component/protect-component/customers/component/common-component/right-filter/right-filter.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { FolioMasterDetailsComponent } from 'src/app/component/protect-component/customers/component/common-component/folio-master-details/folio-master-details.component';
import { SipDetailsComponent } from 'src/app/component/protect-component/customers/component/common-component/sip-details/sip-details.component';
import { AddMutualFundComponent } from '../add-mutual-fund/add-mutual-fund.component';
import { MFSchemeLevelHoldingsComponent } from '../mfscheme-level-holdings/mfscheme-level-holdings.component';
import { MFSchemeLevelTransactionsComponent } from '../mfscheme-level-transactions/mfscheme-level-transactions.component';
import { MfServiceService } from '../../mf-service.service';

@Component({
  selector: 'app-mutual-fund-summary',
  templateUrl: './mutual-fund-summary.component.html',
  styleUrls: ['./mutual-fund-summary.component.scss']
})
export class MutualFundSummaryComponent implements OnInit {

  displayedColumns: string[] = ['schemeName', 'amountInvested', 'currentValue', 'unrealizedProfit', 'absoluteReturn', 'xirr', 'dividendPayout', 'switchOut', 'balanceUnit', 'navDate', 'sipAmount', 'icons'];
  mfData: any;
  subCategoryData: any[];
  schemeWise: any[];
  mutualFundList: any[];
  totalObj: any;
  customDataSource: any;
  catObj: {};

  constructor(private subInjectService: SubscriptionInject, private UtilService: UtilService, private MfServiceService: MfServiceService) { }
  @Input() mutualFund;

  ngOnInit() {
    if (this.mutualFund != undefined) {
      this.getSubCategoryWise(this.mutualFund)//get subCategoryWise list
      this.getSchemeWise();//get scheme wise list
      this.mfSchemes();//get mutualFund list
      this.subCatArray();//for displaying table values as per category
    }
  }
  subCatArray() {
    let filteredArray = [];
    if (this.mutualFundList != undefined) {
      this.catObj=this.MfServiceService.categoryFilter(this.mutualFundList);
      Object.keys(this.catObj).map(key => {
        this.MfServiceService.initializeValues();
        filteredArray.push({ groupName: key });
        this.catObj[key].forEach((singleData) => {
          filteredArray.push(singleData);
          this.totalObj = this.MfServiceService.calculateTotalValue(singleData);
        });
        filteredArray.push(this.totalObj);
      });
      this.customDataSource = filteredArray;
      return this.customDataSource;
    }
  }
  isGroup(index, item): boolean {//for display name as per category
    return item.groupName;
  }
  isGroup2(index, item) {//for displaying total as per category
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
  getSubCategoryWise(data) {
    this.subCategoryData = this.MfServiceService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
  }
  getSchemeWise() {
    this.schemeWise = this.MfServiceService.filter(this.subCategoryData, 'mutualFundSchemeMaster');
  }
  mfSchemes() {
    this.mutualFundList = this.MfServiceService.filter(this.schemeWise, 'mutualFund');
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
      folioWise: this.mutualFundList,
      schemeWise: this.schemeWise,
      familyMember: this.mutualFund.family_member_list,
      category: this.mutualFund.mutualFundCategoryMastersList,
      transactionView: this.displayedColumns
    }
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
      data: data,
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
      data: data,
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
      case (flag == "addPortfolio"):
        component = AddMutualFundComponent;
        break;
      case (flag == "holding"):
        component = MFSchemeLevelHoldingsComponent;
        break;
      default:
        component = MFSchemeLevelTransactionsComponent
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
}