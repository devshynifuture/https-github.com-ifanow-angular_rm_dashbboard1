import { SubscriptionInject } from './../../Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { Router } from '@angular/router';
import { TransactionRoleService } from '../transaction-role.service';
import { EnumDataService } from 'src/app/services/enum-data.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  settingIndex: number;

  constructor(private eventService: EventService,
    private subInjectService: SubscriptionInject, private router: Router,
    public transactionRoleService: TransactionRoleService,
    public enumDataService: EnumDataService) {
  }

  _value: number;

  set value(value: number) {
    this._value = value;
  }

  ngOnInit() {
    if (this.router.url.split('/')[3] === 'overview') {
      this._value = 1;
    } else if (this.router.url.split('/')[3] === 'clients') {
      this._value = 2;
    } else if (this.router.url.split('/')[3] === 'transactions') {
      this._value = 3;
    } else if (this.router.url.split('/')[3] === 'investors') {
      this._value = 4;
    } else if (this.router.url.split('/')[3] === 'mandates') {
      this._value = 5;
    } else if (this.router.url.split('/')[3] === 'kyc') {
      this._value = 6;
    } else if (this.router.url.split('/')[3] === 'settings') {
      this._value = 7;
    }
  }

  tabClick(event) {
    this.eventService.sidebarData(event.tab.textLabel);
    if (event.index != 6) {
      this.settingIndex = 0;
    }
  }
}
