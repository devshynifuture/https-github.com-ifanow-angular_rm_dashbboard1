import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
