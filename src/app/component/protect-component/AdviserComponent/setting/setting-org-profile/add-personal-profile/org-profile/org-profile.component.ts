import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { OrgSettingServiceService } from '../../../org-setting-service.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { PhotoCloudinaryUploadService } from 'src/app/services/photo-cloudinary-upload.service';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { SettingsService } from '../../../settings.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-org-profile',
  templateUrl: './org-profile.component.html',
  styleUrls: ['./org-profile.component.scss']
})
export class OrgProfileComponent implements OnInit {
  orgProfile: any;
  advisorId: any;

  profileImg: string = ''
  reportImg: string = ''
  finalImage: any;
  imageUploadEvent: any;
  showCropper: boolean = false;
  cropImage: boolean = false;
  selectedTab:number = 0;

  anyDetailsChanged:boolean;

  constructor(
    public utils: UtilService, 
    private event: EventService,
    private fb: FormBuilder, 
    private orgSetting: OrgSettingServiceService,
    public subInjectService: SubscriptionInject,
    private settingsService: SettingsService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.getdataForm('');
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
      advisorId:this.advisorId,
      companyName: this.orgProfile.controls.companyName.value,
      email:this.orgProfile.controls.emailId.value ,
      website:this.orgProfile.controls.website.value ,
      billerAddress:this.orgProfile.controls.address.value ,
      // city: this.orgProfile.controls.value,
      // state:this.orgProfile.controls.value ,
      // country: this.orgProfile.controls.value,
      // zipCode:this.orgProfile.controls.value ,
      gstTreatmentId:this.orgProfile.controls.gstTreatment.value ,
      gstin: this.orgProfile.controls.gstNumber.value,
      logoUrl: null,
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


  // method for org & report logo
  uploadImageForCorping(event) {
    this.imageUploadEvent = event;
    this.showCropper = true;
  }

  saveImageInCloud(tag_folder) {
    if (this.showCropper) {
      const tags = this.advisorId + ',' + tag_folder + ',';
      const file = this.utils.convertB64toImageFile(this.finalImage);
      PhotoCloudinaryUploadService.uploadFileToCloudinary([file], tag_folder, tags,
        (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
          if (status == 200) {
            const responseObject = JSON.parse(response);
            if(tag_folder == 'organizational_profile_logo') {
              this.updateOrganizationPhotoAndMoveToNextPage(responseObject, 'web');
            } else if (tag_folder == 'organizational_report_logo') {
              this.updateOrganizationPhotoAndMoveToNextPage(responseObject, 'report');
            }
          }
        });
    } else {

    }
  }

  switchToTab(nextIndex) {
    if(nextIndex > 2) {
      this.Close(this.anyDetailsChanged);
    } else {
      this.selectedTab = nextIndex;
    }
  }

  updateOrganizationPhotoAndMoveToNextPage(cloudinaryResponseJson:any, web_or_report: string) {
    if(web_or_report == 'web') {
      const jsonDataObj = {
        id: this.advisorId,
        profilePic: cloudinaryResponseJson.url
      }
      this.settingsService.uploadProfilePhoto(jsonDataObj).subscribe((res) => {
        this.event.openSnackBar('Image uploaded sucessfully', 'Dismiss');
        this.anyDetailsChanged = true;
        this.profileImg = jsonDataObj.profilePic;
      });
    } else {
        const jsonDataObj = {
          id: this.advisorId,
          profilePic: cloudinaryResponseJson.url
        }
        this.settingsService.uploadProfilePhoto(jsonDataObj).subscribe((res) => {
          this.event.openSnackBar('Image uploaded sucessfully', 'Dismiss');
          this.reportImg = jsonDataObj.profilePic;
          this.Close(true); // close the sidebar since it's the last tab
        });
    }
  }

  showCroppedImage(imageAsBase64) {
    this.finalImage = imageAsBase64;
  }

  // save the changes of current page only
  saveCurrentPage(){
    switch (this.selectedTab) {
      case 0: // Organizational profile details
        
        break;
      case 1: // Organizational profile logo
        this.saveImageInCloud('organizational_profile_logo');
        break;
      case 2: // Organizational report logo
        this.saveImageInCloud('organizational_report_logo');
        break;
      default:
        break;
    }
  }

  // reset the variables when user changes tabs
  resetPageVariables(){
    this.showCropper = false;
    this.cropImage = false;
    this.imageUploadEvent = '';
    this.finalImage = '';
  }

}
