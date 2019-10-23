import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {SubscriptionService} from '../../../subscription.service';
import * as _ from 'lodash';
import {AuthService} from "../../../../../../../auth-service/authService";

@Component({
  selector: 'app-plan-rightslider',
  templateUrl: './plan-rightslider.component.html',
  styleUrls: ['./plan-rightslider.component.scss']
})
export class PlanRightsliderComponent implements OnInit {
  planSettingData;
  selectedPlan = [];
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
      // advisorId: 12345
    };
    this.subService.getPlanOfAdvisorClients(obj).subscribe(
      data => this.planSettingData = data
    );
  }

  createSubscription() {
    if (this.selectedPlan.length > 0) {
      const obj = [];
      this.selectedPlan.forEach(element => {
        const data = {
          advisorId: this.advisorId,
          // advisorId: 12345,
          planId: element.id,
          clientId: this.clientData.id,
          planName: element.name
        };
        obj.push(data);
        }
      );
      console.log(obj);
      this.subService.createSubscription(obj).subscribe(
        data => console.log('create subscriptuion', data)
      );
    } else {
      return;
    }
  }

  select(data) {
    (data.selected) ? this.unselectPlan(data) : this.selectPlan(data);
  }

  selectPlan(data) {
    data.selected = true;
    this.selectedPlan.push(data);
    console.log(this.selectedPlan.length);
  }

  unselectPlan(data) {
    data.selected = false;
    _.remove(this.selectedPlan, function (delData) {
      return delData.id == data.id;
    });
    console.log(this.selectedPlan.length);
  }

  Close(state) {
    this.subInjectService.rightSliderData(state);
  }
}
