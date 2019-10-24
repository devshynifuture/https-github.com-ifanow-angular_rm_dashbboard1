import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionService} from '../../../subscription.service';
import * as _ from 'lodash';
import {EventService} from 'src/app/Data-service/event.service';
import {AuthService} from "../../../../../../../auth-service/authService";

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {

  constructor(private subService: SubscriptionService, private eventService: EventService) {
  }

  @Input() componentFlag: string;
  @Input() upperData;
  servicePlanData;
  mappedPlan = [];
  advisorId;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getPlansMappedToAdvisor();
  }

  getPlansMappedToAdvisor() {
    const obj = {
      // advisorid: 12345,
      advisorId: this.advisorId,

      serviceId: this.upperData ? this.upperData.id : null
    };
    this.subService.getPlansMappedToAdvisor(obj).subscribe(
      data => this.getPlansMappedToAdvisorResponse(data)
    );
  }

  getPlansMappedToAdvisorResponse(data) {
    console.log('service plan data', data);

    this.servicePlanData = data;
    this.servicePlanData.forEach(element => {
      if (element.selected == true) {
        this.mappedPlan.push(element);
      }
    });
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({state: 'close'});
  }

  selectServicePlan(data) {

    (data.selected) ? this.unmapPlanToService(data) : this.mapPlanToService(data);
  }

  mapPlanToService(data) {
    data.selected = true;
    console.log(data);
    this.mappedPlan.push(data);
  }

  unmapPlanToService(data) {
    data.selected = false;
    _.remove(this.mappedPlan, function (delData) {
      return delData.id == data.id;
    });
    console.log(data);
  }

  saveMappedPlans() {
    console.log('Mapped Plan', this.mappedPlan);
    console.log('clientId', this.upperData);
    const obj = [];
    this.mappedPlan.forEach(planData => {
      const data = {
        // advisorId: 12345,
        advisorId: this.advisorId,

        planId: planData.id,
        serviceId: this.upperData ? this.upperData.id : null
      };
      obj.push(data);
    });
    console.log('Mapped Plans', obj);

    this.subService.mapPlanToServiceSettings(obj).subscribe(
      data => this.saveMappedPlansResponse(data)
    );
  }

  saveMappedPlansResponse(data) {
    this.eventService.openSnackBar('Plan is mapped', 'OK');
  }
}
