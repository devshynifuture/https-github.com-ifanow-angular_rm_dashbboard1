import { Component, Input, OnInit, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
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
    { value: 1, tat: 'T+0 day'}, { value: 2, tat: 'T+1 day' }, { value: 3, tat: 'T+2 day' }, { value: 4, tat: 'T+3 day' },{ value: 5, tat: 'T+4 day' }, { value: 6, tat: 'T+5 day' }, { value: 7, tat: 'T+6 day' }, { value: 8, tat: 'T+7 day' }, { value: 9, tat: 'T+8 day' }, { value: 10, tat: 'T+9 day' },
    { value: 11, tat: 'T+0 day'}, { value: 12, tat: 'T+1 day' }, { value: 13, tat: 'T+2 day' }, { value: 14, tat: 'T+3 day' },{ value: 15, tat: 'T+4 day' }, { value: 16, tat: 'T+5 day' }, { value: 17, tat: 'T+6 day' }, { value: 18, tat: 'T+7 day' }, { value: 19, tat: 'T+8 day' }, { value: 20, tat: 'T+9 day' },
    { value: 21, tat: 'T+0 day'}, { value: 22, tat: 'T+1 day' }, { value: 23, tat: 'T+2 day' }, { value: 24, tat: 'T+3 day' },{ value: 25, tat: 'T+4 day' }, { value: 26, tat: 'T+5 day' }, { value: 27, tat: 'T+6 day' }, { value: 28, tat: 'T+7 day' }, { value: 29, tat: 'T+8 day' }, { value: 30, tat: 'T+9 day' },
    { value: 31, tat: 'T+0 day'}, { value: 32, tat: 'T+1 day' }, { value: 33, tat: 'T+2 day' }, { value: 34, tat: 'T+3 day' },{ value: 35, tat: 'T+4 day' }, { value: 36, tat: 'T+5 day' }, { value: 37, tat: 'T+6 day' }, { value: 38, tat: 'T+7 day' }, { value: 39, tat: 'T+8 day' }, { value: 40, tat: 'T+9 day' },
    { value: 41, tat: 'T+0 day'}, { value: 42, tat: 'T+1 day' }, { value: 43, tat: 'T+2 day' }, { value: 44, tat: 'T+3 day' },{ value: 45, tat: 'T+4 day' }, { value: 46, tat: 'T+5 day' }, { value: 47, tat: 'T+6 day' }, { value: 48, tat: 'T+7 day' }, { value: 49, tat: 'T+8 day' }, { value: 50, tat: 'T+9 day' },
    { value: 51, tat: 'T+0 day'}, { value: 52, tat: 'T+1 day' }, { value: 53, tat: 'T+2 day' }, { value: 54, tat: 'T+3 day' },{ value: 55, tat: 'T+4 day' }, { value: 56, tat: 'T+5 day' }, { value: 57, tat: 'T+6 day' }, { value: 58, tat: 'T+7 day' }, { value: 59, tat: 'T+8 day' }, { value: 60, tat: 'T+9 day' },
    { value: 61, tat: 'T+0 day'}, { value: 62, tat: 'T+1 day' }, { value: 63, tat: 'T+2 day' }, { value: 64, tat: 'T+3 day' },{ value: 65, tat: 'T+4 day' }, { value: 66, tat: 'T+5 day' }, { value: 67, tat: 'T+6 day' }, { value: 68, tat: 'T+7 day' }, { value: 69, tat: 'T+8 day' }, { value: 70, tat: 'T+9 day' },
    { value: 71, tat: 'T+0 day'}, { value: 72, tat: 'T+1 day' }, { value: 73, tat: 'T+2 day' }, { value: 74, tat: 'T+3 day' },{ value: 75, tat: 'T+4 day' }, { value: 76, tat: 'T+5 day' }, { value: 77, tat: 'T+6 day' }, { value: 78, tat: 'T+7 day' }, { value: 79, tat: 'T+8 day' }, { value: 80, tat: 'T+9 day' },
    { value: 81, tat: 'T+0 day'}, { value: 82, tat: 'T+1 day' }, { value: 83, tat: 'T+2 day' }, { value: 84, tat: 'T+3 day' },{ value: 85, tat: 'T+4 day' }, { value: 86, tat: 'T+5 day' }, { value: 87, tat: 'T+6 day' }, { value: 88, tat: 'T+7 day' }, { value: 89, tat: 'T+8 day' }, { value: 90, tat: 'T+9 day' },
    { value: 91, tat: 'T+0 day'}, { value: 92, tat: 'T+1 day' }, { value: 93, tat: 'T+2 day' }, { value: 94, tat: 'T+3 day' },{ value: 95, tat: 'T+4 day' }, { value: 96, tat: 'T+5 day' }, { value: 97, tat: 'T+6 day' }, { value: 98, tat: 'T+7 day' }, { value: 99, tat: 'T+8 day' }, { value: 100, tat: 'T+9 day' }
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
  teamMemberList: any;

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
    this.advisorId = AuthService.getAdvisorId()

    this.taskTemplate = 
    this.fb.group({
      published: true,
      subTask: this.fb.array([]),
    });
  }
  ngOnInit() {
    this.getGlobalTaskData()
    this.getteamMemberList()
    this.getdataForm(this.inputData)
    this.taskTemplate.controls.category.setValue(1)
    this.category = 'asset'
    this.editMode = false;
    this.isEdite = false
  }
  getteamMemberList() {

    let obj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getTeamMemberList(obj).subscribe(
      data => this.getTeamMemberListRes(data),
      err => this.event.openSnackBar(err, "Dismiss")
    );
  }
  getTeamMemberListRes(data) {
    console.log('team member', data)
    this.teamMemberList = data
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
        if(subList.length>0){
          this.listOfSub = subList[0].taskTempSubcattoSubCategories
        }
      }
    } else if (value == 2) {
      this.list = this.insuranceSubCategoryList
      if (this.inputData.subcategoryId) {
        var subList = this.list.filter(element => element.subcategoryId == this.inputData.subcategoryId)
        if(subList.length>0){
        this.listOfSub = subList[0].taskTempSubcattoSubCategories
        }
      }
    } else {
      this.list = this.libilitySubCategoryList
      if (this.inputData.subcategoryId) {
        var subList = this.list.filter(element => element.subcategoryId == this.inputData.subcategoryId)
        if(subList.length>0){
        this.listOfSub = subList[0].taskTempSubcattoSubCategories
        }
      }
    }
    this.getdataForm(this.inputData)
  }
  getdataForm(data) {
    if (!data) {
      data = {}
    }
    this.taskTemplate = this.fb.group({
      category: [(!data) ? '' : (data.categoryId), [Validators.required]],
      subCategory: [(!data) ? '' : (data.subcategoryId), [Validators.required]],
      subSubCategory: [(!data) ? '' : (data.subSubCategoryId), [Validators.required]],
      taskTemplate: [(!data) ? '' : data.adviceType, [Validators.required]],
      adviceType: [(!data) ? '' : (data.adviceTypeId) + "", [Validators.required]],
      defaultAssign: [(!data) ? '' : data.ownerName],
      turnAroundTime1: [(!data) ? '' : (data.turnAroundTime)],
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
          turnAroundTime: [(element.turtAroundTime), Validators.required],
          ownerId: [element.ownerId, [Validators.required]],
          isEdite: false
        }))
      })
      this.subTask.removeAt(0);
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
        isEdite: true
      }));
      //value.controls.isEdite.setValue(true)
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
          turtAroundTime: value.controls.turnAroundTime.value,
          ownerId: value.controls.defaultAssign.value,
          id: null,
        }
        if (value.controls.id) {
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
        ownerId: this.taskTemplate.controls.defaultAssign.value,
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
    // if (this.taskTemplate.invalid) {
    //   for (let element in this.taskTemplate.controls) {
    //     console.log(element)
    //     if (this.taskTemplate.get(element).invalid) {
    //       // this.inputs.find(input => !input.ngControl.valid).focus();
    //       this.taskTemplate.controls[element].markAsTouched();
    //       this.taskTemplate.get('subSubCategory').markAsTouched();
    //       this.taskTemplate.get('subSubCategory').markAsTouched();
    //     }
    //   }
    // } else {
      let obj = {
        advisorId: this.advisorId,
        categoryId: this.taskTemplate.controls.category.value,
        subcategoryId: this.taskTemplate.controls.subCategory.value,
        linkedTemplateId: this.linkedTemplateId,
        adviceTypeId: this.taskTemplate.controls.adviceType.value,
        subSubCategoryId: this.taskTemplate.controls.subSubCategory.value,
        taskDescription: this.taskTemplate.controls.taskTemplate.value,
        assignedTo: this.taskTemplate.controls.defaultAssign.value,
        turnAroundTime: this.taskTemplate.controls.turnAroundTime1.value,
        subTaskList: this.taskTemplate.controls.subTaskList.value,
        id:null
      }
      if (this.taskTemplate.controls.id) {
        obj.id = this.taskTemplate.controls.id.value;
        console.log('this what i want', obj)
        this.orgSetting.editTaskTemplate(obj).subscribe(
          data => {
            this.editTaskTemplateRes(data)
          },
          err => this.event.openSnackBar(err, "Dismiss")
        );
      } else {
        console.log('this what i want', obj)
        this.orgSetting.addTaskTemplate(obj).subscribe(
          data => {
            this.addTaskTemplateRes(data)
          },
          err => this.event.openSnackBar(err, "Dismiss")
        );
      }
  }
  addTaskTemplateRes(data) {
    console.log('addTaskTemplateRes', data);
    this.event.openSnackBar('Added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true });
  }
  editTaskTemplateRes(data) {
    console.log('editTaskTemplateRes', data);
    this.event.openSnackBar('Updated successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true });
  }

}
export interface PeriodicElement {

  position: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Sub task 1' },

];