import { Component, OnInit, ViewChildren, QueryList, Input } from '@angular/core';
import { SettingsService } from '../../settings.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { OrgSettingServiceService } from '../../org-setting-service.service';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { MatInput } from '@angular/material';

@Component({
  selector: 'app-add-task-template',
  templateUrl: './add-task-template.component.html',
  styleUrls: ['./add-task-template.component.scss']
})
export class AddTaskTemplateComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  taskTemplate
  advisorId: any;
  category: any;
  editMode: boolean = false;
  subTaskList = [];
  Tat = [
    {
      value: 1, tat: 'T+0 day'
    }, { value: 2, tat: 'T+1 day' }, { value: 3, tat: 'T+2 day' }, { value: 4, tat: 'T+3 day' },
    { value: 5, tat: 'T+4 day' }, { value: 6, tat: 'T+5 day' }, { value: 7, tat: 'T+6 day' },
    { value: 8, tat: 'T+7 day' }, { value: 9, tat: 'T+8 day' }, { value: 10, tat: 'T+9 day' }
  ]
  assetList: any;
  libilitiesList: any;
  insuranceList: any;
  assetSubCategoryList: any;
  listOfSub: any;
  libilitySubCategoryList: any;
  insuranceSubCategoryList: any;
  list: any;
  hideSubcategory: boolean = false;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  inputData: any;
  linkedTemplateId: any;
  isEdite: boolean;

  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data ', data)
    if (data == 1) {
      this.linkedTemplateId = data
    } else if (data == 2) {
      this.linkedTemplateId = data
    } else {
      this.getdataForm(data);
    }
  }

  get data() {
    return this.inputData;
  }
  constructor(private subInjectService: SubscriptionInject,
    private utilService: UtilService,
    private orgSetting: OrgSettingServiceService,
    private event: EventService,
    private fb: FormBuilder,
  ) {
    this.taskTemplate = this.fb.group({
      published: true,
      subTask: this.fb.array([]),
    });
  }
  ngOnInit() {
    this.getGlobalTaskData()
    this.getteamMemberList()
    this.getdataForm(this.inputData)
    this.taskTemplate.controls.category.setValue(1)
    this.advisorId = AuthService.getAdvisorId()
    this.category = 'asset'
    this.editMode = false;
    this.isEdite = false
  }
  getteamMemberList() {

    let obj = {
      advisorId: 55
    }
    this.orgSetting.getTeamMemberList(obj).subscribe(
      data => this.getTeamMemberListRes(data),
      err => this.event.openSnackBar(err, "Dismiss")
    );
  }
  getTeamMemberListRes(data) {
    console.log('team member', data)
  }

  getGlobalTaskData() {
    this.orgSetting.getGlobalDataTask().subscribe(
      data => {
        this.getGlobalDataTaskRes(data)
      },
      err => this.event.openSnackBar(err, "Dismiss")
    );
  }
  getGlobalDataTaskRes(data) {
    console.log('getGlobalDataTaskRes', data)
    this.assetList = data.task_template_category_and_subcategory_list[0]
    this.assetSubCategoryList = this.assetList.taskTempSubCategorytoCategoryList
    this.libilitiesList = data.task_template_category_and_subcategory_list[1]
    this.libilitySubCategoryList = this.libilitiesList.taskTempSubCategorytoCategoryList
    this.insuranceList = data.task_template_category_and_subcategory_list[2]
    this.insuranceSubCategoryList = this.insuranceList.taskTempSubCategorytoCategoryList
    this.getSelectedCategory(1, 'asset')
  }
  selectedSubcategory(value) {
    this.listOfSub = value.taskTempSubcattoSubCategories
    if (value.taskTempSubcattoSubCategories.length == 0) {
      this.hideSubcategory = true
    } else {
      this.hideSubcategory = false
    }
  }
  getSelectedCategory(value, category) {
    this.category = category
    console.log('getSelectedCategory', value)
    if (value == 1) {
      this.list = this.assetSubCategoryList
      if (this.inputData.subcategoryId) {
        var subList = this.list.filter(element => element.subcategoryId == this.inputData.subcategoryId)
        this.listOfSub = subList[0].taskTempSubcattoSubCategories
      }
    } else if (value == 2) {
      this.list = this.libilitySubCategoryList
      if (this.inputData.subcategoryId) {
        var subList = this.list.filter(element => element.subcategoryId == this.inputData.subcategoryId)
        this.listOfSub = subList[0].taskTempSubcattoSubCategories
      }
    } else {
      this.list = this.insuranceSubCategoryList
      if (this.inputData.subcategoryId) {
        var subList = this.list.filter(element => element.subcategoryId == this.inputData.subcategoryId)
        this.listOfSub = subList[0].taskTempSubcattoSubCategories
      }
    }
    this.getdataForm(this.inputData)
  }
  getdataForm(data) {
    if (!data) {
      data = {}
    }else if(data ==1){
      data = {}
    }else if(data == 2){
      data = {}
    }
    this.taskTemplate = this.fb.group({
      category: [(!data) ? '' : (data.categoryId), [Validators.required]],
      subCategory: [(!data) ? '' : (data.subcategoryId), [Validators.required]],
      subSubCategory: [(!data) ? '' : (data.subSubCategoryId), [Validators.required]],
      taskTemplate: [(!data) ? '' : data.taskDescription, [Validators.required]],
      adviceType: [(!data) ? '' : (data.adviceTypeId) + "", [Validators.required]],
      defaultAssign: [(!data) ? '' : data.ownerName],
      turnAroundTime: [(!data) ? '' : (data.turnAroundTime)],
      subTaskList: this.fb.array([this.fb.group({
        taskNumber: [1, [Validators.required]],
        description: [null, [Validators.required]],
        turnAroundTime: [null, [Validators.required]],
        ownerId: [null, [Validators.required]],
        isEdite: true,
      })]),
    });
    if (data.subTaskList != undefined) {
      data.subTaskList.forEach(element => {
        this.taskTemplate.controls.subTaskList.push(this.fb.group({
          taskNumber: [(1) + "", [Validators.required]],
          description: [(element.description + ""), Validators.required],
          turnAroundTime: [(element.turnAroundTime), Validators.required],
          ownerId: [element.ownerId, [Validators.required]],
          isEdite: false
        }))
      })
    }
  }
  editSubtask(value, flag, index) {
    value.controls.isEdite.setValue(true)
    console.log('flag', flag)

  }
  addSubTask(value, flag) {
    if (flag == 'add') {
         this.subTask.push(this.fb.group({
          taskNumber: [1, [Validators.required]],
          description: [null, [Validators.required]],
          turnAroundTime: [null, [Validators.required]],
          ownerId: [null, [Validators.required]],
          isEdite: false
        }));
    } else {
      console.log('creds --', value)
      if (value.invalid) {
        this.inputs.find(input => !input.ngControl.valid).focus();
        value.markAllAsTouched();
      } else {
        value.controls.isEdite.setValue(false)
        let obj = {
          TaskTemplateId: 1,
          taskNumber: 1,
          description: value.controls.description.value,
          turnAroundTime: value.controls.turnAroundTime.value,
          ownerId: 2727,
          id: value.controls.id.value,
        }
        if (value.controls.id.value) {
          this.orgSetting.editSubTaskTemplate(obj).subscribe(
            data => {
              this.editSubTaskTemplateRes(data)
            }, err => this.event.openSnackBar(err, "Dismiss")
          );
        } else {
          this.orgSetting.addSubtaskTemplate(obj).subscribe(
            data => {
              this.addSubtaskTemplateRes(data)
            }, err => this.event.openSnackBar(err, "Dismiss")
          );
        }
      }
    }
  }
  editSubTaskTemplateRes(data) {
    console.log('editSubTaskTemplateRes', data)
  }
  addSubtaskTemplateRes(data) {
    console.log('addSubtaskTemplateRes', data)
  }
  getFormControl(): any {
    return this.taskTemplate.controls;
  }
  get subTask() {
    return this.taskTemplate.get('subTaskList') as FormArray;
  }
  Close(flag: boolean) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
  toggleEditMode() {
    this.editMode = !this.editMode;
    console.log('hgdsfhg ==', this.editMode)
  }
  updateOwner() {
    if (this.inputData.id) {
      let obj = {
        ownerId: 2227,
        taskTemplateId: this.taskTemplate.controls.id.value,
      }
      this.orgSetting.updateOwnerTaskTemplate(obj).subscribe(
        data => {
          this.updateOwnerTaskTemplateRes(data)
        }, err => this.event.openSnackBar(err, "Dismiss")
      );
    }
  }
  updateOwnerTaskTemplateRes(data) {
    console.log('updateOwnerTaskTemplateRes', data)
  }
  removeSubTask(item) {
    if (this.subTask.value.length > 1) {
      this.subTask.removeAt(item);
    }
  }
  saveTaskTemplate() {
    let obj = {
      advisorId: this.advisorId,
      categoryId: this.taskTemplate.controls.category.value,
      subcategoryId: this.taskTemplate.controls.subCategory.value,
      linkedTemplateId: this.linkedTemplateId,
      adviceTypeId: this.taskTemplate.controls.adviceType.value,
      subSubCategoryId: this.taskTemplate.controls.subSubCategory.value,
      taskDescription: this.taskTemplate.controls.taskTemplate.value,
      assignedTo: 2727,
      turnAroundTime: this.taskTemplate.controls.turnAroundTime.value,
      subTaskList: this.taskTemplate.controls.subTaskList.value,
    }
    console.log('this what i want', obj)
    this.orgSetting.addTaskTemplate(obj).subscribe(
      data => {
        this.addTaskTemplateRes(data)
      },
      err => this.event.openSnackBar(err, "Dismiss")
    );
  }
  addTaskTemplateRes(data) {
    if (data) {

    } else {

    }
  }

}
export interface PeriodicElement {

  position: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Sub task 1' },

];