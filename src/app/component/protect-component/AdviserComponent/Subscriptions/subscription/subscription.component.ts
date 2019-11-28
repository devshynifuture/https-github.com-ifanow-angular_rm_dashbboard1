import {Component, OnInit, ViewChild} from '@angular/core';
import {EventService} from 'src/app/Data-service/event.service';
import {EnumDataService} from "../../../../../services/enum-data.service";
import { MatTabGroup } from '@angular/material';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  settingIndex: number;
  constructor(private eventService: EventService, private enumDataService: EnumDataService) {
    this.eventService.sidebarSubscribeData.subscribe(
      data => this.getFileResponseDataAum(data)
    );
    this.eventService.tabChangeData.subscribe(
      data => this.getTabChangeData(data)
    );
  }
  @ViewChild(MatTabGroup,{static:true}) tabGroup: MatTabGroup;

  subscriptionTab;

  selected: any;

  ngOnInit() {
    // this.currentState = 'close';
    this.enumDataService.getDataForSubscriptionEnumService();

    // this.selected = 6;
  }
  getIndex(value)
  {
    console.log(this.tabGroup)
    if(value.selectedSettingTab)
    {
      this.tabGroup.selectedIndex=value.selectedTab;
      this.settingIndex=value
    }
    // this.selected=index
  }
  getFileResponseDataAum(data) {
    this.subscriptionTab = data;
  }

  getTabChangeData(data) {
    if(data=="")
    {
      return
    }
    this.tabGroup.selectedIndex=6
    if(data==6)
    {
      this.settingIndex=3
    }
  }

  tabClick(event) {
    this.eventService.sidebarData(event.tab.textLabel);
  }
  help() {

  }
}
