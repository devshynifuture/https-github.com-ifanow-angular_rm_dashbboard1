import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, NgZone } from '@angular/core';
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
        taskDescription: [data.des,],
        familyMemberId: [data.familyMemberId,],
        subTask: this.fb.array([])
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
        subTask: this.fb.array([])
      });
    }
  }

  initPoint() {
    if (this.data !== null) {
      this.collaboratorList = this.data.collaborators;
      this.commentList = this.data.comments;
      this.attachmentList = this.data.attachments;
      // default: true
      // id: 5
      // name: "Shubh Manan"
      // profilePicUrl: "http://res.cloudinary.com/futurewise/image/upload/v1588855641/advisor_profile_logo/iqogxi6vfagmeildg7e0.png"
      // taskId: 9
      // userId: 25
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

  changeTabState(value) {
    this.tabState = value;
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

  getSubTaskForm() {
    return this.fb.group({
      isCompleted: [false,],
      description: [, Validators.required],
      turnAroundTime: [, Validators.required],
      assignedTo: [, Validators.required],
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

  deleteAttachmentOfTask(id, index) {
    this.crmTaskService.deleteAttachmentTaskSubTask(id)
      .subscribe(res => {
        if (res) {
          this.eventService.openSnackBar('Attachment Deleted Successfully!', "DISMISS");
          this.attachmentList.removeAt(index);
        } else {
          this.eventService.openSnackBar('Delete failed!', "DISMISS");
          console.log(res);
        }
      }, err => console.error(err))
  }

  deleteCommentTaskSubTask(id) {
    this.crmTaskService.deleteCommentTaskSubTask(id)
      .subscribe(res => {
        if (res) {
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
        } else {
          this.eventService.openSnackBar('Removing failed!', "DISMISS");
          console.log(res);
        }
      }, err => console.error(err))
  }

  deleteSubTask(item) {
    const data = {
      id: 3,
      taskId: 7,
      taskNumber: 1,
      description: "Subtask 1",
      dueDate: "2020-07-10",
      turnAroundTime: 1,
      assignedTo: 103092,
      status: 0
    }

    this.crmTaskService.deleteSubTaskFromTask(data)
      .subscribe(res => {
        if (res) {
          this.eventService.openSnackBar('Subtask deleted Successfully!', "DISMISS");
        } else {
          this.eventService.openSnackBar('Delete failed!', "DISMISS");
          console.log(res);
        }
      }, err => console.error(err))
  }

  markTaskOrSubTaskDone(item) {
    let data;
    if (item.choice === 'task') {
      data = {
        taskId: item.id,
        status: 1
      }
    } else if (item.choice === 'subTask') {
      data = {
        subTaskId: item.id,
        status: 1
      }
    }

    this.crmTaskService.markTaskOrSubTaskDone(data)
      .subscribe(res => {
        if (res) {
          let msg = item.choice == 'task' ? '' : (item.choice === 'subTask' ? '' : '');
          this.eventService.openSnackBar(msg, "DISMISS");
        } else {
          this.eventService.openSnackBar('Marking Failed', 'DISMISS');
        }
      }, err => console.log(err));
  }

  addSubTask() {
    this.subTask.push(this.getSubTaskForm());
  }

  removeSubTask(index) {
    this.subTask.removeAt(index);
  }

  downloadAttachment(item) {
    this.crmTaskService.getAttachmentDownloadOfTaskSubTask({ taskAttachmentId: item.id })
      .subscribe(res => {
        if (res) {
          let link = document.createElement('a');
          link.href = res;
          link.download = item.attachmentName;
          link.click();
        } else {
          this.eventService.openSnackBar("Fetching attachment Failed !", "DISMISS");
          console.log("hopefully this is error", res);
        }
      }, err => console.error(err));
  }

  getUploadUrlForAttachment(fileData) {
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
              let obj = {
                ...res,
                attachmentName: fileData.name,
                taskId: this.data.id
              }
              this.uploadAttachmentToAws(obj);
            }, error => console.error(error));

        }
      })
  }

  uploadAttachmentToAws(value) {
    const data = {
      taskId: value.taskId,
      attachmentName: value.attachmentName,
      s3Uuid: value.s3Uuid
    }
    this.crmTaskService.addAttachmentTaskSubTask(data)
      .subscribe(res => {
        if (res) {
          console.log("attachment aws respo:", res);
          this.attachmentList.push(res);
          this.eventService.openSnackBar("Successfuly Uploaded Attachment!", "DISMISS");
        }
      })
  }

  appendSubTask(data) {
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
            this.eventService.openSnackBar("Successfully added Collaborator to the task");
          }
        })
    }
  }

  onCreateSubTaskWhileView(data) {
    console.log("tihs nees to be created:::,", data);
    const obj = {
      "taskId": 7,
      "taskNumber": 2,
      "assignedTo": 103092,
      "description": "Subtask 2",
      "turnAroundTime": 1
    }

    const obj1 = {
      taskId: '',
      taskNumber: '',
      assignedTo: '',
      description: '',
      turnAroundTime: ''
    }

    // this.crmTaskService.addSubTaskActivity(data)
    //   .subscribe(res=>{
    //     if(res){
    //       console.log("added response of subtask:::",res);
    //       this.eventService.openSnackBar("Successfully added a SubTask!","DISMISS");
    //     }
    //   })
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
        // const control = <FormArray>this.addressForm.controls.address;
        // control.push(this.addOldAddress(i));
        // this.subTaskList.forEach(element => {
        //   (this.addTaskForm.get('subTask') as FormArray).push(this.getSubTaskForm(element))
        // });
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


    const data = {
      advisorId: this.advisorId,
      clientId: this.selectedClient.clientId,
      assignedTo: this.addTaskForm.get('assignedTo').value,
      description: this.addTaskForm.get('taskDescription').value, //(from template or can be manually added)
      familyMemberId: this.addTaskForm.get('familyMemberId').value,
      dueDate: this.addTaskForm.get('taskDueDate').value.format("YYYY-MM-DD"),
      taskTemplateId: this.selectedTemplate !== null ? this.selectedTemplate.id : 0,      //(id of selected template else 0)
      categoryId: this.selectedTemplate !== null ? this.selectedTemplate.categoryId : 0,           //(from template else 0)
      subCategoryId: this.selectedTemplate !== null ? this.selectedTemplate.subcategoryId : 0,        //(from template else 0)
      subSubCategoryId: this.selectedTemplate !== null ? this.selectedTemplate.subSubCategoryId : 0,    //(from template else 0)
      adviceTypeId: this.selectedTemplate !== null ? this.selectedTemplate.subSubCategoryId : 0,          //(from template else 0)
      subTask: subTaskArr,
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
    // console.log("this is some addTask Form value", this.addTaskForm.value);
  }

  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  getFileData(fileList: FileList) {
    let fileData = fileList.item(0);

    this.getUploadUrlForAttachment(fileData);
  }

  preventDefault(event) {
    event.preventDefault();
  }

}




