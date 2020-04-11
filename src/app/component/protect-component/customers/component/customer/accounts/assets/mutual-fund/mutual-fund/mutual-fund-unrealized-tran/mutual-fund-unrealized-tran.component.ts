import {Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {MatTableDataSource} from '@angular/material';
import {MfServiceService} from '../../mf-service.service';
import {RightFilterComponent} from 'src/app/component/protect-component/customers/component/common-component/right-filter/right-filter.component';
import {ExcelService} from '../../../../../excel.service';
import {ExcelGenService} from 'src/app/services/excel-gen.service';

@Component({
  selector: 'app-mutual-fund-unrealized-tran',
  templateUrl: './mutual-fund-unrealized-tran.component.html',
  styleUrls: ['./mutual-fund-unrealized-tran.component.scss']
})
export class MutualFundUnrealizedTranComponent implements OnInit {
  displayedColumns: string[] = ['no', 'transactionType', 'transactionDate', 'transactionAmount', 'transactionNav',
    'units', 'currentValue', 'dividendPayout', 'dividendReinvest', 'totalAmount', 'gain', 'absReturn', 'xirr'];
  displayedColumns2: string[] = ['categoryName', 'amtInvested', 'currentValue', 'dividendPayout', 'dividendReinvest',
    'gain', 'absReturn', 'xirr', 'allocation'];
  // subCategoryData: any[];
  // schemeWise: any[];
  mutualFundList: any[];
  totalObj: {};
  isLoading;
  categoryMF: any[];
  dataSource: Array<any> = [{}, {}, {}];
  catObj: {};
  grandTotal: any;
  schemeWiseForFilter: any;
  mutualFundListFilter: any[];
  rightFilterData: any;
  customDataSource: Array<any> = [{}, {}, {}];
  @ViewChild('tableEl', {static: false}) tableEl;

  constructor(private subInjectService: SubscriptionInject, private utilService: UtilService,
              private mfService: MfServiceService, private excel: ExcelGenService) {
  }

  @Input() mutualFund;

  ngOnInit() {
    console.log('this.mutualFund == ', this.mutualFund);
    if (this.mutualFund) {
      this.mutualFundList = this.mutualFund.mutualFundList;

      // this.getSubCategoryWise(this.mutualFund);
      // this.getSchemeWise();
      // this.mfSchemes();
      this.getCategory(this.mutualFundList, '');
      this.grandTotal = this.getfinalTotalValue(this.mutualFundList, this.mfService);
      this.subCatArray(this.mutualFundList, ''); // for displaying table values as per category
      this.getDataForRightFilter();
    }
  }

  Excel(tableTitle) {
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.excel.generateExcel(rows, tableTitle);
  }

  mfSchemes() {// get last mf list
  }

  getfinalTotalValue(data, mfService: MfServiceService) { // grand total values
    let totalValue: any = {};
    data.forEach(element => {
      totalValue = mfService.addTwoObjectValues(mfService.getEachTotalValue(element), totalValue, {total: true});
    });

    return totalValue;
  }

  subCatArray(mutualFundList, type) {
    let reportType;
    (type == '' || type[0].name == 'Sub Category wise') ? reportType = 'subCategoryName' :
      (type[0].name == 'Category wise') ? reportType = 'categoryName' : reportType = 'name';
    const categoryArray = [];
    const filterArray = [];
    this.catObj = this.mfService.categoryFilter(mutualFundList, reportType);
    const filteredData = new MatTableDataSource(categoryArray);
    Object.keys(this.catObj).map(key => {
      this.mfService.initializeValues(); // for initializing total values object
      filteredData.data.push({groupName: key});
      this.catObj[key].forEach((singleData) => {
        const obj = {
          schemeName: singleData.schemeName,
          nav: singleData.nav
        };
        filteredData.data.push(obj);
        const obj2 = {
          name: singleData.ownerName,
          pan: singleData.pan,
          folio: singleData.folioNumber
        };
        filteredData.data.push(obj2);
        singleData.mutualFundTransactions.forEach((ele) => {
          filteredData.data.push(ele);
        });
        this.totalObj = this.mfService.getEachTotalValue(singleData);
        filteredData.data.push(this.totalObj);
      });
    });
    // console.log(customDataSource)
    this.customDataSource = filteredData.data;
    return this.customDataSource;
  }

  getCategory(mutualFundList, type) { // first table category wise
    let reportType;
    (type == '' || type[0].name == 'Sub Category wise') ? reportType = 'subCategoryName' : (type[0].name == 'Category wise') ? reportType = 'categoryName' : reportType = 'name';
    const catObj = {};
    const newArray = [];
    if (this.mutualFundList) {
      this.catObj = this.mfService.categoryFilter(mutualFundList, reportType);
      Object.keys(this.catObj).map(key => {
        this.mfService.initializeValues(); // for initializing total values object
        this.catObj[key].forEach((singleData) => {
          this.totalObj = this.mfService.getEachTotalValue(singleData);
          Object.assign(this.totalObj, {categoryName: key});
        });
        newArray.push(this.totalObj);
      });
      this.dataSource = newArray;
    }
  }

  getCategoryNew(mutualFundList, type, mfService: MfServiceService) { // first table category wise
    let reportType;
    (type == '' || type[0].name == 'Sub Category wise') ?
      reportType = 'subCategoryName' : (type[0].name == 'Category wise') ?
      reportType = 'categoryName' : reportType = 'name';
    let catObj;
    let totalObj;
    const newArray = [];
    catObj = mfService.categoryFilter(mutualFundList, reportType);
    Object.keys(catObj).map(key => {
      mfService.initializeValues(); // for initializing total values object
      catObj[key].forEach((singleData) => {
        totalObj = mfService.getEachTotalValue(singleData);
        Object.assign(totalObj, {categoryName: key});
      });
      newArray.push(totalObj);
    });
    const output = {
      catObj,
      totalObj,
      dataSource: newArray
    };
    return output;
  }

  getDataForRightFilter() {// for rightSidefilter data this does not change after generating report
    const subCatData = this.mfService.filter(this.mutualFund.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
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
      name: 'UNREALIZED TRANSACTION REPORT',
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
            this.getCategory(this.rightFilterData.mutualFundList, this.rightFilterData.reportType);
            this.subCatArray(this.rightFilterData.mutualFundList, this.rightFilterData.reportType);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  isGroup(index, item): boolean {// group category wise
    return item.groupName;
  }

  isGroup2(index, item): boolean {// for grouping schme name
    return item.schemeName;
    return item.nav;
  }

  isGroup3(index, item): boolean {// for grouping family member name
    return item.name;
    return item.pan;
    return item.folio;
  }

  isGroup4(index, item) {// for getting total of each scheme
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

  generatePdf() {
    let para = document.getElementById('template');
    this.utilService.htmlToPdf(para.innerHTML, 'Test');
  }

}
