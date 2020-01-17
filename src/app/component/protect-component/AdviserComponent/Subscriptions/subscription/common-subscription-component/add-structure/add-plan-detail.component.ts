import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {AuthService} from '../../../../../../../auth-service/authService';
import {EventService} from 'src/app/Data-service/event.service';
import {ValidatorType} from '../../../../../../../services/util.service';

@Component({
  selector: 'app-add-plan-detail',
  templateUrl: './add-plan-detail.component.html',
  styleUrls: ['./add-plan-detail.component.scss']
})
export class AddPlanDetailComponent implements OnInit {
  editApiCall;
  @Output() planOuputData = new EventEmitter();
  isCheckPlanData: any;
  validatorType = ValidatorType;

  constructor(private eventService: EventService, private subinject: SubscriptionInject,
              private fb: FormBuilder, private subService: SubscriptionService) {
  }

  @Input() set planData(data) {
    this.isCheckPlanData = data;
    this.getSinglePlanData(data);
  }

  isPlanValid = false;
  isCodeValid = false;
  isDescValid = false;
  advisorId;
  planDataForm = this.fb.group({
    planName: [, [Validators.required]],
    code: [, [Validators.required]],
    description: [, [Validators.required]]
  });

  // planName = {maxLength: 20, placeholder: '', formControlName: 'planName', data: ''};

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    (this.isCheckPlanData) ? console.log('get planData') : this.createPlanForm('');
  }

  submitPlanData() {

  }

  createPlanForm(data) {
    this.planDataForm = this.fb.group({
      planName: [data, [Validators.required]],
      code: [data, [Validators.required]],
      description: [data, [Validators.required]]
    });

  }

  getFormControl(): any {
    return this.planDataForm.controls;
  }


  getSinglePlanData(data) {
    if (data == '') {
      return;
    } else {
      this.editApiCall = data;
      this.planDataForm = this.fb.group({
        planName: [data.name, [Validators.required]],
        code: [data.code, [Validators.required]],
        description: [data.description, [Validators.required]]
      });
    }
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
      if (!this.editApiCall) {
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
    // obj.id = (this.editApiCall == '') ? data : data.id
    // console.log(obj);
    this.planOuputData.emit(data);
    (!this.editApiCall) ? this.eventService.openSnackBar('Plan is created', 'OK') : this.eventService.openSnackBar('Plan is edited', 'OK');
    this.subinject.changeUpperRightSliderState({state: 'close'});

  }

  closeNav(state) {
    this.subinject.changeUpperRightSliderState({state: 'close'});
    this.planDataForm.reset();
    this.isPlanValid = false;
    this.isCodeValid = false;
    this.isDescValid = false;
  }
}
