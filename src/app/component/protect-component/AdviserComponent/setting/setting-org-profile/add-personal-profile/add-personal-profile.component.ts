import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PhotoCloudinaryUploadService} from 'src/app/services/photo-cloudinary-upload.service';
import {AuthService} from 'src/app/auth-service/authService';
import {FileItem, ParsedResponseHeaders} from 'ng2-file-upload';
import {SettingsService} from '../../settings.service';
import {UtilService, ValidatorType} from 'src/app/services/util.service';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from '../../../Subscriptions/subscription-inject.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-personal-profile',
  templateUrl: './add-personal-profile.component.html',
  styleUrls: ['./add-personal-profile.component.scss']
})
export class AddPersonalProfileComponent implements OnInit {
  imgURL = '';
  finalImage: string = '';
  advisorId: any;
  imageUploadEvent: any;
  showCropper = false;
  cropImage = false;
  selectedTab = 0;
  anyDetailsChanged: boolean; // check if any details have been updated
  inputData: any;
  isLoading = false;
  isdCodes: Array<any> = [];
  /** control for the MatSelect filter keyword */
  filterCtrl: FormControl = new FormControl();
  filteredIsdCodes: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  constructor(
    private subInjectService: SubscriptionInject,
    private utilService: UtilService,
    private settingsService: SettingsService,
    private event: EventService,
    private fb: FormBuilder,
    private peopleService: PeopleService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  personalProfile: FormGroup;
  validatorType = ValidatorType;

  @Input()
  set data(data) {
    this.inputData = data;

    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.selectedTab = this.inputData.openTab;
    this.getdataForm(this.inputData);
    this.getPersonalInfo();
    this.getIsdCodesData();

    // listen for search field value changes
    this.filterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCodes();
      });
  }


  getIsdCodesData() {
    this.peopleService.getIsdCode({}).subscribe(
      data => {
        if (data) {
          this.isdCodes = data;
          this.filteredIsdCodes.next(this.isdCodes.slice());
        }
      }, err => {
        this.event.showErrorMessage('Error');
      }
    )
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
            };
            this.settingsService.uploadProfilePhoto(jsonDataObj).subscribe((res) => {
              this.anyDetailsChanged = true;
              this.imgURL = jsonDataObj.profilePic;
              AuthService.setProfilePic(jsonDataObj.profilePic);
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
    setTimeout(() => {
      this.finalImage = imageAsBase64;
    });
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
      isdCodeId: [(!data) ? '' : data.isdCodeId, [Validators.required]],
      mobileNo: [(!data) ? '' : data.mobileNo, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(ValidatorType.NUMBER_ONLY)]],
      userName: [(!data) ? '' : data.userName, [Validators.required]],
    });
  }

  getFormControl(): any {
    return this.personalProfile.controls;
  }

  updatePersonalProfile() {
    if (this.personalProfile.invalid) {
      this.personalProfile.markAllAsTouched();
      return;
    }
    const obj = {
      adminAdvisorId: this.advisorId,
      fullName: this.personalProfile.controls.name.value,
      emailId: this.personalProfile.controls.emailId.value,
      // userName: this.personalProfile.controls.userName.value,
      isdCodeId: this.personalProfile.controls.isdCodeId.value,
      mobileNo: this.personalProfile.controls.mobileNo.value,
      // roleId: 0,
    };
    this.settingsService.editPersonalProfile(obj).subscribe(
      data => {
        this.selectedTab = 2; // switch tab to profile pic
        this.anyDetailsChanged = true;
      },
      err => this.event.openSnackBar(err, 'Dismiss')
    );
  }

  Close(flag: boolean) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  protected filterCodes() {
    if (!this.isdCodes) {
      return;
    }
    // get the search keyword
    let search = this.filterCtrl.value;
    if (!search) {
      this.filteredIsdCodes.next(this.isdCodes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the codes
    this.filteredIsdCodes.next(this.isdCodes.filter(code => (code.code + code.countryCode).toLowerCase().indexOf(search) > -1))
  }
}
