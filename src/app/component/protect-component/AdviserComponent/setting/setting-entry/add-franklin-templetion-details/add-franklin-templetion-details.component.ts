import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SettingsService } from '../../settings.service';
import { ValidatorType } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { AppConstants } from 'src/app/services/app-constants';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-add-franklin-templetion-details',
  templateUrl: './add-franklin-templetion-details.component.html',
  styleUrls: ['./add-franklin-templetion-details.component.scss']
})
export class AddFranklinTempletionDetailsComponent implements OnInit, OnDestroy {

  @Input() data: any;

  franklinFG: FormGroup;
  advisorId: any;
  formPlaceHolder: any;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
  };

  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    private settingService: SettingsService,
    private fb: FormBuilder
  ) {
    this.advisorId = AuthService.getAdvisorId();
    this.formPlaceHolder = AppConstants.formPlaceHolders;
  }
  subscription = new Subscription();

  ngOnInit() {
    this.createForm();
    this.formListeners();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  formListeners() {
    // this.subscription.add(
    //   this.franklinFG.controls.arnRiaDetailsId.valueChanges.subscribe(id => {
    //     const arn = this.data.arnData.find(data => data.id == id);
    //     if (arn.registeredPan && arn.renewalDate) {
    //       const loginDate = new Date(arn.renewalDate).getDate() + ('0' + new Date(arn.renewalDate).getMonth() + 1).slice(-2);
    //       this.franklinFG.controls.loginPassword.setValue(arn.registeredPan.slice(0, 4) + loginDate);
    //     }
    //   })
    // )
  }

  createForm() {
    this.franklinFG = this.fb.group({
      advisorId: [this.advisorId],
      arnRiaDetailsId: [this.data.mainData.arnRiaDetailsId || '', [Validators.required]],
      arnOrRia: [this.data.mainData.arnOrRia],
      rtTypeMasterid: [this.data.rtType],
      rtExtTypeId: [2], // dbf file extension
      loginId: [this.data.mainData.loginId || ''],
      loginPassword: [this.data.mainData.loginPassword || ''],
      mailbackPassword: [this.data.mainData.mailbackPassword || '', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      registeredEmail: [this.data.mainData.registeredEmail || '', [Validators.required, Validators.pattern(ValidatorType.EMAIL)]],
      fileOrderingUseabilityStatusId: [1]
    });
    (this.data.is_add_call) ? '' : this.franklinFG.controls.arnRiaDetailsId.disable();

  }

  save() {
    if (this.franklinFG.invalid || this.barButtonOptions.active) {
      this.franklinFG.markAllAsTouched();
    } else {
      this.barButtonOptions.active = true;
      const jsonObj = this.franklinFG.getRawValue();
      jsonObj.arnOrRia = this.data.arnData.find((data) => this.franklinFG.controls.arnRiaDetailsId.value == data.id).arnOrRia;

      // add action
      if (!this.data.mainData.arnRiaDetailsId) {
        this.settingService.addMFRTA(jsonObj).subscribe((res) => {
          this.eventService.openSnackBar("Franklin details Added successfully");
          this.Close(true);
        }, err => {
          this.eventService.openSnackBar(err, "Dismiss");
          this.barButtonOptions.active = false;
        })
      } else {
        const editJson = {
          ...this.data.mainData,
          ...jsonObj
        }
        this.settingService.editMFRTA(editJson).subscribe((res) => {
          this.eventService.openSnackBar("Franklin details Modified successfully");
          this.Close(true);
        }, err => {
          this.eventService.openSnackBar(err, "Dismiss");
          this.barButtonOptions.active = false;
        })
      }
    }
  }

  Close(status) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: status });
  }
}
