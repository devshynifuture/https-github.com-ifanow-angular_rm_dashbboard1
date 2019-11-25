import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-profile-plan',
  templateUrl: './add-profile-plan.component.html',
  styleUrls: ['./add-profile-plan.component.scss']
})
export class AddProfilePlanComponent implements OnInit {
  _inputData: any;
  constructor(private subInjectService:SubscriptionInject) { }

  ngOnInit() {
  }

  close(){
    let data=this._inputData;
     this.subInjectService.changeNewRightSliderState({ state: 'close',data });
   }

}
