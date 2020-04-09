import { Component, OnInit } from '@angular/core';
import { AddTaskTemplateComponent } from './add-task-template/add-task-template.component';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { SubscriptionService } from '../../Subscriptions/subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { TaskTemplateTypeComponent } from './add-task-template/task-template-type/task-template-type.component';
import { OrgSettingServiceService } from '../org-setting-service.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ConfirmDialogComponent } from '../../../common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-setting-activity',
  templateUrl: './setting-activity.component.html',
  styleUrls: ['./setting-activity.component.scss']
})
export class SettingActivityComponent implements OnInit {
  advisorId: any;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'assign', 'time', 'icons'];

  taskList: Array<any> = [];
  isLoading = false
  constructor(private subInjectService: SubscriptionInject,
    public subscription: SubscriptionService,
    public eventService: EventService,
    private orgSetting: OrgSettingServiceService,
    public dialog: MatDialog
  ) {
    this.advisorId = AuthService.getAdvisorId()
  }

  ngOnInit() {
    this.getTaskTemplate();
  }

  getTaskTemplate() {
    this.isLoading = true
    let obj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getTaskTemplate(obj).subscribe(
      data => this.getTaskTemplateRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }

  getTaskTemplateRes(data) {
    this.isLoading = false
    console.log('getTaskTemplateRes == ', data)
    if (data) {
      this.taskList = data
    }
  }

  deleteTask(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.orgSetting.deleteTaskTemplate(data.id).subscribe(
          data => {
            dialogRef.close();
            this.getTaskTemplate();
          },
          error => this.eventService.showErrorMessage(error)
        );
        this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
      },
      negativeMethod: () => {
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  editTaskTemplate(singleProfile, value) {
    const fragmentData = {
      flag: value,
      data: singleProfile,
      id: 1,
      state: 'open50',
      componentName: AddTaskTemplateComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getTaskTemplate();
          }
          rightSideDataSub.unsubscribe();
        }
      }

    );
  }

  addNewTaskTemplate() {
    const fragmentData = {
      flag: '',
      data: {},
      id: 1,
      state: 'open50',
      componentName: TaskTemplateTypeComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getTaskTemplate();
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}