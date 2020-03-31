import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'planner2.0/src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'planner2.0/src/app/services/util.service';
import { SettingsService } from '../../settings.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { OrgSettingServiceService } from '../../org-setting-service.service';
import { AuthService } from 'src/app/auth-service/authService';

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
  constructor(private subInjectService: SubscriptionInject,
    private utilService: UtilService,
    private orgSetting: OrgSettingServiceService,
    private event: EventService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.getdataForm('')
    this.advisorId = AuthService.getAdvisorId()
  }

  getdataForm(data) {
    this.taskTemplate = this.fb.group({
      category: [(!data) ? '' : (data.category), [Validators.required]],
      subCategory: [(!data) ? '' : data.subCategory, [Validators.required]],
      taskTemplate: [(!data) ? '' : data.taskTemplate, [Validators.required]],
      defaultAssign: [(!data) ? '' : data.defaultAssign],
      turnaroundTime: [(!data) ? '' : data.turnaroundTime],
    });
  }

  getFormControl(): any {
    return this.taskTemplate.controls;
  }
  Close(flag: boolean) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
  saveTaskTemplate(){
    let obj = {
      
        advisorId:this.advisorId,
        categoryId:1,
        subcategoryId:2,
        linkedTemplateId:2,
        taskDescription:this.taskTemplate.controls.taskTemplate.value,
        assignedTo:this.taskTemplate.controls.defaultAssign.value,
        turnAroundTime:this.taskTemplate.turnaroundTime.value,
        subTaskList: [{
          taskNumber:1,
          description: "Abcd needs to be done today!",
          turtAroundTime:2,
          ownerId:2727
        },{
          taskNumber:1,
          description: "Abcd needs to be done today!",
          turtAroundTime:2,
          ownerId:2727
        }]
    }
    this.orgSetting.addTaskTemplate(obj).subscribe(
      data => {
        this.addTaskTemplateRes(data)
      },
      err => this.event.openSnackBar(err, "Dismiss")
    );
  }
  addTaskTemplateRes(data){
    if(data){

    }else{

    }
  }
}
export interface PeriodicElement {

  position: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Sub task 1' },

];