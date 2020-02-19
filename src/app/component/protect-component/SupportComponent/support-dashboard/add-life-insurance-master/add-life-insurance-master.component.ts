import { EventService } from './../../../../../Data-service/event.service';
import { UtilService, ValidatorType } from './../../../../../services/util.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-life-insurance-master',
  templateUrl: './add-life-insurance-master.component.html',
  styleUrls: ['./add-life-insurance-master.component.scss']
})
export class AddLifeInsuranceMasterComponent implements OnInit {

  constructor(
    private subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private utilService: UtilService,
    private eventService: EventService
  ) { }

  validatorType = ValidatorType;

  addLifeInsuranceMasterForm = this.fb.group({
    "policyName": [, Validators.required],
    "companyName": [, Validators.required],
    "category": [, Validators.required],
  })

  addLifeInsuranceMaster() {
    if (this.utilService.formValidations(this.addLifeInsuranceMasterForm)) {
      // add api call
      this.dialogClose();
    } else {
      this.eventService.openSnackBar("Must fill required fields", "DISMISS");
    }
  }

  ngOnInit() {
  }

  dialogClose() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
