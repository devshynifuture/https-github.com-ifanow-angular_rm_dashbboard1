import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../settings.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
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
  constructor(private subInjectService: SubscriptionInject,
    private utilService: UtilService,
    private orgSetting: OrgSettingServiceService,
    private event: EventService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.getdataForm('')
    this.advisorId = AuthService.getAdvisorId()
    this.category = 'asset'
    this.editMode = false;
    this.taskTemplate.controls.category.setValue(1)
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

  getFormControl(): any {
    return this.taskTemplate.controls;
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
      assignedTo: this.taskTemplate.controls.defaultAssign.value,
      turnAroundTime: this.taskTemplate.turnaroundTime.value,
      subTaskList: [{
        taskNumber: 1,
        description: "Abcd needs to be done today!",
        turtAroundTime: 2,
        ownerId: 2727
      }, {
        taskNumber: 1,
        description: "Abcd needs to be done today!",
        turtAroundTime: 2,
        ownerId: 2727
      }]
    }
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