import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { MatTableDataSource } from '@angular/material/table';
import { MFSchemeLevelHoldingsComponent } from '../mfscheme-level-holdings/mfscheme-level-holdings.component';
import { MfServiceService } from '../../mf-service.service';

@Component({
  selector: 'app-mutual-fund-all-transaction',
  templateUrl: './mutual-fund-all-transaction.component.html',
  styleUrls: ['./mutual-fund-all-transaction.component.scss']
})
export class MutualFundAllTransactionComponent implements OnInit {
  displayedColumns: string[] = ['no', 'transactionType', 'transactionDate', 'transactionAmount', 'transactionNav', 'units', 'balanceUnits', 'days', 'icons'];
  mfData: any;
  filteredArray: any[];
  subCategoryData: any[];
  schemeWise: any[];
  mutualFundList: any[];
  totalObj: any;
  customDataSource: any;
  grandTotal: any;
  catObj: any;
  constructor(private subInjectService: SubscriptionInject, private UtilService: UtilService, private MfServiceService: MfServiceService) { }
  @Input() mutualFund;

  ngOnInit() {
    if (this.mutualFund != undefined) {
      this.getSubCategoryWise(this.mutualFund)//get subCategoryWise list
      this.getSchemeWise();//get scheme wise list
      this.mfSchemes();//get mutualFund list
      this.getTotalValue();//to get GrandTotal value
      this.subCatArray();//for displaying table values as per category
    }
  }
  subCatArray() {
    let filteredArray = [];
    if (this.mutualFundList != undefined) {
      this.catObj = this.MfServiceService.categoryFilter(this.mutualFundList);
      Object.keys(this.catObj).map(key => {
        this.MfServiceService.initializeValues();//for initializing total values object
        filteredArray.push({ groupName: key });
        this.catObj[key].forEach((singleData) => {
          const obj = {
            'schemeName': singleData.schemeName,
            'nav': singleData.nav
          }
          filteredArray.push(obj);
          const obj2 = {
            'name': singleData.ownerName,
            'pan': singleData.pan,
            'folio': singleData.folioNumber
          }
          filteredArray.push(obj2);
          singleData.mutualFundTransactions.forEach((ele) => {
            filteredArray.push(ele);
          })
          this.totalObj = this.MfServiceService.getEachTotalValue(singleData);
          filteredArray.push(this.totalObj);
        });
      });
      this.customDataSource = filteredArray
    }
  }
  isGroup(index, item): boolean {//get headerName as per category
    return item.groupName;
  }
  isGroup2(index, item): boolean {//for displaying schemeName and currentNav
    return item.schemeName;
    return item.nav
  }
  isGroup3(index, item): boolean {//for displaying family members name,pan and folio
    return item.name;
    return item.pan;
    return item.folio;
  }
  isGroup4(index, item): boolean {//this header is used for showing total as per category
    return item.total;
    return item.totalTransactionAmt;
    return item.totalUnit;
    return item.totalNav;
    return item.totalBalanceUnit;
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
  getTotalValue() {
    this.MfServiceService.initializeValues()
    this.mutualFundList.forEach(element => {
      this.grandTotal = this.MfServiceService.getEachTotalValue(element)
    })
  }
  editTransaction(portfolioData, data) {
    const fragmentData = {
      flag: portfolioData,
      data: data,
      id: 1,
      state: 'open',
      componentName: MFSchemeLevelHoldingsComponent
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