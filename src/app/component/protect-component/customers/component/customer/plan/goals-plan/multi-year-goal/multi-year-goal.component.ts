import { Component, OnInit, Input } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-multi-year-goal',
  templateUrl: './multi-year-goal.component.html',
  styleUrls: ['./multi-year-goal.component.scss']
})
export class MultiYearGoalComponent implements OnInit {
  goalTypeData: { name: string; };
  Questions: any;

  constructor(private eventService: EventService,private fb:FormBuilder) { }

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
  multiYearGoalForm=this.fb.group({
    name:[,[Validators.required]],
    retirementAge:[,[Validators.required]],
    monthlyExpenses:[,[Validators.required]],
    expenseChanges:[,[Validators.required]],
    milstones:[,[Validators.required]],
    goalName:[,[Validators.required]],
    notes:[,[Validators.required]]
  })
  close(state) {
    const fragmentData = {
      // direction: 'top',
      // componentName: AddGoalsComponent,
      state: 'close'
    };
    this.eventService.changeUpperSliderState(fragmentData)

  }
  open(){
    
  }
}
