import { Component, OnInit, Input } from '@angular/core';
import { PhotoCloudinaryUploadService } from 'src/app/services/photo-cloudinary-upload.service';
import { AuthService } from 'src/app/auth-service/authService';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { SettingsService } from '../../settings.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
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

  personalProfile: FormGroup;
  validatorType = ValidatorType
  @Input()
  set data(data) {
    this.inputData = data;

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
      name: [(!data) ? '' : (data.fullName), [Validators.required, Validators.maxLength(40)]],
      emailId: [(!data) ? '' : data.emailId, [Validators.required, Validators.pattern(ValidatorType.EMAIL)]],
      isdCode: [(!data) ? '' : data.isdCode, [Validators.required]],
      mobileNo: [(!data) ? '' : data.mobileNo, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(ValidatorType.NUMBER_ONLY)]],
      userName: [(!data) ? '' : data.userName, [Validators.required]],
    });
  }

  getFormControl(): any {
    return this.personalProfile.controls;
  }
  
  updatePersonalProfile() {
    if(this.personalProfile.invalid) {
      this.personalProfile.markAllAsTouched();
      return;
    }
    let obj = {
      adminAdvisorId: this.advisorId,
      fullName: this.personalProfile.controls.name.value,
      emailId: this.personalProfile.controls.emailId.value,
      // userName: this.personalProfile.controls.userName.value,
      mobileNo: this.personalProfile.controls.mobileNo.value,
      // roleId: 0,
    }
    this.settingsService.editPersonalProfile(obj).subscribe(
      data => {
        this.selectedTab = 2; // switch tab to profile pic
        this.anyDetailsChanged = true;
      },
      err => this.event.openSnackBar(err, "Dismiss")
    );
  }

  Close(flag: boolean) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}
