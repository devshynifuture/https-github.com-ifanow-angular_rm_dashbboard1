import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-expenses',
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.scss']
})
export class AddExpensesComponent implements OnInit {

  constructor(private subInjectService:SubscriptionInject) { }

  ngOnInit() {
  }

  close(){
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
