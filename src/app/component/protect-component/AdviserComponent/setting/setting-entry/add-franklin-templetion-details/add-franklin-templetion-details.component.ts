import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SettingsService } from '../../settings.service';
import { ValidatorType } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-add-franklin-templetion-details',
  templateUrl: './add-franklin-templetion-details.component.html',
  styleUrls: ['./add-franklin-templetion-details.component.scss']
})
export class AddFranklinTempletionDetailsComponent implements OnInit {

  @Input() data:any;

  franklinFG:FormGroup;
  advisorId:any;

  constructor(
    private subInjectService: SubscriptionInject, 
    private eventService: EventService,
    private settingService: SettingsService,
    private fb: FormBuilder
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.franklinFG = this.fb.group({
      advisorId: [this.advisorId],
      arnRiaDetailsId: [this.data.mainData.arnRiaDetailsId, [Validators.required]],
      arnOrRia: [this.data.mainData.arnOrRia],
      rtTypeMasterid: [this.data.rtType],
      rtExtTypeId: [2], // dbf file extension
      login_id: [this.data.number, [Validators.required]],
      password: [this.data.type, [Validators.required]],
      mail_password: [this.data.type, [Validators.required]],
      email: [this.data.email, [Validators.required, Validators.email]],
    });
  }

  save(){
    if(this.franklinFG.invalid) {
      this.franklinFG.markAllAsTouched();
    } else {
      const jsonObj = this.franklinFG.getRawValue();
      jsonObj.arnOrRia = this.data.arnData.find((data) => this.franklinFG.controls.arnRiaDetailsId.value == data.id).arnOrRia;

      // add action
      if(this.data.pan) {
        this.settingService.addMFRTA(jsonObj).subscribe((res)=> {
          this.eventService.openSnackBar("Karvy details Added successfully");
          this.Close(true);
        })
      } else {
        this.settingService.editMFRTA(jsonObj).subscribe((res)=> {
          this.eventService.openSnackBar("Karvy details Modified successfully");
          this.Close(true);
        })
      }
    }
  }

  Close(status) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: status });
  }
}
