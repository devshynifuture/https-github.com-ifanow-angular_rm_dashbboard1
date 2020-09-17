import { Component, OnInit, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { PhotoCloudinaryUploadService } from 'src/app/services/photo-cloudinary-upload.service';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { SettingsService } from '../../../settings.service';
import { AuthService } from 'src/app/auth-service/authService';
import { PostalService } from 'src/app/services/postal.service';
import { Subscription, Subject, ReplaySubject } from 'rxjs';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { takeUntil } from 'rxjs/operators';
import { AppConstants } from 'src/app/services/app-constants';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

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
  selectedTab: number = 0;

  inputData: any;
  pinInvalid: boolean;
  validatorType = ValidatorType
  subscription = new Subscription();
  isdCodes: Array<any> = [];
  /** control for the MatSelect filter keyword */
  filterCtrl: FormControl = new FormControl();
  filterCountryCtrl: FormControl = new FormControl();
  filteredIsdCodes: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCountryCodes: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  dataLoaded: boolean = false;
  imgData: string = '';
  formPlaceHolder: any;
  isLoading: boolean = false;
  @ViewChild('placeSearch', { static: true }) placeSearch: ElementRef;

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

  constructor(
    public utils: UtilService,
    private event: EventService,
    private fb: FormBuilder,
    public subInjectService: SubscriptionInject,
    private settingsService: SettingsService,
    private postalService: PostalService,
    private peopleService: PeopleService,
    private authService: AuthService,
    private ngZone: NgZone
  ) {
    this.advisorId = AuthService.getAdvisorId();
    this.formPlaceHolder = AppConstants.formPlaceHolders;
  }

  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {

    const autoCompelete = new google.maps.places.Autocomplete(this.placeSearch.nativeElement, {
      types: [],
      componentRestrictions: { 'country': 'IN' }
    });

    autoCompelete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place: google.maps.places.PlaceResult = autoCompelete.getPlace();
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }
        this.orgProfile.get('address').setValue(place.formatted_address)
        // this.addressForm.get('addressLine2').setValue(`${place.address_components[0].long_name},${place.address_components[2].long_name}`)
        this.getPincode(place.formatted_address)
        // console.log(place)
      })
      // })
    })

    this.switchToTab(this.inputData.openTab);
    this.profileImg = this.data.logoUrl;
    this.reportImg = this.data.reportLogoUrl;
    this.getIsdCodesData();
    this.getdataForm(this.inputData);
    // listen for search field value changes
    this.filterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCodes();
      });
    this.filterCountryCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCodes();
      });
  }


  getPincode(data) {
    let pincode, addressData;
    addressData = data.trim();
    pincode = addressData.match(/\d/g);
    pincode = pincode ? pincode.join("") : '';
    pincode = pincode.substring(pincode.length - 6, pincode.length);
    this.orgProfile.get('pincode').setValue(pincode)
    this.getPostalPin(pincode);
  }

  getIsdCodesData() {
    this.peopleService.getIsdCode({}).subscribe(
      data => {
        if (data) {
          this.isdCodes = data;
          this.filteredIsdCodes.next(this.isdCodes.slice());
          this.filteredCountryCodes.next(this.isdCodes.slice());
          this.dataLoaded = true;
        }
      }, err => {
        this.event.showErrorMessage('Error');
      }
    )
  }


  Close(flag) {
    this.subInjectService.closeNewRightSlider({ state: 'close' });
  }

  getPostalPin(value: string) {
    if (value != "" && value.length == 6) {
      this.isLoading = true;
      this.postalService.getPostalPin(value).subscribe(data => {
        this.PinData(data)
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        this.orgProfile.get('city').enable();
        this.orgProfile.get('state').enable();
      })
    }
  }

  PinData(data) {
    if (data[0].Status == "Error") {
      this.orgProfile.controls.city.setValue("");
      this.orgProfile.controls.state.setValue("");
      this.orgProfile.get('city').enable();
      this.orgProfile.get('state').enable();
    }
    else {
      const pincodeData = (data == undefined) ? data = {} : data[0].PostOffice;
      this.orgProfile.get('city').setValue(pincodeData[0].District);
      this.orgProfile.get('state').setValue(pincodeData[0].State);
      this.orgProfile.get('city').disable();
      this.orgProfile.get('state').disable();
      let address1 = this.orgProfile.get('address').value;
      let pincodeFlag = address1.includes(`${this.orgProfile.get('pincode').value},`)
      address1 = address1.replace(`${this.orgProfile.get('city').value},`, '')
      address1 = address1.replace(!pincodeFlag ? `${this.orgProfile.get('state').value},` : this.orgProfile.get('state').value, '')
      address1 = address1.replace(this.orgProfile.get('country').value, '');
      address1 = address1.replace(pincodeFlag ? `${this.orgProfile.get('pincode').value},` : this.orgProfile.get('pincode').value, '')
      this.orgProfile.get('address').setValue(address1)
      this.pinInvalid = false;
    }
  }


  getdataForm(data) {
    if (data.isdCodeId == 0) {
      data.isdCodeId = null;
    }
    this.orgProfile = this.fb.group({
      companyName: [(!data) ? '' : (data.companyName), [Validators.required, Validators.maxLength(50)]],
      emailId: [(!data) ? '' : data.email, [Validators.required, Validators.pattern(ValidatorType.EMAIL)]],
      isdCodeId: [(!data) ? '' : data.isdCodeId, [Validators.required]],
      mobileNo: [(!data) ? '' : data.mobileNumber, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(ValidatorType.NUMBER_ONLY)]],
      website: [(!data) ? '' : data.website, [Validators.required]],
      address: [(!data) ? '' : data.billerAddress, [Validators.required]],
      gstTreatment: ['', [Validators.required]],
      country: [(!data) ? '' : data.country, []],
      gstNumber: [(!data) ? '' : data.gstin],
      city: [(!data) ? '' : data.city, [Validators.required, Validators.pattern(ValidatorType.TEXT_ONLY)]],
      state: [(!data) ? '' : data.state, [Validators.required, Validators.pattern(ValidatorType.TEXT_ONLY)]],
      pincode: [(!data) ? '' : data.zipCode, []],
    });

    this.subscribeToGSTTypeValueChange();
    this.orgProfile.controls.gstTreatment.setValue((!data) ? '' : data.gstTreatmentId);
    this.orgProfile.get('city').disable();
    this.orgProfile.get('state').disable();
  }

  subscribeToGSTTypeValueChange() {
    this.subscription.add(
      this.orgProfile.controls.gstTreatment.valueChanges.subscribe(value => {
        // for some weird reason validation is not happening the first time hence kept it twice
        this.changeGSTDependentValidators(value);
        this.changeGSTDependentValidators(value);
      })
    )
  }

  changeGSTDependentValidators(value) {
    if (value == 4) {
      this.orgProfile.get('gstNumber').setValidators([Validators.required, Validators.maxLength(15), Validators.minLength(15)]);
    } else {
      this.orgProfile.get('gstNumber').setValue('');
      this.orgProfile.get('gstNumber').clearValidators();
    }

    if (value == 3) {
      this.orgProfile.get('pincode').setValue('');
      this.orgProfile.get('city').setValue('');
      this.orgProfile.get('state').setValue('');
      this.orgProfile.get('pincode').clearValidators();
      this.orgProfile.get('city').clearValidators();
      this.orgProfile.get('state').clearValidators();
      this.orgProfile.get('country').setValidators([Validators.required]);
    } else {
      this.orgProfile.get('pincode').setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(ValidatorType.NUMBER_ONLY)]);
      this.orgProfile.get('city').setValidators([Validators.required, Validators.pattern(ValidatorType.TEXT_ONLY)]);
      this.orgProfile.get('state').setValidators([Validators.required, Validators.pattern(ValidatorType.TEXT_ONLY)]);
      this.orgProfile.get('country').setValue('');
      this.orgProfile.get('country').clearValidators();
    }
    this.orgProfile.updateValueAndValidity();

  }

  updateOrgProfile() {
    if (this.orgProfile.invalid || this.barButtonOptions.active) {
      this.orgProfile.markAllAsTouched();
      return;
    }
    this.barButtonOptions.active = true;
    let obj = {
      advisorId: this.advisorId,
      companyName: this.orgProfile.controls.companyName.value || '',
      email: this.orgProfile.controls.emailId.value || '',
      mobileNumber: this.orgProfile.controls.mobileNo.value || '',
      website: this.orgProfile.controls.website.value || '',
      billerAddress: this.orgProfile.controls.address.value || '',
      city: this.orgProfile.controls.city.value || '',
      state: this.orgProfile.controls.state.value || '',
      zipCode: this.orgProfile.controls.pincode.value || '',
      gstTreatmentId: this.orgProfile.controls.gstTreatment.value || 0,
      gstin: this.orgProfile.controls.gstNumber.value || '',
      country: this.orgProfile.controls.country.value || '',
      isdCodeId: this.orgProfile.controls.isdCodeId.value || '',
    }
    this.settingsService.editOrgProfile(obj).subscribe(
      data => {
        this.subInjectService.setRefreshRequired();
        this.barButtonOptions.active = false;
        this.switchToTab(++this.selectedTab);
      },
      err => {
        this.event.openSnackBar(err, "Dismiss")
        this.barButtonOptions.active = false;
      }
    );
  }

  // method for org & report logo
  uploadImageForCorping(event) {
    this.imageUploadEvent = event;
    this.showCropper = true;
  }

  saveImageInCloud(tag_folder) {
    if (this.showCropper) {
      if (this.barButtonOptions.active) return;
      this.barButtonOptions.active = false;
      const tags = this.advisorId + ',' + tag_folder + ',';
      const file = this.utils.convertB64toImageFile(this.finalImage);
      PhotoCloudinaryUploadService.uploadFileToCloudinary([file], tag_folder, tags,
        (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
          if (status == 200) {
            let responseObject = JSON.parse(response);
            responseObject['advisorId'] = responseObject.id;
            delete responseObject.id;
            if (tag_folder == 'organizational_profile_logo') {
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
    if (nextIndex > 2) {
      this.Close(false);
    } else {
      if (nextIndex == 2) {
        this.barButtonOptions.text = 'SAVE & CLOSE'
      } else {
        this.barButtonOptions.text = 'SAVE & NEXT'
      }
      this.selectedTab = nextIndex;
    }
  }

  updateOrganizationPhotoAndMoveToNextPage(cloudinaryResponseJson: any, web_or_report: string) {
    if (web_or_report == 'web') {
      const jsonDataObj = {
        advisorId: this.advisorId,
        logoUrl: cloudinaryResponseJson.secure_url,
        cloudinary_json: JSON.stringify(cloudinaryResponseJson)
      }
      this.settingsService.editOrgProfileLogo(jsonDataObj).subscribe((res) => {
        this.event.openSnackBar('Image uploaded sucessfully', 'Dismiss');
        this.subInjectService.setRefreshRequired();
        this.profileImg = jsonDataObj.logoUrl;
        const orgDetails = this.authService.orgData;
        orgDetails.logoUrl = jsonDataObj.logoUrl;
        AuthService.setOrgDetails(orgDetails);
        this.switchToTab(++this.selectedTab);
        this.barButtonOptions.active = false;
      }, err => {
        this.event.openSnackBar("Error occured while uploading image", "Dismiss");
        this.barButtonOptions.active = false;
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
        this.subInjectService.setRefreshRequired();
        this.barButtonOptions.active = false;
      }, err => {
        this.event.openSnackBar("Error occured while uploading image", "Dismiss");
        this.barButtonOptions.active = false;
      });
    }
  }

  showCroppedImage(imageAsBase64) {
    setTimeout(() => {
      this.finalImage = imageAsBase64;
    });
  }

  // save the changes of current page only
  saveCurrentPage() {
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
  resetPageVariables() {
    this.showCropper = false;
    this.cropImage = false;
    this.imageUploadEvent = '';
    this.finalImage = '';
    if (this.selectedTab == 2) {
      this.barButtonOptions.text = 'SAVE & CLOSE';
    } else {
      this.barButtonOptions.text = 'SAVE & NEXT';
    }
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
  protected filterCountryCodes() {
    if (!this.isdCodes) {
      return;
    }
    // get the search keyword
    let search = this.filterCountryCtrl.value;
    if (!search) {
      this.filteredCountryCodes.next(this.isdCodes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the codes
    this.filteredCountryCodes.next(this.isdCodes.filter(code => (code.countryName).toLowerCase().indexOf(search) > -1))
  }

  cropImg(data) {
    this.cropImage = true;
    this.showCropper = true;
  }

  resetWebImage() {
    this.settingsService.resetWebImage(this.data.id).subscribe(
      res => {
        this.profileImg = res;
        const orgDetails = this.authService.orgData;
        orgDetails.logoUrl = res;
        AuthService.setOrgDetails(orgDetails);
      }, err => {
        this.event.openSnackBar("Error occured", 'Dismiss');
      }
    )
  }

  resetLogoImage() {
    this.settingsService.resetReportLogoImage(this.data.id).subscribe(
      res => {
        this.reportImg = res;
        const orgDetails = this.authService.orgData;
        orgDetails.reportLogoUrl = res;
        AuthService.setOrgDetails(orgDetails);
      }, err => {
        this.event.openSnackBar("Error occured", 'Dismiss');
      }
    )
  }
}
