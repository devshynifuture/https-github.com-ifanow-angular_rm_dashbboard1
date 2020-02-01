import {UtilService} from './../../../../../services/util.service';
import {SubscriptionInject} from './../../Subscriptions/subscription-inject.service';
import {Component, OnInit} from '@angular/core';
import {EventService} from 'src/app/Data-service/event.service';
import {TransactionAddComponent} from './../transaction-add/transaction-add.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  constructor(private eventService: EventService, private subInjectService: SubscriptionInject) {
  }

  _value: number;

  set value(value: number) {
    console.log('now value is ->>>>', value);
    this._value = value;
  }

  ngOnInit() {
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

  openNewTransaction() {
    const fragmentData = {
      flag: 'addNewTransaction',
      data: null,
      id: 1,
      state: 'open65',
      componentName: TransactionAddComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

  tabClick(event) {

  }
}
