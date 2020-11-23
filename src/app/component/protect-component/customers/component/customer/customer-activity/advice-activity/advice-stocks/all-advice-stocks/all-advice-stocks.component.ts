import { Component, OnInit } from '@angular/core';
import { ActiityService } from '../../../actiity.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { AddAssetStocksComponent } from '../../../../accounts/assets/asset-stocks/add-asset-stocks/add-asset-stocks.component';
import { SelectAdviceComponent } from '../../select-advice/select-advice.component';
import { AssetStocksComponent } from '../../../../accounts/assets/asset-stocks/asset-stocks.component';
import { EventService } from 'src/app/Data-service/event.service';
import { MatDialog } from '@angular/material';
import { CustomerService } from '../../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { AdviceUtilsService } from '../../advice-utils.service';

@Component({
  selector: 'app-all-advice-stocks',
  templateUrl: './all-advice-stocks.component.html',
  styleUrls: ['./all-advice-stocks.component.scss']
})
export class AllAdviceStocksComponent implements OnInit {
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'mvalue', 'advice', 'astatus', 'adate', 'icon'];
  dataSource3 = ELEMENT_DATA1;
  advisorId: any;
  clientId: any;
  isLoading: boolean;
  stockDatasource: any;
  selectedAssetId: any = [];
  stockCount: number;


  constructor(private eventService: EventService, public dialog: MatDialog, private subInjectService: SubscriptionInject,
    private cusService: CustomerService, private activityService: ActiityService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAssetAll();
  }
  allAdvice = true;
  getAssetAll() {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      // assetCategory: 1,
      // adviceStatusId:0,
      categoryMasterId: 6,
      categoryTypeId: 0,
      status: 1
    }
    this.stockDatasource = [{}, {}, {}]
    this.isLoading = true;
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllAssetResponse(data), (error) => {
        this.isLoading = false;
        this.stockDatasource = [];
        this.stockDatasource['tableFlag'] = (this.stockDatasource.length == 0) ? false : true;

        // this.datasource.data = [];
        // this.isLoading = false;
      }
    );
  }
  checkAll(flag, tableDataList) {
    console.log(flag, tableDataList)
    const { selectedIdList, count } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    this.stockCount = count;
    this.selectedAssetId = selectedIdList;
    console.log(this.selectedAssetId);
  }
  checkSingle(flag, selectedData, tableData) {
    if (flag.checked) {
      selectedData.selected = true;
      this.selectedAssetId.push(selectedData.assetDetails.id)
    }
    else {
      selectedData.selected = false
      this.selectedAssetId.splice(this.selectedAssetId.indexOf(selectedData.assetDetails.id), 1)
    }
    this.stockCount = AdviceUtilsService.selectSingleCheckbox(Object.assign([], tableData));
  }
  getAllAssetResponse(data) {
    this.isLoading = false;
    let filterdData = [];
    let stockData = data.STOCKS;
    stockData.forEach(element => {
      var asset = element.AssetDetails;
      element.AdviceList.forEach(obj => {
        obj.assetDetails = asset;
        filterdData.push(obj);
      });
    });
    this.stockDatasource = filterdData;
    this.stockDatasource['tableFlag'] = (data.STOCKS.length == 0) ? false : true;
    console.log(data);
  }
  openRealEstate(value, data) {
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
  { name: 'Rahul Jain', desc: '2', mvalue: '20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];