import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { GoldComponent } from '../../../accounts/assets/commodities/gold/gold.component';
import { OthersComponent } from '../../../accounts/assets/commodities/others/others.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../actiity.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AdviceUtilsService } from '../advice-utils.service';

@Component({
  selector: 'app-advice-commodities',
  templateUrl: './advice-commodities.component.html',
  styleUrls: ['./advice-commodities.component.scss']
})
export class AdviceCommoditiesComponent implements OnInit {
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'mvalue', 'advice', 'astatus', 'adate', 'icon'];
  // dataSource1 = new MatTableDataSource(ELEMENT_DATA1);
  dataSource2 = new MatTableDataSource(ELEMENT_DATA2);
  advisorId: any;
  clientId: any;
  isLoading: boolean;
  @ViewChild("tableOne", { static: true }) sort1: MatSort;
  @ViewChild("tableTwo", { static: true }) sort2: MatSort;
  goldDataSource: any;
  selectedAssetId: any = [];
  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject, private activityService: ActiityService) { }

  ngOnInit() {
    this.dataSource2.sort = this.sort2;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAdviceByAsset();
  }
  allAdvice = false
  getAdviceByAsset() {
    this.goldDataSource = [{}, {}, {}];
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      assetCategory: 12
    }
    this.isLoading = true
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllSchemeResponse(data), (error) => {
      }
    );
  }
  checkAll(flag, tableDataList) {
    console.log(flag, tableDataList)
    const { dataList, selectedIdList } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    this.goldDataSource = new MatTableDataSource(dataList);
    this.selectedAssetId = selectedIdList;
    // console.log(this.selectedAssetId);
  }
  getAllSchemeResponse(data) {
    this.goldDataSource = new MatTableDataSource(data.GOLD);
    this.goldDataSource.sort = this.sort1;
    console.log(data);
    this.isLoading = false
  }
  openCommodities(data, value) {
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open',
      componentName: GoldComponent,

    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {

        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
          }
          this.getAdviceByAsset();
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openOthers(data, value) {
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open',
      componentName: OthersComponent,

    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {

        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
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
  { name: 'Rahul sain1', desc: '2', mvalue: '20000', advice: 'do trasact1', adate: '2020-02-20', astatus: 'LIVE' },

];

const ELEMENT_DATA2: PeriodicElement1[] = [
  { name: 'Rahul Jain', desc: '1', mvalue: '20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul sain1', desc: '2', mvalue: '20000', advice: 'do trasact1', adate: '2020-02-20', astatus: 'LIVE' },

];
