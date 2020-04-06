import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {ValidatorType} from 'src/app/services/util.service';
import {PostalService} from 'src/app/services/postal.service';
import {PeopleService} from 'src/app/component/protect-component/PeopleComponent/people.service';
import {EventService} from 'src/app/Data-service/event.service';
import {CustomerService} from 'src/app/component/protect-component/customers/component/customer/customer.service';

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

  constructor(private cusService: CustomerService, private fb: FormBuilder,
    private subInjectService: SubscriptionInject, private postalService: PostalService,
    private peopleService: PeopleService, private eventService: EventService) {
  }

  addressForm;
  validatorType = ValidatorType;
  @Output() tabChange = new EventEmitter();
  @Input() fieldFlag;

  @Input() set data(data) {
    this.userData = data;
    (this.userData.addressData) ? this.addressList = this.userData.addressData : ''
    this.proofType = (this.userData.addressData) ? String(this.userData.addressData.addressType) : '1';
    if (this.userData.addressData == undefined) {
      this.createAddressForm(null);
      this.getAddressList(data);
    }
    else {
      this.createAddressForm(this.userData.addressData);
    }
  }

  ngOnInit() {
  }

  createAddressForm(data) {
    (data == undefined) ? data = {} : data;
    this.addressForm = this.fb.group({
      addressType: [(data.addressType) ? String(data.addressType) : '1', [Validators.required]],
      addProofType: [(data.proofType) ? String(data.proofType) : '1', [Validators.required]],
      proofIdNum: [data.proofIdNumber, [Validators.required]],
      addressLine1: [data.address1, [Validators.required]],
      addressLine2: [data.address2, [Validators.required]],
      pinCode: [data.pinCode, [Validators.required]],
      city: [data.city, [Validators.required]],
      state: [data.state, [Validators.required]],
      country: [data.country, [Validators.required]]
    });
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
    this.addressForm.get('city').setValue(pincodeData[0].District);
    this.addressForm.get('state').setValue(pincodeData[0].State);
    this.addressForm.get('country').setValue(pincodeData[0].Country);
  }

  getAddressList(data) {
    const obj = {
      userId: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? this.userData.clientId : this.userData.familyMemberId,
      userType: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3
    };
    this.cusService.getAddressList(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          this.addressList = data[0];
          this.createAddressForm(this.addressList)
        }
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
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
        userAddressMappingId: (this.userData.addressData) ? this.userData.addressData.userAddressMappingId : (this.addressList) ? this.addressList.userAddressMappingId : null,
        addressId: (this.userData.addressData) ? this.userData.addressData.addressId : (this.addressList) ? this.addressList.addressId : null
      };

      this.peopleService.addEditClientAddress(obj).subscribe(
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
