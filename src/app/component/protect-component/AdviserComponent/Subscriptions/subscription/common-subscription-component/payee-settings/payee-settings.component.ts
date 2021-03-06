import { Component, EventEmitter, Input, OnInit, Output, ViewChildren, QueryList, ViewChild, ElementRef, NgZone } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionService } from '../../../subscription.service';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { PostalService } from 'src/app/services/postal.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { MatInput } from '@angular/material';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { element } from 'protractor';
import { } from 'googlemaps'

@Component({
  selector: 'app-payee-settings',
  templateUrl: './payee-settings.component.html',
  styleUrls: ['./payee-settings.component.scss']
})
export class PayeeSettingsComponent implements OnInit {
  validatorType = ValidatorType
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
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  clientId: any;
  @Output() totalPayeeData = new EventEmitter<Object>();
  settingsModal;
  payeeSettingsForm;
  sendData;
  updatedData: any;
  inputData: any;
  @Output() closeAddPayee = new EventEmitter();
  @Output() getEditData = new EventEmitter();
  @ViewChild('placeSearch', { static: true }) placeSearch: ElementRef;

  obj = [
    {
      id: null,
      subscriptionId: 12,
      clientBillerId: 7,
      share: 25,
      createdDate: '2000-02-22',
      lastupdatedDate: '2000-03-23',
      isActive: 1
    },
    {
      id: null,
      subscriptionId: 12,
      clientBillerId: 25,
      share: 5,
      createdDate: '2000-02-22',
      lastupdatedDate: '2000-03-23',
      isActive: 1
    },
    {
      id: null,
      subscriptionId: 12,
      clientBillerId: 55,
      share: 5,
      createdDate: '2000-02-22',
      lastupdatedDate: '2000-03-23',
      isActive: 1
    },
    {
      id: null,
      subscriptionId: 12,
      clientBillerId: 75,
      share: 5,
      createdDate: '2000-02-22',
      lastupdatedDate: '2000-03-23',
      isActive: 1
    }
  ];
  advisorId: any;
  family: any;
  familyMemberId: any;
  showGstin: boolean = false;
  clientData: any;
  isLoader: boolean;
  sendObj: any;
  addressList: any;
  selectedCustomerData: any;
  customerDataFlag: any;
  payeeList: any;

  constructor(public utils: UtilService, public subInjectService: SubscriptionInject, private eventService: EventService,
    private ngZone: NgZone, private subService: SubscriptionService, private fb: FormBuilder, private postalService: PostalService, private peopleService: PeopleService, private custumService: CustomerService) {
  }

  get data() {
    return this.inputData;
  }

