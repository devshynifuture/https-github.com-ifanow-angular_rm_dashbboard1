import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { GoldComponent } from '../../../../accounts/assets/commodities/gold/gold.component';
import { OthersComponent } from '../../../../accounts/assets/commodities/others/others.component';

@Component({
  selector: 'app-all-advice-commodities',
  templateUrl: './all-advice-commodities.component.html',
  styleUrls: ['./all-advice-commodities.component.scss']
})
export class AllAdviceCommoditiesComponent implements OnInit {

  displayedColumns3: string[] = ['checkbox', 'name', 'desc','mvalue', 'advice', 'astatus', 'adate', 'icon'];
  dataSource3 = ELEMENT_DATA1;
  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
  allAdvice = true
  openCommodities(value, state, data) {
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
            // if (value == 'addGold') {
            //   this.getGoldList()
            // } else {
            //   this.getOtherList()
            // }

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openOthers(value, state, data) {
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
            // if (value == 'addGold') {
            //   this.getGoldList()
            // } else {
            //   this.getOtherList()
            // }
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
  { name: 'Rahul Jain', desc: '1', mvalue:'20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', mvalue:'20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];
