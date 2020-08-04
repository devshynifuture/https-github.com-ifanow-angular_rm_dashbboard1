import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {FolioMasterDetailsComponent} from 'src/app/component/protect-component/customers/component/common-component/folio-master-details/folio-master-details.component';
import {SipDetailsComponent} from 'src/app/component/protect-component/customers/component/common-component/sip-details/sip-details.component';
import {AddMutualFundComponent} from '../add-mutual-fund/add-mutual-fund.component';
import {MFSchemeLevelHoldingsComponent} from '../mfscheme-level-holdings/mfscheme-level-holdings.component';
import {MFSchemeLevelTransactionsComponent} from '../mfscheme-level-transactions/mfscheme-level-transactions.component';
import {MfServiceService} from '../../mf-service.service';
import {ExcelGenService} from 'src/app/services/excel-gen.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
// import {WebworkerService} from '../../../../../../../../../../services/web-worker.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {UpperCustomerComponent} from 'src/app/component/protect-component/customers/component/common-component/upper-customer/upper-customer.component';
import {EventService} from 'src/app/Data-service/event.service';
import {CustomerService} from '../../../../../customer.service';
import {AuthService} from 'src/app/auth-service/authService';
import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {RightFilterDuplicateComponent} from 'src/app/component/protect-component/customers/component/common-component/right-filter-duplicate/right-filter-duplicate.component';
import {BackOfficeService} from 'src/app/component/protect-component/AdviserComponent/backOffice/back-office.service';
import {DatePipe} from '@angular/common';
import {OnlineTransactionComponent} from 'src/app/component/protect-component/AdviserComponent/transactions/overview-transactions/doTransaction/online-transaction/online-transaction.component';
import {OnlineTransactionService} from 'src/app/component/protect-component/AdviserComponent/transactions/online-transaction.service';


@Component({
  selector: 'app-mutual-fund-summary',
  templateUrl: './mutual-fund-summary.component.html',
  styleUrls: ['./mutual-fund-summary.component.scss']
})
export class MutualFundSummaryComponent implements OnInit {

  displayedColumns = ['schemeName', 'amountInvested', 'currentValue', 'unrealizedProfit', 'absoluteReturn',
    'xirr', 'dividendPayout', 'switchOut', 'balanceUnit', 'navDate', 'sipAmount', 'icons'];
  mfData: any;
  grandTotal: any = {};
  // subCategoryData: any[];
  // schemeWise: any[];
  mutualFundList: any[];
  rightFilterData: any = { reportType: '' };
  totalObj: any;
  summary = new MatTableDataSource([{}, {}, {}]);
  catObj: {};
  isLoading = false; // added for prod build
  displayColumnsPDf: any;
  fragmentData = { isSpinner: false };
  advisorData: any;
  userInfo = AuthService.getUserInfo();
  clientData = AuthService.getClientData();
  details = AuthService.getProfileDetails();
  getOrgData = AuthService.getOrgDetails();
  // schemeWiseForFilter: any[];
  // mutualFundListFilter: any[];
  @ViewChild('tableEl', { static: false }) tableEl;
  @Output() changeInput = new EventEmitter();
  @Output() getCountData = new EventEmitter();
  viewMode: string;
  reponseData: any;
  setDefaultFilterData: any;

  inputData: any;
  mfGetData: string;
  displayColArray = [];
  resData: any;
  columns = [];
  saveFilterData: any;
  savedFilterData: any;
  returnValue: any;
  selectedDataLoad: any;
  showDownload: boolean = false;
  reportDate: Date;
  customDataSource: any;

