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
      emailId: [(!data) ? '' : data.email, [Validators.required]],
      mobileNo: [(!data) ? '' : data.mobileNo, [Validators.required]],
      website: [(!data) ? '' : data.website, [Validators.required]],
      address: [(!data) ? '' : data.billerAddress, [Validators.required]],
      gstTreatment:  [(!data) ? '' : data.gstTreatmentId+'', [Validators.required]],
      gstNumber: [(!data) ? '' : data.gstin, [Validators.required]],
      logoUrl:[(!data) ? '' : data.gstNumber, [Validators.required]],
      reportLogoUrl:[(!data) ? '' : data.gstNumber, [Validators.required]],
    });
  }
  getFormControl(): any {
    return this.orgProfile.controls;
  }
  updateOrgProfile(){
    let obj = {
      advisorId:this.orgProfile.controls.value,
      companyName: this.orgProfile.controls.value,
      email:this.orgProfile.controls.value ,
      website:this.orgProfile.controls.value ,
      billerAddress:this.orgProfile.controls.value ,
      city: this.orgProfile.controls.value,
      state:this.orgProfile.controls.value ,
      country: this.orgProfile.controls.value,
      zipCode:this.orgProfile.controls.value ,
      gstTreatmentId:this.orgProfile.controls.value ,
      gstin: this.orgProfile.controls.value,
      logoUrl: this.orgProfile.controls.value,
      cloudinary_json: null,
      reportLogoUrl: this.orgProfile.controls.value,
      report_cloudinary_json: null
    }
    this.orgSetting.editPersonalProfile(obj).subscribe(
      data => this.editOrgProfileRes(data),
      err => this.event.openSnackBar(err, "Dismiss")
    );
  }
  editOrgProfileRes(data){
    console.log('editOrgProfileRes',data)
  }
}
