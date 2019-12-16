import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-single-goal-year',
  templateUrl: './single-goal-year.component.html',
  styleUrls: ['./single-goal-year.component.scss']
})
export class SingleGoalYearComponent implements OnInit {

  constructor() { }
  @Input() goalData;
  @Output() backToaddGoal = new EventEmitter();
  ngOnInit() {
  }
  back() {
    this.backToaddGoal.emit(undefined);
  }
}
