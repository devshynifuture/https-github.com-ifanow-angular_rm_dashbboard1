import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-status-report',
  templateUrl: './status-report.component.html',
  styleUrls: ['./status-report.component.scss']
})
export class StatusReportComponent implements OnInit {
  inputData: any;

  constructor(
    private subInjectService : SubscriptionInject,
  ) { }
  @Input()
  set data(data) {
    this.inputData = data;
    if (data) {
      console.log('This is Input data of proceed ', data);
    }
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }
  close() {
      this.subInjectService.changeNewRightSliderState({
        state: 'close',
      });
  }
}
