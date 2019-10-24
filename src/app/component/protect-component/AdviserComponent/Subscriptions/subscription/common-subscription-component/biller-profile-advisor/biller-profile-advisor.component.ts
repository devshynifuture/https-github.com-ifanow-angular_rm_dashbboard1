import {Component, OnInit, Input} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-biller-profile-advisor',
  templateUrl: './biller-profile-advisor.component.html',
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
  isCountry  = false;
  isZipCode = false;
  isTaxable = false;
  isFootNote = false;
  isaddress = false;
  isTerms = false;
  isBankName = false;
  selected = 0;

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder, private subService: SubscriptionService) {
    this.subInjectService.singleProfileData.subscribe(
      data => this.getSingleBillerProfileData(data)
    );
  }

  @Input() Selected;

  ngOnInit() {

  }
  getFormControl() {
    return this.billerProfileForm.controls;
  }
  getFrormControlProfile(){
    return this.billerProfileForm.controls.profileDetailsForm.controls;
  }
  getFrormControlBank(){
    return this.billerProfileForm.controls.bankDetailsForm.controls;
  }
  getFrormControlMisc(){
    return this.billerProfileForm.controls.MiscellaneousData.controls;
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  getSingleBillerProfileData(data) {
    if(data == ""){
    data = {}
    }
    this.billerProfileForm = this.fb.group({
      profileDetailsForm: this.fb.group({
        gstinNum: [(data.gstin),[Validators.required]],
        panNum: [(data.pan),[Validators.required]],
        Address: [(data.billerAddress),[Validators.required]],
        state: [(data.state),[Validators.required]],
        zipCode: [(data.zipCode),[Validators.required]],
        country: [(data.country ),[Validators.required]],
        city: [(data.city),[Validators.required]]
      }),
      bankDetailsForm: this.fb.group({
        nameOnBank: [(data.nameAsPerBank),[Validators.required]],
        bankName: [(data.bankName),[Validators.required]],
        acNo: [(data.acNumber),[Validators.required]],
        ifscCode: [(data.ifscCode),[Validators.required]],
        address: [(data.bankCity),[Validators.required]],
        state: [(data.state),[Validators.required]],
        pincode: [(data.bankZipCode),[Validators.required]],
        city:[(data.city),Validators.required],
        country: [(data.country),[Validators.required]],
      }),
      MiscellaneousData: this.fb.group({
        footnote: [(data.footnote),[Validators.required]],
        terms: [(data.terms),[Validators.required]]
      })
    });
    this.getFrormControlProfile().gstinNum.maxLength = 15;
    this.getFrormControlProfile().panNum.maxLength = 10;
    this.getFrormControlProfile().Address.maxLength = 150;
    this.getFrormControlBank().nameOnBank.maxLength = 25;
    this.getFrormControlBank().bankName.maxLength = 35;
    this.getFrormControlBank().acNo.maxLength = 16;
    this.getFrormControlBank().ifscCode.maxLength = 11;
    this.getFrormControlBank().address.maxLength = 150;
    this.getFrormControlMisc().footnote.maxLength = 150;
    this.getFrormControlMisc().terms.maxLength = 150;
    
  }

  Close(value) {
    this.subInjectService.rightSideData(value);
  }

  nextStep(value, eventName) {
    this.selected = value;
    if (eventName === 'Save&Next') {
      (this.selected < 3) ? this.selected++ : this.submitBillerForm();
    }
    if (this.billerProfileForm.controls.profileDetailsForm.controls) {
      console.log();
    }
  }

  submitBillerForm() {
    if (this.billerProfileForm.controls.profileDetailsForm.controls.gstinNum.invalid) {
      this.isGstin = true
      return;
    }else if (this.billerProfileForm.controls.profileDetailsForm.controls.panNum.invalid) {
      this.isPanNum = true
      return;
    }else if (this.billerProfileForm.controls.profileDetailsForm.controls.Address.invalid) {
      this.isAddress = true
      return;
    }else if (this.billerProfileForm.controls.profileDetailsForm.controls.city.invalid) {
      this.isCity = true
      return;
    }else if (this.billerProfileForm.controls.profileDetailsForm.controls.state.invalid) {
      this.isState = true
      return;
    }else if (this.billerProfileForm.controls.profileDetailsForm.controls.country.invalid) {
      this.isCountry = true
      return;
    }else if (this.billerProfileForm.controls.profileDetailsForm.controls.pincode.invalid) {
      this.isZipCode = true
      return;
    }else if (this.billerProfileForm.controls.bankDetailsForm.controls.acNo.invalid) {
      this.isAcNo = true
      return;
    }else if (this.billerProfileForm.controls.bankDetailsForm.controls.nameOnBank.invalid) {
      this.isNameOnBank = true
      return;
    }else if (this.billerProfileForm.controls.bankDetailsForm.controls.address.invalid) {
      this.isaddress = true
      return;
    }else if (this.billerProfileForm.controls.bankDetailsForm.controls.ifscCode.invalid) {
      this.isIFSC = true
      return;
    }else if (this.billerProfileForm.controls.bankDetailsForm.controls.city.invalid) {
      this.isCity = true
      return;
    }else if (this.billerProfileForm.controls.bankDetailsForm.controls.state.invalid) {
      this.isState = true
      return;
    }else if (this.billerProfileForm.controls.bankDetailsForm.controls.country.invalid) {
      this.isCountry = true
      return;
    }else if (this.billerProfileForm.controls.bankDetailsForm.controls.pincode.invalid) {
      this.isZipCode = true
      return;
    }else if (this.billerProfileForm.controls.bankDetailsForm.controls.bankName.invalid) {
      this.isBankName = true
      return;
    }else{
      const obj = {
        acNumber: this.billerProfileForm.controls.bankDetailsForm.controls.acNo.value,
        advisorId: 2735,
        bankCity: this.billerProfileForm.controls.bankDetailsForm.controls.address.value,
        bankCountry: this.billerProfileForm.controls.bankDetailsForm.controls.country.value,
        bankName: this.billerProfileForm.controls.bankDetailsForm.controls.bankName.value,
        bankState: this.billerProfileForm.controls.bankDetailsForm.controls.state.value,
        bankZipCode: this.billerProfileForm.controls.bankDetailsForm.controls.pincode.value,
        billerAddress: this.billerProfileForm.controls.profileDetailsForm.controls.Address.value,
        branchAddress: this.billerProfileForm.controls.bankDetailsForm.controls.address.value,
        city: this.billerProfileForm.controls.profileDetailsForm.controls.city.value,
        company_display_name: 'stringfgdfg',
        companyName: 'stringname',
        country: this.billerProfileForm.controls.profileDetailsForm.controls.country.value,
        footnote: this.billerProfileForm.controls.MiscellaneousData.controls.footnote.value,
        gstin: this.billerProfileForm.controls.profileDetailsForm.controls.gstinNum.value,
        ifscCode: this.billerProfileForm.controls.bankDetailsForm.controls.ifscCode.value,
        logoUrl: 'www.google.com',
        nameAsPerBank: this.billerProfileForm.controls.bankDetailsForm.controls.nameOnBank.value,
        pan: this.billerProfileForm.controls.profileDetailsForm.controls.panNum.value,
        state: this.billerProfileForm.controls.profileDetailsForm.controls.state.value,
        terms: this.billerProfileForm.controls.MiscellaneousData.controls.terms.value,
        zipCode: this.billerProfileForm.controls.profileDetailsForm.controls.zipCode.value
      };
      console.log(obj);
      this.subService.updateBillerProfileSettings(obj).subscribe(
        data => console.log(data)
      );
      this.subService.saveBillerProfileSettings(obj).subscribe(
        data => console.log(data)
      );
    }
  }
}
