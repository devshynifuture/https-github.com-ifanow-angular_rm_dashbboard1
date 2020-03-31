import { Component, OnInit, Input } from '@angular/core';
import { PhotoCloudinaryUploadService } from 'src/app/services/photo-cloudinary-upload.service';
import { AuthService } from 'src/app/auth-service/authService';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { SettingsService } from '../../settings.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-personal-profile',
  templateUrl: './add-personal-profile.component.html',
  styleUrls: ['./add-personal-profile.component.scss']
})
export class AddPersonalProfileComponent implements OnInit {
  imgURL: string = ''
  finalImage: any;
  advisorId: any;
  imageUploadEvent: any;
  showCropper: boolean = false;
  cropImage: boolean = false;
  selectedTab: number = 0;
  anyDetailsChanged: boolean; // check if any details have been updated
  inputData: any;
  isLoading = false

  constructor(
    private subInjectService: SubscriptionInject,
    private utilService: UtilService,
    private settingsService: SettingsService,
    private event: EventService,
    private fb: FormBuilder,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  personalProfile: any;
  validatorType = ValidatorType
  @Input()
  set data(data) {
    this.inputData = data;

    console.log('This is Input data', data);
    this.getdataForm(data);
  }
  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.getdataForm(this.inputData)
    this.getPersonalInfo();
  }

  getPersonalInfo() {
    this.settingsService.getProfileDetails({ id: this.advisorId }).subscribe((res) => {
      this.imgURL = res.profilePic;
    });
  }

  uploadImageForCorping(event) {
    this.imageUploadEvent = event;
    this.showCropper = true;
  }

  saveImage() {
    if (this.showCropper) {
      const tags = this.advisorId + ',advisor_profile_logo,';
      const file = this.utilService.convertB64toImageFile(this.finalImage);
      PhotoCloudinaryUploadService.uploadFileToCloudinary([file], 'advisor_profile_logo', tags,
        (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
          if (status == 200) {
            const responseObject = JSON.parse(response);
            const jsonDataObj = {
              id: this.advisorId,
              profilePic: responseObject.url
            }
            this.settingsService.uploadProfilePhoto(jsonDataObj).subscribe((res) => {
              this.anyDetailsChanged = true;
              this.imgURL = jsonDataObj.profilePic;
              this.event.openSnackBar('Image uploaded sucessfully', 'Dismiss');
              this.Close(this.anyDetailsChanged);
            });
          }
        });
    } else {
      this.Close(this.anyDetailsChanged);
    }
  }

  addEditBillerForm() {
    throw new Error("Method not implemented.");
  }

  showCroppedImage(imageAsBase64) {
    this.finalImage = imageAsBase64;
  }

  // save the changes of current page only
  saveCurrentPage() {
    // selected tab 1 - profile image
    // 2 - profile details
    if (this.selectedTab == 1) {
      this.saveImage();
    } else {
      this.updatePersonalProfile();
    }
  }

  // reset the variables when user changes tabs
  // make sure to reset to latest updates
  resetPageVariables() {
    this.showCropper = false;
    this.cropImage = false;
    this.imageUploadEvent = '';
    this.finalImage = '';
  }
  getdataForm(data) {
    this.personalProfile = this.fb.group({
      name: [(!data.fdType) ? '' : (data.fullName), [Validators.required]],
      emailId: [(!data) ? '' : data.emailId, [Validators.required]],
      mobileNo: [(!data) ? '' : data.mobileNo, [Validators.required]],
      userName: [(!data) ? '' : data.userName, [Validators.required]],
    });
  }

  getFormControl(): any {
    return this.personalProfile.controls;
  }
  
  updatePersonalProfile() {
    let obj = {
      adminAdvisorId: this.advisorId,
      fullName: this.personalProfile.controls.name.value,
      emailId: this.personalProfile.controls.emailId.value,
      userName: this.personalProfile.controls.userName.value,
      mobileNo: this.personalProfile.controls.mobileNo.value,
      roleId: 0,
    }
    this.settingsService.editPersonalProfile(obj).subscribe(
      data => {
        this.editPersonalProfileRes(data)
        this.anyDetailsChanged = true;
      },
      err => this.event.openSnackBar(err, "Dismiss")
    );
  }

  editPersonalProfileRes(data) {
    console.log('editPersonalProfileRes', data)
    this.selectedTab = 2

  }

  Close(flag: boolean) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}
