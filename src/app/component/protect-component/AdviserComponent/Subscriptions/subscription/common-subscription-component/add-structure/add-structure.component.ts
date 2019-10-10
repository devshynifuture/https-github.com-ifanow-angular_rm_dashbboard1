import {Component, OnInit, Output} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {EventEmitter} from 'events';

@Component({
  selector: 'app-add-structure',
  templateUrl: './add-structure.component.html',
  styleUrls: ['./add-structure.component.scss']
})
export class AddStructureComponent implements OnInit {
  planDataForm: any;
  editApiCall;
  @Output() planData = new EventEmitter();

  constructor(private subinject: SubscriptionInject, private fb: FormBuilder, private subService: SubscriptionService) {
    this.subinject.rightSideBarData.subscribe(
      data => this.getSinglePlanData(data)
    );
  }

  isPlanValid = false;
  isCodeValid = false;
  isDescValid = false;
  // planName = {maxLength: 20, placeholder: '', formControlName: 'planName', data: ''};

  ngOnInit() {
  }

  submitPlanData() {

  }

  getFormControl() {
    return this.planDataForm.controls;
  }


  getSinglePlanData(data) {
    this.editApiCall = data
    this.planDataForm = this.fb.group({
      planName: [data.name, [Validators.required]],
      code: [data.code, [Validators.required]],
      description: [data.description, [Validators.required]]
    });
    this.getFormControl().planName.maxLength = 20;
  }

  addPlanData(state) {
    if (this.planDataForm.controls.planName.invalid) {
      this.isPlanValid = true
      return;
    } else if (this.planDataForm.controls.code.invalid) {
      this.isCodeValid = true
      return;
    } else if (this.planDataForm.controls.description.invalid) {
      this.isDescValid = true
      return;
    } else {
      if (this.editApiCall == '') {
        let obj = {
          "name": this.getFormControl().planName.value,
          "description": this.getFormControl().description.value,
          "advisorId": 12345,
          "logoUrl": "url",
          "isPublic": 1,
          "isActive": 1,
          "code": this.getFormControl().code.value
        }
        this.subService.addSettingPlanOverviewData(obj).subscribe(
          data => this.addPlanDataResponse(data, obj, state)
        )
      } else {
        let obj = {
          "name": this.getFormControl().planName.value,
          "description": this.getFormControl().description.value,
          "code": this.getFormControl().code.value,
          "id": this.editApiCall.id
        }
        this.subService.editPlanSettings(obj).subscribe(
          data => this.addPlanDataResponse(data, obj, state)
        )
      }

    }
  }

  addPlanDataResponse(data, obj, state) {
    obj.id = data;
    console.log(obj)
    this.subinject.pushUpperData(obj)
    this.subinject.rightSliderData(state)
  }

  closeNav(state) {
    this.subinject.rightSliderData(state)
    this.planDataForm.reset();
    this.isPlanValid = false;
    this.isCodeValid = false;
    this.isDescValid = false;
  }
}
