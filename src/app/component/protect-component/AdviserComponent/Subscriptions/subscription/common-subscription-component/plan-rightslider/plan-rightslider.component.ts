import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { SubscriptionService } from '../../../subscription.service';
import { AuthService } from "../../../../../../../auth-service/authService";
import { element } from 'protractor';
import { EventService } from 'src/app/Data-service/event.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

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
  }
  planSettingData;
  selectedPlan;
  clientData;
  advisorId;
  set data(data) {
    this.clientData = data;
  }
  constructor(private eventservice: EventService, public subInjectService: SubscriptionInject, private subService: SubscriptionService) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getPlanOfAdvisor();
  }

  getPlanOfAdvisor() {
    const obj = {
      advisorId: this.advisorId
    };
    this.subService.getPlanOfAdvisorClients(obj).subscribe(
      data => this.planSettingData = data
    );
  }

  createSubscription() {
    if (this.selectedPlan) {
      this.barButtonOptions.active = true;
      const data = [{
        advisorId: this.advisorId,
        planId: this.selectedPlan.id,
        clientId: this.clientData.id,
        planName: this.selectedPlan.name
      }];
      console.log(data);
      this.subService.createSubscription(data).subscribe(
        data => this.createSubscriptionResponse(data)
      );
    } else {
      return;
    }
  }
  createSubscriptionResponse(data) {
    this.barButtonOptions.active = false;
    this.eventservice.openSnackBar("plan is created", "dismiss")
    this.Close(true);
  }

  select(data) {
    this.planSettingData.forEach(element => {
      if (data.id == element.id) {
        data.selected = true
        this.selectedPlan = data
      }
      else {
        element.selected = false;
      }
    })
  }
  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}
