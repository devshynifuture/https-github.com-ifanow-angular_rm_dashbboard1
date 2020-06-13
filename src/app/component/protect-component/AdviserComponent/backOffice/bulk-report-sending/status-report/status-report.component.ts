import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-status-report',
  templateUrl: './status-report.component.html',
  styleUrls: ['./status-report.component.scss']
})
export class StatusReportComponent implements OnInit {

  constructor(
    private subInjectService : SubscriptionInject,
  ) { }

  ngOnInit() {
  }
  close() {
      this.subInjectService.changeNewRightSliderState({
        state: 'close',
      });
  }
}
