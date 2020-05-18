import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilService, ValidatorType} from 'src/app/services/util.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {AuthService} from 'src/app/auth-service/authService';
import {PeopleService} from 'src/app/component/protect-component/PeopleComponent/people.service';
import {EventService} from 'src/app/Data-service/event.service';
import {DatePipe} from '@angular/common';
import {EnumServiceService} from 'src/app/services/enum-service.service';
import {MatProgressButtonOptions} from 'src/app/common/progress-button/progress-button.component';
import {EnumDataService} from 'src/app/services/enum-data.service';

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
  countryCodeFlag: any;
  sendRole: any;
  disableBtn: boolean = false;
  clientTypeList: any;
  tableGetData: any;
  taxStatusFormControl = new FormControl('', [Validators.required]);

  // advisorId;

  constructor(private fb: FormBuilder, private enumService: EnumServiceService,
              private subInjectService: SubscriptionInject, private peopleService: PeopleService,
              private eventService: EventService, private datePipe: DatePipe,
              private utilService: UtilService, private enumDataService: EnumDataService) {
  }

  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.advisorData = AuthService.getUserInfo();
    if (data.fieldFlag == 'familyMember') {
      (data.relationshipId == 2 || data.relationshipId == 4 || data.relationshipId == 5) ?
        data.genderId = 2 : (data.relationshipId == 3 || data.relationshipId == 6) ?
        data.genderId = 1 : data.genderId = 3;
      this.basicDetailsData = data;
      if (this.basicDetailsData.relationshipId == 2 || this.basicDetailsData.relationshipId == 6
        || this.basicDetailsData.relationshipId == 5 || this.basicDetailsData.relationshipId == 7) {
        this.familyMemberType = {name: 'Individual', value: '1'};
        this.invTypeCategory = '1';
        this.createIndividualForm(this.basicDetailsData);
      } else {
        this.familyMemberType = {name: 'Minor', value: '2'};
        this.invTypeCategory = '2';
        this.createMinorForm(this.basicDetailsData);
      }
      this.invTaxStatus = (this.basicDetailsData.taxStatusId == 0) ? '' : String(this.basicDetailsData.taxStatusId);
      (this.basicDetailsData.familyMemberType == 1 || this.basicDetailsData.familyMemberType == 0) ?
        this.createIndividualForm(this.basicDetailsData) : this.createMinorForm(this.basicDetailsData);
    } else {
      this.getClientList();
      this.basicDetailsData = data;
      if (this.basicDetailsData.userId == null) {
        this.invTypeCategory = '1';
        this.invTaxStatus = '';
        this.selectedClientOwner = '';
        this.createIndividualForm(null);
        return;
      } else {
        // this.selectedClientOwner = (this.tableGetData.userId) ? this.tableGetData.advisorId : '';
        this.selectedClientOwner = this.basicDetailsData.advisorId;
        this.invTypeCategory = (data.clientType == 1 || data.clientType == 0) ? '1' : String(data.clientType);
        this.invTaxStatus = (this.basicDetailsData.taxStatusId == 0) ? '' : String(this.basicDetailsData.taxStatusId);
      }
      (this.invTypeCategory == '1') ? this.createIndividualForm(this.basicDetailsData) : (this.fieldFlag == 'client' && this.invTypeCategory == '2') ? this.createMinorForm(this.basicDetailsData) : this.createNonIndividualForm(this.basicDetailsData);
      if (this.fieldFlag == 'client') {
        this.clientTypeList = (this.basicDetailsData.clientType == 1) ? {
          name: 'Individual',
          value: '1'
        } : (this.basicDetailsData.clientType == 2) ? {name: 'Minor', value: '2'} : {name: 'Non-individual', value: '3'};
      } else {
        this.clientTypeList = (this.basicDetailsData.clientType == 1) ? {name: 'Individual', value: '1'} : {
          name: 'Non-individual',
          value: '3'
        };
      }
      // (data.clientType == 1 || data.clientType == 0) ? this.createIndividualForm(data) : this.createNonIndividualForm(data);
      this.getClientOrLeadData(this.basicDetailsData);
    }
    console.log(data);
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
      username: [{value: data.userName, disabled: true}],
      dobAsPerRecord: [(data.dateOfBirth == null) ? '' : new Date(data.dateOfBirth)],
      gender: [(data.genderId) ? String(data.genderId) : '1'],
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
    this.basicDetails.controls.email.updateValueAndValidity();
    this.basicDetails.controls.pan.updateValueAndValidity();
  }

  createMinorForm(data) {
    (data == undefined) ? data = {} : '';
    this.minorForm = this.fb.group({
      minorFullName: [data.name, [Validators.required]],
      dobAsPerRecord: [(data.dateOfBirth == null) ? '' : new Date(data.dateOfBirth)],
      gender: [(data.genderId) ? String(data.genderId) : '1'],
      gFullName: [(data.guardianData) ? data.guardianData.name : '', [Validators.required]],
      gDobAsPerRecord: [(data.guardianData) ? new Date(data.guardianData.birthDate) : ''],
      gGender: [(data.guardianData) ? String(data.genderId) : '1'],
      relationWithMinor: [(data.guardianData) ? (data.guardianData.relationshipId != 0) ? String(data.guardianData.relationshipId) : '' : ''],
      gEmail: [(data.emailList && data.emailList.length > 0) ? data.emailList[0].email : '', [Validators.pattern(this.validatorType.EMAIL)]],
      pan: [data.pan, [Validators.pattern(this.validatorType.PAN)]],
      clientOwner: [this.selectedClientOwner, (this.fieldFlag == 'client') ? [Validators.required] : null],
      role: [(data.roleId) ? data.roleId : '', (this.fieldFlag != 'familyMember') ? [Validators.required] : null],
    });
    if (this.fieldFlag == 'client') {
      this.minorForm.controls.gEmail.setValidators([Validators.required, Validators.pattern(this.validatorType.EMAIL)]);
      this.minorForm.controls.pan.setValidators([Validators.required, Validators.pattern(this.validatorType.PAN)]);
    }
    if (this.fieldFlag == 'client' && this.basicDetailsData.name) {
      this.minorForm.controls.gEmail.disable();
      this.minorForm.controls.pan.disable();
    }
    this.minorForm.controls.gEmail.updateValueAndValidity();
    this.minorForm.controls.pan.updateValueAndValidity();
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
      comOccupation: [(data.occupationId) ? String(data.occupationId) : ''],
      username: [{value: data.userName, disabled: true}],
      leadSource: [data.leadSource ? data.leadSource : ''],
      leadStatus: [(data.leadStatus) ? String(data.leadStatus) : ''],
      leadRating: [(data.leadRating) ? String(data.leadRating) : ''],
      leadOwner: [this.selectedClientOwner, (this.fieldFlag == 'lead') ? [Validators.required] : null],
      clientOwner: [this.selectedClientOwner, (this.fieldFlag == 'client') ? [Validators.required] : null],
      role: [(data.roleId) ? data.roleId : '', Validators.required]
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
      this.invTaxStatus = '';
      this.mobileNumberFlag = 'Mobile number';
      // this.invTaxStatusList = this.enumService.getIndividualTaxList();
      console.log(this.invTaxStatusList);
    } else if (event.value == '2' && (this.fieldFlag == 'familyMember' || this.fieldFlag == 'client')) {
      this.invTaxStatus = '';
      this.createMinorForm(this.basicDetailsData);
      this.mobileNumberFlag = 'Mobile number';
      // this.invTaxStatusList = this.enumService.getMinorTaxList();
      console.log(this.invTaxStatusList);
    } else {
      this.invTaxStatus = '';
      this.createNonIndividualForm(this.basicDetailsData);
      this.mobileNumberFlag = 'Company mobile number';
      // this.invTaxStatusList = this.enumService.getCorporateTaxList();
      console.log(this.invTaxStatusList);
    }
    this.taxStatusFormControl.reset();
    this.taxStatusFormControl.setValue('');
    this.invTypeCategory = event.value;
  }

  changeTaxStatus(event) {
    this.invTaxStatus = event.value;
  }

  addRole(role) {
    this.sendRole = role;
  }

  saveNextClient(flag) {
    this.taxStatusFormControl.markAllAsTouched();
    if (this.invTypeCategory == '1' && this.basicDetails.invalid) {
      this.basicDetails.markAllAsTouched();
      return;
    }
    if (this.fieldFlag == 'client' && this.invTypeCategory == '2' && this.minorForm.invalid) {
      this.minorForm.markAllAsTouched();
      return;
    }
    if (((this.fieldFlag == 'client' && this.invTypeCategory == '3') || (this.fieldFlag == 'lead' && this.invTypeCategory == '3')) && this.nonIndividualForm.invalid) {
      this.nonIndividualForm.markAllAsTouched();
      return;
    } else if (this.taxStatusFormControl.invalid) {
      return;
    } else if (this.mobileData.invalid) {
      this.mobileData.markAllAsTouched();
    } else {
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
      // else {
      //   advisorId = this.basicDetailsData.advisorId;
      // }
      const emailId = (this.invTypeCategory == '1') ? this.basicDetails.controls.email.value : (this.fieldFlag == 'client' && this.invTypeCategory == '2') ? this.minorForm.controls.gEmail.value : this.nonIndividualForm.controls.comEmail.value;
      const emailList = [];
      if (emailId) {
        emailList.push({
          userType: 2,
          email: emailId
        });
      }
      let gardianObj;
      if (this.fieldFlag == 'client' && this.invTypeCategory == '2') {
        gardianObj = {
          name: this.minorForm.value.gFullName,
          birthDate: this.datePipe.transform(this.minorForm.value.gDobAsPerRecord, 'dd/MM/yyyy'),
          pan: 'pan',
          genderId: this.minorForm.value.gGender,
          relationshipId: (this.minorForm.value.relationWithMinor != '') ? this.minorForm.value.relationWithMinor : null,
          aadhaarNumber: (this.basicDetailsData.guardianData) ? this.basicDetailsData.guardianData.aadhaarNumber : null,
          occupationId: 1,
          martialStatusId: 1,
          anniversaryDate: null,
          mobileList: mobileList,
          emailList: [
            {
              email: this.minorForm.value.gEmail,
              userType: 4,
              verificationStatus: 0
            }
          ]
        };
      } else {
        gardianObj = {};
      }
      const obj: any = {
        parentAdvisorId: this.advisorId,
        advisorId,
        taxStatusId: parseInt(this.invTaxStatus),
        emailList,
        bio: null,
        martialStatusId: 0,
        clientType: parseInt(this.invTypeCategory),
        pan: (this.invTypeCategory == '1') ? this.basicDetails.controls.pan.value : (this.fieldFlag == 'client' && this.invTypeCategory == '2') ? this.minorForm.controls.pan.value : this.nonIndividualForm.controls.comPan.value,
        clientId: (this.basicDetailsData == null) ? null : this.basicDetailsData.clientId,
        kycComplaint: 0,
        roleId: (this.invTypeCategory == '1') ? this.basicDetails.value.role : (this.fieldFlag == 'client' && this.invTypeCategory == '2') ? this.minorForm.controls.role.value : this.nonIndividualForm.value.role,
        advisorOrClientRole: (this.sendRole) ? this.sendRole.advisorOrClientRole : this.basicDetailsData.advisorOrClientRole,
        genderId: (this.invTypeCategory == '1') ? parseInt(this.basicDetails.controls.gender.value) : (this.fieldFlag == 'client' && this.invTypeCategory == '2') ? this.minorForm.controls.gender.value : null,
        dateOfBirth: this.datePipe.transform((this.invTypeCategory == '1') ? this.basicDetails.controls.dobAsPerRecord.value : (this.fieldFlag == 'client' && this.invTypeCategory == '2') ?
          this.minorForm.controls.dobAsPerRecord.value : this.nonIndividualForm.value.dateOfIncorporation, 'dd/MM/yyyy'),
        userName: (this.invTypeCategory == '1') ? this.basicDetails.controls.username.value : (this.fieldFlag == 'client' && this.invTypeCategory == '2') ? null : this.nonIndividualForm.value.username,
        userId: (this.fieldFlag == 'client' || this.fieldFlag == 'lead') ? this.basicDetailsData.userId : null,
        mobileList,
        referredBy: 0,
        name: (this.invTypeCategory == '1') ? this.basicDetails.controls.fullName.value : (this.fieldFlag == 'client' && this.invTypeCategory == '2') ? this.minorForm.controls.minorFullName.value : this.nonIndividualForm.value.comName,
        displayName: (this.invTypeCategory == '1') ? this.basicDetails.controls.fullName.value : (this.fieldFlag == 'client' && this.invTypeCategory == '2') ? null : this.nonIndividualForm.value.comName,
        bioRemarkId: 0,
        userType: 2,
        remarks: null,
        status: (this.fieldFlag == 'client') ? 1 : 2,
        leadSource: (this.fieldFlag == 'lead' && this.invTypeCategory == '1' && this.basicDetails.value.leadSource != '') ? this.basicDetails.value.leadSource : (this.fieldFlag == 'lead' && this.invTypeCategory == '3' && this.nonIndividualForm.value.leadSource != '') ? this.nonIndividualForm.value.leadSource : null,
        leadRating: (this.fieldFlag == 'lead' && this.invTypeCategory == '1' && this.basicDetails.value.leadRating != '') ? this.basicDetails.value.leadRating : (this.fieldFlag == 'lead' && this.invTypeCategory == '3' && this.nonIndividualForm.value.leadRating != '') ? this.nonIndividualForm.value.leadRating : null,
        companyStatus: ((this.fieldFlag == 'client' && this.invTypeCategory == '3') || (this.fieldFlag == 'lead' && this.invTypeCategory == '3')) ? this.nonIndividualForm.value.comStatus : null,
        leadStatus: (this.fieldFlag == 'lead' && this.invTypeCategory == '1' && this.basicDetails.value.leaadStatus != '') ? this.basicDetails.value.leaadStatus : (this.fieldFlag == 'lead' && this.invTypeCategory == '3' && this.nonIndividualForm.value.leadStatus != '') ? this.nonIndividualForm.value.leadStatus : null,
        occupationId: (this.fieldFlag == 'client' && this.invTypeCategory != '3') ? this.basicDetailsData.occupationId : (this.fieldFlag == 'lead' && this.invTypeCategory == '1') ? this.basicDetailsData.occupationId : (this.nonIndividualForm.controls.comOccupation.value != '') ? this.nonIndividualForm.controls.comOccupation.value : null,
        guardianData: gardianObj.name ? gardianObj : null
      };
      if (this.basicDetailsData.userId == null) {
        // if (this.invTypeCategory == '2') {
        //   obj['userId'] = this.basicDetailsData.clientId;
        // }
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

        // else {
        // this.peopleService.saveCompanyPersonDetail(obj).subscribe(
        //   data => {
        //     this.barButtonOptions.active = false;
        //     console.log(data);
        //     data.invCategory = this.invTypeCategory;
        //     data.categoryTypeflag = 'clientNonIndividual';
        //     this.eventService.openSnackBar('Added successfully!', 'Dismiss');
        //     (flag == 'Next') ? this.changeTabAndSendData(data) : this.close(obj);
        //   },
        //   (err) => {
        //     this.eventService.openSnackBar(err, 'Dismiss');
        //     this.barButtonOptions.active = false;
        //   }
        // );
        // }
      } else {
        obj.bio = this.basicDetailsData.bio;
        obj.remarks = this.basicDetailsData.remarks;
        obj.aadhaarNumber = this.basicDetailsData.aadhaarNumber;
        obj.martialStatusId = this.basicDetailsData.martialStatusId;
        // (this.invTypeCategory == '2') ? '' : obj.occupationId = this.basicDetailsData.occupationId;
        this.peopleService.editClient(obj).subscribe(
          data => {
            this.disableBtn = false;
            this.barButtonOptions.active = false;
            console.log(data);
            data.invCategory = this.invTypeCategory;
            data.categoryTypeflag = (this.invTypeCategory == '1') ? 'Individual' : 'clientNonIndividual';
            this.eventService.openSnackBar('Updated successfully!', 'Dismiss');
            if (flag == 'Next') {
              this.changeTabAndSendData(data);
            } else {
              this.barButtonOptions.active = false;
              this.close(data);
            }
          },
          (err) => {
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
    // this.basicDetails.get('clientOwner').setValidators(null);
    this.taxStatusFormControl.markAllAsTouched();
    const mobileList = [];
    this.mobileData.controls.forEach(element => {
      console.log(element);
      mobileList.push({
        mobileNo: element.get('number').value,
        verificationStatus: 0,
        isdCodeId: element.get('code').value
      });
    });
    if (this.invTypeCategory == '1') {
      this.basicDetails.get('role').clearValidators();
      this.basicDetails.get('role').updateValueAndValidity();
    }
    let gardianObj;
    if (this.invTypeCategory == '2') {
      gardianObj = {
        name: (this.invTypeCategory == '2') ? this.minorForm.value.gFullName : null,
        birthDate: (this.invTypeCategory == '2') ? this.datePipe.transform(this.minorForm.value.gDobAsPerRecord, 'dd/MM/yyyy') : null,
        pan: 'pan',
        genderId: (this.invTypeCategory == '2') ? this.minorForm.value.gGender : null,
        relationshipId: (this.minorForm.value.relationWithMinor != '') ? this.minorForm.value.relationWithMinor : null,
        aadhaarNumber: (this.basicDetailsData.guardianData) ? this.basicDetailsData.guardianData.aadhaarNumber : null,
        occupationId: 1,
        martialStatusId: 1,
        anniversaryDate: null,
        mobileList: (this.invTypeCategory == '2') ? mobileList : null,
        emailList: [
          {
            email: (this.invTypeCategory == '2') ? this.minorForm.value.gEmail : null,
            userType: 4,
            verificationStatus: 0
          }
        ]
      };
      this.minorForm.get('role').clearValidators();
      this.minorForm.get('role').updateValueAndValidity();
    } else {
      gardianObj = null;
    }
    if (this.invTypeCategory == '1' && this.basicDetails.invalid) {
      this.basicDetails.markAllAsTouched();
      return;
    }
    if (this.invTypeCategory == '2' && this.minorForm.invalid) {
      this.minorForm.markAllAsTouched();
      return;
    }
    if (this.taxStatusFormControl.invalid) {
      this.taxStatusFormControl.markAllAsTouched();
      return;
    }
    (flag == 'close') ? this.barButtonOptions.active = true : this.disableBtn = true;
    ;
    const obj = {
      familyMemberId: this.basicDetailsData.familyMemberId,
      clientId: this.basicDetailsData.clientId,
      name: (this.invTypeCategory == '1') ? this.basicDetails.controls.fullName.value : this.minorForm.value.minorFullName,
      displayName: null,
      dateOfBirth: this.datePipe.transform((this.invTypeCategory == '1') ? this.basicDetails.controls.dobAsPerRecord.value : this.minorForm.value.dobAsPerRecord, 'dd/MM/yyyy'),
      martialStatusId: null,
      genderId: (this.invTypeCategory == '1') ? this.basicDetails.controls.gender.value : this.minorForm.value.gender,
      occupationId: 1,
      pan: (this.invTypeCategory == '1') ? this.basicDetails.controls.pan.value : this.minorForm.value.pan,
      taxStatusId: parseInt(this.invTaxStatus),
      relationshipId: this.basicDetailsData.relationshipId,
      familyMemberType: parseInt(this.invTypeCategory),
      isKycCompliant: 1,
      aadhaarNumber: null,
      mobileList,
      bio: null,
      remarks: null,
      emailList: [
        {
          email: (this.invTypeCategory == '1') ? this.basicDetails.controls.email.value : this.minorForm.value.gEmail,
          verificationStatus: 0
        }
      ],
      guardianData: gardianObj,
      invTypeCategory: 0,
      categoryTypeflag: null
    };
    obj.bio = this.basicDetailsData.bio;
    obj.remarks = this.basicDetailsData.remarks;
    obj.aadhaarNumber = this.basicDetailsData.aadhaarNumber;
    obj.martialStatusId = this.basicDetailsData.martialStatusId;
    obj.occupationId = this.basicDetailsData.occupationId;
    obj.displayName = this.basicDetailsData.displayName;
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

}
