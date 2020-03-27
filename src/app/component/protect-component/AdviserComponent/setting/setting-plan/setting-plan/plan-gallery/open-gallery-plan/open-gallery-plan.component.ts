import { Component, OnInit } from '@angular/core';
import { PhotoCloudinaryUploadService } from 'src/app/services/photo-cloudinary-upload.service';
import { ParsedResponseHeaders, FileItem } from 'ng2-file-upload';
import { SettingsService } from '../../../../settings.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

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
  selectedTab:number = 0;
  anyDetailsChanged:boolean; // check if any details have been updated
  inputData: any;
  utilService: any;
  constructor(  private settingsService: SettingsService,private event : EventService,private subInjectService : SubscriptionInject) { }

  ngOnInit() {
   //this.getdataForm('')
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
              advisorId: this.advisorId,
              name:'Retirement',
              imgUrl: responseObject.url,
              id:1
            }
            this.settingsService.uploadProfilePhoto(jsonDataObj).subscribe((res) => {
              this.anyDetailsChanged = true;
              this.imgURL = jsonDataObj.imgUrl;
              this.event.openSnackBar('Image uploaded sucessfully', 'Dismiss');
              this.Close(this.anyDetailsChanged);
            });
          }
        });
    } else {
      this.Close(this.anyDetailsChanged);
    }
  }
  Close(flag: boolean) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
  addEditBillerForm() {
    throw new Error("Method not implemented.");
  }
  showCroppedImage(imageAsBase64) {
    this.finalImage = imageAsBase64;
  }

  // save the changes of current page only
  saveCurrentPage(){
    // selected tab 1 - profile image
    // 2 - profile details
    if (this.selectedTab == 1) {
      this.saveImage();
    } else {
      
    }
  }

  // reset the variables when user changes tabs
  // make sure to reset to latest updates
  resetPageVariables(){
    this.showCropper = false;
    this.cropImage = false;
    this.imageUploadEvent = '';
    this.finalImage = '';
  }

  onNoClick(): void {
    //this.dialogRef.close(this.emailVierify.controls.emailId.value);
  }
}





