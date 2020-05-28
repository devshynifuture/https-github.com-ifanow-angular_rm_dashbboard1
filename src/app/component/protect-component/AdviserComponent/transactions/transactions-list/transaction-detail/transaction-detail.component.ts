import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../Subscriptions/subscription-inject.service';
import {OnlineTransactionService} from '../../online-transaction.service';
import {EventService} from 'src/app/Data-service/event.service';
import {detailStatusObj} from './detailStatus';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent implements OnInit {
  transactionData: any;
  // transactionData: any;
  transactionStatusList;
  isLoading = false;
  showBankDetail = false;

  constructor(private eventService: EventService, private subInjectService: SubscriptionInject,
              private onlineTransact: OnlineTransactionService) {
  }

  set data(data) {
    console.log('transaction detail : ', data);
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
        break;
    }
    this.transactionStatusList.forEach(element => {
      (element.status <= data.status) ? element.checked = true : element.checked = false;
    });
    if (data.status == 7) {
      this.transactionStatusList = this.transactionStatusList.filter((item) => item.checked !== false);
    } else if (data.status == 8) {
      this.transactionStatusList = this.transactionStatusList.filter((item) => item.checked !== false);
    }
    // this.getTransactionDetail(data);
  }

  ngOnInit() {
    this.setPaymentMode();
  }

  getTransactionDetail(data) {
    this.isLoading = true;
    const obj = {
      id: data.id
    };
    this.onlineTransact.getTransactionDetail(obj).subscribe(
      responseData => {
        this.isLoading = false;
        this.transactionData = responseData;
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  setPaymentMode() {
    if (this.transactionData.paymentMode == 'OL') {
      this.transactionData.paymentMode = 'Online';
      this.showBankDetail = true;
    } else if (this.transactionData.paymentMode == 'M') {
      this.transactionData.paymentMode = 'Debit Mandate';
      this.showBankDetail = false;
    } else {
      this.transactionData.paymentMode = 'Online';
      this.showBankDetail = true;
    }
  }

  refresh(data) {
    this.getTransactionDetail(data);
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close', data: this.transactionData});
  }
}
