import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fatca-details-inn',
  templateUrl: './fatca-details-inn.component.html',
  styleUrls: ['./fatca-details-inn.component.scss']
})
export class FatcaDetailsInnComponent implements OnInit {


  constructor(public subInjectService: SubscriptionInject,private fb: FormBuilder,
    private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService,
     public eventService: EventService) { }

  ngOnInit() {
  }
  close(){
    const fragmentData = {
      direction: 'top',
      componentName: FatcaDetailsInnComponent,
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
}