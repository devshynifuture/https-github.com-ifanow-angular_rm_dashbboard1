import { Component, OnInit } from '@angular/core';
import { SubscriptionComponent } from '../../subscription.component';
import { SubscriptionInject } from '../../../subscription-inject.service';
@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  constructor(public subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
  Close(value) {
    this.subInjectService.changeUpperRightSliderState({ state: 'close' });
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
