import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { MatTableDataSource } from '@angular/material/table';

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
  totalTransactionAmt: number;
  totalUnit: number;
  totalBalanceUnit: number;
  totalNav: number;
  totalObj: { 'total': string; 'totalTransactionAmt': number; 'totalUnit': number; 'totalNav': number; 'totalBalanceUnit': number; };
  customDataSource: any;

  constructor(private subInjectService: SubscriptionInject, private UtilService: UtilService) { }
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
    let catObj = {};
    const categoryArray = [];
    let filteredArray=[];
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
      Object.keys(catObj).map(key => {
        filteredArray.push({ groupName: key });
        catObj[key].forEach((singleData) => {
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
          this.getEachTotalValue(singleData);
          filteredArray.push(this.totalObj);
        });
      });
      this.customDataSource=filteredArray
      return this.customDataSource;
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
  getTotalValue() {
    this.totalTransactionAmt = 0;
    this.totalUnit = 0;
    this.totalNav = 0;
    this.totalBalanceUnit = 0;
    this.mutualFundList.forEach(element => {
      element.mutualFundTransactions.forEach(ele => {
        this.totalTransactionAmt += ele.amount;
        this.totalUnit += ele.unit;
        this.totalNav += ele.transactionNav;
        this.totalBalanceUnit += ele.balanceUnits;
      });
    })
  }
  getEachTotalValue(data) { //get total value as per category
    this.totalTransactionAmt = 0;
    this.totalUnit = 0;
    this.totalNav = 0;
    this.totalBalanceUnit = 0;
    data.mutualFundTransactions.forEach(ele => {
      this.totalTransactionAmt += ele.amount;
      this.totalUnit += ele.unit;
      this.totalNav += ele.transactionNav;
      this.totalBalanceUnit += ele.balanceUnits;
    });
    const obj = {
      'total': 'Total',
      'totalTransactionAmt': this.totalTransactionAmt,
      'totalUnit': this.totalUnit,
      'totalNav': this.totalNav,
      'totalBalanceUnit': this.totalBalanceUnit,
    }
    this.totalObj = obj
  }
  filter(data, key) { //Used for filtering the data 
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
}