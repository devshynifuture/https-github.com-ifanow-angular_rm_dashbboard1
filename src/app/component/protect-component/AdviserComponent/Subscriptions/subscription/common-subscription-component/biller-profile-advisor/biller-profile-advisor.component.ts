import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionService } from '../../../subscription.service';
import { AuthService } from '../../../../../../../auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { HttpClient } from '@angular/common/http';
import { PhotoCloudinaryUploadService } from '../../../../../../../services/photo-cloudinary-upload.service';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { UtilService, ValidatorType } from '../../../../../../../services/util.service';
import { PostalService } from 'src/app/services/postal.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { MatInput } from '@angular/material';

@Component({
  selector: 'app-biller-profile-advisor',
  templateUrl: './biller-profile-advisor.component.html',
  // templateUrl: './invoice-pdf.html',
  styleUrls: ['./biller-profile-advisor.component.scss']
})
export class BillerProfileAdvisorComponent implements OnInit {

  // validatorType = ValidatorType;

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
    buttonColor: 'primary',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  logoImg: any = '';
  pinInvalid = false;
  ifsciInvalid: boolean;

  validatorType = ValidatorType;
  billerProfileForm: any;
  isGstin = false;
  isPanNum = false;
  isAddress = false;
  isNameOnBank = false;
  isAcNo = false;
  isIFSC = false;
  isCity = false;
  isState = false;
  isCountry = false;
  isZipCode = false;
  isTaxable = false;
  isFootNote = false;
  isaddress = false;
  isTerms = false;
  isBankName = false;
  selected = 0;
  advisorId;
  billerProfileData: any;
  inputData: any;
  display: any;
  profileDetailsForm: any;
  bankDetailsForm: any;
  MiscellaneousData: any;

  constructor(public utils: UtilService, public subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private subService: SubscriptionService, private postalService: PostalService,
    private eventService: EventService, private http: HttpClient) {
  }

  imageData: File;
  uploadedImage: any;
  postalData: Object;
  postOfficeData: any;
  postOfficeDataDistrict: any;
  postOfficeDataCircle: any;
  postOfficeDataCountry: any;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  ifscFlag: boolean;
  pincodeFlag: boolean;

  // dirty fix to set open tab
  @Input() popupHeaderText = 0;

  logUrl = this.fb.group({
    url: [, [Validators.required]]
  });

  get data() {
    return this.inputData;
  }

  @Input()
  set data(data) {
    this.inputData = data;
    this.logoImg = data.logoUrl;
    this.getSingleBillerProfileData(data);
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.selected = this.popupHeaderText;
  }

  getFormControl() {
    if (this.billerProfileForm) {
      return this.billerProfileForm.controls;
    } else {
      return null;
    }
  }

  getFormControlProfile() {
    return this.profileDetailsForm.controls;
  }

  getFormControlBank() {
    return this.bankDetailsForm.controls;
  }

  getFrormControlMisc() {
    return this.MiscellaneousData.controls;
  }

  footNoteData(data) {
    this.getFrormControlMisc().footnote.setValue(data);
  }

