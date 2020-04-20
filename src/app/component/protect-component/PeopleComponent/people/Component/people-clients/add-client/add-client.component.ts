import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { PeopleService } from '../../../../people.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {
  headingData: any;
  tabData: any = {};

  constructor(private subInjectService: SubscriptionInject) { }
  ngOnInit() {
  }
  @Input() set data(data) {
    this.headingData = data;
    console.log(data);
    this.tabData = data;
  }
  selected = 0;
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close', clientData: this.tabData });
  }
  getTabData(data) {
    console.log(data);
    (data == undefined) ? this.tabData = { id: undefined } : this.tabData = data;
  }
  changeTab(flag) {
    (flag == 1) ? this.selected++ : '';
  }

}
