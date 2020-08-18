import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { DatePipe } from '@angular/common';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { individualJson, minorJson, nonIndividualJson } from './client&leadJson';
import { relationListFilterOnID } from './relationypeMethods';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { MatDialog } from '@angular/material';
import { element } from 'protractor';

const moment = require('moment');

@Component({
  selector: 'app-client-basic-details',
  templateUrl: './client-basic-details.component.html',
  styleUrls: ['./client-basic-details.component.scss']
})
export class ClientBasicDetailsComponent implements OnInit {
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
  minorForm: FormGroup;
  nonIndividualForm: any;
  advisorId;
  basicDetailsData: any;
  mobileData: any;
  categoryList: any[];
  clientOwnerList: any;
  selectedClientOwner: any;
  maxDateForAdultDob = moment().subtract(18, 'years');
  // new Date(.date());
  mobileNumberFlag = 'Mobile number';

  basicDetails: FormGroup;
  date = new Date();
  @Input() fieldFlag;
  @Output() clientData = new EventEmitter();
  @Output() tabChange = new EventEmitter();
  @Output() cancelTab = new EventEmitter();
  @Output() saveNextData = new EventEmitter();
  @Output() hideDematTab = new EventEmitter();
  validatorType = ValidatorType;
  invTypeCategory;
  invTaxStatus;
  clientRoles: any = [];
  minAge: any;
  advisorData: any;
  maxDate = new Date();
  invTypeCategoryList = [];
  familyMemberType: { name: string; value: string; };
  invTaxStatusList: any[];
  taxStatusList: any[];
  countryCodeFlag: any;
  sendRole: any;
  disableBtn: boolean = false;
  clientTypeList: any;
  tableGetData: any;
  taxStatusFormControl = new FormControl('', [Validators.required]);
  relationList: any[];
  callMethod: { methodName: string; ParamValue: any; disControl: any; };
  nomineesListFM: any = [];
  ownerData: any;
  idData
  removedGaurdianList: any = [];

  // advisorId;

