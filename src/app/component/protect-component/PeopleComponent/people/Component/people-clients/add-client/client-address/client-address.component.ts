import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, NgZone, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { PostalService } from 'src/app/services/postal.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatInput } from '@angular/material';
// import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps'
import { from } from 'rxjs';
import { RoleService } from 'src/app/auth-service/role.service';
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

  barButtonOptions1: MatProgressButtonOptions = {
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
  permanentAddFlag: boolean;
  userMappingIdFlag: boolean;
  disableBtn = false;
  maxLength: number;
  proofTypeData: any;
  firstTimeEditFlag = false;
  valueChanges: boolean;
  valueChangeFlag: any;
  @ViewChild('placeSearch', { static: true }) placeSearch: ElementRef;
  keyInfoCapability: any = {};
  constructor(private cusService: CustomerService, private fb: FormBuilder,
    private subInjectService: SubscriptionInject, private postalService: PostalService,
    private peopleService: PeopleService, private eventService: EventService,
    private utilService: UtilService, public dialog: MatDialog, private ngZone: NgZone,
    public roleService: RoleService) {
  }
  adressType: string;

  addressForm: FormGroup;
  validatorType = ValidatorType;
  @Output() tabChange = new EventEmitter();
  @Output() saveNextData = new EventEmitter();
  @Output() cancelTab = new EventEmitter();
  @Output() tabDisableFlag = new EventEmitter();
  @Input() fieldFlag;

  @Input() set data(data) {
    this.userData = data;
  }

  ngOnInit() {
    (this.fieldFlag != 'familyMember' && this.userData.clientType == 1) ? this.permanentAddFlag = false : this.permanentAddFlag = true;
    (this.userData.addressData) ? this.addressList = this.userData.addressData : '';
    this.proofType = (this.userData.addressData) ? String(this.userData.addressData.addressType) : '1';
    if (this.userData.addressData == undefined && this.fieldFlag) {
      this.createAddressForm(null);
      this.getAddressList(this.userData);
    } else {
      this.barButtonOptions.text = 'SAVE & CLOSE';
      this.createAddressForm(this.userData.addressData);
    }
    // this.mapApiLoader.load().then(() => {
    this.keyInfoCapability = this.roleService.overviewPermission.subModules.profile.subModule.keyInfo.capabilityList
    const autoCompelete = new google.maps.places.Autocomplete(this.placeSearch.nativeElement, {
      types: [this.addressType],
      componentRestrictions: { 'country': 'IN' }
    });

    autoCompelete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place: google.maps.places.PlaceResult = autoCompelete.getPlace();
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }
        // this.addressForm.get('addressLine2').setValue(place.formatted_address)
        const { firstLine, secondLine } = UtilService.formatGoogleGeneratedAddress(place.formatted_address);
        this.addressForm.get('addressLine2').setValue(UtilService.removeSpecialCharactersFromString(firstLine));
        this.addressForm.get('addressLine3').setValue(UtilService.removeSpecialCharactersFromString(secondLine));
        // this.addressForm.get('addressLine2').setValue(`${place.address_components[0].long_name},${place.address_components[2].long_name}`)
        this.getPincode(place.formatted_address)
        // console.log(place)
      })
      // })
    })
  }

  createAddressForm(data) {
    if (data == undefined) {
      data = {}
    } else {
      data.address1 = UtilService.removeSpecialCharactersFromString(data.address1);
      data.address2 = UtilService.removeSpecialCharactersFromString(data.address2);;
      data.address3 = UtilService.removeSpecialCharactersFromString(data.address3);;
      const { firstLine, secondLine, thirdLine } = UtilService.formatAddressInThreeLine(data.address1, data.address2, data.address3);
      data.address1 = firstLine;
      data.address2 = secondLine;
      data.address3 = thirdLine;
    };
    this.addressForm = this.fb.group({
      // addressType: [(data.addressType) ? String(data.addressType) : '1'],
      addProofType: [(this.userMappingIdFlag == false) ? '' : (data.proofType) ? String(data.proofType) : ''],
      proofIdNum: [(this.userMappingIdFlag == false) ? '' : data.proofIdNumber],
      addressLine1: [data.address1, [Validators.required]],
      addressLine2: [data.address2, [Validators.required]],
      addressLine3: [data.address3],
      pinCode: [data.pinCode, [Validators.required]],
      city: [data.city, [Validators.required]],
      state: [data.state, [Validators.required]],
      country: [data.country, [Validators.required]]
    });

    (data) ? this.proofTypeData = data : '';
    let regexPattern;
    if (data.proofType == '1') {
      regexPattern = this.validatorType.PASSPORT;
      this.maxLength = 8;
    } else if (data.proofType == '2') {
      regexPattern = this.validatorType.ADHAAR;
      this.maxLength = 12;
    } else if (data.proofType == '3') {
      this.maxLength = 15;
      // regexPattern = this.validatorType.DRIVING_LICENCE
    } else if (data.proofType == '4') {
      regexPattern = this.validatorType.VOTER_ID;
      this.maxLength = 10;
    } else {
      this.maxLength = undefined;
    }
    this.addressForm.valueChanges.subscribe(data => {
      if (this.valueChangeFlag) {
        this.tabDisableFlag.emit(true);
      }
    })
  }

  changeAddrProofNumber(data) {
    let regexPattern;
    this.userData.aadhaarNumber = (this.userData.aadhaarNumber == 0) ? null : this.userData.aadhaarNumber;
    if (this.firstTimeEditFlag) {
      this.proofTypeData.proofIdNumber = null;
    }
    if (data.value == '1') {
      regexPattern = this.validatorType.PASSPORT;
      this.maxLength = 8;
      this.addressForm.get('proofIdNum').setValue((this.proofTypeData.proofType == '1') ? this.proofTypeData.proofIdNumber : '');
    } else if (data.value == '2') {
      regexPattern = this.validatorType.ADHAAR;
      this.addressForm.get('proofIdNum').setValue(this.proofTypeData.proofType == undefined ? this.userData.aadhaarNumber : ((this.proofTypeData.proofType == 2 && this.proofTypeData.proofIdNumber == undefined) || this.userMappingIdFlag == false) ? this.userData.aadhaarNumber : (this.proofTypeData.proofIdNumber != 2 && this.userData.aadhaarNumber) ? this.userData.aadhaarNumber : this.proofTypeData.proofIdNumber);
      this.maxLength = 12;
    } else if (data.value == '3') {
      this.maxLength = 15;
      // regexPattern = this.validatorType.DRIVING_LICENCE
      this.addressForm.get('proofIdNum').setValue(this.proofTypeData.proofType == '3' ? this.proofTypeData.proofIdNumber : '');
    } else if (data.value == '4') {
      regexPattern = this.validatorType.VOTER_ID;
      this.maxLength = 10;
      this.addressForm.get('proofIdNum').setValue(this.proofTypeData.proofType == '4' ? this.proofTypeData.proofIdNumber : '');
    } else {
      this.maxLength = undefined;
      this.addressForm.get('proofIdNum').setValue(this.proofTypeData ? this.proofTypeData.proofIdNumber : '');
    }
    this.addressForm.get('proofIdNum').setValidators([(regexPattern) ? Validators.pattern(regexPattern) : null]);
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
      }, err => {
        this.isLoading = false;
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
    let addressLine3 = this.addressForm.get('addressLine3').value;
    addressLine3 = addressLine3.replace(data[0].PostOffice[0].District, '')
    addressLine3 = addressLine3.replace(data[0].PostOffice[0].State, '')
    addressLine3 = addressLine3.replace(data[0].PostOffice[0].Circle, '');
    addressLine3 = addressLine3.replace(data[0].PostOffice[0].Country, '');
    addressLine3 = addressLine3.replace(/,/g, '')
    this.addressForm.get('addressLine3').setValue(addressLine3)
    // this.addressForm.get('addressLine2').setValue(address1)
  }

  getPincode(data) {
    let pincode, addressData;
    addressData = data.trim();
    pincode = addressData.match(/\d/g);
    pincode = pincode ? pincode.join("") : '';
    pincode = pincode.substring(pincode.length - 6, pincode.length);
    this.addressForm.get('pinCode').setValue(pincode)
    const addressLine3Value = this.addressForm.get('addressLine3').value;
    this.addressForm.get('addressLine3').setValue(addressLine3Value.replace(pincode, ''));
    this.addressForm.get('addressLine2').setValue(this.addressForm.get('addressLine2').value.replace(pincode, ''));
    this.getPostalPin(pincode);
  }

  getAddressList(data) {
    const obj = {
      userId: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? this.userData.clientId : this.userData.familyMemberId,
      userType: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3
    };
    this.cusService.getAddressList(obj).subscribe(
      data => {
        console.log(data);
        this.valueChangeFlag = true
        if (data && data.length > 0) {
          this.userMappingIdFlag = true;
          this.addressList = data[0];
          this.valueChanges = true
          this.createAddressForm(this.addressList);
        } else {
          if (this.fieldFlag == 'familyMember') {
            const obj = {
              userId: this.userData.clientId,
              userType: 2
            };
            this.cusService.getAddressList(obj).subscribe(
              data => {
                this.valueChangeFlag = true
                if (data && data.length > 0) {
                  this.userMappingIdFlag = false;
                  this.addressList = data[0];
                  this.valueChanges = true;
                  this.createAddressForm(this.addressList);
                }
              }
            );
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
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  saveNext(flag) {
    this.addressForm.markAllAsTouched();
    for (let element in this.addressForm.controls) {
      console.log(element)
      if (this.addressForm.get(element).invalid) {
        this.inputs.find(input => !input.ngControl.valid) ? this.inputs.find(input => !input.ngControl.valid).focus() : '';
        this.addressForm.controls[element].markAsTouched();
        document.getElementById(element).scrollIntoView();
        return;
      }
    }
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    } else {
      (flag == 'Save') ? this.barButtonOptions.active = true : this.disableBtn = true;
      (flag == 'Next') ? this.barButtonOptions1.active = true : this.disableBtn = true;
      const obj = {
        address1: UtilService.removeSpecialCharactersFromString(this.addressForm.get('addressLine1').value),
        address2: UtilService.removeSpecialCharactersFromString(this.addressForm.get('addressLine2').value),
        address3: UtilService.removeSpecialCharactersFromString(this.addressForm.get('addressLine3').value),
        pinCode: this.addressForm.get('pinCode').value,
        city: this.addressForm.get('city').value,
        state: this.addressForm.get('state').value,
        stateId: '',
        country: this.addressForm.get('country').value,
        userId: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? this.userData.clientId : this.userData.familyMemberId,
        userType: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3,
        // addressType: this.addressForm.get('addressType').value,
        proofType: (this.addressForm.get('addProofType').value == '') ? undefined : this.addressForm.get('addProofType').value,
        proofIdNumber: this.addressForm.get('proofIdNum').invalid ? undefined : this.addressForm.get('proofIdNum').value,
        userAddressMappingId: (this.userData.addressData) ? this.userData.addressData.userAddressMappingId : (this.addressList && this.userMappingIdFlag) ? this.addressList.userAddressMappingId : undefined,
        addressId: (this.userData.addressData) ? this.userData.addressData.addressId : (this.addressList && this.userMappingIdFlag) ? this.addressList.addressId : undefined
      };

      this.peopleService.addEditClientAddress(obj).subscribe(
        data => {
          this.disableBtn = false;
          console.log(data);
          this.tabDisableFlag.emit(false);
          this.valueChangeFlag = true
          this.barButtonOptions.active = false;
          this.barButtonOptions1.active = false;
          if (flag == 'Next') {
            this.saveNextData.emit(true);
            this.tabChange.emit(1);
          } else {
            this.closeAndSave();
          }
        },
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
          this.barButtonOptions.active = false;
          this.barButtonOptions1.active = false;
          this.disableBtn = false;
        }
      );
    }
  }

  deleteModal(value) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.peopleService.deleteAddress(this.userData.addressData.addressId).subscribe(
          data => {
            dialogRef.close();
            this.closeAndSave();
          },
          err => {
            this.eventService.openSnackBar(err, 'Dismiss');
          }
        );
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  close(data) {
    (this.fieldFlag) ? this.cancelTab.emit('close') : (data == 'close' && this.fieldFlag == undefined) ? this.subInjectService.changeNewRightSliderState({ state: 'close' }) :
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
  }

  closeAndSave() {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
  }
}
