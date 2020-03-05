import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { FormBuilder } from '@angular/forms';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-nominee-details',
  templateUrl: './nominee-details.component.html',
  styleUrls: ['./nominee-details.component.scss']
})
export class NomineeDetailsComponent implements OnInit {
  
  constructor(public subInjectService: SubscriptionInject,private fb: FormBuilder,
    private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService,
     public eventService: EventService) { }

  ngOnInit() {
  }
  close(){
    const fragmentData = {
      direction: 'top',
      componentName: NomineeDetailsComponent,
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
}
