import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { SettingsService } from '../../../settings.service';
import { AddNewTemplateComponent } from './add-new-template/add-new-template.component';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-plan-templates',
  templateUrl: './plan-templates.component.html',
  styleUrls: ['./plan-templates.component.scss']
})
export class PlanTemplatesComponent implements OnInit {
  fincialPlanList: any;
  quotes: any;
  miscellaneous: any;

  constructor(private subInjectService: SubscriptionInject,
    private settingsService: SettingsService,
    private eventService: EventService,
    private dialog: MatDialog,
    private SettingsService: SettingsService,
    protected subinject: SubscriptionInject) { }

  ngOnInit() {
    this.getTemplateList()
  }
  getTemplateList() {
    const obj = {
      advisorId: AuthService.getAdvisorId(),
    };
    this.SettingsService.getTemplateList(obj).subscribe(
      res => {
        this.getTemplateListResponse(res);
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }
  setVisibility() {

  }
  getTemplateListResponse(data) {
    console.log('templatelist', data)
    this.fincialPlanList = data[0].templates
    this.quotes = data[1].templates
    this.miscellaneous = data[2].templates
  }
  openAddtemlates(data) {
    const fragmentData = {
      flag: 'value',
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
            this.getTemplateList()
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
}
