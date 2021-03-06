import { Component, EventEmitter, Input, OnInit, Output, ViewChildren, QueryList } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { SubscriptionService } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription.service';
import { PostalService } from 'src/app/services/postal.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatInput } from '@angular/material';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { RoleService } from 'src/app/auth-service/role.service';

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
  disableBtn: boolean;
  clientName: any;
  accountTypes: any;
  ownerData: { Fmember: any; controleData: any; };
  nomineesListFM: any = [];
  callMethod: { methodName: string; ParamValue: any; disControl: any; };
  idData: any;
  keyInfoCapability: any = {};

  constructor(private cusService: CustomerService, private eventService: EventService,
    private fb: FormBuilder, private subInjectService: SubscriptionInject,
    private subService: SubscriptionService, private postalService: PostalService,
    private peopleService: PeopleService, private utilService: UtilService, public dialog: MatDialog,
    public enumDataService: EnumDataService,
    public roleService: RoleService) {
  }

  bankForm: FormGroup;
  isIfsc;
  isPostal;
  validatorType = ValidatorType;
  @Output() tabChange = new EventEmitter();
  @Output() saveNextData = new EventEmitter();
  @Output() cancelTab = new EventEmitter();
  @Output() refreshClientUploadBankDetails = new EventEmitter();
  @Output() tabDisableFlag = new EventEmitter();

  @Input() fieldFlag;

  @Input() set data(data) {
    this.userData = data;
    this.clientName = data.displayName;
    this.fieldFlag;
    this.idData = (this.fieldFlag != 'familyMember') ? this.userData.clientId : this.userData.familyMemberId;
  }

  toUpperCase(formControl, event) {
    this.utilService.toUpperCase(formControl, event);
    if (event.target.value.length < 11) {
      this.bankForm.get('bankName').enable();
      this.bankForm.get('branchCity').enable();
      this.bankForm.get('branchState').enable();
      this.bankForm.get('branchName').enable();
      this.bankForm.get('branchCountry').enable();
    }
    if (event.target.value.length == 11) {
      this.getBankAddress(event.target.value);
      return;
    }
  }

  getBankList(data) {
    const obj =
      [{
        userId: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? this.userData.clientId : this.userData.familyMemberId,
        userType: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3
      }];
    this.cusService.getBankList(obj).subscribe(
      data => {
        console.log(data);
        (data == 0) ? data = undefined : '';
        if (data && data.length > 0) {
          this.bankList = data[0];
          this.createBankForm(this.bankList);
        } else {
          this.bankList = {};
        }
      },
      err => {
        this.bankList = {};
      }
      // this.eventService.openSnackBar(err, "Dismiss")
    );
  }

  createBankForm(data) {
    (data == undefined) ? data = {} : data;
    this.bankForm = this.fb.group({
      ifscCode: [data.ifscCode, [Validators.required]],
      bankName: [data.bankName, [Validators.required]],
      micrName: [data.micrNo],
      accNumber: [data.accountNumber, [Validators.required]],
      accType: [(data.accountType) ? parseInt(data.accountType) : '', [Validators.required]],
      branchName: [data.branchName, [Validators.required]],
      branchCountry: [(data.address) ? data.address.country : ''],
      branchPinCode: [(data.address) ? data.address.pinCode : ''],
      branchAddressLine1: [(data.address) ? UtilService.removeSpecialCharactersFromString(data.address.address1) : ''],
      branchAddressLine2: [(data.address) ? UtilService.removeSpecialCharactersFromString(data.address.address2) : ''],
      branchCity: [(data.address) ? data.address.city : ''],
      branchState: [(data.address) ? data.address.state : ''],
      getNomineeName: this.fb.array([this.fb.group({
        name: [this.clientName ? this.clientName : '', [Validators.required]],
        sharePercentage: [0],
        familyMemberId: [],
        id: [0],
        clientId: [],
      })]),
    });

    if (data.holderNameList) {
      this.getNominee.removeAt(0);
      data.holderNameList.forEach(element => {
        this.addNewNominee(element);
      });
    }
    this.bankForm.setValue(this.bankForm.value, { emitEvent: false });
    this.bankForm.valueChanges.subscribe(data => {
      console.log(data);
    });
    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.bankForm };

  }

  selectHolder(data, index) {
    this.getNominee.controls[index].get('clientId').setValue(data.clientId);
    this.getNominee.controls[index].get('familyMemberId').setValue(data.familyMemberId);
  }

  get getNominee() {
    return this.bankForm.get('getNomineeName') as FormArray;
  }

  addNewNominee(data) {
    this.getNominee.push(this.fb.group({
      name: [data ? data.name : ''],
      sharePercentage: [data ? data.sharePercentage : 0],
      familyMemberId: [data ? data.familyMemberId : 0],
      id: [data ? data.id : 0],
      clientId: [data ? data.clientId : 0]
    }));
  }

  removeNewNominee(item) {
    this.disabledMember(null, null);
    this.getNominee.removeAt(item);
  }

  disabledMember(value, type) {
    this.callMethod = {
      methodName: 'disabledMember',
      ParamValue: value,
      disControl: type
    };
  }

  lisNominee(value) {
    this.ownerData.Fmember = value;
    this.nomineesListFM = Object.assign([], value);
  }

  ngOnInit() {
    this.createBankForm({});
    (this.userData.bankData) ? this.bankList = this.userData.bankData : '';
    if (this.userData.bankData == undefined && this.fieldFlag) {
      this.getBankList(this.userData);
    } else {
      (this.userData.bankData) ? this.bankList = this.userData.bankData : this.bankList = {};
      this.barButtonOptions.text = 'SAVE & CLOSE';
      this.createBankForm(this.userData.bankData);
    }
    this.keyInfoCapability = this.roleService.overviewPermission.subModules.profile.subModule.keyInfo.capabilityList
    this.accountTypes = this.enumDataService.getBankAccountTypes();
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
          this.isIfsc = false;
          this.bankForm.enable();
          this.bankForm.get('ifscCode').setErrors({ invalidIfsc: true });
          this.bankData(err);
        });
    }
  }

  bankData(data) {
    console.log(data, 'bank data');
    this.isIfsc = false;
    let address1, address2, pincode, adderessData;
    if (data.address) {
      data.address = UtilService.removeSpecialCharactersFromString(data.address);
      adderessData = data.address.trim();
      pincode = adderessData.match(/\d/g);
      pincode = pincode.join('');
      pincode = pincode.substring(pincode.length - 6, pincode.length);
      adderessData = adderessData.replace(pincode, '');
      const addressMidLength = adderessData.length / 2;
      address1 = adderessData.substring(0, addressMidLength);
      address2 = adderessData.substring(addressMidLength, adderessData.length);
      address1 = address1.concat(address2.substr(0, address2.indexOf(' ')));
      address1 = address1.replace(/,\s*$/, '');
      address2 = address2.substr(address2.indexOf(' '), address2.length);
      address2 = address2.replace(/[0-9]/g, '');
      // pincode = pincode.join("");
    }
    (data == undefined) ? data = {} : '';
    this.bankDetail = data;
    this.bankForm.get('bankName').setValue(data.bank);
    this.bankForm.get('branchCity').setValue(data.city);
    this.bankForm.get('branchState').setValue(data.state);
    this.bankForm.get('branchName').setValue(data.centre);
    this.bankForm.get('branchCountry').setValue('India');
    this.bankForm.get('branchAddressLine1').setValue(UtilService.removeSpecialCharactersFromString(address1));
    this.bankForm.get('branchAddressLine2').setValue(UtilService.removeSpecialCharactersFromString(address2));
    this.bankForm.get('branchPinCode').setValue(pincode);

    this.bankForm.get('bankName').disable();
    // this.bankForm.get('branchCity').disable();
    // this.bankForm.get('branchState').disable();
    // this.bankForm.get('branchName').disable();
    // this.bankForm.get('branchCountry').disable();

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
    this.isPostal = false;
    const pincodeData = (data == undefined) ? data = {} : data[0].PostOffice;
    this.bankForm.get('branchCity').setValue(pincodeData[0].District);
    this.bankForm.get('branchState').setValue(pincodeData[0].State);
    this.bankForm.get('branchCountry').setValue(pincodeData[0].Country);

    this.bankForm.get('branchCity').disable();
    this.bankForm.get('branchState').disable();
    this.bankForm.get('branchCountry').disable();
  }

  getHolderList(data) {
    console.log(data);
    this.holderList = data;
  }
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  saveNext(flag) {
    for (let element in this.bankForm.controls) {
      console.log(element)
      if (this.bankForm.get(element).invalid) {
        this.inputs.find(input => !input.ngControl.valid) ? this.inputs.find(input => !input.ngControl.valid).focus() : '';
        this.bankForm.controls[element].markAsTouched();
      }
    }
    if (this.bankForm.invalid) {
      this.bankForm.markAllAsTouched();
      return;
    } else {
      const holderList = [];
      this.bankForm.value.getNomineeName.forEach(element => {
        delete element.sharePercentage;
        holderList.push(element);
      });
      (flag == 'Save') ? this.barButtonOptions.active = true : this.disableBtn = true;
      (flag == 'Next') ? this.barButtonOptions1.active = true : this.disableBtn = true;
      const obj = {
        branchCode: (this.bankList) ? this.bankList.branchCode : this.bankDetail.branchCode,
        branchName: this.bankForm.get('branchName').value,
        bankName: this.bankForm.get('bankName').value,
        accountType: this.bankForm.get('accType').value,
        accountNumber: this.bankForm.get('accNumber').value,
        micrNo: this.bankForm.get('micrName').value,
        ifscCode: this.bankForm.get('ifscCode').value,
        address: {
          address1: UtilService.removeSpecialCharactersFromString(this.bankForm.get('branchAddressLine1').value),
          address2: UtilService.removeSpecialCharactersFromString(this.bankForm.get('branchAddressLine2').value),
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
          this.disableBtn = false;
          this.tabDisableFlag.emit(false);
          this.barButtonOptions.active = false;
          this.barButtonOptions1.active = false;
          if (flag == 'Next') {
            this.tabChange.emit(1);
            this.saveNextData.emit(true);
            this.refreshClientUploadBankDetails.emit(true);
          } else {
            this.closeAndSave();
          }
        },
        err => {
          this.disableBtn = false;
          this.eventService.openSnackBar(err, 'Dismiss');
          this.barButtonOptions1.active = false;
          this.barButtonOptions.active = false;
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
        this.peopleService.deleteBank(this.userData.bankData.bankId).subscribe(
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