  @Input()
  set data(data) {
    this.payeeList = data.payeesList
    this.inputData = data;
    if (!this.inputData.flag) {
      delete data.id;
    }
    // this.clientId = AuthService.getClientId()
    this.getClientPayeeSettings(data);
    this.getListFamilyMem();

    const autoCompelete = new google.maps.places.Autocomplete(this.placeSearch.nativeElement, {
      types: [],
      componentRestrictions: { 'country': 'IN' }
    });

    autoCompelete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place: google.maps.places.PlaceResult = autoCompelete.getPlace();
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }
        this.payeeSettingsForm.get('billingAddress').setValue(place.formatted_address)
        // this.addressForm.get('addressLine2').setValue(`${place.address_components[0].long_name},${place.address_components[2].long_name}`)
        this.getPincode(place.formatted_address)
        // console.log(place)
      })
      // })
    })
  }

  OnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();


  }


  getPincode(data) {
    let pincode, addressData;
    addressData = data.trim();
    pincode = addressData.match(/\d/g);
    pincode = pincode.join("");
    pincode = pincode.substring(pincode.length - 6, pincode.length);
    this.payeeSettingsForm.get('pincode').setValue(pincode)
    this.getPostalPin(pincode);
  }
  getListFamilyMem() {
    this.advisorId = AuthService.getAdvisorId();
    // this.clientId = AuthService.getClientId();
    const obj = {
      clientId: !this.inputData.flag ? this.clientData.clientId : this.clientData.id
    };
    this.peopleService.getClientFamilyMemberListAsset(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }

  pinInvalid: boolean = false;

  getPostalPin(value) {
    this.isLoader = true
    let obj = {
      zipCode: value
    }
    if (value != "") {
      this.postalService.getPostalPin(value).subscribe(data => {
        this.PinData(data)
      })
    }
    else {
      this.isLoader = false;
      this.pinInvalid = false;
    }
  }
  getAddressList(data) {
    if (data.clientId || data.familyMemberId) {
      const obj = {
        userId: data.userType == 2 ? data.clientId : data.familyMemberId,
        userType: data.userType
      };
      this.custumService.getAddressList(obj).subscribe(
        responseData => {
          let address = responseData[0];
          if (address) {
            // this.selectedCustomerData['address'] = address
            // this.addressList.billerAddress = address.address1;
            // this.addressList.zipCode = address.pinCode;
            // this.addressList.city = address.city;
            // this.addressList.country = address.country;
            // this.addressList.state = address.state;
            this.setCustomerAddressDetails(address);
          }
          this.customerDataFlag = false;
          this.setCustomerDetails(this.selectedCustomerData);
          // this.getClientPayeeSettings(this.addressList);
        },
        err => {
          this.customerDataFlag = false;
          this.setCustomerDetails(this.selectedCustomerData);
        }
      );
    }

  }
  getClientOrFamilyDetails(data) {
    this.addressList = {};
    this.customerDataFlag = true;
    let clientData = data;
    if (data.userType == 2) {
      this.sendObj = {
        clientId: data.clientId,
      };
      this.peopleService.getClientOrLeadData(this.sendObj).subscribe(
        data => {
          this.selectedCustomerData = data;
          if (this.selectedCustomerData.emailList.length > 0) {
            this.selectedCustomerData.email = this.selectedCustomerData.emailList[0].email;
          }
          if (this.selectedCustomerData.mobileList.length > 0) {
            this.selectedCustomerData.primaryContact = this.selectedCustomerData.mobileList[0].mobileNo;
          }
          this.getAddressList(clientData);
          // this.getClientPayeeSettings(this.addressList);
        },
        err => {
          this.addressList = {};
        }
      );
    } else {
      this.sendObj = {
        familyMemberId: data.familyMemberId,
      };
      this.custumService.getFamilyMembers(this.sendObj).subscribe(
        data => {
          this.selectedCustomerData = data[0];
          if (this.selectedCustomerData.emailList.length > 0) {
            this.selectedCustomerData.email = this.selectedCustomerData.emailList[0].email;
          }
          if (this.selectedCustomerData.mobileList.length > 0) {
            this.selectedCustomerData.primaryContact = this.selectedCustomerData.mobileList[0].mobileNo;
          }
          this.getAddressList(clientData);
          // this.getClientPayeeSettings(this.addressList);
        },
        err => {
          console.error(err);
        }
      );
    }
  }
  setCustomerDetails(data) {
    this.payeeSettingsForm.controls.displayName.setValue(data.displayName);
    this.payeeSettingsForm.controls.emailId.setValue(data.email);
    this.payeeSettingsForm.controls.primaryContact.setValue(data.primaryContact);
    this.payeeSettingsForm.controls.pan.setValue(data.pan);
  }
  setCustomerAddressDetails(data) {
    this.payeeSettingsForm.controls.billingAddress.setValue(data.address1);
    this.payeeSettingsForm.controls.city.setValue(data.city);
    this.payeeSettingsForm.controls.state.setValue(data.state);
    this.payeeSettingsForm.controls.country.setValue(data.country);
    this.payeeSettingsForm.controls.pincode.setValue(data.pinCode);
  }
  PinData(data) {
    if (data[0].Status == "Error") {
      this.pinInvalid = true;
      this.isLoader = false;
      this.getFormControl().pincode.setErrors(this.pinInvalid);
      this.getFormControl().city.setValue("");
      this.getFormControl().country.setValue("");
      this.getFormControl().state.setValue("");

    }
    else {
      this.isLoader = false;
      this.getFormControl().city.setValue(data[0].PostOffice[0].District);
      this.getFormControl().country.setValue(data[0].PostOffice[0].Country);
      this.getFormControl().state.setValue(data[0].PostOffice[0].Circle);
      this.getFormControl().city.disable();
      this.getFormControl().country.disable();
      this.getFormControl().state.disable();
      let address1 = this.payeeSettingsForm.get('billingAddress').value;
      let pincodeFlag = address1.includes(`${this.payeeSettingsForm.get('pincode').value},`)
      address1 = address1.replace(`${this.payeeSettingsForm.get('city').value},`, '')
      address1 = address1.replace(!pincodeFlag ? `${this.payeeSettingsForm.get('state').value},` : this.payeeSettingsForm.get('state').value, '')
      address1 = address1.replace(this.payeeSettingsForm.get('country').value, '');
      address1 = address1.replace(pincodeFlag ? `${this.payeeSettingsForm.get('pincode').value},` : this.payeeSettingsForm.get('pincode').value, '')
      this.payeeSettingsForm.get('billingAddress').setValue(address1)
      this.pinInvalid = false;
    }
  }


  gstTreatmentRemove(value) {
    if (value == 4) {
      this.getFormControl().gstIn.setValidators([Validators.required, Validators.pattern("^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$")]);
      this.showGstin = true;
    }
    else {
      this.getFormControl().gstIn.clearValidators();
      this.getFormControl().gstIn.updateValueAndValidity();
      // this.getFormControl().gstIn.setValidators();
      this.showGstin = false;
    }
  }

  getListOfFamilyByClientRes(data) {
    if (data != undefined) {
      if (this.payeeList) {
        data.forEach(element => {
          if (this.payeeList.some(payee => payee.familyMemberId == element.familyMemberId)) {
            element['disableFlag'] = true;
          }
          else {
            element['disableFlag'] = false;
          }
        });
      }
      this.family = data
    }
  }
  getOwnerName(data) {
    this.familyMemberId = data.familyMemberId
    this.getClientOrFamilyDetails(data);
    // this.payeeSettingsForm.controls.emailId.setValue(data.email);
    // this.payeeSettingsForm.controls.pan.setValue(data.pan);
    // this.payeeSettingsForm.controls.displayName.setValue(data.displayName);
    // this.payeeSettingsForm.controls
  }
  getFormControl() {
    return this.payeeSettingsForm.controls;
  }

  getClientPayeeSettings(data) {
    (data == 'Add') ? data = {} : data
    this.clientData = data.clientData ? data.clientData : data;
    this.payeeSettingsForm = this.fb.group({
      customerName: [data.name ? data.name : '', [Validators.required]],
      displayName: [data.companyDisplayName, [Validators.required]],
      customerType: [(data.customerTypeId) ? data.customerTypeId : '', [Validators.required]],
      companyName: [data.companyName],
      emailId: [data.email, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      primaryContact: [data.primaryContact, [Validators.required]],
      pan: [data.pan, [Validators.required, Validators.pattern("^[A-Za-z]{5}[0-9]{4}[A-z]{1}")]],
      gstTreatment: [data.gstTreatmentId ? data.gstTreatmentId : '', [Validators.required]],
      gstIn: [data.gstin],
      billingAddress: [data.billingAddress, [Validators.required]],
      city: [data.city, [Validators.required]],
      state: [data.state, [Validators.required]],
      country: [data.country, [Validators.required]],
      pincode: [data.zipCode, [Validators.required, Validators.minLength(6)]],
      id: [data.id]
    });
    this.getFormControl().customerName.maxLength = 50;
    this.getFormControl().displayName.maxLength = 40;
    this.getFormControl().companyName.maxLength = 50;
    this.getFormControl().emailId.maxLength = 40;
    this.getFormControl().primaryContact.maxLength = 10;
    this.getFormControl().pan.maxLength = 10;
    this.getFormControl().gstIn.maxLength = 16;
    this.getFormControl().billingAddress.maxLength = 150;
    this.getFormControl().pincode.maxLength = 6;
    data.id ? this.payeeSettingsForm.controls.customerName.disable() : '';
    this.familyMemberId = data.familyMemberId;
  }

  toUpperCase(formControl, event) {
    this.utils.toUpperCase(formControl, event);
  }

  getRightSliderData(data) {
    this.settingsModal = data;
  }


  ngOnInit() {
    this.getChangePayeeSetting();
  }

  getChangePayeeSetting() {
    this.subService.changePayeeSetting(this.obj).subscribe(
      data => this.changePayeeSettingData(data)
    );
  }

  changePayeeSettingData(data) {
  }

  Close(data) {
    // this.subInjectService.rightSliderData(state)
    // this.subInjectService.rightSideData(state);
    if (!this.inputData.flag) {
      this.closeAddPayee.emit(false);
    }
    else {
      this.subInjectService.changeNewRightSliderState({ state: 'close', data });
    }
  }

  savePayeeSettings() {
    // this.familyMemberId = (this.clientData.familyMemberId) ? this.clientData.familyMemberId : this.clientData.id
    // this.inputData
    if (this.payeeSettingsForm.invalid) {
      // for (let element in this.payeeSettingsForm.controls) {
      //   if (this.payeeSettingsForm.get(element).invalid) {
      //     this.inputs.find(input => !input.ngControl.valid).focus();
      //     this.payeeSettingsForm.controls[element].markAsTouched();
      //   }
      // }
      this.payeeSettingsForm.markAllAsTouched();
      return;
    } else {
      this.barButtonOptions.active = true;
      if (this.payeeSettingsForm.controls.id.value != undefined) {
        const obj1 = {
          customerName: this.payeeSettingsForm.controls.customerName.value,
          city: this.payeeSettingsForm.controls.city.value,
          clientBillerId: 1,
          companyDisplayName: this.payeeSettingsForm.controls.displayName.value,
          familyMemberId: this.familyMemberId,
          companyName: this.payeeSettingsForm.controls.companyName.value,
          country: this.payeeSettingsForm.controls.country.value,
          currency: 'string',
          customerTypeId: this.payeeSettingsForm.controls.customerType.value,
          email: this.payeeSettingsForm.controls.emailId.value,
          gstTreatmentId: this.payeeSettingsForm.controls.gstTreatment.value,
          gstin: (this.payeeSettingsForm.controls.gstIn.value == null) ? 0 : this.payeeSettingsForm.controls.gstIn.value,
          payeeTypeId: 1,
          paymentTermsId: 1,
          billerAddress: this.payeeSettingsForm.controls.billingAddress.value,
          primaryContact: this.payeeSettingsForm.controls.primaryContact.value,
          state: this.payeeSettingsForm.controls.state.value,
          pan: this.payeeSettingsForm.controls.pan.value,
          zipCode: this.payeeSettingsForm.controls.pincode.value,
          id: this.payeeSettingsForm.controls.id.value,
          clientId: !this.inputData.flag ? this.clientData.clientId : this.clientData.id
        };
        this.sendData = obj1;
        this.subService.editPayeeSettings(obj1).subscribe(
          data => {
            this.editSettingResData(data)
          },
          err => {
            this.eventService.openSnackBar(err, "Dismiss");
          }
        );

      } else {

        const obj = {
          customerName: this.getFormControl().customerName.value,
          gstin: (this.getFormControl().gstIn.value == null) ? 0 : this.payeeSettingsForm.controls.gstIn.value,
          familyMemberId: this.familyMemberId,
          gstTreatmentId: this.payeeSettingsForm.controls.gstTreatment.value,
          email: this.getFormControl().emailId.value,
          // customerTypeId: (this.getFormControl().customerType.value == 'Business') ? '1' : '2',
          customerTypeId: this.getFormControl().customerType.value,
          primaryContact: this.getFormControl().primaryContact.value,
          companyName: this.getFormControl().companyName.value,
          companyDisplayName: this.getFormControl().displayName.value,
          billerAddress: this.getFormControl().billingAddress.value,
          city: this.getFormControl().city.value,
          state: this.getFormControl().state.value,
          pan: this.getFormControl().pan.value,
          country: this.getFormControl().country.value,
          zipCode: this.getFormControl().pincode.value,
          // clientId: !this.inputData.flag ? this.clientData.clientId : this.clientData.id
          clientId: (this.clientData.clientId) ? this.clientData.clientId : this.clientData.id
        };
        this.subService.addClientBillerProfile(obj).subscribe(
          data => {
            this.addClientBillerProfileRes(data);
          },
          err => {
            this.eventService.openSnackBar(err, "Dismiss");
          }
        );

      }
    }

  }

  addClientBillerProfileRes(data) {
    this.barButtonOptions.active = false;

    // if (this.inputData.data == "Add") {
    //   // this.totalPayeeData.emit(true)obj=
    //   let obj = {
    //     data: data,
    //     flag: true
    //   }
    //   this.subInjectService.addEvent(obj)
    //   this.subInjectService.changeNewRightSliderState({ state: 'close', data });
    //   this.eventService.openSnackBar('Client profile added Successfully', 'OK');
    // } else {
    if (this.inputData.flag) {
      this.updatedData = data;
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
      this.eventService.openSnackBar('Client profile added successfully', 'OK');
    }
    this.Close(data);
    // }
  }

  editSettingResData(data) {
    this.barButtonOptions.active = false;
    if (data.status == 1) {
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
      this.eventService.openSnackBar('Client profile update successfully', 'OK');
      this.getEditData.emit(this.sendData);
      this.Close(data);
    }
  }

  // closeTab(data) {
  //   // if (data.status == 1) {
  //   this.Close(data);
  //   // }
  // }
}
