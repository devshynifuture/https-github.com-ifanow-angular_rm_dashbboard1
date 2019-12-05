import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-history-risk-profile',
  templateUrl: './history-risk-profile.component.html',
  styleUrls: ['./history-risk-profile.component.scss']
})
export class HistoryRiskProfileComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
  open(flagValue, data) {
    const fragmentData = {
    flag: flagValue,
    data,
    id: 1,
    state: 'open30'
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
    close(){
      this.subInjectService.changeNewRightSliderState({ state: 'close' });
    }
    
}
