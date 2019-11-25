import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-profile-plan',
  templateUrl: './profile-plan.component.html',
  styleUrls: ['./profile-plan.component.scss']
})
export class ProfilePlanComponent implements OnInit {
  
  viewMode
  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
    this.viewMode="tab1"
  }

 

  open(flagValue){
    const fragmentData = {
      Flag: flagValue,
      id: 1,
      state: 'open35'
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

  panelOpenState = false;

  
}
