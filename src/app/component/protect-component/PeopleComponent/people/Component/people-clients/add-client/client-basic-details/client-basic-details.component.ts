import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { DatePipe } from '@angular/common';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { individualJson, nonIndividualJson } from './client&leadJson';
import { relationListFilterOnID } from './relationypeMethods';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { MatDialog } from '@angular/material';
import { UnmapPopupComponent } from './unmap-popup/unmap-popup.component';
import { MoveFamilymemberToClientComponent } from './move-familymember-to-client/move-familymember-to-client.component';
import { DashboardService } from 'src/app/component/protect-component/AdviserComponent/dashboard/dashboard.service';
import { RoleService } from 'src/app/auth-service/role.service';
import { LeadsClientsComponent } from '../../../people-leads/leads-clients/leads-clients.component';
import { MfServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';
import { RoutingState } from 'src/app/services/routing-state.service';
import { CustomerOverviewService } from 'src/app/component/protect-component/customers/component/customer/customer-overview/customer-overview.service';
import { Subscription, Observable } from 'rxjs';
import { startWith, debounceTime } from 'rxjs/operators';

const moment = require('moment');

@Component({
  selector: 'app-client-basic-details',
  templateUrl: './client-basic-details.component.html',
  styleUrls: ['./client-basic-details.component.scss']
})
export class ClientBasicDetailsComponent implements OnInit, AfterViewInit {
  tempBasicData: any;
  userNameLoader: boolean;
  ngAfterViewInit(): void {
    if (this.tempBasicData.panInvalid) {
      this.eventService.openSnackBar("Please add pan before converting it to client", "Dimiss");
    }
  }
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
  @Output() tabDisableFlag = new EventEmitter();
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
  disableBtn = false;
  clientTypeList: any;
  tableGetData: any;
  taxStatusFormControl = new FormControl('', [Validators.required]);
  relationList: any[];
  callMethod: { methodName: string; ParamValue: any; disControl: any; };
  nomineesListFM: any = [];
  ownerData: any;
  idData;
  removedGaurdianList: any = [];
  emailData: any;
  valueChangeFlag: boolean;
  userData;
  unmapFmData: any;
  usernameOutputSubscription: Subscription;
  usernameOutputObservable: Observable<any> = new Observable<any>();
  // advisorId;

  constructor(private fb: FormBuilder, private enumService: EnumServiceService,
    private subInjectService: SubscriptionInject, private peopleService: PeopleService,
    private eventService: EventService, private datePipe: DatePipe,
    private utilService: UtilService, public enumDataService: EnumDataService,
    private cusService: CustomerService, private dialog: MatDialog,
    public roleService: RoleService,
    private MfServiceService: MfServiceService,
    public routingStateService: RoutingState,
    private customerOverview: CustomerOverviewService) {
  }

  @Input() set data(data) {
    this.userData = AuthService.getUserInfo();
    this.advisorId = AuthService.getAdvisorId();
    this.advisorData = AuthService.getUserInfo();
    this.basicDetailsData = data;
    this.tempBasicData = data;
    this.idData = (this.fieldFlag != 'familyMember') ? this.basicDetailsData.clientId : this.basicDetailsData.familyMemberId;
    if (data.fieldFlag == 'familyMember') {
      this.valueChangeFlag = true;
      if (data.familyMemberType == 3 || data.familyMemberType == 4) {
        this.invTypeCategory = String(data.familyMemberType);
        this.invTaxStatus = String(data.residentFlag);
        this.familyMemberType = data.familyMemberType == 4 ? {
          name: 'Sole proprietorship',
          value: '4'
        } : { name: 'Non individual', value: '3' };
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
        this.relationshipTypeMethod(this.basicDetailsData.genderId, this.basicDetailsData.age);
        if (this.basicDetailsData.age > 18) {
          (data.relationshipId != 10) ? (data.relationshipId == 4) ? data.genderId = 1 : data.genderId = 2 : '';
          this.familyMemberType = { name: 'Individual', value: '1' };
          this.invTypeCategory = '1';
          this.hideDematTab.emit(true);
          this.invTaxStatusList = this.enumService.getIndividualTaxList();
          this.createIndividualForm(this.basicDetailsData);
        } else {
          (data.relationshipId == 4) ? data.genderId = 1 : data.genderId = 2;
          this.familyMemberType = { name: 'Minor', value: '2' };
          this.invTypeCategory = '2';
          this.createMinorForm(this.basicDetailsData);
          this.invTaxStatusList = this.enumService.getMinorTaxList();
          this.hideDematTab.emit(false);
        }
      } else {
        this.relationList = relationListFilterOnID(AuthService.getClientData().clientType);
        if (this.basicDetailsData.age > 18) {
          this.familyMemberType = { name: 'Individual', value: '1' };
          this.invTypeCategory = '1';
          this.hideDematTab.emit(true);
          this.invTaxStatusList = this.enumService.getIndividualTaxList();
          this.createIndividualForm(this.basicDetailsData);
        } else {
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
        this.taxStatusList = this.invTaxStatusList.filter(element => element.residentFlag == true);
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
        } : (this.basicDetailsData.clientType == 2) ? {
          name: 'Minor',
          value: '2'
        } : (this.basicDetailsData.clientType == 3) ? {
          name: 'Non-individual',
          value: '3'
        } : { name: 'Sole proprietorship', value: '4' };
      } else {
        this.clientTypeList = (this.basicDetailsData.clientType == 1) ? {
          name: 'Individual',
          value: '1'
        } : (this.basicDetailsData.clientType == 3) ? {
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
    this.relationList = [
      { name: 'Wife', value: 3 },
      { name: 'Husband', value: 2 },
      { name: 'Father', value: 6 },
      { name: 'Mother', value: 7 },
      { name: 'Son', value: 4 },
      { name: 'Daughter', value: 5 },
      { name: 'Brother', value: 8 },
      { name: 'Sister', value: 9 },
      { name: 'Others', value: 10 },
      { name: 'Daughter_In_Law', value: 11 },
      { name: 'Sister_In_Law', value: 12 },
      { name: 'Grandmother', value: 13 },
      { name: 'Grandfather', value: 14 },
      { name: 'Niece', value: 15 },
      { name: 'Nephew', value: 16 },
    ];
    // }
  }
  keyInfoCapability: any = {};

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientRoles = this.enumService.getClientRole();
    console.log(this.clientRoles, 'this.clientRoles 123A');
    console.log('tax status data', this.enumDataService.getDataForTaxMasterService());
    this.keyInfoCapability = this.roleService.overviewPermission.subModules.profile.subModule.keyInfo.capabilityList
  }

  toUpperCase(formControl, event) {
    this.utilService.toUpperCase(formControl, event);
  }

  createIndividualForm(data) {
    (data == undefined) ? data = {} : '';
    this.basicDetails = this.fb.group({
      fullName: [data.name, [Validators.required]],
      pan: [data.pan, [Validators.pattern(this.validatorType.PAN)]],
      username: [data.userName],
      dobAsPerRecord: [(data.dateOfBirth == null) ? '' : new Date(data.dateOfBirth)],
      gender: [(data.genderId) ? String(data.genderId) : '', [Validators.required]],
      relationType: [(data.relationshipId != 0) ? data.relationshipId : ''],
      leadSource: [(data.leadSource) ? data.leadSource : ''],
      leaadStatus: [(data.leadStatus) ? String(data.leadStatus) : ''],
      leadRating: [(data.leadRating) ? String(data.leadRating) : ''],
      leadOwner: [this.selectedClientOwner, (this.fieldFlag == 'lead') ? [Validators.required] : null],
      clientOwner: [this.selectedClientOwner, (this.fieldFlag == 'client') ? [Validators.required] : null],
      role: [(data.roleId) ? data.roleId : '', (this.fieldFlag != 'familyMember') ? [Validators.required] : null],
    });

    if (this.fieldFlag != 'familyMember') {
      // this.basicDetails.controls.email.setValidators([Validators.required, Validators.pattern(this.validatorType.EMAIL)]);
      this.basicDetails.controls.pan.setValidators([Validators.required, Validators.pattern(this.validatorType.PAN)]);
    } else {
      this.basicDetails.controls.relationType.setValidators([Validators.required]);
      this.basicDetails.controls.relationType.updateValueAndValidity();
    }
    if (this.fieldFlag == 'client') {
      if (this.basicDetailsData.userId) {
        this.basicDetails.controls.username.setValidators([Validators.required]);
      }
    }
    if (this.fieldFlag == 'lead') {
      this.basicDetails.controls.pan.setValidators([Validators.pattern(this.validatorType.PAN)]);
    }
    // this.basicDetails.controls.email.updateValueAndValidity();
    this.basicDetails.controls.pan.updateValueAndValidity();
    if (this.userData.userType == 2 && this.basicDetailsData.userId) {
      this.basicDetails.controls.leadOwner.disable();
      this.basicDetails.controls.clientOwner.disable();
      this.basicDetails.controls.role.disable();
    }
    this.basicDetails.valueChanges.subscribe(data => {
      if (this.valueChangeFlag) {
        this.tabDisableFlag.emit(true);
      }
    });
  }

  createMinorForm(data) {
    (data == undefined) ? data = {} : '';
    this.minorForm = this.fb.group({
      minorFullName: [data.name, [Validators.required]],
      dobAsPerRecord: [(data.dateOfBirth == null) ? '' : new Date(data.dateOfBirth)],
      gender: [(data.genderId) ? String(data.genderId) : '1'],
      relationType: [(data.relationshipId != 0) ? data.relationshipId : ''],
      pan: [data.pan, [Validators.pattern(this.validatorType.PAN)]],
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

    if (data.guardianClientFamilyMappingModelList && data.guardianClientFamilyMappingModelList.length > 0) {
      this.getCoOwner.removeAt(0);
      data.guardianClientFamilyMappingModelList.forEach(element => {
        setTimeout(() => {
          element.disable = true;
        }, 1300);
        this.addNewCoOwner(element);
      });
    }
    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.minorForm };
    this.minorForm.valueChanges.subscribe(data => {
      if (this.valueChangeFlag) {

      }
    });
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
    if (this.getCoOwner.controls[item].value.id) {
      this.removedGaurdianList.push(this.getCoOwner.controls[item].value);
    }
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
    value = value.filter(element => element.familyMemberType != 2);
    this.ownerData.Fmember = value;
    this.nomineesListFM = Object.assign([], value);
  }


  createNonIndividualForm(data) {
    (data == undefined) ? data = {} : '';
    this.nonIndividualForm = this.fb.group({
      comName: [data.name, [Validators.required]],
      dateOfIncorporation: [(data.dateOfBirth) ? new Date(data.dateOfBirth) : ''],
      comStatus: [(data.companyStatus) ? String(data.companyStatus) : '', [Validators.required]],
      comPan: [data.pan, [Validators.required, Validators.pattern(this.validatorType.PAN)]],
      gstinNum: [data.gstin, [Validators.pattern('^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$')]],
      comOccupation: [(data.occupationId) ? String(data.occupationId) : ''],
      username: [data.userName],
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
      if (this.basicDetailsData.userId) {
        this.nonIndividualForm.controls.username.setValidators([Validators.required]);
      }
    }
    if (this.userData.userType == 2 && this.basicDetailsData.userId) {
      this.nonIndividualForm.controls.leadOwner.disable();
      this.nonIndividualForm.controls.clientOwner.disable();
      this.nonIndividualForm.controls.role.disable();
    }
    if (this.fieldFlag == 'lead') {
      this.nonIndividualForm.controls.comPan.setValidators([Validators.pattern(this.validatorType.PAN)]);
    }
    this.nonIndividualForm.valueChanges.subscribe(data => {
      if (this.valueChangeFlag) {

      }
    });
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
          this.valueChangeFlag = true;
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

  getEmailDetails(data) {
    this.emailData = data;
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
    this.changeTaxStatus(1);
  }

  changeTaxStatus(event) {
    this.invTaxStatus = String(event);
  }

  addRole(role) {
    this.sendRole = role;
  }

  saveNextClient(flag) {
    this.emailData.markAllAsTouched();
    if (this.invTypeCategory == '1' && this.basicDetails.get('gender').invalid) {
      this.eventService.openSnackBar('Please select gender', 'Dimiss');
      return;
    }
    if (this.invTypeCategory == '1' && this.basicDetails.invalid) {
      this.basicDetails.markAllAsTouched();
      return;
    }
    if (this.invTypeCategory == '2' && this.minorForm.invalid) {
      this.minorForm.markAllAsTouched();
      return;
    }
    if (this.invTypeCategory == '3' && this.nonIndividualForm.invalid) {
      this.emailData.markAllAsTouched();
      this.nonIndividualForm.markAllAsTouched();
      return;
    }
    if (this.invTypeCategory == '4' && this.nonIndividualForm.invalid) {
      this.emailData.markAllAsTouched();
      this.nonIndividualForm.markAllAsTouched();
      return;
    }
    if (this.emailData.invalid) {
      this.emailData.markAllAsTouched();
      return;
    } else if (this.mobileData.invalid) {
      this.mobileData.markAllAsTouched();
    } else {
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

      if (this.emailData.length == 1) {
        this.emailData.controls[0].get('markAsPrimary').setValue(true);
      }

      let count = 0;
      let emailList = [];
      if (this.emailData.valid) {
        this.emailData.controls.forEach(element => {
          if (element.get('markAsPrimary').value) {
            count++;
          }
          emailList.push({
            userType: 2,
            email: element.get('emailAddress').value,
            defaultFlag: element.get('markAsPrimary').value
          });
        });
      }
      emailList = emailList.sort(function (a, b) {
        return b.defaultFlag - a.defaultFlag;
      });
      if (count == 0) {
        this.eventService.openSnackBar('Please mark one email as a primary', 'Dimiss');
        return;
      }
      (flag == 'close') ? this.barButtonOptions.active = true : this.disableBtn = true;
      let gardianObj;
      let obj: any = {
        parentAdvisorId: this.advisorId,
        adminAdvisorId: AuthService.getAdminId(),
        advisorId: advisorId,
        residentFlag: parseInt(this.invTaxStatus),
        advisorOrClientRole: (this.sendRole) ? this.sendRole.advisorOrClientRole : this.basicDetailsData.advisorOrClientRole,
        userId: this.basicDetailsData.userId,
        clientId: this.basicDetailsData.clientId,
        status: (this.fieldFlag == 'client') ? 1 : 2,
        clientType: parseInt(this.invTypeCategory)
      };
      if (this.invTypeCategory == 1) {
        obj.dateOfBirth = this.datePipe.transform(this.basicDetails.controls.dobAsPerRecord.value, 'dd/MM/yyyy');
        obj = {
          ...obj,
          ...individualJson(this.basicDetails, emailList, mobileList)
        };
      }
      if (this.invTypeCategory == 2) {
      }

      if (this.invTypeCategory == 3 || this.invTypeCategory == 4) {
        obj.dateOfBirth = this.datePipe.transform(this.nonIndividualForm.value.dateOfIncorporation, 'dd/MM/yyyy');
        obj.gstin = this.nonIndividualForm.controls.gstinNum.value;
        obj = {
          ...obj,
          ...nonIndividualJson(this.nonIndividualForm, emailList, mobileList)
        };
      }
      if (this.basicDetailsData.userId == null) {
        if (obj.pan == undefined || obj.pan == '' && this.fieldFlag == 'lead') {
          obj.pan = "XXXXX1234X"
        }
        obj.sendEmail = true;
        this.peopleService.addClient(obj).subscribe(
          data => {
            this.disableBtn = false;
            this.barButtonOptions.active = false;
            console.log(data);
            DashboardService.dashKeyMetrics = null;
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
        if (obj.pan == undefined || obj.pan == '' && this.fieldFlag == 'lead') {
          obj.pan = "XXXXX1234X"
        }
        obj.bio = this.basicDetailsData.bio;
        obj.remarks = this.basicDetailsData.remarks;
        obj.aadhaarNumber = this.basicDetailsData.aadhaarNumber;
        obj.martialStatusId = this.basicDetailsData.martialStatusId;
        // obj['taxStatusId'] = taxStatusId;
        obj.anniversaryDate = this.datePipe.transform(this.basicDetailsData.anniversaryDate, 'dd/MM/yyyy');
        // (this.invTypeCategory == '2') ? '' : obj.occupationId = this.basicDetailsData.occupationId;
        this.peopleService.editClient(obj).subscribe(
          data => {
            this.tabDisableFlag.emit(false);
            this.valueChangeFlag = true;
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
              if (this.tempBasicData.panInvalid) {
                this.Open('clientcovertLead', data)
                return;
              }
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
    if (this.invTypeCategory == '1' && this.basicDetails.get('gender').invalid) {
      this.eventService.openSnackBar('Please select gender', 'Dimiss');
      return;
    }
    if (this.invTypeCategory == '1' && this.basicDetails.invalid) {
      this.emailData.markAllAsTouched();
      this.basicDetails.markAllAsTouched();
      return;
    }
    if (this.invTypeCategory == '2' && this.minorForm.invalid) {
      this.minorForm.markAllAsTouched();
      return;
    }
    if ((this.invTypeCategory == '3' || this.invTypeCategory == '4') && this.nonIndividualForm.invalid) {
      this.emailData.markAllAsTouched();
      this.nonIndividualForm.markAllAsTouched();
      return;
    }
    if (this.emailData && this.emailData.invalid) {
      this.emailData.markAllAsTouched();
      return;
    }
    if (this.invTypeCategory == '2') {
      this.getCoOwner.value.forEach(element => {
        delete element.name,
          delete element.share;
        gardianObj.push(element);
      });
      if (this.removedGaurdianList.length > 0) {
        this.removedGaurdianList.forEach(element => {
          delete element.name,
            delete element.share;
          element.active = false;
          gardianObj.push(element);
        });
      }
    } else {
      gardianObj = null;
    }
    let emailList = [];
    let count = 0;
    if (this.emailData && this.emailData.valid) {
      if (this.emailData.length == 1) {
        this.emailData.controls[0].get('markAsPrimary').setValue(true);
      }
      this.emailData.controls.forEach(element => {
        if (element.get('markAsPrimary').value) {
          count++;
        }
        emailList.push({
          email: element.get('emailAddress').value,
          defaultFlag: element.get('markAsPrimary').value,
          verificationStatus: 0,
          id: element.get('id').value
        });
      });
      emailList = emailList.sort(function (a, b) {
        return b.defaultFlag - a.defaultFlag;
      });
      if (count == 0) {
        this.eventService.openSnackBar('Please mark one email as a primary', 'Dimiss');
        return;
      }
    }


    (flag == 'close') ? this.barButtonOptions.active = true : this.disableBtn = true;

    const obj = {
      adminAdvisorId: AuthService.getAdminId(),
      advisorId: AuthService.getClientData().advisorId,
      familyMemberId: this.basicDetailsData.familyMemberId,
      clientId: this.basicDetailsData.clientId,
      name: (this.invTypeCategory == '1') ? this.basicDetails.controls.fullName.value : (this.invTypeCategory == '2') ? this.minorForm.value.minorFullName : this.nonIndividualForm.controls.comName.value,
      displayName: (this.invTypeCategory == '1') ? this.basicDetails.controls.fullName.value : (this.invTypeCategory == '2') ? this.minorForm.value.minorFullName : this.nonIndividualForm.controls.comName.value,
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
      emailList: undefined,
      guardianClientFamilyMappingModelList: gardianObj,
      invTypeCategory: 0,
      categoryTypeflag: null,
      anniversaryDate: null,
      gstin: (this.invTypeCategory == '3' || this.invTypeCategory == '4') ? this.nonIndividualForm.controls.gstinNum.value : null,
      companyStatus: ((this.invTypeCategory == '3' || this.invTypeCategory == '4') && this.nonIndividualForm.controls.comStatus.value != '') ? this.nonIndividualForm.controls.comStatus.value : null
    };

    if (this.invTypeCategory != 2) {
      obj.emailList = emailList;
    } else {
      delete obj.emailList;
    }


    obj.bio = this.basicDetailsData.bio;
    obj.remarks = this.basicDetailsData.remarks;
    obj.aadhaarNumber = this.basicDetailsData.aadhaarNumber;
    obj.martialStatusId = this.basicDetailsData.martialStatusId;
    obj.occupationId = ((this.invTypeCategory == '3' || this.invTypeCategory == '4') && this.nonIndividualForm.controls.comOccupation.value !== '') ? parseInt(this.nonIndividualForm.controls.comOccupation.value) : this.basicDetailsData.occupationId;
    // obj.displayName = this.basicDetailsData.displayName;
    obj.anniversaryDate = this.datePipe.transform(this.basicDetailsData.anniversaryDate, 'dd/MM/yyyy');
    this.peopleService.editFamilyMemberDetails(obj).subscribe(
      data => {
        this.tabDisableFlag.emit(false);
        this.valueChangeFlag = true;
        this.disableBtn = false;
        data.invTypeCategory = this.invTypeCategory;
        data.categoryTypeflag = 'familyMinor';
        if (flag == 'Next') {
          this.changeTabAndSendData(data);
        } else {
          if (this.unmapFmData && this.unmapFmData.email) {
            const obj = {
              ownerClientId: this.basicDetailsData.clientId,
              splitFamilyMemberId: this.basicDetailsData.familyMemberId
            };
            this.cusService.unmapFamilyMembers(obj).subscribe(
              data => {
                this.eventService.openSnackBar('unmapped successfully!', 'Dismiss');
                this.close(data);
              },
              error => this.eventService.showErrorMessage(error)
            );
          } else {
            this.barButtonOptions.active = false;
            this.close(data);
          }
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
        const obj = {
          familyMemberId: this.basicDetailsData.familyMemberId,
          userId: this.basicDetailsData.familyMemberId
        };
        this.cusService.deleteFamilyMember(obj).subscribe(
          data => {
            this.eventService.openSnackBar('Deleted successfully!', 'Dismiss');
            dialogRef.close();
            this.close(data);
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

  promoteModal(value) {
    const dialogData = {
      data: value,
      header: 'PROMOTE',
      body: 'Are you sure you want to promote?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'PROMOTE',
      positiveMethod: () => {
        const obj = {
          familyMemberId: this.basicDetailsData.familyMemberId,
          relationshipId: 0
        };
        this.peopleService.promoteToClient(obj).subscribe(
          data => {
            this.eventService.openSnackBar('Promoted successfully!', 'Dismiss');
            dialogRef.close();
            this.close(data);
            this.goToAdvisorHome();
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

  goToAdvisorHome() {
    this.customerOverview.clearServiceData();
    setTimeout(() => {
      localStorage.removeItem('clientData');
      sessionStorage.removeItem('clientData');
      sessionStorage.removeItem('clientList')
      this.routingStateService.goToSpecificRoute('/admin/people');
    }, 200);
    this.MfServiceService.clearStorage();
  }

  openUnmapPopupORNot() {
    let obj;
    if (this.basicDetailsData.familyMemberType != 2) {
      if (this.basicDetails.get('pan').value == '' || this.mobileData.controls[0].get('number').value == undefined || this.mobileData.controls[0].get('number').value == '' || this.emailData.controls[0].get('emailAddress').value == undefined || this.emailData.controls[0].get('emailAddress').value == '') {
        obj = {
          showField: true,
          fieldData: {
            email: this.emailData.controls[0].get('emailAddress').value,
            number: this.mobileData.controls[0].get('number').value,
            pan: this.basicDetails.get('pan').value
          }
        };

        const dialogRef = this.dialog.open(UnmapPopupComponent, {
          data: obj
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
          if (result && result.email) {
            this.unmapFmData = result;
            this.basicDetails.get('pan').setValue(result.pan);
            this.mobileData.controls[0].get('number').setValue(result.number);
            this.emailData.controls[0].get('emailAddress').setValue(result.email);
            this.saveNextFamilyMember('close');
          }
        });
      } else {
        this.unmapFamilyMember('FAMILY MEMBER');
      }
    } else {
      obj = { showField: false };
      const dialogRef = this.dialog.open(UnmapPopupComponent, {
        data: obj
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
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
        const obj = {
          ownerClientId: this.basicDetailsData.clientId,
          splitFamilyMemberId: this.basicDetailsData.familyMemberId
        };
        this.cusService.unmapFamilyMembers(obj).subscribe(
          data => {
            this.eventService.openSnackBar('unmapped successfully!', 'Dismiss');
            dialogRef.close();
            this.close(data);
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

  openMoveFamilymemberToClient(flag, fieldFlag) {
    const fragmentData = {
      flag: flag,
      data: { value: this.basicDetailsData, flag: flag, fieldFlag: fieldFlag },
      id: 1,
      state: 'open50',
      componentName: MoveFamilymemberToClientComponent,
    };
    this.subInjectService.changeNewRightSliderState(fragmentData);
  }

  Open(value, data) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open50',
      componentName: LeadsClientsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  checkValidUsername(userName) {
    if (this.basicDetailsData.userName == userName) {
      return;
    }
    const obj = {
      userName: userName,
      userId: this.basicDetailsData.userId
    }
    if (this.usernameOutputSubscription && !this.usernameOutputSubscription.closed) {
      this.usernameOutputSubscription.unsubscribe();
    }
    this.usernameOutputSubscription = this.usernameOutputObservable.pipe(startWith(''),
      debounceTime(700)).subscribe(
        data => {
          this.userNameLoader = true;
          this.peopleService.checkValidUsername(obj).subscribe(data => {
            this.userNameLoader = false;
            if (data) {

            }
          }), err => {
            this.userNameLoader = false;
            if (userName.length > 0)
              if (this.basicDetailsData.clientType == 1) {
                this.basicDetails.get('username').setErrors({ invalid: true });
              } else {
                this.nonIndividualForm.get('username').setErrors({ invalid: true });
              }
          }
        }
      );
  }


}
