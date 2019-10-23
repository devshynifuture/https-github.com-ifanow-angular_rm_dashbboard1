import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {FormBuilder} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {AuthService} from "../../../../../../../auth-service/authService";

@Component({
  selector: 'app-biller-profile-advisor',
  templateUrl: './biller-profile-advisor.component.html',
  styleUrls: ['./biller-profile-advisor.component.scss']
})
export class BillerProfileAdvisorComponent implements OnInit {


  billerProfileForm: any;
  selected = 0;
  advisorId;

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder, private subService: SubscriptionService) {
    this.subInjectService.singleProfileData.subscribe(
      data => this.getSingleBillerProfileData(data)
    );
  }

  @Input() Selected;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
  }

  getFormControl() {
    return this.billerProfileForm.controls;
  }

  getSingleBillerProfileData(data) {
    if (data == "") {
      data = {}
    }
    this.billerProfileForm = this.fb.group({
      profileDetailsForm: this.fb.group({
        gstinNum: [(data.gstin == undefined) ? "" : data.gstin],
        panNum: [(data.pan == undefined) ? "" : data.pan],
        Address: [(data.billerAddress == undefined) ? "" : data.billerAddress],
        state: [(data.state == undefined) ? "" : data.state],
        zipCode: [(data.zipCode == undefined) ? "" : data.zipCode],
        country: [(data.country == undefined) ? "" : data.country],
        city: [(data.city == undefined) ? "" : data.city]
      }),
      bankDetailsForm: this.fb.group({
        nameOnBank: [(data == undefined) ? "" : data.nameAsPerBank],
        bankName: [(data == undefined) ? "" : data.bankName],
        acNo: [(data == undefined) ? "" : data.acNumber],
        ifscCode: [(data == undefined) ? "" : data.ifscCode],
        address: [(data == undefined) ? "" : data.bankCity],
        state: [(data == undefined) ? "" : data.state],
        pincode: [(data == undefined) ? "" : data.bankZipCode],
        country: [(data == undefined) ? "" : data.country]
      }),
      MiscellaneousData: this.fb.group({
        footnote: [(data == undefined) ? "" : data.footnote],
        terms: [(data == undefined) ? "" : data.terms]
      })
    });
    this.getFormControl().gstinNum.maxLength = 15;
    this.getFormControl().panNum.maxLength = 10;
    this.getFormControl().Address.maxLength = 150;
    this.getFormControl().nameOnBank.maxLength = 25;
    this.getFormControl().bankName.maxLength = 35;
    this.getFormControl().acNo.maxLength = 16;
    this.getFormControl().ifscCode.maxLength = 11;
    this.getFormControl().address.maxLength = 150;
    this.getFormControl().footnote.maxLength = 150;
    this.getFormControl().terms.maxLength = 150;

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
    const obj = {
      acNumber: this.billerProfileForm.controls.bankDetailsForm.controls.acNo.value,
      advisorId: this.advisorId,
      // advisorId: 2735,
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
