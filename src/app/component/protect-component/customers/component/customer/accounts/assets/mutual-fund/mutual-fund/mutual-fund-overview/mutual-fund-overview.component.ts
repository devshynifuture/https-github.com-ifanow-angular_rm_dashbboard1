import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { UpperCustomerComponent } from 'src/app/component/protect-component/customers/component/common-component/upper-customer/upper-customer.component';
import { AddMutualFundComponent } from '../add-mutual-fund/add-mutual-fund.component';
import { MFSchemeLevelHoldingsComponent } from '../mfscheme-level-holdings/mfscheme-level-holdings.component';
import { MFSchemeLevelTransactionsComponent } from '../mfscheme-level-transactions/mfscheme-level-transactions.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);
import { CustomerService } from '../../../../../customer.service';
import { MatTableDataSource } from '@angular/material';
import { map } from 'rxjs/operators';
import { MfServiceService } from '../../mf-service.service';
import { RightFilterComponent } from 'src/app/component/protect-component/customers/component/common-component/right-filter/right-filter.component';
import { WebworkerService } from 'src/app/services/web-worker.service';
import { AuthService } from 'src/app/auth-service/authService';
import { SettingsService } from 'src/app/component/protect-component/AdviserComponent/setting/settings.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-mutual-fund-overview',
  templateUrl: './mutual-fund-overview.component.html',
  styleUrls: ['./mutual-fund-overview.component.scss']
})
export class MutualFundOverviewComponent implements OnInit {
  mfData: any = {};
  equityPercentage: any;
  debtPercentage: any;
  hybridPercenatge: any;
  solution_OrientedPercenatge: any;
  otherPercentage: any;
  categoryList: any;
  debtCurrentValue: any;
  equityCurrentValue: any;
  hybridCurrentValue: any;
  solution_OrientedCurrentValue: any;
  otherCurrentValue: any;
  dataSource4 = new MatTableDataSource([{}, {}, {}]);
  filteredArray: any[];
  dataSource = new MatTableDataSource([{}, {}, {}]);
  dataSource2 = new MatTableDataSource([{}, {}, {}]);
  dataSource3 = new MatTableDataSource([{}, {}, {}]);
  datasource1 = new MatTableDataSource([{}, {}, {}]);

  subCategoryArray: any;
  isLoading: boolean = true;
  rightFilterData: any;
  showHideTable: any;
  showSummaryBar = true;
  showSchemeWise = true;
  showCashFlow = true;
  showFamilyMember = true;
  showCategory = true;
  showSubCategory = true;
  totalValue: any = {};
  fragmentData = { isSpinner: false };
  advisorId: any;
  advisorData: any;
  clientId;

  @Output() changeInput = new EventEmitter();
  @Output() sendData = new EventEmitter();
  @Output() changeAsPerCategory = new EventEmitter();

  total_net_Gain: number;
  cashFlowXirr: any;
  filterData: any;
  viewMode: string;
  mutualFund: any;
  setDefaultFilterData: any;
  mfCopyData: any;
  mfDataUnrealised: any;
  openSummaryTab: boolean = false;
  inputDataToSend: any;
  mfGetData: any;
  clientIdToClearStorage: any;
  savedFilterData: any;
  saveFilterData: any;
  openTransactionTab: boolean = false;
  returnValue: any;
  transactionTypeList: any;
  changeViewModeSet: any;
  changeViewModeValue: boolean = false;
  svg: string;
  chart: Highcharts.Chart;
  constructor(private datePipe: DatePipe, public subInjectService: SubscriptionInject, public UtilService: UtilService,
    private mfService: MfServiceService,
    public eventService: EventService, private custumService: CustomerService, private MfServiceService: MfServiceService, private workerService: WebworkerService, private settingService: SettingsService) {
  }

