import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SettingsService } from '../../settings.service';
import { ValidatorType } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-add-karvy-details',
  templateUrl: './add-karvy-details.component.html',
  styleUrls: ['./add-karvy-details.component.scss']
})
export class AddKarvyDetailsComponent implements OnInit {

  @Input() data:any;

  karvyFG:FormGroup;
  advisorId: any;

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
    this.karvyFG = this.fb.group({
      advisorId: [this.advisorId],
      arnRiaDetailsId: [this.data.mainData.arnRiaDetailsId, [Validators.required]],
      rtTypeMasterid: [this.data.rtType],
      loginId: [this.data.number, [Validators.required]],
      loginPassword: [this.data.type, [Validators.required]],
      rtExtTypeId: [2], // dbf file extension
      mailbackPassword: [this.data.type, [Validators.required]],
      registeredEmail: [this.data.email, [Validators.required, Validators.email]],
      file_ordering: [this.data.type, [Validators.required]],
    });
  }

  save(){
    if(this.karvyFG.invalid) {
      this.karvyFG.markAllAsTouched();
    } else {
      const jsonObj = this.karvyFG.getRawValue();

      // add action
      if(!this.data.mainData.arnRiaDetailsId) {
        this.settingService.addMFRTA(jsonObj).subscribe((res)=> {
          this.eventService.openSnackBar("Karvy details Added successfully");
          this.Close(true);
        }, (err) => this.eventService.openSnackBar("Some error occured. Please try again."))
      } else {
        const editJson = {
          ...this.data.mainData,
          ...jsonObj
        }
        this.settingService.editMFRTA(editJson).subscribe((res)=> {
          this.eventService.openSnackBar("Karvy details Modified successfully");
          this.Close(true);
        }, (err) => this.eventService.openSnackBar("Some error occured. Please try again."))
      }
    }
  }

  Close(status) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: status });
  }
}
