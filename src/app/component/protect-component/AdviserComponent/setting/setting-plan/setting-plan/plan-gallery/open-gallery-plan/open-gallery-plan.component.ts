import { Component, OnInit, Inject } from '@angular/core';
import { PhotoCloudinaryUploadService } from 'src/app/services/photo-cloudinary-upload.service';
import { ParsedResponseHeaders, FileItem } from 'ng2-file-upload';
import { SettingsService } from '../../../../settings.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { OrgSettingServiceService } from '../../../../org-setting-service.service';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/component/protect-component/AdviserComponent/Activities/calendar/calendar.component';

@Component({
  selector: 'app-open-gallery-plan',
  templateUrl: './open-gallery-plan.component.html',
  styleUrls: ['./open-gallery-plan.component.scss']
})
export class OpenGalleryPlanComponent implements OnInit {


  imgURL: string = ''
  finalImage: any;
  advisorId: any;
  imageUploadEvent: any;
  showCropper: boolean = false;
  cropImage: boolean = false;
  selectedTab: number = 0;
  showSpinner = false;
  anyDetailsChanged: boolean; // check if any details have been updated
  inputData: any;
  sendToCopy: any;
  individualGoal: boolean;
  goalIndividualData: any;
  constructor(public dialogRef: MatDialogRef<OpenGalleryPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public dataGet: DialogData, private settingsService: SettingsService, private event: EventService,
    private subInjectService: SubscriptionInject, private orgSetting: OrgSettingServiceService,
    private utilService: UtilService, ) {
    this.advisorId = AuthService.getAdvisorId()
    this.sendToCopy = this.dataGet.bank
    this.goalIndividualData = this.dataGet.animal
  }

  ngOnInit() {
    //this.getdataForm('')
    this.getPersonalInfo();
  }

  getPersonalInfo() {
    this.settingsService.getProfileDetails({ id: this.advisorId }).subscribe((res) => {
      this.imgURL = (this.sendToCopy.imageUrl) ? this.sendToCopy.imageUrl : this.sendToCopy;
      if (!this.sendToCopy.imageUrl || this.dataGet.bank) {
        this.individualGoal = true
      }
    });
  }

  uploadImageForCorping(event) {
    this.imageUploadEvent = event;
    this.showCropper = true;
  }
  onNoClick() {
    if (this.showCropper) {
      this.showSpinner = true
      const tags = this.advisorId + ',advisor_profile_logo,';
      const file = this.utilService.convertB64toImageFile(this.finalImage);
      PhotoCloudinaryUploadService.uploadFileToCloudinary([file], 'advisor_profile_logo', tags,
        (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
          if (status == 200) {
            this.showSpinner = true
            const responseObject = JSON.parse(response);
            const jsonDataObj = {
              advisorId: this.advisorId,
              goalName: this.sendToCopy.name,
              imageURL: responseObject.secure_url,
              goalTypeId: this.sendToCopy.goalTypeId,
            }
            if (this.individualGoal == true) {
              let obj = {
                goalType: this.goalIndividualData.goalType,
                id: this.goalIndividualData.goalId,
                imageUrl: responseObject.secure_url,
              }
              this.orgSetting.uploadIndividualGoal(obj).subscribe((res) => {
                this.anyDetailsChanged = true;
                this.imgURL = jsonDataObj.imageURL;
                this.showSpinner = false
                this.event.openSnackBar('Image uploaded sucessfully', 'Dismiss');
                this.Close(this.anyDetailsChanged);
              });
            } else {
              this.orgSetting.uploadPlanPhoto(jsonDataObj).subscribe((res) => {
                this.anyDetailsChanged = true;
                this.imgURL = jsonDataObj.imageURL;
                this.showSpinner = false
                this.event.openSnackBar('Image uploaded sucessfully', 'Dismiss');
                this.Close(this.anyDetailsChanged);
              });
            }

          }
        });
    } else {
      this.Close(this.anyDetailsChanged);
    }
  }
  Close(flag: boolean) {
    // this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
    this.dialogRef.close(flag);
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
      // this.saveImage();
    } else {

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

}





