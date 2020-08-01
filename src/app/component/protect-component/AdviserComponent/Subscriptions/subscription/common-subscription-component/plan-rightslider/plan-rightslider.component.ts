import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { SubscriptionService } from '../../../subscription.service';
import { AuthService } from '../../../../../../../auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { error } from 'highcharts';

@Component({
  selector: 'app-plan-rightslider',
  templateUrl: './plan-rightslider.component.html',
  styleUrls: ['./plan-rightslider.component.scss']
})
export class PlanRightsliderComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
    buttonColor: 'primary',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  planSettingData;
  selectedPlan;
  clientData;
  advisorId;
  noDataFoundFlag: any;
  selectedPlanList: any = [];
  isLoadingPlan;

  set data(data) {
    this.clientData = data;
  }

  constructor(private eventservice: EventService, public subInjectService: SubscriptionInject,
    private subService: SubscriptionService) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getPlanOfAdvisor();
  }

  getPlanOfAdvisor() {
    const obj = {
      advisorId: this.advisorId
    };
    this.isLoadingPlan = true;
    this.subService.getPlanOfAdvisorClients(obj).subscribe(
      data => {
        this.isLoadingPlan = false;
        if (data && data.length > 0) {
          this.noDataFoundFlag = false;
          this.planSettingData = data;
        } else {
          this.noDataFoundFlag = true;
        }


      }, error => {
        this.isLoadingPlan = false;
      }

    );
  }

  createSubscription() {
    this.selectedPlanList = [];
    this.planSettingData.forEach(singlePlan => {
      if (singlePlan.selected) {
        this.selectedPlanList.push({
          advisorId: this.advisorId,
          planId: singlePlan.id,
          clientId: this.clientData.id,
          planName: singlePlan.name
        });
      }
    });
    if (this.selectedPlanList.length > 0) {
      this.barButtonOptions.active = true;
      // const data = [{
      //   advisorId: this.advisorId,
      //   planId: this.selectedPlan.id,
      //   clientId: this.clientData.id,
      //   planName: this.selectedPlan.name
      // }];
      this.subService.createSubscription(this.selectedPlanList).subscribe(
        data => this.createSubscriptionResponse(data)
      );
    } else {
      return;
    }
  }

  createSubscriptionResponse(data) {
    this.barButtonOptions.active = false;
    this.eventservice.openSnackBar('Plan is created', 'Dismiss');
    this.Close(true);
  }

  select(data) {
    if (data.selected) {
      data.selected = false;
      // this.selectedPlanList = this.selectedPlanList.filter(element => element.id != data.id);
    } else {
      // this.selectedPlanList.push({
      //   advisorId: this.advisorId,
      //   planId: data.id,
      //   clientId: this.clientData.id,
      //   planName: data.name
      // });
      data.selected = true;
    }
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}
