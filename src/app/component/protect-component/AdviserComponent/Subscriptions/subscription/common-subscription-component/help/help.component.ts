import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionComponent } from '../../subscription.component';
import { SubscriptionInject } from '../../../subscription-inject.service';
@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  inputData: any;

  constructor(public subInjectService: SubscriptionInject) { }
  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    console.log(this.inputData);
  }
  Close(value) {
    this.subInjectService.changeUpperRightSliderState({ state: 'close' });
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
