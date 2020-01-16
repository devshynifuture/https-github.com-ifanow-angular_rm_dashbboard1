import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cashflow-upper-slider',
  templateUrl: './cashflow-upper-slider.component.html',
  styleUrls: ['./cashflow-upper-slider.component.scss']
})
export class CashflowUpperSliderComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject,
    private eventService: EventService) { }

  ngOnInit() {
  }

  close() {
    this.eventService.changeUpperSliderState({ state: 'close' });
  }

}
