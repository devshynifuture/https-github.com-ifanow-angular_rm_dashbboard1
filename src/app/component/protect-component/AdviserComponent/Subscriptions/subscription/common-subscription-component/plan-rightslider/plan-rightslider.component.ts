import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { SubscriptionService } from '../../../subscription.service';
import * as _ from 'lodash';
import { AuthService } from "../../../../../../../auth-service/authService";
import { element } from 'protractor';

@Component({
  selector: 'app-plan-rightslider',
  templateUrl: './plan-rightslider.component.html',
  styleUrls: ['./plan-rightslider.component.scss']
})
export class PlanRightsliderComponent implements OnInit {
  planSettingData;
  selectedPlan;
  @Input() clientData;
  advisorId;

  constructor(public subInjectService: SubscriptionInject, private subService: SubscriptionService) {
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
    this.subInjectService.rightSideData('close')
    this.subInjectService.rightSliderData('close');

  }

  select(data) {
    this.planSettingData.forEach(element=>{
      if(data.id==element.id)
      {
        data.selected=true
        this.selectedPlan=data
      }
      else{
        element.selected=false;
      }
    })
     }
  Close() {
    this.subInjectService.changeUpperRightSliderState({state: 'close'});
  }
}
