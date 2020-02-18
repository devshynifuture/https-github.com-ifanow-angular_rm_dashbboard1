import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-arn-ria-details',
  templateUrl: './add-arn-ria-details.component.html',
  styleUrls: ['./add-arn-ria-details.component.scss']
})
export class AddArnRiaDetailsComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject, ) { }

  ngOnInit() {
  }
  Close(data) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: data });
    console.log("state close1", data);

  }
}
