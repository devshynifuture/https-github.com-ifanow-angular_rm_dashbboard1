import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-subscription',
  templateUrl: './settings-subscription.component.html',
  styleUrls: ['./settings-subscription.component.scss']
})
export class SettingsSubscriptionComponent implements OnInit {
  selected: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation.extras.replaceUrl == false && navigation.extras.state != undefined) {
      this.selected = navigation.extras.state.example;
    } else if (navigation.extras.replaceUrl == undefined && navigation.extras.state != undefined) {
      this.selected = navigation.extras.state.example;
    } else {
      this.selected = 0;
    }
  }
  @ViewChild(MatTabGroup, { static: true }) tabGroup: MatTabGroup;

  @Input() set sIndex(data) {
    this.tabGroup.selectedIndex = data
    this.selected = data
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
