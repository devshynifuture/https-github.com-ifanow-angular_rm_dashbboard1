import {Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {MFSchemeLevelHoldingsComponent} from '../mfscheme-level-holdings/mfscheme-level-holdings.component';
import {MfServiceService} from '../../mf-service.service';
import {RightFilterComponent} from "../../../../../../common-component/right-filter/right-filter.component";
import {EventService} from "../../../../../../../../../../Data-service/event.service";
import { ExcelGenService } from 'src/app/services/excel-gen.service';

@Component({
  selector: 'app-mutual-fund-all-transaction',
  templateUrl: './mutual-fund-all-transaction.component.html',
  styleUrls: ['./mutual-fund-all-transaction.component.scss']
})
export class MutualFundAllTransactionComponent implements OnInit {
  displayedColumns: string[] = ['no', 'transactionType', 'transactionDate', 'transactionAmount',
    'transactionNav', 'units', 'balanceUnits', 'days', 'icons'];
  // totalColumns: string[] = ['no', 'transactionType', 'transactionDate', 'transactionAmount', 'transactionNav', 'units', 'balanceUnits', 'days', 'icons'];

  mfData: any;
  filteredArray: any[];
  subCategoryData: any[];
  schemeWise: any[];
  mutualFundList: any[];
  totalObj: any;
  customDataSource: any;
  grandTotal: any;
  catObj: any;
  rightFilterData: any;
  schemeWiseForFilter: any;
  mutualFundListFilter: any;

  constructor(private subInjectService: SubscriptionInject, private utilService: UtilService,
              private mfService: MfServiceService, private eventService: EventService,
              private excel : ExcelGenService) {
  }
  @ViewChild('allTranTemplate', {static: false}) allTranTemplate: ElementRef;
  @ViewChild('tableEl', { static: false }) tableEl;

  @Input() mutualFund;

  ngOnInit() {
    if (this.mutualFund != undefined) {
      this.getSubCategoryWise(this.mutualFund); // get subCategoryWise list
      this.getSchemeWise(); // get scheme wise list
      this.mfSchemes(); // get mutualFund list
      this.getTotalValue(); // to get GrandTotal value
      this.subCatArray(this.mutualFundList,''); // for displaying table values as per category
      this.getDataForRightFilter();
    }
  }

  Excel(tableTitle){
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.excel.generateExcel(rows,tableTitle)
  }

  subCatArray(mutualFundList,type) {
    var reportType;
    (type=='' || type[0].name=='Sub Category wise')?reportType='subCategoryName':(type[0].name=='Category wise')?reportType='categoryName':reportType='name'
    const filteredArray = [];
    if (this.mutualFundList != undefined) {
      this.catObj = this.mfService.categoryFilter(mutualFundList,reportType);
      Object.keys(this.catObj).map(key => {
        this.mfService.initializeValues(); // for initializing total values object
        filteredArray.push({groupName: key});
        this.catObj[key].forEach((singleData) => {
          const obj = {
            schemeName: singleData.schemeName,
            nav: singleData.nav
          };
          filteredArray.push(obj);
          const obj2 = {
            name: singleData.ownerName,
            pan: singleData.pan,
            folio: singleData.folioNumber
          };
          filteredArray.push(obj2);
          singleData.mutualFundTransactions.forEach((ele) => {
            filteredArray.push(ele);
          });
          this.totalObj = this.mfService.getEachTotalValue(singleData);
          filteredArray.push(this.totalObj);
        });
      });
      this.customDataSource = filteredArray;
      console.log(this.customDataSource);
    }
  }

  isGroup(index, item): boolean {// get headerName as per category
    return item.groupName;
  }

  isGroup2(index, item): boolean {// for displaying schemeName and currentNav
    return item.schemeName;
    return item.nav;
  }

  isGroup3(index, item): boolean {// for displaying family members name,pan and folio
    return item.name;
    return item.pan;
    return item.folio;
  }

  isGroup4(index, item): boolean {// this header is used for showing total as per category
    return item.total;
    return item.totalTransactionAmt;
    return item.totalUnit;
    return item.totalNav;
    return item.totalBalanceUnit;
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
 getDataForRightFilter(){//for rightSidefilter data this does not change after generating report
    var subCatData = this.mfService.filter(this.mutualFund.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    this.schemeWiseForFilter = this.mfService.filter(subCatData, 'mutualFundSchemeMaster');
    this.mutualFundListFilter = this.mfService.filter(this.schemeWiseForFilter, 'mutualFund');
  }
  getTotalValue() {
    this.mfService.initializeValues();
    this.mutualFundList.forEach(element => {
      this.grandTotal = this.mfService.getEachTotalValue(element);
    });
  }
  generatePdf() {
    let para = document.getElementById('template');
    this.utilService.htmlToPdf(para.innerHTML, 'Test','')
  }
  editTransaction(portfolioData, data) {
    const fragmentData = {
      flag: portfolioData,
      data,
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

  openFilter() {
    if (!this.mutualFund) {
      this.eventService.openSnackBar('No data to filter', 'OK');
      return
    }
    const fragmentData = {
      flag: 'openFilter',
      data: {...this.mutualFund},
      id: 1,
      state: 'open35',
      componentName: RightFilterComponent
    };
    fragmentData.data = {
      name:'TRANSACTION REPORT',
      mfData:this.mutualFund,
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
          if(sideBarData.data){
            this.rightFilterData=sideBarData.data
            this.subCatArray(this.rightFilterData.mutualFundList,this.rightFilterData.reportType)
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}
