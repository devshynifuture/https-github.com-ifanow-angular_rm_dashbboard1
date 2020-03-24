import { Component, OnInit } from '@angular/core';
import { PhotoCloudinaryUploadService } from 'src/app/services/photo-cloudinary-upload.service';
import { AuthService } from 'src/app/auth-service/authService';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { SettingsService } from '../../settings.service';
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
  imgURL: string = ''
  imageUploadEvent: any = '';
  finalImage: any;
  advisorId: any;
  uploadedImageURL: any;
  uploadedImage: string;
  selected: number;
  barButtonOptions: any;

  constructor(
    private subInjectService: SubscriptionInject,
    private utilService: UtilService,
    private settingsService: SettingsService,
    private event: EventService,
    private fb: FormBuilder,
    private orgSetting: OrgSettingServiceService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  personalProfile: any;
  validatorType = ValidatorType


  ngOnInit() {
    this.getdataForm("")
  }

  getProfileImage() {
    this.settingsService.getProfilePhoto({});
  }

  uploadImageForCorping() {
    // const files = [this.imageData];
    const tags = this.advisorId + ',biller_profile_logo,';
    const file = this.utilService.convertB64toImageFile(this.finalImage);
    PhotoCloudinaryUploadService.uploadFileToCloudinary([file], 'biller_profile_logo', tags,
      (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
        if (status == 200) {
          const responseObject = JSON.parse(response);
          this.uploadedImageURL = responseObject.url;
          this.uploadedImage = JSON.stringify(responseObject);
          this.saveImage();
        }
      });

    this.imageUploadEvent = event;
  }

  saveImage() {
    this.settingsService.uploadProfilePhoto(this.uploadedImage).subscribe((res)=>{
      this.event.openSnackBar('Image uploaded sucessfully', 'Dismiss');
      this.Close(true);
    });
  }

  addEditBillerForm() {
    throw new Error("Method not implemented.");
  }

  showCroppedImage(imageAsBase64) {
    this.finalImage = imageAsBase64;
  }

  Close(flag:boolean) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  getdataForm(data) {

    this.personalProfile = this.fb.group({
      companyName: [(!data.fdType) ? '' : (data.companyName), [Validators.required]],
      emailId: [(!data) ? '' : data.emailId, [Validators.required]],
      mobileNo: [(!data) ? '' : data.mobileNo, [Validators.required]],
      website: [(!data) ? '' : data.website, [Validators.required]],
      address: [(!data) ? '' : data.address, [Validators.required]],
      gstTreatment: [(!data) ? '' : data.gstTreatment, [Validators.required]],
      gstNumber: [(!data) ? '' : data.gstNumber, [Validators.required]],
    });
  }
  getFormControl(): any {
    return this.personalProfile.controls;
  }
  updatePersonalProfile() {
    let obj = {}
    this.orgSetting.editPersonalProfile(obj).subscribe(
      data => this.editPersonalProfileRes(data),
      err => this.event.openSnackBar(err, "Dismiss")
    );
  }
  editPersonalProfileRes(data) {
    console.log('editPersonalProfileRes', data)
  }
}
