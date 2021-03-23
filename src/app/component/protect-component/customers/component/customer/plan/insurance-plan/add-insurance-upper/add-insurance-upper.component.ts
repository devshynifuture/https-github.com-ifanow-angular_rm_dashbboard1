import { AuthService } from './../../../../../../../../auth-service/authService';
import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { AddLifeInsuranceComponent } from '../add-life-insurance/add-life-insurance.component';
import { AddHealthInsuranceComponent } from '../add-health-insurance/add-health-insurance.component';
import { ShowHealthPlanningComponent } from '../show-health-planning/show-health-planning.component';

@Component({
  selector: 'app-add-insurance-upper',
  templateUrl: './add-insurance-upper.component.html',
  styleUrls: ['./add-insurance-upper.component.scss']
})
export class AddInsuranceUpperComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject,
    private custumService: CustomerService,
    public authService: AuthService,
    private utils: UtilService,
    private eventService: EventService) { }
  logoText = ''
  ngOnInit() {
  }
  close(flag) {
    const fragmentData = {
      direction: 'top',
      componentName: AddInsuranceUpperComponent,
      state: 'close',
      data: flag,
      refreshRequired: flag

    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
  needAnlysis(value) {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
    const fragmentData = {
      flag: 'app-customer',
      id: 1,
      data: { value: value },
      direction: 'top',
      componentName: ShowHealthPlanningComponent,
      state: 'open'
    };
    // this.showInsurance.id = value;
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.close(false);
          subscription.unsubscribe();
        }
      }
    );

  }
  openHelthInsurance(obj) {
    let data;
    let component;
    if (!obj) {
      component = AddLifeInsuranceComponent;
    }
    else {
      component = AddHealthInsuranceComponent;
      data = {
        value: obj,
      }
    }
    const fragmentData = {
      flag: 'opencurrentpolicies',
      data,
      componentName: component,
      id: 1,
      state: 'open',
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (sideBarData.data == true) {
            const fragmentData = {
              direction: 'top',
              componentName: AddInsuranceUpperComponent,
              state: 'close',
              data: sideBarData.data
            };
            this.eventService.changeUpperSliderState(fragmentData);
          }
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}
