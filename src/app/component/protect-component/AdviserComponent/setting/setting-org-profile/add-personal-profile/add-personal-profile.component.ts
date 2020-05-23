import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PhotoCloudinaryUploadService} from 'src/app/services/photo-cloudinary-upload.service';
import {AuthService} from 'src/app/auth-service/authService';
import {FileItem, ParsedResponseHeaders} from 'ng2-file-upload';
import {SettingsService} from '../../settings.service';
import {UtilService, ValidatorType} from 'src/app/services/util.service';
import {FormBuilder, FormGroup, Validators, FormControl, ValidationErrors, AbstractControl} from '@angular/forms';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from '../../../Subscriptions/subscription-inject.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppConstants } from 'src/app/services/app-constants';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { LoginService } from 'src/app/component/no-protected/login/login.service';

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
  isLoading = false;
  isdCodes: Array<any> = [];
  /** control for the MatSelect filter keyword */
  filterCtrl: FormControl = new FormControl();
  filteredIsdCodes: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  dataLoaded:boolean = false;
  formPlaceHolder:any;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE & NEXT',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
  };
  userData: any;

  constructor(
    private subInjectService: SubscriptionInject,
    private utilService: UtilService,
    private settingsService: SettingsService,
    private event: EventService,
    private fb: FormBuilder,
    private peopleService: PeopleService,
    private authService: AuthService,
    private loginService: LoginService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
    this.formPlaceHolder = AppConstants.formPlaceHolders;
    this.userData = AuthService.getUserInfo();
  }

  personalProfile: FormGroup;
  validatorType = ValidatorType;

  @Input() data:any = {};

  ngOnInit() {
    this.selectedTab = this.data.openTab;
    this.resetPageVariables();
    this.createForms(this.data);
    this.getPersonalInfo();
    this.getIsdCodesData();

    // listen for search field value changes
    this.filterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCodes();
      });
  }

  cropImg(data) {
    this.cropImage = true;
    this.showCropper = true;
  }

  getIsdCodesData() {
    this.peopleService.getIsdCode({}).subscribe(
      data => {
        if (data) {
          this.isdCodes = data;
          this.filteredIsdCodes.next(this.isdCodes.slice());
          this.dataLoaded = true;
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
      if(this.barButtonOptions.active) return;
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
              this.subInjectService.setRefreshRequired();
              this.anyDetailsChanged = true;
              this.imgURL = jsonDataObj.profilePic;
              AuthService.setProfilePic(jsonDataObj.profilePic);
              this.event.openSnackBar('Image uploaded sucessfully', 'Dismiss');
              this.selectedTab = 2;
              this.resetPageVariables();
            });
          }
        });
    } else {
      this.selectedTab = 2;
      this.resetPageVariables();
    }
  }

  showCroppedImage(imageAsBase64) {
    setTimeout(() => {
      this.finalImage = imageAsBase64;
    });
  }

  // save the changes of current page only
  saveCurrentPage() {
    switch(this.selectedTab) {
      case 0:
        this.updatePersonalProfile();
        break;
      case 1:
        this.saveImage();
        break;
      case 2:
        this.setNewPassword();
    }
  }

  // reset the variables when user changes tabs
  // make sure to reset to latest updates
  resetPageVariables() {
    this.showCropper = false;
    this.cropImage = false;
    this.imageUploadEvent = '';
    this.finalImage = '';
    if(this.selectedTab < 2) {
      this.barButtonOptions.text = 'SAVE & NEXT';
    } else {
      this.barButtonOptions.text = 'SAVE & CLOSE';
    }
  }

  createForms(data) {
    this.personalProfile = this.fb.group({
      name: [(!data) ? '' : (data.fullName), [Validators.required, Validators.maxLength(40)]],
      emailId: [(!data) ? '' : data.emailId, [Validators.required, Validators.pattern(ValidatorType.EMAIL)]],
      isdCodeId: [(!data) ? '' : data.isdCodeId, [Validators.required]],
      mobileNo: [(!data) ? '' : data.mobileNo, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(ValidatorType.NUMBER_ONLY)]],
      userName: [(!data) ? '' : data.userName, [Validators.required]],
    });

    this.setNewPasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(this.validatorType.LOGIN_PASS_REGEX), this.checkUpperCase(), this.checkLowerCase(), this.checkSpecialCharacter()]],
      confirmPassword: ['', [Validators.required, Validators.pattern(this.validatorType.LOGIN_PASS_REGEX)]]
    });
  }

  getFormControl(): any {
    return this.personalProfile.controls;
  }

  updatePersonalProfile() {
    if (this.personalProfile.invalid || this.barButtonOptions.active) {
      this.personalProfile.markAllAsTouched();
      return;
    }
    const obj = {
      adminAdvisorId: this.advisorId,
      fullName: this.personalProfile.controls.name.value,
      emailId: this.personalProfile.controls.emailId.value,
      isdCodeId: this.personalProfile.controls.isdCodeId.value,
      mobileNo: this.personalProfile.controls.mobileNo.value,
    };
    this.barButtonOptions.active = true;
    this.settingsService.editPersonalProfile(obj).subscribe(
      data => {
        this.barButtonOptions.active = false;
        this.selectedTab = 1; // switch tab to profile pic
        this.resetPageVariables();
        this.subInjectService.setRefreshRequired();
        this.anyDetailsChanged = true;
      },
      err => {
        this.event.openSnackBar(err, 'Dismiss');
        this.barButtonOptions.active = false;
      }
    );
  }

  Close() {
    this.subInjectService.closeNewRightSlider({ state: 'close'});
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


  //-------------------------------------RESET PASSWORD ------------------------------

  newPasswordLength = 0;
  passwordStregth = {
    upperCase: false,
    lowerCase: false,
    specialCharacter: false
  };
  setNewPasswordForm: FormGroup;
  hide1 = true;
  hide2 = true;
  hide3 = true;

  setNewPassword() {
    if(this.setNewPasswordForm.pristine) {
      this.Close();
    }
    if (this.setNewPasswordForm.invalid || this.barButtonOptions.active) {
      this.setNewPasswordForm.markAllAsTouched();
      return;
    } else {
      this.barButtonOptions.active = true;
      const obj = {
        password: this.setNewPasswordForm.controls.oldPassword.value,
        newPassword: this.setNewPasswordForm.controls.confirmPassword.value,
        userId: this.userData.userId
      };
      this.loginService.resetPasswordPostLoggedIn(obj).subscribe(data => {
        this.barButtonOptions.active = false;
        this.event.openSnackBar(data, "Dismiss");
        this.Close();
      }, err => {
        this.event.showErrorMessage(err);
        this.barButtonOptions.active = false;
      });
    }
  }

  checkUpperCase() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (new RegExp(/(?=.*[A-Z])/).test(control.value) && control.value != null) {
        this.passwordStregth.upperCase = true;
        return;
      }
      this.passwordStregth.upperCase = false;
      return;
    };
  }

  checkLowerCase() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (new RegExp(/(?=.*[a-z])/).test(control.value) && control.value != null) {
        this.passwordStregth.lowerCase = true;
        return;
      }
      this.passwordStregth.lowerCase = false;
      return;
    };
  }

  checkSpecialCharacter() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (new RegExp(/([!@#$%^&*()])/).test(control.value) && control.value != null) {
        this.passwordStregth.specialCharacter = true;
        return;
      }
      this.passwordStregth.specialCharacter = false;
      return;
    };
  }

  checkPassword() {
    const password = this.setNewPasswordForm.get('newPassword').value;
    const confirm_new_password = this.setNewPasswordForm.get('confirmPassword').value;
    if (password !== '' && confirm_new_password !== '') {
      if (confirm_new_password !== password) {
        this.setNewPasswordForm.get('confirmPassword').setErrors({ mismatch: true });
      } else {
        this.setNewPasswordForm.get('confirmPassword').setErrors(null);
      }
    }
  }
}
