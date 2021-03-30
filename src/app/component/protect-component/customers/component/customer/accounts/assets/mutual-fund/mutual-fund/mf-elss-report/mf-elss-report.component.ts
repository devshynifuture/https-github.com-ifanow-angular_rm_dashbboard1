import { AuthService } from './../../../../../../../../../../auth-service/authService';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectorRef, ElementRef, NgZone } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { MfServiceService } from '../../mf-service.service';
import { RightFilterComponent } from 'src/app/component/protect-component/customers/component/common-component/right-filter/right-filter.component';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { MFSchemeLevelHoldingsComponent } from '../mfscheme-level-holdings/mfscheme-level-holdings.component';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { RightFilterDuplicateComponent } from 'src/app/component/protect-component/customers/component/common-component/right-filter-duplicate/right-filter-duplicate.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BackOfficeService } from 'src/app/component/protect-component/AdviserComponent/backOffice/back-office.service';

import {
  CdkVirtualScrollViewport,
  FixedSizeVirtualScrollStrategy,
  VIRTUAL_SCROLL_STRATEGY
} from '@angular/cdk/scrolling';
/**
 * Data source
 */
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { RoleService } from 'src/app/auth-service/role.service';
import { CustomerOverviewService } from '../../../../../customer-overview/customer-overview.service';

const PAGESIZE = 20;
const ROW_HEIGHT = 48;

export class GridTableDataSource extends DataSource<any> {
  private _data: any[];

  get allData(): any[] {
    return this._data.slice();
  }

  set allData(data: any[]) {
    this._data = data;
    this.viewport.scrollToOffset(0);
    this.viewport.setTotalContentSize(this.itemSize * data.length);
    this.visibleData.next(this._data.slice(0, PAGESIZE));
  }

  offset = 0;
  offsetChange = new BehaviorSubject(0);

  constructor(initialData: any[], private viewport: CdkVirtualScrollViewport, private itemSize: number) {
    super();
    this._data = initialData;
    this.viewport.elementScrolled().subscribe((ev: any) => {
      const start = Math.floor(ev.currentTarget.scrollTop / ROW_HEIGHT);
      const prevExtraData = start > 5 ? 5 : 0;
      // const prevExtraData = 0;
      const slicedData = this._data;
      // const slicedData = this._data.slice(0, start + (PAGESIZE - prevExtraData));
      this.offset = ROW_HEIGHT * (start - prevExtraData);
      this.viewport.setRenderedContentOffset(this.offset);
      this.offsetChange.next(this.offset);
      this.visibleData.next(slicedData);
      console.log(' start ', start, ' prevExtraData ', prevExtraData, ' slicedData ', slicedData);
      console.log(' offset ', this.offset);

    });
  }

  private readonly visibleData: BehaviorSubject<any[]> = new BehaviorSubject([]);

  connect(collectionViewer: import('@angular/cdk/collections').CollectionViewer): Observable<any[] | ReadonlyArray<any>> {
    return this.visibleData;
  }

  disconnect(collectionViewer: import('@angular/cdk/collections').CollectionViewer): void {
  }
}

/**
 * Virtual Scroll Strategy
 */
export class CustomVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy {
  constructor() {
    super(ROW_HEIGHT, 1000, 2000);
  }

  attach(viewport: CdkVirtualScrollViewport): void {
    this.onDataLengthChanged();
  }
}

@Component({
  selector: 'app-mf-elss-report',
  templateUrl: './mf-elss-report.component.html',
  styleUrls: ['./mf-elss-report.component.scss'],
  providers: [{ provide: VIRTUAL_SCROLL_STRATEGY, useClass: CustomVirtualScrollStrategy }],
})
export class MfElssReportComponent implements OnInit {
  displayedColumns: string[] = ['no', 'transactionType', 'transactionDate', 'transactionAmount', 'transactionNav',
    'units', 'balanceUnits', 'lockFreeUnits', 'lockPeriod', 'days', 'LockFreeStatus', 'lockFreeDays', 'icons'];
  displayedColumnsTotal: string[] = ['noTotal', 'transactionTypeTotal', 'transactionDateTotal', 'transactionAmountTotal', 'transactionNavTotal',
    'unitsTotal', 'balanceUnitsTotal', 'lockFreeUnitsTotal', 'lockPeriodTotal', 'daysTotal', 'LockFreeStatusTotal', 'lockFreeDaysTotal', 'iconsTotal'];
  displayedColumns2: string[] = ['no', 'transactionType', 'transactionDate', 'transactionAmount', 'transactionNav',
    'units', 'balanceUnits', 'lockFreeUnits', 'lockPeriod', 'days', 'LockFreeStatus', 'lockFreeDays'];



  mfData;
  mutualFundList: any[];
  isLoading = true;
  dataSource = new MatTableDataSource([{}, {}, {}]);
  grandTotal: any = {};
  schemeWiseForFilter: any;
  mutualFundListFilter: any[];
  isSpinner = false;
  customDataHolder = [];
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild('unrealizedTranTemplate', { static: false }) unrealizedTranTemplate;
  @ViewChild('unrealizedTranTemplateHeader', { static: false }) unrealizedTranTemplateHeader;
  @ViewChild('allTranTemplateHeader', { static: false }) allTranTemplateHeader;
  rightFilterData: any = { reportType: '' };
  adviorData: any;
  @Output() changeInput = new EventEmitter();
  @Output() loaded = new EventEmitter();