  termsData(data) {
    this.getFrormControlMisc().terms.setValue(data);
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  uploadImgOnSave() {

  }

  uploadImage() {

    if (this.imageData.type == 'image/png' || this.imageData.type == 'image/jpeg') {
      this.barButtonOptions.active = true;
      const files = [this.imageData];
      const tags = this.advisorId + ',biller_profile_logo,';
      PhotoCloudinaryUploadService.uploadFileToCloudinary(files, 'biller_profile_logo', tags,
        (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
          if (status == 200) {
            const responseObject = JSON.parse(response);
            this.logoImg = responseObject.url;
            // this.logUrl.controls.url.setValue(this.imageData);
            this.uploadedImage = JSON.stringify(responseObject);
            this.eventService.openSnackBar('Image uploaded sucessfully', 'Dismiss');
            if (this.selected == 3) {
              this.addEditBillerForm();
            } else {
              this.barButtonOptions.active = false;
            }
          }

        });

    } else {
    }
  }

  onChange(event) {
    if (event && event.target && event.target.files) {
      const fileList = event.target.files;
      if (fileList.length == 0) {

        return;
      }
      this.imageData = fileList[0];

      this.logUrl.controls.url.reset();
      this.logoImg = this.imageData;
      // this.logoImg=
      const reader = new FileReader();
      reader.onload = e => this.logoImg = reader.result;
      // reader.
      reader.readAsDataURL(this.imageData);
    }
  }

  cancelImageUpload() {
    this.logoImg = undefined;
    this.logUrl.controls.url.reset();
  }

  getSingleBillerProfileData(data) {
    if (data == '') {
      data = {};
    }
    this.display = data;
    this.profileDetailsForm = this.fb.group({
      companyDisplayName: [data.companyName, [Validators.required]],
      // companyName: [data.companyName, [Validators.required]],
      gstTreatmentId: [data.gstTreatmentId ? String(data.gstTreatmentId) : '1'],
      gstinNum: [(data.gstin)],
      panNum: [(data.pan), [Validators.required, Validators.pattern('^[A-Za-z]{5}[0-9]{4}[A-z]{1}')]],
      Address: [(data.billerAddress), [Validators.required]],
      state: [(data.state), [Validators.required]],
      pincode: [(data.zipCode), [Validators.required, Validators.minLength(6)]],
      country: [(data.country), [Validators.required]],
      city: [(data.city), [Validators.required]],
      id: [data.id]
    }),
      this.logUrl = this.fb.group({
        url: [, [Validators.required]]
      });
    this.bankDetailsForm = this.fb.group({
      nameOnBank: [(data.nameAsPerBank), [Validators.required]],
      bankName: [(data.bankName), [Validators.required]],
      acNo: [(data.acNumber), [Validators.required]],
      ifscCode: [(data.ifscCode), [Validators.required]],
      address: [(data.branchAddress), [Validators.required]],
      stateB: [(data.bankState), [Validators.required]],
      pincodeB: [(data.bankZipCode), [Validators.required, Validators.minLength(6)]],
      cityB: [(data.bankCity), Validators.required],
      countryB: [(data.bankCountry), [Validators.required]],
    }),
      this.MiscellaneousData = this.fb.group({
        footnote: [(data.footnote), [Validators.required]],
        terms: [(data.terms), [Validators.required]]
      });
    this.getFormControlProfile().gstinNum.maxLength = 15;
    this.getFormControlProfile().companyDisplayName.maxLength = 50;
    this.getFormControlProfile().panNum.maxLength = 10;
    this.getFormControlProfile().Address.maxLength = 150;
    this.getFormControlBank().nameOnBank.maxLength = 50;
    this.getFormControlBank().bankName.maxLength = 35;
    this.getFormControlBank().acNo.maxLength = 16;
    this.getFormControlBank().ifscCode.maxLength = 11;
    this.getFormControlBank().address.maxLength = 150;
    this.getFrormControlMisc().footnote.maxLength = 500;
    this.getFrormControlMisc().terms.maxLength = 500;
    this.logoImg = data.logoUrl;
    if (this.profileDetailsForm.get('gstTreatmentId').value == '4') {
      this.profileDetailsForm.get('gstinNum').setValidators([Validators.required, Validators.pattern('^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$')]);
    } else {
      this.profileDetailsForm.get('gstinNum').setValidators(null);
    }
    this.profileDetailsForm.get('gstinNum').updateValueAndValidity();
  }

  changeGstField(value) {
    if (value == 4) {
      this.profileDetailsForm.get('gstinNum').setValidators([Validators.required, Validators.pattern('^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$')]);
    } else {
      this.profileDetailsForm.get('gstinNum').setValidators(null);
    }
    this.profileDetailsForm.get('gstinNum').updateValueAndValidity();
  }

  toUpperCase(formControl, event) {
    this.utils.toUpperCase(formControl, event);
  }

  capitalise(event) {
    if (event.target.value != '') {
      event.target.value = event.target.value.replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  Close(data) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: data });

  }

  nextStep(value, eventName) {
    switch (true) {
      case (this.profileDetailsForm.valid && value == 0):
        this.selected = 1;
        this.barButtonOptions.text = 'UPLOAD LOGO';
        break;
      case (/*this.logUrl.valid &&*/ value == 1):
        this.selected = 2;
        this.barButtonOptions.text = 'SAVE & NEXT';
        break;
      case (this.bankDetailsForm.valid && value == 2):
        this.selected = 3;
        this.barButtonOptions.text = 'SAVE';
        break;
      case (this.MiscellaneousData.valid && value == 3):
        this.submitBillerForm();
        break;
      default:
        this.submitBillerForm();
    }
  }

  getBankAddress(ifsc) {
    const obj = {
      ifsc
    };
    this.ifscFlag = true;
    if (ifsc != '') {
      this.subService.getBankAddress(obj).subscribe(data => {
        this.bankData(data);
        // this.PinData(data, 'bankDetailsForm')

      },
        err => {
          this.ifscFlag = false;
          this.bankData(err);
        });
    }
  }

  getPostalPin(value, state) {
    const obj = {
      zipCode: value
    };
    this.pincodeFlag = true;
    if (value != '') {
      this.postalService.getPostalPin(value).subscribe(data => {
        this.PinData(data, state);
      });
    } else {
      this.pinInvalid = false;
      this.pincodeFlag = false;
    }
  }

  PinData(data, state) {
    this.pincodeFlag = false;
    if (data[0].Status == 'Error') {
      this.pinInvalid = true;
      this.getFormControlProfile().ifscCode.setErrors(this.pinInvalid);
      this.getFormControlProfile().city.setValue('');
      this.getFormControlProfile().country.setValue('');
      this.getFormControlProfile().state.setValue('');
    } else {
      this.getFormControlProfile().city.setValue(data[0].PostOffice[0].District);
      this.getFormControlProfile().country.setValue(data[0].PostOffice[0].Country);
      this.getFormControlProfile().state.setValue(data[0].PostOffice[0].Circle);
      this.pinInvalid = false;
    }
  }

