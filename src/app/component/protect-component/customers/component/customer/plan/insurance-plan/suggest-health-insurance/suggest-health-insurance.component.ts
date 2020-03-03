import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';

@Component({
  selector: 'app-suggest-health-insurance',
  templateUrl: './suggest-health-insurance.component.html',
  styleUrls: ['./suggest-health-insurance.component.scss']
})
export class SuggestHealthInsuranceComponent implements OnInit {
  inputData: any;
  showInsurance: any;

  constructor(private subInjectService: SubscriptionInject, private custumService: CustomerService,) { }

  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    console.log('heder',this.inputData)
    this.showInsurance = this.inputData
  }
  close(data) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', data});
  }
  
}
