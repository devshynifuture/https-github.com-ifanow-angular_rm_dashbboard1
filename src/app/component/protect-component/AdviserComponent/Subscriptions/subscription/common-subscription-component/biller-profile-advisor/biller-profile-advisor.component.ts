import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {AuthService} from '../../../../../../../auth-service/authService';
import {EventService} from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-biller-profile-advisor',
  templateUrl: './biller-profile-advisor.component.html',
  // templateUrl: './invoice-pdf.html',
  styleUrls: ['./biller-profile-advisor.component.scss']
})
export class BillerProfileAdvisorComponent implements OnInit {


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


  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder, private subService: SubscriptionService,
              private eventService: EventService) {
    // this.subInjectService.singleProfileData.subscribe(
    //   data => this.getSingleBillerProfileData(data)
    // );
  }

  @Input() Selected;

  @Input()
  set data(data) {
    this.inputData = data;
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
    return this.billerProfileForm.controls;
  }

  getFormControlProfile() {
    return this.profileDetailsForm.controls;
  }

  getFrormControlBank() {
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

  public onChange(fileList: FileList): void {
    /* let file = fileList[0];
     let fileReader: FileReader = new FileReader();

     fileReader.onloadend = function(x) {
       this.imgUrl=fileReader.result
         }*/
  }

  getSingleBillerProfileData(data) {
    if (data == '') {
      data = {};
    }
    this.display = data;
    this.profileDetailsForm = this.fb.group({
      gstinNum: [(data.gstin), [Validators.required]],
      panNum: [(data.pan), [Validators.required]],
      Address: [(data.billerAddress), [Validators.required]],
      state: [(data.state), [Validators.required]],
      pincode: [(data.zipCode), [Validators.required]],
      country: [(data.country), [Validators.required]],
      city: [(data.city), [Validators.required]],
      id: [data.id]
    }),
      this.logUrl = this.fb.group({
        url: [data, [Validators.required]]
      });
    this.bankDetailsForm = this.fb.group({
      nameOnBank: [(data.nameAsPerBank), [Validators.required]],
      bankName: [(data.bankName), [Validators.required]],
      acNo: [(data.acNumber), [Validators.required]],
      ifscCode: [(data.ifscCode), [Validators.required]],
      address: [(data.bankCity), [Validators.required]],
      state: [(data.state), [Validators.required]],
      pincode: [(data.bankZipCode), [Validators.required]],
      city: [(data.city), Validators.required],
      country: [(data.country), [Validators.required]],
    }),
      this.MiscellaneousData = this.fb.group({
        footnote: [(data.footnote), [Validators.required]],
        terms: [(data.terms), [Validators.required]]
      });
    this.getFormControlProfile().gstinNum.maxLength = 15;
    this.getFormControlProfile().panNum.maxLength = 10;
    this.getFormControlProfile().Address.maxLength = 150;
    this.getFrormControlBank().nameOnBank.maxLength = 25;
    this.getFrormControlBank().bankName.maxLength = 35;
    this.getFrormControlBank().acNo.maxLength = 16;
    this.getFrormControlBank().ifscCode.maxLength = 11;
    this.getFrormControlBank().address.maxLength = 150;
    this.getFrormControlMisc().footnote.maxLength = 150;
    this.getFrormControlMisc().terms.maxLength = 150;
  }

  Close(data) {
    // this.subInjectService.rightSideData(value);
    this.subInjectService.changeNewRightSliderState({state: 'close', data});
  }

  nextStep(value, eventName) {

    (this.profileDetailsForm.valid) ? this.selected = 1 : console.log('please fill profile Data');
    (this.logUrl.valid) ? this.selected = 2 : console.log('url is required');
    (this.bankDetailsForm.valid) ? this.selected = 3 : console.log('bank details required');
    (this.MiscellaneousData.valid) ? this.submitBillerForm() : console.log('miscellaneous required');
  }

  submitBillerForm() {
    if (this.profileDetailsForm.controls.gstinNum.invalid) {
      this.isGstin = true;
      return;
    } else if (this.profileDetailsForm.controls.panNum.invalid) {
      this.isPanNum = true;
      return;
    } else if (this.profileDetailsForm.controls.Address.invalid) {
      this.isAddress = true;
      return;
    } else if (this.profileDetailsForm.controls.city.invalid) {
      this.isCity = true;
      return;
    } else if (this.profileDetailsForm.controls.state.invalid) {
      this.isState = true;
      return;
    } else if (this.profileDetailsForm.controls.country.invalid) {
      this.isCountry = true;
      return;
    } else if (this.profileDetailsForm.controls.pincode.invalid) {
      this.isZipCode = true;
      return;
    } else if (this.bankDetailsForm.controls.acNo.invalid) {
      this.isAcNo = true;
      return;
    } else if (this.bankDetailsForm.controls.nameOnBank.invalid) {
      this.isNameOnBank = true;
      return;
    } else if (this.bankDetailsForm.controls.address.invalid) {
      this.isaddress = true;
      return;
    } else if (this.bankDetailsForm.controls.ifscCode.invalid) {
      this.isIFSC = true;
      return;
    } else if (this.bankDetailsForm.controls.city.invalid) {
      this.isCity = true;
      return;
    } else if (this.bankDetailsForm.controls.state.invalid) {
      this.isState = true;
      return;
    } else if (this.bankDetailsForm.controls.country.invalid) {
      this.isCountry = true;
      return;
    } else if (this.bankDetailsForm.controls.pincode.invalid) {
      this.isZipCode = true;
      return;
    } else if (this.bankDetailsForm.controls.bankName.invalid) {
      this.isBankName = true;
      return;
    } else {
      const obj = {
        acNumber: this.bankDetailsForm.controls.acNo.value,
        advisorId: this.advisorId,
        bankCity: this.bankDetailsForm.controls.address.value,
        bankCountry: this.bankDetailsForm.controls.country.value,
        bankName: this.bankDetailsForm.controls.bankName.value,
        bankState: this.bankDetailsForm.controls.state.value,
        bankZipCode: this.bankDetailsForm.controls.pincode.value,
        billerAddress: this.profileDetailsForm.controls.Address.value,
        branchAddress: this.bankDetailsForm.controls.address.value,
        city: this.profileDetailsForm.controls.city.value,
        companyDisplayName: 'stringfgdfg',
        companyName: 'stringname',
        country: this.profileDetailsForm.controls.country.value,
        footnote: this.MiscellaneousData.controls.footnote.value,
        gstin: this.profileDetailsForm.controls.gstinNum.value,
        ifscCode: this.bankDetailsForm.controls.ifscCode.value,
        logoUrl: 'www.google.com',
        nameAsPerBank: this.bankDetailsForm.controls.nameOnBank.value,
        pan: this.profileDetailsForm.controls.panNum.value,
        state: this.profileDetailsForm.controls.state.value,
        terms: this.MiscellaneousData.controls.terms.value,
        zipCode: this.profileDetailsForm.controls.pincode.value,
        id: this.profileDetailsForm.controls.id.value
      };
      console.log(obj);
      if (this.profileDetailsForm.controls.id.value == undefined) {
        this.subService.saveBillerProfileSettings(obj).subscribe(
          data => this.closeTab(data)
        );

      } else {
        this.subService.updateBillerProfileSettings(obj).subscribe(
          data => this.closeTab(data)
        );
      }

    }
  }

  closeTab(data) {
    if (data == true) {
      this.Close(data);
      this.eventService.openSnackBar('biller profile is added', 'OK');

    }
  }

}
