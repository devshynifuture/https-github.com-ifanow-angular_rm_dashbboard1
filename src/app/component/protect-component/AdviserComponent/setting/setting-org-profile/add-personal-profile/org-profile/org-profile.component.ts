import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { OrgSettingServiceService } from '../../../org-setting-service.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-org-profile',
  templateUrl: './org-profile.component.html',
  styleUrls: ['./org-profile.component.scss']
})
export class OrgProfileComponent implements OnInit {
  orgProfile: any;

  constructor(public utils: UtilService, private event: EventService,
    private fb: FormBuilder, private orgSetting: OrgSettingServiceService,
    public subInjectService: SubscriptionInject,) { }

  ngOnInit() {
    this.getdataForm('')
  }
  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
  getdataForm(data) {
   
    this.orgProfile = this.fb.group({
      companyName: [(!data.fdType) ? '' : (data.companyName), [Validators.required]],
      emailId: [(!data) ? '' : data.emailId, [Validators.required]],
      mobileNo: [(!data) ? '' : data.mobileNo, [Validators.required]],
      website: [(!data) ? '' : data.website, [Validators.required]],
      address: [(!data) ? '' : data.address, [Validators.required]],
      gstTreatment:  [(!data) ? '' : data.gstTreatment, [Validators.required]],
      gstNumber: [(!data) ? '' : data.gstNumber, [Validators.required]],
    });
  }
  getFormControl(): any {
    return this.orgProfile.controls;
  }
}
