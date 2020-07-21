import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { AuthService } from '../../../../../../auth-service/authService';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { EnumDataService } from '../../../../../../services/enum-data.service';
import { PeopleService } from '../../../../PeopleComponent/people.service';
import { CrmTaskService } from '../crm-task.service';
import { EventService } from '../../../../../../Data-service/event.service';
import { SettingsService } from '../../../setting/settings.service';
import * as moment from 'moment';
import { HttpService } from 'src/app/http-service/http-service';

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
  taskCommentForm: FormGroup;

  isMainLoading = false;

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
    private http: HttpService

  ) { }

  ngOnInit() {
    for (let index = 1; index <= 30; index++) {
      this.taskNumberArr.push(index);
    }
    this.initPoint();
  }

  formInit(data) {
    if (data !== null) {
      this.subTaskList = data.subTasks;
      this.isManual = true;
      this.showManualToggle = false;
      let tempClientList = this.enumDataService.getClientSearchData('');
      this.selectedClient = tempClientList.find(item => item.clientId = data.clientId);
      data.displayName = this.selectedClient.displayName;
      this.setTeamMember(data.assignedTo);

      this.addTaskForm = this.fb.group({
        searchTemplateList: [data.taskTemplateId, Validators.required],
        searchClientList: [data.displayName, Validators.required],
        assignedTo: [data.assignedTo, Validators.required],
        taskDueDate: [moment(data.dueDateTimeStamp), Validators.required],
        taskDescription: [data.des, Validators.required],
        familyMemberId: [data.familyMemberId,],
        subTask: this.fb.array([])
      });

      this.editSubTaskForm = this.fb.group({
        description: [, Validators.required],
        turnAroundTime: [, Validators.required],
        assignedTo: [, Validators.required],
        taskDueDate: [, Validators.required],
      });
      this.selectClient(this.selectedClient);

    } else {
      this.addTaskForm = this.fb.group({
        searchTemplateList: [, Validators.required],
        searchClientList: [, Validators.required],
        assignedTo: [, Validators.required],
        taskDueDate: [, Validators.required],
        taskDescription: [,],
        familyMemberId: [,],
        subTask: this.fb.array([]),
      });
    }
  }

  initPoint() {
    if (this.data !== null) {
      this.collaboratorList = this.data.collaborators;
      this.commentList = this.data.comments;
      this.commentList.map(element => {
        element.editMode = false;
      });
      this.attachmentList = this.data.attachments;
    }
    this.formInit(this.data);
    this.getTaskTemplateList();
    this.getTeamMemberList();
    this.addTaskForm.valueChanges.subscribe(res => console.log("form value changes:", res));

    this.clientList = this.addTaskForm.get('searchClientList').valueChanges
      .pipe(
        startWith(''),
        map(state => {
          if (state) {
            let list = this.enumDataService.getClientSearchData(state);
            if (list == undefined) {
              this.showDefaultDropDownOnSearch = true;
              this.isLoading = true;
              return;
            }
            if (list && list.length == 0) {
              this.isLoading = false;
              this.showDefaultDropDownOnSearch = true;
              return;
            }
            this.isLoading = false;
            this.showDefaultDropDownOnSearch = false;
            return this.enumDataService.getClientSearchData(state)
          } else {
            this.isLoading = false;
            this.showDefaultDropDownOnSearch = false;
            return this.enumDataService.getEmptySearchStateData();
          }
        }),
      );
  }

  changeFillFormState() {
    this.isManual = !this.isManual;
    this.addTaskForm.reset();
    this.subTaskList = [];
  }

  changeTabState(subTaskItem, value) {
    if (value === 2) {
      this.selectedSubTask = subTaskItem;
      this.subTaskCommentList = subTaskItem.comments;
      this.subTaskCommentList.map(element => {
        element.editMode = false;
      });
      this.subTaskAttachmentList = subTaskItem.attachments;
      this.editSubTaskForm.patchValue({
        description: subTaskItem.description,
        turnAroundTime: subTaskItem.turnAroundTime,
        assignedTo: subTaskItem.assignedTo,
        taskDueDate: moment(subTaskItem.taskDueDate)
      })
    }
    this.tabState = value;
  }

  saveEditedComment(item, choice, index) {
    let data;
    switch (choice) {
      case 'task':
        data = {
          id: item.id,
          commentMsg: this.commentTaskInput
        }
        break;
      case 'subTask':
        data = {
          id: item.id,
          commentMsg: this.commentSubTaskInput
        }
    }


    this.crmTaskService.saveEditedCommentOnActivityTaskOrSubTask(data)
      .subscribe(res => {
        if (res) {
          console.log("this is edit comment rees:", res);
          switch (choice) {
            case 'task': this.commentList[index].commentMsg = this.commentTaskInput;
              break;
            case 'subTask': this.subTaskCommentList[index].commentMsg = this.commentSubTaskInput;
              break;
          }
          item.editMode = false;
          this.eventService.openSnackBar('Successfully Edited comment', "DISMISS");
        } else {
          this.eventService.openSnackBar('Editing comment failed', "DISMISS");
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

      if (this.selectedSubTask.dueDate) {
        let date = new Date(this.selectedSubTask.dueDate)
        let dueDate = date.getFullYear() + "-" + (date.getMonth() + 1) + '-' + date.getDate();
        data['dueDate'] = dueDate;
      }

      this.crmTaskService.saveEditedSubTaskValues(data)
        .subscribe(res => {
          if (res) {
            console.log("edited response:", res)
            this.eventService.openSnackBar('Successfully Saved!', 'DISMISS');
          } else {
            this.eventService.openSnackBar('Saving Failed!', 'DISMISS');
          }
        }, err => console.error(err));
    } else {
      this.editSubTaskForm.markAllAsTouched();
      this.eventService.openSnackBar("Please fill ");
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
          console.log("this is task tempplate result::::", res);
        } else {
          this.eventService.openSnackBar("No Task Template Found!!", "DISMISS");
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
      description: [data.description, Validators.required],
      turnAroundTime: [data.turnAroundTime, Validators.required],
      assignedTo: [data.assignedTo, Validators.required],
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
          this.eventService.openSnackBar("No Client Family Member Found!", "DISMISS");
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
          this.eventService.openSnackBar("Task Successfully Deleted!!", "DISMISS");
          this.close(true);
        }
      })
  }

  toggleCheckSubTask(value, item, index) {
    console.log("this is some subtask check uncheck value", value)
    this.markTaskOrSubTaskDone('subTask', item, value);
  }

  deleteAttachmentOfTaskSubTask(id, index, choice) {
    this.crmTaskService.deleteAttachmentTaskSubTask(id)
      .subscribe(res => {
        if (res) {
          this.eventService.openSnackBar('Attachment Deleted Successfully!', "DISMISS");
          if (choice === 'task') {
            this.attachmentList.splice(index, 1);
          } else if (choice === 'subTask') {
            this.subTaskAttachmentList.splice(index, 1);
          }
        } else {
          this.eventService.openSnackBar('Delete failed!', "DISMISS");
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
          this.eventService.openSnackBar('Comment Deleted Successfully!', "DISMISS");
        } else {
          this.eventService.openSnackBar('Delete failed!', "DISMISS");
          console.log(res);
        }
      }, err => console.error(err))
  }

  removeCollaboratorFromTask(id) {
    this.crmTaskService.deleteCollaboratorFromTask(id)
      .subscribe(res => {
        if (res) {
          this.eventService.openSnackBar('Collaborator removed Successfully!', "DISMISS");
          let item = this.collaboratorList.find(item => item.id == id);
          let index = this.collaboratorList.indexOf(item);
          this.collaboratorList.splice(index, 1);
        } else {
          this.eventService.openSnackBar('Removing failed!', "DISMISS");
          console.log(res);
        }
      }, err => console.error(err))
  }

  deleteSubTask() {

    const data = {
      id: this.selectedSubTask.id,
      taskId: this.selectedSubTask.taskId,
      taskNumber: this.selectedSubTask.taskNumber,
      description: this.selectedSubTask.description,
      turnAroundTime: this.selectedSubTask.turn,
      assignedTo: this.selectedSubTask.assignedTo,
      status: this.selectedSubTask.status // true or false
    }

    if (this.selectedSubTask.dueDate) {
      let date = new Date(this.selectedSubTask.dueDate)
      let dueDate = date.getFullYear() + "-" + `${(date.getMonth() + 1) < 10 ? '0' : ''}` + (date.getMonth() + 1) + '-' + date.getDate();
      data['dueDate'] = dueDate;
    }

    this.crmTaskService.deleteSubTaskFromTask(data)
      .subscribe(res => {
        if (res) {
          this.tabState = 1;
          this.eventService.openSnackBar('Subtask deleted Successfully!', "DISMISS");
          let index = this.subTaskList.indexOf(this.selectedSubTask);
          this.removeSubTask(index);
          this.subTaskList.splice(index, 1);
        } else {
          this.eventService.openSnackBar('Delete failed!', "DISMISS");
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
    } else if (choice === 'subTask') {
      data = {
        subTaskId: subTaskItem.id,
        status: value == true ? 1 : 0
      }
    }

    this.crmTaskService.markTaskOrSubTaskDone(data)
      .subscribe(res => {
        if (res) {
          let msg = choice == 'Task' ? '' : (choice === 'SubTask' ? '' : '');
          this.eventService.openSnackBar(msg + ' marked as done', "DISMISS");
          if (choice === 'task') {
            this.close(true);
          } else if (choice === 'subTask') {
            this.tabState = 1;
          }
        } else {
          this.eventService.openSnackBar('Marking Failed', 'DISMISS');
        }
      }, err => console.log(err));
  }

  addSubTask(item) {
    this.subTask.push(this.getSubTaskForm(item));
  }

  removeSubTask(index) {
    this.subTask.removeAt(index);
  }

  downloadAttachment(item) {
    this.crmTaskService.getAttachmentDownloadOfTaskSubTask({ taskAttachmentId: item.id })
      .subscribe(res => {
        if (res) {
          const httpOptions = {
            headers: new HttpHeaders()
              .set('Content-Type', '')
          };
          this.http.getHttpClient(res, httpOptions)
            .subscribe(res => {
              if (res) {
                console.log("download attachment response::", res);
              }
            }, err => console.error(err))
          // let link = document.createElement('a');
          // link.href = res;
          // link.download = item.attachmentName;
          // link.click();
        } else {
          this.eventService.openSnackBar("Fetching attachment Failed !", "DISMISS");
          console.log("hopefully this is error", res);
        }
      }, err => console.error(err));
  }

  getUploadUrlForAttachment(fileData, choice) {
    const obj = {
      attachmentName: fileData.name
    }
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
                  taskId: this.selectedSubTask.id
                }
              }
              this.uploadAttachmentToAws(obj, choice);
            }, error => console.error(error));

        }
      })
  }

  uploadAttachmentToAws(value, choice) {
    const data = {
      taskId: value.taskId,
      attachmentName: value.attachmentName,
      s3Uuid: value.s3Uuid
    }
    this.crmTaskService.addAttachmentTaskSubTask(data)
      .subscribe(res => {
        if (res) {
          console.log("attachment aws respo:", res);
          if (choice === 'task') {
            this.attachmentList.push(res);
          } else if (choice === 'subTask') {
            this.subTaskAttachmentList.push(res);
          }

          this.eventService.openSnackBar("Successfuly Uploaded Attachment!", "DISMISS");
        }
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
            this.subTaskList.push({
              isCompleted: false,
              assignedTo: data.value.assignedTo,
              description: data.value.description,
              turnAroundTime: data.value.turnAroundTime
            })
            this.addTaskForm.get(`subTask.${formGroupIndex}`).reset();
            this.eventService.openSnackBar("Successfully appended Subtask ", "DISMISS");
          }
        });
    } else {
      this.subTaskList.push({
        isCompleted: false,
        assignedTo: data.value.assignedTo,
        description: data.value.description,
        turnAroundTime: data.value.turnAroundTime
      })
    }
  }

  onAddingCollaborator(data) {
    console.log(data);
    if (this.data !== null) {
      const obj = {
        taskId: this.data.id,
        userId: this.selectedTeamMemberId
      }
      this.crmTaskService.addCollaboratorToTask(obj)
        .subscribe(res => {
          if (res) {
            console.log('this is added res of collaborator', res);
            this.collaboratorList.push(res);
            this.eventService.openSnackBar("Successfully added Collaborator to the task");
          }
        })
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
        const { subTaskList } = res;
        subTaskList.forEach(element => {
          this.subTaskList.push(element);
        });
        console.log('this is subtask List::: ')
        if (res.assignedTo) {
          this.addTaskForm.patchValue({ assignedTo: res.assignedTo, taskDescription: item.taskDescription });
        }
      }
    });
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
      this.onCreateTask();
    } else {
      this.addTaskForm.markAllAsTouched();
      this.eventService.openSnackBar("Please fill required Fields", "DISMISS");
    }
  }

  onCreateTask() {
    let subTaskArr = [];
    let taskNumberForSubTask;
    if (this.subTaskList.length !== 0) {
      this.subTaskList.forEach(element => {
        subTaskArr.push({
          taskNumber: this.getSubTaskNumber(),        //(order of task number should be maintained)
          assignedTo: element.ownerId,   //(same as assignedTo above)
          description: element.description,
          turnAroundTime: element.turnAroundTime
        });
      });

    } else {
      taskNumberForSubTask = 1;
      (this.addTaskForm.get('subTask') as FormArray).value.forEach(element => {
        subTaskArr.push({
          taskNumber: taskNumberForSubTask,        //(order of task number should be maintained)
          assignedTo: element.ownerId,   //(same as assignedTo above)
          description: element.description,
          turnAroundTime: element.turnAroundTime
        })
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
      this.crmTaskService.editActivityTask(editObj)
        .subscribe(res => {
          if (res) {
            console.log(res);
            this.eventService.openSnackBar("Successfully Saved!", "DISMISS");
            this.close(true);
          } else {
            this.eventService.openSnackBar("Editing Failed!", "DISMISS");
          }
        })
    } else {
      // add new task
      let data = {
        advisorId: this.advisorId,
        clientId: this.selectedClient.clientId,
        assignedTo: this.addTaskForm.get('assignedTo').value,
        description: this.addTaskForm.get('taskDescription').value,
        familyMemberId: this.addTaskForm.get('familyMemberId').value,
        dueDate: this.addTaskForm.get('taskDueDate').value.format("YYYY-MM-DD"),
        taskTemplateId: this.selectedTemplate !== null ? this.selectedTemplate.id : 0,
        categoryId: this.selectedTemplate !== null ? this.selectedTemplate.categoryId : 0,
        subCategoryId: this.selectedTemplate !== null ? this.selectedTemplate.subcategoryId : 0,
        subSubCategoryId: this.selectedTemplate !== null ? this.selectedTemplate.subSubCategoryId : 0,
        adviceTypeId: this.selectedTemplate !== null ? this.selectedTemplate.subSubCategoryId : 0,
        subTasks: subTaskArr,
      }
      console.log("this is add task create data", data);
      this.crmTaskService.addTask(data)
        .subscribe(res => {
          if (res) {
            console.log("response from add task", res);
            this.eventService.openSnackBar('Task Added Successfully', "DISMISS");
            this.close(true)
          }
        })
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
        taskId: this.selectedSubTask.id,         //(subTaskId in case of sub task)
        userId: this.userId,    //(userId of advisor)
        commentMsg: value
      }
    }

    this.crmTaskService.addCommentOnActivityTaskOrSubTask(data)
      .subscribe(res => {
        if (res) {
          console.log("this is what comment looks like", res);
          // reset form
          if (choice === 'task') {
            this.commentList.push(res);
          } else if (choice === 'subTask') {
            this.subTaskCommentList.push(res);
          }
          this.eventService.openSnackBar("Successfully Added Comment", "DISMISS");
        } else {
          this.eventService.openSnackBar("Failed to Added Comment", "DISMISS");
        }
      }, err => console.error(err));
  }

  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  toggleEditMode(item, choice) {
    item.editMode = true;
    switch (choice) {
      case 'task': this.commentTaskInput = item.commentMsg;
        // add dynamic form
        break;
      case 'subTask': this.commentSubTaskInput = item.commentMsg;
        // add dynamic form
        break;
    }

  }

  getFileData(fileList: FileList, choice) {
    let fileData = fileList.item(0);
    this.getUploadUrlForAttachment(fileData, choice);
  }

  preventDefault(event) {
    event.preventDefault();
  }

}




