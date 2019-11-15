import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';

@Component({
  selector: 'app-nps-scheme-holding',
  templateUrl: './nps-scheme-holding.component.html',
  styleUrls: ['./nps-scheme-holding.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
  
})
export class NpsSchemeHoldingComponent implements OnInit {

  constructor(private router: Router,private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe) { }

  ngOnInit() {
  }
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' })
  }
}
