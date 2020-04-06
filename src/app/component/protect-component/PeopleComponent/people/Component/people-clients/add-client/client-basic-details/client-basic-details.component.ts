import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ValidatorType} from 'src/app/services/util.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {AuthService} from 'src/app/auth-service/authService';
import {PeopleService} from 'src/app/component/protect-component/PeopleComponent/people.service';
import {EventService} from 'src/app/Data-service/event.service';
import {DatePipe} from '@angular/common';
import {EnumServiceService} from 'src/app/services/enum-service.service';
import {MatProgressButtonOptions} from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-client-basic-details',
  templateUrl: './client-basic-details.component.html',
  styleUrls: ['./client-basic-details.component.scss']
})
export class ClientBasicDetailsComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
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
  minorForm: any;
  nonIndividualForm: any;
  advisorId;
  basicDetailsData: any;
  mobileData: any;
  categoryList: any[];
  clientOwnerList: any;
  selectedClientOwner: any;

  mobileNumberFlag = 'Mobile number';

  basicDetails;
  date = new Date();
  @Input() fieldFlag;
  @Output() clientData = new EventEmitter();
  @Output() tabChange = new EventEmitter();

  validatorType = ValidatorType;
  invTypeCategory;
  invTaxStatus;
  clientRoles: any = [];

  // advisorId;

  constructor(private fb: FormBuilder, private enumService: EnumServiceService,
    private subInjectService: SubscriptionInject, private peopleService: PeopleService,
    private eventService: EventService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientRoles = this.enumService.getClientRole();
    console.log(this.clientRoles, 'this.clientRoles 123A');

  }

  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    if (data.fieldFlag == 'familyMember') {
      this.basicDetailsData = data;
      this.invTaxStatus = (this.basicDetailsData.familyMemberType == 0) ? '1' : String(this.basicDetailsData.taxStatusId);
      this.invTypeCategory = (this.basicDetailsData.familyMemberType == 0) ? '1' : String(this.basicDetailsData.familyMemberType);
      (this.basicDetailsData.familyMemberType == 1 || this.basicDetailsData.familyMemberType == 0) ? this.createIndividualForm(this.basicDetailsData) : this.createMinorForm(this.basicDetailsData);
    } else {
      this.getClientList();
      this.basicDetailsData = data;
      if (this.basicDetailsData.userId == null) {
        this.invTypeCategory = '1';
        this.invTaxStatus = '1';
        this.createIndividualForm(null);
        return;
      }
      (data.clientType == 1 || data.clientType == 0) ? this.createIndividualForm(data) : this.createNonIndividualForm(data);
      this.getClientOrLeadData(this.basicDetailsData);
    }
    console.log(data);
  }

  createIndividualForm(data) {
    (data == undefined) ? data = {} : '';
    this.basicDetails = this.fb.group({
      fullName: [data.name, [Validators.required]],
      email: [(data.emailList && data.emailList.length > 0) ? data.emailList[0].email : '', [Validators.pattern(this.validatorType.EMAIL)]],
      pan: [data.pan, [Validators.required, Validators.pattern(this.validatorType.PAN)]],
      username: [data.userName],
      dobAsPerRecord: [(data.dateOfBirth == null) ? '' : new Date(data.dateOfBirth)],
      dobActual: [],
      gender: ['1'],
      leadSource: [],
      leaadStatus: [],
      leadRating: [data.leadRating],
      leadOwner: [],
      clientOwner: [''],
      role: [''],
    });
  }

  createMinorForm(data) {
    (data == undefined) ? data = {} : '';
    this.minorForm = this.fb.group({
      minorFullName: [data.name, [Validators.required]],
      dobAsPerRecord: [new Date(data.dateOfBirth)],
      dobActual: [],
      gender: [(data.genderId) ? String(data.genderId) : '1'],
      gFullName: [(data.guardianData) ? data.guardianData.name : '', [Validators.required]],
      gDobAsPerRecord: [(data.guardianData) ? new Date(data.guardianData.birthDate) : ''],
      gDobActual: [],
      gGender: [(data.guardianData) ? String(data.genderId) : '1'],
      relationWithMinor: [String(data.relationshipId)],
      gEmail: [(data.emailList.length > 0) ? data.emailList[0].email : '', [Validators.pattern(this.validatorType.EMAIL)]],
      pan: [data.pan, [Validators.pattern(this.validatorType.PAN)]]
    });
  }

  createNonIndividualForm(data) {
    (data == undefined) ? data = {} : '';
    this.nonIndividualForm = this.fb.group({
      comName: [data.name, [Validators.required]],
      dateOfIncorporation: [data.dateOfBirth],
      comStatus: [, [Validators.required]],
      comEmail: [(data.emailList) ? data.emailList[0].email : '', [Validators.pattern(this.validatorType.EMAIL)]],
      comPan: [data.pan, [Validators.required, Validators.pattern(this.validatorType.PAN)]],
      comOccupation: [],
      username: [data.username, [Validators.required]],
      leadOwner: [, [Validators.required]],
      role: [, [Validators.required]]
    });
  }

  getClientOrLeadData(data) {
    const obj = {
      clientId: data.clientId
    };
    this.peopleService.getClientOrLeadData(obj).subscribe(
      data => {
        console.log(data);
        this.basicDetailsData = data;
        if (data == undefined) {
          return;
        } else {
          this.invTypeCategory = (data.clientType == 0) ? '1' : String(data.clientType);
          this.invTaxStatus = (data.clientType == 0) ? '1' : String(data.taxStatusId);
          (data.clientType == 1 || data.clientType == 0) ? this.createIndividualForm(data) : this.createNonIndividualForm(data);
        }
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  getNumberDetails(data) {
    console.log(data);
    this.mobileData = data;
  }

  changeInvestorType(event) {
    (event.value == '1') ? this.createIndividualForm(this.basicDetailsData) : '';
    if (event.value == '2' && this.fieldFlag == 'familyMember') {
      this.createMinorForm(this.basicDetailsData);
      this.mobileNumberFlag = 'Mobile number';
    } else {
      this.createNonIndividualForm(this.basicDetails);
      this.mobileNumberFlag = 'Company mobile number';
    }
    this.invTypeCategory = event.value;
  }

  changeTaxStatus(event) {
    this.invTaxStatus = event.value;
  }

  saveNextClient(flag) {
    if (this.fieldFlag == 'client' && this.basicDetailsData.userId == null) {
      this.basicDetails.get('clientOwner').setValidators([Validators.required]);
      this.basicDetails.get('clientOwner').updateValueAndValidity();
    }
    if (this.basicDetails.invalid && this.invTypeCategory == '1') {
      this.basicDetails.markAllAsTouched();
      return;
    }
    if (this.invTypeCategory == '2' && this.nonIndividualForm.invalid) {
      this.nonIndividualForm.markAllAsTouched();
      return;
    } else {
      this.barButtonOptions.active = true;
      const mobileList = [];
      if (this.mobileData) {
        this.mobileData.controls.forEach(element => {
          console.log(element);
          const mobileNo = element.get('number').value;
          if (mobileNo) {
            mobileList.push({
              userType: 2,
              mobileNo: element.get('number').value,
            });
          }
        });
      }
      var advisorId;
      if (this.selectedClientOwner && this.selectedClientOwner.advisorId) {
        advisorId = this.selectedClientOwner.advisorId;
      } else if (this.basicDetailsData && this.basicDetailsData.advisorId) {
        advisorId = this.basicDetailsData.advisorId;
      } else {
        advisorId = this.advisorId;
      }
      const emailId = (this.invTypeCategory == '1') ? this.basicDetails.controls.email.value : this.nonIndividualForm.value.comEmail;
      const emailList = [];
      if (emailId) {
        emailList.push({
          userType: 2,
          email: emailId
        });
      }
      const obj = {
        advisorId,
        taxStatusId: parseInt(this.invTaxStatus),
        emailList,
        displayName: null,
        bio: null,
        martialStatusId: 0,
        clientType: parseInt(this.invTypeCategory),
        pan: (this.invTypeCategory == '1') ? this.basicDetails.controls.pan.value : this.nonIndividualForm.value.comPan,
        clientId: (this.basicDetailsData == null) ? null : this.basicDetailsData.clientId,
        kycComplaint: 0,
        roleId: 1,
        genderId: parseInt(this.basicDetails.controls.gender.value),
        dateOfBirth: this.datePipe.transform((this.invTypeCategory == '1') ? this.basicDetails.controls.dobAsPerRecord.value :
          this.nonIndividualForm.value.dateOfIncorporation, 'dd/MM/yyyy'),
        userName: (this.invTypeCategory == '1') ? this.basicDetails.controls.username.value : this.nonIndividualForm.value.username,
        userId: (this.fieldFlag == 'client' || this.fieldFlag == 'lead') ? this.basicDetailsData.clientId : this.basicDetailsData.id,
        mobileList,
        referredBy: 0,
        name: (this.invTypeCategory == '1') ? this.basicDetails.controls.fullName.value : this.nonIndividualForm.value.comName,
        bioRemarkId: 0,
        userType: 2,
        remarks: null,
        status: (this.fieldFlag == 'client') ? 1 : 2,
        leadSource: (this.fieldFlag == 'lead') ? this.basicDetails.value.leadSource : null,
        leadRating: (this.fieldFlag == 'lead') ? this.basicDetails.value.leadRating : null,
        leadStatus: (this.fieldFlag == 'lead') ? this.basicDetails.value.leaadStatus : null
      };
      if (this.basicDetailsData.userId == null) {
        if (this.invTypeCategory == '1') {
          this.peopleService.addClient(obj).subscribe(
            data => {
              this.barButtonOptions.active = false;
              console.log(data);
              data.invCategory = this.invTypeCategory;
              data.categoryTypeflag = 'Individual';
              this.eventService.openSnackBar('Added successfully!', 'Dismiss');
              (flag == 'Next') ? this.changeTabAndSendData(data) : this.close(obj);
            },
            (err) => {
              this.barButtonOptions.active = false;
              this.eventService.openSnackBar(err, 'Dismiss');
            }
          );
        } else {
          this.peopleService.saveCompanyPersonDetail(obj).subscribe(
            data => {
              this.barButtonOptions.active = false;
              console.log(data);
              data.invCategory = this.invTypeCategory;
              data.categoryTypeflag = 'clientNonIndividual';
              this.eventService.openSnackBar('Added successfully!', 'Dismiss');
              (flag == 'Next') ? this.changeTabAndSendData(data) : this.close(obj);
            },
            (err) => {
              this.eventService.openSnackBar(err, 'Dismiss');
              this.barButtonOptions.active = false;
            }
          );
        }
      } else {
        this.peopleService.editClient(obj).subscribe(
          data => {
            this.barButtonOptions.active = false;
            console.log(data);
            data.invCategory = this.invTypeCategory;
            data.categoryTypeflag = (this.invTypeCategory == '1') ? 'Individual' : 'clientNonIndividual';
            this.eventService.openSnackBar('Updated successfully!', 'Dismiss');
            (flag == 'Next') ? this.changeTabAndSendData(data) : this.close(obj);
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
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  changeTabAndSendData(data) {
    this.clientData.emit(data);
    this.tabChange.emit(1);
  }

  saveNextFamilyMember(flag) {
    // this.basicDetails.get('clientOwner').setValidators(null);
    const mobileList = [];
    this.mobileData.controls.forEach(element => {
      console.log(element);
      mobileList.push({
        mobileNo: element.get('number').value,
        verificationStatus: 0
      });
    });
    let gardianObj;
    if (this.invTypeCategory == '2') {
      gardianObj =
      {
        name: (this.invTypeCategory == '2') ? this.minorForm.value.gFullName : null,
        birthDate: (this.invTypeCategory == '2') ? this.datePipe.transform(this.minorForm.value.gDobAsPerRecord, 'dd/MM/yyyy') : null,
        pan: 'pan',
        genderId: (this.invTypeCategory == '2') ? this.minorForm.value.gGender : null,
        relationshipId: 1,
        aadhaarNumber: null,
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
      }
    }
    else {
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
      taxStatusId: this.invTaxStatus,
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
    this.peopleService.editFamilyMemberDetails(obj).subscribe(
      data => {
        obj.invTypeCategory = this.invTypeCategory;
        obj.categoryTypeflag = 'familyMinor';
        (flag == 'Next') ? this.changeTabAndSendData(obj) : this.close(data);
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  // }
  close(data) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', clientData: data });
  }

}
