import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-err-page-open',
  templateUrl: './err-page-open.component.html',
  styleUrls: ['./err-page-open.component.scss']
})
export class ErrPageOpenComponent implements OnInit {
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
      this.fragmentData.positiveMethod();
  }
}
