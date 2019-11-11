import {Component, OnInit} from '@angular/core';
import {EventService} from 'src/app/Data-service/event.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SubscriptionInject} from '../subscription-inject.service';
import {EnumDataService} from "../../../../../services/enum-data.service";

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  constructor(private eventService: EventService, private enumDataService: EnumDataService) {
    this.eventService.sidebarSubscribeData.subscribe(
      data => this.getFileResponseDataAum(data)
    );
    this.eventService.tabChangeData.subscribe(
      data => this.getTabChangeData(data)
    );
  }

  subscriptionTab;

  selected: any;

  ngOnInit() {
    // this.currentState = 'close';
    this.enumDataService.getDataForSubscriptionEnumService();

    // this.selected = 6;
  }

  getFileResponseDataAum(data) {
    this.subscriptionTab = data;
  }

  getTabChangeData(data) {
    this.selected = data;
  }

  tabClick(event) {
    this.eventService.sidebarData(event.tab.textLabel);
  }

  help() {

  }
}
