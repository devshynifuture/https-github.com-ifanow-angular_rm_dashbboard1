import { UtilService } from './../../../../../../services/util.service';
import { ConfirmDialogComponent } from './../../../../common-component/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { AuthService } from '../../../../../../auth-service/authService';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { EnumDataService } from '../../../../../../services/enum-data.service';
import { PeopleService } from '../../../../PeopleComponent/people.service';
import { CrmTaskService } from '../crm-task.service';
import { EventService } from '../../../../../../Data-service/event.service';
import { SettingsService } from '../../../setting/settings.service';
import * as moment from 'moment';
import { HttpService } from 'src/app/http-service/http-service';
import { Subscription, Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { RoleService } from 'src/app/auth-service/role.service';
import { DashboardService } from '../../../dashboard/dashboard.service';

@Component({
  selector: 'app-add-tasks',
  templateUrl: './add-tasks.component.html',
  styleUrls: ['./add-tasks.component.scss'],
})
export class AddTasksComponent implements OnInit {
  selectedClient: any;
  familyMemberList: any = [];
  clientList;
  isLoading: boolean;
  templateList;
  tabState = 1;
  isManual = false;
  taskNumberArr = [];
  addTaskForm: FormGroup;
  isPrefilled = false;
  status;
  data = null;
  showDefaultDropDownOnSearch = false;
  taskTemplateList: any;
  prefillValue: any;
  subTaskList: any = [];
  advisorId = AuthService.getAdvisorId();
  teamMemberList: any;
  selectClientId;
  selectedTemplate: any = null;
  selectedTeamMemberId: any;
  uploadUri: any;
  showManualToggle = true;
  collaboratorList = [];
  commentList: any = [];
  attachmentList: any = [];
  editSubTaskForm: FormGroup;
  selectedSubTask;
  subTaskCommentList = []
  subTaskAttachmentList = [];
  isAssignedToTaskChanged = false;
  isAssignedToSubtaskChanged = false;
  userId = AuthService.getUserId();
  commentTaskInput = '';
  commentSubTaskInput = '';
  taskCommentForm: FormControl = new FormControl('', Validators.required);
  showSubTaskHeading = false;
  showNoSubTaskFoundError = false;
  userProfilePicUrl = this.authService.profilePic;

  isMainLoading = false;
  dayOfWeek: any;
  recurringTaskFrequencyList: any;
  isRecurringTaskForm = false;
  commentSubTaskFC = new FormControl();
  commentTaskFC = new FormControl();
  recurringTaskFreqId: any;
  commentEditValue = '';
  familyOutputSubscription: Subscription;
  familyOutputObservable: Observable<any> = new Observable<any>();
  addTaskSubTaskChanges = false;
  addTaskFormSubscription: Subscription;
  taskAttachmentPreviewList: any = [];
  subTaskAttachmentPreviewList: any = [];
  isManualOrTaskTemplate: any;
  saveChangesSubTask: boolean;
  shouldShowAddSubTaskLabel: boolean = false;
  dueDateMinDate = new Date();
  prevAddTaskFormValue: any;
  replyCommentFC = new FormControl('', Validators.required);
  editReplyFC = new FormControl('', Validators.required);
  prevSubTaskFormValues: {};
  isTaskDone = false;
  taskTemplateLoading: boolean;

  constructor(
    private subInjectService: SubscriptionInject,
    private authService: AuthService,
    private ngZone: NgZone,
    private enumDataService: EnumDataService,
    private fb: FormBuilder,
    private peopleService: PeopleService,
    private crmTaskService: CrmTaskService,
    private eventService: EventService,
    private settingsService: SettingsService,
    private http: HttpService,
    private router: Router,
    public dialog: MatDialog,
    private util: UtilService,
    public roleService: RoleService,
    public dashboardService: DashboardService
  ) { }

  ngOnInit() {
    for (let index = 1; index <= 30; index++) {
      this.taskNumberArr.push(index);
    }
    this.initPoint();
    DashboardService.dashTaskDashboardCount
  }

  initPoint() {
    this.getTaskRecurringData()
    if (this.data !== null) {
      this.dueDateMinDate = new Date(1990, 0, 1);
      this.getAttachmentPreviewList('task', this.data.id);
      this.isTaskDone = this.data.status === 1 ? true : false;
      if (this.data.taskTemplateId === 0) {
        this.isManualOrTaskTemplate = 'manual';
      } else {
        this.isManualOrTaskTemplate = 'template';
      }
      this.isManual = true;
      this.collaboratorList = this.data.collaborators;
      this.commentList = this.data.comments;

      this.commentList.map(element => {
        element.editMode = false;
        element.showInputReply = false;
        element.showReplyText = true;
      });
      this.attachmentList = this.data.attachments;
    }
    this.formInit(this.data);

    if (this.data !== null && this.subTaskList.length === 0) {
      this.showNoSubTaskFoundError = true;
    } else {
      this.showNoSubTaskFoundError = false;
    }

    if (this.data === null && this.subTaskList.length == 0) {
      this.shouldShowAddSubTaskLabel = true;
    } else if (this.data == null && this.subTaskList.length !== 0) {
      this.shouldShowAddSubTaskLabel = false;
    } else if (this.data !== null && this.subTaskList.length === 0) {
      this.shouldShowAddSubTaskLabel = true;
    } else if (this.data !== null && this.subTaskList.length !== 0) {
      this.shouldShowAddSubTaskLabel = true;
    }

    if (this.isTaskDone) {
      this.shouldShowAddSubTaskLabel = false;
    }
    this.getTaskTemplateList();
    this.getTeamMemberList();

    // this.clientList = this.addTaskForm.get('searchClientList').valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(state => {
    //       if (state) {
    //         let list = this.enumDataService.getClientSearchData(state);
    //         if (list == undefined) {
    //           this.showDefaultDropDownOnSearch = true;
    //           this.isLoading = true;
    //           return;
    //         }
    //         if (list && list.length == 0) {
    //           this.isLoading = false;
    //           this.showDefaultDropDownOnSearch = true;
    //           return;
    //         }
    //         this.isLoading = false;
    //         this.showDefaultDropDownOnSearch = false;
    //         return this.enumDataService.getClientSearchData(state)
    //       } else {
    //         this.isLoading = false;
    //         this.showDefaultDropDownOnSearch = false;
    //         return this.enumDataService.getEmptySearchStateData();
    //       }
    //     }),
    //   )

    // comments 
  }

  setTaskTemplatePrefillValue(id) {
    if (this.taskTemplateList.length !== 0) {
      this.prefillValue = this.taskTemplateList.find(c => c.id === id)
    }
  }

  getAttachmentPreviewList(choice, value) {
    let data;
    switch (choice) {
      case 'task':
        data = {
          taskId: value
        }
        break;

      case 'subTask':
        data = {
          subTaskId: value
        }
        break;
    }
    this.crmTaskService.getAttachmentPreviewList(data)
      .subscribe(res => {
        if (res) {
          switch (choice) {
            case 'task':
              this.taskAttachmentPreviewList = res;
              break;
            case 'subTask':
              this.subTaskAttachmentPreviewList = res;
              break;
          }
        }
      })
  }

  openCloseConfirmDialog() {
    let msg;
    if (this.data !== null) {
      msg = 'Please save changes!';
    } else {
      msg = '';
    }
    const dialogData = {
      header: "DISCARD CHANGES",
      body: "Are you sure you want to discard changes you have made? ",
      body2: "This cannot be undone. " + msg,
      btnNo: "DISCARD",
      btnYes: "CANCEL",
      positiveMethod: () => {
        this.close(true);
        dialogRef.close();
      },
      negativeMethod: () => {
        dialogRef.close();
      },
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: dialogData,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  openReplyInput(item, index) {
    item.showInputReply = !item.showInputReply;
  }

  addReply(commentItem, choice) {
    let data;

    if (this.replyCommentFC.value !== '') {
      switch (choice) {
        case 'task':
          data = {
            taskId: commentItem.taskId, //(for sub task comments subTaskId)
            userId: this.userId,
            commentMsg: this.replyCommentFC.value,
            parentId: commentItem.id //(new param, id of comment to which its replying)
          }
          break;

        case 'subTask':
          data = {
            subTaskId: commentItem.subTaskId, //(for sub task comments subTaskId)
            userId: this.userId,
            commentMsg: this.replyCommentFC.value,
            parentId: commentItem.id //(new param, id of comment to which its replying)
          }
          break;
      }

      this.crmTaskService.addReplyOnCommentActivityTaskSubTask(data)
        .subscribe(res => {
          if (res) {
            commentItem.showInputReply = false;
            commentItem.replies.push(res);
            this.replyCommentFC.patchValue('', { emitEvent: false });
            commentItem.editMode = false;
            commentItem.showReplyText = true;

            this.eventService.openSnackBar('Replied successfully', 'DISMISS');
          }
        }, err => {
          console.error(err);
          this.eventService.openSnackBar("Something went wrong", "DISMISS");
        });
    } else {
      this.replyCommentFC.markAllAsTouched();
    }
  }

  editReplySave(replyItem, commentItem, replyIndex, choice) {
    let data;
    if (this.editReplyFC.value !== '') {
      switch (choice) {
        case 'task':
          data = {
            id: replyItem.id,
            commentMsg: this.editReplyFC.value
          }
          break;
        case 'subTask':
          data = {
            id: replyItem.id,
            commentMsg: this.editReplyFC.value
          }
          break;
      }

      this.crmTaskService.saveEditedCommentOnActivityTaskOrSubTask(data)
        .subscribe(res => {
          if (res) {
            console.log(res);
            replyItem.commentMsg = this.editReplyFC.value;
            this.editReplyFC.patchValue('', { emitEvent: false });
            replyItem.editMode = !replyItem.editMode;
            this.eventService.openSnackBar("Reply edited successfully", "DISMISS");
          }
        })
    } else {
      this.editReplyFC.markAsTouched();
    }
  }

  deleteReply(replyItem, commentItem, replyIndex) {
    this.crmTaskService.deleteCommentTaskSubTask(replyItem.id)
      .subscribe(res => {
        if (res) {
          commentItem.replies.splice(replyIndex, 1);
          this.eventService.openSnackBar("Reply deleted successfully", "DISMISS");
        }
      }, err => {
        console.error(err);
        this.eventService.openSnackBar("Something went wrong", "DISMISS");
      })
  }

  searchClientFamilyMember(value) {
    if (value.length <= 2) {
      this.showDefaultDropDownOnSearch = false;
      this.isLoading = false;
      this.clientList = null;
      return;
    }
    if (!this.clientList) {
      this.showDefaultDropDownOnSearch = true;
      this.isLoading = true;
    }
    const obj = {
      advisorId: AuthService.getAdvisorId(),
      displayName: value
    };
    if (this.familyOutputSubscription && !this.familyOutputSubscription.closed) {
      this.familyOutputSubscription.unsubscribe();
    }
    this.familyOutputSubscription = this.familyOutputObservable.pipe(startWith(''),
      debounceTime(700)).subscribe(
        data => {
          this.peopleService.getClientsSearchList(obj).subscribe(responseArray => {
            if (responseArray) {
              if (value.length >= 0) {
                console.log("client search", responseArray);
                this.clientList = responseArray;
                this.showDefaultDropDownOnSearch = false;
                this.isLoading = false;
              } else {
                this.showDefaultDropDownOnSearch = null;
                this.isLoading = null;
                this.clientList = null;
              }
            } else {
              this.showDefaultDropDownOnSearch = true;
              this.isLoading = false;
              this.clientList = null;
            }
          }, error => {
            this.clientList = null;
            console.log('getFamilyMemberListRes error : ', error);
          });
        }
      );
  }

  getTaskRecurringData() {
    this.crmTaskService.getTaskStatusValues({})
      .subscribe(res => {
        if (res) {
          this.dayOfWeek = res.dayOfWeek;
          this.recurringTaskFrequencyList = res.recurringTaskFrequency;
        }
      })
  }

  formInit(data) {
    if (data !== null) {
      this.subTaskList = data.subTasks;
      this.showManualToggle = false;
      // let tempClientList = this.enumDataService.getClientSearchData('');
      // this.selectedClient = tempClientList.find(item => item.clientId = data.clientId);
      this.selectedClient = {
        displayName: this.data.member,
        clientId: this.data.clientId
      }
      // data.displayName = this.selectedClient.displayName;

      data.displayName = this.data.client;

      this.setTeamMember(data.assignedTo);

      this.addTaskForm = this.fb.group({
        searchTemplateList: [data.taskTemplateId ? data.taskTemplateId : ''],
        searchClientList: [data.displayName, Validators.required],
        assignedTo: [data.assignedTo, Validators.required],
        taskDueDate: [moment(data.dueDateTimeStamp),],
        taskDescription: [data.des, Validators.required],
        familyMemberId: [data.familyMemberId,],
        subTask: this.fb.array([]),
        taskTurnAroundTime: ['',],
        continuesTill: ['',],
        isRecurring: ['',],
        frequency: ['',],
        every: ['',]
      });

      if (this.isTaskDone) {
        this.addTaskForm.get('searchTemplateList').disable({ emitEvent: false });
        this.addTaskForm.get('searchClientList').disable({ emitEvent: false });
        this.addTaskForm.get('assignedTo').disable({ emitEvent: false });
        this.addTaskForm.get('taskDueDate').disable({ emitEvent: false });
        this.addTaskForm.get('taskDescription').disable({ emitEvent: false });
        this.addTaskForm.get('familyMemberId').disable({ emitEvent: false });
        this.addTaskForm.get('taskTurnAroundTime').disable({ emitEvent: false });
        this.addTaskForm.get('continuesTill').disable({ emitEvent: false });
        this.addTaskForm.get('isRecurring').disable({ emitEvent: false });
        this.addTaskForm.get('frequency').disable({ emitEvent: false });
        this.addTaskForm.get('every').disable({ emitEvent: false });
      }

      this.prevAddTaskFormValue = {
        ...this.addTaskForm.value
      }

      this.addTaskForm.valueChanges.subscribe(res => {
        if (!this.util.areTwoObjectsSame(this.prevAddTaskFormValue, res)) {
          this.addTaskSubTaskChanges = true;
          this.prevAddTaskFormValue = res;
        }
      });

      this.editSubTaskForm = this.fb.group({
        description: ['', Validators.required],
        turnAroundTime: ['', Validators.required],
        assignedTo: ['', Validators.required],
        taskDueDate: ['', Validators.required],
      });
      this.prevSubTaskFormValues = {
        ...this.editSubTaskForm.value
      }
      this.editSubTaskForm.valueChanges.subscribe(item => {
        if (!this.util.areTwoObjectsSame(this.prevSubTaskFormValues, item)) {
          this.saveChangesSubTask = true;
          this.prevSubTaskFormValues = item;
        }
      });

      this.selectClient(this.selectedClient);
    } else {
      this.addTaskForm = this.fb.group({
        searchTemplateList: ["",],
        searchClientList: ['', Validators.required],
        assignedTo: ["", Validators.required],
        taskDueDate: ['', Validators.required],
        taskDescription: ['', Validators.required],
        familyMemberId: ["",],
        subTask: this.fb.array([]),
        taskTurnAroundTime: ['',],
        continuesTill: ['',],
        isRecurring: ['',],
        frequency: ['',],
        every: ['',]
      });

      this.prevAddTaskFormValue = {
        ...this.addTaskForm.value
      }

      this.addTaskForm.valueChanges.subscribe(res => {
        if (!this.util.areTwoObjectsSame(this.prevAddTaskFormValue, res)) {
          this.addTaskSubTaskChanges = true;
          this.prevAddTaskFormValue = res;
        }
      });
    }
  }

  changeFillFormState() {
    this.isManual = !this.isManual;
    this.addTaskForm.patchValue({
      searchTemplateList: '',
      searchClientList: '',
      assignedTo: '',
      taskDueDate: '',
      taskDescription: '',
      familyMemberId: '',
      subTask: [],
      taskTurnAroundTime: '',
      continuesTill: '',
      isRecurring: '',
      frequency: '',
      every: ''
    }, { emitEvent: false });
    if (this.isRecurringTaskForm) {
      this.addTaskForm.get('taskDueDate').setErrors(null);
    }
    this.subTaskList = [];
  }

  makeTaskRecurring() {
    this.isRecurringTaskForm = !this.isRecurringTaskForm;
    if (this.isRecurringTaskForm) {
      this.addTaskForm.get('continuesTill').setValidators(Validators.required);
      this.addTaskForm.get('frequency').setValidators(Validators.required);
      this.addTaskForm.get('taskTurnAroundTime').setValidators(Validators.required);
      this.addTaskForm.get('every').setValidators(Validators.required);
      this.addTaskForm.get('taskDueDate').setErrors(null);
    } else {
      this.addTaskForm.get('continuesTill').setErrors(null);
      this.addTaskForm.get('frequency').setErrors(null);
      this.addTaskForm.get('taskTurnAroundTime').setErrors(null);
      this.addTaskForm.get('every').setErrors(null);
      this.addTaskForm.get('taskDueDate').setValidators(Validators.required);
    }
  }


  changeTabState(subTaskItem, value) {
    if (value === 2) {
      this.selectedSubTask = subTaskItem;
      this.subTaskCommentList = subTaskItem.comments;

      if (this.subTaskCommentList.length !== 0) {
        this.subTaskCommentList.map(element => {
          element.editMode = false;
          element.showInputReply = false;
          element.showReplyText = true;
        });
      }
      this.subTaskAttachmentList = subTaskItem.attachments;
      if (this.subTaskAttachmentList.length !== 0) {
        this.getAttachmentPreviewList('subTask', subTaskItem.id);
      }
      if (this.editSubTaskForm !== undefined) {
        this.editSubTaskForm.patchValue({
          description: subTaskItem.description,
          turnAroundTime: subTaskItem.turnAroundTime,
          assignedTo: subTaskItem.assignedTo,
          taskDueDate: moment(subTaskItem.dueDate)
        }, { emitEvent: false });
      } else {
        this.editSubTaskForm = this.fb.group({
          description: [subTaskItem.description, Validators.required],
          turnAroundTime: [subTaskItem.turnAroundTime, Validators.required],
          assignedTo: [subTaskItem.assignedTo, Validators.required],
          taskDueDate: [moment(), Validators.required],
        });
      }

      this.tabState = value;

    } else if (value === 1 && this.saveChangesSubTask === true) {
      this.eventService.openSnackBar("Please save the changes!", "DISMISS");
    } else {
      this.tabState = value;
    }
  }

  routeToTemplateAddition(event) {
    if (event.value === '-1') {
      this.close(true);
      this.router.navigate(['/admin/setting/activity']);
    }
  }

  saveEditedComment(item, choice, index, event) {
    let data;
    let value = event.target.parentElement.parentElement.nextElementSibling.querySelector('input[type="text"]').value;
    switch (choice) {
      case 'task':
        data = {
          id: item.id,
          commentMsg: value
        }
        break;
      case 'subTask':
        data = {
          id: item.id,
          commentMsg: value
        }
        break;
    }

    this.crmTaskService.saveEditedCommentOnActivityTaskOrSubTask(data)
      .subscribe(res => {
        if (res) {
          switch (choice) {
            case 'task': this.commentList[index].commentMsg = value;
              break;
            case 'subTask': this.subTaskCommentList[index].commentMsg = value;
              break;
          }
          item.editMode = false;
          this.eventService.openSnackBar('Comment edited successfully', "DISMISS");
        } else {
          this.eventService.openSnackBar('Something went wrong', "DISMISS");
        }
      }, err => {
        console.error(err);
        this.eventService.openSnackBar("Something went wrong", "DISMISS");
      })

  }

  editedSubTaskSave() {
    if (this.editSubTaskForm.valid) {
      let assignedToChanged = (this.selectedSubTask.assignedTo !== this.editSubTaskForm.get('assignedTo').value) ? true : false;
      let data = {
        taskNumber: this.selectedSubTask.taskNumber,
        assignedTo: this.editSubTaskForm.get('assignedTo').value,
        assignedToChanged, //(true if assigned to is changed),
        description: this.editSubTaskForm.get('description').value,
        turnAroundTime: this.editSubTaskForm.get('turnAroundTime').value,
        advisorId: this.advisorId,
        taskId: this.selectedSubTask.taskId,
        id: this.selectedSubTask.id
      }

      if (this.editSubTaskForm.get('taskDueDate').value) {
        let date = new Date(this.editSubTaskForm.get('taskDueDate').value);

        let dueDate = date.getFullYear() + "-" + `${(date.getMonth() + 1) <= 9 ? '0' : ''}` + (date.getMonth() + 1) + '-' + `${(date.getDate()) <= 9 ? '0' : ''}` + date.getDate();
        data['dueDate'] = dueDate;
      }

      this.crmTaskService.saveEditedSubTaskValues(data)
        .subscribe(res => {
          if (res) {
            console.log("edited response:", res);
            if (this.subTaskList.length !== 0) {
              this.subTaskList.map(c => {
                if (c.id === this.selectedSubTask.id) {
                  c.dueDate = moment(this.editSubTaskForm.get('taskDueDate').value);
                }
              });
            }
            this.saveChangesSubTask = false;
            this.eventService.openSnackBar('Sub-task saved successfully!', 'DISMISS');
          } else {
            this.eventService.openSnackBar('Something went wrong', 'DISMISS');
          }
        }, err => {
          console.error(err);
          this.eventService.openSnackBar("Something went wrong", "DISMISS");
        });
    } else {
      this.editSubTaskForm.markAllAsTouched();
      this.eventService.openSnackBar("Please fill required fields!", "DISMISS");
    }

  }

  getTeamMemberObject(value) {
    return this.teamMemberList.find(c => c.userId === value);
  }

  setTeamMember(data) {
    console.log("teamMember id or assignedTo idd", data);
    this.selectedTeamMemberId = data.userId;
    if (this.teamMemberList && this.teamMemberList.length > 0) {
      if (this.canAddCollaborators(data.userId)) {
        this.collaboratorList.push({
          name: data.fullName,
          default: true,
          userId: data.userId,
          profilePicUrl: data.profilePicUrl
        })
      }
    }
  }

  getTeamMemberList() {
    this.settingsService.getTeamMembers({ advisorId: this.advisorId })
      .subscribe(res => {
        if (res) {
          this.teamMemberList = res;
          console.log(res, "team member list");
          this.defaultCollaboratorsArray();
        }
      }, err => {
        console.log(err);
        this.eventService.openSnackBar("Something went wrong", "DISMISS");
      })
  }

  getTaskTemplateList() {
    const data = {
      advisorId: this.advisorId
    }
    this.crmTaskService.getTaskTemplateList(data)
      .subscribe(res => {
        if (res) {
          this.taskTemplateList = res;
          if (this.data !== null) {
            this.setTaskTemplatePrefillValue(this.data.taskTemplateId);
          }
          console.log("this is task tempplate result::::", res);
        } else {
          this.isManual = true;
          this.eventService.openSnackBar("No task template found!!", "DISMISS");
        }
      })
  }

  get subTask() {
    return (this.addTaskForm.get('subTask') as FormArray);
  }

  getSubTaskForm(data) {
    data !== null ? data : data = {};

    return this.fb.group({
      isCompleted: [false,],
      description: [data.description ? data.description : '', Validators.required],
      turnAroundTime: [data.turnAroundTime ? data.turnAroundTime : '', Validators.required],
      assignedTo: [data.assignedTo ? data.assignedTo : '', Validators.required],
      id: [data.id]
    })
  }

  updateCollaboratorList() {
    if (this.canAddCollaborators(this.selectedClient.userId)) {
      this.collaboratorList.push({
        userId: this.selectedClient.userId,
        name: this.selectedClient.fullName,
        default: true,
        profilePicUrl: this.selectedClient.profilePicUrl
      });
    }
  }

  selectClient(singleClientData) {
    this.selectedClient = singleClientData;
    console.log("selected client Data", singleClientData);
    this.addTaskForm.get('searchClientList')
      .setValue(singleClientData.displayName,
        { emitEvent: false }
      );

    const obj = {
      clientId: singleClientData.clientId
    };
    this.peopleService.getClientFamilyMemberListAsset(obj)
      .subscribe(data => {
        if (data) {
          this.familyMemberList = data;
        } else {
          this.eventService.openSnackBar("Something went wrong", "DISMISS");
        }
      }, err => {
        console.error(err);
        this.eventService.openSnackBar("Something went wrong", "DISMISS");
      });
  }

  deleteTask(id) {
    if (id == null) {
      id = this.data.id;
    }
    this.crmTaskService.deleteActivityTask(id)
      .subscribe(res => {
        if (res) {
          this.eventService.openSnackBar("Task deleted successfully!", "DISMISS");
          this.close(true);
        }
      })
  }

  toggleCheckSubTask(value, item, index) {
    console.log("this is some subtask check uncheck value", value)
    this.subTaskList[index].isCompleted = true;
    this.subTaskList[index].status = 1;
    this.markTaskOrSubTaskDone('subTask', item, value);
  }

  deleteAttachmentOfTaskSubTask(id, index, choice) {
    this.crmTaskService.deleteAttachmentTaskSubTask(id)
      .subscribe(res => {
        if (res) {
          this.eventService.openSnackBar('Attachment deleted successfully!', "DISMISS");
          if (choice === 'task') {
            this.attachmentList.splice(index, 1);
          } else if (choice === 'subTask') {
            this.subTaskAttachmentList.splice(index, 1);
          }
        } else {
          this.eventService.openSnackBar('Sonething went wrong', "DISMISS");
          console.log(res);
        }
      }, err => {
        this.eventService.openSnackBar("Something went wrong", "DISMISS");
        console.error(err)
      })
  }

  deleteCommentTaskSubTask(item, choice, index) {
    this.crmTaskService.deleteCommentTaskSubTask(item.id)
      .subscribe(res => {
        if (res) {
          console.log("deleted comment", res);
          if (choice === 'task') {
            this.commentList.splice(index, 1);
          } else if (choice === 'subTask') {
            this.subTaskCommentList.splice(index, 1);
          }
          this.eventService.openSnackBar('Comment deleted successfully!', "DISMISS");
        } else {
          this.eventService.openSnackBar('Something went wrong', "DISMISS");
          console.log(res);
        }
      }, err => {
        console.error(err);
        this.eventService.openSnackBar("Something went wrong", "DISMISS");
      })
  }

  removeCollaboratorFromTask(id) {
    this.crmTaskService.deleteCollaboratorFromTask(id)
      .subscribe(res => {
        if (res) {
          this.eventService.openSnackBar('Collaborator removed successfully!', "DISMISS");
          let item = this.collaboratorList.find(item => item.id == id);
          let index = this.collaboratorList.indexOf(item);
          this.collaboratorList.splice(index, 1);
        } else {
          this.eventService.openSnackBar('Something went wrong', "DISMISS");
          console.log(res);
        }
      }, err => {
        console.error(err);
        this.eventService.openSnackBar("Something went wrong", "DISMISS");
      })
  }

  deleteSubTask(item?) {

    const data = {
      id: item.id ? item.id : this.selectedSubTask.id,
      taskId: item.taskId ? item.taskId : this.selectedSubTask.taskId,
      taskNumber: item.taskNumber ? item.taskNumber : this.selectedSubTask.taskNumber,
      description: item.description ? item.description : this.selectedSubTask.description,
      turnAroundTime: item.turnAroundTime ? item.turnAroundTime : this.selectedSubTask.turn,
      assignedTo: item.assignedTo ? item.assignedTo : this.selectedSubTask.assignedTo,
      status: item.status || (item.status === 0) ? item.status : this.selectedSubTask.status // true or false
    }

    if (this.selectedSubTask && this.selectedSubTask.hasOwnProperty('dueDate')) {
      let date = new Date(this.selectedSubTask.dueDate)
      let dueDate = date.getFullYear() + "-"
        + `${(date.getMonth() + 1) < 10 ? '0' : ''}`
        + (date.getMonth() + 1) + '-'
        + `${date.getDate() < 10 ? '0' : ''}`
        + date.getDate();
      data['dueDate'] = dueDate;
    }

    this.crmTaskService.deleteSubTaskFromTask(data)
      .subscribe(res => {
        if (res) {
          this.addTaskSubTaskChanges = true;
          this.tabState = 1;
          this.eventService.openSnackBar('Sub-task deleted successfully!', "DISMISS");
          let index = this.subTaskList.indexOf(this.selectedSubTask);
          this.removeSubTask(index);
        } else {
          this.eventService.openSnackBar('Something went wrong', "DISMISS");
          console.log(res);
        }
      }, err => {
        console.error(err);
        this.eventService.openSnackBar("Something went wrong", "DISMISS");
      })
  }

  markTaskOrSubTaskDone(choice, subTaskItem, value) {
    let data;
    if (!this.isTaskDone) {
      if (choice === 'task') {
        data = {
          taskId: this.data.id,
          status: value == true ? 1 : 0
        }
      } else if (choice === 'subTask') {
        data = {
          subTaskId: subTaskItem.id,
          status: value == true ? 1 : 0
        }
      }

      if (choice === 'task') {
        if (this.subTaskList.every(item => item.status !== 0)) {
          this.crmTaskService.markTaskOrSubTaskDone(data)
            .subscribe(res => {
              let msg = choice == 'Task' ? '' : (choice === 'Sub task' ? '' : '');
              if (res) {
                this.eventService.openSnackBar(msg + ' completed successfully', "DISMISS");
                this.data.status = 1;
                this.close(true);
              } else {
                this.eventService.openSnackBar('Something went wrong', 'DISMISS');
              }
            }, err => {
              console.log(err);
              this.eventService.openSnackBar("Something went wrong", "DISMISS");
            });
        } else {
          this.eventService.openSnackBar("Please complete your sub-task!", "DISMISS");
        }
      } else {
        this.crmTaskService.markTaskOrSubTaskDone(data)
          .subscribe(res => {
            let msg = 'Sub-task';
            if (res) {
              if (value == 1) {
                this.eventService.openSnackBar(msg + ' completed successfully', "DISMISS");
              } else {
                this.eventService.openSnackBar(msg + ' updated successfully', "DISMISS");
              } this.tabState = 1;
              subTaskItem.isCompleted = true;
              subTaskItem.status = 1;
              subTaskItem.completionDate = new Date();
            } else {
              this.eventService.openSnackBar('Something went wrong', 'DISMISS');
            }
          }, err => {
            console.log(err);
            this.eventService.openSnackBar("Something went wrong", "DISMISS");
          });
      }
    }

  }

  addSubTask(item) {
    this.showSubTaskHeading = true;
    this.showNoSubTaskFoundError = false;
    this.shouldShowAddSubTaskLabel = false;
    this.subTask.push(this.getSubTaskForm(item));
  }

  removeSubTask(index) {
    this.subTask.removeAt(index);
    if (this.subTask.length === 0) {
      this.showSubTaskHeading = false;
    }
    if (this.subTaskList.length === 0 && this.data !== null) {
      this.showNoSubTaskFoundError = true;
    }
    if (this.subTask.length === 0) {
      this.shouldShowAddSubTaskLabel = true;
    }
    if (this.isTaskDone) {
      this.shouldShowAddSubTaskLabel = false;
    }
  }

  downloadAttachment(item) {
    this.isMainLoading = true;
    this.crmTaskService.getAttachmentDownloadOfTaskSubTask({ taskAttachmentId: item.id })
      .subscribe(res => {
        this.isMainLoading = false;
        if (res) {
          window.open(res);
        } else {
          this.eventService.openSnackBar("Something went wrong", "DISMISS");
          console.log("hopefully this is error", res);
        }
      }, err => {
        console.error(err);
        this.eventService.openSnackBar("Something went wrong", "DISMISS");
      });
  }

  getUploadUrlForAttachment(fileData, choice) {
    const obj = {
      attachmentName: fileData.name
    }
    this.isMainLoading = true;
    this.crmTaskService.getAttachmentUploadUrlValue(obj)
      .subscribe(res => {
        if (res) {
          console.log("attachment getlink respo:", res);
          const httpOptions = {
            headers: new HttpHeaders()
              .set('Content-Type', '')
          };
          this.http.putExternal(res.uploadUrl, fileData, httpOptions)
            .subscribe((resData) => {
              let obj;
              if (choice === 'task') {
                obj = {
                  ...res,
                  attachmentName: fileData.name,
                  taskId: this.data.id
                }
              } else if (choice === 'subTask') {
                obj = {
                  ...res,
                  attachmentName: fileData.name,
                  subTaskId: this.selectedSubTask.id
                }
              }
              this.uploadAttachmentToAws(obj, choice);
            }, error => {
              this.isMainLoading = false;
              this.eventService.openSnackBar("Something went wrong!", "DISMISS");
              console.error(error)
            });

        }
      }, err => {
        this.isMainLoading = false;
        this.eventService.openSnackBar("Something went wrong!", "DISMISS");
        console.error(err)
      })
  }

  uploadAttachmentToAws(value, choice) {
    let data;
    switch (choice) {
      case 'task':
        data = {
          taskId: value.taskId,
          attachmentName: value.attachmentName,
          s3Uuid: value.s3Uuid
        }
        break;
      case 'subTask':
        data = {
          subTaskId: value.subTaskId,
          attachmentName: value.attachmentName,
          s3Uuid: value.s3Uuid
        }
        break;
    }
    this.crmTaskService.addAttachmentTaskSubTask(data)
      .subscribe(res => {
        if (res) {
          this.isMainLoading = false;
          console.log("attachment aws respo:", res);
          if (choice === 'task') {
            this.attachmentList.push(res);
            this.getAttachmentPreviewList('task', res.taskId);
          } else if (choice === 'subTask') {
            this.subTaskAttachmentList.push(res);
            this.getAttachmentPreviewList('subTask', res.subTaskId);
          }

          this.eventService.openSnackBar("Attachment uploaded successfully!", "DISMISS");
        }
      }, err => {
        this.isMainLoading = false;
        this.eventService.openSnackBar("Something went wrong!", "DISMISS");
        console.error(err)
      })
  }

  appendSubTask(data, formGroupIndex) {
    if (this.data !== null) {
      const obj = {
        taskId: this.data.id,
        taskNumber: this.getSubTaskNumber(),
        assignedTo: data.value.assignedTo,
        description: data.value.description,
        turnAroundTime: data.value.turnAroundTime
      }
      this.crmTaskService.addSubTaskActivity(obj)
        .subscribe(res => {
          if (res) {
            console.log("sub taks appended successfully!", res);
            this.addTaskSubTaskChanges = true;
            res.comments = [];
            res.attachments = [];
            res.status = 0;
            this.subTaskList.push(res)
            this.addTaskForm.get(`subTask.${formGroupIndex}`).reset();
            this.eventService.openSnackBar("Sub-task added successfully", "DISMISS");
            this.removeSubTask(formGroupIndex);
          }
        });
    } else {
      if (this.addTaskForm.get(`subTask.${formGroupIndex}`).valid) {
        this.subTaskList.push({
          isCompleted: data.value.status || data.value.status === 0 ? true : false,
          assignedTo: data.value.assignedTo,
          description: data.value.description,
          turnAroundTime: data.value.turnAroundTime,
          comments: [],
          attachments: [],
          status: 0
        });
        this.addTaskForm.get(`subTask.${formGroupIndex}`).reset();
        this.removeSubTask(formGroupIndex);
      } else {
        this.addTaskForm.get(`subTask.${formGroupIndex}`).markAllAsTouched();
      }
    }

  }

  setRecurringFreq(item) {
    this.recurringTaskFreqId = item.id;
  }

  onAddingCollaborator(data) {
    console.log(data);
    // if (this.data !== null) {
    if (data.hasOwnProperty('id') && this.data) {
      if (this.canAddCollaborators(data.userId)) {
        const obj = {
          taskId: this.data.id,
          userId: data.userId
        }
        this.crmTaskService.addCollaboratorToTask(obj)
          .subscribe(res => {
            if (res) {
              console.log('this is added res of collaborator', res);
              this.collaboratorList.push(res);
              this.eventService.openSnackBar("Collaborator added successfully", "DISMISS");
            }
          })
      } else {
        this.eventService.openSnackBar("Collaborator already exists!", "DISMISS");
      }
    } else {
      if (this.canAddCollaborators(data.userId)) {
        this.collaboratorList.push({
          name: data.fullName,
          userId: data.userId,
          default: false,
          profilePicUrl: data.profilePicUrl,
        })
      }
    }
    // }
  }

  onAddReplyOnCommentTaskSubTask(data, choice) {
    let obj;
    switch (choice) {
      case 'task':
        obj = {
          taskId: 10618, //(for sub task comments subTaskId)
          userId: 103092,
          commentMsg: "reply",
          parentId: 79 //(new param, id of comment to which its replying)
        }
        break;
      case 'subTask':
        obj = {
          subTaskId: 10618, //(for sub task comments subTaskId)
          userId: 103092,
          commentMsg: "reply",
          parentId: 79 //(new param, id of comment to which its replying)
        }
        break;

    }
  }

  editModeSubTask(item, index) {
    this.subTaskList.splice(index, 1);
    this.addSubTask(item);
  }

  prefillValues(item) {
    this.taskTemplateLoading = true;
    this.crmTaskService.getIndividualTaskTemplate({
      taskTemplateId: item.id
    }).subscribe(res => {
      if (res) {
        this.taskTemplateLoading = false;
        this.isPrefilled = true;
        this.addTaskForm.get('taskDescription').setErrors(null);
        console.log("individual task name:::", res);
        this.prefillValue = res;
        this.selectedTemplate = res;
        if (res.hasOwnProperty('subTaskList')) {
          const { subTaskList } = res;
          if (res.subTaskList && res.subTaskList.length !== 0) {
            subTaskList.forEach(element => {
              if (this.subTask.length !== 0) {
                if (this.subTask.value.every(item => item.id !== element.id)) {
                  element.assignedTo = element.ownerId;
                  this.subTask.push(this.getSubTaskForm(element));
                }
              } else {
                element.assignedTo = element.ownerId;
                this.subTask.push(this.getSubTaskForm(element));
              }
            });
          }
        }
        if (this.subTaskList.length !== 0) {
          this.subTaskList.map(item => {
            item.comments = [];
            item.attachments = [];
          })
        }
        if (res.hasOwnProperty('turnAroundTime') && res.turnAroundTime !== 0) {
          let d = new Date();
          this.addTaskForm.get('taskDueDate').patchValue(moment(d, "DD-MM-YYYY").add(res.turnAroundTime, 'days'), { emitEvent: false });
        }
        console.log('this is subtask List::: ')
        if (res.assignedTo) {
          this.addTaskForm.patchValue({ assignedTo: res.assignedTo, taskDescription: item.taskDescription });
        }
      } else {
        this.taskTemplateLoading = false;
      }
    }, err => {
      this.taskTemplateLoading = false;
      console.error(err);
    });
  }

  getSubTaskFromTemplate() {
    let subTaskFromPrefillList;
    if (this.prefillValue) {
      subTaskFromPrefillList = this.prefillValue.subTaskList;
    }
    if (subTaskFromPrefillList && subTaskFromPrefillList.length !== 0) {
      this.subTask.patchValue([], { emitEvent: false });
      subTaskFromPrefillList.forEach(element => {
        if (this.subTask.length !== 0) {
          if (this.subTask.value.every(item => item.id !== element.id)) {
            element.assignedTo = element.ownerId;
            this.subTask.push(this.getSubTaskForm(element));
          }
        } else {
          element.assignedTo = element.ownerId;
          this.subTask.push(this.getSubTaskForm(element));
        }
      });
      if (this.subTask.length === 0) {
        this.shouldShowAddSubTaskLabel = true;
      } else {
        this.shouldShowAddSubTaskLabel = false;
      }
    } else {
      this.shouldShowAddSubTaskLabel = true;
      this.eventService.openSnackBar('No sub-task found in task template', "DISMISS");
    }
  }

  removeItemFromSubTask(item, index) {
    this.subTaskList.splice(index, 1);
    this.deleteSubTask(item);
    console.log(this.subTaskList);
  }

  isCollaboratorPresent(item) {
    return this.collaboratorList.some(c => c.userId === item.userId);
  }

  getSubTaskNumber() {
    let temp = 0;
    if (this.subTaskList.length !== 0) {
      this.subTaskList.forEach(element => {
        if (element.taskNumber > temp) {
          temp = element.taskNumber;
        }
      });
    }
    return temp + 1;
  }

  formValidationOfTaskForm() {
    if (this.addTaskForm.valid) {
      if (!this.isRecurringTaskForm) {
        if (this.addTaskForm.get('taskDueDate').value == null) {
          this.addTaskForm.get('taskDueDate').setValidators([Validators.required]);
          this.addTaskForm.get('taskDueDate').markAsTouched();
        } else {
          this.addTaskForm.get('taskDueDate').setErrors(null);
        }
      }
      this.onCreateTask();
    } else {
      this.addTaskForm.markAllAsTouched();
      this.eventService.openSnackBar("Please fill required fields", "DISMISS");
    }
  }

  defaultCollaboratorsArray() {
    // loggedInUser and taskAssignedTo user
    let arr = [
      { userId: this.userId, isDefault: true },
      { userId: this.addTaskForm.get('assignedTo').value, isDefault: true }
    ];
    if (this.canAddCollaborators(this.userId)) {
      this.collaboratorList.push({
        profilePicUrl: this.authService.profilePic,
        name: AuthService.getUserInfo().name,
        default: true,
        // id: '',
        // taskId: 10436,
        userId: this.userId,
      });
    }

    // all sub task assigned to user ids
    if (this.subTask.value.length > 0) {
      this.subTask.value.forEach(element => {
        arr.push({
          userId: element.assignedTo,
          isDefault: true
        });
        if (this.canAddCollaborators(element.assignedTo)) {
          this.collaboratorList.push({
            profilePicUrl: element.assignedToProfileUrl,
            name: element.assignedToName,
            default: true,
            userId: element.assignedTo,
          })
        }
      });
    }
    //  clientOwner
    if (this.teamMemberList.length > 0 && this.selectedClient) {
      this.teamMemberList.forEach(element => {
        if (element.adminAdvisorId == this.selectedClient.advisorId) {
          arr.push({
            userId: element.userId,
            isDefault: true
          });
          if (this.canAddCollaborators(element.userId)) {
            this.collaboratorList.push({
              profilePicUrl: element.profilePicUrl,
              name: element.fullName,
              default: true,
              userId: element.userId,
            })
          }
        }
      });
    }
    // return arr;
  }

  onCreateTask() {
    let subTaskArr = [];
    let taskNumberForSubTask;
    if (this.subTaskList.length !== 0) {
      this.subTaskList.forEach(element => {
        subTaskArr.push({
          taskNumber: this.getSubTaskNumber(),
          assignedTo: element.ownerId ? element.ownerId : element.assignedTo,
          description: element.description,
          turnAroundTime: element.turnAroundTime
        });
      });
    }
    if (this.subTaskList.length !== 0) {
      taskNumberForSubTask = this.getSubTaskNumber();
    } else {
      taskNumberForSubTask = 1;
    }
    if ((this.addTaskForm.get('subTask') as FormArray).value.length !== 0) {
      (this.addTaskForm.get('subTask') as FormArray).value.forEach(element => {
        subTaskArr.push({
          taskNumber: taskNumberForSubTask,        //(order of task number should be maintained)
          assignedTo: element.ownerId ? element.ownerId : element.assignedTo,   //(same as assignedTo above)
          description: element.description,
          turnAroundTime: element.turnAroundTime
        });
        taskNumberForSubTask += 1;
      });
    }

    if (this.data !== null) {
      // edit task
      let assignedToChanged = (this.data.assignedTo !== this.addTaskForm.get('assignedTo').value) ? true : false;

      let editObj = {
        id: this.data.id,
        advisorId: this.advisorId,
        clientId: this.selectedClient.clientId,
        assignedTo: this.addTaskForm.get('assignedTo').value,
        assignedToChanged,
        description: this.addTaskForm.get('taskDescription').value,
        dueDate: this.addTaskForm.get('taskDueDate').value.format("YYYY-MM-DD"),
        taskTemplateId: this.selectedTemplate !== null ? this.selectedTemplate.id : 0,
        categoryId: this.selectedTemplate !== null ? this.selectedTemplate.categoryId : 0,
        subCategoryId: this.selectedTemplate !== null ? this.selectedTemplate.subcategoryId : 0,
        subSubCategoryId: this.selectedTemplate !== null ? this.selectedTemplate.subSubCategoryId : 0,
        adviceTypeId: this.selectedTemplate !== null ? this.selectedTemplate.subSubCategoryId : 0,
      }

      if (this.addTaskForm.get('familyMemberId').value && this.addTaskForm.get('familyMemberId').value !== '' && this.familyMemberList.length !== 0) {
        editObj['familyMemberId'] = this.addTaskForm.get('familyMemberId').value;
      }

      if (this.subTask.length !== 0) {
        let arr = [];
        let subTaskTaskNumber = this.getSubTaskNumber();
        (this.subTask as FormArray).value.forEach((element, index) => {
          // this.appendSubTask(element, index);
          const obj = {
            taskId: this.data.id,
            taskNumber: subTaskTaskNumber,
            assignedTo: element.assignedTo,
            description: element.description,
            turnAroundTime: element.turnAroundTime
          }
          subTaskTaskNumber += 1;;
          arr.push(obj);
        });
        this.isMainLoading = true;
        this.crmTaskService.addSubTaskActivity(arr)
          .subscribe(res => {
            if (res) {
              console.log("sub taks appended successfully!", res);
              this.crmTaskService.editActivityTask(editObj)
                .subscribe(res => {
                  if (res) {
                    console.log(res);
                    DashboardService.dashTaskDashboardCount = null;
                    DashboardService.dashTodaysTaskList = null;
                    this.isMainLoading = false;
                    this.eventService.openSnackBar("Task saved successfully!", "DISMISS");
                    this.close(true);
                  } else {
                    this.eventService.openSnackBar("Something went wrong", "DISMISS");
                  }
                });
            }
          });
      } else {
        this.isMainLoading = true;
        this.crmTaskService.editActivityTask(editObj)
          .subscribe(res => {
            if (res) {
              console.log(res);
              DashboardService.dashTaskDashboardCount = null;
              DashboardService.dashTodaysTaskList = null;
              this.isMainLoading = false;
              this.eventService.openSnackBar("Task saved successfully!", "DISMISS");
              this.close(true);
            } else {
              this.eventService.openSnackBar("Something went wrong", "DISMISS");
            }
          });
      }



    } else {
      let collaboratorArr = [];
      if (this.collaboratorList.length > 0) {
        this.collaboratorList.forEach(item => {
          collaboratorArr.push({
            isDefault: item.default,
            userId: item.userId
          })
        })
      }
      // add new task
      let data = {
        advisorId: this.advisorId,
        clientId: this.selectedClient.clientId,
        assignedTo: this.addTaskForm.get('assignedTo').value,
        description: this.addTaskForm.get('taskDescription').value,
        taskTemplateId: this.selectedTemplate !== null ? this.selectedTemplate.id : 0,
        categoryId: this.selectedTemplate !== null ? this.selectedTemplate.categoryId : 0,
        subCategoryId: this.selectedTemplate !== null ? this.selectedTemplate.subcategoryId : 0,
        subSubCategoryId: this.selectedTemplate !== null ? this.selectedTemplate.subSubCategoryId : 0,
        adviceTypeId: this.selectedTemplate !== null ? this.selectedTemplate.subSubCategoryId : 0,
        subTasks: subTaskArr,
        collaborators: collaboratorArr
      }

      if (this.addTaskForm.get('familyMemberId').value && this.addTaskForm.get('familyMemberId').value !== '' && this.familyMemberList.length !== 0) {
        data['familyMemberId'] = this.addTaskForm.get('familyMemberId').value;
      }

      if (this.isRecurringTaskForm) {
        data['isRecurring'] = true;
        data['frequency'] = this.addTaskForm.get('frequency').value;
        data['continuesTill'] = this.addTaskForm.get('continuesTill').value.format("YYYY-MM-DD");
        data['taskTurnAroundTime'] = this.addTaskForm.get('taskTurnAroundTime').value;
        if (this.addTaskForm.get('every').value === '') {
          data['every'] = null;
        } else {
          data['every'] = this.addTaskForm.get('every').value;
        }
      } else {
        data['dueDate'] = this.addTaskForm.get('taskDueDate').value.format("YYYY-MM-DD");
      }
      console.log("this is add task create data", data);
      this.isMainLoading = true;
      this.crmTaskService.addTask(data)
        .subscribe(res => {
          if (res) {
            DashboardService.dashTaskDashboardCount = null;
            DashboardService.dashTodaysTaskList = null;
            this.getTaskDashboardCount();
            sessionStorage.removeItem('todaysTaskList')
            this.isMainLoading = false;
            console.log("response from add task", res);
            this.eventService.openSnackBar('Task added successfully', "DISMISS");
            this.close(true)
          }
        })
    }
  }

  getTaskDashboardCount() {
    this.dashboardService.getTaskDashboardCountValues({ advisorId: this.advisorId })
      .subscribe(res => {
        if (res) {
          DashboardService.setTaskMatrix(res);
        }
      })
  }


  canAddCollaborators(userId): boolean {
    if (!(this.collaboratorList.some(item => item.userId === userId))) {
      return true;
    } else {
      return false;
    }
  }

  onCreateCommentTaskSubTask(value) {
    let data;
    let choice = this.tabState === 1 ? 'task' : (this.tabState === 2) ? 'subTask' : '';

    if (choice === 'task') {
      data = {
        taskId: this.data.id,         //(subTaskId in case of sub task)
        userId: this.userId,    //(userId of advisor)
        commentMsg: value
      }
    } else if (choice === 'subTask') {
      data = {
        subTaskId: this.selectedSubTask.id,         //(subTaskId in case of sub task)
        userId: this.userId,    //(userId of advisor)
        commentMsg: value
      }
    }
    if (value !== '') {
      this.isMainLoading = true;
      this.crmTaskService.addCommentOnActivityTaskOrSubTask(data)
        .subscribe(res => {
          if (res) {
            this.isMainLoading = false;
            console.log("this is what comment looks like", res);
            // reset form
            if (choice === 'task') {
              res.replies = [];
              this.commentList.push(res);
            } else if (choice === 'subTask') {
              this.selectedSubTask.commentsCount += 1;
              res.replies = [];
              this.subTaskCommentList.push(res);

            }
            this.taskCommentForm.patchValue('', { emitEvent: false });
            this.taskCommentForm.markAsUntouched();
            this.eventService.openSnackBar("Comment added successfully", "DISMISS");
          } else {
            this.eventService.openSnackBar("Something went wrong", "DISMISS");
          }
        }, err => {
          this.isMainLoading = false;
          this.eventService.openSnackBar("Something went wrong", "DISMISS");
          console.error(err);
        });
    } else {
      this.taskCommentForm.markAsTouched();
    }
  }

  close(flag?) {
    if (flag) {
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
    } else {
      if (this.addTaskSubTaskChanges) {
        this.openCloseConfirmDialog();
      } else {
        this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: false });
      }
    }
  }

  toggleEditMode(item, choice) {
    item.editMode = true;
  }

  getFileData(fileList: FileList, choice) {
    let fileData = fileList.item(0);
    this.getUploadUrlForAttachment(fileData, choice);
  }

  taskUpperFile(fileList: FileList) {
    if (!this.isTaskDone) {
      if (this.tabState === 1) {
        this.getFileData(fileList, 'task')
      } else if (this.tabState === 2) {
        this.getFileData(fileList, 'subTask')
      }
    }
  }

  preventDefault(event) {
    event.preventDefault();
  }

}




