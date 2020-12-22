import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { OnlineTransactionService } from '../../../../online-transaction.service';
import { PostalService } from 'src/app/services/postal.service';
import { ProcessTransactionService } from '../../../doTransaction/process-transaction.service';
import { FatcaDetailsInnComponent } from '../fatca-details-inn/fatca-details-inn.component';
import { MatInput } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-nominee-details-iin',
  templateUrl: './nominee-details-iin.component.html',
  styleUrls: ['./nominee-details-iin.component.scss']
})
export class NomineeDetailsIinComponent implements OnInit {

  pinInvalid = false;

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
    public authService: AuthService,
    private onlineTransact: OnlineTransactionService, private postalService: PostalService,
    private processTransaction: ProcessTransactionService, private custumService: CustomerService,
    private peopleService: PeopleService,
    private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) {
    this.advisorId = AuthService.getAdvisorId();
  }

  get data() {
    return this.inputData;
  }

  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  logoText = 'Your Logo here';
  validatorType = ValidatorType;
  nomineeDetails: any;
  inputData: any;
  nomineeList: any;
  holderList: any;
  bankDetailList: any;
  firstHolderNominee: any;
  secondHolderNominee: any;
  thirdHolderNominee: any;
  holder = {
    type: 'first',
    data: ''
  };
  changedValue: string;
  doneData: any;
  familyMemberList: any;
  advisorId: any;
  nomineeFmList: any;
  addressList: any;
  isLoading = false;
  maxDate = new Date();
  // maxDateForAdultDob;
  countryList;
  filterCountryName: Observable<any[]>;
  activeDetailsClass = 'first';

  @Input()
  set data(data) {
    this.inputData = data;
    console.log('Data in nominee detail : ', data);
    this.doneData = {};
    this.doneData.bank = true;
    this.doneData.contact = true;
    this.doneData.personal = true;
    this.doneData.nominee = false;
    if (data && data.nomineeList) {
      this.firstHolderNominee = data.nomineeList[0];
      if (data.nomineeList.length > 1) {
        this.secondHolderNominee = data.nomineeList[1];
      }
      if (data.nomineeList.length > 2) {
        this.thirdHolderNominee = data.nomineeList[2];
      }
      this.getdataForm(this.firstHolderNominee);
    } else {
    }
    if (this.inputData && !this.firstHolderNominee) {
      this.getNomineeList(this.inputData.holderList[0], !this.firstHolderNominee);
    }
  }

  ngOnInit() {
    // this.maxDateForAdultDob = new Date();

    if (this.firstHolderNominee) {
      this.getdataForm(this.firstHolderNominee);
    } else {
      this.getdataForm('');
    }
    // if (this.clientData) {
    //   this.getFamilyMembersList(this.clientData, !this.firstHolderNominee);
    // }
    this.processTransaction.getCountryCodeList().subscribe(responseValue => {
      this.countryList = responseValue;
    });
  }

  close() {
    this.changedValue = 'close';
    const fragmentData = {
      direction: 'top',
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }

  onChange(value) {

    if (value.checked == true) {
      this.nomineeDetails.controls.address1.setValue((this.inputData.holderList[0].address1) ?
        this.inputData.holderList[0].address1 : this.inputData.holderList[0].address.address1);
      this.nomineeDetails.controls.address2.setValue((this.inputData.holderList[0].address2)
        ? this.inputData.holderList[0].address2 : this.inputData.holderList[0].address.address2);
      this.nomineeDetails.controls.pinCode.setValue((this.inputData.holderList[0].pinCode) ?
        this.inputData.holderList[0].pinCode : this.inputData.holderList[0].address.pinCode);
      this.nomineeDetails.controls.city.setValue((this.inputData.holderList[0].city) ?
        this.inputData.holderList[0].city : this.inputData.holderList[0].address.city);
      this.nomineeDetails.controls.state.setValue((this.inputData.holderList[0].state) ?
        this.inputData.holderList[0].state : this.inputData.holderList[0].address.state);
      this.nomineeDetails.controls.country.setValue((this.inputData.holderList[0].country) ?
        this.inputData.holderList[0].country : this.inputData.holderList[0].address.country);
    }
  }

  capitalise(event) {
    if (event.target.value != '') {
      event.target.value = event.target.value.replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  selectRelation(value) {
    // if (value.value != 'Son' && value.value != 'Daughter') {
    //   this.maxDateForAdultDob = moment().subtract(18, 'years');
    // } else {
    //   this.maxDateForAdultDob = new Date();
    // }
  }

  getNomineeList(data, shouldSetValue) {
    const obj = {
      userId: data.userType == 2 ? data.clientId : data.familyMemberId,
      userType: data.userType
    };
    this.peopleService.getClientFamilyMembers(obj).subscribe(
      responseData => this.getListOfFamilyByClientRes(responseData, shouldSetValue)
    );
  }

  getListOfFamilyByClientRes(data, shouldSetValue) {
    this.nomineeFmList = data;
    // this.nomineeFmList = this.nomineeFmList.filter(element => element.familyMemberId != this.inputData.holderList[0].familyMemberId);
  }

  selectedNominee(value) {
    this.getAddressList(value);
  }

  getAddressList(data) {
    this.addressList = data;
    this.addressList.address = {};
    const obj = {
      userId: data.userType == 2 ? data.clientId : data.familyMemberId,
      userType: data.userType
    };
    this.custumService.getAddressList(obj).subscribe(
      data => {
        //  this.addressList = this.firstHolderContact
        this.addressList.address = data[0];
        this.getdataForm(this.addressList);
      },
      err => {
        this.addressList = {};
      }
    );
  }

  getFamilyMembersList(data, shouldSelectData) {
    const obj = {
      clientId: data.clientId,
      id: 0
    };
    this.custumService.getFamilyMembers(obj).subscribe(
      data => {
        this.familyMemberList = data;
        this.familyMemberList = this.utils.calculateAgeFromCurrentDate(data);
        this.firstHolderNominee = this.familyMemberList[1];
        this.secondHolderNominee = this.familyMemberList[2];
        this.getdataForm(this.firstHolderNominee);
      },
      err => {
        console.error(err);
      }
    );
  }

  getdataForm(data) {
    if (!data) {
      data = {
        address: {}
      };
    } else if (!data.address) {
      data.address = {};
    }
    this.nomineeDetails = this.fb.group({
      name: [(!data) ? '' : (data.name) ? data.name : data.name, [Validators.required]],
      relationShip: [(data.relationShip) ? data.relationShip : (data.relationshipId) ? data.relationshipId + '' : '', [Validators.required]],
      type: [!data ? '1' : (data.type) ? data.type + '' : '1', [Validators.required]],
      dob: [!data ? '' : (data.dob) ? new Date(data.dob) : new Date(data.dateOfBirth), [Validators.required]],
      // percent: 100,
      percent: [!data.percent ? '100' : data.percent, [Validators.required, Validators.min(0), Validators.max(100)]],
      addressType: [(data.address.addressType) ? data.address.addressType : 'Residential', [Validators.required]],
      address1: [!data.address ? '' : data.address.address1, [Validators.required]],
      address2: [!data.address ? '' : data.address.address2, [Validators.required]],
      pinCode: [!data.address ? '' : data.address.pinCode, [Validators.required]],
      city: [!data.address ? '' : data.address.city, [Validators.required]],
      state: [!data.address ? '' : data.address.state, [Validators.required]],
      country: [!data.address ? '' : data.address.country, [Validators.required]],
    });

    this.nomineeDetails.controls.country.valueChanges.subscribe(newValue => {
      this.filterCountryName = new Observable().pipe(startWith(''), map(value => {
        return this.processTransaction.filterName(newValue, this.countryList);
      }));
    });
    // if (data.nomineeType == undefined) {
    //   this.nomineeDetails.controls.nomineeType.setValue('1')
    // }
  }

  getFormControl(): any {
    return this.nomineeDetails.controls;
  }

  openBankDetails() {
    const subscription = this.processTransaction.openBank(this.inputData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          subscription.unsubscribe();
        }
      }
    );
  }

  openFatcaDetails(data) {
    const temp = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: FatcaDetailsInnComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(temp).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          subscription.unsubscribe();
        }
      }
    );
  }

  getPostalPin(value) {
    this.isLoading = true;
    const obj = {
      zipCode: value
    };
    if (value != '') {
      this.postalService.getPostalPin(value).subscribe(data => {
        this.isLoading = false;
        this.PinData(data);
      });
    } else {
      this.pinInvalid = false;
    }
  }

  PinData(data) {
    if (data[0].Status == 'Error') {
      this.pinInvalid = true;

      this.getFormControl().pincode.setErrors(this.pinInvalid);
      this.getFormControl().city.setValue('');
      this.getFormControl().country.setValue('');
      this.getFormControl().state.setValue('');

    } else {
      this.getFormControl().city.setValue(data[0].PostOffice[0].Region);
      this.getFormControl().country.setValue(data[0].PostOffice[0].Country);
      this.getFormControl().state.setValue(data[0].PostOffice[0].Circle);
      this.pinInvalid = false;
    }
  }

  reset() {
    this.nomineeDetails.reset();
  }

  SendToForm(value, flag) {
    this.saveNomineeDetails(this.holder.type);
    if (value == 'first') {
      if (this.holder.type == 'first') {
        if (!this.saveNomineeDetails(value)) {
          return;
        }
      } else {
        if (this.firstHolderNominee) {
          this.holder.type = value;
          this.getdataForm(this.firstHolderNominee);
        } else {
          return;
        }
      }
    } else if (value == 'second') {
      if (this.holder.type == 'first') {
        if (!this.saveNomineeDetails(this.holder.type)) {
          return;
        }
      }
      if (this.holder.type == 'second' && !flag) {
        if (!this.saveNomineeDetails(value)) {
          return;
        }
      } else {
        if (this.secondHolderNominee) {
          this.holder.type = value;
          this.getdataForm(this.secondHolderNominee);
        } else {
          this.reset();
        }
      }
    } else if (value == 'third') {
      if (this.holder.type == 'first') {
        if (!this.saveNomineeDetails(this.holder.type)) {
          return;
        }
      }
      if (this.holder.type == 'second') {
        if (!this.saveNomineeDetails(this.holder.type)) {
          return;
        }
      }
      if (this.thirdHolderNominee) {
        this.holder.type = value;
        this.getdataForm(this.thirdHolderNominee);
        // this.nomineeDetails.setValue(this.thirdHolderNominee);
      } else {
        this.reset();
      }

    } else {
      this.saveNomineeDetails(value);
    }
    this.activeDetailsClass = value;
    this.holder.type = value;

    const obj1 = [];
    obj1.push(this.firstHolderNominee);
    if (this.secondHolderNominee) {
      obj1.push(this.secondHolderNominee);
    }
    if (this.thirdHolderNominee) {
      obj1.push(this.thirdHolderNominee);
    }
    if (flag) {
      this.doneData = true;
      value = {};
      const obj = {
        ...this.inputData,
        // ownerName: this.inputData.ownerName,
        // holdingType: this.inputData.holdingType,
        // taxMaster: this.inputData.taxMaster,
        // taxMasterId: this.inputData.taxMasterId,
        // holderList: this.inputData.holderList,
        // bankDetailList: this.inputData.bankDetailList,
        nomineeList: obj1,
        id: 2,
        aggregatorType: 1,
        // familyMemberId: this.inputData.familyMemberId,
        // clientId: this.inputData.clientId,
        // advisorId: this.inputData.advisorId,
        // generalDetails: this.inputData.generalDetails,
        // fatcaDetail: this.inputData.fatcaDetail,
        commMode: 1,
        confirmationFlag: 1,
        // inputData: this.inputData,
      };
      this.openFatcaDetails(obj);
    }
  }

  getObj(getObj: any) {
    throw new Error('Method not implemented.');
  }

  setObj(holder) {

    const value: any = {
      name: holder.name,
      relationShip: holder.relationShip,
      type: holder.type,
      dob: new Date(holder.dob).getTime(),
      percent: holder.percent,
      idNumber: holder.idNumber,
    };
    value.address = {
      addressType: holder.addressType,
      address1: holder.address1,
      address2: holder.address2,
      pinCode: holder.pinCode,
      city: holder.city,
      state: holder.state,
      country: holder.country,
    };
    return value;
  }

  saveNomineeDetails(value) {
    if (this.nomineeDetails.invalid) {
      for (const element in this.nomineeDetails.controls) {
        if (this.nomineeDetails.get(element).invalid) {
          this.inputs.find(input => !input.ngControl.valid).focus();
          this.nomineeDetails.controls[element].markAsTouched();
        }
      }
      return false;
    } else {
      this.setEditHolder(this.holder.type, value);
      return true;
    }
  }

  createIINUCCRes(data) {
  }

  setEditHolder(type, value) {
    switch (type) {
      case 'first':
        this.firstHolderNominee = this.setObj(this.nomineeDetails.value);
        this.holder.type = value;
        break;

      case 'second':
        this.secondHolderNominee = this.setObj(this.nomineeDetails.value);
        this.holder.type = value;
        break;

      case 'third':
        this.thirdHolderNominee = this.setObj(this.nomineeDetails.value);
        this.holder.type = value;
        break;

    }

  }
}
