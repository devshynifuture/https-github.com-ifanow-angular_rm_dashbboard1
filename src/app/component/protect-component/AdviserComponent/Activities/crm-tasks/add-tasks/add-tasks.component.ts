import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-tasks',
  templateUrl: './add-tasks.component.html',
  styleUrls: ['./add-tasks.component.scss']
})
export class AddTasksComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) {
  }

  displayFn = (item) => {
  };

  ngOnInit() {
  }

  close(flag) {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

  getFileData(fileList: FileList) {
    let fileData = fileList.item(0);
  }

}




