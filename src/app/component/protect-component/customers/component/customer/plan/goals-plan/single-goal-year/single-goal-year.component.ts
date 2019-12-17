import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-single-goal-year',
  templateUrl: './single-goal-year.component.html',
  styleUrls: ['./single-goal-year.component.scss']
})
export class SingleGoalYearComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) { }
  @Input() goalData;
  @Output() backToaddGoal = new EventEmitter();
  ngOnInit() {
  }
  back() {
    this.backToaddGoal.emit(undefined);
  }
  close() {
    
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  
}
