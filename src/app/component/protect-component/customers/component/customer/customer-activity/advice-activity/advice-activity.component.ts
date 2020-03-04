import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from '../../customer.service';
import { MatDialog } from '@angular/material';
import { SelectAdviceComponent } from './select-advice/select-advice.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-advice-activity',
  templateUrl: './advice-activity.component.html',
  styleUrls: ['./advice-activity.component.scss']
})
export class AdviceActivityComponent implements OnInit {
  viewMode: string;

  constructor(private eventService: EventService, public dialog: MatDialog, private subInjectService: SubscriptionInject,
    private cusService: CustomerService) { }
  selected;
  leftSidebarList = [
    { name: "Stock", count: 1, urlPath: '/customer/detail/activity/advice/stocks' },
    { name: "Fixed income", count: 1, urlPath: '/customer/detail/activity/advice/fixedIncome' },
    { name: "Real estate", count: 1, urlPath: '/customer/detail/activity/advice/realAsset' },
    { name: "Retirement accounts", count: 1, urlPath: '/customer/detail/activity/advice/retirement' },
    { name: "Small saving schemes", count: 1, urlPath: '/customer/detail/activity/advice/smallSavingScheme' },
    { name: "Cash & Bank", count: 1, urlPath: '/customer/detail/activity/advice/cashHand' },
    { name: "Commodities", count: 1, urlPath: '/customer/detail/activity/advice/commodities' }
  ]
  ngOnInit() {

    this.viewMode = 'tab6';
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