  displayedColumns = ['name', 'amt', 'value', 'abs', 'xirr', 'alloc'];
  displayedColumns1 = ['data', 'amts'];
  @ViewChild('mfOverviewTemplate', { static: false }) mfOverviewTemplate: ElementRef;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId() !== undefined ? AuthService.getClientId() : -1;
    this.getFilterData(1);
    this.MfServiceService.getClientId().subscribe(res => {
      this.clientIdToClearStorage = res;
    });
    if (this.clientIdToClearStorage) {
      if (this.clientIdToClearStorage != this.clientId) {
        this.MfServiceService.clearStorage()
      }
    }
    this.MfServiceService.setClientId(this.clientId);
    this.MfServiceService.getViewMode()
      .subscribe(res => {
        this.viewMode = res;
      })
    this.mfService.getFilterValues()
      .subscribe(res => {
        this.setDefaultFilterData = res; //used to get filterd data send to openFilter function
      })
    this.mfService.getMfData()
      .subscribe(res => {
        this.mutualFund = res; //used for getting mutual fund data coming from main gain call
      })
    this.MfServiceService.getDataForMfGet()
      .subscribe(res => {
        this.mfGetData = res; //used for gettign data after filterd
      })
    if (this.mfGetData) {
      this.getMutualFundResponse(this.mfGetData);
    } else {
      this.getMutualFundData();
    }
    this.advisorData = this.MfServiceService.getPersonalDetails(this.advisorId);
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

