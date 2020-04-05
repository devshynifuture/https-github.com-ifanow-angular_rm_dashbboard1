import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ValidatorType } from 'src/app/services/util.service';
import { SubscriptionService } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription.service';
import { PostalService } from 'src/app/services/postal.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';

@Component({
  selector: 'app-client-bank',
  templateUrl: './client-bank.component.html',
  styleUrls: ['./client-bank.component.scss']
})
export class ClientBankComponent implements OnInit {
  bankDetail: any;
  userData: any;
  holderList: any;
  bankList: any;

  constructor(private cusService: CustomerService, private eventService: EventService,
    private fb: FormBuilder, private subInjectService: SubscriptionInject,
    private subService: SubscriptionService, private postalService: PostalService,
    private peopleService: PeopleService) {
  }

  bankForm;
  validatorType = ValidatorType;
  @Output() tabChange = new EventEmitter();
  @Input() fieldFlag;

  @Input() set data(data) {
    this.userData = data;
    this.fieldFlag;
    this.createBankForm(data);
    (this.userData.bankData == undefined) ? this.getBankList(data) : this.createBankForm(data);

  }
  getBankList(data) {
    let obj =
    {
      "userId": (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? this.userData.clientId : this.userData.familyMemberId,
      "userType": (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3
    }
    this.cusService.getDematList(obj).subscribe(
      data => {
        console.log(data);
        this.bankList = data;
      }, err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  createBankForm(data) {
    (data == undefined) ? data = {} : data;
    this.bankForm = this.fb.group({
      ifscCode: [, [Validators.required]],
      bankName: [, [Validators.required]],
      micrName: [, [Validators.required]],
      accNumber: [, [Validators.required]],
      accType: ['1', [Validators.required]],
      branchName: [, [Validators.required]],
      branchCountry: [, [Validators.required]],
      branchPinCode: [, [Validators.required]],
      branchAddressLine1: [, [Validators.required]],
      branchAddressLine2: [, [Validators.required]],
      branchCity: [, [Validators.required]],
      branchState: [, [Validators.required]]
    });
  }

  ngOnInit() {
    this.createBankForm(null);
  }

  getBankAddress(ifsc) {
    const obj = {
      ifsc
    };
    console.log('ifsc 121221', obj);

    if (ifsc != '') {
      this.subService.getBankAddress(obj).subscribe(data => {
        console.log('postal 121221', data);
        this.bankData(data);
        // this.PinData(data, 'bankDetailsForm')

      },
        err => {
          console.log(err, 'error internet');
          this.bankData(err);
        });
    }
  }

  bankData(data) {
    (data == undefined) ? data = {} : '';
    console.log(data, 'bank data');
    this.bankDetail = data;
    this.bankForm.get('bankName').setValue(data.bank);
    this.bankForm.get('branchCity').setValue(data.city);
    this.bankForm.get('branchState').setValue(data.state);
    this.bankForm.get('branchPinCode').setValue(data.state);
    this.bankForm.get('branchName').setValue(data.centre);
    this.bankForm.get('branchCountry').setValue('India');
    this.bankForm.get('branchAddressLine1').setValue(data.address);
  }

  getPostalPin(value) {
    const obj = {
      zipCode: value
    };
    console.log(value, 'check value');
    if (value != '') {
      this.postalService.getPostalPin(value).subscribe(data => {
        console.log('postal 121221', data);
        this.PinData(data);
      });
    }
  }

  PinData(data) {
    const pincodeData = (data == undefined) ? data = {} : data[0].PostOffice;
    this.bankForm.get('branchCity').setValue(pincodeData[0].District);
    this.bankForm.get('branchState').setValue(pincodeData[0].State);
    this.bankForm.get('branchCountry').setValue(pincodeData[0].Country);
  }

  getHolderList(data) {
    console.log(data);
    this.holderList = data;
  }

  saveNext(flag) {
    if (this.bankForm.invalid) {
      this.bankForm.markAllAsTouched();
      return;
    } else {
      const holderList = [];
      if (this.holderList) {
        this.holderList.controls.forEach(element => {
          holderList.push({
            name: element.get('name').value,
            id: element.get('id').value,
          });
        });
      }
      const obj = {
        branchCode: '',
        branchName: this.bankForm.get('branchName').value,
        bankName: this.bankForm.get('bankName').value,
        accountType: this.bankForm.get('accType').value,
        accountNumber: this.bankForm.get('accNumber').value,
        micrNo: this.bankForm.get('micrName').value,
        ifscCode: this.bankForm.get('ifscCode').value,
        address: {
          address1: this.bankForm.get('branchAddressLine1').value,
          address2: this.bankForm.get('branchAddressLine2').value,
          address3: '',
          pinCode: this.bankForm.get('branchPinCode').value,
          city: this.bankForm.get('branchCity').value,
          state: this.bankForm.get('branchState').value,
          country: this.bankForm.get('branchCountry').value
        },
        userId: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? this.userData.clientId : this.userData.familyMemberId,
        userType: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3,
        minorAccountHolderName: 'sarvesh',
        guardianAccountHolderName: 'chetan',
        userBankMappingId: (this.userData.bankData) ? this.userData.bankData : null,
        bankId: (this.userData.bankData) ? this.userData.bankData : null,
        addressId: (this.userData.bankData) ? this.userData.bankData : null
      };
      this.peopleService.addEditClientBankDetails(obj).subscribe(
        data => {
          console.log(data);
          (flag == 'Next') ? this.tabChange.emit(1) : this.close();
        },
        err => this.eventService.openSnackBar(err, 'Dismiss')
      );
    }
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
