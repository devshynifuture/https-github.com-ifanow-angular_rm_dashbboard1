import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddAssetStocksComponent } from './add-asset-stocks/add-asset-stocks.component';
import { StockScripLevelHoldingComponent } from './stock-scrip-level-holding/stock-scrip-level-holding.component';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatTableDataSource } from '@angular/material/table';
import { StockScripLevelTransactionComponent } from './stock-scrip-level-transaction/stock-scrip-level-transaction.component';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { pieChart } from './highChart-pichart';
import { StockDetailsViewComponent } from '../stock-details-view/stock-details-view.component';
import { StockTransactionDetailsComponent } from './stock-transaction-details/stock-transaction-details.component';
import { StockHoldingDetailsComponent } from './stock-holding-details/stock-holding-details.component';
import { AssetValidationService } from '../asset-validation.service';
import { StockPdfService } from 'src/app/services/stock-pdf.service';
import * as Highcharts from 'highcharts';
import { BackOfficeService } from 'src/app/component/protect-component/AdviserComponent/backOffice/back-office.service';

@Component({
  selector: 'app-asset-stocks',
  templateUrl: './asset-stocks.component.html',
  styleUrls: ['./asset-stocks.component.scss']
})
export class AssetStocksComponent implements OnInit {
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild('summery', { static: false }) summery;
  @ViewChild('PaiChart', { static: false }) PaiChart;
  @ViewChild('categoriesL', { static: false }) categoriesL;
  @ViewChild('StocksTemplate', { static: false }) StocksTemplate: ElementRef;
  @Output() loaded = new EventEmitter();
  @Input() finPlanObj: any;//finacial plan pdf input
  displayedColumns25 = ['scrip', 'amt', 'cvalue', 'gain', 'bal', 'price', 'mprice', 'ret',
    'dividend', 'icons'];

  footerColumns = ['scrip', /*'owner', 'bal', 'price', 'mprice',*/ 'amt', 'cvalue', 'gain', 'bal', 'ret',
    'dividend', 'icons'];
  dataSource25 = ELEMENT_DATA25;
  advisorId: any;
  clientId: any;
  assetStockData: any;
  portfolioData: any = [];
  isLoading = true;
  noData: string;
  returnValue: any;
  // build issue
  data;
  chart: Highcharts.Chart;
  svg: string;
  fragmentData = { isSpinner: false };
  reportDate = new Date();
  clientDetails: any;
  clientData: any;
  getOrgData: any;
  userInfo: any;
  othersChartColor: any = '#A0AEB4'
  chartColour: any = ['#008FFF', '#5DC644', '#FFC100', '#FF6823']
  constructor(private ref: ChangeDetectorRef, public dialog: MatDialog, private backOfficeService: BackOfficeService, public UtilService: UtilService, private subInjectService: SubscriptionInject, private assetValidation: AssetValidationService,
    private cusService: CustomerService, private eventService: EventService, private stockPDF: StockPdfService) {
  }

  ngOnInit() {
    this.dataSource25 = ELEMENT_DATA25;
    console.log(this.dataSource25);
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    if (this.assetValidation.stockDataList) {
      this.getChart(this.assetValidation.stockDataList);
      this.getStocksDataRes(this.assetValidation.stockDataList);
    } else {
      this.getStocksData();
      this.isLoading = true;
    }
    this.getOrgData = AuthService.getOrgDetails();
    this.getDetails();
  }



