import { Component, OnInit, Input } from '@angular/core';
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
  selector: 'app-add-karvy-details',
  templateUrl: './add-karvy-details.component.html',
  styleUrls: ['./add-karvy-details.component.scss']
})
export class AddKarvyDetailsComponent implements OnInit {

  @Input() data:any;

  karvyFG:FormGroup;
  advisorId: any;
  formPlaceHolder:any;
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

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.karvyFG = this.fb.group({
      advisorId: [this.advisorId],
      arnRiaDetailsId: [this.data.mainData.arnRiaDetailsId || '', [Validators.required]],
      arnOrRia: [this.data.mainData.arnOrRia],
      rtTypeMasterid: [this.data.rtType],
      loginId: [this.data.mainData.loginId || '', [Validators.required]],
      loginPassword: [this.data.mainData.loginPassword || '', [Validators.required]],
      rtExtTypeId: [2], // dbf file extension
      mailbackPassword: [this.data.mainData.mailbackPassword || '', [Validators.required]],
      registeredEmail: [this.data.mainData.registeredEmail || '', [Validators.required, Validators.pattern(ValidatorType.EMAIL)]],
      fileOrderingUseabilityStatusId: [this.data.mainData.fileOrderingUseabilityStatusId || '', [Validators.required]],
    });
  }

  save(){
    if(this.karvyFG.invalid || this.barButtonOptions.active) {
      this.karvyFG.markAllAsTouched();
    } else {
      this.barButtonOptions.active = true;
      const jsonObj = this.karvyFG.getRawValue();
      jsonObj.arnOrRia = this.data.arnData.find((data) => this.karvyFG.controls.arnRiaDetailsId.value == data.id).arnOrRia;

      // add action
      if(!this.data.mainData.arnRiaDetailsId) {
        this.settingService.addMFRTA(jsonObj).subscribe((res)=> {
          this.eventService.openSnackBar("Karvy details Added successfully");
          this.Close(true);
        }, err=> {
          this.eventService.openSnackBar(err, "Dismiss");
          this.barButtonOptions.active = false;
        })
      } else {
        const editJson = {
          ...this.data.mainData,
          ...jsonObj
        }
        this.settingService.editMFRTA(editJson).subscribe((res)=> {
          this.eventService.openSnackBar("Karvy details Modified successfully");
          this.Close(true);
        }, err=> {
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