  constructor(private fb: FormBuilder, private enumService: EnumServiceService,
    private subInjectService: SubscriptionInject, private peopleService: PeopleService,
    private eventService: EventService, private datePipe: DatePipe,
    private utilService: UtilService, private enumDataService: EnumDataService,
    private cusService: CustomerService, private dialog: MatDialog) {
  }

  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.advisorData = AuthService.getUserInfo();
    this.basicDetailsData = data;
    this.idData = (this.fieldFlag != 'familyMember') ? this.basicDetailsData.clientId : this.basicDetailsData.familyMemberId
    if (data.fieldFlag == 'familyMember') {
      if (data.familyMemberType == 3 || data.familyMemberType == 4) {
        this.invTypeCategory = String(data.familyMemberType);
        this.invTaxStatus = String(data.residentFlag);
        this.familyMemberType = data.familyMemberType == 4 ? { name: 'Sole proprietorship', value: '4' } : { name: 'Non individual', value: '3' };
        this.hideDematTab.emit(true);
        this.createNonIndividualForm(data);
        return;
      }
      (data.relationshipId == 7) ? this.maxDateForAdultDob = new Date() : '';
      this.basicDetailsData = data;
      if (this.basicDetailsData.relationshipId == 2 || this.basicDetailsData.relationshipId == 3 || this.basicDetailsData.relationshipId == 6 || this.basicDetailsData.relationshipId == 7) {
        (data.relationshipId == 6 || data.relationshipId == 2) ? data.genderId = 1 : data.genderId = 2;
        this.familyMemberType = { name: 'Individual', value: '1' };
        this.relationshipTypeMethod(this.basicDetailsData.genderId, this.basicDetailsData.age);
        this.invTypeCategory = '1';
        this.hideDematTab.emit(true);
        this.invTaxStatusList = this.enumService.getIndividualTaxList();
        this.createIndividualForm(this.basicDetailsData);
      } else if (this.basicDetailsData.relationshipId == 4 || this.basicDetailsData.relationshipId == 5) {
        this.relationshipTypeMethod(this.basicDetailsData.genderId, this.basicDetailsData.age)
        if (this.basicDetailsData.age > 18) {
          (data.relationshipId != 10) ? (data.relationshipId == 4) ? data.genderId = 1 : data.genderId = 2 : '';
          this.familyMemberType = { name: 'Individual', value: '1' };
          this.invTypeCategory = '1';
          this.hideDematTab.emit(true);
          this.invTaxStatusList = this.enumService.getIndividualTaxList();
          this.createIndividualForm(this.basicDetailsData);
        }
        else {
          (data.relationshipId == 4) ? data.genderId = 1 : data.genderId = 2;
          this.familyMemberType = { name: 'Minor', value: '2' };
          this.invTypeCategory = '2';
          this.createMinorForm(this.basicDetailsData);
          this.invTaxStatusList = this.enumService.getMinorTaxList();
          this.hideDematTab.emit(false);
        }
      }
      else {
        this.relationList = relationListFilterOnID(AuthService.getClientData().clientType);
        if (this.basicDetailsData.age > 18) {
          this.familyMemberType = { name: 'Individual', value: '1' };
          this.invTypeCategory = '1';
          this.hideDematTab.emit(true);
          this.invTaxStatusList = this.enumService.getIndividualTaxList();
          this.createIndividualForm(this.basicDetailsData);
        }
        else {
          this.familyMemberType = { name: 'Minor', value: '2' };
          this.invTypeCategory = '2';
          this.createMinorForm(this.basicDetailsData);
          this.invTaxStatusList = this.enumService.getMinorTaxList();
          this.hideDematTab.emit(false);
        }
      }
      this.invTaxStatus = (this.basicDetailsData.residentFlag != undefined) ? String(this.basicDetailsData.residentFlag) : '';
      (this.basicDetailsData.familyMemberType == 1 || this.basicDetailsData.familyMemberType == 0) ?
        this.createIndividualForm(this.basicDetailsData) : this.createMinorForm(this.basicDetailsData);
    } else {
      this.getClientList();
      this.basicDetailsData = data;
      if (this.basicDetailsData.userId == null) {
        this.invTypeCategory = '1';
        this.invTaxStatus = '1';
        this.selectedClientOwner = '';
        this.hideDematTab.emit(true);
        this.createIndividualForm(null);
        this.invTaxStatusList = this.enumService.getIndividualTaxList();
        this.taxStatusList = this.invTaxStatusList.filter(element => element.residentFlag == true)
        return;
      } else {
        // this.selectedClientOwner = (this.tableGetData.userId) ? this.tableGetData.advisorId : '';
        this.selectedClientOwner = this.basicDetailsData.advisorId;
        this.invTypeCategory = (data.clientType == 1 || data.clientType == 0) ? '1' : String(data.clientType);
        this.invTaxStatus = (this.basicDetailsData.residentFlag != undefined) ? String(this.basicDetailsData.residentFlag) : '';
      }
      if (this.invTypeCategory == '1') {
        this.hideDematTab.emit(true);
        this.invTaxStatusList = this.enumService.getIndividualTaxList();
        this.createIndividualForm(this.basicDetailsData);
      } else if (this.invTypeCategory == '2') {
        this.hideDematTab.emit(false);
        this.invTaxStatusList = this.enumService.getMinorTaxList();
        this.createMinorForm(this.basicDetailsData);
      } else {
        this.hideDematTab.emit(true);
        this.invTaxStatusList = this.enumService.getCorporateTaxList();
        this.createNonIndividualForm(this.basicDetailsData);
      }
      if (this.fieldFlag == 'client') {
        this.clientTypeList = (this.basicDetailsData.clientType == 1) ? {
          name: 'Individual',
          value: '1'
        } : (this.basicDetailsData.clientType == 2) ? { name: 'Minor', value: '2' } : (this.basicDetailsData.clientType == 3) ? { name: 'Non-individual', value: '3' } : { name: 'Sole proprietorship', value: '4' };
      } else {
        this.clientTypeList = (this.basicDetailsData.clientType == 1) ? { name: 'Individual', value: '1' } : (this.basicDetailsData.clientType == 3) ? {
          name: 'Non-individual',
          value: '3'
        } : { name: 'Sole proprietorship', value: '4' };
      }
      // (data.clientType == 1 || data.clientType == 0) ? this.createIndividualForm(data) : this.createNonIndividualForm(data);
      this.getClientOrLeadData(this.basicDetailsData);
    }
    // if (this.invTypeCategory == 1) {
    //   this.taxStatusList = (this.basicDetailsData.residentFlag == 1) ? this.invTaxStatusList.filter(element => element.residentFlag == true) : this.invTaxStatusList.filter(element => element.residentFlag == false);
    // }
    // else if (this.invTypeCategory == 2) {
    //   this.taxStatusList = (this.basicDetailsData.residentFlag == 1) ? this.invTaxStatusList.filter(element => element.residentFlag == true) : this.invTaxStatusList.filter(element => element.residentFlag == false);
    // }
    // else {
    //   this.taxStatusList = (this.basicDetailsData.residentFlag == 1) ? this.invTaxStatusList.filter(element => element.residentFlag == true) : this.invTaxStatusList.filter(element => element.residentFlag == false);
    // }
    console.log(data);
  }

  relationshipTypeMethod(gender, age) {
    if (gender == 1) {
      this.relationList = [
        { name: 'Son', value: 4 },
        { name: 'Husband', value: 2 },
        { name: 'Father', value: 6 },
        // { name: 'Other', value: 10 },
        // { name: 'Son', value: 4 },
        // { name: 'Other', value: 10 },
      ]
    }
    if (gender == 2) {
      this.relationList = [
        { name: 'Daughter', value: 5 },
        { name: 'Wife', value: 3 },
        { name: 'Mother', value: 7 },
        // { name: 'Other', value: 20 },
        // { name: 'Daughter', value: 5 },
        // { name: 'Other', value: 10 },
      ]
    }
    if (gender == 3) {
      this.relationList = [
        { name: 'Wife', value: 3 },
        { name: 'Husband', value: 2 },
        { name: 'Son', value: 4 },
        { name: 'Daughter', value: 5 },
        { name: 'Father', value: 6 },
        { name: 'Mother', value: 7 },
        { name: 'Other', value: 20 },
      ]
    }
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientRoles = this.enumService.getClientRole();
    console.log(this.clientRoles, 'this.clientRoles 123A');
    console.log('tax status data', this.enumDataService.getDataForTaxMasterService());
  }

  toUpperCase(formControl, event) {
    this.utilService.toUpperCase(formControl, event);
  }

  createIndividualForm(data) {
    (data == undefined) ? data = {} : '';
    this.basicDetails = this.fb.group({
      fullName: [data.name, [Validators.required]],
      email: [{
        value: (data.emailList && data.emailList.length > 0) ? data.emailList[0].email : '',
        disabled: this.basicDetailsData.userId ? true : false
      }, [Validators.pattern(this.validatorType.EMAIL)]],
      pan: [{
        value: data.pan,
        disabled: this.basicDetailsData.userId ? true : false
      }, [Validators.pattern(this.validatorType.PAN)]],
      // taxStatus: [data.taxStatusId ? String(data.taxStatusId) : '', [Validators.required]],
      username: [{ value: data.userName, disabled: true }],
      dobAsPerRecord: [(data.dateOfBirth == null) ? '' : new Date(data.dateOfBirth)],
      gender: [(data.genderId) ? String(data.genderId) : '1'],
      relationType: [(data.relationshipId != 0) ? data.relationshipId : ''],
      leadSource: [(data.leadSource) ? data.leadSource : ''],
      leaadStatus: [(data.leadStatus) ? String(data.leadStatus) : ''],
      leadRating: [(data.leadRating) ? String(data.leadRating) : ''],
      leadOwner: [this.selectedClientOwner, (this.fieldFlag == 'lead') ? [Validators.required] : null],
      clientOwner: [this.selectedClientOwner, (this.fieldFlag == 'client') ? [Validators.required] : null],
      role: [(data.roleId) ? data.roleId : '', (this.fieldFlag != 'familyMember') ? [Validators.required] : null],
    });

    if (this.fieldFlag != 'familyMember') {
      this.basicDetails.controls.email.setValidators([Validators.required, Validators.pattern(this.validatorType.EMAIL)]);
      this.basicDetails.controls.pan.setValidators([Validators.required, Validators.pattern(this.validatorType.PAN)]);
    }
    else {
      this.basicDetails.controls.relationType.setValidators([Validators.required]);
      this.basicDetails.controls.relationType.updateValueAndValidity();
    }
    this.basicDetails.controls.email.updateValueAndValidity();
    this.basicDetails.controls.pan.updateValueAndValidity();
  }

  createMinorForm(data) {
    (data == undefined) ? data = {} : '';
    this.minorForm = this.fb.group({
      minorFullName: [data.name, [Validators.required]],
      dobAsPerRecord: [(data.dateOfBirth == null) ? '' : new Date(data.dateOfBirth)],
      gender: [(data.genderId) ? String(data.genderId) : '1'],
      relationType: [(data.relationshipId != 0) ? data.relationshipId : ''],
      // gFullName: [(data.guardianData) ? data.guardianData.name : '', [Validators.required]],
      // gDobAsPerRecord: [(data.guardianData) ? new Date(data.guardianData.birthDate) : ''],
      // gGender: [(data.guardianData) ? String(data.guardianData.genderId) : '1'],
      // relationWithMinor: [(data.guardianData) ? (data.guardianData.relationshipId != 0) ? String(data.guardianData.relationshipId) : '' : ''],
      // gEmail: [(data.guardianData && data.guardianData.emailList && data.guardianData.emailList.length > 0) ? data.guardianData.emailList[0].email : '', [Validators.pattern(this.validatorType.EMAIL)]],
      // pan: [data.guardianData ? data.guardianData.pan : '', [Validators.pattern(this.validatorType.PAN)]],
      // clientOwner: [this.selectedClientOwner, (this.fieldFlag == 'client') ? [Validators.required] : null],
      // role: [(data.roleId) ? data.roleId : '', (this.fieldFlag != 'familyMember') ? [Validators.required] : null],
      // username: [{ value: data.userName, disabled: true }],
      getCoOwnerName: this.fb.array([this.fb.group({
        name: [''],
        share: [''],
        familyMemberId: [this.basicDetailsData.familyMemberId],
        id: [],
        clientId: [this.basicDetailsData.clientId],
        guardianClientId: [this.basicDetailsData.clientId],
        guardianFamilyMemberId: ['', [Validators.required]],
        active: true
      })]),
    });
    // if (this.fieldFlag == 'client') {
    //   this.minorForm.controls.gEmail.setValidators([Validators.required, Validators.pattern(this.validatorType.EMAIL)]);
    //   this.minorForm.controls.pan.setValidators([Validators.required, Validators.pattern(this.validatorType.PAN)]);
    // }
    // if (this.fieldFlag == 'client' && this.basicDetailsData.name) {
    //   this.minorForm.controls.gEmail.disable();
    //   this.minorForm.controls.pan.disable();
    // }
    // this.minorForm.controls.gEmail.updateValueAndValidity();
    // this.minorForm.controls.pan.updateValueAndValidity();

    if (data.guardianClientFamilyMappingModelList && data.guardianClientFamilyMappingModelList.length > 0) {
      this.getCoOwner.removeAt(0);
      data.guardianClientFamilyMappingModelList.forEach(element => {
        this.addNewCoOwner(element);
      });
    }
    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.minorForm };
  }

  get getCoOwner() {
    if (this.minorForm.value.getCoOwnerName) {
      return this.minorForm.get('getCoOwnerName') as FormArray;
    }
  }

  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: [data ? data.name : '']
      , share: [data ? data.share : ''],
      familyMemberId: [this.basicDetailsData.familyMemberId],
      id: [data ? data.id : 0],
      clientId: [this.basicDetailsData.clientId],
      guardianClientId: [this.basicDetailsData.clientId],
      guardianFamilyMemberId: [data ? data.guardianFamilyMemberId : '', [Validators.required]],
      active: true
    }));
    if (data) {
      setTimeout(() => {
        this.disabledMember(null, null);
      }, 1300);
    }
  }

  removeCoOwner(item) {
    this.removedGaurdianList.push(this.getCoOwner.controls[item].value)
    this.getCoOwner.removeAt(item);
    this.disabledMember(null, null);
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


  createNonIndividualForm(data) {
    (data == undefined) ? data = {} : '';
    this.nonIndividualForm = this.fb.group({
      comName: [data.name, [Validators.required]],
      dateOfIncorporation: [(data.dateOfBirth) ? new Date(data.dateOfBirth) : ''],
      comStatus: [(data.companyStatus) ? String(data.companyStatus) : '', [Validators.required]],
      comEmail: [{
        value: (data.emailList && data.emailList.length > 0) ? data.emailList[0].email : '',
        disabled: this.basicDetailsData.userId ? true : false
      }, [Validators.required, Validators.pattern(this.validatorType.EMAIL)]],
      comPan: [{
        value: data.pan,
        disabled: this.basicDetailsData.userId ? true : false
      }, [Validators.required, Validators.pattern(this.validatorType.PAN)]],
      gstinNum: [data.gstin, [Validators.required, Validators.pattern('^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$')]],
      // taxStatus: [data.taxStatusId ? String(data.taxStatusId) : '', [Validators.required]],
      comOccupation: [(data.occupationId) ? String(data.occupationId) : ''],
      username: [{ value: data.userName, disabled: true }],
      leadSource: [data.leadSource ? data.leadSource : ''],
      leadStatus: [(data.leadStatus) ? String(data.leadStatus) : ''],
      leadRating: [(data.leadRating) ? String(data.leadRating) : ''],
      leadOwner: [this.selectedClientOwner, (this.fieldFlag == 'lead') ? [Validators.required] : null],
      clientOwner: [this.selectedClientOwner],
      role: [(data.roleId) ? data.roleId : '']
    });
    if (this.invTypeCategory == 4) {
      this.nonIndividualForm.controls.comStatus.setValidators(null);
      this.nonIndividualForm.controls.comStatus.updateValueAndValidity();
    }
    if (this.fieldFlag == 'client') {
      this.nonIndividualForm.controls.clientOwner.setValidators([Validators.required]);
      this.nonIndividualForm.controls.role.setValidators([Validators.required]);
    }
  }

  capitalise(event) {
    if (event.target.value != '') {
      event.target.value = event.target.value.replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  getClientOrLeadData(data) {
    const obj = {
      clientId: data.clientId
    };
    this.peopleService.getClientOrLeadData(obj).subscribe(
      data => {
        console.log('ClientBasicDetailsComponent getClientOrLeadData data: ', data);
        this.basicDetailsData = data;
        if (data == undefined) {
          return;
        } else {
          this.invTypeCategory = (data.clientType == 0) ? '1' : String(data.clientType);
          // this.invTaxStatus = (data.taxStatusId == 0) ? '1' : String(data.taxStatusId);
          // (data.clientType == 1 || data.clientType == 0) ? this.createIndividualForm(data) : this.createNonIndividualForm(data);
          (this.invTypeCategory == '1') ? this.createIndividualForm(data) : (this.fieldFlag == 'client' && this.invTypeCategory == '2') ? this.createMinorForm(data) : this.createNonIndividualForm(data);
          this.clientData.emit(data);
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  getNumberDetails(data) {
    console.log(data);
    this.mobileData = data;
  }

  numberFlag(data) {
    this.countryCodeFlag = data.residentFlag;
  }

  changeInvestorType(event) {
    (event.value == '1') ? this.createIndividualForm(this.basicDetailsData) : '';
    if (event.value == '1') {
      this.mobileNumberFlag = 'Mobile number';
      this.hideDematTab.emit(true);
      // this.invTaxStatusList = this.enumService.getIndividualTaxList();
      console.log(this.invTaxStatusList);
    } else if (event.value == '2') {
      this.createMinorForm(this.basicDetailsData);
      this.mobileNumberFlag = 'Mobile number';
      // console.log(this.invTaxStatusList);
      this.hideDematTab.emit(false);
      // this.invTaxStatusList = this.enumService.getMinorTaxList();
    } else {
      this.createNonIndividualForm(this.basicDetailsData);
      this.hideDematTab.emit(true);
      this.mobileNumberFlag = 'Company mobile number';
      console.log(this.invTaxStatusList);
      // this.invTaxStatusList = this.enumService.getCorporateTaxList();
    }
    this.invTaxStatus = '1';
    this.invTypeCategory = event.value;
    this.changeTaxStatus(1)
  }

  changeTaxStatus(event) {
    this.invTaxStatus = String(event);
    // (this.invTypeCategory == '1') ? this.basicDetails.controls.taxStatus.setValue('') : (this.invTypeCategory == '2' && (this.fieldFlag == 'familyMember' || this.fieldFlag == 'client')) ? this.minorForm.controls.taxStatus.setValue('') : this.nonIndividualForm.controls.taxStatus.setValue('');
    // this.taxStatusList = (event == 1) ? this.invTaxStatusList.filter(element => element.residentFlag == true) : this.invTaxStatusList.filter(element => element.residentFlag == false);
  }

  addRole(role) {
    this.sendRole = role;
  }

  saveNextClient(flag) {
    if (this.invTypeCategory == '1' && this.basicDetails.invalid) {
      this.basicDetails.markAllAsTouched();
      return;
    }
    if (this.invTypeCategory == '2' && this.minorForm.invalid) {
      this.minorForm.markAllAsTouched();
      return;
    }
    if (this.invTypeCategory == '3' && this.nonIndividualForm.invalid) {
      this.nonIndividualForm.markAllAsTouched();
      return;
    }
    if (this.invTypeCategory == '4' && this.nonIndividualForm.invalid) {
      this.nonIndividualForm.markAllAsTouched();
      return;
    }
    else if (this.mobileData.invalid) {
      this.mobileData.markAllAsTouched();
    } else {
      // let taxStatusId = (this.invTypeCategory == '1') ? this.basicDetails.value.taxStatus : (this.invTypeCategory == '2') ? this.minorForm.value.taxStatus : this.nonIndividualForm.value.taxStatus;
      (flag == 'close') ? this.barButtonOptions.active = true : this.disableBtn = true;
      const mobileList = [];
      if (this.mobileData) {
        this.mobileData.controls.forEach(element => {
          console.log(element);
          const mobileNo = element.get('number').value;
          if (mobileNo) {
            mobileList.push({
              userType: 2,
              mobileNo: element.get('number').value,
              isdCodeId: element.get('code').value
            });
          }
        });
      }

      let advisorId;
      if (this.selectedClientOwner && this.selectedClientOwner != '') {
        advisorId = this.selectedClientOwner;
      }


      const emailId = (this.invTypeCategory == '1') ? this.basicDetails.controls.email.value : (this.invTypeCategory == '2') ? this.minorForm.controls.gEmail.value : this.nonIndividualForm.controls.comEmail.value;
      const emailList = [];
      if (emailId) {
        emailList.push({
          userType: 2,
          email: emailId
        });
      }
      let gardianObj;
      let obj = {
        'parentAdvisorId': this.advisorId,
        'adminAdvisorId': AuthService.getAdminId(),
        'advisorId': advisorId,
        'residentFlag': parseInt(this.invTaxStatus),
        'advisorOrClientRole': (this.sendRole) ? this.sendRole.advisorOrClientRole : this.basicDetailsData.advisorOrClientRole,
        'userId': this.basicDetailsData.userId,
        'clientId': this.basicDetailsData.clientId,
        'status': (this.fieldFlag == 'client') ? 1 : 2,
        'clientType': parseInt(this.invTypeCategory)
      }
      if (this.invTypeCategory == 1) {
        obj['dateOfBirth'] = this.datePipe.transform(this.basicDetails.controls.dobAsPerRecord.value, 'dd/MM/yyyy')
        obj =
        {
          ...obj,
          ...individualJson(this.basicDetails, emailList, mobileList)
        };
      }
      if (this.invTypeCategory == 2) {
        // gardianObj = {
        //   name: this.minorForm.value.gFullName,
        //   birthDate: this.datePipe.transform(this.minorForm.value.gDobAsPerRecord, 'dd/MM/yyyy'),
        //   pan: this.minorForm.controls.pan.value,
        //   genderId: this.minorForm.value.gGender,
        //   relationshipId: (this.minorForm.value.relationWithMinor != '') ? this.minorForm.value.relationWithMinor : null,
        //   aadhaarNumber: (this.basicDetailsData.guardianData) ? this.basicDetailsData.guardianData.aadhaarNumber : null,
        //   occupationId: 1,
        //   martialStatusId: 1,
        //   anniversaryDate: null,
        //   mobileList: mobileList,
        //   emailList: [
        //     {
        //       email: this.minorForm.value.gEmail,
        //       userType: 4,
        //       verificationStatus: 0
        //     }
        //   ]
        // };
        // obj['dateOfBirth'] = this.datePipe.transform(this.minorForm.controls.dobAsPerRecord.value, 'dd/MM/yyyy');
        // obj['guardianData'] = gardianObj;
        // obj = {
        //   ...obj,
        //   ...minorJson(this.minorForm, emailList, mobileList)
        // }
      }

      if (this.invTypeCategory == 3 || this.invTypeCategory == 4) {
        obj['dateOfBirth'] = this.datePipe.transform(this.nonIndividualForm.value.dateOfIncorporation, 'dd/MM/yyyy')
        obj['gstin'] = this.nonIndividualForm.controls.gstinNum.value
        obj =
        {
          ...obj,
          ...nonIndividualJson(this.nonIndividualForm, emailList, mobileList)
        }
      }
      if (this.basicDetailsData.userId == null) {
        obj['sendEmail'] = true;
        this.peopleService.addClient(obj).subscribe(
          data => {
            this.disableBtn = false;
            this.barButtonOptions.active = false;
            console.log(data);
            data.invCategory = this.invTypeCategory;
            data.categoryTypeflag = (this.invTypeCategory == '1') ? 'Individual' : (this.fieldFlag == 'client' && this.invTypeCategory == '2') ? 'familyMinor' : 'clientNonIndividual';
            this.eventService.openSnackBar('Added successfully!', 'Dismiss');
            (flag == 'Next') ? this.changeTabAndSendData(data) : this.close(obj);
          },
          (err) => {
            this.disableBtn = false;
            this.barButtonOptions.active = false;
            this.eventService.openSnackBar(err, 'Dismiss');
          }
        );
      } else {
        obj['bio'] = this.basicDetailsData.bio;
        obj['remarks'] = this.basicDetailsData.remarks;
        obj['aadhaarNumber'] = this.basicDetailsData.aadhaarNumber;
        obj['martialStatusId'] = this.basicDetailsData.martialStatusId;
        // obj['taxStatusId'] = taxStatusId;
        obj['anniversaryDate'] = this.datePipe.transform(this.basicDetailsData.anniversaryDate, 'dd/MM/yyyy');
        // (this.invTypeCategory == '2') ? '' : obj.occupationId = this.basicDetailsData.occupationId;
        this.peopleService.editClient(obj).subscribe(
          data => {
            setTimeout(() => {
              this.eventService.openSnackBar('Updated successfully!', 'Dismiss');
            });
            if (flag == 'Next') {
              this.disableBtn = false;
              this.barButtonOptions.active = false;
              data.invCategory = this.invTypeCategory;
              data.categoryTypeflag = (this.invTypeCategory == '1') ? 'Individual' : 'clientNonIndividual';
              this.changeTabAndSendData(data);
            } else {
              this.close(data);
            }
          },
          (err) => {
            this.disableBtn = false;
            this.barButtonOptions.active = false;
            this.eventService.openSnackBar(err, 'Dismiss');
          }
        );
      }
    }
  }

  getClientList() {
    const obj = {
      advisorId: this.advisorId
    };
    this.peopleService.getTeamMemberList(obj).subscribe(
      data => {
        console.log(data);
        this.clientOwnerList = data;
        if (this.clientOwnerList.length == 1 && this.basicDetailsData.userId == undefined) {
          this.selectedClientOwner = this.clientOwnerList[0].adminAdvisorId;
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  changeTabAndSendData(data) {
    this.clientData.emit(data);
    this.tabChange.emit(1);
    this.saveNextData.emit(true);
  }

  saveNextFamilyMember(flag) {
    const mobileList = [];
    if (this.mobileData) {
      this.mobileData.controls.forEach(element => {
        console.log(element);
        mobileList.push({
          mobileNo: element.get('number').value,
          verificationStatus: 0,
          isdCodeId: element.get('code').value
        });
      });
    }
    if (this.invTypeCategory == '1') {
      this.basicDetails.get('role').clearValidators();
      this.basicDetails.get('role').updateValueAndValidity();
    }
    let gardianObj = [];
    if (this.invTypeCategory == '1' && this.basicDetails.invalid) {
      this.basicDetails.markAllAsTouched();
      return;
    }
    if (this.invTypeCategory == '2' && this.minorForm.invalid) {
      this.minorForm.markAllAsTouched();
      return;
    }
    if ((this.invTypeCategory == '3' || this.invTypeCategory == '4') && this.nonIndividualForm.invalid) {
      this.nonIndividualForm.markAllAsTouched();
      return;
    }
    if (this.invTypeCategory == '2') {
      // gardianObj = {
      //   name: (this.invTypeCategory == '2') ? this.minorForm.value.gFullName : null,
      //   birthDate: (this.invTypeCategory == '2') ? this.datePipe.transform(this.minorForm.value.gDobAsPerRecord, 'dd/MM/yyyy') : null,
      //   pan: this.minorForm.controls.pan.value,
      //   genderId: (this.invTypeCategory == '2') ? this.minorForm.value.gGender : null,
      //   relationshipId: (this.minorForm.value.relationWithMinor != '') ? this.minorForm.value.relationWithMinor : null,
      //   aadhaarNumber: (this.basicDetailsData.guardianData) ? this.basicDetailsData.guardianData.aadhaarNumber : null,
      //   occupationId: 1,
      //   martialStatusId: 1,
      //   anniversaryDate: null,
      //   mobileList: (this.invTypeCategory == '2') ? mobileList : null,
      //   emailList: [
      //     {
      //       email: (this.invTypeCategory == '2') ? this.minorForm.value.gEmail : null,
      //       userType: 4,
      //       verificationStatus: 0
      //     }
      //   ]
      // };
      this.getCoOwner.value.forEach(element => {
        delete element['name'],
          delete element['share']
        delete element['id']
        gardianObj.push(element);
      });
      if (this.removedGaurdianList.length > 0) {
        this.removedGaurdianList.forEach(element => {
          delete element['name'],
            delete element['share']
          delete element['id']
          element['active'] = false;
          gardianObj.push(element);
        })
      }
      // this.minorForm.get('role').clearValidators();
      // this.minorForm.get('role').updateValueAndValidity();
    } else {
      gardianObj = null;
    }

    (flag == 'close') ? this.barButtonOptions.active = true : this.disableBtn = true;
    ;
    const obj = {
      adminAdvisorId: AuthService.getAdminId(),
      advisorId: AuthService.getClientData().advisorId,
      familyMemberId: this.basicDetailsData.familyMemberId,
      clientId: this.basicDetailsData.clientId,
      name: (this.invTypeCategory == '1') ? this.basicDetails.controls.fullName.value : (this.invTypeCategory == '2') ? this.minorForm.value.minorFullName : this.nonIndividualForm.controls.comName.value,
      displayName: null,
      dateOfBirth: this.datePipe.transform((this.invTypeCategory == '1') ? this.basicDetails.controls.dobAsPerRecord.value : (this.invTypeCategory == '2') ? this.minorForm.value.dobAsPerRecord : this.nonIndividualForm.controls.dateOfIncorporation.value, 'dd/MM/yyyy'),
      martialStatusId: null,
      genderId: (this.invTypeCategory == '1') ? this.basicDetails.controls.gender.value : (this.invTypeCategory == '2') ? this.minorForm.value.gender : null,
      occupationId: 1,
      pan: (this.invTypeCategory == '1') ? this.basicDetails.controls.pan.value : (this.invTypeCategory == '2') ? this.minorForm.value.pan : this.nonIndividualForm.controls.comPan.value,
      residentFlag: parseInt(this.invTaxStatus),
      // taxStatusId: taxStatusId,
      relationshipId: (this.invTypeCategory == '1') ? this.basicDetails.controls.relationType.value : (this.invTypeCategory == '2') ? (this.minorForm.controls.gender.value == 1) ? 4 : 5 : this.basicDetailsData.relationshipId,
      familyMemberType: parseInt(this.invTypeCategory),
      isKycCompliant: 1,
      aadhaarNumber: null,
      mobileList,
      bio: null,
      remarks: null,
      emailList: [
        {
          email: (this.invTypeCategory == '1') ? this.basicDetails.controls.email.value : (this.invTypeCategory == '2') ? this.minorForm.value.gEmail : this.nonIndividualForm.controls.comEmail.value,
          verificationStatus: 0
        }
      ],
      guardianClientFamilyMappingModelList: gardianObj,
      invTypeCategory: 0,
      categoryTypeflag: null,
      anniversaryDate: null,
      gstin: (this.invTypeCategory == '3' || this.invTypeCategory == '4') ? this.nonIndividualForm.controls.gstinNum.value : null,
      companyStatus: ((this.invTypeCategory == '3' || this.invTypeCategory == '4') && this.nonIndividualForm.controls.comStatus.value != '') ? this.nonIndividualForm.controls.comStatus.value : null
    };
    obj.bio = this.basicDetailsData.bio;
    obj.remarks = this.basicDetailsData.remarks;
    obj.aadhaarNumber = this.basicDetailsData.aadhaarNumber;
    obj.martialStatusId = this.basicDetailsData.martialStatusId;
    obj.occupationId = (this.invTypeCategory == '3' || this.invTypeCategory == '4' && this.nonIndividualForm.controls.comOccupation.value != '') ? this.nonIndividualForm.controls.comOccupation.value : this.basicDetailsData.occupationId;
    obj.displayName = this.basicDetailsData.displayName;
    obj.anniversaryDate = this.datePipe.transform(this.basicDetailsData.anniversaryDate, 'dd/MM/yyyy');
    this.peopleService.editFamilyMemberDetails(obj).subscribe(
      data => {
        this.disableBtn = false;
        data.invTypeCategory = this.invTypeCategory;
        data.categoryTypeflag = 'familyMinor';
        if (flag == 'Next') {
          this.changeTabAndSendData(data);
        } else {
          this.barButtonOptions.active = false;
          this.close(data);
        }
      },
      err => {
        this.disableBtn = false;
        this.barButtonOptions.active = false;
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }

  // }
  close(data) {
    (data == 'close') ? this.cancelTab.emit('close') : this.subInjectService.changeNewRightSliderState({
      state: 'close',
      refreshRequired: true
    });
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
        let obj =
        {
          "familyMemberId": this.basicDetailsData.familyMemberId,
          "userId": this.basicDetailsData.familyMemberId
        }
        this.cusService.deleteFamilyMember(obj).subscribe(
          data => {
            this.eventService.openSnackBar('Deleted successfully!', 'Dismiss');
            dialogRef.close();
            this.close(data)
          },
          error => this.eventService.showErrorMessage(error)
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

  unmapFamilyMember(value) {
    const dialogData = {
      data: value,
      header: 'UNMAP',
      body: 'Are you sure you want to unmap?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'UNMAP',
      positiveMethod: () => {
        let obj =
        {
          "ownerClientId": this.basicDetailsData.clientId,
          "splitFamilyMemberId": this.basicDetailsData.familyMemberId
        }
        this.cusService.unmapFamilyMembers(obj).subscribe(
          data => {
            this.eventService.openSnackBar('unmapped successfully!', 'Dismiss');
            dialogRef.close();
            this.close(data)
          },
          error => this.eventService.showErrorMessage(error)
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

}
