import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../Subscriptions/subscription-inject.service';
import {OnlineTransactionService} from '../../online-transaction.service';
import {EventService} from 'src/app/Data-service/event.service';
import {detailStatusObj} from './detailStatus';

@Component({
  selector: 'app-transactions-history',
  templateUrl: './transactions-history.component.html',
  styleUrls: ['./transactions-history.component.scss']
})
export class TransactionsHistoryComponent implements OnInit {
  transactionData: any;
  transactionDetailData: any;
  transactionStatusList;
  isLoading = false;

  constructor(private eventService: EventService, private subInjectService: SubscriptionInject,
              private onlineTransact: OnlineTransactionService) {
  }

  set data(data) {
    console.log(data);
    this.transactionData = data;
    switch (true) {
      case (this.transactionData.transactionType == 'ORDER' || this.transactionData.transactionType == 'PURCHASE'):
        this.transactionStatusList = detailStatusObj.transactionDetailStatus.ORDER;
        break;
      case (this.transactionData.transactionType == 'REDEMPTION'):
        this.transactionStatusList = detailStatusObj.transactionDetailStatus.REDEMPTION;
        break;
      case (this.transactionData.transactionType == 'SWP'):
        this.transactionStatusList = detailStatusObj.transactionDetailStatus.SWP;
        break;
      case (this.transactionData.transactionType == 'SWITCH'):
        this.transactionStatusList = detailStatusObj.transactionDetailStatus.SWITCH;
        break;
      case (this.transactionData.transactionType == 'STP'):
        this.transactionStatusList = detailStatusObj.transactionDetailStatus.STP;
        break;
      case (this.transactionData.transactionType == 'SIP'):
        this.transactionStatusList = detailStatusObj.transactionDetailStatus.ORDER;
        break;
      default:
        console.log('');
    }
    this.transactionStatusList.forEach(element => {
      (element.status <= data.status) ? element.checked = true : element.checked = false;
    });
    if (data.status == 7) {
      this.transactionStatusList = this.transactionStatusList.filter((item) => item.checked !== false);
    } else if (data.status == 8) {
      this.transactionStatusList = this.transactionStatusList.filter((item) => item.checked !== false);
    }
    this.getTransactionDetail(data);
  }

  ngOnInit() {
    console.log('status details', detailStatusObj);

  }

  getTransactionDetail(data) {
    this.isLoading = true;
    const obj = {
      id: data.id
    };
    this.onlineTransact.getTransactionDetail(obj).subscribe(
      responseData => {
        console.log(responseData);
        this.isLoading = false;

        this.transactionDetailData = responseData;
        if (this.transactionDetailData.paymentMode == 'OL') {
          this.transactionDetailData.paymentMode = 'Online';
        } else if (this.transactionDetailData.paymentMode == 'M') {
          this.transactionDetailData.paymentMode = 'Debit Mandate';
        } else {
          this.transactionDetailData.paymentMode = 'Online';
        }
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  refresh(data) {
    this.getTransactionDetail(data);
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
