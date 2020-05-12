import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { PostalService } from 'src/app/services/postal.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-client-address',
  templateUrl: './client-address.component.html',
  styleUrls: ['./client-address.component.scss']
})
export class ClientAddressComponent implements OnInit {
  userData: any;
  addressType;
  addressList: any;
  addressData: void;
  proofType: string;
  isLoading: boolean;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE & CLOSE',
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
  permanentAddFlag: boolean;
  userMappingIdFlag: boolean;
  disableBtn = false;
  maxLength: number;
  proofTypeData: any;
  constructor(private cusService: CustomerService, private fb: FormBuilder,
    private subInjectService: SubscriptionInject, private postalService: PostalService,
    private peopleService: PeopleService, private eventService: EventService, private utilService: UtilService) {
  }

  addressForm;
  validatorType = ValidatorType;
  @Output() tabChange = new EventEmitter();
  @Input() fieldFlag;

  @Input() set data(data) {
    this.userData = data;
    (this.fieldFlag != 'familyMember' && this.userData.clientType == 1) ? this.permanentAddFlag = false : this.permanentAddFlag = true;
    (this.userData.addressData) ? this.addressList = this.userData.addressData : '';
    this.proofType = (this.userData.addressData) ? String(this.userData.addressData.addressType) : '1';
    if (this.userData.addressData == undefined && this.fieldFlag) {
      this.createAddressForm(null);
      this.getAddressList(data);
    } else {
      this.barButtonOptions.text = 'SAVE & CLOSE';
      this.createAddressForm(this.userData.addressData);
    }
  }

  ngOnInit() {
  }

  createAddressForm(data) {
    (data == undefined) ? data = {} : data;
    this.addressForm = this.fb.group({
      addressType: [(data.addressType) ? String(data.addressType) : '1'],
      addProofType: [(data.proofType) ? String(data.proofType) : ''],
      proofIdNum: [data.proofIdNumber, [Validators.required]],
      addressLine1: [data.address1, [Validators.required]],
      addressLine2: [data.address2],
      pinCode: [data.pinCode, [Validators.required]],
      city: [data.city, [Validators.required]],
      state: [data.state, [Validators.required]],
      country: [data.country, [Validators.required]]
    });
    this.changeAddrProofNumber({ value: String(data.proofType) }, data);
  }
  changeAddrProofNumber(data, addressData) {
    let regexPattern;
    (addressData) ? this.proofTypeData = addressData : ''
    if (data.value == '1') {
      regexPattern = this.validatorType.PASSPORT;
      this.maxLength = 8;
      this.addressForm.get('proofIdNum').setValue((this.proofTypeData.proofType == '1') ? this.proofTypeData.proofIdNumber : '');
    }
    else if (data.value == '2') {
      regexPattern = this.validatorType.ADHAAR;
      this.addressForm.get('proofIdNum').setValue((addressData) ? addressData.proofIdNumber : this.userData.aadhaarNumber);
      this.maxLength = 12;
    }
    else if (data.value == '3') {
      this.maxLength = 15;
      // regexPattern = this.validatorType.DRIVING_LICENCE
      this.addressForm.get('proofIdNum').setValue(this.proofTypeData.proofType == '3' ? this.proofTypeData.proofIdNumber : '');
    }
    else if (data.value == '4') {
      regexPattern = this.validatorType.VOTER_ID;
      this.maxLength = 10;
      this.addressForm.get('proofIdNum').setValue(this.proofTypeData.proofType == '4' ? this.proofTypeData.proofIdNumber : '');
    }
    else {
      this.maxLength = undefined
      this.addressForm.get('proofIdNum').setValue(addressData ? this.proofTypeData.proofIdNumber : '');
    }
    this.addressForm.get('proofIdNum').setValidators([(regexPattern) ? Validators.pattern(regexPattern) : Validators.required]);
    this.addressForm.get('proofIdNum').updateValueAndValidity();
  }

  toUpperCase(formControl, event) {
    event = this.utilService.toUpperCase(formControl, event);
  }

  getPostalPin(value) {
    if (value.length < 6) {
      this.addressForm.get('city').enable();
      this.addressForm.get('state').enable();
      this.addressForm.get('country').enable();
    }
    const obj = {
      zipCode: value
    };
    console.log(value, 'check value');
    if (value != '') {
      this.isLoading = true;
      this.postalService.getPostalPin(value).subscribe(data => {
        console.log('postal 121221', data);
        this.PinData(data);
      });
    }
  }

  PinData(data) {
    this.isLoading = false;
    const pincodeData = (data == undefined) ? data = {} : data[0].PostOffice;
    this.addressForm.get('city').setValue(pincodeData[0].District);
    this.addressForm.get('state').setValue(pincodeData[0].State);
    this.addressForm.get('country').setValue(pincodeData[0].Country);
    this.addressForm.get('city').disable();
    this.addressForm.get('state').disable();
    this.addressForm.get('country').disable();
  }

  getAddressList(data) {
    const obj = {
      userId: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? this.userData.clientId : this.userData.familyMemberId,
      userType: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3
    };
    this.cusService.getAddressList(obj).subscribe(
      data => {
        console.log(data);
        if (data && data.length > 0) {
          this.userMappingIdFlag = true;
          this.addressList = data[0];
          this.createAddressForm(this.addressList);
        }
        else {
          if (this.fieldFlag == 'familyMember') {
            const obj =
            {
              userId: this.userData.clientId,
              userType: 2
            }
            this.cusService.getAddressList(obj).subscribe(
              data => {
                if (data && data.length > 0) {
                  this.userMappingIdFlag = false;
                  this.addressList = data[0];
                  this.createAddressForm(this.addressList);
                }
              }
            )
          }
        }
      },
      err => {
        this.addressList = {};
      }
    );
  }

  addMore() {
    this.addressForm.reset();
  }

  saveNext(flag) {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    } else {
      (flag == 'Save') ? this.barButtonOptions.active = true : this.disableBtn = true;
      const obj = {
        address1: this.addressForm.get('addressLine1').value,
        address2: this.addressForm.get('addressLine2').value,
        address3: '',
        pinCode: this.addressForm.get('pinCode').value,
        city: this.addressForm.get('city').value,
        state: this.addressForm.get('state').value,
        stateId: '',
        country: this.addressForm.get('country').value,
        userId: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? this.userData.clientId : this.userData.familyMemberId,
        userType: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3,
        addressType: this.addressForm.get('addressType').value,
        proofType: this.addressForm.get('addProofType').value,
        proofIdNumber: this.addressForm.get('proofIdNum').value,
        userAddressMappingId: (this.userData.addressData) ? this.userData.addressData.userAddressMappingId : (this.addressList && this.userMappingIdFlag) ? this.addressList.userAddressMappingId : null,
        addressId: (this.userData.addressData) ? this.userData.addressData.addressId : (this.addressList) ? this.addressList.addressId : null
      };

      this.peopleService.addEditClientAddress(obj).subscribe(
        data => {
          this.disableBtn = false
          console.log(data);
          this.barButtonOptions.active = false;
          (flag == 'Next') ? this.tabChange.emit(1) : this.close('save');
        },
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
          this.barButtonOptions.active = false;
          this.disableBtn = false
        }
      );
    }
  }

  close(data) {
    (data == 'close') ? this.subInjectService.changeNewRightSliderState({ state: 'close' }) :
      this.subInjectService.changeNewRightSliderState({ state: 'close', clientData: data });
  }
}
