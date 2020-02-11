import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { GoldComponent } from '../../../accounts/assets/commodities/gold/gold.component';
import { OthersComponent } from '../../../accounts/assets/commodities/others/others.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../actiity.service';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-advice-commodities',
  templateUrl: './advice-commodities.component.html',
  styleUrls: ['./advice-commodities.component.scss']
})
export class AdviceCommoditiesComponent implements OnInit {
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'mvalue', 'advice', 'astatus', 'adate', 'icon'];
  dataSource3 = new MatTableDataSource(ELEMENT_DATA1);
  advisorId: any;
  clientId: any;
  isLoading: boolean;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject, private activityService: ActiityService) { }

  ngOnInit() {
    this.dataSource3.sort = this.sort;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAdviceByAsset();
  }
  allAdvice = false
  getAdviceByAsset() {
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
  getAllSchemeResponse(data) {
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
  { name: 'Rahul Jain', desc: '2', mvalue: '20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];
