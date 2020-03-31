import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../settings.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { OrgSettingServiceService } from '../../org-setting-service.service';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

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
    this.getdataForm('')
    this.advisorId = AuthService.getAdvisorId()
    this.category = 'asset'
    this.editMode = false;
    this.taskTemplate.controls.category.setValue(1)
    this.getGlobalTaskData()
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
  }
  selectedSubcategory(value){
    this.listOfSub = value.taskTempSubcattoSubCategories
  }
  getSelectedCategory(value, category) {
    this.category = category
    console.log('getSelectedCategory', value)
  }
  getdataForm(data) {
    this.taskTemplate = this.fb.group({
      category: [(!data) ? '' : (data.category), [Validators.required]],
      subCategory: [(!data) ? '' : data.subCategory, [Validators.required]],
      taskTemplate: [(!data) ? '' : data.taskTemplate, [Validators.required]],
      defaultAssign: [(!data) ? '' : data.defaultAssign],
      turnaroundTime: [(!data) ? '' : data.turnaroundTime],
      subTaskList: this.fb.array([this.fb.group({
        taskNumber: [null, [Validators.required]],
        description: [null, [Validators.required]],
        turtAroundTime: [null, [Validators.required]],
        ownerId: [null, [Validators.required]]
      })]),
    });
    if (data.subTaskList != undefined) {
      data.subTaskList.forEach(element => {
        this.taskTemplate.controls.subTaskList.push(this.fb.group({
          taskNumber: [(element.taskNumber) + "", [Validators.required]],
          description: [(element.description + ""), Validators.required],
          turtAroundTime: [(element.turtAroundTime), Validators.required],
          ownerId: [element.ownerId, [Validators.required]]
        }))
      })
    }
  }
  addSubTask() {
    this.subTask.push(this.fb.group({
      taskNumber: [null, [Validators.required]],
      description: [null, [Validators.required]],
      turtAroundTime: [null, [Validators.required]],
      ownerId: [null, [Validators.required]],
    }));
    let obj = {
      TaskTemplateId:3,
      taskNumber:1,
      description: "Abcd needs to be done today!",
      turtAroundTime:2,
      ownerId:2727
    }
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
  changeTableTdValue(value, ele) {

  }
  toggleEditMode() {
    this.editMode = !this.editMode;
    console.log('hgdsfhg ==', this.editMode)
  }
  saveTaskTemplate() {
    let obj = {

      advisorId: this.advisorId,
      categoryId: 1,
      subcategoryId: 2,
      linkedTemplateId: 2,
      taskDescription: this.taskTemplate.controls.taskTemplate.value,
      assignedTo: 2727,
      turnAroundTime: this.taskTemplate.controls.turnaroundTime.value,
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