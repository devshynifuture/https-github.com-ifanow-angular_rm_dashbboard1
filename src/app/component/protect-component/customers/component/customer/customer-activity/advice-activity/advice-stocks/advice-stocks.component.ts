import { Component, OnInit, ViewChild } from '@angular/core';
import { ActiityService } from '../../actiity.service';
import { SelectAdviceComponent } from '../select-advice/select-advice.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { AddAssetStocksComponent } from '../../../accounts/assets/asset-stocks/add-asset-stocks/add-asset-stocks.component';
import { AssetStocksComponent } from '../../../accounts/assets/asset-stocks/asset-stocks.component';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from '../../../customer.service';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { AdviceUtilsService } from '../advice-utils.service';

@Component({
  selector: 'app-advice-stocks',
  templateUrl: './advice-stocks.component.html',
  styleUrls: ['./advice-stocks.component.scss']
})
export class AdviceStocksComponent implements OnInit {
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'mvalue', 'advice', 'astatus', 'adate', 'icon'];
  dataSource3 = new MatTableDataSource(ELEMENT_DATA1);
  advisorId: any;
  clientId: any;
  stockDatasource: any;
  isLoading: boolean;
  selectedAssetId: any = [];
  constructor(private eventService: EventService, public dialog: MatDialog, private subInjectService: SubscriptionInject,
    private cusService: CustomerService, private activityService: ActiityService) { }
  @ViewChild("tableOne", { static: true }) sort: MatSort;
  ngOnInit() {
    this.dataSource3.sort = this.sort;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAssetAll();
  }

  allAdvice = false;
  getAssetAll() {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      assetCategory: 1
    }
    this.stockDatasource = [{}, {}, {}]
    this.isLoading = true;
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllAssetResponse(data), (error) => {
        // this.datasource.data = [];
        // this.isLoading = false;
      }
    );
  }

  getAllAssetResponse(data) {
    this.isLoading = false;
    this.stockDatasource = data.STOCKS;
    this.stockDatasource['tableFlag'] = (data.STOCKS.length == 0) ? false : true;
    console.log(data);
  }
  checkAll(flag, tableDataList) {
    console.log(flag, tableDataList)
    const { dataList, selectedIdList } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    this.stockDatasource = new MatTableDataSource(dataList);
    this.selectedAssetId = selectedIdList;
    console.log(this.selectedAssetId);
  }
  openRealEstate(data, value) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: AssetStocksComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getFixedDepositList();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openselectAdvice(data) {
    const fragmentData = {
      flag: 'openselectAdvice',
      data,
      componentName: SelectAdviceComponent,

      state: 'open65'
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
}

export interface PeriodicElement1 {
  name: string;
  desc: string;
  mvalue: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: 'Rahul Jain', desc: '1', mvalue: '20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul xain1', desc: '2', mvalue: '20000', advice: 'do trasact1 ', adate: '2020-02-20', astatus: 'LIVE' },

];