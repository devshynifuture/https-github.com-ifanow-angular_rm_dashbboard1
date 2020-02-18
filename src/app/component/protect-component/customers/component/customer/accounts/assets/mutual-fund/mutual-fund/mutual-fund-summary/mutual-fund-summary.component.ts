import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RightFilterComponent } from 'src/app/component/protect-component/customers/component/common-component/right-filter/right-filter.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { FolioMasterDetailsComponent } from 'src/app/component/protect-component/customers/component/common-component/folio-master-details/folio-master-details.component';
import { SipDetailsComponent } from 'src/app/component/protect-component/customers/component/common-component/sip-details/sip-details.component';
import { single } from 'rxjs/operators';

@Component({
  selector: 'app-mutual-fund-summary',
  templateUrl: './mutual-fund-summary.component.html',
  styleUrls: ['./mutual-fund-summary.component.scss']
})
export class MutualFundSummaryComponent implements OnInit {

  displayedColumns: string[] = ['schemeName', 'amountInvested', 'currentValue', 'unrealizedProfit', 'absoluteReturn', 'xirr', 'dividendPayout', 'switchOut', 'balanceUnit', 'navDate', 'sipAmount', 'icons'];
  mfData: any;
  filteredArray: any[];
  subCategoryData: any[];
  schemeWise: any[];
  mutualFundList: any[];
  currentValue: any;
  amtInvested: any;
  unrealizedGainLoss: any;
  xirr: any;
  absReturn: any;
  divPayout: any;
  withdrawals: any;
  balanceUnit: any;
  sip: any;
  totalObj: any;

  constructor(private subInjectService: SubscriptionInject, private UtilService: UtilService) { }
  @Input() mutualFund;

  ngOnInit() {
    if (this.mutualFund != undefined) {
      this.getSubCategoryWise(this.mutualFund)
      this.getSchemeWise();
      this.mfSchemes();
    }
  }
  subCatArray() {
    let catObj = {};
    const categoryArray = [];
    if (this.mutualFundList != undefined) {
      this.mutualFundList.forEach(ele => {
        if (ele.subCategoryName) {
          const categoryArray = catObj[ele.subCategoryName] ? catObj[ele.subCategoryName] : [];
          categoryArray.push(ele);
          catObj[ele.subCategoryName] = categoryArray;
        } else {
          categoryArray.push(ele);
        }
      });
      const customDataSource = new MatTableDataSource(categoryArray);
      Object.keys(catObj).map(key => {
        this.amtInvested = 0;
        this.currentValue = 0;
        this.unrealizedGainLoss = 0;
        this.absReturn = 0;
        this.xirr = 0;
        this.divPayout = 0;
        this.withdrawals = 0;
        this.balanceUnit = 0;
        this.sip = 0;
        customDataSource.data.push({ groupName: key });
        catObj[key].forEach((singleData) => {
          customDataSource.data.push(singleData);
          this.calculateTotalValue(singleData);
        });
        customDataSource.data.push(this.totalObj);
      });
      return customDataSource;
    }
  }
  calculateTotalValue(data){
    this.amtInvested += data.amountInvested;
    this.currentValue += data.currentValue;
    this.unrealizedGainLoss += data.unrealizedGain;
    this.absReturn += data.absoluteReturn;
    this.xirr += data.xirr;
    this.divPayout += data.dividendPayout;
    this.withdrawals += data.switchOut;
    this.balanceUnit += data.balanceUnit;
    this.sip += data.sipAmount;
    const obj={
      'total':'Total',
      'amountInvested':this.amtInvested,
      'currentValue':this.currentValue,
      'unrealizedGain':this.unrealizedGainLoss,
      'absoluteReturn': this.absReturn,
      'xirr': this.xirr,
      'dividendPayout': this.divPayout,
      'switchOut':this.withdrawals,
      'balanceUnit':this.balanceUnit,
      'sipAmount':this.sip
    }
    this.totalObj=obj
  }
  isGroup(index, item): boolean {
    // console.log('index : ', index);
    // console.log('item : ', item);
    return item.groupName;
  }
  isGroup2(index, item) {
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
    this.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    this.subCategoryData = this.filteredArray
  }
  getSchemeWise() {
    this.filter(this.filteredArray, 'mutualFundSchemeMaster');
    this.schemeWise = this.filteredArray
  }
  mfSchemes() {
    this.filter(this.schemeWise, 'mutualFund');
    this.mutualFundList = this.filteredArray;
  }
  //Used for filtering the data 
  filter(data, key) {
    const filterData = [];
    const finalDataSource = [];
    data.filter(function (element) {
      filterData.push(element[key])
    })
    if (filterData.length > 0) {
      filterData.forEach(element => {
        element.forEach(data => {
          finalDataSource.push(data)
        });
      });
    }
    this.filteredArray = finalDataSource;//final dataSource Value
    return;
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
  openSipDetails() {
    const fragmentData = {
      flag: 'openSipDetails',
      data: {},
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

}
