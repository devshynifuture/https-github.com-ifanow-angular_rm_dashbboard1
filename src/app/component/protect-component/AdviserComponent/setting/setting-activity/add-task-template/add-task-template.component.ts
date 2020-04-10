import { Component, Input, OnInit, Output, EventEmitter, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { SettingsService } from '../../settings.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { OrgSettingServiceService } from '../../org-setting-service.service';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { MatInput } from '@angular/material';
import { Subscription, Observable, observable } from 'rxjs';

@Component({
  selector: 'app-add-task-template',
  templateUrl: './add-task-template.component.html',
  styleUrls: ['./add-task-template.component.scss']
})
export class AddTaskTemplateComponent implements OnInit, OnDestroy {
  teamMemberList: any[];
  taskTemplate:FormGroup;
  advisorId: any;
  user:any;
  Tat = [];
  isLoading:boolean = true;
  loadCounter:number = 0;
  globalData:any = {};
  subscription = new Subscription();
  categoryList: any[] = [];
  category: any = 'asset';
  listOfSub: any;

  dataEdited = false;
  
  @Input() data;
  hideSubcategory: boolean = true;

  constructor(
    private subInjectService: SubscriptionInject,
    private orgSetting: OrgSettingServiceService,
    private event: EventService,
    private fb: FormBuilder,
  ) {
    this.advisorId = AuthService.getAdvisorId()
    this.user = AuthService.getUserInfo();

    // create turnaround time list
    for (let index = 1; index <= 100; index++) {
      this.Tat.push({ value: index, tat: `T+${index} day` })
    }
  }

  ngOnInit() {
    if(this.data.templateType == 1) {
      this.getGlobalTaskData();
    }
    this.getteamMemberList();
  }
  
  getteamMemberList() {
    this.changeLoadCounter(1);
    let obj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getTeamMemberList(obj).subscribe(
      data => {
        this.changeLoadCounter(-1);
        this.teamMemberList = data
        this.teamMemberList.unshift(this.user);
      },
      err => this.event.openSnackBar(err, "Dismiss")
    );
  }

  getGlobalTaskData() {
    this.changeLoadCounter(1);
    this.orgSetting.getGlobalDataTask().subscribe(
      data => {
        this.globalData = data;
        this.changeLoadCounter(-1);
      },
      err => this.event.openSnackBar(err, "Dismiss")
    );
  }

  selectedSubcategory(value) {
    this.listOfSub = value.taskTempSubcattoSubCategories
    this.taskTemplate.controls.subSubCategoryId.setValue('');
    if (this.listOfSub.length == 0) {
      this.hideSubcategory = true;
      this.taskTemplate.controls.subSubCategoryId.clearValidators();
      this.taskTemplate.updateValueAndValidity();
    } else {
      this.hideSubcategory = false;
      this.taskTemplate.controls.subSubCategoryId.setValidators([Validators.required]);
      this.taskTemplate.updateValueAndValidity();
    }
  }

  createTaskTemplateForm() {
    this.taskTemplate = this.fb.group({
      id: [this.data.id, []],
      advisorId: this.advisorId,
      categoryId: [this.data.categoryId || 1],
      subcategoryId: [this.data.subcategoryId || ''],
      subSubCategoryId: [this.data.subSubCategoryId || ''],
      adviceTypeId: [this.data.adviceTypeId || ''],
      templateType: this.data.templateType,
      taskDescription: [this.data.taskDescription || ''],
      assignedTo: this.data.ownerName || '',
      turnAroundTime: [this.data.turnAroundTime || ''],
      subTaskList: this.fb.array([]),
    });

    // assign validators based on template type
    if (this.taskTemplate.controls.templateType.value == 1) {
      this.taskTemplate.controls.categoryId.setValidators([Validators.required]);
      this.taskTemplate.controls.subcategoryId.setValidators([Validators.required]);
      this.taskTemplate.controls.adviceTypeId.setValidators([Validators.required]);
      this.taskTemplate.controls.subSubCategoryId.setValidators([Validators.required]);
    } else {
      this.taskTemplate.controls.taskDescription.setValidators([Validators.required]);
    }

    const subtask = this.taskTemplate.controls.subTaskList as FormArray;
    if (this.data.subTaskList) {
      this.data.subTaskList.forEach(element => {
        subtask.push(this.subTaskFormGroup(
          element.id,
          element.taskNumber,
          element.description,
          element.turnAroundTime,
          element.ownerId
        ));
      })
    }

    if(this.data.id) {
      this.taskTemplate.controls.subSubCategoryId.clearValidators();
    }

    this.taskTemplate.updateValueAndValidity();
  }

  setFormListeners(){
    this.subscription.add(
      this.taskTemplate.controls.categoryId.valueChanges.subscribe(value => {
        this.category = value == 1 ? 'Asset' : value == 2 ? 'Insurance' : 'Liability';
        this.taskTemplate.controls.subcategoryId.setValue('');
        this.taskTemplate.controls.subSubCategoryId.setValue('');
        this.dataEdited = true;
        this.hideSubcategory = true;
        this.categoryList = this.globalData.task_template_category_and_subcategory_list.find(data => data.categoryId == value).taskTempSubCategorytoCategoryList;
      })
    )
    if(this.data.id) {
      this.subscription.add(
        this.taskTemplate.controls.subcategoryId.valueChanges.subscribe(value => {
        this.dataEdited = true;
        })
      )
      this.subscription.add(
        this.taskTemplate.controls.subSubCategoryId.valueChanges.subscribe(value => {
        this.dataEdited = true;
        })
      )
      this.subscription.add(
        this.taskTemplate.controls.adviceTypeId.valueChanges.subscribe(value => {
        this.dataEdited = true;
        })
      )
      this.subscription.add(
        this.taskTemplate.controls.templateType.valueChanges.subscribe(value => {
        this.dataEdited = true;
        })
      )
      this.subscription.add(
        this.taskTemplate.controls.taskDescription.valueChanges.subscribe(value => {
        this.dataEdited = true;
        })
      )
      this.subscription.add(
        this.taskTemplate.controls.assignedTo.valueChanges.subscribe(value => {
        this.dataEdited = true;
        })
      )
      this.subscription.add(
        this.taskTemplate.controls.turnAroundTime.valueChanges.subscribe(value => {
        this.dataEdited = true;
        })
      )
    }
  }

  subTaskFormGroup(id = '', taskNo = '', desp = '', tat = '', ownerId = '') {
    return this.fb.group({
      id: id,
      taskNumber: taskNo,
      description: [(desp), Validators.required],
      turnAroundTime: [tat],
      ownerId: [ownerId],
    })
  }

  addSubTask() {
    const subtask = this.taskTemplate.controls.subTaskList as FormArray;
    subtask.push(this.subTaskFormGroup());
  }

  get subTask() {
    return this.taskTemplate.get('subTaskList') as FormArray;
  }

  Close(flag: boolean) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  save() {
    if(this.taskTemplate.invalid) {
      this.taskTemplate.markAllAsTouched();
      return;
    }
    if(this.data.id) {
      this.saveEditedTemplate();
    }else {
      this.saveNewTemplate();
    }
  }

  saveEditedTemplate(){
    let jsonObj = this.taskTemplate.value;
    jsonObj.subTaskList = this.reorderSubtasksForEditedTemplate();
    jsonObj.isEdited = this.dataEdited ? 1 : 0;

    this.orgSetting.editTaskTemplate(jsonObj).subscribe(
      data => {
        this.event.openSnackBar('Modified successfully!', 'Dismiss');
        this.Close(true);
      },
      err => this.event.openSnackBar(err, "Dismiss")
    );
  }

  saveNewTemplate(){
    let jsonObj = this.taskTemplate.value;
    delete jsonObj.id;
    jsonObj.subTaskList.forEach((task, index) => {
      task.taskNumber = index + 1;
    });
    if(jsonObj.taskTemplate == 1) {
      jsonObj.taskDescription = this.globalData.system_generated_advice_map_key.find(obj => obj.id == jsonObj.adviceTypeId).name;
    }
    this.orgSetting.addTaskTemplate(jsonObj).subscribe(
      data => {
        this.event.openSnackBar('Added successfully!', 'Dismiss');
        this.Close(true);
      },
      err => this.event.openSnackBar(err, "Dismiss")
    );
  }

  reorderSubtasksForEditedTemplate() {
    let formSubTaskList = this.subTask.value as Array<any>;
    let deletedSubTasks = this.data.subTaskList.filter(sb => !formSubTaskList.map(li => li.id).includes(sb.id));
    deletedSubTasks.forEach(task => {
      task.taskNumber = 0;
      task['isEdited'] = 0;
      task['isDeleted'] = 1;
    });

    formSubTaskList.forEach((newSubTask, index) => {
      const previousSubtask = this.data.subTaskList.find(subTask => subTask.id == newSubTask.id);
      if(previousSubtask) {
        if(previousSubtask.description == newSubTask.description &&
          previousSubtask.turnAroundTime == newSubTask.turnAroundTime &&
          previousSubtask.ownerId == newSubTask.ownerId) {

          newSubTask['isEdited'] = 0;
        } else {
          newSubTask['isEdited'] = 1;
        }
        newSubTask.taskNumber = index + 1;
        newSubTask['isDeleted'] = 0;
      }
    });

    return [deletedSubTasks, formSubTaskList].flat();
  }

  changeLoadCounter(value) {
    this.loadCounter += value;
    if (this.loadCounter == 0) {
      this.isLoading = false;
      this.createTaskTemplateForm();
      this.setFormListeners();
      this.initializeVariables();
      this.taskTemplate.updateValueAndValidity();
    } else {
      this.isLoading = true;
    }
  }

  initializeVariables(){
    if(this.data.templateType == 1) {
      this.categoryList = this.globalData.task_template_category_and_subcategory_list.find(data => data.categoryId == this.taskTemplate.get('categoryId').value).taskTempSubCategorytoCategoryList;
    }

    if(this.data.id) {
      this.listOfSub = this.categoryList.find(data => this.data.subcategoryId == data.subcategoryId).taskTempSubcattoSubCategories;
      if(this.listOfSub.length == 0) {
        this.hideSubcategory = true;
      } else {
        this.hideSubcategory = false;
      }
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}