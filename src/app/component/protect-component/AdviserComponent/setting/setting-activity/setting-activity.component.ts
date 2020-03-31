import { Component, OnInit } from '@angular/core';
import { AddTaskTemplateComponent } from './add-task-template/add-task-template.component';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { SubscriptionService } from '../../Subscriptions/subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { TaskTemplateTypeComponent } from './add-task-template/task-template-type/task-template-type.component';

@Component({
  selector: 'app-setting-activity',
  templateUrl: './setting-activity.component.html',
  styleUrls: ['./setting-activity.component.scss']
})
export class SettingActivityComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'assign', 'time', 'icons'];
  dataSource = ELEMENT_DATA;
  constructor(private subInjectService: SubscriptionInject,
    public subscription: SubscriptionService,
    public eventService: EventService, private utilService: UtilService) { }

  ngOnInit() {
  }

  openTaskTemplateType(singleProfile, value) {

    const fragmentData = {
      flag: value,
      data: singleProfile,
      id: 1,
      state: 'open50',
      componentName: TaskTemplateTypeComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {

            console.log('this is sidebardata in subs subs 2: ');
          }
          rightSideDataSub.unsubscribe();
        }
      }

    );
    // this.billerProfileData = this.dataTOget.data
  }
  
}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  assign: string;
  time: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'Linked', name: 'Insurance', weight: 'Health Insurance', symbol: 'Port policy',
    assign: 'Aniket Shah', time: 'T + 2 days'
  },

];