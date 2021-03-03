import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { SettingsService } from '../../../settings.service';
import { AddNewTemplateComponent } from './add-new-template/add-new-template.component';

@Component({
  selector: 'app-plan-templates',
  templateUrl: './plan-templates.component.html',
  styleUrls: ['./plan-templates.component.scss']
})
export class PlanTemplatesComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject,
    private settingsService: SettingsService,
    private eventService: EventService,
    private dialog: MatDialog,
    protected subinject: SubscriptionInject) { }

  ngOnInit() {
  }
  openAddtemlates(value, data) {

    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: AddNewTemplateComponent,

    };
    const rightSideDataSub = this.subinject.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
}