  bankData(data) {
    this.ifscFlag = false;
    if (data.status != undefined) {
      this.ifsciInvalid = true;
      this.getFormControlBank().ifscCode.setErrors(this.ifsciInvalid);
      this.getFormControlBank().cityB.setValue('');
      this.getFormControlBank().countryB.setValue('');
      this.getFormControlBank().stateB.setValue('');
      this.getFormControlBank().address.setValue('');
      this.getFormControlBank().pincodeB.setValue('');
    } else {
      let pincode;
      pincode = data.address.match(/\d/g);
      pincode = pincode.join('');
      pincode = pincode.substring(pincode.length - 6, pincode.length);
      data.address = data.address.replace(String(pincode), '');
      data.address = data.address.replace('-', '');
      const bankPin = data.address.split('A');
      this.getFormControlBank().pincodeB.setValue(bankPin[bankPin.length - 1]);
      this.getFormControlBank().cityB.setValue(data.district);
      this.getFormControlBank().countryB.setValue('India');
      this.getFormControlBank().stateB.setValue(data.state);
      this.getFormControlBank().address.setValue(data.address);
      this.getFormControlBank().bankName.setValue(data.bank);
      this.getFormControlBank().pincodeB.setValue(pincode);
      this.ifsciInvalid = false;
    }
  }

  back() {
    this.selected--;
    if (this.selected == 2) {
      this.barButtonOptions.text = 'UPLOAD LOGO';
    }

  }

  validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
  }


  submitBillerForm() {
    if (this.profileDetailsForm.invalid) {
      // for (let element in this.profileDetailsForm.controls) {
      //   if (this.profileDetailsForm.get(element).invalid) {
      //     this.inputs.find(input => !input.ngControl.valid).focus();
      //     this.profileDetailsForm.controls[element].markAsTouched();
      //   }
      // }
      this.profileDetailsForm.markAllAsTouched();
      return;
    } else if (this.bankDetailsForm.invalid) {
      this.bankDetailsForm.markAllAsTouched();
      return;
    } else {
      this.barButtonOptions.active = true;

      if (!this.validURL(this.logoImg) && this.logoImg != undefined) {
        this.uploadImage();
      } else {
        this.addEditBillerForm();

      }
    }
  }

  addEditBillerForm() {
    const obj = {
      acNumber: this.bankDetailsForm.controls.acNo.value,
      advisorId: this.advisorId,
      bankCity: this.bankDetailsForm.controls.cityB.value,
      bankCountry: this.bankDetailsForm.controls.countryB.value,
      bankName: this.bankDetailsForm.controls.bankName.value,
      bankState: this.bankDetailsForm.controls.stateB.value,
      bankZipCode: this.bankDetailsForm.controls.pincodeB.value,
      billerAddress: this.profileDetailsForm.controls.Address.value,
      branchAddress: this.bankDetailsForm.controls.address.value,
      city: this.profileDetailsForm.controls.city.value,
      companyDisplayName: this.profileDetailsForm.controls.companyDisplayName.value,
      country: this.profileDetailsForm.controls.country.value,
      footnote: this.MiscellaneousData.controls.footnote.value,
      gstin: (this.profileDetailsForm.controls.gstTreatmentId.value == '4') ? this.profileDetailsForm.controls.gstinNum.value : null,
      gstTreatmentId: this.profileDetailsForm.controls.gstTreatmentId.value,
      ifscCode: this.bankDetailsForm.controls.ifscCode.value,
      logoUrl: this.logoImg,
      nameAsPerBank: this.bankDetailsForm.controls.nameOnBank.value,
      pan: this.profileDetailsForm.controls.panNum.value,
      state: this.profileDetailsForm.controls.state.value,
      terms: this.MiscellaneousData.controls.terms.value,
      zipCode: this.profileDetailsForm.controls.pincode.value,
      id: this.profileDetailsForm.controls.id.value,
      cloudinary_json: this.uploadedImage
    };

    if (this.profileDetailsForm.controls.id.value == undefined) {
      this.subService.saveBillerProfileSettings(obj).subscribe(
        data => this.closeTab(data),
        error => {
          this.barButtonOptions.active = false;
          this.eventService.showErrorMessage(error);
        }
      );

    } else {
      this.subService.updateBillerProfileSettings(obj).subscribe(
        data => this.closeTab(data),
        error => {
          this.barButtonOptions.active = false;
          this.eventService.showErrorMessage(error);
        }
      );
    }
  }

  getPostalRes(data) {
  }

  closeTab(data) {
    this.barButtonOptions.active = false;
    if (data == true) {
      this.Close(data);
      (this.profileDetailsForm.controls.id.value == undefined) ?
        this.eventService.openSnackBar('Biller profile is added', 'OK') : this.eventService.openSnackBar('Biller profile is edited', 'OK');


    }
  }

}
