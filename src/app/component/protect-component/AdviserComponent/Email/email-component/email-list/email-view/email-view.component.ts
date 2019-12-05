import { SubscriptionInject } from './../../../../Subscriptions/subscription-inject.service';
import { UtilService } from './../../../../../../../services/util.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { EmailServiceService } from '../../../email-service.service';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { EmailReplyComponent } from '../email-reply/email-reply.component';
import { EmailAddTaskComponent } from '../email-add-task/email-add-task.component';

@Component({
  selector: 'app-email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.scss']
})
export class EmailViewComponent implements OnInit, AfterViewInit {
  emailObj: Object;
  constructor(private emailService: EmailServiceService,
    private _bottomSheet: MatBottomSheet,
    private subInjectService: SubscriptionInject) { }
  emailSubscription;
  ngOnInit() {
    this.emailSubscription = this.emailService.data.subscribe(response => {
      this.emailObj = response;
      console.log(response);
    });
  }

  ngAfterViewInit() {
    this.emailSubscription.unsubscribe();
  }

  openBottomSheet(data) {
    this._bottomSheet.open(EmailReplyComponent);
  }

  openEmailAddTask(data) {
    const fragmentData = {
      flag: 'openEmailAddTask',
      data,
      id: 1,
      state: 'open35',
      componentName: EmailAddTaskComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          // this.getNscSchemedata();
          // get addTask Data ()
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

}
