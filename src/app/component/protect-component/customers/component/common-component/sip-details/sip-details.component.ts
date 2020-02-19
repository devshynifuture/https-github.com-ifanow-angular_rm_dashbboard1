import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../customer/customer.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-sip-details',
  templateUrl: './sip-details.component.html',
  styleUrls: ['./sip-details.component.scss']
})
export class SipDetailsComponent implements OnInit {
  inputData: any;
  sipDetails: any;

  constructor(private subInjectService:SubscriptionInject,private custumService:CustomerService,private eventService:EventService) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.getSipDetails(this.inputData)
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }
  getSipDetails(data){
    const obj = {
      mfId: 1
    }
    this.custumService.getMfSipDetails(obj).subscribe(
      data => this.getSipDetailsResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getSipDetailsResponse(data){
    this.sipDetails=data.sipMFList;
  }
  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}