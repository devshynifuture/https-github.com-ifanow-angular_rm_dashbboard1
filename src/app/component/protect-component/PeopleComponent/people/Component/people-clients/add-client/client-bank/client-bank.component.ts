import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ValidatorType, UtilService } from 'src/app/services/util.service';
import { SubscriptionService } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription.service';
import { PostalService } from 'src/app/services/postal.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

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
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  constructor(private cusService: CustomerService, private eventService: EventService,
    private fb: FormBuilder, private subInjectService: SubscriptionInject,
    private subService: SubscriptionService, private postalService: PostalService,
    private peopleService: PeopleService) {
  }

  bankForm;
  isIfsc;
  isPostal;
  validatorType = ValidatorType;
  @Output() tabChange = new EventEmitter();
  @Input() fieldFlag;

  @Input() set data(data) {
    this.userData = data;
    this.fieldFlag;
    this.createBankForm(data);
    (this.userData.bankData) ? this.bankList = this.userData.bankData : '';
    if (this.userData.bankData == undefined && this.fieldFlag) {
      this.getBankList(data)
    }
    else {
      (this.userData.bankData) ? this.bankList = this.userData.bankData : this.bankList = {}
      this.barButtonOptions.text = "SAVE & CLOSE";
      this.createBankForm(this.userData.bankData);
    }
  }
  toUpperCase(event) {
    event = UtilService.toUpperCase(event);
    if (event.target.value.length == 11) {
      this.getBankAddress(event.target.value);
      return;
    }
  }
  getBankList(data) {
    let obj =
    {
      "userId": (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? this.userData.clientId : this.userData.familyMemberId,
      "userType": (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3
    }
    this.cusService.getBankList(obj).subscribe(
      data => {
        console.log(data);
        if (data && data.length > 0) {
          this.bankList = data[0];
          this.createBankForm(this.bankList)
        }
      },
      err => {
        this.bankList = {};
      }
      // this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  createBankForm(data) {
    (data == undefined) ? data = {} : data;
    this.bankForm = this.fb.group({
      ifscCode: [data.ifscCode, [Validators.required]],
      bankName: [data.bankName, [Validators.required]],
      micrName: [data.micrNo],
      accNumber: [data.accountNumber, [Validators.required]],
      accType: [(data.accountType) ? data.accountType : '1', [Validators.required]],
      branchName: [data.branchName, [Validators.required]],
      branchCountry: [(data.address) ? data.address.country : '', [Validators.required]],
      branchPinCode: [(data.address) ? data.address.pinCode : '', [Validators.required]],
      branchAddressLine1: [(data.address) ? data.address.address1 : '', [Validators.required]],
      branchAddressLine2: [(data.address) ? data.address.address2 : '', [Validators.required]],
      branchCity: [(data.address) ? data.address.city : '', [Validators.required]],
      branchState: [(data.address) ? data.address.state : '', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  getBankAddress(ifsc) {
    const obj = {
      ifsc
    };
    console.log('ifsc 121221', obj);

    if (ifsc != '') {
      this.isIfsc = true;
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
    console.log(data, 'bank data');
    this.isIfsc = false;
    let address1, address2, pincode, adderessData;
    if (data.address) {
      adderessData = data.address.trim();
      pincode = adderessData.substring(adderessData.length - 6);
      adderessData = adderessData.replace(pincode, '');
      let addressMidLength = adderessData.length / 2;
      address1 = adderessData.substring(0, addressMidLength);
      address2 = adderessData.substring(addressMidLength, adderessData.length);
      address1 = address1.concat(address2.substr(0, address2.indexOf(' ')));
      address2 = address2.concat(address2.substr(address2.indexOf(' '), address2.length))
      // pincode = pincode.join("");
    }
    (data == undefined) ? data = {} : '';
    this.bankDetail = data;
    this.bankForm.get('bankName').setValue(data.bank);
    this.bankForm.get('branchCity').setValue(data.city);
    this.bankForm.get('branchState').setValue(data.state);
    this.bankForm.get('branchName').setValue(data.centre);
    this.bankForm.get('branchCountry').setValue('India');
    this.bankForm.get('branchAddressLine1').setValue(adderessData);
    this.bankForm.get('branchAddressLine2').setValue(address2);
    this.bankForm.get('branchPinCode').setValue(pincode)
  }

  getPostalPin(value) {
    const obj = {
      zipCode: value
    };
    console.log(value, 'check value');
    if (value != '') {
      this.isPostal = true;
      this.postalService.getPostalPin(value).subscribe(data => {
        console.log('postal 121221', data);
        this.PinData(data);
      });
    }
  }

  PinData(data) {
    this.isPostal = false
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
      this.holderList.markAllAsTouched();
      return;
    }
    else {
      const holderList = [];
      if (this.holderList) {
        this.holderList.controls.forEach(element => {
          holderList.push({
            name: element.get('name').value,
            id: element.get('id').value,
          });
        });
      }
      this.barButtonOptions.active = true;
      const obj = {
        branchCode: (this.bankList) ? this.bankList.branchCode : this.bankDetail.branchCode,
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
          country: this.bankForm.get('branchCountry').value,
          addressId: (this.userData.bankData) ? this.userData.bankData.address.addressId : (this.bankList.address) ? this.bankList.address.addressId : null
        },
        userId: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? this.userData.clientId : this.userData.familyMemberId,
        userType: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3,
        minorAccountHolderName: (this.userData.id) ? '' : null,
        guardianAccountHolderName: (this.userData.id) ? '' : null,
        holderNameList: holderList,
        userBankMappingId: (this.userData.bankData) ? this.userData.bankData.userBankMappingId : (this.bankList) ? this.bankList.userBankMappingId : null,
        bankId: (this.userData.bankData) ? this.userData.bankData.bankId : (this.bankList) ? this.bankList.bankId : null,
        addressId: (this.userData.bankData) ? this.userData.bankData.address.addressId : (this.bankList.address) ? this.bankList.address.addressId : null
      };
      this.peopleService.addEditClientBankDetails(obj).subscribe(
        data => {
          console.log(data);
          this.barButtonOptions.active = false;
          (flag == 'Next') ? this.tabChange.emit(1) : this.close();
        },
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
          this.barButtonOptions.active = false;
        }
      );
    }
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