  pieChart(data) {
    // pieChart(id);
    this.chart = Highcharts.chart('piechartStock', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      title: {
        text: '',
        align: 'center',
        verticalAlign: 'middle',
        y: 60
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
          center: ['52%', '55%'],
          size: '120%'
        }
      },
      series: [{
        type: 'pie',
        name: 'Browser share',
        innerSize: '60%',
        data: data
        // [
        //   {
        //     name: 'Banking',
        //     y: data.Banks ? data.Banks.perrcentage : 0,
        //     color: '#008FFF',
        //     dataLabels: {
        //       enabled: false
        //     }
        //   }, {
        //     name: 'Information technology',
        //     y: data.Information_Technology ? data.Information_Technology.perrcentage : 0,
        //     color: '#5DC644',
        //     dataLabels: {
        //       enabled: false
        //     }
        //   }, {
        //     name: 'FMCG',
        //     y: data.fmcg ? data.fmcg.perrcentage : 0,
        //     color: '#FFC100',
        //     dataLabels: {
        //       enabled: false
        //     }
        //   }, {
        //     name: 'Other',
        //     y: data.OTHERS ? data.OTHERS.perrcentage : 0,
        //     color: '#A0AEB4',
        //     dataLabels: {
        //       enabled: false
        //     }
        //   }, {
        //     name: 'Auto ancillaries',
        //     y: data.Auto_Ancillaries ? data.Auto_Ancillaries.perrcentage : 0,
        //     color: '#FF6823',
        //     dataLabels: {
        //       enabled: false
        //     }
        //   }
        // ]
      }]
    });
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
    console.log('data', data);
    this.clientDetails = data;
    if (data) {
      this.clientData = data.clientData;
      this.getOrgData = data.advisorData
      this.userInfo = data.advisorData;
    }
  }

  generatePdf() {
    if (this.chart) {
      this.svg = this.chart.getSVG();
    }
    this.fragmentData.isSpinner = true;
    const para = document.getElementById('template');
    const obj = {
      htmlInput: para.innerHTML,
      name: 'Overview',
      landscape: true,
      key: 'showPieChart',
      svg: this.svg
    };
    let header = null
    this.returnValue = this.UtilService.htmlToPdf(header, para.innerHTML, 'Stock', false, this.fragmentData, 'showPieChart', this.svg, false);
    console.log('return value ====', this.returnValue);
    return obj;
  }

  pdf() {
    let sum = this.summery.nativeElement.textContent;
    let cate = this.categoriesL.nativeElement.textContent;
    let rows = this.tableEl;
    console.log(rows, "rows");
    // this.stockPDF.generatePdf(rows, cate, sum);
  }
  @Output() changeCount = new EventEmitter();
  chartData: any = [];
  getStocksData() {
    this.isLoading = true;
    this.portfolioData = [{ stockListGroup: [{}, {}, {}] }, { stockListGroup: [{}, {}, {}] }, { stockListGroup: [{}, {}, {}] }]
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    // this.assetValidation.getAssetCountGLobalData()

    this.cusService.getAssetStockData(obj).subscribe(
      data => {
        this.assetValidation.stockDataList = data;
        this.getChart(data);
        this.getStocksDataRes(data);

        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
        this.portfolioData = [];
        this.eventService.openSnackBar(err);
      }
    );
  }

  getChart(data) {
    let i = 0
    this.chartData = [];
    let others: any;
    for (const [c, e] of Object.entries(data.newGraphData)) {
      let obj = Object.assign({ e });
      if (c == "Others") {
        others = {
          name: c,
          y: obj.e.perrcentage,
          a: obj.e.currentValue,
          color: this.othersChartColor,
          dataLabels: {
            enabled: false
          }
        }
      } else {
        this.chartData.push({
          name: c,
          y: obj.e.perrcentage,
          a: obj.e.currentValue,
          color: this.chartColour[i],
          dataLabels: {
            enabled: false
          }
        })
        ++i;
      }
    }
    this.chartData.push(others);
    setTimeout(() => {
      this.pieChart(this.chartData);
    }, 1000);
  }

  categories: any = {
    Banks: {},
    fmcg: {},
    Auto_Ancillaries: {},
    OTHERS: {},
    Information_Technology: {}
  };
  grandTotalUnrealizedGainLoss: any;
  grandTotalAmountInvested: any;
  grandTotalCurrentValue: any;
  stockListGroup: any = [];
  gain: boolean = true;
  getStocksDataRes(data) {
    console.log('AssetStockComponent getStocksDataRes data : ', data);
    // if (data) {
    //   this.categories.Banks = data.categories.Banks ? data.categories.Banks : { currentValue: 0, perrcentage: 0 };
    //   this.categories.fmcg = data.categories.fmcg ? data.categories.fmcg : { currentValue: 0, perrcentage: 0 };
    //   this.categories.Auto_Ancillaries = data.categories.Auto_Ancillaries ? data.categories.Auto_Ancillaries : { currentValue: 0, perrcentage: 0 };
    //   this.categories.OTHERS = data.categories.OTHERS ? data.categories.OTHERS : { currentValue: 0, perrcentage: 0 };
    //   this.categories.Information_Technology = data.categories.Information_Technology ? data.categories.Information_Technology : { currentValue: 0, perrcentage: 0 };
    //   this.categories.OTHERS.perrcentage = data.categories.OTHERS.currentValue == 0 ? 0 : data.categories.OTHERS.perrcentage;

    // }
    if (data.emptyPortfolioList.length > 0) {
      let deleteArr = []
      data.emptyPortfolioList.forEach(ep => {
        deleteArr.push(ep.id)
      });
      this.cusService.deletePortfolio(deleteArr).subscribe(data => {
        console.log("emty porfolio deleted");
      },
        error => this.eventService.showErrorMessage(error)
      )
    }
    if (data.portfolios.length != 0) {
      this.isLoading = false;
      this.assetStockData = data;
      this.portfolioData = data.portfolios;
      this.grandTotalUnrealizedGainLoss = data.grandTotalUnrealizedGainLoss;
      this.grandTotalAmountInvested = data.grandTotalAmountInvested;
      this.grandTotalCurrentValue = data.grandTotalCurrentValue;
      if (Math.sign(this.grandTotalUnrealizedGainLoss) == 1) {
        this.gain = true;
      }
      else {
        this.gain = false;
      }

      this.portfolioData.forEach(p => {

        p.categoryWiseStockList.forEach((s, i) => {
          let ok = true;
          s.stockList.forEach(cs => {
            if (cs.stock.balanceShares || cs.stock.stockType == 1) {
              cs.stock.ownerList = p.ownerList
              cs.stock['nomineeList'] = p.nomineeList;
              cs.stock['linkedBankAccount'] = p.linkedBankAccount;
              cs.stock['linkedDematAccount'] = p.linkedDematAccount;
              cs.stock['description'] = p.description;
              cs.stock['stockListForEditView'] = cs.stockListForEditView;
              if (s.categoryName && ok) {
                ok = false;
                this.stockListGroup.push({ group: s.categoryName });
              }
              this.stockListGroup.push(cs.stock);
              // this.assetValidation.addAssetCount({ type: 'Add', value: 'STOCKS' })
            }

          });
          // for (let index = 0; index < s.stockList.length; index++) {
          //   if (index == 0 && s.categoryName) {
          //     this.stockListGroup.push({ group: s.categoryName });
          //   }
          //   if (s.stockListForEditView) {
          //     s.stockList[index]['stockListForEditView'] = s.stockListForEditView;
          //   }
          //   s.stockList[index].ownerList = p.ownerList
          //   s.stockList[index]['nomineeList'] = p.nomineeList;
          //   s.stockList[index]['linkedBankAccount'] = p.linkedBankAccount;
          //   s.stockList[index]['linkedDematAccount'] = p.linkedDematAccount;
          //   s.stockList[index]['description'] = p.description;
          //   this.stockListGroup.push(s.stockList[index]);
          // }
        });

        p['stockListGroup'] = this.stockListGroup;
        this.stockListGroup = [];
      });
      console.log(this.portfolioData, "this.portfolioData 123");

    } else {
      this.portfolioData = [];
      this.noData = 'No Stocks Found';
      this.isLoading = false;
    }
    this.ref.detectChanges();
    if (this.StocksTemplate) {
      this.loaded.emit(this.StocksTemplate.nativeElement);
    }
  }

  checkAndFillDataSource(singlePortfolio) {
    const stocks = singlePortfolio.stocks;
    const customStock = [];
    const categoryWiseMap = {};
    singlePortfolio.dividend = 0;
    singlePortfolio.xirr = 0;
    singlePortfolio.absoluteReturn = 0;
    singlePortfolio.unrealizedGainLoss = 0;
    singlePortfolio.currentMarketValue = 0;

    singlePortfolio.amountInvested = 0;

    // if (stocks) {
    stocks.forEach((singleStock) => {
      singlePortfolio.dividend += singleStock.dividend;
      singlePortfolio.xirr += singleStock.xirr;
      singlePortfolio.absoluteReturn += singleStock.absoluteReturn;
      singlePortfolio.unrealizedGainLoss += singleStock.unrealizedGainLoss;
      singlePortfolio.currentMarketValue += singleStock.currentMarketValue;
      singlePortfolio.amountInvested += singleStock.amountInvested;

      if (singleStock.stockCategoryName) {
        const categoryArray = categoryWiseMap[singleStock.stockCategoryName] ? categoryWiseMap[singleStock.stockCategoryName] : [];
        categoryArray.push(singleStock);
        categoryWiseMap[singleStock.stockCategoryName] = categoryArray;
      } else {
        customStock.push(singleStock);
      }
    });

    const customDataSource = new MatTableDataSource(customStock);
    Object.keys(categoryWiseMap).map(key => {
      customDataSource.data.push({ groupName: key });
      categoryWiseMap[key].forEach((singleData) => {
        customDataSource.data.push(singleData);
      });
    });
    return customDataSource;
    // } else {
    // }
  }

  isGroup(index, item): boolean {
    // console.log('index : ', index);
    // console.log('item : ', item);
    return item.group;
  }

  deleteModal(value, data) {
    let deleteArry = []
    if (data.stockListForEditView) {
      if (data.stockListForEditView.length > 0) {
        data.stockListForEditView.forEach(d => {
          deleteArry.push(d.id);
        });
      }
    }
    else {
      deleteArry.push(data.id);
    }

    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.cusService.deleteStockData(deleteArry).subscribe(
          data => {
            this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
            this.assetValidation.addAssetCount({ type: 'Delete', value: 'STOCKS' })
            dialogRef.close();
            this.getStocksData();
          },
          error => this.eventService.showErrorMessage(error)
        );
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

  editStock(data, portfolioData) {
    let component;
    console.log(data.stockType);
    switch (true) {
      case (data.stockType == 1):
        component = AddAssetStocksComponent;
        data = data;
        break;
      case (data.stockType == 2):
        component = StockScripLevelHoldingComponent;
        break;
      default:
        component = StockScripLevelTransactionComponent;
    }
    data.portfolioName = portfolioData.portfolioName;
    data.portfolioId = portfolioData.id;
    data.portfolioOwner = portfolioData.ownerList;
    const fragmentData = {
      flag: 'addStock',
      data,
      id: 1,
      state: 'open',
      componentName: component
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getStocksData();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openAddStock(flag, data) {
    let component;
    switch (true) {
      case (flag == 'addPortfolio'):
        component = AddAssetStocksComponent;
        break;
      case (flag == 'holding'):
        component = StockScripLevelHoldingComponent;
        break;
      default:
        component = StockScripLevelTransactionComponent;
    }
    const fragmentData = {
      flag: 'editStock',
      data,
      id: 1,
      state: 'open',
      componentName: component
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getStocksData();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
  opendetailviews(data, portfolioData) {
    // console.log('clicked');

    let component;
    console.log(data.stockType);
    switch (true) {
      case (data.stockType == 1):
        component = StockDetailsViewComponent;
        data = data;
        break;
      case (data.stockType == 2):
        component = StockHoldingDetailsComponent;
        break;
      default:
        component = StockTransactionDetailsComponent;
    }
    data.portfolioName = portfolioData.portfolioName;
    data.portfolioId = portfolioData.id;
    data.portfolioOwner = portfolioData.ownerList;
    const fragmentData = {
      flag: 'viewStock',
      data,
      id: 1,
      state: 'open35',
      componentName: component
    };


    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // refresh required.

            rightSideDataSub.unsubscribe();
          }
        }
      });

  }
}


export interface PeriodicElement25 {
  scrip: string;
  owner: string;
  bal: string;
  price: string;
  mprice: string;
  amt: string;
  cvalue: string;
  gain: string;
  ret: string;
  xirr: string;
  dividend: string;
}

const ELEMENT_DATA25: PeriodicElement25[] = [

  {
    scrip: 'Bharat Forge Ltd',
    owner: 'Rahul Jain'
    ,
    bal: '94,925',
    price: '29.20',
    mprice: '33.67',
    amt: '94,925',
    cvalue: '1,23,925',
    gain: '29,230',
    ret: '12.98%',
    xirr: '9.08%',
    dividend: '-'
  },
  {
    scrip: 'V-Guard Industries Ltd',
    owner: 'Rahul Jain'
    ,
    bal: '94,925',
    price: '29.20',
    mprice: '33.67',
    amt: '94,925',
    cvalue: '1,23,925',
    gain: '29,230',
    ret: '12.98%',
    xirr: '9.08%',
    dividend: '201'
  },

];

