import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { MatTableDataSource } from '@angular/material';
import { MfServiceService } from '../../mf-service.service';
import { RightFilterComponent } from 'src/app/component/protect-component/customers/component/common-component/right-filter/right-filter.component';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { CustomerService } from '../../../../../customer.service';

@Component({
  selector: 'app-mutual-fund-unrealized-tran',
  templateUrl: './mutual-fund-unrealized-tran.component.html',
  styleUrls: ['./mutual-fund-unrealized-tran.component.scss']
})
export class MutualFundUnrealizedTranComponent implements OnInit, OnChanges {
  displayedColumns: string[] = ['no', 'transactionType', 'transactionDate', 'transactionAmount', 'transactionNav',
    'units', 'currentValue', 'dividendPayout', 'dividendReinvest', 'totalAmount', 'gain', 'absReturn', 'xirr'];
  displayedColumns2: string[] = ['categoryName', 'amtInvested', 'currentValue', 'dividendPayout', 'dividendReinvest',
    'gain', 'absReturn', 'xirr', 'allocation'];
  // subCategoryData: any[];
  // schemeWise: any[];
  mutualFundList: any[];
  isLoading = false;
  dataSource = new TableVirtualScrollDataSource([{}, {}, {}]);
  grandTotal: any = {};
  schemeWiseForFilter: any;
  mutualFundListFilter: any[];
  type: any = { name: '' };
  isSpinner = false;
  customDataSource = new TableVirtualScrollDataSource([{}, {}, {}]);
  @ViewChild('tableEl', { static: false }) tableEl;
  rightFilterData: any = { reportType: '' };
  adviorData: any;
  fragmentData = { isSpinner: false };
  @Output() changeInput = new EventEmitter();
  advisorData: any;

  constructor(private subInjectService: SubscriptionInject, private utilService: UtilService,
    private mfService: MfServiceService, private excel: ExcelGenService, private custumService: CustomerService) {
  }

  @Input() mutualFund;

  ngOnInit() {
  
    console.log('this.mutualFund == ', this.mutualFund);
    if (this.mutualFund.mutualFundList.length>0) {
      this.isLoading = true;
      this.changeInput.emit(true);
      this.advisorData = this.mutualFund.advisorData;

      // this.getSubCategoryWise(this.mutualFund);
      // this.getSchemeWise();
      // this.mfSchemes();
      // this.dataSource.data = this.getCategory(this.mutualFundList, '', this.mfService);
      // this.grandTotal = this.getfinalTotalValue(this.mutualFundList, this.mfService);
      // for displaying table values as per category
      // this.customDataSource.data = this.subCatArray(this.mutualFundList, '', this.mfService);
      // this.getDataForRightFilter();
    }else{
      this.isLoading=false;
      this.changeInput.emit(false);
      this.customDataSource.data=[];
    }

  }

  ngOnChanges(changes: SimpleChanges) {

    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
    if (changes.mutualFund && !!changes.mutualFund.currentValue) {
      if (this.mutualFund.mutualFundList.length > 0) {
        if (this.mutualFund.viewMode == 'Unrealized Transactions') {
          this.getUnrealizedData();
        } else {
          this.mutualFundList = this.mutualFund.mutualFundList;
          this.asyncFilter(this.mutualFundList);
        }
      } else {
        this.dataSource.data = [];
        this.customDataSource.data = [];
      }

    }
  }

  getUnrealizedData() {
    const obj = {
      mutualFundList: this.mutualFund.mutualFundList
    }
    this.custumService.getMfUnrealizedTransactions(obj).subscribe(
      data => {
        console.log(data);
        this.mutualFundList = data;
        this.asyncFilter(this.mutualFundList);

      }
    );
  }


  asyncFilter(mutualFund) {
    if (typeof Worker !== 'undefined') {
      console.log(`13091830918239182390183091830912830918310938109381093809328`);
      const input = {
        mutualFundList: mutualFund,
        type: (this.rightFilterData.reportType) ? this.rightFilterData.reportType : '',
        // mfService: this.mfService
      };
      // Create a new
      const worker = new Worker('./mutual-fund-unrealized.worker.ts', { type: 'module' });
      worker.onmessage = ({ data }) => {
        this.grandTotal = data.totalValue;
        this.dataSource = new TableVirtualScrollDataSource(data.dataSourceData);
        this.customDataSource = new TableVirtualScrollDataSource(data.customDataSourceData);
        console.log(`MUTUALFUND COMPONENT page got message:`, data);
        this.isLoading = false;
        this.changeInput.emit(false);
      };
      worker.postMessage(input);
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  Excel(tableTitle) {
    this.fragmentData.isSpinner = true;
    const rows = this.tableEl._elementRef.nativeElement.rows;
    const data = this.excel.generateExcel(rows, tableTitle);
    if (data) {
      this.fragmentData.isSpinner = false;
    }
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
      name: (this.mutualFund.viewMode == 'Unrealized Transactions') ? 'UNREALIZED TRANSACTION REPORT' : 'ALL TRANSACTION REPORT',
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
          if (sideBarData.data && sideBarData.data != 'Close') {
            this.dataSource = new TableVirtualScrollDataSource([{}, {}, {}]);
            this.customDataSource = new TableVirtualScrollDataSource([{}, {}, {}]);
            this.isLoading = true;
            this.changeInput.emit(true);
            this.rightFilterData = sideBarData.data;
            this.type = this.rightFilterData.reportType[0];
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

  isGroup = (index, item) => item.groupName;// group category wise
  //   return item.groupName;
  // }

  isGroup2 = (index, item) => item.schemeName;// for grouping schme name
  //   return item.schemeName;
  //   return item.nav;
  // }

  isGroup3 = (index, item) => item.pan;// for grouping family member name
  //   return item.name;
  //   return item.pan;
  //   return item.folio;
  // }

  isGroup4 = (index, item) => item.total;// for getting total of each scheme
  //   return item.total;
  //   return item.totalTransactionAmt;
  //   return item.totalUnit;
  //   return item.totalNav;
  //   return item.totalCurrentValue;
  //   return item.dividendPayout;
  //   return item.divReinvestment;
  //   return item.totalAmount;
  //   return item.gain;
  //   return item.absReturn;
  //   return item.xirr;
  // }

  generatePdf() {
    this.fragmentData.isSpinner = true;
    const para = document.getElementById('template');
    this.utilService.htmlToPdf(para.innerHTML, 'Test', this.fragmentData);
    // if(data){
    //   this.isSpinner = false;
    // }
  }

}
