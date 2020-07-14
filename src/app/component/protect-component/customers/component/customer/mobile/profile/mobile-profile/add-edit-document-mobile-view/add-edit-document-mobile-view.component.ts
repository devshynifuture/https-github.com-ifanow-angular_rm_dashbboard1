import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { CustomerService } from '../../../../customer.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { PostalService } from 'src/app/services/postal.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-add-edit-document-mobile-view',
  templateUrl: './add-edit-document-mobile-view.component.html',
  styleUrls: ['./add-edit-document-mobile-view.component.scss']
})
export class AddEditDocumentMobileViewComponent implements OnInit {

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
  };
  permanentAddFlag: boolean;
  userMappingIdFlag: boolean;
  disableBtn = false;
  maxLength: number;
  proofTypeData: any;
  firstTimeEditFlag = false;

  constructor(private cusService: CustomerService, private fb: FormBuilder,
    private subInjectService: SubscriptionInject, private postalService: PostalService,
    private peopleService: PeopleService, private eventService: EventService,
    private utilService: UtilService, public dialog: MatDialog) {
  }

  addressForm;
  validatorType = ValidatorType;
  @Output() backFunc = new EventEmitter();
  @Input() set data(data) {
    this.userData = data;
    // (this.fieldFlag != 'familyMember' && this.userData.clientType == 1) ? this.permanentAddFlag = false : this.permanentAddFlag = true;
    (this.userData.addressData) ? this.addressList = this.userData.addressData : '';
    this.proofType = (this.userData.addressData) ? String(this.userData.addressData.addressType) : '1';
    if (this.userData.addressData == undefined) {
      this.createAddressForm(null);
    } else {
      this.createAddressForm(this.userData.addressData);
    }
  }

  ngOnInit() {
  }

  createAddressForm(data) {
    (data == undefined) ? data = {} : data;
    this.addressForm = this.fb.group({
      // addressType: [(data.addressType) ? String(data.addressType) : '1'],
      addProofType: [(data.proofType) ? String(data.proofType) : ''],
      proofIdNum: [data.proofIdNumber],
      addressLine1: [data.address1, [Validators.required]],
      addressLine2: [data.address2],
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
    // this.changeAddrProofNumber({ value: String(data.proofType) });
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

  addMore() {
    this.addressForm.reset();
  }

  saveNext() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    } else {
      // (flag == 'Save') ? this.barButtonOptions.active = true : this.disableBtn = true;
      const obj = {
        address1: this.addressForm.get('addressLine1').value,
        address2: this.addressForm.get('addressLine2').value,
        address3: '',
        pinCode: this.addressForm.get('pinCode').value,
        city: this.addressForm.get('city').value,
        state: this.addressForm.get('state').value,
        stateId: '',
        country: this.addressForm.get('country').value,
        userId: this.userData.familyMemberId,
        userType: 3,
        // addressType: this.addressForm.get('addressType').value,
        proofType: isNaN(this.addressForm.get('addProofType').value) ? undefined : this.addressForm.get('addProofType').value,
        proofIdNumber: this.addressForm.get('proofIdNum').invalid ? undefined : this.addressForm.get('proofIdNum').value,
        userAddressMappingId: (this.userData.addressData) ? this.userData.addressData.userAddressMappingId : undefined,
        addressId: (this.userData.addressData) ? this.userData.addressData.addressId : undefined
      };

      this.peopleService.addEditClientAddress(obj).subscribe(
        data => {
          this.disableBtn = false;
          console.log(data);
          this.barButtonOptions.active = false;
          this.back();
        },
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
          this.barButtonOptions.active = false;
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
            // this.closeAndSave();
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

  back() {
    this.backFunc.emit(undefined);
  }
}

