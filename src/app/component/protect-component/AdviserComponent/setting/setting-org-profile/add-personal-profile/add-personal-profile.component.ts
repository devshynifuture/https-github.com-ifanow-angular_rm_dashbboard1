import { Component, OnInit } from '@angular/core';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { OrgSettingServiceService } from '../../org-setting-service.service';

@Component({
  selector: 'app-add-personal-profile',
  templateUrl: './add-personal-profile.component.html',
  styleUrls: ['./add-personal-profile.component.scss']
})
export class AddPersonalProfileComponent implements OnInit {
  personalProfile: any;
  validatorType = ValidatorType


  constructor(public utils: UtilService, private event: EventService,
    private fb: FormBuilder, private orgSetting: OrgSettingServiceService,
    public subInjectService: SubscriptionInject,) { }

  ngOnInit() {
    this.getdataForm("")
  }
  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
  getdataForm(data) {
   
    this.personalProfile = this.fb.group({
     
   
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
    return this.personalProfile.controls;
  }
updatePersonalProfile(){
  let obj = {}
  this.orgSetting.editPersonalProfile(obj).subscribe(
    data => this.editPersonalProfileRes(data),
    err => this.event.openSnackBar(err, "Dismiss")
  );
}
editPersonalProfileRes(data){
console.log('editPersonalProfileRes',data)
}
}
