import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-sub-broker-credentials',
  templateUrl: './add-sub-broker-credentials.component.html',
  styleUrls: ['./add-sub-broker-credentials.component.scss']
})
export class AddSubBrokerCredentialsComponent implements OnInit {

  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
}
