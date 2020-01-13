import {Component, OnInit} from '@angular/core';
import {UtilService} from 'src/app/services/util.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {AddAssetStocksComponent} from './add-asset-stocks/add-asset-stocks.component';
import {StockScripLevelHoldingComponent} from './stock-scrip-level-holding/stock-scrip-level-holding.component';
import {AuthService} from 'src/app/auth-service/authService';
import {CustomerService} from '../../../customer.service';
import {EventService} from 'src/app/Data-service/event.service';
import {MatTableDataSource} from '@angular/material/table';
import {StockScripLevelTransactionComponent} from './stock-scrip-level-transaction/stock-scrip-level-transaction.component';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-asset-stocks',
  templateUrl: './asset-stocks.component.html',
  styleUrls: ['./asset-stocks.component.scss']
})
export class AssetStocksComponent implements OnInit {
  displayedColumns25 = ['scrip', 'owner', 'bal', 'price', 'mprice', 'amt', 'cvalue', 'gain', 'ret',
    'xirr', 'dividend', 'icons'];

  footerColumns = ['scrip', /*'owner', 'bal', 'price', 'mprice',*/ 'amt', 'cvalue', 'gain', 'ret',
    'xirr', 'dividend', 'icons'];
  dataSource25 = ELEMENT_DATA25;
  advisorId: any;
  clientId: any;
  assetStockData: any;
  portfolioData: any;
  isLoading = false;
  noData: string;

  constructor(public dialog: MatDialog, private subInjectService: SubscriptionInject,
              private cusService: CustomerService, private eventService: EventService) {
  }

  ngOnInit() {
    this.dataSource25 = ELEMENT_DATA25;
    console.log(this.dataSource25);
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getStocksData();
  }

  pieChart(id) {
    Highcharts.chart('piechartStock', {
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
        data: [
          {
            name: 'Banking',
            y: 23,
            color: '#008FFF',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Information technology',
            y: 13,
            color: '#5DC644',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'FMCG',
            y: 25.42,
            color: '#FFC100',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Other',
            y: 12.61,
            color: '#A0AEB4',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Auto ancillaries',
            y: 23.42,
            color: '#FF7272',
            dataLabels: {
              enabled: false
            }
          }
        ]
      }]
    });
  }

  getStocksData() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.cusService.getAssetStockData(obj).subscribe(
      data => {
        this.getStocksDataRes(data);
        this.pieChart('piechartStock');
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
        this.eventService.openSnackBar(err);
      }
    );
  }

  getStocksDataRes(data) {
    console.log('AssetStockComponent getStocksDataRes data : ', data);
    if (data.portfolios.length != 0) {
      this.assetStockData = data;
      this.portfolioData = data.portfolios;
    } else {
      this.noData = 'No Data Found';
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
      customDataSource.data.push({groupName: key});
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
    return item.groupName;
  }

  deleteModal(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.cusService.deleteStockData(data.id).subscribe(
          data => {
            this.eventService.openSnackBar('PPF is deleted', 'dismiss');
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
        data = portfolioData;
        break;
      case (data.stockType == 2):
        component = StockScripLevelHoldingComponent;
        break;
      default:
        component = StockScripLevelTransactionComponent;
    }
    data.portfolioName = portfolioData.portfolioName;
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

