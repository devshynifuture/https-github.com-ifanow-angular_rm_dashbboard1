// import { WebPushNotifyService } from './../../../../../services/webpush-notify.service';
import { CustomFilterDatepickerDialogComponent } from './../../../SupportComponent/file-ordering-upload/custom-filter-datepicker-dialog.component';
import { MatTableDataSource, MatDialog, MatSort } from '@angular/material';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { AddTasksComponent } from './add-tasks/add-tasks.component';
import { CrmTaskService } from './crm-task.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { FormControl } from '@angular/forms';
import { RoleService } from 'src/app/auth-service/role.service';
import { DashboardService } from '../../dashboard/dashboard.service';


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
  taskStatus: any;
  dateFilterList: any;
  isFilterSet: boolean;
  finalTaskList = [];
  hasEndReached = false;
  infiniteScrollingFlag = false;
  filterFormControl = new FormControl('');

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @ViewChild('tableEl', { static: false }) tableEl;
  filterValueId: any;
  customDateFilter: boolean = false;
  customFromToDate: any;
  filterTaskWithStatus: any = 0;
  statusFC: FormControl;
  statusList = [
    { name: 'Done', value: 1 },
    { name: 'Not Done', value: 0 },
  ]

  constructor(
    private subInjectService: SubscriptionInject,
    private crmTaskService: CrmTaskService,
    private eventService: EventService,
    private dialog: MatDialog,
    public roleService: RoleService,
    private dashboardService: DashboardService

    // private webPushNotify: WebPushNotifyService,
  ) { }

  ngOnInit() {
    this.statusFC = new FormControl(0);
    this.initPoint();
    this.dashboardService.dashRefreshObj.dashTaskDashboardCount;

  }

  initPoint() {
    this.isLoading = true;
    this.dataSource.data = ELEMENT_DATA;
    this.dataSource.sort = this.sort;
    this.statusFC.patchValue(0);
    console.log("iniitialized");
    this.getTaskStatus();
    // this.registerForPushNotification();
  }

  // registerForPushNotification() {
  //   this.webPushNotify.enableWebPushNotification();
  // }

  setFilterValue() {
    this.isFilterSet = true;
    this.filterValueId = this.filterFormControl.value;
    if (this.filterValueId === 5) {
      this.openDateDialog();
    } else {
      this.finalTaskList = [];
      this.initPoint();
    }
  }

  openDateDialog() {
    const dialogRef = this.dialog.open(CustomFilterDatepickerDialogComponent, {
      width: '35%',
      data: ''
    })

    dialogRef.afterClosed()
      .subscribe(res => {
        if (res) {
          this.customDateFilter = true;
          this.customFromToDate = res;
          this.finalTaskList = [];
          this.initPoint();
        } else {
          this.customDateFilter = false;
        }
      })
  }

  getTaskStatus() {
    this.crmTaskService.getTaskStatusValues({})
      .subscribe(res => {
        if (res) {
          console.log(res);
          this.taskStatus = res.taskStatus;
          this.dateFilterList = res.taskDaysFilter
          this.getAllTaskList(0);
        }
      })
  }

  getTaskNameFromTaskStatusList(taskStatus) {
    return this.taskStatus.find(item => item.id === taskStatus).name;
  }

  setFilterToDefault() {
    this.filterFormControl.patchValue('');
    this.isFilterSet = false;
    this.statusFC.patchValue(0, { emitEvent: false });
    this.initPoint();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }

  setTaskFilterWithStatus(event) {
    const value = event.value;
    if (value !== "") {
      this.filterTaskWithStatus = parseInt(value);
    }
    this.finalTaskList = [];
    this.dataSource.data = ELEMENT_DATA;
    this.isLoading = true;
    this.getAllTaskList(0);
  }

  getAllTaskList(offset) {
    const data = {
      advisorId: this.advisorId,
      offset,
      limit: 20,
      status: this.filterTaskWithStatus
    }
    if (this.isFilterSet) {
      data['dateFilter'] = this.filterValueId;
      if (this.customDateFilter) {
        data['fromDate'] = this.customFromToDate.fromDate;
        data['toDate'] = this.customFromToDate.toDate;
      }
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
              cat: 'category' in element ? element.category : element.description,
              assigned: element.assignedToName,
              dueDate,
              dueDateTimeStamp: element.dueDate,
              taskStatus: this.getTaskNameFromTaskStatusList(element.status),
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
          this.finalTaskList = this.finalTaskList.concat(dataArray);
          this.dataSource.data = this.finalTaskList;
          this.dataSource.sort = this.sort;
          this.hasEndReached = false;
          this.infiniteScrollingFlag = false;
        } else {

          this.dataSource.data = (this.finalTaskList.length > 0) ? this.finalTaskList : null;
          this.dataSource.sort = (this.finalTaskList.length > 0) ? this.sort : null;

          this.isLoading = false;
          this.infiniteScrollingFlag = false;
          if (this.finalTaskList.length > 0) {
            this.eventService.openSnackBar("No more Task Found", "DISMISS");
          } else {
            this.dataSource.data = null;
            this.dataSource.sort = null;
            this.eventService.openSnackBar('No Task Found', "DISMISS");
          }
        }
      }, err => {
        console.error(err);
        this.eventService.openSnackBar("Something went wrong!", "DISMISS");
      })
  }

  onTableScroll(e: any) {
    if (this.tableEl._elementRef.nativeElement.querySelector('tbody').querySelector('tr:last-child').offsetTop <= (e.target.scrollTop + e.target.offsetHeight + 200)) {
      if (!this.hasEndReached) {
        this.infiniteScrollingFlag = true;
        this.hasEndReached = true;
        this.getAllTaskList(this.finalTaskList.length);
        // this.getClientList(this.finalClientList[this.finalClientList.length - 1].clientId)
      }

    }
  }

  deleteTask(id) {
    this.crmTaskService.deleteActivityTask(id)
      .subscribe(res => {
        if (res) {
          this.eventService.openSnackBar("Task Successfully Deleted!!", "DISMISS");
          this.finalTaskList = [];
          this.dashboardService.dashRefreshObj.dashTaskDashboardCount = null;
          this.dashboardService.dashRefreshObj.dashTodaysTaskList = null;
          this.initPoint();
        }
      }, err => {
        console.error(err);
        this.eventService.openSnackBar("Something went wrong!", "DISMISS");
      })
  }

  openAddTask(data) {
    if (data) {
      if (this.roleService.activityPermission.subModule.taskCapabilityList[2].enabledOrDisabled == 2) {
        return;
      }
    }
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
            this.finalTaskList = [];
            this.setFilterToDefault();
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
  { client: '', member: '', des: '', cat: '', assigned: '', dueDate: '', status: '', menuList: '' },

];