  addedData: boolean;
  dataSummary: any;
  getObj: any;
  advisorId: number;
  clientId: any;
  clientDetails: any;
  noSubBroker: boolean = false;
  noMapping: boolean;
  isAdvisorSection: boolean;
  isClient: boolean;
  toDate: any;
  isBulkEmailing: boolean = false;


  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data ', data);
  }
  get data() {
    return this.inputData;
  }

  constructor(
    private subInjectService: SubscriptionInject,
    private utilService: UtilService,
    private mfService: MfServiceService,
    private excel: ExcelGenService,
    private backOfficeService: BackOfficeService,
    // private workerService: WebworkerService,
    public dialog: MatDialog,
    public eventService: EventService,
    private customerService: CustomerService,
    private router: Router,
    private datePipe: DatePipe,
    public routerActive: ActivatedRoute,
    private onlineTransact: OnlineTransactionService,
    private activatedRoute: ActivatedRoute) {
    this.routerActive.queryParamMap.subscribe((queryParamMap) => {
      if (queryParamMap.has('clientId')) {
        let param1 = queryParamMap['params'];
        this.clientId = parseInt(param1.clientId)
        this.advisorId = parseInt(param1.advisorId)
        //this.setDefaultFilterData.toDate = param1.toDate;
        this.toDate = param1.toDate;
        this.toDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
        console.log('2423425', param1)
      }
      else {
        this.advisorId = AuthService.getAdvisorId();
        this.clientId = AuthService.getClientId() !== undefined ? AuthService.getClientId() : -1;
        this.isClient = AuthService.getUserInfo().clientId ? true : false;
      }
    });
  }

  mutualFund;
  @ViewChild('summaryTemplate', { static: false }) summaryTemplate: ElementRef;
  uploadData(data) {
    if (data) {
      this.clientId = data.clientId
      this.addedData = true;
      this.initPoint();
    }
    return this.dataSummary
  }

  ngOnInit() {
    this.initPoint();
  }

  initPoint() {
    if (localStorage.getItem('token') != 'authTokenInLoginComponnennt') {
      localStorage.setItem('token', 'authTokenInLoginComponnennt')
    }

    this.routerActive.queryParamMap.subscribe((queryParamMap) => {
      if (queryParamMap.has('clientId')) {
        let param1 = queryParamMap['params'];
        this.clientId = parseInt(param1.clientId)
        this.advisorId = parseInt(param1.advisorId)
        this.addedData = true;
        console.log('2423425', param1)
        this.isBulkEmailing = true
        this.getDetails()
      }
    });
    this.dataSummary = {}
    this.dataSummary.grandTotal = {}
    this.dataSummary.customDataSourceData = {}
    this.reportDate = new Date()
    console.log('displayedColumns', this.displayedColumns)
    this.mfService.getViewMode()
      .subscribe(res => {
        this.viewMode = res;
      })
    this.getFilterData(2);
    // this.getDefaultDetails(null)
  }
  ngAfterViewInit() {
    //this.showDownload == true
    let para = document.getElementById('template');
    if (para.innerHTML) {
      this.generatePdfBulk()

    }
  }

  orderSOA(element) {
    const data = {
      isClient: this.isClient,
      mutualFundId: element.id,
      userId: AuthService.getUserId()
    }
    console.log("this is what i am ordering for soa", data);

    this.customerService.orderSoaMutualFund(data)
      .subscribe(res => {
        if (res) {
          console.log(res);
          this.eventService.openSnackBar(res, "DISMISS");
        } else {
          this.eventService.openSnackBar("Error Ordering SOA!", "DISMISS");
        }
      })

  }

  getFilterData(value) {
    this.customDataSource = [];
    let transactionView = [];
    this.summary = new MatTableDataSource([{}, {}, {}]);

    this.isLoading = true;
    this.changeInput.emit(true);
    this.mfService.getMfData()
      .subscribe(res => {
        this.mutualFund = res;
      })
    this.mfService.getFilterValues()
      .subscribe(res => {
        this.setDefaultFilterData = res;
      })
    this.mfService.getDataForMfGet()
      .subscribe(res => {
        this.mfGetData = res;
      })
    const obj = {
      advisor_id: this.advisorId,
      clientId: this.clientId,
      reportId: value
    }
    this.customerService.getSaveFilters(obj).subscribe(
      data => {
        console.log("---save filter values---", data);
        if (data) {
          let allClient = [];
          let currentClient = [];
          let getList = [];
          // let displaycopy =[];
          this.displayedColumns = [];
          data.forEach(element => {
            if (element.clientId == 0) {
              const obj = {
                displayName: element.columnName,
                selected: element.selected
              }
              allClient.push(obj);
              // if(element.selected == true){
              //   this.displayedColumns.push(element.columnName)
              // }
            } else {
              const obj = {
                displayName: element.columnName,
                selected: element.selected
              }
              getList.push(element);
              currentClient.push(obj);
              // if(element.selected == true){
              //   this.displayedColumns.push(element.columnName)
              // }
            }
          });
          if (getList.length > 0) {
            transactionView = currentClient
          } else {
            transactionView = allClient
          }
          if (this.reponseData) {
            this.setDefaultFilterData.transactionView.forEach(element => {
              if (element.selected == true) {
                this.displayedColumns.push(element.displayName)
              }
            });
          } else {
            transactionView.forEach(element => {
              if (element.selected == true) {
                this.displayedColumns.push(element.displayName)
              }
            });
          }



          this.saveFilterData = {
            transactionView: transactionView,
            showFolio: (getList.length > 0) ? ((getList[0].showZeroFolios == true) ? '1' : '2') : (data[0].showZeroFolios == true) ? '1' : '2',
            reportType: (getList.length > 0) ? (getList[0].reportType) : data[0].reportType,
            selectFilter: (getList.length > 0) ? this.clientId : 0
          }
          if (this.mfGetData && this.mfGetData != "") {
            this.getMutualFundResponse(this.mfGetData)
          } else if (this.mutualFund) {
            this.getMutualFundResponse(this.mutualFund)
          } else {
            this.getMutualFund();
          }
        }
      },
      (error) => {

        if (this.reponseData) {
          this.displayedColumns = [];
          this.setDefaultFilterData.transactionView.forEach(element => {
            if (element.selected == true) {
              this.displayedColumns.push(element.displayName)
            }
          });
        } else {
          if (this.setDefaultFilterData) {
            this.setDefaultFilterData.transactionView = [];
            this.displayedColumns.forEach(element => {
              const obj = {
                displayName: element,
                selected: true
              }
              this.setDefaultFilterData.transactionView.push(obj)
            });
          }
        }
        if (this.mfGetData && this.mfGetData != "") {
          this.getMutualFundResponse(this.mfGetData)
        } else if (this.mutualFund) {
          this.getMutualFundResponse(this.mutualFund)
        } else {
          this.getMutualFund();
        }
      }


    );

  }
  styleObject(header): Object {

    if (header == 'schemeName') {
      Object.assign(this.customDataSource.data, { schemeName: true });
    } else if (header == 'amountInvested') {
      Object.assign(this.customDataSource.data, { amountInvested: true });
    } else if (header == 'currentValue') {
      Object.assign(this.customDataSource.data, { currentValue: true });
    } else if (header == 'unrealizedProfit') {
      Object.assign(this.customDataSource.data, { unrealizedProfit: true });
    } else if (header == 'absoluteReturn') {
      Object.assign(this.customDataSource.data, { absoluteReturn: true });
    } else if (header == 'xirr') {
      Object.assign(this.customDataSource.data, { xirr: true });
    } else if (header == 'dividendPayout') {
      Object.assign(this.customDataSource.data, { dividendPayout: true });
    } else if (header == 'switchOut') {
      Object.assign(this.customDataSource.data, { switchOut: true });
    } else if (header == 'balanceUnit') {
      Object.assign(this.customDataSource.data, { balanceUnit: true });
    } else if (header == 'navDate') {
      Object.assign(this.customDataSource.data, { navDate: true });
    } else if (header == 'sipAmount') {
      Object.assign(this.customDataSource.data, { sipAmount: true });
    }

    return {}
  }
  calculationOninit() {
    if (this.mutualFund.mutualFundList.length > 0) {
      this.isLoading = true;
      this.changeInput.emit(true);
      if (this.addedData) {
        this.getTransactionTypeData();
        this.mfService.setDataForMfGet(this.mfData);
        this.mfService.setMfData(this.mfData);
        this.setDefaultFilterData = this.mfService.setFilterData(this.mutualFund, this.rightFilterData, this.displayedColumns);
        this.mfService.setFilterValues(this.setDefaultFilterData);
      }
      this.addedData = false;
      // this.mutualFundList = this.mutualFund.mutualFundList;
      this.mutualFundList = this.mfData.mutualFundList;
      this.advisorData = this.mutualFund.advisorData;
      // this.getListForPdf(this.displayedColumns);
      // this.getSubCategoryWise(this.mutualFund); // get subCategoryWise list
      // this.getSchemeWise(); // get scheme wise list
      // this.mfSchemes(); // get mutualFund list
      // for displaying table values as per category
      // this.customDataSource.data = this.subCatArrayForSummary(this.mutualFund.mutualFundList, '', this.mfService);
      // this.getDataForRightFilter();
      // const input = {
      //   mutualFundList: this.mutualFundList,
      //   type: '',
      // mfService: this.mfService
      // };
      this.asyncFilter(this.mutualFundList);
    } else {
      this.isLoading = false;
      this.changeInput.emit(false);
      this.customDataSource.data = [];
      this.summary.data = [];
    }
  }
  getTransactionTypeData() {
    const obj = {
      advisorIds: [this.advisorId],
      clientId: this.clientId,
      parentId: 0

    };
    this.customerService.getTransactionTypeInMF(obj).subscribe(
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
  getMutualFund() {
    this.isLoading = true;
    this.customDataSource.data = [];
    this.summary.data = [{}, {}, {}];
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
    };
    this.customerService.getMutualFund(obj).pipe(map((data) => {
      return this.doFiltering(data);
    })).subscribe(
      data => this.getMutualFundResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }

  doFiltering(data) {
    data.subCategoryData = this.mfService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    data.schemeWise = this.mfService.filter(data.subCategoryData, 'mutualFundSchemeMaster');
    data.mutualFundList = this.mfService.filter(data.schemeWise, 'mutualFund');
    return data;
  }

  getMutualFundResponse(data) {
    if (data) {
      this.getCountData.emit("call");
      this.mfData = data;
      if (this.addedData) {
        this.mutualFund = this.mfData
      }
      if (this.isBulkEmailing == true) {
        this.filterForBulkEmailing(data.mutualFundList);
      }
      // this.mutualFund = data;
      this.mfService.changeShowMutualFundDropDown(false);
      this.calculationOninit();
    } else {
      this.isLoading = false;
    }
  }
  filterForBulkEmailing(data) {
    if (data) {
      let categoryWiseMfList = [];
      data.forEach(element => {
        categoryWiseMfList.push(element.id)
      });
      const obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        toDate: this.toDate,
        id: categoryWiseMfList
      };
      this.customerService.getMutualFund(obj).subscribe(
        data => {
          console.log(data);
          let response = this.mfService.doFiltering(data)
          Object.assign(response.mutualFundList, { flag: true });
          this.asyncFilter(response.mutualFundList);
        }
      );
    }

  }
  getListForPdf(columns) {
    // this.displayColumnsPDf[0].name=(columns[0] = 'schemeName')?this.displayColumnsPDf.push('Scheme name'):null;
    // this.displayColumnsPDf[1].name=(columns[1] = 'amountInvested')?'Amount invested':null;
    // this.displayColumnsPDf[2].name=(columns[2] = 'currentValue')?'Current value':null;
    // this.displayColumnsPDf[3].name=(columns[3] = 'unrealizedProfit')?'Unrealized profit (loss)':null;
    // this.displayColumnsPDf[4].name=(columns[4] = 'absoluteReturn')?'Abs Ret %':null;
    // this.displayColumnsPDf[5].name=(columns[5] = 'xirr')?'XIRR %':null;
    // this.displayColumnsPDf[6].name=(columns[6] = 'dividendPayout')?'Dividend payout':null;
    // this.displayColumnsPDf[7].name=(columns[7] = 'switchOut')?'Withdrawals Switch outs':null;
    // this.displayColumnsPDf[8].name=(columns[8] = 'balanceUnit')?'Balance Unit':null;
    // this.displayColumnsPDf[9].name=(columns[9] = 'navDate')?'NAV Date':null;
    // this.displayColumnsPDf[10].name=(columns[10] = 'sipAmount')?' SIP':null;
    let filterArray = []
    var name;
    columns.forEach(element => {

      if (element == 'schemeName') { name = 'Scheme name' };
      if (element == 'amountInvested') { name = 'Amount invested' };
      if (element == 'currentValue') { name = 'Current value' };
      if (element == 'unrealizedProfit') { name = 'Unrealized profit (loss)' };
      if (element == 'absoluteReturn') { name = 'Abs Ret %' };
      if (element == 'xirr') { name = 'XIRR %' };
      if (element == 'dividendPayout') { name = 'Dividend payout' };
      if (element == 'switchOut') { name = 'Withdrawals Switch outs' };
      if (element == 'balanceUnit') { name = 'Balance Unit' };
      if (element == 'navDate') { name = 'NAV Date' };
      if (element == 'sipAmount') { name = 'SIP' };

      const obj = {
        name: name
      }
      filterArray.push(obj)
    });
    this.displayColumnsPDf = filterArray;
    this.displayedColumns.forEach(element => {
      this.styleObject(element)
    });
  }
  asyncFilter(mutualFund) {
    if (this.inputData == 'category wise') {
      this.rightFilterData.reportType = []
      this.rightFilterData.reportType[0] = {
        name: 'Category wise',
        selected: true
      }
    } else if (this.inputData == 'investor wise') {
      this.rightFilterData.reportType = []
      this.rightFilterData.reportType[0] = {
        name: 'Investor wise',
        selected: true
      }
    } else if (this.inputData == 'Sub Category wise') {
      this.rightFilterData.reportType = []
      this.rightFilterData.reportType[0] = {
        name: 'Sub Category wise',
        selected: true
      }
    } else {
      console.log('do nothing')
      // this.rightFilterData.reportType = []
      // this.rightFilterData.reportType[0] = {
      //   name : 'Sub Category wise',
      //   selected : true
      // }
    }
    if (typeof Worker !== 'undefined') {
      if (this.reponseData) {
        this.rightFilterData.reportType = [];
        this.rightFilterData.reportType[0] = {
          name: this.reponseData ? this.setDefaultFilterData.reportType : this.saveFilterData.reportType,
          selected: true
        }

      } else if (!this.inputData && !this.reponseData) {
        this.rightFilterData.reportType = [];
        this.rightFilterData.reportType[0] = {
          name: (this.saveFilterData) ? this.saveFilterData.reportType : this.setDefaultFilterData.reportType,
          selected: true
        }
      }
      console.log(`13091830918239182390183091830912830918310938109381093809328`);
      const input = {
        mutualFundList: mutualFund,
        // mutualFund: this.mfData,
        mutualFund: (this.reponseData) ? this.reponseData : this.mutualFund,
        type: (this.rightFilterData.reportType) ? this.rightFilterData.reportType : '',
        showFolio: (this.reponseData) ? this.setDefaultFilterData.showFolio : ((this.saveFilterData) ? this.saveFilterData.showFolio : this.setDefaultFilterData.showFolio),
        // mfService: this.mfService
      };
      // Create a new
      const worker = new Worker('../../mutual-fund.worker.ts', { type: 'module' });
      worker.onmessage = ({ data }) => {
        this.grandTotal = data.totalValue;
        this.dataSummary.grandTotal = this.grandTotal
        this.customDataSource.data = []
        this.summary.data = [{}, {}, {}];
        this.summary.data = data.customDataSourceData;
        console.log("this is summary Data:::", data.customDataSourceData)
        this.customDataSource.data = data.customDataSourceData;
        this.displayedColumns.forEach(element => {
          this.styleObject(element)
        });
        console.log('header data', this.customDataSource)
        console.log(`MUTUALFUNDSummary COMPONENT page got message:`, data);
        this.dataSummary.customDataSourceData = data
        this.mfService.getSummaryData()
          .subscribe(res => {
            this.getObj = res; //used for getting mutual fund data coming from main gain call
            console.log('yeeeeeeeee', res)
            if (this.getObj.customDataSourceData) {

            } else {
              this.mfService.setSummaryData(this.dataSummary)
              if (this.router.url.split('?')[0] == '/pdf/summary') {
                this.showDownload = true
                this.generatePdfBulk()
              }
            }
          })
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
    this.showDownload = true
    setTimeout(() => {
      var blob = new Blob([document.getElementById('template').innerHTML], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
      });
      saveAs(blob, tableTitle + ".xls");
    }, 200);
    // if (data) {
    //   this.fragmentData.isSpinner = false;
    // }
  }

  subCatArrayForSummary(mutualFundList, type, mfService: MfServiceService) {
    let reportType;
    (type == '' || type[0].name == 'Sub Category wise') ? reportType = 'subCategoryName' :
      (type[0].name == 'Category wise') ? reportType = 'categoryName' : reportType = 'ownerName';
    const filteredArray = [];
    let catObj;
    if (mutualFundList) {
      catObj = mfService.categoryFilter(mutualFundList, reportType);
      Object.keys(catObj).map(key => {
        mfService.initializeValues();
        filteredArray.push({ groupName: key });
        let totalObj: any = {};
        catObj[key].forEach((singleData) => {
          filteredArray.push(singleData);
          totalObj = mfService.addTwoObjectValues(mfService.calculateTotalValue(singleData), totalObj, { schemeName: true });
        });
        filteredArray.push(totalObj);
      });
      console.log(filteredArray);
      return filteredArray;
    }
  }


  // getSubCategoryWise(data) {
  //   this.subCategoryData = this.mfService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
  // }
  //
  // getSchemeWise() {
  //   this.schemeWise = this.mfService.filter(this.subCategoryData, 'mutualFundSchemeMaster');
  // }
  //
  // mfSchemes() {
  //   this.mutualFundList = this.mfService.filter(this.schemeWise, 'mutualFund');
  // }
  // getDataForRightFilter() {// for rightSidefilter data this does not change after generating report
  //   let subCatData = this.mfService.filter(this.mutualFund.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
  //   this.schemeWiseForFilter = this.mfService.filter(subCatData, 'mutualFundSchemeMaster');
  //   this.mutualFundListFilter = this.mfService.filter(this.schemeWiseForFilter, 'mutualFund');
  // }

  openFilter() {
    // if(!this.resData){
    //   this.displayColArray = this.displayedColumns;
    //   let data =[];
    //   this.displayColArray.forEach(element => {
    //     const obj = {
    //       displayName: element,
    //       selected:true
    //     };
    //     data.push(obj);
    //   });
    //   this.displayColArray = data;
    // }

    const fragmentData = {
      flag: 'openFilter',
      data: {},
      id: 1,
      state: 'open35',
      componentName: RightFilterDuplicateComponent
    };
    fragmentData.data = {
      name: 'SUMMARY REPORT',
      mfData: this.mutualFund,
      folioWise: this.setDefaultFilterData.folioWise,
      schemeWise: this.setDefaultFilterData.schemeWise,
      familyMember: this.setDefaultFilterData.familyMember,
      category: this.setDefaultFilterData.category,
      // transactionView: (this.setDefaultFilterData.transactionView.length>0) ? this.setDefaultFilterData.transactionView : this.displayedColumns,
      transactionView: (this.reponseData) ? this.setDefaultFilterData.transactionView : ((this.saveFilterData) ? this.saveFilterData.transactionView : this.setDefaultFilterData.transactionView),
      overviewFilter: (this.saveFilterData) ? this.saveFilterData.overviewFilter : this.setDefaultFilterData.overviewFilter,
      scheme: this.setDefaultFilterData.scheme,
      reportType: (this.inputData) ? this.rightFilterData.reportType[0].name : (this.reponseData) ? this.setDefaultFilterData.reportType : ((this.saveFilterData) ? this.saveFilterData.reportType : this.setDefaultFilterData.reportType),
      reportAsOn: this.setDefaultFilterData.reportAsOn,
      showFolio: (this.reponseData) ? this.setDefaultFilterData.showFolio : ((this.saveFilterData) ? this.saveFilterData.showFolio : this.setDefaultFilterData.showFolio),
      transactionPeriod: this.setDefaultFilterData.transactionPeriod,
      transactionPeriodCheck: this.setDefaultFilterData.transactionPeriodCheck,
      fromDate: this.setDefaultFilterData.fromDate,
      toDate: (this.setDefaultFilterData.toDate)?this.setDefaultFilterData.toDate:this.toDate,
      savedFilterData: this.savedFilterData,
      selectFilter: (this.saveFilterData) ? this.saveFilterData.selectFilter : null,
      // transactionTypeList:this.setDefaultFilterData.transactionTypeList
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          if (sideBarData.data && sideBarData.data != 'Close') {
            this.summary = new MatTableDataSource([{}, {}, {}]);
            this.isLoading = true;
            this.changeInput.emit(true);
            this.resData = sideBarData.data;
            this.rightFilterData = sideBarData.data;
            this.columns = [];
            this.rightFilterData.transactionView.forEach(element => {
              if (element.selected == true) {
                this.columns.push(element.displayName)
              }
            });
            this.displayedColumns = [];
            this.displayedColumns = this.columns;
            this.displayColArray = [];
            this.rightFilterData.transactionView.forEach(element => {
              const obj = {
                displayName: element.displayName,
                selected: true
              };
              this.displayColArray.push(obj);
            });
            this.reponseData = this.doFiltering(this.rightFilterData.mfData)
            this.mfData = this.reponseData;
            this.setDefaultFilterData = this.mfService.setFilterData(this.mutualFund, this.rightFilterData, this.displayColArray);
            // this.asyncFilter(this.reponseData.mutualFundList);
            this.mfService.setFilterValues(this.setDefaultFilterData);
            this.mfService.setDataForMfGet(this.rightFilterData.mfData);
            this.getFilterData(2)
            // this.getListForPdf(this.rightFilterData.transactionView);
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openFolioMaster(data) {
    const fragmentData = {
      flag: 'openfolioMaster',
      data,
      id: 1,
      state: 'open45',
      componentName: FolioMasterDetailsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // code to refresh...
          }
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openSipDetails(data) {
    const fragmentData = {
      flag: 'openSipDetails',
      data,
      id: 1,
      state: 'open45',
      componentName: SipDetailsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // code to refresh...
          }
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openMutualFund(flag, data) {
    let component;
    switch (true) {
      case (flag == 'addPortfolio'):
        component = AddMutualFundComponent;
        break;
      case (flag == 'addMutualFund'):
        component = MFSchemeLevelHoldingsComponent;
        break;
      default:
        component = MFSchemeLevelTransactionsComponent;
    }
    const fragmentData = {
      flag,
      data: { flag },
      id: 1,
      state: 'open',
      componentName: component
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // code to refresh
            this.addedData = true;
            this.mfService.setDataForMfGet('');
            this.mfService.setMfData('');
            // this.ngOnInit();
            this.initPoint();
            // this.getMutualFund();
          }
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  isGroup(index, item): boolean {// for display name as per category
    return item.groupName;
  }

  isGroup2(index, item) {// for displaying total as per category
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

  generatePdf() {
    this.displayedColumns.forEach(element => {
      this.styleObject(element)
    });
    this.showDownload = true
    this.fragmentData.isSpinner = true;
    setTimeout(() => {
      const para = document.getElementById('template');
      this.returnValue = this.utilService.htmlToPdf(para.innerHTML, 'MF summary', 'true', this.fragmentData, '', '');
    });

  }

  deleteModal(value, element) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        // this.subService.deleteInvoices(this.list).subscribe(
        //   data => {
        //     this.dataCount = 0;
        //     this.eventService.openSnackBar('invoice deleted successfully.', 'Dismiss');
        //     dialogRef.close(this.list);

        //   },
        //   error => this.eventService.showErrorMessage(error)
        // );
        // dialogRef.close(listIndex);
        if (value === 'mutualFund') {
          const obj = { id: element.id }
          this.customerService.postMutualFundDelete(obj)
            .subscribe(res => {
              if (res) {
                this.eventService.openSnackBar('Deleted Successfully', "Dismiss");
                dialogRef.close();
                this.addedData = true;
                this.mfService.setDataForMfGet('');
                this.mfService.setMfData('');
                // this.ngOnInit();
                this.initPoint();

                // this.getMutualFund();
              }
            })
        }

      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openMutualEditFund(flag, element) {
    // this.mutualFundList.forEach(ele => {
    //   ele.mutualFundTransactions.forEach(tran => {
    //     if (tran.id == element.id) {
    //       this.selectedDataLoad = ele;
    //     }
    //   });
    // });
    // if(!this.selectedDataLoad){
    //   this.selectedDataLoad= element
    // }
    const fragmentData = {
      flag: 'editTransaction',
      data: { family_member_list: ['family_member_list'], flag, ...element, ...this.selectedDataLoad },
      id: 1,
      state: 'open',
      componentName: MFSchemeLevelHoldingsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.addedData = true;
            this.mfService.setDataForMfGet('');
            this.mfService.setMfData('');
            // this.ngOnInit();
            this.initPoint();
            // this.getMutualFund();
          }
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openUpperFragment(flag, element) {
    console.log("this is what element is:::", element);
    if (flag == 'addTransaction') {
      const fragmentData = {
        flag: 'app-upper-customer',
        id: 1,
        data: { family_member_list: ['family_member_list'], flag: 'addTransaction', ...element },
        direction: 'top',
        componentName: UpperCustomerComponent,
        state: 'open'
      };
      const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
        upperSliderData => {
          if (UtilService.isDialogClose(upperSliderData)) {
            if (UtilService.isRefreshRequired(upperSliderData)) {
              // this.ngOnInit();
              this.initPoint()
              // code to refresh ...
              // this.getMutualFund();
              // this.getMutualFundResponse(upperSliderData);
              //   this.customDataSource = new MatTableDataSource([{}, {}, {}]);
              //   this.mfService.getDataForMfGet()
              // .subscribe(res => {
              //   this.mfGetData = res;
              // })
              // if(this.mfGetData){
              //   this.isLoading = true;
              //   this.changeInput.emit(true);
              //   this.getMutualFundResponse(this.mfGetData)
              // }

            }

            // this.getClientSubscriptionList();
            subscription.unsubscribe();
          }
        }
      );
    }

  }
  generatePdfBulk() {
    const date = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');

    this.showDownload = true
    setTimeout(() => {
      let para = this.summaryTemplate.nativeElement.innerHTML
      let obj = {
        htmlInput: para,
        name: (this.clientData.name) ? this.clientData.name : '' + 's' + 'Summary' + date,
        landscape: true,
        key: 'showPieChart',
        clientId: this.clientId,
        advisorId: this.advisorId,
        fromEmail: this.clientDetails.advisorData.email,
        toEmail: this.clientData.email
      }
      let response = this.utilService.bulkHtmlToPdf(obj)
      console.log('********', response)
      //this.utilService.htmlToPdf(para, 'Summary', true, this.fragmentData, '', '')
    }, 400);
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
    console.log('data', data)
    this.clientDetails = data
    this.clientData = data.clientData
    this.getOrgData = data.advisorData
    this.userInfo = data.advisorData
  }
  getDefaultDetails(platform) {
    const obj = {
      advisorId: this.advisorId,
      familyMemberId: 0,
      clientId: this.clientId,
      // aggregatorType: platform
    };

    this.onlineTransact.getDefaultDetails(obj).subscribe(
      data => {
        this.getDefaultDetailsRes(data);
      }, error => {
        this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  getDefaultDetailsRes(data) {
    if (data == undefined) {
      return;
    } else {
      if (data.defaultCredential != undefined) {
        this.noSubBroker = false;
        if (data.defaultClient == undefined) {
          this.noMapping = true;
        } else {
          this.noMapping = false;
        }
      } else {
        this.noSubBroker = true;
      }
    }
  }
  openTransaction(data) {
    const routeName = this.router.url.split('/')[1];
    if (routeName == 'customer') {
      this.isAdvisorSection = false;
    }
    const fragmentData = {
      flag: 'addNewTransaction',
      data: { isAdvisorSection: this.isAdvisorSection, flag: 'addNewTransaction', data: data },
      id: 1,
      state: 'open65',
      componentName: OnlineTransactionComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            //this.refresh(true);
          }
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
