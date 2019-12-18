import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-single-goal-year',
  templateUrl: './single-goal-year.component.html',
  styleUrls: ['./single-goal-year.component.scss']
})
export class SingleGoalYearComponent implements OnInit {
  Questions: any;
  goalTypeData: any;

  constructor(private eventService: EventService) { }
  @Input() set goalData(data) {
    console.log(data)
    if (data == undefined) {
      let name = { name: '' };
      this.goalTypeData = name;
      return;
    }
    this.goalTypeData = data;
    this.Questions = data.questions;
  };
  @Output() backToaddGoal = new EventEmitter();
  ngOnInit() {
  }
  back() {
    this.backToaddGoal.emit(undefined);
  }
  close(state) {
    const fragmentData = {
      // direction: 'top',
      // componentName: AddGoalsComponent,
      state: 'close'
    };
    this.eventService.changeUpperSliderState(fragmentData)
  }
}
