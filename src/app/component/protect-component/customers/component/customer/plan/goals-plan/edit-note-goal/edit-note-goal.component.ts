import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-note-goal',
  templateUrl: './edit-note-goal.component.html',
  styleUrls: ['./edit-note-goal.component.scss']
})
export class EditNoteGoalComponent implements OnInit {

  constructor(
    private subInjectService: SubscriptionInject, 
    private formBuilder: FormBuilder
  ) { }

  @Input() popupHeaderText: string = 'ADD PLANNER NOTES';
  @Input() data: any = {};
  planner: FormGroup;
  updatedOn: Date;

  ngOnInit() {
    this.getdataForm();
  }

  getdataForm() {
    this.planner = this.formBuilder.group({
      plannerNote: [!this.data ? '' : this.data.plannerNote, [Validators.required]],
      hiddenFromClient: [!this.data ? '' : this.data.hiddenFromClient]
    });

    this.updatedOn = new Date();
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
