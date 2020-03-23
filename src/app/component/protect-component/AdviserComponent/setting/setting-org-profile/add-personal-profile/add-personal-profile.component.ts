import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { PhotoCloudinaryUploadService } from 'src/app/services/photo-cloudinary-upload.service';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { SettingsService } from '../../settings.service';

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
  eventService: any;
  selected: number;
  barButtonOptions: any;

  constructor(
    private subInjectService: SubscriptionInject,
    private utilService: UtilService,
    private settingsService: SettingsService
  ) { 
    this.advisorId = AuthService.getAdvisorId();
  }


  ngOnInit() {
  }

  getProfileImage(){
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
        // this.eventService.openSnackBar('Image uploaded sucessfully', 'Dismiss');
        this.saveImage();
      }

    });

    this.imageUploadEvent = event;
  }

  saveImage(){
    this.settingsService.uploadProfilePhoto(this.uploadedImage);
  }

  addEditBillerForm() {
    throw new Error("Method not implemented.");
  }

  showCroppedImage(imageAsBase64) {
    this.finalImage = imageAsBase64;
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close', refreshRequired: false});
  }
}
