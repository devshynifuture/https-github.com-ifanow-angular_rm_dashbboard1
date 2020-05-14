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
  isLoading: boolean;
  sipDetails: any[];

  constructor(private subInjectService:SubscriptionInject,private custumService:CustomerService,private eventService:EventService) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.isLoading = true;
    this.getSipDetails(this.inputData)
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }
  getSipDetails(data){
    const obj = {
      mfId: this.inputData.id
    }
    this.custumService.getMfSipDetails(obj).subscribe(
      data => this.getSipDetailsResponse(data), (error) => {
        this.sipDetails = [];
        this.isLoading = false;
      }
    );
  }
  getSipDetailsResponse(data){
    this.isLoading = false;
    if(data){
      this.sipDetails=data.sipMFList;
    }else{
      this.isLoading = false;
      this.sipDetails = [];
    }
  }
  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}