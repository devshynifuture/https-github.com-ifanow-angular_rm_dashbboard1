import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-settings-subscription',
  templateUrl: './settings-subscription.component.html',
  styleUrls: ['./settings-subscription.component.scss']
})
export class SettingsSubscriptionComponent implements OnInit {

  constructor() {
  }

  selected = 0;
  selectedTab;

  ngOnInit() {
    this.selectedTab = 'PLANS';
    // this.selectedTab = 'SERVICES';
    this.selected = 6;
  }

  tabClick(value) {
    this.selectedTab = value.tab.textLabel;
  }
}
