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
     
   
      name: [(!data.fdType) ? '' : (data.name), [Validators.required]],
      emailId: [(!data) ? '' : data.email, [Validators.required]],
      mobileNo: [(!data) ? '' : data.mobileNo, [Validators.required]],
      userName: [(!data) ? '' : data.userName, [Validators.required]],
    });
  }
  getFormControl(): any {
    return this.personalProfile.controls;
  }
updatePersonalProfile(){
  let obj = {
    name: this.personalProfile.controls.name.value,
      email:this.personalProfile.controls.emailId.value ,
      userName:this.personalProfile.controls.userName.value ,
      mobileNo:this.personalProfile.controls.mobileNo.value ,
  }
  this.orgSetting.editPersonalProfile(obj).subscribe(
    data => this.editPersonalProfileRes(data),
    err => this.event.openSnackBar(err, "Dismiss")
  );
}
editPersonalProfileRes(data){
console.log('editPersonalProfileRes',data)
}
}
