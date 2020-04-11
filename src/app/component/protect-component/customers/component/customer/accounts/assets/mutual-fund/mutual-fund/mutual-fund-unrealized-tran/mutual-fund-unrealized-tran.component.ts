import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {MatTableDataSource} from '@angular/material';
import {MfServiceService} from '../../mf-service.service';
import {RightFilterComponent} from 'src/app/component/protect-component/customers/component/common-component/right-filter/right-filter.component';
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
  isLoading;
  dataSource = new MatTableDataSource<any>([{}]);
  grandTotal: any;
  schemeWiseForFilter: any;
  mutualFundListFilter: any[];
  rightFilterData: any;
  customDataSource = new MatTableDataSource<any>([{}]);
  @ViewChild('tableEl', {static: false}) tableEl;

  constructor(private subInjectService: SubscriptionInject, private utilService: UtilService,
              private mfService: MfServiceService, private excel: ExcelGenService) {
  }

  @Input() mutualFund;

  ngOnInit() {
    console.log('this.mutualFund == ', this.mutualFund);
    if (this.mutualFund) {
      this.mutualFundList = this.mutualFund.mutualFundList;
      this.asyncFilter(this.mutualFundList);
      // this.getSubCategoryWise(this.mutualFund);
      // this.getSchemeWise();
      // this.mfSchemes();
      // this.dataSource.data = this.getCategory(this.mutualFundList, '', this.mfService);
      // this.grandTotal = this.getfinalTotalValue(this.mutualFundList, this.mfService);
      // for displaying table values as per category
      // this.customDataSource.data = this.subCatArray(this.mutualFundList, '', this.mfService);
      // this.getDataForRightFilter();
    }
  }

  asyncFilter(mutualFund) {
    if (typeof Worker !== 'undefined') {
      console.log(`13091830918239182390183091830912830918310938109381093809328`);
      const input = {
        mutualFundList: mutualFund,
        type: '',
        // mfService: this.mfService
      };
      // Create a new
      const worker = new Worker('./mutual-fund-unrealized.worker.ts', {type: 'module'});
      worker.onmessage = ({data}) => {
        this.dataSource.data = data.dataSourceData;
        this.grandTotal = data.totalValue;
        this.customDataSource.data = data.customDataSourceData;
        console.log(`MUTUALFUND COMPONENT page got message:`, data);
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

  mfSchemes() {// get last mf list
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
            this.asyncFilter(this.rightFilterData.mutualFundList);
            // this.dataSource.data = this.getCategory(this.rightFilterData.mutualFundList,
            // this.rightFilterData.reportType, this.mfService);
            // this.customDataSource.data = this.subCatArray(this.rightFilterData.mutualFundList,
            // this.rightFilterData.reportType, this.mfService);

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
