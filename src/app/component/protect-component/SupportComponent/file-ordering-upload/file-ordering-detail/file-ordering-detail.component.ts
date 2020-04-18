import { SubscriptionInject } from './../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-ordering-detail',
  templateUrl: './file-ordering-detail.component.html',
  styleUrls: ['./file-ordering-detail.component.scss']
})
export class FileOrderingDetailComponent implements OnInit {

  constructor(
    private subscriptionInject: SubscriptionInject
  ) { }

  data;

  ngOnInit() {
    console.log("file ordering detail data:::::::::::", this.data);
  }


  dialogClose() {
    this.subscriptionInject.changeNewRightSliderState({ state: 'close' });
  }

}
