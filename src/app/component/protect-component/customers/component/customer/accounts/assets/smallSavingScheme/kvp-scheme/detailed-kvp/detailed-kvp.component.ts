import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-detailed-kvp',
  templateUrl: './detailed-kvp.component.html',
  styleUrls: ['./detailed-kvp.component.scss']
})
export class DetailedKvpComponent implements OnInit {
  data;
  isLoading = false;
  bankList:any = [];

  constructor(private subInjectService: SubscriptionInject,  private enumService: EnumServiceService) {
  }

  ngOnInit() {
    console.log('DetailedKvpComponent ngOnInit data : ', this.data);
    this.bankList = this.enumService.getBank();

  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
