import {Component, OnInit, ViewChild} from '@angular/core';
import {EventService} from 'src/app/Data-service/event.service';
import {EnumDataService} from "../../../../../services/enum-data.service";
import { MatTabGroup } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  settingIndex: number;
  _value: number;
  set value(value: number) {
    console.log('now value is ->>>>', value);
    this._value = value;
  }
  constructor(private eventService: EventService, private enumDataService: EnumDataService,private router: Router) {
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
    this.selected = 1;
    console.log('this is child url now->>>>>', this.router.url.split('/')[3]);
    if (this.router.url.split('/')[3] === 'dashboard') {
      this._value = 1;
    } else if (this.router.url.split('/')[3] === 'clients') {
      this._value = 2;
    } else if (this.router.url.split('/')[3] === 'subscriptions') {
      this._value = 3;
    } else if (this.router.url.split('/')[3] === 'quotations') {
      this._value = 4;
    } else if (this.router.url.split('/')[3] === 'invoices') {
      this._value = 5;
    }else if (this.router.url.split('/')[3] === 'documents') {
      this._value = 6;
    }else if (this.router.url.split('/')[3] === 'settings') {
      this._value = 7;
    }

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
    if(event.index!=6)
    {
      this.settingIndex=0
    }
  }
  help() {

  }
}
