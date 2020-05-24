import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-detailed-ssy',
  templateUrl: './detailed-ssy.component.html',
  styleUrls: ['./detailed-ssy.component.scss']
})
export class DetailedSsyComponent implements OnInit {
  nominee: any;
  isLoading = false;
  bankList:any = [];

  constructor(private subInjectService: SubscriptionInject,  private enumService: EnumServiceService) {
  }

  data;

  ngOnInit() {
    console.log('DetailedSsysComponent ngOnInit data : ', this.data);
    this.nominee = this.data.nominees;
    this.bankList = this.enumService.getBank();
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
