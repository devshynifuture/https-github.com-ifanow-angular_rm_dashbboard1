import { Component, OnInit, Input } from '@angular/core';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { PhotoCloudinaryUploadService } from 'src/app/services/photo-cloudinary-upload.service';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { SettingsService } from '../../../settings.service';
import { AuthService } from 'src/app/auth-service/authService';
import { PostalService } from 'src/app/services/postal.service';
import { Subscription } from 'rxjs';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';

@Component({
  selector: 'app-org-profile',
  templateUrl: './org-profile.component.html',
  styleUrls: ['./org-profile.component.scss']
})
export class OrgProfileComponent implements OnInit {
  orgProfile: FormGroup;
  advisorId: any;

  profileImg: string = ''
  reportImg: string = ''
  finalImage: any;
  imageUploadEvent: any;
  showCropper: boolean = false;
  cropImage: boolean = false;
  selectedTab:number = 0;

  anyDetailsChanged:boolean;
  inputData: any;
  pinInvalid: boolean;
  validatorType = ValidatorType
  subscription = new Subscription();
  isdCodes: Array<any> = [];

  constructor(
    public utils: UtilService, 
    private event: EventService,
    private fb: FormBuilder, 
    public subInjectService: SubscriptionInject,
    private settingsService: SettingsService,
    private postalService: PostalService,
    private peopleService: PeopleService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }
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
    this.getIsdCodesData();
    this.getOrgProfiles();
    this.getdataForm(this.inputData);
  }

  getIsdCodesData() {
    this.peopleService.getIsdCode({}).subscribe(
      data => {
        if (data) {
          console.log(data);
          this.isdCodes = data;
        }
      }
    )
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  getPostalPin(value) {
    if (value != "") {
      this.postalService.getPostalPin(value).subscribe(data => {
        console.log('postal 121221', data)
        this.PinData(data)
      })
    }
    else {
      this.pinInvalid = false;
      this.getFormControl().pincode.setErrors(this.pinInvalid);
    }
  }

  PinData(data) {
    if (data[0].Status == "Error") {
      this.pinInvalid = true;
      this.getFormControl().pincode.setErrors(this.pinInvalid);
      this.getFormControl().city.setValue("");
      this.getFormControl().state.setValue("");
    }
    else {
      this.getFormControl().city.setValue(data[0].PostOffice[0].District);
      this.getFormControl().state.setValue(data[0].PostOffice[0].State);
      this.pinInvalid = false;
    }
  }


  getOrgProfiles() {
    let obj = {
      advisorId:this.advisorId
    }
    this.settingsService.getOrgProfile(obj).subscribe(
      data => {
        this.profileImg = data.logoUrl;
        this.reportImg = data.reportLogoUrl;
      },
      err => this.event.openSnackBar(err, "Dismiss")
    );
  }

  getdataForm(data) {
    this.orgProfile = this.fb.group({
      companyName: [(!data) ? '' : (data.companyName), [Validators.required, Validators.maxLength(50)]],
      emailId: [(!data) ? '' : data.email, [Validators.required, Validators.pattern(ValidatorType.EMAIL)]],
      isdCodeId: [(!data) ? '' : data.isdCodeId, [Validators.required]],
      mobileNo: [(!data) ? '' : data.mobileNumber, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(ValidatorType.NUMBER_ONLY)]],
      website: [(!data) ? '' : data.website, [Validators.required]],
      address: [(!data) ? '' : data.billerAddress, [Validators.required]],
      gstTreatment:  ['', [Validators.required]],
      gstNumber: [(!data) ? '' : data.gstin],
      city: [(!data) ? '' :data.city, [Validators.required, Validators.pattern(ValidatorType.TEXT_ONLY)]],
      state: [(!data) ? '' :data.state, [Validators.required, Validators.pattern(ValidatorType.TEXT_ONLY)]],
      pincode: [(!data) ? '' :data.zipCode, [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(ValidatorType.NUMBER_ONLY)]],
    });

    this.subscribeToGSTTypeValueChange();
    this.orgProfile.controls.gstTreatment.setValue((!data) ? '' : data.gstTreatmentId);
  }

  subscribeToGSTTypeValueChange() {
    this.subscription.add(
      this.orgProfile.controls.gstTreatment.valueChanges.subscribe(value => {
        // for some weird reason validation is not happening the first time hence kept it twice
        this.doSomething(value);
        this.doSomething(value);
      })
    )
  }

  doSomething(value){
    if(value == 4) {
      this.orgProfile.get('gstNumber').setValidators([Validators.required, Validators.maxLength(15), Validators.minLength(15)]);
    } else {
      this.orgProfile.get('gstNumber').setValue('');
      this.orgProfile.get('gstNumber').clearValidators();
    }
    this.orgProfile.updateValueAndValidity();

  }

  getFormControl(): any {
    return this.orgProfile.controls;
  }

  updateOrgProfile(){
    if(this.orgProfile.invalid) {
      this.orgProfile.markAllAsTouched();
      return;
    }
    let obj = {
      advisorId:this.advisorId,
      companyName: this.orgProfile.controls.companyName.value || '',
      email:this.orgProfile.controls.emailId.value || '',
      mobileNumber: this.orgProfile.controls.mobileNo.value || '',
      website:this.orgProfile.controls.website.value || '',
      billerAddress:this.orgProfile.controls.address.value || '',
      city: this.orgProfile.controls.city.value || '',
      state:this.orgProfile.controls.state.value || '',
      zipCode:this.orgProfile.controls.pincode.value || '',
      gstTreatmentId:this.orgProfile.controls.gstTreatment.value || '',
      gstin: this.orgProfile.controls.gstNumber.value || '',
    }
    this.settingsService.editOrgProfile(obj).subscribe(
      data => {
        this.anyDetailsChanged = true;
        this.switchToTab(++this.selectedTab);
      },
      err => this.event.openSnackBar(err, "Dismiss")
    );
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
            let responseObject = JSON.parse(response);
            responseObject['advisorId'] = responseObject.id;
            delete responseObject.id;
            if(tag_folder == 'organizational_profile_logo') {
              this.updateOrganizationPhotoAndMoveToNextPage(responseObject, 'web');
            } else if (tag_folder == 'organizational_report_logo') {
              this.updateOrganizationPhotoAndMoveToNextPage(responseObject, 'report');
            }
          } else {
            this.event.openSnackBar("Error occured");
          }
        });
    } else {
      this.switchToTab(++this.selectedTab);
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
        advisorId: this.advisorId,
        logoUrl: cloudinaryResponseJson.url,
        cloudinary_json: JSON.stringify(cloudinaryResponseJson)
      }
      this.settingsService.editOrgProfileLogo(jsonDataObj).subscribe((res) => {
        this.event.openSnackBar('Image uploaded sucessfully', 'Dismiss');
        this.anyDetailsChanged = true;
        this.profileImg = jsonDataObj.logoUrl;
        this.switchToTab(++this.selectedTab);
      });
    } else {
        const jsonDataObj = {
          advisorId: this.advisorId,
          reportLogoUrl: cloudinaryResponseJson.url,
          report_cloudinary_json: JSON.stringify(cloudinaryResponseJson)
        }
        this.settingsService.editOrgProfileReportLogo(jsonDataObj).subscribe((res) => {
          this.event.openSnackBar('Image uploaded sucessfully', 'Dismiss');
          this.reportImg = jsonDataObj.reportLogoUrl;
          this.switchToTab(++this.selectedTab);
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
        this.updateOrgProfile();
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
