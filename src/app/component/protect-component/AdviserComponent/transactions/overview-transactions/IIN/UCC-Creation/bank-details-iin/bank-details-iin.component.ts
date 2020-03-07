import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { NomineeDetailsIinComponent } from '../nominee-details-iin/nominee-details-iin.component';

@Component({
  selector: 'app-bank-details-iin',
  templateUrl: './bank-details-iin.component.html',
  styleUrls: ['./bank-details-iin.component.scss']
})
export class BankDetailsIINComponent implements OnInit {

  bankDetails: any;
  inputData: any;
  holdingList: any;
  bankDetailList: any;

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
    private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.holdingList = data
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.getdataForm('')
  }
  close() {
    const fragmentData = {
      direction: 'top',
      componentName: BankDetailsIINComponent,
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
  getdataForm(data) {
    this.bankDetails = this.fb.group({
      ifscCode: [(!data) ? '' : data.inverstorType, [Validators.required]],
      bankName: [data ? '' : data.investorType2, [Validators.required]],
      micrCode: [data ? '' : data.pan, [Validators.required]],
      accountNumber: [data ? '' : data.nameAsPan, [Validators.required]],
      accountType: [data ? '' : data.madianName, [Validators.required]],
      branchCode: [data ? '' : data.madianName, [Validators.required]],
      firstHolder: [data ? '' : data.fatherSpouseName, [Validators.required]],
      branchName: [data ? '' : data.motherName, [Validators.required]],
      branchAdd1: [data ? '' : data.dateOfBirth, [Validators.required]],
      branchAdd2: [data ? '' : data.gender, [Validators.required]],
      branchPin: [data ? '' : data.gender, [Validators.required]],
      bankState: [data ? '' : data.maritalStatus, [Validators.required]],
      branchCity: [data ? '' : data.maritalStatus, [Validators.required]],
      branchCountry: [data ? '' : data.maritalStatus, [Validators.required]],
      branchProof: [data ? '' : data.maritalStatus, [Validators.required]],
      bankMandate: [data ? '' : data.maritalStatus, [Validators.required]],
      mandateDate: [data ? '' : data.maritalStatus, [Validators.required]],
      mandateAmount: [data ? '' : data.maritalStatus, [Validators.required]],
    });
  }
  getFormControl(): any {
    return this.bankDetails.controls;
  }
  openNomineeDetails(data) {
    const fragmentData = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: NomineeDetailsIinComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }
  saveBankDetails(value) {
    this.bankDetailList = []
    if(value == 'skip'){
      let address = {
        branchAdd1: this.bankDetails.controls.branchAdd1.value,
        branchAdd2: this.bankDetails.controls.branchAdd2.value,
        branchPin: this.bankDetails.controls.branchPin.value,
        bankState: this.bankDetails.controls.bankState.value,
        branchCity: this.bankDetails.controls.branchCity.value,
        branchCountry: this.bankDetails.controls.branchCountry.value,
        branchProof: this.bankDetails.controls.branchProof.value,
        bankMandate: this.bankDetails.controls.bankMandate.value,
        mandateDate: this.bankDetails.controls.mandateDate.value,
        mandateAmount: this.bankDetails.controls.mandateAmount.value,
      }
      let obj = {
        ifscCode: this.bankDetails.controls.ifscCode.value,
        accountNumber: this.bankDetails.controls.accountNumber.value,
        accountType: this.bankDetails.controls.accountType.value,
        branchName: this.bankDetails.controls.branchName.value,
        branchCode: this.bankDetails.controls.branchCode.value,
        bankName:this.bankDetails.controls.bankName.value,
        micrCode: this.bankDetails.controls.micrCode.value,
        firstHolder: this.bankDetails.controls.firstHolder.value,
        address : address
      }
    }
    if (this.bankDetails.get('ifscCode').invalid) {
      this.bankDetails.get('ifscCode').markAsTouched();
      return;
    } else if (this.bankDetails.get('bankName').invalid) {
      this.bankDetails.get('bankName').markAsTouched();
      return;
    } else if (this.bankDetails.get('micrCode').invalid) {
      this.bankDetails.get('micrCode').markAsTouched();
      return
    } else if (this.bankDetails.get('accountNumber').invalid) {
      this.bankDetails.get('accountNumber').markAsTouched();
      return;
    } else if (this.bankDetails.get('accountType').invalid) {
      this.bankDetails.get('accountType').markAsTouched();
      return;
    } else if (this.bankDetails.get('firstHolder').invalid) {
      this.bankDetails.get('firstHolder').markAsTouched();
      return;
    } else if (this.bankDetails.get('branchName').invalid) {
      this.bankDetails.get('branchName').markAsTouched();
      return;
    } else if (this.bankDetails.get('branchAdd1').invalid) {
      this.bankDetails.get('branchAdd1').markAsTouched();
      return;
    } else if (this.bankDetails.get('branchAdd2').invalid) {
      this.bankDetails.get('branchAdd2').markAsTouched();
      return;
    } else if (this.bankDetails.get('branchPin').invalid) {
      this.bankDetails.get('branchPin').markAsTouched();
      return;
    }  else if (this.bankDetails.get('bankState').invalid) {
      this.bankDetails.get('bankState').markAsTouched();
      return;
    } else if (this.bankDetails.get('branchCity').invalid) {
      this.bankDetails.get('branchCity').markAsTouched();
      return;
    } else if (this.bankDetails.get('branchCountry').invalid) {
      this.bankDetails.get('branchCountry').markAsTouched();
      return;
    } else if (this.bankDetails.get('branchProof').invalid) {
      this.bankDetails.get('branchProof').markAsTouched();
      return;
    }else if (this.bankDetails.get('bankMandate').invalid) {
      this.bankDetails.get('bankMandate').markAsTouched();
      return;
    } else if (this.bankDetails.get('mandateDate').invalid) {
      this.bankDetails.get('mandateDate').markAsTouched();
      return;
    } else if (this.bankDetails.get('mandateAmount').invalid) {
      this.bankDetails.get('mandateAmount').markAsTouched();
      return;
    } else {


      let address = {
        address1: this.bankDetails.controls.branchAdd1.value,
        address2: this.bankDetails.controls.branchAdd2.value,
        pinCode: this.bankDetails.controls.branchPin.value,
        state: this.bankDetails.controls.bankState.value,
        city: this.bankDetails.controls.branchCity.value,
        country: this.bankDetails.controls.branchCountry.value,
        branchProof: this.bankDetails.controls.branchProof.value,
        bankMandate: this.bankDetails.controls.bankMandate.value,
        mandateDate: this.bankDetails.controls.mandateDate.value,
        mandateAmount: this.bankDetails.controls.mandateAmount.value,
      }
      let obj = {
        ifscCode: this.bankDetails.controls.ifscCode.value,
        accountNumber: this.bankDetails.controls.accountNumber.value,
        accountType: this.bankDetails.controls.accountType.value,
        bankName:this.bankDetails.controls.bankName.value,
        branchName: this.bankDetails.controls.branchName.value,
        branchCode: this.bankDetails.controls.branchCode.value,
        micrCode: this.bankDetails.controls.micrCode.value,
        firstHolder: this.bankDetails.controls.firstHolder.value,
        address : address
      }
      this.bankDetailList.push(obj)
      const test = {
        holderList: this.holdingList.holderList,
        bankDetailList: this.bankDetailList,
        ownerName: this.holdingList.ownerName,
        holdingNature: this.holdingList.holdingNature,
        taxStatus: this.holdingList.taxStatus,
      }
      console.log('bank details', test)
      this.openNomineeDetails(test);
     
    }
  }
}