  @Input() finPlanObj: any;//finacial plan pdf input
  advisorData: any;
  // displayedColumns: string[];
  viewMode = '';
  reponseData: any;
  setDefaultFilterData: any;
  mfGetData: any;
  columns = [];
  displayColArray: any[];
  saveFilterData: any;
  savedFilterData: any;
  inputData: any;
  schemeWise: any[];
  subCategoryData: any;
  transactionTypeList: any;
  returnValue: any;
  selectedLoadData: any;
  showDownload = false;
  columnHeader: any;
  pdfDataFornTRansaction: any;
  addedData: boolean;
  reportDate: any;
  customDataSource: any;
  unrealisedData: GridTableDataSource;
  unrealisedArray = [];
  @ViewChild('cdkVirtualScrollViewport', {
    read: CdkVirtualScrollViewport,
    static: false
  }) viewport: CdkVirtualScrollViewport;
  placeholderHeight = 0;

  dataTransaction: any;
  mode: string;
  isBulkEmailing: boolean;
  toDate: any;
  clientId: number;
  advisorId: number;
  userInfo: any;
  clientData: any;
  details: any;
  getOrgData: any;
  clientDetails: any;
  reportName: any;
  fragmentData = { isSpinner: false };
  mfBulkEmailRequestId: number;
  firstArrayTran: any;
  firstArrayTotalTran: any;
  secondArrayTran: any;
  secondArrayTotalTran: any;
  thirdArrayTran: any;
  thirdArrayTotalTran: any;
  fourthArrayTotalTran: any;
  fourthArrayTran: any;
  fifthArrayTran: any;
  fifthArrayTotalTran: any;
  SixthArrayTran: any;
  SixthArrayTotalTran: any;
  seventhArrayTran: any;
  seventhArrayTotalTran: any;
  eighthArrayTran: any;
  eighthArrayTotalTran: any;
  firstArray: any;
  firstArrayTotal: any;
  secondArray: any;
  secondArrayTotal: any;
  thirdArray: any;
  thirdArrayTotal: any;
  fourthArray: any;
  fourthArrayTotal: any;
  fifthArray: any;
  fifthArrayTotal: any;
  SixthArray: any;
  SixthArrayTotal: any;
  seventhArray: any;
  seventhArrayTotal: any;
  eighthArray: any;
  eighthArrayTotal: any;
  ninethArray: any;
  ninethArrayTotal: any;
  tenthArray: any;
  tenthArrayTotal: any;
  eleventhArray: any;
  eleventhArrayTotal: any;
  twelwthArray: any;
  twelwthArrayTotal: any;
  thirteenthArrayTotal: any;
  thirteenthArray: any;
  isRouterLink = false;
  header: any;
  headerHtml: HTMLElement;
  cashFlowXirr: any;
  cashFlowObj: { 'cashFlowInvestment': any; 'cashFlowSwitchIn': any; 'cashFlowSwitchOut': any; 'cashFlowRedemption': any; 'cashFlowDividendPayout': any; 'cashFlowNetInvestment': any; 'cashFlowMarketValue': any; 'cashFlowNetGain': any; 'cashFlowLifetimeXirr': any; };
  fromDate: any;
  adminAdvisorIds: any;
  parentId: any;





  loadingDone: boolean = false;
  isTableShow = true;
  isDisabledOpacity = true;
  colspanValue: Number;
  resData: any;
  mfAllTransactionCapability: any = {};
  mfCapability: any = {};
  clientNameToDisplay: any;
  excelDownload: boolean = false;
  ninethArrayTran: any;
  ninethArrayTotalTran: any;
  tenthArrayTran: any;
  tenthArrayTotalTran: any;
  eleventhArrayTran: any;
  eleventhArrayTotalTran: any;
  twelvthArrayTran: any;
  twelvthArrayTotalTran: any;
  showSummaryTable: boolean = true;
  allData: any;
  mfList: any[];
  mfObject: any;
  elssData = '';
  // setTrueKey = false;
  constructor(private ngZone: NgZone, public dialog: MatDialog, private datePipe: DatePipe,
    private subInjectService: SubscriptionInject, private utilService: UtilService,
    private mfService: MfServiceService,
    private route: Router,
    private backOfficeService: BackOfficeService,
    public routerActive: ActivatedRoute,
    private custumService: CustomerService, private eventService: EventService,
    private cd: ChangeDetectorRef,
    public roleService: RoleService,
    private customerOverview: CustomerOverviewService
              /*private changeDetectorRef: ChangeDetectorRef*/) {
    this.routerActive.queryParamMap.subscribe((queryParamMap) => {
      if (queryParamMap.has('clientId')) {
        // const param1 = queryParamMap.params;
        let param1 = queryParamMap['params'];

        this.clientId = parseInt(param1.clientId);
        this.advisorId = parseInt(param1.advisorId);
        this.parentId = parseInt(param1.parentId);
        this.mfBulkEmailRequestId = parseInt(param1.mfBulkEmailRequestId);
        this.toDate = param1.toDate;
        // this.reportDate = this.datePipe.transform(new Date(param1.toDate), 'dd-MMM-yyyy')
        this.addedData = true;
        this.isRouterLink = true;
        console.log('2423425', param1);
      } else {
        this.advisorId = AuthService.getAdvisorId();
        this.clientId = AuthService.getClientId() !== undefined ? AuthService.getClientId() : -1;
        this.parentId = AuthService.getParentId();
        this.userInfo = AuthService.getUserInfo();
        this.clientData = AuthService.getClientData();
        this.details = AuthService.getProfileDetails();
        this.getOrgData = AuthService.getOrgDetails();

      }
    });
  }

