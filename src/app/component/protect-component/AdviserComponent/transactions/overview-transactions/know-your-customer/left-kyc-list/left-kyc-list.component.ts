import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { PersonalDetailsComponent } from '../personal-details/personal-details.component';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EventService } from 'src/app/Data-service/event.service';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';

@Component({
  selector: 'app-left-kyc-list',
  templateUrl: './left-kyc-list.component.html',
  styleUrls: ['./left-kyc-list.component.scss']
})
export class LeftKycListComponent implements OnInit {
  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
    private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) { }

  ngOnInit() {
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag })
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
  openConractDetails(data) {
    const fragmentData = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: ContactDetailsComponent,
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
