import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionService } from '../../../subscription.service';
import { AuthService } from '../../../../../../../auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { ValidatorType } from '../../../../../../../services/util.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-add-plan-detail',
  templateUrl: './add-plan-detail.component.html',
  styleUrls: ['./add-plan-detail.component.scss']
})
export class AddPlanDetailComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
    buttonColor: 'primary',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  }
  editApiCall;
  @Output() planOuputData = new EventEmitter();
  isCheckPlanData: any;
  validatorType = ValidatorType;

  constructor(private eventService: EventService, private subinject: SubscriptionInject,
    private fb: FormBuilder, private subService: SubscriptionService) {
  }

  @Input() set data(data) {
    this.isCheckPlanData = data;
    this.getSinglePlanData(data);
  }

  isPlanValid = false;
  isCodeValid = false;
  isDescValid = false;
  advisorId;
  planDataForm = this.fb.group({
    planName: ['', [Validators.required]],
    code: ['', [Validators.required]],
    description: ['', [Validators.required]]
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
    console.log(data.id, "editPlanData");
    
    if (data.id != undefined) {
      this.editApiCall = data;
      this.planDataForm.get('planName').setValue(data.name);
      this.planDataForm.get('code').setValue(data.code);
      this.planDataForm.get('description').setValue(data.description);
    }
  }

  addPlanData(state) {
    if(this.planDataForm.invalid){
      this.planDataForm.get('planName').markAsTouched();
      this.planDataForm.get('code').markAsTouched();
    }
    else {
      this.barButtonOptions.active = true;
      if (this.editApiCall.id == undefined) {
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
          data =>{
            this.addPlanDataResponse(data, obj, state);
            this.barButtonOptions.active = false;
          },
          err =>{
            this.barButtonOptions.active = false;
            console.log(err,"error");
            
          }
        );
      } else {
        const obj = {
          name: this.getFormControl().planName.value,
          description: this.getFormControl().description.value,
          code: this.getFormControl().code.value,
          id: this.editApiCall.id
        };
        this.subService.editPlanSettings(obj).subscribe(
          data =>{
           this.addPlanDataResponse(data, obj, state);
           this.barButtonOptions.active = false;

          },
          err =>{
            this.barButtonOptions.active = false;
            console.log(err,"error");
          }
        );
      }

    }
  }

  // progressButtonClick(state){
  //   if(this.planDataForm.valid){
  //     this.barButtonOptions.active = true;
  //     this.addPlanData(state);
  //   }else{
  //     this.planDataForm.get('planName').markAsTouched();
  //     this.planDataForm.get('code').markAsTouched();
  //     this.planDataForm.get('description').markAsTouched();
  //   }
  // }

  addPlanDataResponse(data, obj, state) {
    // obj.id = (this.editApiCall == '') ? data : data.id
    // console.log(obj);
    this.planOuputData.emit(data);
    (!this.editApiCall) ? this.eventService.openSnackBar('Plan is created', 'OK') : this.eventService.openSnackBar('Plan is edited', 'OK');
    this.subinject.changeNewRightSliderState({ state: 'close', data: data });

  }

  closeNav(state) {
    this.subinject.changeNewRightSliderState({ state: 'close' });
    this.planDataForm.reset();
    this.isPlanValid = false;
    this.isCodeValid = false;
    this.isDescValid = false;
  }
}
