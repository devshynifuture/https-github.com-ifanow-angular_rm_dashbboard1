import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService, ValidatorType, LoaderFunction } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AppConstants } from 'src/app/services/app-constants';
import { PhotoCloudinaryUploadService } from 'src/app/services/photo-cloudinary-upload.service';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../customer.service';

@Component({
  selector: 'app-update-client-profile',
  templateUrl: './update-client-profile.component.html',
  styleUrls: ['./update-client-profile.component.scss'],
  providers: [LoaderFunction]
})
export class UpdateClientProfileComponent implements OnInit {
  imgURL = '';
  finalImage: string = '';
  imageUploadEvent: any;
  showCropper = false;
  cropImage = false;
  selectedTab = 0;
  protected _onDestroy = new Subject<void>();
  dataLoaded:boolean = false;
  formPlaceHolder:any;
  advisorId:any;
  clientId:any;
  
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE & CLOSE',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
  };

  constructor(
    private subInjectService: SubscriptionInject,
    private utilService: UtilService,
    private event: EventService,
    public loaderFn: LoaderFunction,
    private cusService: CustomerService
  ) {
    this.formPlaceHolder = AppConstants.formPlaceHolders;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }

  validatorType = ValidatorType;

  @Input() data:any = {};

  ngOnInit() {
    this.selectedTab = this.data.openTab;
    this.imgURL = this.data.profile.profilePicUrl;
  }

  cropImg() {
    this.cropImage = true;
    this.showCropper = true;
  }

  uploadImageForCorping(event) {
    this.imageUploadEvent = event;
    this.showCropper = true;
  }

  saveImage() {
    if (this.showCropper) {
      if(this.barButtonOptions.active) return;
      this.loaderFn.increaseCounter();
      const tags = this.clientId + ',client_profile_logo,';
      const file = this.utilService.convertB64toImageFile(this.finalImage);
      PhotoCloudinaryUploadService.uploadFileToCloudinary([file], 'client_profile_logo', tags,
        (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
          if (status == 200) {
            const responseObject = JSON.parse(response);
            const jsonDataObj = {
              clientId: this.clientId,
              profilePicUrl: responseObject.url
            };
            this.cusService.updateClientProfilePic(jsonDataObj).subscribe((res) => {
              this.subInjectService.setRefreshRequired();
              this.imgURL = jsonDataObj.profilePicUrl;
              this.Close()
              this.event.openSnackBar('Image uploaded sucessfully', 'Dismiss');
            });
          }
        });
    } else {
      this.Close();
    }
  }

  showCroppedImage(imageAsBase64) {
    setTimeout(() => {
      this.finalImage = imageAsBase64;
    });
  }

  // save the changes of current page only
  saveCurrentPage() {
    if (this.selectedTab == 0) {
      this.saveImage();
    }
  }

  // reset the variables when user changes tabs
  // make sure to reset to latest updates
  resetPageVariables() {
    this.showCropper = false;
    this.cropImage = false;
    this.imageUploadEvent = '';
    this.finalImage = '';
    if(this.selectedTab == 0) {
      this.barButtonOptions.text = 'SAVE & NEXT';
    } else {
      this.barButtonOptions.text = 'SAVE & CLOSE';
    }
  }

  Close() {
    this.subInjectService.closeNewRightSlider({ state: 'close'});
  }
}
