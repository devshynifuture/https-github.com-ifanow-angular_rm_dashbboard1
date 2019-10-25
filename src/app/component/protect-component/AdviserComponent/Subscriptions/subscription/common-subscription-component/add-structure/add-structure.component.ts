import {Component, OnInit, Output} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {EventEmitter} from 'events';
import {AuthService} from "../../../../../../../auth-service/authService";
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-add-structure',
  templateUrl: './add-structure.component.html',
  styleUrls: ['./add-structure.component.scss']
})
export class AddStructureComponent implements OnInit {
  planDataForm: any;
  editApiCall;
  @Output() planData = new EventEmitter();

  constructor(private eventService: EventService,private subinject: SubscriptionInject, private fb: FormBuilder, private subService: SubscriptionService) {
    this.subinject.rightSideBarData.subscribe(
      data => this.getSinglePlanData(data)
    );
  }

  isPlanValid = false;
  isCodeValid = false;
  isDescValid = false;
  advisorId;

  // planName = {maxLength: 20, placeholder: '', formControlName: 'planName', data: ''};

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
  }

  submitPlanData() {

  }

  getFormControl() {
    return this.planDataForm.controls;
  }


  getSinglePlanData(data) {
    this.editApiCall = data;
    this.planDataForm = this.fb.group({
      planName: [data.name, [Validators.required]],
      code: [data.code, [Validators.required]],
      description: [data.description, [Validators.required]]
    });
    this.getFormControl().planName.maxLength = 40;
    this.getFormControl().code.maxLength = 10;
    this.getFormControl().description.maxLength = 160;
  }

  addPlanData(state) {
    if (this.planDataForm.controls.planName.invalid) {
      this.isPlanValid = true;
      return;
    } else if (this.planDataForm.controls.code.invalid) {
      this.isCodeValid = true;
      return;
    } else if (this.planDataForm.controls.description.invalid) {
      this.isDescValid = true;
      return;
    } else {
      if (this.editApiCall == '') {
        const obj = {
          name: this.getFormControl().planName.value,
          description: this.getFormControl().description.value,
          // "advisorId": 12345,
          advisorId: this.advisorId,
          // logoUrl: 'url',
          // isPublic: 1,
          // isActive: 1,
          code: this.getFormControl().code.value
        };
        this.subService.addSettingPlanOverviewData(obj).subscribe(
          data => this.addPlanDataResponse(data, obj, state)
        );
      } else {
        const obj = {
          name: this.getFormControl().planName.value,
          description: this.getFormControl().description.value,
          code: this.getFormControl().code.value,
          id: this.editApiCall.id
        };
        this.subService.editPlanSettings(obj).subscribe(
          data => this.addPlanDataResponse(data, obj, state)
        );
      }

    }
  }

  addPlanDataResponse(data, obj, state) {
    obj.id = data.id;
    console.log(obj);
    this.subinject.pushUpperData(obj);
    this.subinject.rightSliderData(state);
    (this.editApiCall=='')?this.eventService.openSnackBar('Plan is created', 'OK'):this.eventService.openSnackBar('Plan is edited', 'OK');
  }

  closeNav(state) {
    this.subinject.rightSliderData(state);
    this.planDataForm.reset();
    this.isPlanValid = false;
    this.isCodeValid = false;
    this.isDescValid = false;
  }
}
