import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-email-add-task',
  templateUrl: './email-add-task.component.html',
  styleUrls: ['./email-add-task.component.scss']
})
export class EmailAddTaskComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
    console.log('this works->>>>>>>>>>>>>>>');
  }

  Close(state) {
    this.subInjectService.rightSliderData(state);
  }

}
