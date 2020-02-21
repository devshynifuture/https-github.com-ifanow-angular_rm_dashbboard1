import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { MatTableDataSource } from '@angular/material';
import { MfServiceService } from '../../mf-service.service';

@Component({
  selector: 'app-mutual-fund-unrealized-tran',
  templateUrl: './mutual-fund-unrealized-tran.component.html',
  styleUrls: ['./mutual-fund-unrealized-tran.component.scss']
})
export class MutualFundUnrealizedTranComponent implements OnInit {
  displayedColumns: string[] = ['no', 'transactionType', 'transactionDate', 'transactionAmount', 'transactionNav', 'units', 'currentValue', 'dividendPayout', 'dividendReinvest', 'totalAmount', 'gain', 'absReturn', 'xirr'];
  displayedColumns2: string[] = ['categoryName', 'amtInvested', 'currentValue', 'dividendPayout', 'dividendReinvest', 'gain', 'absReturn', 'xirr', 'allocation'];
  subCategoryData: any[];
  schemeWise: any[];
  mutualFundList: any[];
  totalObj: {};
  categoryMF: any[];
  dataSource: any[];
  catObj: {};
  grandTotal: any;
  constructor(private subInjectService: SubscriptionInject, private UtilService: UtilService, private MfServiceService: MfServiceService) { }
  @Input() mutualFund;
  ngOnInit() {
    if (this.mutualFund != undefined) {
      this.getSubCategoryWise(this.mutualFund)
      this.getSchemeWise();
      this.mfSchemes();
      this.getfinalTotalValue();
    }
  }
  subCatArray() {
    const categoryArray = [];
    let filterArray = []
    if (this.mutualFundList != undefined) {
      this.catObj = this.MfServiceService.categoryFilter(this.mutualFundList);
      const customDataSource = new MatTableDataSource(categoryArray);
      Object.keys(this.catObj).map(key => {
        this.MfServiceService.initializeValues();//for initializing total values object
        customDataSource.data.push({ groupName: key });
        this.catObj[key].forEach((singleData) => {
          const obj = {
            'schemeName': singleData.schemeName,
            'nav': singleData.nav
          }
          customDataSource.data.push(obj);
          const obj2 = {
            'name': singleData.ownerName,
            'pan': singleData.pan,
            'folio': singleData.folioNumber
          }
          customDataSource.data.push(obj2);
          singleData.mutualFundTransactions.forEach((ele) => {
            customDataSource.data.push(ele);
          })
          this.totalObj = this.MfServiceService.getEachTotalValue(singleData);
          customDataSource.data.push(this.totalObj);
        });
      });
      return customDataSource;
    }
  }
  getCategory() { // first table category wise
    let catObj = {};
    let newArray = [];
    if (this.mutualFundList != undefined) {
      this.catObj = this.MfServiceService.categoryFilter(this.mutualFundList);
      Object.keys(this.catObj).map(key => {
        this.MfServiceService.initializeValues();//for initializing total values object
        this.catObj[key].forEach((singleData) => {
          this.totalObj = this.MfServiceService.getEachTotalValue(singleData);
          Object.assign(this.totalObj, { categoryName: key });
        });
        newArray.push(this.totalObj)
      });
      this.dataSource = newArray
    }
  }
  isGroup(index, item): boolean {//group category wise
    return item.groupName;
  }
  isGroup2(index, item): boolean {//for grouping schme name
    return item.schemeName;
    return item.nav
  }
  isGroup3(index, item): boolean {//for grouping family member name
    return item.name;
    return item.pan;
    return item.folio;
  }
  isGroup4(index, item) {//for getting total of each scheme
    return item.total;
    return item.totalTransactionAmt;
    return item.totalUnit;
    return item.totalNav;
    return item.totalCurrentValue;
    return item.dividendPayout;
    return item.divReinvestment;
    return item.totalAmount;
    return item.gain;
    return item.absReturn;
    return item.xirr;
  }
  getSubCategoryWise(data) {//return sub category list
    this.subCategoryData = this.MfServiceService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
  }
  getSchemeWise() {//return scheme wise list
    this.schemeWise = this.MfServiceService.filter(this.subCategoryData, 'mutualFundSchemeMaster');
  }
  mfSchemes() {//get last mf list
    this.mutualFundList = this.MfServiceService.filter(this.schemeWise, 'mutualFund');
    this.getCategory();
  }
  getfinalTotalValue() { //grand total values
    this.MfServiceService.initializeValues()
    this.mutualFundList.forEach(element => {
      this.grandTotal = this.MfServiceService.getEachTotalValue(element);
    })
  }
}