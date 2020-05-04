import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-view-nps',
  templateUrl: './detailed-view-nps.component.html',
  styleUrls: ['./detailed-view-nps.component.scss']
})
export class DetailedViewNpsComponent implements OnInit {
  npsData: any;
  isLoading = false;

  constructor(private subInjectService: SubscriptionInject) {
  }

  ngOnInit() {
  }

  @Input()
  set data(data) {
    this.npsData = data;
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
