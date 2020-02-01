import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-ppf',
  templateUrl: './detailed-ppf.component.html',
  styleUrls: ['./detailed-ppf.component.scss']
})
export class DetailedPpfComponent implements OnInit {
  data;
  nominee: any;
  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
    console.log(this.data);
    this.nominee=this.data.nominees;
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }


}