          this.MfServiceService.setTransactionType(data);
          // this.setDefaultFilterData.transactionTypeList = filterData

        }
        // this.transactionTypeList = data;
      }
    );
  }
  getFilterData(value) {
    const obj = {
      advisor_id: this.advisorId,
      clientId: this.clientId,
      reportId: value
    }
    this.custumService.getSaveFilters(obj).subscribe(
      data => {
        if (data) {
          let overviewFilter = [];
          let allClient = [];
          let currentClient = [];
          let getList = [];
          data.forEach(element => {
            if (element.clientId == 0) {
              const obj = {
                name: element.columnName,
                selected: element.selected
              }
              allClient.push(obj);
            } else {
              const obj = {
                name: element.columnName,
                selected: element.selected
              }
              getList.push(element);
              currentClient.push(obj);
            }

          });
          if (getList.length > 0) {
            overviewFilter = currentClient;
          } else {
            overviewFilter = allClient;
          }
          this.saveFilterData = {
            overviewFilter: overviewFilter,
            showFolio: (data[0].showZeroFolios == true) ? '1' : '2',
            reportType: data[0].reportType,
            selectFilter: (getList.length > 0) ? this.clientId : 0
          }

          this.showHideTable = overviewFilter;
          (this.showHideTable[0].name == 'Summary bar' && this.showHideTable[0].selected == true) ? this.showSummaryBar = true : (this.showSummaryBar = false);
          (this.showHideTable[1].name == 'Scheme wise allocation' && this.showHideTable[1].selected == true) ? this.showSchemeWise = true : (this.showSchemeWise = false, this.dataSource2.data = []);
          (this.showHideTable[2].name == 'Cashflow Status' && this.showHideTable[2].selected == true) ? this.showCashFlow = true : (this.showCashFlow = false, this.datasource1.data = []);
          (this.showHideTable[3].name == 'Family Member wise allocation' && this.showHideTable[3].selected == true) ? this.showFamilyMember = true : (this.showFamilyMember = false, this.dataSource.data = []);
          (this.showHideTable[4].name == 'Category wise allocation' && this.showHideTable[4].selected == true) ? this.showCategory = true : (this.showCategory = false, this.dataSource4.data = []);
          (this.showHideTable[5].name == 'Sub Category wise allocation' && this.showHideTable[5].selected == true) ? this.showSubCategory = true : (this.showSubCategory = false, this.dataSource3.data = []);
        } else {
          if (this.rightFilterData) {
            this.showHideTable = this.rightFilterData.overviewFilter;
            (this.showHideTable[0].name == 'Summary bar' && this.showHideTable[0].selected == true) ? this.showSummaryBar = true : (this.showSummaryBar = false);
            (this.showHideTable[1].name == 'Scheme wise allocation' && this.showHideTable[1].selected == true) ? this.showSchemeWise = true : (this.showSchemeWise = false, this.dataSource2.data = []);
            (this.showHideTable[2].name == 'Cashflow Status' && this.showHideTable[2].selected == true) ? this.showCashFlow = true : (this.showCashFlow = false, this.datasource1.data = []);
            (this.showHideTable[3].name == 'Family Member wise allocation' && this.showHideTable[3].selected == true) ? this.showFamilyMember = true : (this.showFamilyMember = false, this.dataSource.data = []);
            (this.showHideTable[4].name == 'Category wise allocation' && this.showHideTable[4].selected == true) ? this.showCategory = true : (this.showCategory = false, this.dataSource4.data = []);
            (this.showHideTable[5].name == 'Sub Category wise allocation' && this.showHideTable[5].selected == true) ? this.showSubCategory = true : (this.showSubCategory = false, this.dataSource3.data = []);
          }
        }

      }
    );
  }
  getPersonalDetails(data) {
    const obj = {
      id: data
    }
    this.settingService.getProfileDetails(obj).subscribe(
      data => {
        this.advisorData = data;
      }
    );
  }
  getNav() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
    }
    this.custumService.getNav(obj).subscribe(
      data => {
        this.mutualFund.nav = data;
      }
    );
  }
  asyncFilter(mutualFund, categoryList) {
    if (typeof Worker !== 'undefined') {
      const input = {
        mutualFundList: mutualFund,
        mutualFund: this.mutualFund,
        type: '',
        // mfService: this.mfService
      };
      // Create a new
      const worker = new Worker('../../mutual-fund.worker.ts', { type: 'module' });
      worker.onmessage = ({ data }) => {
        this.totalValue = data.totalValue;
        this.calculatePercentage(categoryList); // for Calculating MF categories percentage
        this.pieChart('piechartMutualFund'); // pie chart data after calculating percentage
        if (this.showCashFlow) {
          this.getCashFlowStatus();
        }
        this.isLoading = false;
        this.changeInput.emit(false);
      };
      worker.postMessage(input);
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  getTypeOf(value) {
    return typeof (value);
  }

  getMutualFundData() {
    this.isLoading = true;
    this.changeInput.emit(true);
    const obj = {
      // advisorId: 2753,
      advisorId: this.advisorId,
      clientId: this.clientId,
      // clientId: this.clientId
    };
    this.custumService.getMutualFund(obj).subscribe(
      data => this.getMutualFundResponse(data), (error) => {
        this.showSummaryBar = false;
        this.dataSource.data = []
        this.showFamilyMember = false;
        this.dataSource2.data = []
        this.showSchemeWise = false;
        this.dataSource3.data = []
        this.showSubCategory = false;
        this.dataSource4.data = []
        this.showCategory = false;
        this.datasource1.data = [];
        this.showCashFlow = false;
        this.eventService.openSnackBar(" No Mutual Fund Found", "Dismiss");
      }
    );
  }
  getMutualFundResponse(data) {
    this.getNav();
    this.getTransactionTypeData();
    if (data) {
      this.mfCopyData = data
      this.MfServiceService.sendMutualFundData(data);
      this.MfServiceService.changeShowMutualFundDropDown(false);
      this.filterData = this.MfServiceService.doFiltering(data);
      if (!this.rightFilterData) {
        if (this.mutualFund == '') {
          this.mutualFund = this.filterData
        } else {
          this.mfService.getMfData()
            .subscribe(res => {
              this.mutualFund = res;
            })
        }
        // this.mutualFund = this.filterData;

        if (this.setDefaultFilterData == '' || !this.setDefaultFilterData) {
          this.setDefaultFilterData = this.MfServiceService.setFilterData(this.mutualFund, this.rightFilterData, this.displayedColumns);
        }
        this.MfServiceService.setFilterValues(this.setDefaultFilterData);
        this.MfServiceService.setMfData(this.mutualFund);
        this.MfServiceService.setDataForMfGet(this.mutualFund);

      }
      this.asyncFilter(this.filterData.mutualFundList, this.filterData.mutualFundCategoryMastersList)
      this.mfData = data;
      this.cashFlowXirr = (this.mfData.mutualFundCategoryMastersList.length > 0) ? this.mfData.mutualFundCategoryMastersList[0].cashFlowxirr : 0;
      this.total_net_Gain = (this.mfData.total_market_value - this.mfData.total_net_investment);
      let sortedData = this.MfServiceService.sorting(data.mutualFundCategoryMastersList, 'category')
      sortedData = sortedData.filter((item: any) =>
        item.currentValue != 0 && item.currentValue > 0
      );
      this.dataSource4 = new MatTableDataSource(sortedData); // category wise allocation
      this.getsubCategorywiseAllocation(data); // For subCategoryWiseAllocation
      this.schemeWiseAllocation(data); // for shemeWiseAllocation
      this.getFamilyMemberWiseAllocation(data); // for FamilyMemberWiseAllocation
      this.isLoading = false;
      this.changeInput.emit(false);
    } else {
      this.showSummaryBar = false;
      this.dataSource.data = []
      this.showFamilyMember = false;
      this.dataSource2.data = []
      this.showSchemeWise = false;
      this.dataSource3.data = []
      this.showSubCategory = false;
      this.dataSource4.data = []
      this.showCategory = false;
      this.datasource1.data = [];
      this.showCashFlow = false;
      this.eventService.openSnackBar(" No Mutual Fund Found", "Dismiss");
    }

  }
  calculatePercentage(data) {// function for calculating percentage
    this.debtCurrentValue = 0;
    this.equityCurrentValue = 0;
    this.hybridCurrentValue = 0;
    this.solution_OrientedCurrentValue = 0;
    this.otherCurrentValue = 0;
    this.debtPercentage = 0;
    this.equityPercentage = 0;
    this.hybridPercenatge = 0;
    this.solution_OrientedPercenatge = 0;
    this.otherPercentage = 0;
    data.forEach(element => {
      if (element.category == 'DEBT') {
        this.debtCurrentValue = element.currentValue;
        this.debtPercentage = ((element.currentValue / this.totalValue.currentValue) * 100).toFixed(2);
        this.debtPercentage = parseFloat(this.debtPercentage);
      } else if (element.category == 'EQUITY') {
        this.equityCurrentValue = element.currentValue;
        this.equityPercentage = ((element.currentValue / this.totalValue.currentValue) * 100).toFixed(2);
        this.equityPercentage = parseFloat(this.equityPercentage);
      } else if (element.category == 'HYBRID') {
        this.hybridCurrentValue = element.currentValue;
        this.hybridPercenatge = ((element.currentValue / this.totalValue.currentValue) * 100).toFixed(2);
        this.hybridPercenatge = parseFloat(this.hybridPercenatge);
      } else if (element.category == 'SOLUTION ORIENTED') {
        this.solution_OrientedCurrentValue = element.currentValue;
        this.solution_OrientedPercenatge = ((element.currentValue / this.totalValue.currentValue) * 100).toFixed(2);
        this.solution_OrientedPercenatge = parseFloat(this.solution_OrientedPercenatge);
      } else {
        this.otherCurrentValue = element.currentValue;
        this.otherPercentage = ((element.currentValue / this.totalValue.currentValue) * 100).toFixed(2);
        this.otherPercentage = parseFloat(this.otherPercentage);
      }
    });
  }
  getCashFlowStatus() {
    // Used for cashFlow status
    if (this.totalValue) {
      this.datasource1.data = [
        { data: 'a. Investment', amts: (this.mfData.total_cashflow_amount_inv) ? this.mfData.total_cashflow_amount_inv : 0 },
        { data: 'b. Switch In', amts: (this.mfData.total_switch_in) ? this.mfData.total_switch_in : 0 },
        { data: 'c. Switch Out', amts: (this.mfData.total_switch_out) ? this.mfData.total_switch_out : 0 },
        { data: 'd. Redemption', amts: (this.mfData.total_redemption) ? this.mfData.total_redemption : 0 },
        { data: 'e. Dividend Payout', amts: (this.mfData.total_dividend_payout) ? this.mfData.total_dividend_payout : 0 },
        { data: 'f. Net Investment (a+b-c-d-e)', amts: (this.mfData.total_net_investment) ? this.mfData.total_net_investment : 0 },
        { data: 'g. Market Value', amts: (this.mfData.total_market_value) ? this.mfData.total_market_value : 0 },
        { data: 'h. Net Gain (g-f)', amts: (this.total_net_Gain) ? this.total_net_Gain : 0 },
        { data: 'i. Lifetime XIRR (All Transactions)', amts: (this.cashFlowXirr) ? this.cashFlowXirr : 0 },

      ];
    } else {
      this.datasource1.data = [];
    }

  }
  getsubCategorywiseAllocation(data) {
    this.isLoading = true;
    this.changeInput.emit(true);
    this.filteredArray = this.MfServiceService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    if (this.dataSource3.data.length > 0) {
      let sortedData = this.MfServiceService.sorting(this.filteredArray, 'subCategory')
      sortedData = sortedData.filter((item: any) =>
        item.currentValue != 0 && item.currentValue > 0
      );
      this.dataSource3 = new MatTableDataSource(sortedData);
      this.isLoading = false;
      this.changeInput.emit(false);

    }
  }
  getFamilyMemberWiseAllocation(data) {
    this.isLoading = true;
    this.changeInput.emit(true);
    if (this.dataSource.data.length > 0) {
      let sortedData = this.MfServiceService.sorting(data.family_member_list, 'name');
      sortedData = sortedData.filter((item: any) =>
        item.currentValue != 0 && item.currentValue > 0 || (item.balanceUnits != 0 && item.balanceUnits > 0)
      );
      this.dataSource = new MatTableDataSource(sortedData);
      this.isLoading = false;
      this.changeInput.emit(false);

    }
  }
  schemeWiseAllocation(data) {
    let dataToShow = [];
    this.changeInput.emit(true);
    this.dataSource2.data = [];
    this.filteredArray = this.MfServiceService.filter(this.filteredArray, 'mutualFundSchemeMaster');
    this.filteredArray.forEach(element => {
      if (element.mutualFund.length > 1) {
        let catObj = this.MfServiceService.categoryFilter(element.mutualFund, 'schemeCode');
        Object.keys(catObj).map(key => {
          catObj[key].forEach((singleData) => {
            singleData.navDate = this.datePipe.transform(singleData.navDate, 'yyyy-MM-dd')
            singleData.mutualFundTransactions.forEach(element => {
              element.transactionDate = this.datePipe.transform(element.transactionDate, 'yyyy-MM-dd')
            });
          });
        });
        const obj = {
          advisorId: this.advisorId,
          clientId: this.clientId,
          request: catObj
        };
        this.custumService.getReportWiseCalculations(obj).subscribe(
          data => {
            Object.keys(catObj).map(key => {
              catObj[key] = data[key]
              element.xirr = catObj[key].xirr;

              dataToShow.push(element);
              let sortedData = this.MfServiceService.sorting(dataToShow, 'schemeName')
              sortedData = sortedData.filter((item: any) =>
                item.currentValue != 0 && item.currentValue > 0 || (item.balanceUnit != 0 && item.balanceUnit > 0)
              );
              this.dataSource2 = new MatTableDataSource(sortedData);
              this.isLoading = false;
              this.changeInput.emit(false);
            });
          }, (error) => {
            this.eventService.showErrorMessage(error);
          }
        );



      } else {
        dataToShow.push(element);
        let sortedData = this.MfServiceService.sorting(dataToShow, 'schemeName');
        sortedData = sortedData.filter((item: any) =>
          (item.currentValue != 0 && item.currentValue > 0) || (item.balanceUnit != 0 && item.balanceUnit > 0)
        );
        this.dataSource2 = new MatTableDataSource(sortedData);
        this.changeInput.emit(false);
      }
    });
    this.isLoading = false;

  }

  generatePdf() {
    this.svg = this.chart.getSVG()
    console.log(this.svg)
    this.fragmentData.isSpinner = true;
    let para = document.getElementById('template');
    this.returnValue = this.UtilService.htmlToPdf(para.innerHTML, 'Test', this.fragmentData, 'showPieChart', this.svg)
    console.log('return value ====', this.returnValue)
  }
  getReportWiseCalculation(data) {
    let xirr;
    let catObj = this.MfServiceService.categoryFilter(data, 'schemeCode');
    Object.keys(catObj).map(key => {
      catObj[key].forEach((singleData) => {
        singleData.navDate = this.datePipe.transform(singleData.navDate, 'yyyy-MM-dd')
        singleData.mutualFundTransactions.forEach(element => {
          element.transactionDate = this.datePipe.transform(element.transactionDate, 'yyyy-MM-dd')
        });
      });
    });
    const obj = {
      advisorId: this.advisorId,
      clientId: 15545,
      request: catObj
    };
    this.custumService.getReportWiseCalculations(obj).subscribe(
      data => {
        Object.keys(catObj).map(key => {
          catObj[key] = data[key]
          xirr = catObj[key]
        });
        return xirr;
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  pieChart(id) {
    this.chart = Highcharts.chart('piechartMutualFund', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,

      },
      title: {
        text: '',
        align: 'center',
        verticalAlign: 'middle',
        y: 60
      },
      exporting: { enabled: false },
      tooltip: {
        pointFormat: ' <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -50,
            style: {
              fontWeight: 'bold',
              color: 'white'
            }
          },
          startAngle: 0,
          endAngle: 360,
          center: ['52%', '50%'],
          size: '125%'
        }
      },
      series: [{
        type: 'pie',
        name: 'Browser share',
        innerSize: '60%',
        animation: false,
        states: {
          hover: {
            enabled: false
          }
        },
        data: [
          {
            name: 'Equity',
            // y:20,
            y: (this.equityPercentage) ? this.equityPercentage : 0,
            color: '#008FFF',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Debt',
            // y:20,
            y: (this.debtPercentage) ? this.debtPercentage : 0,
            color: '#5DC644',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Hybrid',
            // y:20,
            y: (this.hybridPercenatge) ? this.hybridPercenatge : 0,
            color: '#FFC100',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Other',
            // y:20,
            y: (this.otherPercentage) ? this.otherPercentage : 0,
            color: '#A0AEB4',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Solutions oriented',
            // y:20,
            y: (this.solution_OrientedPercenatge) ? this.solution_OrientedPercenatge : 0,
            color: '#FF7272',
            dataLabels: {
              enabled: false
            }
          }
        ]
      }]
    });
  }
  openMutualFund(flag, data) {
    let component;
    switch (flag) {
      case 'addPortfolio':
        component = AddMutualFundComponent;
        break;
      case 'addMutualFund':
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
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getMutualFundData();
          }
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
  openSummary(flag) {
    if (flag == 'scheme wise') {
      this.changeViewModeSet = 'All Transactions'
      this.changeViewModeValue = true
    } else {
      this.changeViewModeSet = 'Summary'
      this.changeViewModeValue = true
    }
    const obj = {
      viewMode: this.changeViewModeSet,
      flag: flag
    }
    this.changeAsPerCategory.emit(obj);


  }
  openFilter() {

    const fragmentData = {
      flag: 'openFilter',
      data: {},
      id: 1,
      state: 'open35',
      componentName: RightFilterComponent
    };
    // fragmentData.data = {
    //   name: 'Overview Report',
    //   mfData: this.mutualFund,
    //   folioWise: this.mutualFund.mutualFundList,
    //   schemeWise: this.mutualFund.schemeWise,
    //   familyMember: this.mutualFund.family_member_list,
    //   category: this.mutualFund.mutualFundCategoryMastersList,
    //   transactionView: this.displayedColumns,
    // };
    fragmentData.data = {
      name: 'Overview Report',
      mfData: this.mutualFund,
      folioWise: this.setDefaultFilterData.folioWise,
      schemeWise: this.setDefaultFilterData.schemeWise,
      category: this.setDefaultFilterData.category,
      transactionView: this.displayedColumns,
      familyMember: this.setDefaultFilterData.familyMember,
      scheme: this.setDefaultFilterData.scheme,
      reportType: (this.saveFilterData) ? this.saveFilterData.reportType : this.setDefaultFilterData.reportType,
      reportAsOn: this.setDefaultFilterData.reportAsOn,
      showFolio: (this.saveFilterData) ? this.saveFilterData.showFolio : this.setDefaultFilterData.showFolio,
      fromDate: this.setDefaultFilterData.fromDate,
      toDate: this.setDefaultFilterData.toDate,
      overviewFilter: (this.saveFilterData) ? this.saveFilterData.overviewFilter : this.setDefaultFilterData.overviewFilter,
      transactionPeriod: this.setDefaultFilterData.transactionPeriod,
      transactionPeriodCheck: this.setDefaultFilterData.transactionPeriodCheck,
      selectFilter: (this.saveFilterData) ? this.saveFilterData.selectFilter : null,
      // transactionTypeList:this.setDefaultFilterData.transactionTypeList
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (sideBarData.data && sideBarData.data != 'Close') {
            this.getFilterData(1);
            this.totalValue = {};
            this.dataSource2 = new MatTableDataSource([{}, {}, {}]);
            this.dataSource4 = new MatTableDataSource([{}, {}, {}]);
            this.dataSource = new MatTableDataSource([{}, {}, {}]);
            this.dataSource3 = new MatTableDataSource([{}, {}, {}]);
            this.isLoading = true;
            this.changeInput.emit(true);
            this.rightFilterData = sideBarData.data;
            this.getMutualFundResponse(this.rightFilterData.mfData);
            this.setDefaultFilterData = this.MfServiceService.setFilterData(this.mutualFund, this.rightFilterData, this.displayedColumns);
            this.MfServiceService.setFilterValues(this.setDefaultFilterData);
            this.MfServiceService.setDataForMfGet(this.rightFilterData.mfData);
            this.isLoading = false;
            this.changeInput.emit(false);
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }


  Excel(something) {

  }
  getMutualFundSummary() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
    };
    this.custumService.getMutualFund(obj).pipe(map((data) => {
      return this.doFilteringSum(data);
    })).subscribe(
      data => this.getMutualFundResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  doFilteringSum(data) {
    data.subCategoryData = this.mfService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    data.schemeWise = this.mfService.filter(data.subCategoryData, 'mutualFundSchemeMaster');
    data.mutualFundList = this.mfService.filter(data.schemeWise, 'mutualFund');
    return data;
  }
  getMutualFundResponseSummary(data) {
    if (data) {
      this.isLoading = false;
      this.mfData = data;
      this.mfData.viewMode = this.viewMode;
      if (this.mfData) {
        this.mfData.advisorData = this.mfService.getPersonalDetails(this.advisorId);
      }
    }
    this.isLoading = false;
  }
  unrealiseTransaction() {
    this.mfDataUnrealised = this.mfData;
  }

  changeViewMode(data) {
    this.viewMode = data;
    this.mfService.changeViewMode(this.viewMode);
    this.sendData.emit(data);

  }
}
export interface PeriodicElement1 {
  data: string;
  amts: string;
}

