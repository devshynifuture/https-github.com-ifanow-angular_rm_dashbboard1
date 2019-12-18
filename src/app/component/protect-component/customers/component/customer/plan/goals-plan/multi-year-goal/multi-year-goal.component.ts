import { Component, OnInit, Input } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-multi-year-goal',
  templateUrl: './multi-year-goal.component.html',
  styleUrls: ['./multi-year-goal.component.scss']
})
export class MultiYearGoalComponent implements OnInit {
  goalTypeData: { name: string; };
  Questions: any;

  constructor(private eventService: EventService) { }

  ngOnInit() {
  }
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
  close(state) {
    const fragmentData = {
      // direction: 'top',
      // componentName: AddGoalsComponent,
      state: 'close'
    };
    this.eventService.changeUpperSliderState(fragmentData)

  }
}
