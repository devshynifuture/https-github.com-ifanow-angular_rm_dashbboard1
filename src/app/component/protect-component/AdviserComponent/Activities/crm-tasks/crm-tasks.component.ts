import { MatTableDataSource } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { AddTasksComponent } from './add-tasks/add-tasks.component';
import { CrmTaskService } from './crm-task.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-crm-tasks',
  templateUrl: './crm-tasks.component.html',
  styleUrls: ['./crm-tasks.component.scss']
})
export class CrmTasksComponent implements OnInit {
  displayedColumns: string[] = ['client', 'member', 'des', 'cat', 'assigned', 'dueDate', 'taskStatus', 'menuList'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  isLoading: boolean;
  advisorId = AuthService.getAdvisorId();

  constructor(
    private subInjectService: SubscriptionInject,
    private crmTaskService: CrmTaskService,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.initPoint()
  }

  initPoint() {
    this.dataSource.data = ELEMENT_DATA;
    this.isLoading = true;
    console.log("iniitialized");
    this.getTaskStatus()
  }

  getTaskStatus() {
    this.crmTaskService.getTaskStatusValues({})
      .subscribe(res => {
        if (res) {
          console.log(res);
          this.getAllTaskList(res);
        }
      })
  }

  getAllTaskList({ taskStatus }) {
    const data = {
      advisorId: this.advisorId,
      offset: 0,
      limit: 5
    }
    this.crmTaskService.getAllTaskListValues(data)
      .subscribe(res => {
        this.isLoading = false;
        if (res) {
          console.log(res);
          let dataArray = [];
          res.forEach((element, index) => {
            let dateFormat = new Date(element.dueDate)
            let dueDate = dateFormat.getDate() + '/' + (dateFormat.getMonth() + 1) + '/' + dateFormat.getFullYear();
            dataArray.push({
              client: element.clientName,
              member: element.familyMemberName,
              des: element.description,
              cat: element.description,
              assigned: element.assignedToName,
              dueDate,
              dueDateTimeStamp: element.dueDate,
              taskStatus: taskStatus[index].name,
              id: element.id,
              advisorId: element.advisorId,
              clientId: element.clientId,
              familyMemberId: element.familyMemberId,
              assignedTo: element.assignedTo,
              taskTemplateId: element.taskTemplateId,
              categoryId: element.categoryId,
              subCategoryId: element.subCategoryId,
              subSubCategoryId: element.subSubCategoryId,
              adviceId: element.adviceId,
              adviceTypeId: element.adviceTypeId,
              linkedItemId: element.linkedItemId,
              status: element.status,
              completionDate: element.completionDate,
              commentsCount: element.commentsCount,
              totalSubTasks: element.totalSubTasks,
              subTaskCompleted: element.subTaskCompleted,
              subTasks: element.subTasks,
              collaborators: element.collaborators,
              attachments: element.attachments,
              comments: element.comments,
              menuList: '',
            });
          });
          this.dataSource.data = dataArray;
        } else {
          this.dataSource.data = null;
          this.eventService.openSnackBar('No Task Found', "DISMISS");
        }
      })
  }

  deleteTask(id) {
    this.crmTaskService.deleteActivityTask(id)
      .subscribe(res => {
        if (res) {
          this.eventService.openSnackBar("Task Successfully Deleted!!", "DISMISS");
        }
      })
  }

  openAddTask(data) {
    // let popupHeaderText = !!data ? 'Edit Recurring deposit' : 'Add Recurring deposit';
    const fragmentData = {
      flag: 'addActivityTask',
      data,
      id: 1,
      state: 'open50',
      componentName: AddTasksComponent,
      // popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.initPoint();
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }



}
export interface PeriodicElement {
  client: string;
  member: string;
  des: string;
  cat: string;
  assigned: string;
  dueDate: string;
  status: string;
  menuList: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { client: '', member: '', des: '', cat: '', assigned: '', dueDate: '', status: '', menuList: '' },
];

