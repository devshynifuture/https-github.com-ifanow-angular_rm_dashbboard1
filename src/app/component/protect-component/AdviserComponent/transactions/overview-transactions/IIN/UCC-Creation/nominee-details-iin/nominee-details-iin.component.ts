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
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-nominee-details-iin',
  templateUrl: './nominee-details-iin.component.html',
  styleUrls: ['./nominee-details-iin.component.scss']
})
export class NomineeDetailsIinComponent implements OnInit {
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  validatorType = ValidatorType;
  holdingList: any[];
  nomineeDetails: any;
  inputData: any;
  allData: any;
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
  obj1: any;
  sendObj: any;
  nominee: any;
  changedValue: string;
  doneData: any;
  familyMemberList: any;
  clientData: any;
  advisorId: any;
  nomineeFmList: any;
  addressList: any;
  isLoading = false;
  maxDate = new Date();
  maxDateForAdultDob;
  countryList;
  filterCountryName: Observable<any[]>;
  activeDetailsClass = 'first';

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
    private onlineTransact: OnlineTransactionService, private postalService: PostalService,
    private processTransaction: ProcessTransactionService, private custumService: CustomerService,
    private peopleService: PeopleService,
    private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) {
    this.advisorId = AuthService.getAdvisorId();
  }

  @Input()
  set data(data) {
    this.inputData = data;
    this.clientData = data.clientData;
    console.log('all data in nominee', this.inputData);
    this.allData = data;
    this.doneData = {};
    this.doneData.bank = true;
    this.doneData.contact = true;
    this.doneData.personal = true;
    this.doneData.nominee = false;
    if (data && data.nomineeList) {
      this.firstHolderNominee = data.nomineeList[0];
      this.secondHolderNominee = data.nomineeList[1];
      this.thirdHolderNominee = data.nomineeList[2];
      this.getdataForm(this.firstHolderNominee);
    } else {
    }
    if (this.clientData) {
      this.getNomineeList(this.clientData, !this.firstHolderNominee);
    }
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.maxDateForAdultDob = new Date();

    if (this.firstHolderNominee) {
      this.getdataForm(this.firstHolderNominee);
    } else {
      this.getdataForm('');
    }
    if (this.clientData) {
      this.getFamilyMembersList(this.clientData, !this.firstHolderNominee);
    }
    this.holdingList = [];
    this.nominee = [];
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
    console.log('onChange', value.checked);

    if (value.checked == true) {
      this.nomineeDetails.controls.address1.setValue((this.allData.holderList[0].address1) ? this.allData.holderList[0].address1 : this.allData.holderList[0].address.address1);
      this.nomineeDetails.controls.address2.setValue((this.allData.holderList[0].address2) ? this.allData.holderList[0].address2 : this.allData.holderList[0].address.address2);
      this.nomineeDetails.controls.pinCode.setValue((this.allData.holderList[0].pinCode) ? this.allData.holderList[0].pinCode : this.allData.holderList[0].address.pinCode);
      this.nomineeDetails.controls.city.setValue((this.allData.holderList[0].city) ? this.allData.holderList[0].city : this.allData.holderList[0].address.city);
      this.nomineeDetails.controls.state.setValue((this.allData.holderList[0].state) ? this.allData.holderList[0].state : this.allData.holderList[0].address.state);
      this.nomineeDetails.controls.country.setValue((this.allData.holderList[0].country) ? this.allData.holderList[0].country : this.allData.holderList[0].address.country);
    }
  }

  selectRelation(value) {
    console.log('relation type', value);
    if (value.value != 'Son' || value.value != 'Daughter' || value.value != 'Brother' || value.value != 'Sister') {
      this.maxDateForAdultDob = moment().subtract(18, 'years');
    } else {
      this.maxDateForAdultDob = new Date();
    }
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
    console.log('getListOfFamilyByClientRes', data);
    this.nomineeFmList = data;
    this.nomineeFmList = this.nomineeFmList.filter(element => element.familyMemberId != this.clientData.familyMemberId);
    console.log('nomineeList', this.nomineeFmList);
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
        console.log(data);
        console.log('address stored', data);
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
        console.log(this.familyMemberList);
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
      nomineeName: [(!data) ? '' : (data.nomineeName) ? data.nomineeName : data.name, [Validators.required]],
      relationShip: [(data.relationShip) ? data.relationShip : (data.relationshipId) ? data.relationshipId + '' : '', [Validators.required]],
      type: [!data ? '1' : (data.type) ? data.type + '' : '1', [Validators.required]],
      dob: [!data ? '' : (data.dob) ? new Date(data.dob) : new Date(data.dateOfBirth), [Validators.required]],
      percent: 100,
      // percent: [!data ? '' : data.percent, [Validators.required, Validators.min(0), Validators.max(100)]],
      addressType: [(data.address.addressType) ? data.address.addressType : '', [Validators.required]],
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

  pinInvalid: boolean = false;

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
    var temp = {
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
    let obj = {
      zipCode: value
    };
    console.log(value, 'check value');
    if (value != '') {
      this.postalService.getPostalPin(value).subscribe(data => {
        this.isLoading = false;
        console.log('postal 121221', data);
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
    this.activeDetailsClass = value;
    if (value == 'first') {
      this.saveNomineeDetails(value);
      if (this.firstHolderNominee) {
        this.holder.type = value;
        this.nomineeDetails.setValue(this.firstHolderNominee);
      } else {
        return;
      }
    } else if (value == 'second') {
      this.saveNomineeDetails(value);
      if (this.secondHolderNominee) {
        this.holder.type = value;
        this.nomineeDetails.setValue(this.secondHolderNominee);
      } else {
        this.reset();
      }
    } else if (value == 'third') {
      this.saveNomineeDetails(value);
      if (this.thirdHolderNominee) {
        this.holder.type = value;
        this.nomineeDetails.setValue(this.thirdHolderNominee);
      } else {
        this.reset();
      }
      ;
    } else {
      this.saveNomineeDetails(value);
    }
    console.log('contact details', this.obj1);

    this.obj1 = [];
    this.obj1.push(this.firstHolderNominee);
    this.obj1.push(this.secondHolderNominee);
    this.obj1.push(this.thirdHolderNominee);
    this.obj1.forEach(element => {
      if (element) {
        this.getObj = this.setObj(element, value);
        this.nominee.push(this.getObj);
      }
    });
    if (flag == true) {
      this.doneData = true;
      const value = {};
      let obj = {
        ownerName: this.allData.ownerName,
        holdingType: this.allData.holdingType,
        taxStatus: this.allData.taxStatus,
        holderList: this.allData.holderList,
        bankDetailList: this.allData.bankDetailList,
        nomineeList: this.nominee,
        id: 2,
        aggregatorType: 1,
        familyMemberId: this.allData.familyMemberId,
        clientId: this.allData.clientId,
        advisorId: this.allData.advisorId,
        generalDetails: this.allData.generalDetails,
        fatcaDetail: this.inputData.fatcaDetail,
        commMode: 1,
        confirmationFlag: 1,
        allData: this.inputData,
        tpUserSubRequestClientId1: 2,
        clientData: this.clientData
      };
      console.log('##### ALLL DATA ####', obj);
      this.openFatcaDetails(obj);
    }
  }

  getObj(getObj: any) {
    throw new Error('Method not implemented.');
  }

  setObj(holder, value) {

    value = {
      name: holder.nomineeName,
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
      for (let element in this.nomineeDetails.controls) {
        console.log(element);
        if (this.nomineeDetails.get(element).invalid) {
          this.inputs.find(input => !input.ngControl.valid).focus();
          this.nomineeDetails.controls[element].markAsTouched();
        }
      }
    } else {
      this.setEditHolder(this.holder.type, value);

    }
  }

  createIINUCCRes(data) {
    console.log('data to created', data);
  }

  setEditHolder(type, value) {
    switch (type) {
      case 'first':
        this.firstHolderNominee = this.nomineeDetails.value;
        this.holder.type = value;
        break;

      case 'second':
        this.secondHolderNominee = this.nomineeDetails.value;
        this.holder.type = value;
        break;

      case 'third':
        this.thirdHolderNominee = this.nomineeDetails.value;
        this.holder.type = value;
        break;

    }

  }
}
