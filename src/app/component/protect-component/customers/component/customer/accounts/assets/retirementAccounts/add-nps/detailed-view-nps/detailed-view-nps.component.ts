import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-detailed-view-nps',
  templateUrl: './detailed-view-nps.component.html',
  styleUrls: ['./detailed-view-nps.component.scss']
})
export class DetailedViewNpsComponent implements OnInit {
  npsData: any;
  isLoading = false;
  bankList:any =[];

  constructor(private subInjectService: SubscriptionInject, private enumService: EnumServiceService) {
  }

  ngOnInit() {
    this.npsData

    //link bank
    this.bankList = this.enumService.getBank();
    //link bank
  }

  @Input()
  set data(data) {
    this.npsData = data;
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
