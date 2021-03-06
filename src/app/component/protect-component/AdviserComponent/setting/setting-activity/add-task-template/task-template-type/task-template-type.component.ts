import { Component, OnInit } from '@angular/core';
import { AddTaskTemplateComponent } from '../add-task-template.component';
import { OrgSettingServiceService } from '../../../org-setting-service.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-task-template-type',
  templateUrl: './task-template-type.component.html',
  styleUrls: ['./task-template-type.component.scss']
})
export class TaskTemplateTypeComponent implements OnInit {
  taskTemplateType: any;

  constructor(
    private subInjectService: SubscriptionInject,
    private utilService: UtilService,
    private orgSetting: OrgSettingServiceService,
    private event: EventService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.getdataForm('')
    this.taskTemplateType.controls.type.setValue(1)
  }
  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
  getdataForm(data) {
    this.taskTemplateType = this.fb.group({
      type: [(!data) ? '' : (data.type+""), [Validators.required]],
    });
   
  }
  
  getFormControl(): any {
    return this.taskTemplateType.controls;
  }
  addTaskTemplate() {
    var data = {templateType: this.taskTemplateType.controls.type.value};
    const fragmentData = {
      flag: '',
      data: data,
      state: 'open50',
      componentName: AddTaskTemplateComponent
    };
    this.subInjectService.changeNewRightSliderState(fragmentData)
  }
}
