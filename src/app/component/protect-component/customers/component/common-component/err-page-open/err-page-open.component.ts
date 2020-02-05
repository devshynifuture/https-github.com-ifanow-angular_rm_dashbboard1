import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-err-page-open',
  templateUrl: './err-page-open.component.html',
  styleUrls: ['./err-page-open.component.scss']
})
export class ErrPageOpenComponent implements OnInit {
   barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'RETRY',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  }
  @Input()
  public positiveMethod: Function;
  fragmentData: any;
  constructor(private eventService:EventService) { }
  @Input()
  set data(data) {
    console.log(data);
    this.fragmentData=data
  }

  get data() {
    return this.data;
  }
  ngOnInit() {
  }

  close() {
    this.fragmentData.positiveMethod(this.barButtonOptions);
    }
}
