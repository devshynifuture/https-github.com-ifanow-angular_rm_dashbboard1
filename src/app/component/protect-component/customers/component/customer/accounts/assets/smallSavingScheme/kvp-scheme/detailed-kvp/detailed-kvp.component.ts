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

  clientFamilybankList:any = [];
  ngOnInit() {
    this.bankList = this.enumService.getBank();
    this.clientFamilybankList = this.enumService.getclientFamilybankList();
    console.log(this.bankList, 'this.bankList', this.clientFamilybankList);
    console.log('DetailedKvpComponent ngOnInit data : ', this.data);

  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
