import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-client-basic-details',
  templateUrl: './client-basic-details.component.html',
  styleUrls: ['./client-basic-details.component.scss']
})
export class ClientBasicDetailsComponent implements OnInit {
  minorForm: any;
  nonIndividualForm: any;
  advisorId: typeof AuthService;
  basicDetailsData: any;
  mobileData: any;
  categoryList: any[];
  clientOwnerList: any;
  selectedClientOwner: any;

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject, private peopleService: PeopleService, private eventService: EventService, private datePipe: DatePipe) { }
  basicDetails;
  date = new Date();
  @Input() fieldFlag;
  @Output() clientData = new EventEmitter();
  @Output() tabChange = new EventEmitter();

  validatorType = ValidatorType;
  invTypeCategory;
  invTaxStatus;
  mobileNumberFlag = "Mobile number";
  ngOnInit() {
    this.createMinorForm(null);
  }
  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    if (data.fieldFlag == 'familyMember') {
      this.basicDetailsData = data;
      this.invTaxStatus = (this.basicDetailsData.familyMemberType == 0) ? '1' : String(this.basicDetailsData.taxStatusId);
      this.invTypeCategory = (this.basicDetailsData.familyMemberType == 0) ? '1' : String(this.basicDetailsData.familyMemberType);
      (this.basicDetailsData.familyMemberType == 1 || this.basicDetailsData.familyMemberType == 0) ? this.createIndividualForm(this.basicDetailsData) : this.createMinorForm(this.basicDetailsData)
    }
    else {
      this.basicDetailsData = data;
      if (this.basicDetailsData.userId == null) {
        this.invTypeCategory = '1';
        this.invTaxStatus = '1';
        this.createIndividualForm(null);
      }
      else {
        this.invTypeCategory = String(this.basicDetailsData.clientType);
        this.invTaxStatus = String(this.basicDetailsData.taxStatusId);
        (this.basicDetailsData.clientType == 1 || this.basicDetailsData.clientType == 0) ? this.createIndividualForm(this.basicDetailsData) : this.createNonIndividualForm(this.basicDetailsData)
      }
      this.getClientOrLeadData();
      this.getClientList();
    }

    console.log(data);
  }
  createIndividualForm(data) {
    (data == undefined) ? data = {} : '';
    this.basicDetails = this.fb.group({
      fullName: [data.name, [Validators.required]],
      email: [, [Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
      pan: [data.pan, [Validators.required]],
      username: [, [Validators.required]],
      dobAsPerRecord: [(data.dateOfBirth == null) ? '' : new Date(data.dateOfBirth)],
      dobActual: [],
      gender: ['1'],
      leadSource: [],
      leaadStatus: [],
      leadRating: [],
      leadOwner: [],
      clientOwner: [],
      role: [],
    })
  }
  createMinorForm(data) {
    (data == undefined) ? data = {} : '';
    this.minorForm = this.fb.group({
      minorFullName: [data.name, [Validators.required]],
      dobAsPerRecord: [new Date(data.dateOfBirth)],
      dobActual: [],
      gender: [(String(data.genderId))],
      gFullName: [(data.guardianData) ? data.guardianData.name : '', [Validators.required]],
      gDobAsPerRecord: [(data.guardianData) ? new Date(data.guardianData.birthDate) : ''],
      gDobActual: [],
      gGender: [(data.guardianData) ? String(data.genderId) : ''],
      relationWithMinor: [],
      gEmail: [, [Validators.pattern(this.validatorType.EMAIL)]],
      pan: [data.pan]
    })
  }
  createNonIndividualForm(data) {
    (data == undefined) ? data = {} : ''
    this.nonIndividualForm = this.fb.group({
      comName: [data.name, [Validators.required]],
      dateOfIncorporation: [data.dateOfBirth],
      comStatus: [, [Validators.required]],
      comEmail: [, [Validators.pattern(this.validatorType.EMAIL)]],
      comPhone: [],
      comPan: [data.pan, [Validators.required]],
      comOccupation: [],
      username: [data.username, [Validators.required]],
      leadOwner: [, [Validators.required]],
      role: [, [Validators.required]]
    })
  }
  getClientOrLeadData() {
    let obj =
    {
      "advisorId": this.advisorId,
      "status": (this.fieldFlag == 'client') ? 1 : 2
    }
    this.peopleService.getClientOrLeadData(obj).subscribe(
      data => {
        console.log(data);
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  getNumberDetails(data) {
    console.log(data);
    this.mobileData = data;
  }
  changeInvestorType(event) {
    (event.value == '1') ? this.createIndividualForm(this.basicDetailsData) : ''
    if (event.value == '2' && this.fieldFlag == 'familyMember') {
      this.createMinorForm(this.basicDetailsData);
      this.mobileNumberFlag = "Mobile number"
    }
    else {
      this.createNonIndividualForm(this.basicDetails);
      this.mobileNumberFlag = "Company mobile number"
    }
    this.invTypeCategory = event.value;
  }
  changeTaxStatus(event) {
    this.invTaxStatus = event.value;
  }
  saveNextClient(flag) {
    if (this.fieldFlag == 'client') {
      this.basicDetails.get('clientOwner').setValidators([Validators.required]);
      this.basicDetails.get('clientOwner').updateValueAndValidity();
    }
    if (this.basicDetails.invalid && this.invTypeCategory == '1') {
      this.basicDetails.markAllAsTouched();
      return;
    }
    if (this.invTypeCategory == '2' && this.nonIndividualForm.invalid) {
      this.nonIndividualForm.markAllAsTouched();
      return
    }
    else {
      let mobileList = [];
      this.mobileData.controls.forEach(element => {
        console.log(element);
        mobileList.push({
          "verificationStatus": 0,
          "id": 0,
          "userType": 0,
          "mobileNo": element.get('number').value,
          "isActive": 1,
          "userId": 0
        })
      });
      let obj =
      {
        "advisorId": (this.selectedClientOwner) ? this.selectedClientOwner.advisorId : null,
        "taxStatusId": parseInt(this.invTaxStatus),
        "emailList": [
          {
            "verificationStatus": 0,
            "id": 0,
            "userType": 0,
            "isActive": 1,
            "userId": 0,
            "email": (this.invTypeCategory == '1') ? this.basicDetails.controls.email.value : this.nonIndividualForm.value.comEmail
          }
        ],
        "displayName": null,
        "bio": null,
        "martialStatusId": 0,
        "password": null,
        "clientType": parseInt(this.invTypeCategory),
        "occupationId": 0,
        "id": null,
        "pan": (this.invTypeCategory == '1') ? this.basicDetails.controls.pan.value : this.nonIndividualForm.value.comPan,
        "clientId": (this.basicDetailsData == null) ? null : this.basicDetailsData.clientId,
        "kycComplaint": 0,
        "roleId": 1,
        "genderId": parseInt(this.basicDetails.controls.gender.value),
        "companyStatus": 0,
        "aadharCard": null,
        "dateOfBirth": this.datePipe.transform((this.invTypeCategory == '1') ? this.basicDetails.controls.dobAsPerRecord.value : this.nonIndividualForm.value.dateOfIncorporation, 'dd/MM/yyyy'),
        "userName": (this.invTypeCategory == '1') ? this.basicDetails.controls.username.value : this.nonIndividualForm.value.username,
        "userId": this.advisorId,
        "mobileList": mobileList,
        "referredBy": 0,
        "name": (this.invTypeCategory == '1') ? this.basicDetails.controls.fullName.value : this.nonIndividualForm.value.comName,
        "bioRemarkId": 0,
        "userType": 1,
        "remarks": null,
        "status": (this.fieldFlag == 'client') ? 1 : 2,
        "leadSource": (this.fieldFlag == 'lead') ? this.basicDetails.value.leadSource : null,
        "leadRating": (this.fieldFlag == 'lead') ? this.basicDetails.value.leadRating : null,
        "leadStatus": (this.fieldFlag == 'lead') ? this.basicDetails.value.leaadStatus : null
      }
      if (this.basicDetailsData.userId == null) {
        if (this.invTypeCategory == '1') {
          this.peopleService.addClient(obj).subscribe(
            data => {
              console.log(data);
              data['invCategory'] = this.invTypeCategory;
              data['categoryTypeflag'] = "Individual";
              (flag == "Next") ? this.changeTabAndSendData(data) : this.close();
            },
            err => this.eventService.openSnackBar(err, "Dismiss")
          )
        }
        else {
          this.peopleService.saveCompanyPersonDetail(obj).subscribe(
            data => {
              console.log(data);
              data['invCategory'] = this.invTypeCategory;
              data['categoryTypeflag'] = "clientNonIndividual";
              (flag == "Next") ? this.changeTabAndSendData(data) : this.close();
            },
            err => err => this.eventService.openSnackBar(err, "Dismiss")
          )
        }
      }
      else {
        if (this.invTypeCategory == '1') {
          this.peopleService.editClient(obj).subscribe(
            data => {
              console.log(data);
              data['invCategory'] = this.invTypeCategory;
              data['categoryTypeflag'] = "clientNonIndividual";
              (flag == "Next") ? this.changeTabAndSendData(data) : this.close();
            },
            err => this.eventService.openSnackBar(err, "Dismiss")
          )
        }
        else {

        }
      }
    }
  }
  getClientList() {
    let obj =
    {
      advisorId: 1
    }
    this.peopleService.getTeamMemberList(obj).subscribe(
      data => {
        console.log(data);
        this.clientOwnerList = data;
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  changeTabAndSendData(data) {
    this.clientData.emit(data);
    this.tabChange.emit(1);
  }
  saveNextFamilyMember(flag) {
    this.basicDetails.get('clientOwner').setValidators(null);
    let mobileList = [];
    this.mobileData.controls.forEach(element => {
      console.log(element);
      mobileList.push({
        "mobileNo": element.get('number').value,
        "verificationStatus": 0
      })
    });
    if (this.invTypeCategory == '1' && this.basicDetails.invalid) {
      this.basicDetails.markAllAsTouched();
      return;
    }
    if (this.invTypeCategory == '2' && this.minorForm.invalid) {
      this.minorForm.markAllAsTouched();
      return;
    }
    let obj =
    {
      "id": this.basicDetailsData.id,
      "clientId": this.basicDetailsData.clientId,
      "name": (this.invTypeCategory == '1') ? this.basicDetails.controls.fullName.value : this.minorForm.value.minorFullName,
      "displayName": null,
      "dateOfBirth": (this.invTypeCategory == '1') ? this.basicDetails.controls.dobAsPerRecord.value : this.minorForm.value.dobAsPerRecord,
      "martialStatusId": null,
      "anniversaryDate": null,
      "genderId": (this.invTypeCategory == '1') ? this.basicDetails.controls.gender.value : this.minorForm.value.gender,
      "occupationId": 1,
      "pan": (this.invTypeCategory == '1') ? this.basicDetails.controls.pan.value : this.minorForm.value.pan,
      "taxStatusId": this.invTaxStatus,
      "relationshipId": 1,
      "familyMemberType": parseInt(this.invTypeCategory),
      "isKycCompliant": 1,
      "aadhaarNumber": null,
      "mobileList": mobileList,
      "bio": null,
      "remarks": null,
      "emailList": [
        {
          "email": (this.invTypeCategory == '1') ? this.basicDetails.controls.email.value : null,
          "verificationStatus": 0
        }
      ],
      "guardianData": {
        "name": (this.invTypeCategory == '2') ? this.minorForm.value.gFullName : null,
        "birthDate": (this.invTypeCategory == '2') ? this.datePipe.transform(this.minorForm.value.gDobAsPerRecord, 'dd/MM/yyyy') : null,
        "pan": "pan",
        "genderId": (this.invTypeCategory == '2') ? this.minorForm.value.gGender : null,
        "relationshipId": 1,
        "aadhaarNumber": null,
        "occupationId": 1,
        "martialStatusId": 1,
        "anniversaryDate": "2000-01-01",
        "mobileList": [
          {
            "mobileNo": 9987442988,
            "verificationStatus": 0
          },
        ],
        "emailList": [
          {
            "email": (this.invTypeCategory == '2') ? this.minorForm.value.gEmail : null,
            "verificationStatus": 0
          }
        ]
      }
    }
    this.peopleService.editFamilyMemberDetails(obj).subscribe(
      data => {
        obj['invTypeCategory'] = this.invTypeCategory;
        obj['categoryTypeflag'] = "familyMinor";
        (flag == "Next") ? this.changeTabAndSendData(obj) : this.close();
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  // }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
