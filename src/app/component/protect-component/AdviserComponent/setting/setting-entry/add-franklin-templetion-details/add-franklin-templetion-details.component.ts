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
  selector: 'app-add-franklin-templetion-details',
  templateUrl: './add-franklin-templetion-details.component.html',
  styleUrls: ['./add-franklin-templetion-details.component.scss']
})
export class AddFranklinTempletionDetailsComponent implements OnInit {

  @Input() data:any;

  franklinFG:FormGroup;
  advisorId:any;
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
    this.franklinFG = this.fb.group({
      advisorId: [this.advisorId],
      arnRiaDetailsId: [this.data.mainData.arnRiaDetailsId || '', [Validators.required]],
      arnOrRia: [this.data.mainData.arnOrRia],
      rtTypeMasterid: [this.data.rtType],
      rtExtTypeId: [2], // dbf file extension
      loginId: [this.data.mainData.loginId || '', [Validators.required]],
      loginPassword: [this.data.mainData.loginPassword || '', [Validators.required]],
      mailbackPassword: [this.data.mainData.mailbackPassword || '', [Validators.required]],
      registeredEmail: [this.data.mainData.registeredEmail || '', [Validators.required, Validators.pattern(ValidatorType.EMAIL)]],
    });
  }

  save(){
    if(this.franklinFG.invalid || this.barButtonOptions.active) {
      this.franklinFG.markAllAsTouched();
    } else {
      this.barButtonOptions.active = true;
      const jsonObj = this.franklinFG.getRawValue();
      jsonObj.arnOrRia = this.data.arnData.find((data) => this.franklinFG.controls.arnRiaDetailsId.value == data.id).arnOrRia;

      // add action
      if(!this.data.mainData.arnRiaDetailsId) {
        this.settingService.addMFRTA(jsonObj).subscribe((res)=> {
          this.eventService.openSnackBar("Franklin details Added successfully");
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
          this.eventService.openSnackBar("Franklin details Modified successfully");
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
