import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material';

@Component({
  selector: 'app-settings-subscription',
  templateUrl: './settings-subscription.component.html',
  styleUrls: ['./settings-subscription.component.scss']
})
export class SettingsSubscriptionComponent implements OnInit {
  selected: any;

  constructor() {

  }
  @ViewChild(MatTabGroup, { static: true }) tabGroup: MatTabGroup;

  @Input() set sIndex(data) {
    this.tabGroup.selectedIndex = data
    this.selected=data
  };
  selectedTab;

  ngOnInit() {
    this.selectedTab = 'PLANS';
    // this.tabGroup.selectedIndex = 0;
  }

  // tabClick(value) {
  //   this.selectedTab = value.tab.textLabel;
  // }
}
