import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { FormBuilder } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { DatePipe } from '@angular/common';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-back-details',
  templateUrl: './back-details.component.html',
  styleUrls: ['./back-details.component.scss']
})
export class BackDetailsComponent implements OnInit {

  constructor(public subInjectService: SubscriptionInject,private fb: FormBuilder,
    private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) { }

  ngOnInit() {
  }
  close(){
    const fragmentData = {
      direction: 'top',
      componentName: BackDetailsComponent,
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
}
