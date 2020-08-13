import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { EditPayeeSettingPricingComponent } from './edit-payee-setting-pricing/edit-payee-setting-pricing.component';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-setting-support-pricing-setting',
  templateUrl: './setting-support-pricing-setting.component.html',
  styleUrls: ['./setting-support-pricing-setting.component.scss']
})
export class SettingSupportPricingSettingComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject,
    private utilService: UtilService, private eventService: EventService) { }

  ngOnInit() {
  }

  openeditpayeeSetting(data) {
    // let popupHeaderText = !!data ? 'Edit Recurring deposit' : 'Add Recurring deposit';
    const fragmentData = {
      flag: 'addActivityTask',
      data,
      id: 1,
      state: 'open',
      componentName: EditPayeeSettingPricingComponent,
      // popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.initPointForTask();
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}
