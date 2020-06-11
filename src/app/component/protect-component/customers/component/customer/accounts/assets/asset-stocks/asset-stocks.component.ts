import { Component, OnInit, Output, EventEmitter} from '@angular/core';
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

@Component({
  selector: 'app-asset-stocks',
  templateUrl: './asset-stocks.component.html',
  styleUrls: ['./asset-stocks.component.scss']
})
export class AssetStocksComponent implements OnInit {
  displayedColumns25 = ['scrip', 'owner', 'bal', 'price', 'mprice', 'amt', 'cvalue', 'gain', 'ret',
     'dividend', 'icons'];

  footerColumns = ['scrip', /*'owner', 'bal', 'price', 'mprice',*/ 'amt', 'cvalue', 'gain', 'ret',
     'dividend', 'icons'];
  dataSource25 = ELEMENT_DATA25;
  advisorId: any;
  clientId: any;
  assetStockData: any;
  portfolioData: any=[];
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
    pieChart(id);
  }


  @Output() changeCount = new EventEmitter();
  getStocksData() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.changeCount.emit("call");

    this.cusService.getAssetStockData(obj).subscribe(
      data => {
        this.getStocksDataRes(data);
        setTimeout(() => {
          this.pieChart(data.categories);
        }, 1000);
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
        this.eventService.openSnackBar(err);
      }
    );
  }

  categories:any;
  grandTotalUnrealizedGainLoss:any;
  stockListGroup:any = [];
  gain:boolean = true;
  getStocksDataRes(data) {
    console.log('AssetStockComponent getStocksDataRes data : ', data);
    if(data){
      this.categories = data.categories;
    }
    if (data.portfolios.length != 0) {
      this.assetStockData = data;
      this.portfolioData = data.portfolios;
     this.grandTotalUnrealizedGainLoss = data.grandTotalUnrealizedGainLoss;
     if(Math.sign(this.grandTotalUnrealizedGainLoss) == 1){
      this.gain = true;
     }
     else{
      this.gain = false;
     }
      this.portfolioData.forEach(p => {
        p.categoryWiseStockList.forEach((s, i) => {
          for (let index = 0; index < s.stockList.length; index++) {
              if(index == 0 && s.categoryName){
                this.stockListGroup.push({group:s.categoryName});
              }
              if(s.stockListForEditView){
                s.stockList[index]['stockListForEditView'] = s.stockListForEditView;
              }
              this.stockListGroup.push(s.stockList[index]);
            }
        });
        p['stockListGroup'] = this.stockListGroup;
        this.stockListGroup = [];
      });
      console.log(this.portfolioData,"this.portfolioData 123");
      
    } else {
      this.portfolioData = []; 
      this.noData = 'No Stocks Found';
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
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.cusService.deleteStockData(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
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

