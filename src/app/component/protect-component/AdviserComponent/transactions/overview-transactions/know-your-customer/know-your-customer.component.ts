import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-know-your-customer',
  templateUrl: './know-your-customer.component.html',
  styleUrls: ['./know-your-customer.component.scss']
})
export class KnowYourCustomerComponent implements OnInit {

  constructor(public subInjectService: SubscriptionInject,private fb: FormBuilder,
     private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) { }

  ngOnInit() {
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag })
  }
  close() {
    const fragmentData = {
      direction: 'top',
      componentName: KnowYourCustomerComponent,
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
  openPersonalDetails(data) {
    const fragmentData = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: PersonalDetailsComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }
}
