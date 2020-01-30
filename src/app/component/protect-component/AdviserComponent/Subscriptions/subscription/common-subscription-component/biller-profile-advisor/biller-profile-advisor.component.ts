import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionService } from '../../../subscription.service';
import { AuthService } from '../../../../../../../auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PhotoCloudinaryUploadService } from '../../../../../../../services/photo-cloudinary-upload.service';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { UtilService, ValidatorType } from '../../../../../../../services/util.service';
import { PostalService } from 'src/app/services/postal.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-biller-profile-advisor',
  templateUrl: './biller-profile-advisor.component.html',
  // templateUrl: './invoice-pdf.html',
  styleUrls: ['./biller-profile-advisor.component.scss']
})
export class BillerProfileAdvisorComponent implements OnInit {
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
  }

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
  logoImg: any;
  imageData: File;
  uploadedImage: any;
  postalData: Object;
  postOfficeData: any;
  postOfficeDataDistrict: any;
  postOfficeDataCircle: any;
  postOfficeDataCountry: any;

  // validatorType = ValidatorType;

  constructor(public utils: UtilService, public subInjectService: SubscriptionInject, private fb: FormBuilder,
    private subService: SubscriptionService, private postalService: PostalService,
    private eventService: EventService, private http: HttpClient) {
  }

  @Input() Selected;

  @Input()
  set data(data) {
    this.inputData = data;
    this.logoImg = data.logoUrl;
    this.getSingleBillerProfileData(data);
  }

  logUrl = this.fb.group({
    url: [, [Validators.required]]
  });

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
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

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  uploadImage() {
    if (this.imageData.type == 'image/png' || this.imageData.type == 'image/jpeg') {
      const files = [this.imageData];
      const tags = this.advisorId + ',biller_profile_logo,';
      PhotoCloudinaryUploadService.uploadFileToCloudinary(files, 'biller_profile_logo', tags,
        (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
          if (status == 200) {
            const responseObject = JSON.parse(response);
            console.log('onChange file upload success response url : ', responseObject.url);
            this.logoImg = responseObject.url;
            console.log('uploadImage success this.imageData : ', this.imageData);
            // this.logUrl.controls.url.setValue(this.imageData);
            this.uploadedImage = JSON.stringify(responseObject);
            this.eventService.openSnackBar('Image uploaded sucessfully', 'dismiss');
          }

        });

    } else {
      console.log('asfasdas');
    }
  }

  onChange(event) {
    console.log('Biller profile logo Onchange event : ', event);
    if (event && event.target && event.target.files) {
      const fileList = event.target.files;
      if (fileList.length == 0) {
        console.log('Biller profile logo Onchange fileList : ', fileList);

        return;
      }
      this.imageData = fileList[0];

      console.log(this.imageData);
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
      companyDisplayName: [data.companyDisplayName, [Validators.required]],
      // companyName: [data.companyName, [Validators.required]],
      gstinNum: [(data.gstin), [Validators.required]],
      panNum: [(data.pan), [Validators.required, Validators.pattern("^[A-Za-z]{5}[0-9]{4}[A-z]{1}")]],
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
    this.getFormControlBank().nameOnBank.maxLength = 25;
    this.getFormControlBank().bankName.maxLength = 35;
    this.getFormControlBank().acNo.maxLength = 16;
    this.getFormControlBank().ifscCode.maxLength = 11;
    this.getFormControlBank().address.maxLength = 150;
    this.getFrormControlMisc().footnote.maxLength = 160;
    this.getFrormControlMisc().terms.maxLength = 160;
    this.logoImg = data.logoUrl;
  }

  Close(data) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', data });
  }

  nextStep(value, eventName) {
    console.log(value);
    switch (true) {
      case (this.profileDetailsForm.valid && value == 0):
        this.selected = 1;
        this.barButtonOptions.text = "SAVE & NEXT";
        break;
      case (/*this.logUrl.valid &&*/ value == 1):
        this.selected = 2;
        break;
      case (this.bankDetailsForm.valid && value == 2):
        this.selected = 3;
        this.barButtonOptions.text = "SAVE";
        break;
      case (this.MiscellaneousData.valid && value == 3):
        this.submitBillerForm();
        break;
      default:
        this.submitBillerForm();
    }
  }
  getPostalPin(value, state) {
    let obj = {
      zipCode: value
    }
    if (value.length > 5) {
      this.postalService.getPostalPin(value).subscribe(data => {
        console.log('postal 121221', data)
        this.PinData(data, state)
      })
    }
  }
  PinData(data, state) {
    if (state == 'bankDetailsForm') {
      this.getFormControlBank().cityB.setValue(data[0].PostOffice[0].District)
      this.getFormControlBank().countryB.setValue(data[0].PostOffice[0].Country)
      this.getFormControlBank().stateB.setValue(data[0].PostOffice[0].Circle)
    } else {
      this.getFormControlProfile().city.setValue(data[0].PostOffice[0].District);
      this.getFormControlProfile().country.setValue(data[0].PostOffice[0].Country);
      this.getFormControlProfile().state.setValue(data[0].PostOffice[0].Circle);
    }
  }

  back() {
    this.selected--;
  }

  

  submitBillerForm() {
    if (this.profileDetailsForm.controls.companyDisplayName.invalid) {
      this.profileDetailsForm.controls.companyDisplayName.markAsTouched();
      return;
    } else if (this.profileDetailsForm.controls.gstinNum.invalid) {
      this.profileDetailsForm.controls.gstinNum.markAsTouched();
      return;
    } else if (this.profileDetailsForm.controls.panNum.invalid) {
      this.profileDetailsForm.controls.panNum.markAsTouched();
      return;
    } else if (this.profileDetailsForm.controls.Address.invalid) {
      this.profileDetailsForm.controls.Address.markAsTouched();
      return;
    } else if (this.profileDetailsForm.controls.city.invalid) {
      this.profileDetailsForm.controls.city.markAsTouched();
      return;
    } else if (this.profileDetailsForm.controls.state.invalid) {
      this.profileDetailsForm.controls.state.markAsTouched();
      return;
    } else if (this.profileDetailsForm.controls.country.invalid) {
      this.profileDetailsForm.controls.country.markAsTouched();
      return;
    } else if (this.profileDetailsForm.controls.pincode.invalid) {
      this.profileDetailsForm.controls.pincode.markAsTouched();
      return;
    } /*else if (this.logUrl.controls.url.invalid) {
      return;
    } */
    else if (this.bankDetailsForm.controls.nameOnBank.invalid) {
      this.isNameOnBank = true;
      return;
    } else if (this.bankDetailsForm.controls.bankName.invalid) {
      this.isBankName = true;
      return;
    } else if (this.bankDetailsForm.controls.acNo.invalid) {
      this.isAcNo = true;
      return;
    } else if (this.bankDetailsForm.controls.ifscCode.invalid) {
      this.isIFSC = true;
      return;
    } else if (this.bankDetailsForm.controls.address.invalid) {
      this.isaddress = true;
      return;
    } else if (this.bankDetailsForm.controls.cityB.invalid) {
      this.isCity = true;
      return;
    } else if (this.bankDetailsForm.controls.stateB.invalid) {
      this.isState = true;
      return;
    } else if (this.bankDetailsForm.controls.pincodeB.invalid) {
      this.isZipCode = true;
      return;
    } else if (this.bankDetailsForm.controls.countryB.invalid) {
      this.isCountry = true;
      return;
    } else {
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
        gstin: this.profileDetailsForm.controls.gstinNum.value,
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
      console.log(obj);
      if (this.profileDetailsForm.controls.id.value == undefined) {
        this.subService.saveBillerProfileSettings(obj).subscribe(
          data => this.closeTab(data),
          error => this.eventService.showErrorMessage(error)
        );

      } else {
        this.subService.updateBillerProfileSettings(obj).subscribe(
          data => this.closeTab(data),
          error => this.eventService.showErrorMessage(error)
        );
      }

    }
  }
  getPostalRes(data) {
    console.log('data posta 123345566')
  }
  closeTab(data) {
    if (data == true) {
      this.Close(data);
      (this.profileDetailsForm.controls.id.value == undefined) ?
        this.eventService.openSnackBar('biller profile is added', 'OK') : this.eventService.openSnackBar('biller profile is edited', 'OK');


    }
  }

}
