import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-edit-note-goal',
  templateUrl: './edit-note-goal.component.html',
  styleUrls: ['./edit-note-goal.component.scss']
})
export class EditNoteGoalComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
  close() {
    
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
