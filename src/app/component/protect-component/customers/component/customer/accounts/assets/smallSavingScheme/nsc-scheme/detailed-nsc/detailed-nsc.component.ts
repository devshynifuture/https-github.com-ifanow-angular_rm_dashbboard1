import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-detailed-nsc',
  templateUrl: './detailed-nsc.component.html',
  styleUrls: ['./detailed-nsc.component.scss']
})
export class DetailedNscComponent implements OnInit {
  nominee: any;
  isLoading = false;
  bankList:any = [];

  constructor(private subInjectService: SubscriptionInject,  private enumService: EnumServiceService) {
  }

  data;

  ngOnInit() {
    this.nominee = this.data.nominees;
    this.bankList = this.enumService.getBank();

  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