  mutualFund;

  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data ', data);
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.mfService.getTransactionType()
      .subscribe(res => {
        if (res) {
          this.getTransactionType(res);
        }
      });
    this.mfService.getElssData()
      .subscribe(res => {
        if (res) {
          this.elssData = res;
        }
      });
    this.getElssReport();
    this.dataSource = new MatTableDataSource([{}, {}, {}]);

    if (localStorage.getItem('token') != 'authTokenInLoginComponnennt') {
      localStorage.setItem('token', 'authTokenInLoginComponnennt');
    }
    this.mfService.getMfData()
      .subscribe(res => {
        this.mutualFund = res;
      })
    this.reportDate = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
    this.dataTransaction = {};
    this.dataTransaction.viewMode = {};
    this.dataTransaction.columnHeader = {};
    this.dataTransaction.displayedColumns = [];
    this.dataTransaction.dataSource = [];
    this.dataTransaction.customDataSource = [];
    this.dataTransaction.grandTotal = {};
    this.setDefaultFilterData = {};
    this.dataTransaction.flag = false;
    this.setDefaultFilterData.transactionView = [];

    this.mfService.getViewMode()
      .subscribe(res => {
        this.viewMode = res;
        if (res == '') {
          this.viewMode = this.mode;
        }
      });
    this.dataTransaction.displayedColumns = this.displayedColumns;
    this.colspanValue = Math.round(this.displayedColumns.length / 2);
    console.log('colspanValue', this.colspanValue);


  }
  getElssReport() {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource([{}, {}, {}]);
    const obj = {
      clientId: this.clientId,
    };
    this.custumService.getElssTransacitonReport(obj).subscribe(
      data => {
        this.elssReportResponse(data);
        console.log(data);
      }, (error) => {
        this.setUnrealizedDataSource([]);
        this.customDataSource.data = [];
        this.isLoading = false;
        this.eventService.showErrorMessage(error);

      }
    );
  }
  elssReportResponse(data) {
    if (data.mutualFundSchemeMasterList && data.mutualFundSchemeMasterList.length > 0) {
      let filterData = this.mfService.filter(data['mutualFundSchemeMasterList'], 'mutualFund')
      let array = [];
      Object.keys(data.familyMemberList).map(key => {
        array.push(data.familyMemberList[key]);
      });
      data.family_member_list = array;
      this.allData = data;
      filterData.forEach(ele => {
        ele.schemeId = ele.mutualFundSchemeMasterId
      })
      if (this.fromDate && this.toDate) {
        filterData.forEach(element => {
          element.mutualFundTransactions = element.mutualFundTransactions.filter(item => this.datePipe.transform(item.transactionDate, 'yyyy/MM/dd') >= this.fromDate && this.datePipe.transform(item.transactionDate, 'yyyy-MM-dd') <= this.toDate);
        });
      }
      this.mfList = filterData;
      this.allData.mutualFundList = filterData;
      this.getFilterObj();
      this.asyncFilter(filterData);
    } else {
      this.setUnrealizedDataSource([]);
      this.customDataSource.data = [];
    }
  }
  getFilterObj() {
    this.mfObject = {
      family_member_list: this.allData.family_member_list,
      folioWise: this.mfList,
      mutualFundCategoryMastersList: this.mutualFund.mutualFundCategoryMastersList,
      mutualFundList: this.mfList,
      schemeWise: this.allData.mutualFundSchemeMasterList,
      subCategoryData: this.mutualFund.mutualFundCategoryMastersList,
      toDate: new Date()
    }
    if (this.elssData == '') {
      this.mfService.setElssData(this.mfObject);
      this.setDefaultFilterData = this.mfService.setFilterData(this.mfObject, this.rightFilterData, this.displayedColumns);
    }
    console.log(this.setDefaultFilterData);
  }
  styleObjectTransaction(header, ind) {

    if (header == 'no') {
      this.customDataSource.data.arrayTran.push({
        name: 'Sr no.', index: ind, isCheked: true, style: {
          'border-top': '1px solid #DADCE0',
          width: '9%',
          'padding': '7px 8px',
          'font-size': '13px !important',
          'line-height': '16px !important',
          'color': '#202020',
          'border-right': '1px solid #DADCE0',
          'order-left': '1px solid #DADCE0',
          'text-align': 'left'
        }
      });
      // Object.assign(this.customDataSource.data, { no: true });
    } else if (header == 'transactionType') {
      this.customDataSource.data.arrayTran.push({
        name: 'Transaction type', index: ind, isCheked: true, style: {
          'border-top': '1px solid #DADCE0',
          width: '15%',
          'padding': '7px 8px',
          'font-size': '13px !important',
          'line-height': '16px !important',
          'color': '#202020',
          'border-right': '1px solid #DADCE0',
          'text-align': 'left'
        }
      });
      // Object.assign(this.customDataSource.data, { transactionType: true });
    } else if (header == 'transactionDate') {
      this.customDataSource.data.arrayTran.push({
        name: 'Transaction date', index: ind, isCheked: true, style: {
          'border-top': '1px solid #DADCE0',
          width: '15%',
          'padding': '7px 8px',
          'font-size': '13px !important',
          'line-height': '16px !important',
          'color': '#202020',
          'border-right': '1px solid #DADCE0',
          'text-align': 'right'
        }
      });
      // Object.assign(this.customDataSource.data, { transactionDate: true });
    } else if (header == 'transactionAmount') {
      this.customDataSource.data.arrayTran.push({
        name: 'Transaction amount', index: ind, isCheked: true, style: {
          width: '15%',
          'padding': '7px 8px',
          'font-size': '13px !important',
          'line-height': '16px !important',
          'color': '#202020',
          'border-right': '1px solid #DADCE0',
          'border-top': '1px solid #DADCE0',
          'text-align': 'right'
        }
      });
      // Object.assign(this.customDataSource.data, { transactionAmount: true });
    } else if (header == 'transactionNav') {
      this.customDataSource.data.arrayTran.push({
        name: 'Transaction NAV', index: ind, isCheked: true, style: {
          'border-top': '1px solid #DADCE0',
          width: '8%',
          'padding': '7px 8px',
          'font-size': '13px !important',
          'line-height': '16px !important',
          'color': '#202020',
          'border-right': '1px solid #DADCE0',
          'text-align': 'right'
        }
      });
      // Object.assign(this.customDataSource.data, { transactionNav: true });
    } else if (header == 'units') {
      this.customDataSource.data.arrayTran.push({
        name: 'Units', index: ind, isCheked: true, style: {
          'border-top': '1px solid #DADCE0',
          width: '10%',
          'padding': '7px 8px',
          'font-size': '13px !important',
          'line-height': '16px !important',
          'color': '#202020',
          'border-right': '1px solid #DADCE0',
          'text-align': 'right'
        }
      });
      // Object.assign(this.customDataSource.data, { units: true });
    } else if (header == 'balanceUnits') {
      this.customDataSource.data.arrayTran.push({
        name: 'Balance units', index: ind, isCheked: true, style: {
          'border-top': ' 1px solid #DADCE0',
          width: '10%',
          'text-align': 'right',
          'padding': '7px 8px',
          'font-size': '13px !important',
          'line-height': '16px !important',
          'color': '#202020',
          'border-right': '1px solid #DADCE0',
        }
      });
      // Object.assign(this.customDataSource.data, { balanceUnits: true });
    } else if (header == 'days') {
      this.customDataSource.data.arrayTran.push({
        name: 'Days', index: ind, isCheked: true, style: {
          'border-top': '1px solid #DADCE0',
          'text-align': 'right',
          'padding': '7px 8px',
          'font-size': '13px !important',
          'line-height': '16px !important',
          'color': '#202020',
          'border-right': '1px solid #DADCE0',
        }
      });
      // Object.assign(this.customDataSource.data, { days: true });
    } else if (header == 'lockPeriod') {
      this.customDataSource.data.arrayTran.push({
        name: 'Lock free date', index: ind, isCheked: true, style: {
          width: '15%',
          'border-top': '1px solid #DADCE0',
          'text-align': 'right',
          'padding': '7px 8px',
          'font-size': '13px !important',
          'line-height': '16px !important',
          'color': '#202020',
          'border-right': '1px solid #DADCE0',
        }
      });
      // Object.assign(this.customDataSource.data, { days: true });
    } else if (header == 'lockFreeUnits') {
      this.customDataSource.data.arrayTran.push({
        name: 'Lock free units', index: ind, isCheked: true, style: {
          width: '13%',
          'border-top': '1px solid #DADCE0',
          'text-align': 'right',
          'padding': '7px 8px',
          'font-size': '13px !important',
          'line-height': '16px !important',
          'color': '#202020',
          'border-right': '1px solid #DADCE0',
        }
      });
      // Object.assign(this.customDataSource.data, { days: true });
    } else if (header == 'LockFreeStatus') {
      this.customDataSource.data.arrayTran.push({
        name: 'Lock free status', index: ind, isCheked: true, style: {
          width: '13%',
          'border-top': '1px solid #DADCE0',
          'text-align': 'right',
          'padding': '7px 8px',
          'font-size': '13px !important',
          'line-height': '16px !important',
          'color': '#202020',
          'border-right': '1px solid #DADCE0',
        }
      });
      // Object.assign(this.customDataSource.data, { days: true });
    } else if (header == 'lockFreeDays') {
      this.customDataSource.data.arrayTran.push({
        name: 'Lock free days', index: ind, isCheked: true, style: {
          width: '15%',
          'border-top': '1px solid #DADCE0',
          'text-align': 'right',
          'padding': '7px 8px',
          'font-size': '13px !important',
          'line-height': '16px !important',
          'color': '#202020',
          'border-right': '1px solid #DADCE0',
        }
      });
      // Object.assign(this.customDataSource.data, { days: true });
    }


  }

  initValueOnInit() {

    if (this.mutualFund.mutualFundList.length > 0) {
      this.isLoading = true;
      this.changeInput.emit(true);
      this.advisorData = this.mutualFund.advisorData;
    } else {
      this.isLoading = false;
      this.changeInput.emit(false);

      this.customDataSource.data = [];
      this.customDataHolder = [];
    }
  }
  doFiltering(data) {
    if (this.inputData == 'scheme wise') {
      this.rightFilterData.reportType = [];
      this.rightFilterData.reportType[0] = {
        name: 'Scheme wise',
        selected: true
      };
      data.subCategoryData = this.mfService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
      this.schemeWise = this.mfService.filter(this.subCategoryData, 'mutualFundSchemeMaster');
    } else {
      data.subCategoryData = this.mfService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
      data.schemeWise = this.mfService.filter(data.subCategoryData, 'mutualFundSchemeMaster');
      data.mutualFundList = this.mfService.filter(data.schemeWise, 'mutualFund');
      data.mutualFundList = this.casFolioNumber(data.mutualFundList)
    }
    return data;
  }
  casFolioNumber(data) {
    data.forEach(element => {
      if (element.rtMasterId == 6 && !element.folioNumber.includes("CAS")) {
        element.folioNumber = 'CAS-' + element.folioNumber;
      }

    });
    return data;
  }
  checkFamMember() {
    this.clientNameToDisplay = null;
    if (Object.keys(this.setDefaultFilterData).length > 0) {
      if (this.setDefaultFilterData.familyMember) {
        let famMember = this.setDefaultFilterData.familyMember.filter(d => d.selected == true);
        if (famMember.length == 1) {
          this.clientNameToDisplay = famMember[0].name ? famMember[0].name : this.clientData.name
        } else {
          this.clientNameToDisplay = this.clientData.name
        }
      } else {
        this.clientNameToDisplay = this.clientData.name
      }

    } else {
      this.clientNameToDisplay = this.clientData.name
    }
  }

  getTransactionTypeData() {
    const obj = {
      advisorIds: [this.advisorId],
      clientId: this.clientId,
      parentId: 0

    };
    this.custumService.getTransactionTypeInMF(obj).subscribe(
      data => {
        if (data) {
          data = data.filter(item => item != null);
          this.mfService.setTransactionType(data);
          // this.setDefaultFilterData.transactionTypeList = filterData

        }
        // this.transactionTypeList = data;
      }
    );
  }

  setUnrealizedDataSource(dataArray) {
    this.unrealisedArray = dataArray;
    if (this.unrealisedData) {
      this.unrealisedData.allData = this.unrealisedArray;
    }
  }
  asyncFilter(mutualFund) {
    if (typeof Worker !== 'undefined') {
      // console.log(`13091830918239182390183091830912830918310938109381093809328`);
      this.rightFilterData.reportType = [];
      this.rightFilterData.reportType[0] = {
        name: 'Investor wise',
        selected: true,
      };
      if (this.isRouterLink) {
        this.setDefaultFilterData.showFolio = '2';
      }
      const input = {
        mutualFundList: mutualFund,
        type: this.rightFilterData.reportType,
        mutualFund: this.elssData,
        transactionType: this.rightFilterData.transactionType,
        viewMode: 'All transactions',
        showFolio: false,
      };
      // Create a new
      const worker = new Worker('src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mutual-fund-unrealized-tran/mutual-fund-unrealized.worker.ts', { type: 'module' });
      worker.onmessage = ({ data }) => {
        console.log('worker output : ', data);
        this.grandTotal = data.totalValue;
        this.dataTransaction.dataSource = data.dataSourceData;
        // this.customDataSource.data = (data.customDataSourceData);
        this.customDataSource = [];
        this.customDataSource.data = [];
        // this.unrealisedData = new TableVirtualScrollDataSource(data.customDataSourceData);
        this.unrealisedData = data.customDataSourceData;
        this.customDataSource.data = (data.customDataSourceData);
        this.customDataSource.data.arrayTran = [];
        this.customDataSource.data.arrayUnrealised = [];
        this.pdfDataFornTRansaction = this.customDataSource.data;
        this.customDataHolder = data.customDataHolder;
        this.dataTransaction.grandTotal = this.grandTotal;
        this.dataTransaction.customDataSourceData = data.customDataSourceData;
        this.dataTransaction.viewMode = this.mode;
        this.dataTransaction.setDefaultFilterData = this.setDefaultFilterData;
        this.dataTransaction.columnHeader = this.columnHeader;
        // if (!isNaN(this.mfData.total_current_value) && !isNaN(this.mfData.total_amount_invested) && !isNaN(this.mfData.total_unrealized_gain) && !isNaN(this.mfData.total_unrealized_gain)) {
        //   this.mfData.total_current_value = this.mfService.mutualFundRoundAndFormat(this.mfData.total_current_value, 0);
        //   this.mfData.total_amount_invested = this.mfService.mutualFundRoundAndFormat(this.mfData.total_amount_invested, 0);
        //   this.mfData.total_unrealized_gain = this.mfService.mutualFundRoundAndFormat(this.mfData.total_unrealized_gain, 0);
        //   this.mfData.total_absolute_return = this.mfService.mutualFundRoundAndFormat(this.mfData.total_absolute_return, 2);
        // }
        this.setUnrealizedDataSource(data.customDataSourceData);
        this.dataSource = new MatTableDataSource(data.dataSourceData);
        console.log('datdataSource', this.unrealisedData)
        console.log('datasource............', this.dataSource.data)
        this.colspanValue = Math.round(this.displayedColumns.length / 2);
        console.log('endTime ', new Date());
        this.ngZone.run(() => {
          this.cd.detectChanges();
          this.isLoading = false;
        });
        this.displayedColumns.forEach((element, ind) => {
          this.styleObjectTransaction(element, ind);
        });


        this.customDataSource.data.arrayTran.forEach(element => {
          switch (element.index) {
            case 0:
              this.firstArrayTran = this.filterHedaerWiseTran(element);
              this.firstArrayTotalTran = this.filterHedaerWiseTotalTran(element);

              break;
            case 1:
              this.secondArrayTran = this.filterHedaerWiseTran(element);
              this.secondArrayTotalTran = this.filterHedaerWiseTotalTran(element);

              break;
            case 2:
              this.thirdArrayTran = this.filterHedaerWiseTran(element);
              this.thirdArrayTotalTran = this.filterHedaerWiseTotalTran(element);

              break;
            case 3:
              this.fourthArrayTran = this.filterHedaerWiseTran(element);
              this.fourthArrayTotalTran = this.filterHedaerWiseTotalTran(element);

              break;
            case 4:
              this.fifthArrayTran = this.filterHedaerWiseTran(element);
              this.fifthArrayTotalTran = this.filterHedaerWiseTotalTran(element);

              break;
            case 5:
              this.SixthArrayTran = this.filterHedaerWiseTran(element);
              this.SixthArrayTotalTran = this.filterHedaerWiseTotalTran(element);

              break;
            case 6:
              this.seventhArrayTran = this.filterHedaerWiseTran(element);
              this.seventhArrayTotalTran = this.filterHedaerWiseTotalTran(element);

              break;
            case 7:
              this.eighthArrayTran = this.filterHedaerWiseTran(element);
              this.eighthArrayTotalTran = this.filterHedaerWiseTotalTran(element);


              break;
            case 8:
              this.ninethArrayTran = this.filterHedaerWiseTran(element);
              this.ninethArrayTotalTran = this.filterHedaerWiseTotalTran(element);


              break;
            case 9:
              this.tenthArrayTran = this.filterHedaerWiseTran(element);
              this.tenthArrayTotalTran = this.filterHedaerWiseTotalTran(element);


              break;
            case 10:
              this.eleventhArrayTran = this.filterHedaerWiseTran(element);
              this.eleventhArrayTotalTran = this.filterHedaerWiseTotalTran(element);


              break;
            case 11:
              this.twelvthArrayTran = this.filterHedaerWiseTran(element);
              this.twelvthArrayTotalTran = this.filterHedaerWiseTotalTran(element);


              break;

          }
        });
        if (mutualFund.flag == true) {
          this.dataTransaction.flag = true;
        }
        this.changeInput.emit(false);
        console.log('dataSource', this.dataSource)

        if (this.finPlanObj) {
          this.showDownload = true;
          this.cd.detectChanges();
        }
      };

      worker.postMessage(input);
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  Excel(tableTitle, flag) {
    this.showDownload = true;
    this.excelDownload = true
    setTimeout(() => {
      const blob = new Blob([document.getElementById('template').innerHTML], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      });
      if (flag == 'XLSX') {
        saveAs(blob, tableTitle + '.xlsx');
      } else {
        saveAs(blob, tableTitle + '.xls');
      }
    }, 400);
    // if (data) {
    //   this.fragmentData.isSpinner = false;
    // }
  }

  mfSchemes() {// get last mf list
  }


  getDataForRightFilter() {// for rightSidefilter data this does not change after generating report
    const subCatData = this.mfService.filter(this.mutualFund.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    this.schemeWiseForFilter = this.mfService.filter(subCatData, 'mutualFundSchemeMaster');
    this.mutualFundListFilter = this.mfService.filter(this.schemeWiseForFilter, 'mutualFund');
  }

  openMutualEditFund(flag, element) {
    let sendData: any;
    //   let list = [];
    //   this.mfData.mutualFundList.forEach(val => list.push(Object.assign({}, val)));
    //   list.forEach(element => {
    //     element.mutualFundTransactions = element.mutualFundTransactions.filter(item => item.id === element.id);
    // });


    this.mfData.mutualFundList.forEach(ele => {
      ele.mutualFundTransactions.forEach(tran => {
        if (tran.id == element.id) {
          sendData = tran;
          this.selectedLoadData = ele;
        }
      });
    });
    this.selectedLoadData.mutualFundTransactions = this.selectedLoadData.mutualFundTransactions.filter(item => item.id === sendData.id);
    this.selectedLoadData.id = sendData.id;
    // this.mfService.getMutualFundData()
    //   .subscribe(res => {
    const fragmentData = {
      flag: 'editTransaction',
      // data: { family_member_list: ['family_member_list'], flag, ...sendData, ...this.selectedLoadData },
      data: { family_member_list: ['family_member_list'], flag, ...sendData, ...this.selectedLoadData },
      id: 1,
      state: 'open',
      componentName: MFSchemeLevelHoldingsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        // console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.addedData = true;
            this.mfService.setDataForMfGet('');
            this.mfService.setMfData('');
            this.mfService.setTransactionType('');
            this.resData = '';
            this.ngOnInit();
            // this.getMutualFund();
          }
          // console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
    // });

  }


  getTransactionType(res) {
    const filterData = [];
    res.forEach(element => {
      const obj = {
        name: element,
        selected: false
      };
      filterData.push(obj);
    });
    this.transactionTypeList = filterData;
  }

  openFilter() {

    const fragmentData = {
      flag: 'openFilter',
      data: {},
      id: 1,
      state: 'open35',
      componentName: RightFilterDuplicateComponent
    };
    let obj = {
      family_member_list: this.allData.family_member_list,
      mutualFundList: this.mfList,
      mutualFundSchemeMasterList: this.allData.mutualFundSchemeMasterList
    }
    fragmentData.data = {
      name: this.viewMode,
      mfData: obj,
      folioWise: this.setDefaultFilterData.folioWise,
      schemeWise: this.setDefaultFilterData.schemeWise,
      familyMember: this.setDefaultFilterData.familyMember,
      category: this.setDefaultFilterData.category,
      transactionView: this.displayedColumns,
      scheme: this.setDefaultFilterData.scheme,
      reportType: this.rightFilterData.reportType,
      reportAsOn: new Date(),
      showFolio: false,
      fromDate: this.setDefaultFilterData.fromDate,
      toDate: this.setDefaultFilterData.toDate,
      transactionPeriod: this.setDefaultFilterData.transactionPeriod,
      transactionPeriodCheck: this.setDefaultFilterData.transactionPeriodCheck,
      selectFilter: this.rightFilterData ? this.setDefaultFilterData.selectFilter : (this.saveFilterData) ? this.saveFilterData.selectFilter : null,
      transactionTypeList: (this.rightFilterData.transactionType) ? this.rightFilterData.transactionType : this.transactionTypeList,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (sideBarData.data && sideBarData.data != 'Close') {
            let filterData;
            this.dataSource = new MatTableDataSource([{}, {}, {}]);
            this.customDataSource = [];
            this.isLoading = true;
            this.isTableShow = true;
            this.showSummaryTable = true
            this.changeInput.emit(true);
            this.resData = sideBarData.data;
            this.rightFilterData = sideBarData.data;
            this.saveFilterData = {};
            if (this.rightFilterData.mfData) {
              this.reponseData = this.doFiltering(this.rightFilterData.mfData);
            }
            this.mfData = this.reponseData;
            this.displayColArray = [];
            this.rightFilterData.transactionView.forEach(element => {
              const obj = {
                displayName: element.displayName,
                selected: true
              };
              this.displayColArray.push(obj);
            });


            ////////////////////
            if (this.rightFilterData.elssResponse && this.rightFilterData.elssResponse.mutualFundSchemeMasterList.length > 0) {
              filterData = this.mfService.filter(this.rightFilterData.elssResponse['mutualFundSchemeMasterList'], 'mutualFund')
              filterData.forEach(ele => {
                ele.schemeId = ele.mutualFundSchemeMasterId
              })
            }
            let mfObject = {
              family_member_list: this.rightFilterData.family_member_list,
              folioWise: filterData,
              mutualFundCategoryMastersList: this.mutualFund.mutualFundCategoryMastersList,
              mutualFundList: filterData,
              schemeWise: this.rightFilterData.elssResponse && this.rightFilterData.elssResponse.mutualFundSchemeMasterList.length > 0 ? this.rightFilterData.elssResponse.mutualFundSchemeMasterList : [],
              subCategoryData: this.mutualFund.mutualFundCategoryMastersList,
              toDate: new Date()
            }
            this.rightFilterData.mfData = mfObject;
            /////////////////////////////
            this.reportDate = this.datePipe.transform(new Date(this.rightFilterData.toDate), 'dd-MMM-yyyy');
            this.fromDate = new Date(this.rightFilterData.toDate);
            this.toDate = new Date(this.rightFilterData.fromDate);
            this.setDefaultFilterData = this.mfService.setFilterData(this.elssData, this.rightFilterData, this.displayColArray);
            this.elssReportResponse(this.rightFilterData.elssResponse);
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  isSimpleRow = (index, item) => item.total != 'Total' && !item.groupName && !item.schemeName && !item.name;
  isTotal = (index, item) => item.total == 'Total';
  isGroup = (index, item) => item.groupName; // group category wise
  //   return item.groupName;
  // }

  isGroup2 = (index, item) => item.schemeName; // for grouping schme name


  isGroup3 = (index, item) => item.name; // for grouping family member name


  isGroup4 = (index, item) => item.total; // for getting total of each scheme


  generatePdf() {
    this.showDownload = true;
    this.excelDownload = false
    this.fragmentData.isSpinner = true;
    this.cd.markForCheck();
    this.cd.detectChanges();
    setTimeout(() => {
      const para = document.getElementById('template');
      this.headerHtml = document.getElementById('alltemplateHeader');
      this.returnValue = this.utilService.htmlToPdf(this.headerHtml.innerHTML, para.innerHTML, this.viewMode, 'true', this.fragmentData, '', '', true, this.clientNameToDisplay ? this.clientNameToDisplay : this.clientData.name);
    }, 200);
  }

  filterHedaerWiseTran(data) {
    let obj;
    switch (data.name) {
      case 'Sr no.':
        obj = 'indexId';
        break;
      case 'Transaction type':
        obj = 'fwTransactionType';
        break;
      case 'Transaction date':
        obj = 'transactionDate';
        break;
      case 'Transaction amount':
        obj = 'amount';
        break;
      case 'Transaction NAV':
        obj = 'purchasePrice';
        break;
      case 'Units':
        obj = 'unit';
        break;
      case 'Balance units':
        obj = 'balanceUnits';
        break;
      case 'Days':
        obj = 'days';
        break;
      case 'Lock free date':
        obj = 'elssDate';
        break;
      case 'Lock free units':
        obj = 'unlockedUnits';
        break;
      case 'Lock free status':
        obj = 'status';
        break;
      case 'Lock free days':
        obj = 'unLockDays';
        break;
    }

    return obj;
  }

  filterHedaerWiseTotalTran(data) {
    let obj;
    switch (data.name) {
      case 'Sr no.':
        obj = '';
        break;
      case 'Transaction type':
        obj = 'total';
        break;
      case 'Transaction date':
        obj = '';
        break;
      case 'Transaction amount':
        obj = 'totalTransactionAmt';
        break;
      case 'Transaction NAV':
        obj = '';
        break;
      case 'Units':
        obj = 'totalUnit';
        break;
      case 'Balance units':
        obj = 'totalBalanceUnit';
        break;
      case 'Days':
        obj = '';
        break;
      case 'Lock free date':
        obj = '';
        break;
      case 'Lock free units':
        obj = '';
        break;
      case 'Lock free status':
        obj = '';
        break;
      case 'Lock free days':
        obj = '';
        break;

    }

    return obj;
  }

  getValuesTran(data, value, isGT) {
    let number;
    if (value == 'transactionDate') {
      number = this.datePipe.transform(data, 'dd/MM/yyyy');
    } else {
      number = this.mfService.mutualFundRoundAndFormat(data, 0);
    }
    if (value == '') {
      number = '';
    } else if (value == 'Total') {
      number = 'Total';
    }
    return number;
  }
  formatNumber(data, noOfPlaces: number = 0) {
    if (data) {
      data = parseFloat(data)
      if (isNaN(data)) {
        return data;
      } else {
        // console.log(' original ', data);
        const formattedValue = parseFloat((data).toFixed(noOfPlaces)).toLocaleString('en-IN', { 'minimumFractionDigits': noOfPlaces, 'maximumFractionDigits': noOfPlaces });
        // console.log(' original / roundedValue ', data, ' / ', formattedValue);
        return formattedValue;
      }
    } else {
      return '0';
    }

    return data;
  }
  getValues(data, value, isGT) {
    let number;
    if (value == 'transactionDate') {
      number = this.datePipe.transform(data, 'dd/MM/yyyy');
    } else {
      number = this.mfService.mutualFundRoundAndFormat(data, 0);
    }
    if (value == '') {
      number = '';
    } else if (value == 'Total') {
      number = 'Total';
    }
    return number;
  }
  getDetails() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
    };
    this.backOfficeService.getDetailsClientAdvisor(obj).subscribe(
      data => this.getDetailsClientAdvisorRes(data)
    );
  }

  getDetailsClientAdvisorRes(data) {
    this.details = {};
    this.details.emailId = {};
    console.log('data', data);
    this.clientDetails = data;
    this.clientData = data.clientData;
    this.getOrgData = data.advisorData;
    this.userInfo = data.advisorData;
    this.details.emailId = data.advisorData.email;
  }

  placeholderWhen(index: number, _: any) {
    return index == 0;
  }
}
