import {AuthService} from './../../../../../../../../../../auth-service/authService';
import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {MfServiceService} from '../../mf-service.service';
import {RightFilterComponent} from 'src/app/component/protect-component/customers/component/common-component/right-filter/right-filter.component';
import {ExcelGenService} from 'src/app/services/excel-gen.service';
import {CustomerService} from '../../../../../customer.service';
import {EventService} from 'src/app/Data-service/event.service';
import {map} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {MFSchemeLevelHoldingsComponent} from '../mfscheme-level-holdings/mfscheme-level-holdings.component';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {TableVirtualScrollDataSource} from 'ng-table-virtual-scroll';
import {RightFilterDuplicateComponent} from 'src/app/component/protect-component/customers/component/common-component/right-filter-duplicate/right-filter-duplicate.component';
import {ActivatedRoute, Router} from '@angular/router';
import {BackOfficeService} from 'src/app/component/protect-component/AdviserComponent/backOffice/back-office.service';

import {
  CdkVirtualScrollViewport,
  FixedSizeVirtualScrollStrategy,
  VIRTUAL_SCROLL_STRATEGY
} from '@angular/cdk/scrolling';
/**
 * Data source
 */
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';

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
  selector: 'app-mutual-fund-unrealized-tran',
  templateUrl: './mutual-fund-unrealized-tran.component.html',
  styleUrls: ['./mutual-fund-unrealized-tran.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
  providers: [{provide: VIRTUAL_SCROLL_STRATEGY, useClass: CustomVirtualScrollStrategy}],
})
export class MutualFundUnrealizedTranComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['no', 'transactionType', 'transactionDate', 'transactionAmount', 'transactionNav',
    'units', 'balanceUnits', 'days', 'currentValue', 'dividendPayout', 'dividendReinvest', 'totalAmount', 'gain', 'absReturn', 'xirr', 'icons'];
  displayedColumnsTotal: string[] = ['noTotal', 'transactionTypeTotal', 'transactionDateTotal', 'transactionAmountTotal', 'transactionNavTotal',
    'unitsTotal', 'balanceUnitsTotal', 'daysTotal', 'currentValueTotal', 'dividendPayoutTotal', 'dividendReinvestTotal', 'totalAmountTotal', 'gainTotal', 'absReturnTotal', 'xirrTotal', 'iconsTotal'];
  displayedColumns2: string[] = ['categoryName', 'amtInvested', 'currentValue', 'dividendPayout', 'dividendReinvest',
    'gain', 'absReturn', 'xirr', 'allocation'];
  // subCategoryData: any[];
  // schemeWise: any[];
  mfData;
  mutualFundList: any[];
  isLoading = false;
  dataSource = new MatTableDataSource([{}, {}, {}]);
  grandTotal: any = {};
  schemeWiseForFilter: any;
  mutualFundListFilter: any[];
  isSpinner = false;
  customDataHolder = [];
  @ViewChild('tableEl', {static: false}) tableEl;
  @ViewChild('unrealizedTranTemplate', {static: false}) unrealizedTranTemplate;
  @ViewChild('unrealizedTranTemplateHeader', {static: false}) unrealizedTranTemplateHeader;
  @ViewChild('allTranTemplateHeader', {static: false}) allTranTemplateHeader;
  rightFilterData: any = {reportType: ''};
  adviorData: any;
  @Output() changeInput = new EventEmitter();
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
  fragmentData = {isSpinner: false};
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

  // setTrueKey = false;
  constructor(public dialog: MatDialog, private datePipe: DatePipe,
              private subInjectService: SubscriptionInject, private utilService: UtilService,
              private mfService: MfServiceService, private excel: ExcelGenService,
              private route: Router,
              private backOfficeService: BackOfficeService,
              public routerActive: ActivatedRoute,
              private custumService: CustomerService, private eventService: EventService,
              /*private changeDetectorRef: ChangeDetectorRef*/) {
    this.routerActive.queryParamMap.subscribe((queryParamMap) => {
      if (queryParamMap.has('clientId')) {
        // const param1 = queryParamMap.params;
        let param1 = queryParamMap['params'];

        this.clientId = parseInt(param1.clientId);
        this.advisorId = parseInt(param1.advisorId);
        this.mfBulkEmailRequestId = parseInt(param1.mfBulkEmailRequestId);
        // this.toDate = param1.toDate;
        // this.reportDate = this.datePipe.transform(new Date(param1.toDate), 'dd-MMM-yyyy')
        this.addedData = true;
        this.isRouterLink = true;
        console.log('2423425', param1);
      } else {
        this.advisorId = AuthService.getAdvisorId();
        this.clientId = AuthService.getClientId() !== undefined ? AuthService.getClientId() : -1;
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

  uploadData(data) {

    if (data) {
      this.clientId = data.clientId;
      this.addedData = true;
      this.isBulkEmailing = true;
      // this.toDate = data.toDate;
      // this.reportDate = this.datePipe.transform(new Date(), 'dd-MMM-yyyy')
      if (data.mode == 'unrealisedTransactions') {
        this.viewMode = 'Unrealized Transactions';
        this.mode = 'Unrealized Transactions';
        this.reportName = 'MF_All_Trasaction_Report';
      } else {
        this.viewMode = 'All Transactions';
        this.mode = 'All Transactions';
        this.reportName = 'MF_Unrealised_Trasaction_Report';
      }
      this.ngOnInit();
    }
    return this.dataTransaction;

  }

  ngOnInit() {
    this.dataSource.data = ([{}, {}, {}]);
    if (localStorage.getItem('token') != 'authTokenInLoginComponnennt') {
      localStorage.setItem('token', 'authTokenInLoginComponnennt');
    }
    this.reportDate = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
    this.routerActive.queryParamMap.subscribe((queryParamMap) => {
      if (queryParamMap.has('clientId')) {
        // const param1 = queryParamMap.get('params');
        let param1 = queryParamMap['params'];

        this.clientId = parseInt(param1.clientId);
        this.advisorId = parseInt(param1.advisorId);
        // this.toDate = (param1.toDate)
        this.isBulkEmailing = true;
        // this.reportDate = this.datePipe.transform(new Date(this.toDate), 'dd-MMM-yyyy')
        if (this.route.url.split('?')[0] == '/pdf/allTransactions') {
          this.viewMode = 'All Transactions';
          this.mode = 'All Transactions';
          this.fromDate = (param1.fromDate)
          this.toDate = (param1.toDate)
        } else {
          this.viewMode = 'Unrealized Transactions';
          this.mode = 'Unrealized Transactions';
        }
        console.log('2423425', param1);
        this.getDetails();
      }
    });
    if (this.viewMode == 'Unrealized Transactions') {

      this.reportName = 'MF unrealised trasaction report';
    } else {
      this.reportName = 'MF all trasaction report';
    }
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
    // this.unrealisedData = new GridTableDataSource([]);

    this.mfService.getViewMode()
      .subscribe(res => {
        this.viewMode = res;
        if (res == '') {
          this.viewMode = this.mode;
        }
      });
    this.getFilterData((this.viewMode == 'Unrealized Transactions') ? 4 : 3);

    if (this.viewMode == 'Unrealized Transactions') {
      this.displayedColumns = ['no', 'transactionType', 'transactionDate', 'transactionAmount', 'transactionNav',
        'units', 'currentValue', 'dividendPayout', 'dividendReinvest', 'totalAmount', 'gain', 'absReturn', 'xirr'];
      this.displayedColumnsTotal = ['noTotal', 'transactionTypeTotal', 'transactionDateTotal', 'transactionAmountTotal', 'transactionNavTotal',
        'unitsTotal', 'currentValueTotal', 'dividendPayoutTotal', 'dividendReinvestTotal', 'totalAmountTotal', 'gainTotal', 'absReturnTotal',
        'xirrTotal'];

    } else {
      this.displayedColumns = ['no', 'transactionType', 'transactionDate', 'transactionAmount', 'transactionNav',
        'units', 'balanceUnits', 'days', 'icons'];
      this.displayedColumnsTotal = ['noTotal', 'transactionTypeTotal', 'transactionDateTotal', 'transactionAmountTotal', 'transactionNavTotal',
        'unitsTotal', 'balanceUnitsTotal', 'daysTotal', 'iconsTotal'];
    }
    this.dataTransaction.displayedColumns = this.displayedColumns;
  }

  ngAfterViewInit() {
    this.unrealisedData = new GridTableDataSource(this.unrealisedArray, this.viewport, this.unrealisedArray.length);
    this.unrealisedData.offsetChange.subscribe(offset => {
      this.placeholderHeight = offset;
      // console.log(' this.placeholderHeight ', this.placeholderHeight);
    });
    const para = document.getElementById('template');
    if (para.innerHTML) {
      if (this.route.url.split('?')[0] == '/pdf/allTransactions' && this.isLoading == false) {
        this.showDownload = true;
        this.generatePdfBulk();
      }
      if (this.route.url.split('?')[0] == '/pdf/unrealisedTransactions' && this.isLoading == false) {
        this.showDownload = true;
        this.generatePdfBulk();
      }
    }
  }

  getFilterData(value) {
    this.mfService.getMfData()
      .subscribe(res => {
        this.mutualFund = res;
      });
    this.mfService.getFilterValues()
      .subscribe(res => {
        this.setDefaultFilterData = res;
        if (this.setDefaultFilterData == '') {
          this.setDefaultFilterData = {};
        }
      });
    this.mfService.getDataForMfGet()
      .subscribe(res => {
        this.mfGetData = res;
      });
    this.mfService.getTransactionType()
      .subscribe(res => {
        if (res) {
          this.getTransactionType(res);

        }
      });
    this.dataSource = new MatTableDataSource([{}, {}, {}]);

    this.isLoading = true;
    this.changeInput.emit(true);
    const obj = {
      advisor_id: this.advisorId,
      clientId: this.clientId,
      reportId: value
    };
    this.custumService.getSaveFilters(obj).subscribe(
      data => {
        if (data) {
          const allClient = [];
          const currentClient = [];
          let transactionView = [];
          const getList = [];
          // let displaycopy =[];
          this.displayedColumns = [];
          this.displayedColumnsTotal = [];
          data.forEach(element => {
            if (element.clientId == 0) {
              const obj = {
                displayName: element.columnName,
                selected: element.selected
              };
              allClient.push(obj);
            } else {
              const obj = {
                displayName: element.columnName,
                selected: element.selected
              };
              getList.push(element);
              currentClient.push(obj);
            }
          });
          if (getList.length > 0) {
            transactionView = currentClient;
          } else {
            transactionView = allClient;
          }
          if (this.reponseData) {
            this.setDefaultFilterData.transactionView.forEach(element => {
              if (element.selected == true) {
                this.displayedColumns.push(element.displayName);
                this.displayedColumnsTotal.push(element.displayName + 'Total');

              }
            });
            if (this.viewMode == 'Unrealized Transactions' || this.viewMode == 'unrealized transactions') {
              this.displayedColumns.forEach((element, ind) => {
                if (this.customDataSource.length > 0) {
                  this.styleObjectUnrealised(element, ind);
                }
              });
            } else {
              this.displayedColumns.forEach((element, ind) => {
                if (this.customDataSource.length > 0) {
                  this.styleObjectTransaction(element, ind);
                }
              });
            }
          } else {
            transactionView.forEach(element => {
              if (element.selected == true) {
                this.displayedColumns.push(element.displayName);
                this.displayedColumnsTotal.push(element.displayName + 'Total');
              }
            });
          }

          this.saveFilterData = {
            transactionView,
            showFolio: (getList.length > 0) ? ((getList[0].showZeroFolios == true) ? '1' : '2') : (data[0].showZeroFolios == true) ? '1' : '2',
            reportType: (getList.length > 0) ? (getList[0].reportType) : data[0].reportType,
            selectFilter: (getList.length > 0) ? this.clientId : 0
          };
          this.mfData = this.mfGetData;
          if (this.viewMode == 'Unrealized Transactions' && this.mfGetData != '') {
            this.isLoading = true;
            this.getUnrealizedData();
          } else if (this.viewMode != 'Unrealized Transactions' && this.mfGetData != '') {
            this.isLoading = true;
            this.changeInput.emit(true);
            this.getMutualFundResponse(this.mfGetData);
          } else if (this.viewMode != 'Unrealized Transactions' && this.mutualFund) {
            this.isLoading = true;
            this.changeInput.emit(true);
            this.getMutualFundResponse(this.mutualFund);
          } else {
            this.getMutualFund();
          }
        }
        const type = (this.reponseData) ? (this.setDefaultFilterData.reportType) : ((this.saveFilterData) ? (this.saveFilterData.reportType) : this.setDefaultFilterData.reportType);
        this.columnHeader = (type == 'Sub Category wise') ? 'Sub Category Name' : (type == 'Category wise') ? 'Category Name	' : (type == 'Investor wise') ? 'Family Member Name' : (type == 'Scheme wise') ? 'Scheme Name' : 'Sub Category wise';
      },
      (error) => {
        if (this.reponseData) {

          this.displayedColumns = [];
          this.displayedColumnsTotal = [];
          this.setDefaultFilterData.transactionView.forEach(element => {
            if (element.selected == true) {
              this.displayedColumns.push(element.displayName);
              this.displayedColumnsTotal.push(element.displayName + 'Total');

            }
          });
        } else {
          this.setDefaultFilterData.transactionView = [];
          this.displayedColumns.forEach(element => {
            const obj = {
              displayName: element,
              selected: true
            };
            this.setDefaultFilterData.transactionView.push(obj);
          });
        }

        this.mfData = this.mfGetData;
        if (this.viewMode == 'Unrealized Transactions' && this.mfGetData != '') {
          this.isLoading = true;
          this.getUnrealizedData();
        } else if (this.viewMode != 'Unrealized Transactions' && this.mfGetData != '') {
          this.isLoading = true;
          this.changeInput.emit(true);
          this.getMutualFundResponse(this.mfGetData);
        } else if (this.viewMode != 'Unrealized Transactions' && this.mutualFund) {
          this.isLoading = true;
          this.changeInput.emit(true);
          this.getMutualFundResponse(this.mutualFund);
        } else {
          this.getMutualFund();
        }
        const type = (this.reponseData) ? (this.setDefaultFilterData.reportType) : ((this.saveFilterData) ? (this.saveFilterData.reportType) : this.setDefaultFilterData.reportType);
        this.columnHeader = (type == 'Sub Category wise') ? 'Sub Category Name' : (type == 'Category wise') ? 'Category Name	' : (type == 'Investor wise') ? 'Family Member Name' : (type == 'Scheme wise') ? 'Scheme Name' : 'Sub Category wise';
      }
    );

  }

  styleObjectTransaction(header, ind) {

    if (header == 'no') {
      this.customDataSource.data.arrayTran.push({
        name: 'Sr no.', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { no: true });
    } else if (header == 'transactionType') {
      this.customDataSource.data.arrayTran.push({
        name: 'Transaction type', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { transactionType: true });
    } else if (header == 'transactionDate') {
      this.customDataSource.data.arrayTran.push({
        name: 'Transaction date', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { transactionDate: true });
    } else if (header == 'transactionAmount') {
      this.customDataSource.data.arrayTran.push({
        name: 'Transaction amount', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { transactionAmount: true });
    } else if (header == 'transactionNav') {
      this.customDataSource.data.arrayTran.push({
        name: 'Transaction NAV', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { transactionNav: true });
    } else if (header == 'units') {
      this.customDataSource.data.arrayTran.push({
        name: 'Units', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { units: true });
    } else if (header == 'balanceUnits') {
      this.customDataSource.data.arrayTran.push({
        name: 'Balance units', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { balanceUnits: true });
    } else if (header == 'days') {
      this.customDataSource.data.arrayTran.push({
        name: 'Days', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { days: true });
    }


  }

  styleObjectUnrealised(header, ind) {
    if (header == 'no') {
      this.customDataSource.data.arrayUnrealised.push({
        name: 'Sr no.', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { no: true });
    } else if (header == 'transactionType') {
      this.customDataSource.data.arrayUnrealised.push({
        name: 'Transaction type', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { transactionType: true });
    } else if (header == 'transactionDate') {
      this.customDataSource.data.arrayUnrealised.push({
        name: 'Transaction date', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { transactionDate: true });
    } else if (header == 'transactionAmount') {
      this.customDataSource.data.arrayUnrealised.push({
        name: 'Transaction amount', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { transactionAmount: true });
    } else if (header == 'transactionNav') {
      this.customDataSource.data.arrayUnrealised.push({
        name: 'Transaction NAV', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { transactionNav: true });
    } else if (header == 'currentValue') {
      this.customDataSource.data.arrayUnrealised.push({
        name: 'Units', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { currentValue: true });
    } else if (header == 'dividendPayout') {
      this.customDataSource.data.arrayUnrealised.push({
        name: 'Current value', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { dividendPayout: true });
    } else if (header == 'dividendReinvest') {
      this.customDataSource.data.arrayUnrealised.push({
        name: 'Dividend payout', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { dividendReinvest: true });
    } else if (header == 'totalAmount') {
      this.customDataSource.data.arrayUnrealised.push({
        name: 'Dividend reinvestment', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { totalAmount: true });
    } else if (header == 'units') {
      this.customDataSource.data.arrayUnrealised.push({
        name: 'Total amount', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { units: true });
    } else if (header == 'gain') {
      this.customDataSource.data.arrayUnrealised.push({
        name: 'Gain', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { gain: true });
    } else if (header == 'absReturn') {
      this.customDataSource.data.arrayUnrealised.push({
        name: 'Absolute return', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { absReturn: true });
    } else if (header == 'xirr') {
      this.customDataSource.data.arrayUnrealised.push({
        name: 'XIRR', index: ind, isCheked: true,
      });
      // Object.assign(this.customDataSource.data, { xirr: true });
    }
  }

  initValueOnInit() {

    if (this.mutualFund.mutualFundList.length > 0) {
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
    } else {
      this.isLoading = false;
      this.changeInput.emit(false);
      // this.customDataSource.data = [];
      // this.unrealisedData = new TableVirtualScrollDataSource([]);
      this.setUnrealizedDataSource([]);

      this.customDataSource.data = [];
      this.customDataHolder = [];
      // this.changeDetectorRef.detectChanges();
    }
  }

  setUnrealizedDataSource(dataArray) {
    this.unrealisedArray = dataArray;
    if (this.unrealisedData) {
      this.unrealisedData.allData = this.unrealisedArray;
    }
  }

  getMutualFund() {
    this.isLoading = true;
    // this.unrealisedData = new TableVirtualScrollDataSource([]);
    // this.setUnrealizedDataSource([]);
    this.customDataSource = [];
    this.dataSource = new MatTableDataSource([{}, {}, {}]);

    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      showFolio: (this.reponseData) ? (this.setDefaultFilterData.showFolio == '2' ? false : true) : (this.saveFilterData) ? (this.saveFilterData.showFolio == '2' ? false : true) : false
    };
    this.custumService.getMutualFund(obj).pipe(map((data) => {
      return this.doFiltering(data);
    })).subscribe(
      data => {
        const cashFlow = data;
        if (cashFlow.mutualFundCategoryMastersList.length > 0) {
          this.cashFlowXirr = cashFlow.mutualFundCategoryMastersList[0].cashFlowxirr;
        }
        this.getMutualFundResponse(data);
        this.cashFlowObj = {
          cashFlowInvestment: this.mfData.total_cashflow_amount_inv,
          cashFlowSwitchIn: this.mfData.total_cashflow_switch_in,
          cashFlowSwitchOut: this.mfData.total_cashflow_switch_out,
          cashFlowRedemption: this.mfData.total_cashflow_redemption,
          cashFlowDividendPayout: this.mfData.total_cashflow_dividend_payout,
          cashFlowNetInvestment: this.mfData.total_cashflow_net_investment,
          cashFlowMarketValue: this.mfData.total_cashflow_current_value,
          cashFlowNetGain: this.mfData.total_cashflow_net_gain,
          cashFlowLifetimeXirr: this.cashFlowXirr,
        };
        this.mfService.setCashFlowXirr(this.cashFlowObj);
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
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
    }
    return data;

    // data.subCategoryData = this.mfService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    // data.schemeWise = this.mfService.filter(data.subCategoryData, 'mutualFundSchemeMaster');
    // data.mutualFundList = this.mfService.filter(data.schemeWise, 'mutualFund');
    // return data;
  }

  getMutualFundResponse(data) {
    if (data) {
      this.mfData = data;
      // this.mutualFund = data;
      if (this.addedData) {
        this.mutualFund = this.mfData;
        this.getTransactionTypeData();
        this.setDefaultFilterData = this.mfService.setFilterData(this.mutualFund, this.rightFilterData, this.displayedColumns);

        this.mfService.setDataForMfGet(this.mfData);
        if (this.isBulkEmailing && this.viewMode == 'All Transactions') {
          //  this.filterForBulkEmailing(data.mutualFundList);
          this.getUnrealizedData();
        } else {
          this.getUnrealizedData();
        }
        this.mfService.setMfData(this.mfData);
        this.mfService.setFilterValues(this.setDefaultFilterData);
      }
      this.addedData = false;
      this.mfService.changeShowMutualFundDropDown(false);
      this.mutualFundList = this.mutualFund.mutualFundList;
      // this.asyncFilter(this.mutualFundList);
      if (!this.isBulkEmailing) {
        this.mfData.mutualFundList.forEach(element => {
          element.ownerName = this.mfService.convertInTitleCase(element.ownerName);
        });
        this.asyncFilter(this.mfData.mutualFundList);
      }

      // this.initValueOnInit();
      // if (this.mfData) {
      //   this.mfData.advisorData = this.mfService.getPersonalDetails(this.advisorId);
      // }
    }
  }

  filterForBulkEmailing(data) {
    if (data) {
      const categoryWiseMfList = [];
      data.forEach(element => {
        categoryWiseMfList.push(element.id);
      });
      const obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        toDate: this.toDate,
        id: categoryWiseMfList,
        showFolio: (this.reponseData) ? (this.setDefaultFilterData.showFolio == '2' ? false : true) : (this.saveFilterData) ? (this.saveFilterData.showFolio == '2' ? false : true) : false

      };
      this.custumService.getMutualFund(obj).subscribe(
        data => {
          console.log(data);
          const response = this.mfService.doFiltering(data);
            // response.mutualFundList.forEach(element => {
            //   element.mutualFundTransactions = element.mutualFundTransactions.filter(item =>  this.datePipe.transform(item.transactionDate, 'yyyy-MM-dd') >= this.fromDate && this.datePipe.transform(item.transactionDate, 'yyyy-MM-dd') <= this.toDate);
            // });
          Object.assign(response.mutualFundList, {flag: true});
          response.mutualFundList.forEach(element => {
            element.ownerName = this.mfService.convertInTitleCase(element.ownerName);
          });
          this.asyncFilter(response.mutualFundList);
        }
      );
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

  // ngOnChanges(changes: SimpleChanges) {

  //   for (const propName in changes) {
  //     const chng = changes[propName];
  //     const cur = JSON.stringify(chng.currentValue);
  //     const prev = JSON.stringify(chng.previousValue);
  //     // console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
  //   }
  //   if (changes.mutualFund && !!changes.mutualFund.currentValue) {
  //     if (this.mutualFund.mutualFundList.length > 0) {
  //       if (this.mutualFund.viewMode == 'Unrealized Transactions') {
  //         this.getUnrealizedData();
  //       } else {
  //         this.mutualFundList = this.mutualFund.mutualFundList;
  //         this.asyncFilter(this.mutualFundList);
  //       }
  //     } else {
  //       this.dataSource.data = [];
  //       this.customDataSource.data = [];
  //     }

  //   }
  // }

  getUnrealizedData() {
    const myArray = (this.mfGetData) ? this.mfGetData.mutualFundList : this.mutualFund.mutualFundList;
    const list = [];
    myArray.forEach(val => list.push(Object.assign({}, val)));
    // let list =[];
    // list =(this.mfGetData) ? this.mfGetData.mutualFundList : this.mutualFund.mutualFundList;
    list.forEach(element => {
      element.navDate = new Date(element.navDate);
      if (element.toDate) {
        element.toDate = new Date(element.toDate);
      }
      element.mutualFundTransactions = [];
      // element.mutualFundTransactions.forEach(element => {
      //   element.transactionDate =
      // });
    });
    const obj = {
      mutualFundList: list
    };
    this.custumService.getMfUnrealizedTransactions(obj).subscribe(
      data => {
        // console.log(data);
        // this.mutualFund.mutualFundList = data;
        // this.asyncFilter(this.mutualFund.mutualFundList);
        if (this.isBulkEmailing) {
          // this.filterForBulkEmailing(data);
          if(this.fromDate && this.toDate){
            data.forEach(element => {
            element.mutualFundTransactions = element.mutualFundTransactions.filter(item =>  this.datePipe.transform(item.transactionDate, 'yyyy/MM/dd') >= this.fromDate && this.datePipe.transform(item.transactionDate, 'yyyy-MM-dd') <= this.toDate);
          });
        }
          this.asyncFilter(data);
        } else {
          this.asyncFilter(data);
        }

      }, (error) => {
        this.isLoading = false;
        this.dataSource.data = [];
        // this.customDataSource.data = [];
        // this.unrealisedData = new TableVirtualScrollDataSource([]);
        this.setUnrealizedDataSource([]);
        this.customDataSource = [];
        this.customDataHolder = [];
        this.eventService.showErrorMessage(error);
        this.changeInput.emit(false);
        // this.changeDetectorRef.detectChanges();
      }
    );
  }


  asyncFilter(mutualFund) {
    if (typeof Worker !== 'undefined') {
      // console.log(`13091830918239182390183091830912830918310938109381093809328`);
      this.rightFilterData.reportType = [];
      this.rightFilterData.reportType[0] = {
        name: (this.reponseData) ? this.setDefaultFilterData.reportType : ((this.saveFilterData) ? this.saveFilterData.reportType : this.setDefaultFilterData.reportType),
        selected: true,
      };
      if (this.isRouterLink) {
        this.setDefaultFilterData.showFolio = '2';
      }
      const input = {
        mutualFundList: mutualFund,
        type: (this.rightFilterData.reportType) ? this.rightFilterData.reportType : '',
        // nav: this.mutualFund.nav,
        // mutualFund:this.mfData,
        mutualFund: (this.reponseData) ? this.reponseData : this.mutualFund,
        transactionType: this.rightFilterData.transactionType,
        viewMode: this.viewMode,
        showFolio: (this.reponseData) ? this.setDefaultFilterData.showFolio : ((this.saveFilterData) ? this.saveFilterData.showFolio : this.setDefaultFilterData.showFolio),
        // mfService: this.mfService
      };
      // Create a new
      const worker = new Worker('./mutual-fund-unrealized.worker.ts', {type: 'module'});
      worker.onmessage = ({data}) => {
        console.log('startTime ', new Date());
        console.log('worker output : ', data);
        this.grandTotal = data.totalValue;
        this.dataTransaction.dataSource = data.dataSourceData;
        // this.customDataSource.data = (data.customDataSourceData);
        this.customDataSource = [];
        this.customDataSource.data = [];
        // this.unrealisedData = new TableVirtualScrollDataSource(data.customDataSourceData);
        // this.unrealisedData.allData = data.customDataSourceData;
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
        if (!isNaN(this.mfData.total_current_value) && !isNaN(this.mfData.total_amount_invested) && !isNaN(this.mfData.total_unrealized_gain) && !isNaN(this.mfData.total_unrealized_gain)) {
          this.mfData.total_current_value = this.mfService.mutualFundRoundAndFormat(this.mfData.total_current_value, 0);
          this.mfData.total_amount_invested = this.mfService.mutualFundRoundAndFormat(this.mfData.total_amount_invested, 0);
          this.mfData.total_unrealized_gain = this.mfService.mutualFundRoundAndFormat(this.mfData.total_unrealized_gain, 0);
          this.mfData.total_absolute_return = this.mfService.mutualFundRoundAndFormat(this.mfData.total_absolute_return, 2);
        }
        this.setUnrealizedDataSource(data.customDataSourceData);
        this.dataSource.data = (data.dataSourceData);
        this.isLoading = false;
        this.mfService.setTransactionData(this.dataTransaction);
        if (this.viewMode == 'All Transactions' || this.viewMode == 'all transactions') {
          this.displayedColumns.forEach((element, ind) => {
            this.styleObjectTransaction(element, ind);
          });
        } else {
          this.displayedColumns.forEach((element, ind) => {
            this.styleObjectUnrealised(element, ind);
          });
        }
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

          }
        });
        this.customDataSource.data.arrayUnrealised.forEach(element => {
          switch (element.index) {
            case 0:
              this.firstArray = this.filterHedaerWise(element);
              this.firstArrayTotal = this.filterHedaerWiseTotal(element);

              break;
            case 1:
              this.secondArray = this.filterHedaerWise(element);
              this.secondArrayTotal = this.filterHedaerWiseTotal(element);

              break;
            case 2:
              this.thirdArray = this.filterHedaerWise(element);
              this.thirdArrayTotal = this.filterHedaerWiseTotal(element);

              break;
            case 3:
              this.fourthArray = this.filterHedaerWise(element);
              this.fourthArrayTotal = this.filterHedaerWiseTotal(element);

              break;
            case 4:
              this.fifthArray = this.filterHedaerWise(element);
              this.fifthArrayTotal = this.filterHedaerWiseTotal(element);

              break;
            case 5:
              this.SixthArray = this.filterHedaerWise(element);
              this.SixthArrayTotal = this.filterHedaerWiseTotal(element);

              break;
            case 6:
              this.seventhArray = this.filterHedaerWise(element);
              this.seventhArrayTotal = this.filterHedaerWiseTotal(element);

              break;
            case 7:
              this.eighthArray = this.filterHedaerWise(element);
              this.eighthArrayTotal = this.filterHedaerWiseTotal(element);


              break;
            case 8:
              this.ninethArray = this.filterHedaerWise(element);
              this.ninethArrayTotal = this.filterHedaerWiseTotal(element);


              break;
            case 9:
              this.tenthArray = this.filterHedaerWise(element);
              this.tenthArrayTotal = this.filterHedaerWiseTotal(element);


              break;
            case 10:
              this.eleventhArray = this.filterHedaerWise(element);
              this.eleventhArrayTotal = this.filterHedaerWiseTotal(element);


              break;
            case 11:
              this.twelwthArray = this.filterHedaerWise(element);
              this.twelwthArrayTotal = this.filterHedaerWiseTotal(element);


              break;
            case 12:
              this.thirteenthArray = this.filterHedaerWise(element);
              this.thirteenthArrayTotal = this.filterHedaerWiseTotal(element);


              break;

          }
        });
        // this.setUnrealizedDataSource(this.customDataSource.data);

        // console.log(`MUTUALFUND COMPONENT page got message:`, data);
        if (mutualFund.flag == true) {
          this.dataTransaction.flag = true;
        }
        if (this.route.url.split('?')[0] == '/pdf/allTransactions' && this.isLoading == false) {
          this.showDownload = true;
          this.generatePdfBulk();
        }
        if (this.route.url.split('?')[0] == '/pdf/unrealisedTransactions' && this.isLoading == false) {
          this.showDownload = true;
          this.generatePdfBulk();
        }
        this.changeInput.emit(false);
        // this.changeDetectorRef.detectChanges();
      };
      worker.postMessage(input);
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  Excel(tableTitle) {
    this.showDownload = true;
    setTimeout(() => {
      const blob = new Blob([document.getElementById('template').innerHTML], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      });
      saveAs(blob, tableTitle + '.xls');
    }, 200);
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
      data: {family_member_list: ['family_member_list'], flag, ...sendData, ...this.selectedLoadData},
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

  deleteModal(value, element) {
    this.mfData.mutualFundList.forEach(ele => {
      ele.mutualFundTransactions.forEach(tran => {
        if (tran.id == element.id) {
          this.selectedLoadData = ele;
        }
      });
    });
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        let requestJsonObj;
        const data = {
          id: element.id,
          unit: element.unit,
          effect: element.effect,
          mutualFundId: this.selectedLoadData.id
        };
        requestJsonObj = {
          freezeDate: element.freezeDate ? element.freezeDate : null,
          mutualFundTransactions: [data]
        };
        dialogRef.close();
        this.custumService.postDeleteTransactionMutualFund(requestJsonObj)
          .subscribe(res => {
            if (res) {
              this.isLoading = true;
              this.eventService.openSnackBar('Deleted Successfully', 'Dismiss');
              if (res) {
                this.addedData = true;
                this.mfService.setDataForMfGet('');
                this.mfService.setMfData('');
                this.mfService.setTransactionType('');
                this.ngOnInit();
                // this.getMutualFund();
                console.log('again re hitting mutual fund get:::', res);
              }
            }
          });


      },
      negativeMethod: () => {
        // console.log('2222222222222222222222222222222222222');
      }
    };
    // console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
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
    // fragmentData.data = {
    //   name: (this.viewMode == 'Unrealized Transactions') ? 'UNREALIZED TRANSACTION REPORT' : 'ALL TRANSACTION REPORT',
    //   mfData: this.mutualFund,
    //   folioWise: this.mutualFund.mutualFundList,
    //   schemeWise: this.mutualFund.schemeWise,
    //   familyMember: this.mutualFund.family_member_list,
    //   category: this.mutualFund.mutualFundCategoryMastersList,
    //   transactionView: this.displayedColumns,
    //   fromDate:this.setDefaultFilterData.fromDate,
    //   toDate:this.setDefaultFilterData.toDate,
    //   reportType :this.setDefaultFilterData.reportType,
    //   showFolio :this.setDefaultFilterData.showFolio
    // };
    fragmentData.data = {
      name: (this.viewMode == 'Unrealized Transactions') ? 'UNREALIZED TRANSACTION REPORT' : 'ALL TRANSACTION REPORT',
      mfData: this.mutualFund,
      folioWise: this.setDefaultFilterData.folioWise,
      schemeWise: this.setDefaultFilterData.schemeWise,
      familyMember: this.mutualFund.family_member_list,
      category: this.setDefaultFilterData.category,
      transactionView: (this.reponseData) ? this.setDefaultFilterData.transactionView : ((this.saveFilterData) ? this.saveFilterData.transactionView : this.setDefaultFilterData.transactionView),
      scheme: this.setDefaultFilterData.scheme,
      reportType: (this.reponseData) ? this.setDefaultFilterData.reportType : ((this.saveFilterData) ? this.saveFilterData.reportType : this.setDefaultFilterData.reportType),
      // reportType: (this.saveFilterData) ? this.saveFilterData.reportType : this.setDefaultFilterData.reportType,
      reportAsOn: this.setDefaultFilterData.reportAsOn,
      showFolio: (this.reponseData) ? this.setDefaultFilterData.showFolio : ((this.saveFilterData) ? this.saveFilterData.showFolio : this.setDefaultFilterData.showFolio),
      fromDate: this.setDefaultFilterData.fromDate,
      toDate: this.setDefaultFilterData.toDate,
      transactionPeriod: this.setDefaultFilterData.transactionPeriod,
      transactionPeriodCheck: this.setDefaultFilterData.transactionPeriodCheck,
      selectFilter: (this.saveFilterData) ? this.saveFilterData.selectFilter : null,
      transactionTypeList: (this.rightFilterData.transactionType) ? this.rightFilterData.transactionType : this.transactionTypeList,
      // setTrueKey: this.setDefaultFilterData.setTrueKey ? this.setDefaultFilterData.setTrueKey : false ,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        // console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          // console.log('this is sidebardata in subs subs 2: ', sideBarData);
          if (sideBarData.data && sideBarData.data != 'Close') {
            this.dataSource.data = ([{}, {}, {}]);
            // this.customDataSource.data = ([{}, {}, {}]);
            this.customDataSource = [];
            // this.unrealisedData = new TableVirtualScrollDataSource([]);
            this.setUnrealizedDataSource([]);
            this.isLoading = true;
            this.changeInput.emit(true);
            this.rightFilterData = sideBarData.data;
            // this.setTrueKey = this.rightFilterData.setTrueKey;
            this.saveFilterData = {};
            // this.columns =[];
            // this.rightFilterData.transactionView.forEach(element => {
            //   if(element.selected == true){
            //     this.columns.push(element.displayName)
            //   }
            // });
            // this.displayedColumns =[];
            // this.displayedColumns = this.columns;
            // this.displayColArray=[];
            // this.rightFilterData.transactionView.forEach(element => {
            //   const obj = {
            //     displayName: element.displayName,
            //     selected:true
            //   };
            //   this.displayColArray.push(obj);
            // });
            // this.type = this.rightFilterData.reportType[0];
            if (this.rightFilterData.mfData) {
              this.reponseData = this.doFiltering(this.rightFilterData.mfData);
            }
            if(this.rightFilterData.transactionPeriodCheck){
              if(this.viewMode == 'Unrealized Transactions'){
                this.reponseData.mutualFundList.forEach(element => {
                  element.mutualFundTransactions = element.mutualFundTransactions.filter(item => this.datePipe.transform(item.transactionDate, 'yyyy-MM-dd') <= this.rightFilterData.toDate);
                });
              }else{
                this.reponseData.mutualFundList.forEach(element => {
                  element.mutualFundTransactions = element.mutualFundTransactions.filter(item =>  this.datePipe.transform(item.transactionDate, 'yyyy-MM-dd') >= this.rightFilterData.fromDate && this.datePipe.transform(item.transactionDate, 'yyyy-MM-dd') <= this.rightFilterData.toDate);
                });
              }
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
            this.setDefaultFilterData = this.mfService.setFilterData(this.mutualFund, this.rightFilterData, this.displayColArray);
            // this.asyncFilter(this.reponseData.mutualFundList);
            this.mfService.setFilterValues(this.setDefaultFilterData);
            this.mfService.setDataForMfGet(this.rightFilterData.mfData);
            this.reportDate = this.datePipe.transform(new Date(this.rightFilterData.toDate), 'dd-MMM-yyyy');
            this.dataTransaction.setDefaultFilterData = this.setDefaultFilterData;
            this.dataTransaction.rightFilterData = this.rightFilterData.mfData;
            this.getFilterData((this.viewMode == 'Unrealized Transactions') ? 4 : 3);
            // this.dataSource.data = this.getCategory(this.rightFilterData.mutualFundList,
            // this.rightFilterData.reportType, this.mfService);
            // this.customDataSource.data = this.subCatArray(this.rightFilterData.mutualFundList,
            // this.rightFilterData.reportType, this.mfService);
            // this.changeDetectorRef.detectChanges();
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
  //   return item.schemeName;
  //   return item.nav;
  // }

  isGroup3 = (index, item) => item.name; // for grouping family member name
  //   return item.name;
  //   return item.pan;
  //   return item.folio;
  // }

  isGroup4 = (index, item) => item.total; // for getting total of each scheme
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
    this.showDownload = true;
    this.fragmentData.isSpinner = true;
    setTimeout(() => {
      const para = document.getElementById('template');
      if (this.viewMode == 'Unrealized Transactions') {
        this.headerHtml = document.getElementById('templateHeader');
      } else {
        this.headerHtml = document.getElementById('alltemplateHeader');
      }
      this.returnValue = this.utilService.htmlToPdf(this.headerHtml.innerHTML, para.innerHTML, this.viewMode, 'true', this.fragmentData, '', '');
    }, 200);


    // if(data){
    //   this.isSpinner = false;
    // }
  }

  filterHedaerWise(data) {
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
      case 'Current value':
        obj = 'currentAmount';
        break;
      case 'Dividend payout':
        obj = 'dividendPayout';
        break;
      case 'Dividend reinvestment':
        obj = 'dividendReinvest';
        break;
      case 'Total amount':
        obj = 'currentAmount';
        break;
      case 'Gain':
        obj = 'gain';
        break;
      case 'Absolute return':
        obj = 'absoluteReturn';
        break;
      case 'XIRR':
        obj = 'cagr';
        break;
    }

    return obj;
  }

  filterHedaerWiseTotal(data) {
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
      case 'Current value':
        obj = 'totalCurrentValue';
        break;
      case 'Dividend payout':
        obj = 'dividendPayout';
        break;
      case 'Dividend reinvestment':
        obj = 'dividendReinvest';
        break;
      case 'Total amount':
        obj = 'totalCurrentValue';
        break;
      case 'Gain':
        obj = 'netGain';
        break;
      case 'Absolute return':
        obj = 'trnAbsoluteReturn';
        break;
      case 'XIRR':
        obj = 'totalCagr';
        break;
    }

    return obj;
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
    // if (value == 'amountInvested' || value == 'currentValue' || value == 'unrealizedGain' || value == 'dividendPayout' || value == 'switchOut' || value == 'sipAmount' || value == 'totalAmountInvested' || value == 'totalCurrentValue' || value == 'totalUnrealizedGain' || value == 'totalDividendPayout' || value == 'totalSwitchOut' || value == 'totalSipAmount' || value == 'sip' || value == 'total_amount_invested' || value == 'total_current_value' || value == "total_unrealized_gain" || value == "total_dividend_payout" || value === 'withdrawals') {
    //   number = this.mfService.mutualFundRoundAndFormat(data, 0);
    // } else if (value == 'transactionDate') {
    //   number = this.datePipe.transform(data, 'dd/MM/yyyy')
    // } else {
    //   number = this.mfService.mutualFundRoundAndFormat(data, 3);
    // }

    return number;
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
    // if (value == 'amount' || value == 'currentValue' || value == 'unrealizedGain' || value == 'dividendPayout' || value == 'switchOut' || value == 'sipAmount' || value == 'totalAmountInvested' || value == 'totalCurrentValue' || value == 'totalUnrealizedGain' || value == 'totalDividendPayout' || value == 'totalSwitchOut' || value == 'totalSipAmount' || value == 'sip' || value == 'total_amount_invested' || value == 'total_current_value' || value == "total_unrealized_gain" || value == "total_dividend_payout" || value === 'withdrawals') {
    //   number = this.mfService.mutualFundRoundAndFormat(data, 0);
    // } else if (value == 'transactionDate') {
    //   number = this.datePipe.transform(data, 'dd/MM/yyyy')
    // } else {
    //   number = this.mfService.mutualFundRoundAndFormat(data, 3);
    // }

    return number;
  }

  generatePdfBulk() {
    setTimeout(() => {
      const date = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
      const para = this.unrealizedTranTemplate.nativeElement.innerHTML;
      if (this.viewMode == 'Unrealized Transactions') {
        this.header = this.unrealizedTranTemplateHeader.nativeElement.innerHTML;
      } else {
        this.header = this.allTranTemplateHeader.nativeElement.innerHTML;
      }
      const obj = {
        htmlInput: para,
        header: this.header,
        name: (this.clientData.name) ? this.clientData.name : '' + 's' + this.mode + date,
        landscape: true,
        key: 'showPieChart',
        clientId: this.clientId,
        advisorId: this.advisorId,
        fromEmail: this.clientDetails.advisorData.email,
        toEmail: this.clientData.email
        // fromEmail: 'devshyni@futurewise.co.in',
        // toEmail: 'devshyni@futurewise.co.in'
      };
      this.utilService.bulkHtmlToPdf(obj);
      // this.utilService.htmlToPdf(para, 'transaction', true, this.fragmentData, '', '')
    }, 200);
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
