import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-income-family-member',
  templateUrl: './add-income-family-member.component.html',
  styleUrls: ['./add-income-family-member.component.scss']
})
export class AddIncomeFamilyMemberComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
  close(data) {
  
    this.subInjectService.changeNewRightSliderState({ state: 'close', data });
  }

}
