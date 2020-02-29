import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { OnlineTransactionService } from '../../online-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { from } from 'rxjs';
import { detailStatusObj } from './detailStatus'
@Component({
  selector: 'app-transactions-history',
  templateUrl: './transactions-history.component.html',
  styleUrls: ['./transactions-history.component.scss']
})
export class TransactionsHistoryComponent implements OnInit {
  transactionData: any;
  transactionDetailData: any;
  isLinear = false;
  processDetails: any;
  transactionDetails;
  constructor(private eventService: EventService, private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService) { }
  ngOnInit() {
    console.log("status details", detailStatusObj)

  }
  set data(data) {
    console.log(data)
    this.transactionData = data;
    switch (true) {
      case (this.transactionData.transactionType == "ORDER"):
        this.transactionDetails = detailStatusObj.transactionDetailStatus.ORDER;
        break;
      case (this.transactionData.transactionType == "REDEMPTION"):
        this.transactionDetails = detailStatusObj.transactionDetailStatus.REDEMPTION;
        break;
      case (this.transactionData.transactionType == "SWP"):
        this.transactionDetails = detailStatusObj.transactionDetailStatus.SWP;
        break;
      case (this.transactionData.transactionType == "SWITCH"):
        this.transactionDetails = detailStatusObj.transactionDetailStatus.SWITCH;
        break;
      case (this.transactionData.transactionType == "STP"):
        this.transactionDetails = detailStatusObj.transactionDetailStatus.STP;
        break;
      default:
        console.log("")
    }
    this.transactionDetails.forEach(element => {
      (element.status <= data.status) ? element.checked = true : element.checked = false
    });
    this.getTransactionDetail(data);
  }

  getTransactionDetail(data) {
    let obj =
    {
      id: data.id
    }
    this.onlineTransact.getTransactionDetail(obj).subscribe(
      data => {
        console.log(data);
        this.transactionDetailData = data;
      },
      err => this.eventService.openSnackBar(err, "dismiss")
    )
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
