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
  selector: 'app-add-cams-details',
  templateUrl: './add-cams-details.component.html',
  styleUrls: ['./add-cams-details.component.scss']
})
export class AddCamsDetailsComponent implements OnInit {

  @Input() data:any;
  advisorId: any;

  camsFG:FormGroup;
  formPlaceHolders:any;
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
    this.formPlaceHolders = AppConstants.formPlaceHolders;
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.camsFG = this.fb.group({
      advisorId: [this.advisorId],
      rtTypeMasterid: [this.data.rtType],
      arnOrRia: [this.data.mainData.arnOrRia],
      rtExtTypeId: [2], // dbf file extension
      arnRiaDetailsId: [this.data.mainData.arnRiaDetailsId || '', [Validators.required]],
      registeredEmail: [this.data.mainData.registeredEmail || '', [Validators.required, Validators.pattern(ValidatorType.EMAIL)]],
      mailbackPassword: [this.data.mainData.mailbackPassword || '', [Validators.required]],
      fileOrderingUseabilityStatusId: [1]
    });
  }

  save(){
    if(this.camsFG.invalid || this.barButtonOptions.active) {
      this.camsFG.markAllAsTouched();
    } else {
      this.barButtonOptions.active = true;
      let jsonObj:any = {
        ...this.data.mainData,
        ...this.camsFG.getRawValue()
      };

      jsonObj.arnOrRia = this.data.arnData.find((data) => this.camsFG.controls.arnRiaDetailsId.value == data.id).arnOrRia;
      // add action
      if(this.data.mainData.arnRiaDetailsId) {
        const editJson = {
          ...this.data.mainData,
          ...jsonObj
        }
        this.settingService.editMFRTA(editJson).subscribe((res)=> {
          this.eventService.openSnackBar("CAMS Modified successfully");
          this.Close(true);
        }, err=> {
          this.eventService.openSnackBar(err, "Dismiss");
          this.barButtonOptions.active = false;
        })
      } else {
        this.settingService.addMFRTA(jsonObj).subscribe((res)=> {
          this.eventService.openSnackBar("CAMS Added successfully");
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
