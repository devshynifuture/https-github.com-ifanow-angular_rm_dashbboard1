import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionService} from '../../../subscription.service';
import * as _ from 'lodash';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {EventService} from '../../../../../../../Data-service/event.service';
import {AuthService} from "../../../../../../../auth-service/authService";

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  advisorId;

  @Input() componentFlag: string;
  planServiceData;
  mappedData;
  @Input() upperData;

  constructor(private eventService: EventService,
              private subService: SubscriptionService, private subinject: SubscriptionInject) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getPlanServiceData();
    this.mappedData = [];
  }

  getPlanServiceData() {
    const obj = {
      // advisorId: 12345,
      advisorId: this.advisorId,
      planId: this.upperData ? this.upperData.id : null
    };
    this.subService.getSettingPlanServiceData(obj).subscribe(
      data => this.getPlanServiceDataResponse(data)
    );
  }

  getPlanServiceDataResponse(data) {
    console.log('plan service', data);
    this.planServiceData = data;
    this.planServiceData.forEach(element => {
      if (element.selected == true) {
        this.mappedData.push(element);
      }
    });
  }

  selectService(data, index) {
    (data.selected) ? this.unmapPlanToService(data) : this.mapPlanToService(data, index);
    console.log(data);
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({state: 'close'});
  }

  mapPlanToService(data, index) {
    data.selected = true;
    this.mappedData.push(data);
    console.log(this.mappedData.length);
  }

  unmapPlanToService(data) {
    data.selected = false;
    _.remove(this.mappedData, delData => {
      return delData.id == data.id;
    });
    console.log(this.mappedData);
  }

  savePlanMapToService() {
    const obj = [];
    this.mappedData.forEach(element => {
      const data = {
        // advisorId: 12345,
        advisorId: this.advisorId,
        global: element.global,
        id: element.id,
        planId: this.upperData ? this.upperData.id : null
      };
      obj.push(data);
    });
    console.log(obj);
    this.subService.mapServiceToPlanData(obj).subscribe(
      data => console.log(data)
    );
  }
}
