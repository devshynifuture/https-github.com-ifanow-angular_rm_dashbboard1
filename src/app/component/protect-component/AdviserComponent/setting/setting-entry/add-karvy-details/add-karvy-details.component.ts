import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SettingsService } from '../../settings.service';
import { ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-karvy-details',
  templateUrl: './add-karvy-details.component.html',
  styleUrls: ['./add-karvy-details.component.scss']
})
export class AddKarvyDetailsComponent implements OnInit {

  @Input() data:any;

  karvyFG:FormGroup;

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
    this.karvyFG = this.fb.group({
      number: [this.data.number, [Validators.required, Validators.pattern(ValidatorType.NUMBER_ONLY)]],
      login_id: [this.data.number, [Validators.required]],
      password: [this.data.type, [Validators.required]],
      mail_password: [this.data.type, [Validators.required]],
      email: [this.data.email, [Validators.required, Validators.email]],
      file_ordering: [this.data.type, [Validators.required]],
    });
  }

  save(){
    if(this.karvyFG.invalid) {
      this.karvyFG.markAllAsTouched();
    } else {
      const jsonObj = this.karvyFG.getRawValue();

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
