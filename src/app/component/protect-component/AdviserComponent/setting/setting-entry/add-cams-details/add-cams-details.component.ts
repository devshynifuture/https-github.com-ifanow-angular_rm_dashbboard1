import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SettingsService } from '../../settings.service';
import { ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-cams-details',
  templateUrl: './add-cams-details.component.html',
  styleUrls: ['./add-cams-details.component.scss']
})
export class AddCamsDetailsComponent implements OnInit {

  @Input() data:any;

  camsFG:FormGroup;

  constructor(
    private subInjectService: SubscriptionInject, 
    private eventService: EventService,
    private settingService: SettingsService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.camsFG = this.fb.group({
      number: [this.data.number, [Validators.required, Validators.pattern(ValidatorType.NUMBER_ONLY)]],
      email: [this.data.email, [Validators.required, Validators.email]],
      password: [this.data.type, [Validators.required]],
    });
  }

  save(){
    if(this.camsFG.invalid) {
      this.camsFG.markAllAsTouched();
    } else {
      const jsonObj = this.camsFG.getRawValue();

      // add action
      if(this.data.pan) {
        this.settingService.addMFRTA(jsonObj).subscribe((res)=> {
          this.eventService.openSnackBar("CAMS Added successfully");
          this.Close(true);
        })
      } else {
        this.settingService.editMFRTA(jsonObj).subscribe((res)=> {
          this.eventService.openSnackBar("CAMS Modified successfully");
          this.Close(true);
        })
      }
    }
  }

  Close(status) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: status });
  }
}
