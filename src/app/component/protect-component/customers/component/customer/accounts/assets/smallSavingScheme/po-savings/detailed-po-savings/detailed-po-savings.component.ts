import { SubscriptionInject } from './../../../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-detailed-po-savings',
  templateUrl: './detailed-po-savings.component.html',
  styleUrls: ['./detailed-po-savings.component.scss']
})
export class DetailedPoSavingsComponent implements OnInit {
  nominee: any;

  constructor(public utils: UtilService,private subInjectService: SubscriptionInject) { }
  data;
  ngOnInit() {
    this.nominee=this.data.nominees;
  }


  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
