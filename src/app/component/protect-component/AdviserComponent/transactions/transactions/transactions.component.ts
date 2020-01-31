import { UtilService } from '../../../../../services/util.service';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { TransactionAddComponent } from '../transaction-add/transaction-add.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  constructor(private eventService: EventService, private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }

  _value: number;
  set value(value: number) {
    console.log('now value is ->>>>', value);
    this._value = value;
  }
}
