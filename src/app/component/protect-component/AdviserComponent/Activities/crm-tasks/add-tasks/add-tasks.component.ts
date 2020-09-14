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

@Component({
  selector: 'app-add-tasks',
  templateUrl: './add-tasks.component.html',
  styleUrls: ['./add-tasks.component.scss'],
})
export class AddTasksComponent implements OnInit {
  selectedClient: any;
  familyMemberList: any;
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
  taskCommentForm: FormControl= new FormControl('', Validators.required);
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
    private util: UtilService

  ) { }

  ngOnInit() {
    for (let index = 1; index <= 30; index++) {
      this.taskNumberArr.push(index);
    }
    this.initPoint();
  }

  initPoint() {
    this.getTaskRecurringData()
    if (this.data !== null) {
      this.getAttachmentPreviewList('task', this.data.id);
      if(this.data.taskTemplateId ===0){
        this.isManualOrTaskTemplate = 'manual';
      } else {
        this.isManualOrTaskTemplate = 'template';
      }
      this.isManual = true;
      this.collaboratorList = this.data.collaborators;
      this.commentList = this.data.comments;
      this.commentList.map(element => {
        element.editMode = false;
      });
      this.attachmentList = this.data.attachments;
    }    
    this.formInit(this.data);

    if(this.data !== null && this.subTaskList.length === 0){
      this.showNoSubTaskFoundError = true;
    } else {
      this.showNoSubTaskFoundError = false;
    }

    if(this.data === null && this.subTaskList.length == 0){
      this.shouldShowAddSubTaskLabel = true;
    } else if(this.data == null && this.subTaskList.length!==0){
      this.shouldShowAddSubTaskLabel = false;
    } else if(this.data !== null && this.subTaskList.length ===0){
      this.shouldShowAddSubTaskLabel = true;
    } else if(this.data !== null && this.subTaskList.length !==0) {
      this.shouldShowAddSubTaskLabel = true;
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
    //   );
  }

  setTaskTemplatePrefillValue(id){
    if(this.taskTemplateList.length!==0){
      this.prefillValue = this.taskTemplateList.find(c => c.id === id)
    }
  }

  getAttachmentPreviewList(choice, value){
    let data;
    switch(choice){
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
      .subscribe(res=>{
        if(res){
          switch(choice){
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

  openCloseConfirmDialog(){
    const dialogData = {
      header: "DISCARD CHANGES",
      body: "Are you sure you want to discard changes you have made?",
      body2: "This cannot be undone.",
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

  replyToComment(item, index) {

  }

  searchClientFamilyMember(value){
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
          this.peopleService.getClientFamilyMemberList(obj).subscribe(responseArray => {
            if (responseArray) {
              if (value.length >= 0) {
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
      // this.showManualToggle = false;
      let tempClientList = this.enumDataService.getClientSearchData('');
      this.selectedClient = tempClientList.find(item => item.clientId = data.clientId);
      data.displayName = this.selectedClient.displayName;
      this.setTeamMember(data.assignedTo);

      this.addTaskForm = this.fb.group({
        searchTemplateList: [data.taskTemplateId ? data.taskTemplateId : ''],
        searchClientList: [data.displayName, Validators.required],
        assignedTo: [data.assignedTo, Validators.required],
        taskDueDate: [moment(data.dueDateTimeStamp),],
        taskDescription: [data.des, Validators.required],
        familyMemberId: [data.familyMemberId, Validators.required],
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

      this.addTaskForm.valueChanges.subscribe(res=>{
        if(!this.util.areTwoObjectsSame(this.prevAddTaskFormValue, res)){
          this.addTaskSubTaskChanges = true;
        }
      });

      this.editSubTaskForm = this.fb.group({
        description: ['', Validators.required],
        turnAroundTime: ['', Validators.required],
        assignedTo: ['', Validators.required],
        taskDueDate: ['', Validators.required],
      });

      this.editSubTaskForm.valueChanges.subscribe(item=> this.saveChangesSubTask = true);
      this.selectClient(this.selectedClient);
    } else {
      this.addTaskForm = this.fb.group({
        searchTemplateList: ["",],
        searchClientList: ['', Validators.required],
        assignedTo: ["", Validators.required],
        taskDueDate: ['', Validators.required],
        taskDescription: ['', Validators.required],
        familyMemberId: ["", Validators.required],
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

      this.addTaskForm.valueChanges.subscribe(res=>{
        if(!this.util.areTwoObjectsSame(this.prevAddTaskFormValue, res)){
          this.addTaskSubTaskChanges = true;
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
    this.subTaskList = [];
  }

  makeTaskRecurring() {
    this.isRecurringTaskForm = !this.isRecurringTaskForm;
    if(this.isRecurringTaskForm == true){
      this.addTaskForm.get('continuesTill').setValidators(Validators.required);
      this.addTaskForm.get('frequency').setValidators(Validators.required);
      this.addTaskForm.get('taskTurnAroundTime').setValidators(Validators.required); 
      this.addTaskForm.get('every').setValidators(Validators.required); 
    } else {
      this.addTaskForm.get('continuesTill').setErrors(null);
      this.addTaskForm.get('frequency').setErrors(null);
      this.addTaskForm.get('taskTurnAroundTime').setErrors(null);
      this.addTaskForm.get('every').setErrors(null);
    }
  }
    

  changeTabState(subTaskItem, value) {
    if (value === 2) {
      this.selectedSubTask = subTaskItem;
      this.subTaskCommentList = subTaskItem.comments;

      if (this.subTaskCommentList.length !== 0) {
        this.subTaskCommentList.map(element => {
          element.editMode = false;
        });
      }
      this.subTaskAttachmentList = subTaskItem.attachments;
      if(this.subTaskAttachmentList.length!==0){
        this.getAttachmentPreviewList('subTask', subTaskItem.id);
      }
      if (this.editSubTaskForm !== undefined) {
        this.editSubTaskForm.patchValue({
          description: subTaskItem.description,
          turnAroundTime: subTaskItem.turnAroundTime,
          assignedTo: subTaskItem.assignedTo,
          taskDueDate: moment(subTaskItem.dueDate)
        }, {emitEvent: false});
      } else {
        this.editSubTaskForm = this.fb.group({
          description: [subTaskItem.description, Validators.required],
          turnAroundTime: [subTaskItem.turnAroundTime, Validators.required],
          assignedTo: [subTaskItem.assignedTo, Validators.required],
          taskDueDate: [moment(), Validators.required],
        });
      }

      this.tabState = value;

    } else if(value === 1 && this.saveChangesSubTask === true){
      this.eventService.openSnackBar("Please save changes!", "DISMISS");
    } else {
      this.tabState = value;
    }
  }

  routeToTemplateAddition(event){
    if(event.value === '-1'){
      this.close();
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
          this.eventService.openSnackBar('Comment editing failed', "DISMISS");
        }
      }, err => console.error(err))

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
            if(this.subTaskList.length!==0){
              this.subTaskList.map(c => {
                if(c.id === this.selectedSubTask.id){
                  c.dueDate = moment(this.editSubTaskForm.get('taskDueDate').value);
                }
              });
            }
            this.saveChangesSubTask = false;
            this.eventService.openSnackBar('Sub-task saved successfully!', 'DISMISS');
          } else {
            this.eventService.openSnackBar('Sub-task saving failed!', 'DISMISS');
          }
        }, err => console.error(err));
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
    this.selectedTeamMemberId = data;
  }

  getTeamMemberList() {
    this.settingsService.getTeamMembers({ advisorId: this.advisorId })
      .subscribe(res => {
        if (res) {
          this.teamMemberList = res;
          console.log(res, "team member list")

        }
      }, err => {
        console.log(err)
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
          if(this.data !== null){
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
      description: [data.description? data.description:'', Validators.required],
      turnAroundTime: [data.turnAroundTime? data.turnAroundTime: '', Validators.required],
      assignedTo: [data.assignedTo ? data.assignedTo: '', Validators.required],
    })
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
          this.eventService.openSnackBar("No client family member found!", "DISMISS");
        }
      }, err => console.error(err));
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
          this.eventService.openSnackBar('Attachment deleting failed!', "DISMISS");
          console.log(res);
        }
      }, err => console.error(err))
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
          this.eventService.openSnackBar('Comment deleting failed!', "DISMISS");
          console.log(res);
        }
      }, err => console.error(err))
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
          this.eventService.openSnackBar('Collaborator removing failed!', "DISMISS");
          console.log(res);
        }
      }, err => console.error(err))
  }

  deleteSubTask(item?) {

    const data = {
      id: item.id ? item.id : this.selectedSubTask.id,
      taskId: item.taskId? item.taskId : this.selectedSubTask.taskId,
      taskNumber: item.taskNumber ? item.taskNumber : this.selectedSubTask.taskNumber,
      description:item.description ? item.description : this.selectedSubTask.description,
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
          this.eventService.openSnackBar('Sub task deleted successfully!', "DISMISS");
          let index = this.subTaskList.indexOf(this.selectedSubTask);
          this.removeSubTask(index);
        } else {
          this.eventService.openSnackBar('Sub task deleting failed!', "DISMISS");
          console.log(res);
        }
      }, err => console.error(err))
  }

  markTaskOrSubTaskDone(choice, subTaskItem, value) {
    let data;
    if (choice === 'task') {
      data = {
        taskId: this.data.id,
        status: value == true ? 1 : 0
      }
      this.data.status = 1;
    } else if (choice === 'subTask') {
      data = {
        subTaskId: subTaskItem.id,
        status: value == true ? 1 : 0
      }

    }

    this.crmTaskService.markTaskOrSubTaskDone(data)
      .subscribe(res => {
        let msg = choice == 'Task' ? '' : (choice === 'Sub task' ? '' : '');
        if (res) {
          this.eventService.openSnackBar(msg + ' marked as done', "DISMISS");
          if (choice === 'task') {
            this.close(true);
          } else if (choice === 'subTask') {
            this.tabState = 1;
            this.selectedSubTask.completionDate = new Date();
          }
        } else {
          this.eventService.openSnackBar(msg + 'marking failed', 'DISMISS');
        }
      }, err => console.log(err));
  }

  addSubTask(item) {
    this.showSubTaskHeading = true;
    this.showNoSubTaskFoundError = false;
    this.shouldShowAddSubTaskLabel = false;
    this.subTask.push(this.getSubTaskForm(item));
  }

  removeSubTask(index) {
    this.subTask.removeAt(index);
    if(this.subTask.length ===0){
      this.showSubTaskHeading = false;
    }
    if(this.subTaskList.length === 0 && this.data !==null){
      this.showNoSubTaskFoundError = true;
    }
    if(this.subTask.length ===0){
      this.shouldShowAddSubTaskLabel = true;
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
          this.eventService.openSnackBar("Attachment fetching failed !", "DISMISS");
          console.log("hopefully this is error", res);
        }
      }, err => console.error(err));
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
    switch(choice){
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
            this.eventService.openSnackBar("Sub task added  Successfully", "DISMISS");
            this.removeSubTask(formGroupIndex);
          }
        });
    } else {
      if(this.addTaskForm.get(`subTask.${formGroupIndex}`).valid){
        this.subTaskList.push({
          isCompleted: false,
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
    if (this.data !== null) {
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
              this.eventService.openSnackBar("Collaborator added successfully");
            }
          })
      } else {
        this.eventService.openSnackBar("Collaborator already exists!", "DISMISS");
      }
    }
  }

  onAddReplyOnCommentTaskSubTask(data, choice){
    let obj;
    switch(choice) {
      case 'task':
        obj = {
          taskId:10618, //(for sub task comments subTaskId)
          userId:103092,
          commentMsg: "reply",
          parentId:79 //(new param, id of comment to which its replying)
        }
        break;
      case 'subTask':
        obj = {
          subTaskId:10618, //(for sub task comments subTaskId)
          userId:103092,
          commentMsg: "reply",
          parentId:79 //(new param, id of comment to which its replying)
        }
        break;

    }
  }

  editModeSubTask(item, index) {
    this.subTaskList.splice(index, 1);
    this.addSubTask(item);
  }

  prefillValues(item) {
    this.selectedTemplate = item;
    this.crmTaskService.getIndividualTaskTemplate({
      taskTemplateId: item.id
    }).subscribe(res => {
      if (res) {
        this.isPrefilled = true;
        console.log("individual task name:::", res);
        this.prefillValue = res;
        if(res.hasOwnProperty('subTaskList')){
          const { subTaskList } = res; 
          this.subTaskList = [];
          if(res.subTaskList && res.subTaskList.length !==0){
            subTaskList.forEach(element => {
              if(this.subTaskList.length!==0){
                if(this.subTaskList.every(item => item.id !== element.id)){
                  this.subTaskList.push(element);
                }
              } else {
                this.subTaskList.push(element);
              }
            });
          }
        }
        if(this.subTaskList.length!==0){
          this.subTaskList.map(item => {
            item.comments = [];
            item.attachments = [];
          })
        }
        console.log('this is subtask List::: ')
        if (res.assignedTo) {
          this.addTaskForm.patchValue({ assignedTo: res.assignedTo, taskDescription: item.taskDescription });
        }
      }
    });
  }

  getSubTaskFromTemplate(){
    let subTaskFromPrefillList;
    if(this.prefillValue){
      subTaskFromPrefillList = this.prefillValue.subTaskList;
    }
    if(subTaskFromPrefillList && subTaskFromPrefillList.length!==0){
      this.subTaskList = [];
      subTaskFromPrefillList.forEach(element => {
        if(this.subTaskList.length!==0){
          if(this.subTaskList.every(item => item.id !== element.id)){
            this.subTaskList.push(element);
          }
        } else {
          this.subTaskList.push(element);
        }
      });
      if(this.subTaskList.length ===0){
        this.shouldShowAddSubTaskLabel = true;
      } else {
        this.shouldShowAddSubTaskLabel = false;
      }
    } else {
      this.shouldShowAddSubTaskLabel = false;
      this.eventService.openSnackBar('Subtask not present in task template', "DISMISS");
    }
  }

  removeItemFromSubTask(item, index){
    this.subTaskList.splice(index, 1);
    this.deleteSubTask(item);
    console.log(this.subTaskList);
  }

  isCollabotatorPresent(item){
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

  onCreateTask() {
    let subTaskArr = [];
    let taskNumberForSubTask;
    if (this.subTaskList.length !== 0) {
      this.subTaskList.forEach(element => {
        subTaskArr.push({
          taskNumber: this.getSubTaskNumber(),
          assignedTo: element.ownerId ? element.ownerId: element.assignedTo,
          description: element.description,
          turnAroundTime: element.turnAroundTime
        });
      });
    }
    if(this.subTaskList.length !==0){
      taskNumberForSubTask = this.getSubTaskNumber();
    } else {
      taskNumberForSubTask = 1;
    }
    if((this.addTaskForm.get('subTask') as FormArray).value.length !==0){
      (this.addTaskForm.get('subTask') as FormArray).value.forEach(element => {
        subTaskArr.push({
          taskNumber: taskNumberForSubTask,        //(order of task number should be maintained)
          assignedTo: element.ownerId ? element.ownerId: element.assignedTo,   //(same as assignedTo above)
          description: element.description,
          turnAroundTime: element.turnAroundTime
        });
        taskNumberForSubTask+=1;
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
        familyMemberId: this.addTaskForm.get('familyMemberId').value,
        dueDate: this.addTaskForm.get('taskDueDate').value.format("YYYY-MM-DD"),
        taskTemplateId: this.selectedTemplate !== null ? this.selectedTemplate.id : 0,
        categoryId: this.selectedTemplate !== null ? this.selectedTemplate.categoryId : 0,
        subCategoryId: this.selectedTemplate !== null ? this.selectedTemplate.subcategoryId : 0,
        subSubCategoryId: this.selectedTemplate !== null ? this.selectedTemplate.subSubCategoryId : 0,
        adviceTypeId: this.selectedTemplate !== null ? this.selectedTemplate.subSubCategoryId : 0,
      }

      if(this.subTask.length!==0){
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
                      this.isMainLoading = false;
                      this.eventService.openSnackBar("Task saved successfully!", "DISMISS");
                      this.close(true);
                    } else {
                      this.eventService.openSnackBar("Task editing failed!", "DISMISS");
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
              this.isMainLoading = false;
              this.eventService.openSnackBar("Task saved successfully!", "DISMISS");
              this.close(true);
            } else {
              this.eventService.openSnackBar("Task editing failed!", "DISMISS");
            }
          });
      }
    
      
      
    } else {
      // add new task
      let data = {
        advisorId: this.advisorId,
        clientId: this.selectedClient.clientId,
        assignedTo: this.addTaskForm.get('assignedTo').value,
        description: this.addTaskForm.get('taskDescription').value,
        familyMemberId: this.addTaskForm.get('familyMemberId').value,
        taskTemplateId: this.selectedTemplate !== null ? this.selectedTemplate.id : 0,
        categoryId: this.selectedTemplate !== null ? this.selectedTemplate.categoryId : 0,
        subCategoryId: this.selectedTemplate !== null ? this.selectedTemplate.subcategoryId : 0,
        subSubCategoryId: this.selectedTemplate !== null ? this.selectedTemplate.subSubCategoryId : 0,
        adviceTypeId: this.selectedTemplate !== null ? this.selectedTemplate.subSubCategoryId : 0,
        subTasks: subTaskArr,
      }
      if (this.isRecurringTaskForm) {
        data['isRecurring'] = true;
        data['frequency'] = this.addTaskForm.get('frequency').value;
        data['continuesTill'] = this.addTaskForm.get('continuesTill').value.format("YYYY-MM-DD");
        data['taskTurnAroundTime'] = this.addTaskForm.get('taskTurnAroundTime').value;
        data['every'] = this.addTaskForm.get('every').value;
      } else {
        data['dueDate'] = this.addTaskForm.get('taskDueDate').value.format("YYYY-MM-DD");
      }
      console.log("this is add task create data", data);
      this.isMainLoading = true;
      this.crmTaskService.addTask(data)
        .subscribe(res => {
          if (res) {
            this.isMainLoading = false;
            console.log("response from add task", res);
            this.eventService.openSnackBar('Task added successfully', "DISMISS");
            this.close(true)
          }
        })
    }
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
    if(value !== ''){
      this.isMainLoading = true;
      this.crmTaskService.addCommentOnActivityTaskOrSubTask(data)
        .subscribe(res => {
          if (res) {
            this.isMainLoading = false;
            console.log("this is what comment looks like", res);
            // reset form
            if (choice === 'task') {
              this.commentList.push(res);
            } else if (choice === 'subTask') {
              this.selectedSubTask.commentsCount += 1;
              this.subTaskCommentList.push(res);
            }
            this.taskCommentForm.patchValue('', {emitEvent: false});
            this.taskCommentForm.markAsUntouched();
            this.eventService.openSnackBar("Comment added successfully", "DISMISS");
          } else {
            this.eventService.openSnackBar("Comment adding failed", "DISMISS");
          }
        }, err => {
          this.isMainLoading = false;
          console.error(err);
        });
    } else {
      this.taskCommentForm.markAsTouched();
    }
  }

  close(flag?) {
    if(flag){
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
    } else {
      if(this.addTaskSubTaskChanges){
        this.openCloseConfirmDialog();
      } else{
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
    if (this.tabState === 1) {
      this.getFileData(fileList, 'task')
    } else if (this.tabState === 2) {
      this.getFileData(fileList, 'subTask')
    }
  }

  preventDefault(event) {
    event.preventDefault();
  }

}




