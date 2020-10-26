import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AppConstants } from 'src/app/services/app-constants';
import { PhotoCloudinaryUploadService } from 'src/app/services/photo-cloudinary-upload.service';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { OrgSettingServiceService } from '../../org-setting-service.service';

@Component({
  selector: 'app-fevicon-url',
  templateUrl: './fevicon-url.component.html',
  styleUrls: ['./fevicon-url.component.scss']
})
export class FeviconUrlComponent implements OnInit {

  imgURL = '';
  finalImage: string = '';
  imageUploadEvent: any;
  showCropper = false;
  cropImage = false;
  selectedTab = 0;
  protected _onDestroy = new Subject<void>();
  dataLoaded: boolean = false;
  formPlaceHolder: any;
  advisorId: any;
  clientId: any;

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
    private orgSetting: OrgSettingServiceService,
    private subInjectService: SubscriptionInject,
    private utilService: UtilService,
    private eventService: EventService,
  ) {
    this.formPlaceHolder = AppConstants.formPlaceHolders;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }

  validatorType = ValidatorType;

  @Input() data: any = {};

  ngOnInit() {
    this.imgURL = this.data.feviconUrl;
  }

  cropImg() {
    this.cropImage = true;
    this.showCropper = true;
  }

  editImage(event) {
    this.imageUploadEvent = event;
    this.cropImg();
  }

  uploadImageForCorping(event) {
    this.imageUploadEvent = event;
    this.showCropper = true;
  }

  saveImage() {
    if (this.showCropper) {
      this.barButtonOptions.active = true;
      // if (this.barButtonOptions.active) return;
      // this.loaderFn.increaseCounter();
      const tags = this.clientId + ',fevicon_url,';
      const file = this.utilService.convertB64toImageFile(this.finalImage);
      PhotoCloudinaryUploadService.uploadFileToCloudinary([file], 'fevicon_url', tags,
        (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
          if (status == 200) {
            const responseObject = JSON.parse(response);
            const obj = {
              advisorId: this.advisorId,
              completeWhiteLabel: this.data.completeWhiteLabel,
              feviconUrl: responseObject.secure_url,
              partialWhiteLabel: this.data.partialWhiteLabel,
              siteTitle: this.data.siteTitle,
              hasDomain: this.data.hasDomain
            };
            this.orgSetting.updateDomainSetting(obj).subscribe(
              data => {
                this.eventService.openSnackBar("Uploaded sucessfully!", "Dimiss");
                this.Close(true);
              },
              err => this.eventService.openSnackBar(err, 'Dismiss')
            );
          }
        });
    } else {
      this.Close(false);
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
    if (this.selectedTab == 0) {
      this.barButtonOptions.text = 'SAVE & NEXT';
    } else {
      this.barButtonOptions.text = 'SAVE & CLOSE';
    }
  }

  Close(flag) {
    this.subInjectService.closeNewRightSlider({ state: 'close', refreshRequired: flag });
  }

}
