import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
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
    this.invTypeCategory = '1';
    this.invTaxStatus = '1';
    this.createMinorForm(null);
  }
  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    if (data.fieldFlag == 'familyMember') {
      // this.createMinorForm(data);
      this.basicDetailsData = data;
    }
    else {
      this.basicDetailsData = data.data;
    }
    console.log(data);
    this.createIndividualForm(this.basicDetailsData);
  }
  createIndividualForm(data) {
    (data == undefined) ? data = {} : '';
    this.basicDetails = this.fb.group({
      fullName: [data.displayName, [Validators.required]],
      email: [, [Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
      pan: [data.pan, [Validators.maxLength(10)]],
      username: [, [Validators.required]],
      dobAsPerRecord: [(data.dateOfBirth == null) ? '' : new Date(data.dateOfBirth), [Validators.required]],
      dobActual: [, [Validators.required]],
      gender: ['1', [Validators.required]],
      leadSource: [],
      leaadStatus: [],
      leadRating: [],
      leadOwner: [],
      clientOwner: [],
      role: [, [Validators.required]],
    })
  }
  createMinorForm(data) {
    (data == undefined) ? data = {} : '';
    this.minorForm = this.fb.group({
      minorFullName: [data, name, [Validators.required]],
      dobAsPerRecord: [new Date(data.dateOfBirth)],
      dobActual: [],
      gender: [(String(data.genderId))],
      gFullName: [(data.guardianData) ? data.guardianData.name : '', [Validators.required]],
      gDobAsPerRecord: [new Date(data.birthDate)],
      gDobActual: [],
      gGender: [String(data.genderId)],
      relationWithMinor: [],
      gEmail: [, [Validators.pattern(this.validatorType.EMAIL)]],
      mobileNo: [],
      pan: [data.pan],
      username: [],
      leadOwner: [],
      role: []
    })
  }
  createNonIndividualForm() {
    this.nonIndividualForm = this.fb.group({
      comName: [],
      dateOfIncorporation: [],
      comStatus: [],
      comEmail: [[Validators.pattern(this.validatorType.EMAIL)]],
      comPhone: [],
      comPan: [],
      comOccupation: [],
      username: [],
      leadOwner: [],
      role: []
    })
  }

  getNumberDetails(data) {
    console.log(data);
    this.mobileData = data;
  }
  checkMaxLength(value: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) {
        return;
      }
      if (control.value.length < value) {
        return { isMaxLength: true }
      }
      return null;
    }
  }
  changeInvestorType(event) {
    (event.value == '1') ? this.createIndividualForm(this.basicDetailsData) : (event.value == '2' && this.fieldFlag == 'familyMember') ? this.createMinorForm(this.basicDetailsData) : this.createNonIndividualForm();
    this.invTypeCategory = event.value;
  }
  changeTaxStatus(event) {
    this.invTaxStatus = event.value;
  }
  saveNextClient(flag) {
    this.basicDetails.get('clientOwner').setValidators([Validators.required]);
    this.basicDetails.get('clientOwner').updateValueAndValidity();
    if (this.basicDetails.invalid) {
      this.basicDetails.markAllAsTouched();
      return;
    }
    // if (this.nonIndividualForm.invalid && this.invTypeCategory == '2') {
    //   return
    // }
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
        "advisorId": this.advisorId,
        "taxStatusId": parseInt(this.invTaxStatus),
        "emailList": [
          {
            "verificationStatus": 0,
            "id": 0,
            "userType": 0,
            "isActive": 1,
            "userId": 0,
            "email": this.basicDetails.controls.email.value
          }
        ],
        "displayName": null,
        "bio": null,
        "martialStatusId": 0,
        "password": null,
        "clientType": 0,
        "occupationId": 0,
        "id": null,
        "pan": this.basicDetails.controls.pan.value,
        "clientId": (this.basicDetailsData == null) ? null : this.basicDetailsData.clientId,
        "kycComplaint": 0,
        "roleId": 1,
        "genderId": parseInt(this.basicDetails.controls.gender.value),
        "companyStatus": 0,
        "aadharCard": null,
        "dateOfBirth": this.datePipe.transform(this.basicDetails.controls.dobAsPerRecord.value, 'dd/MM/yyyy'),
        "userName": this.basicDetails.controls.username.value,
        "userId": null,
        "mobileList": mobileList,
        "referredBy": 0,
        "name": this.basicDetails.controls.fullName.value,
        "bioRemarkId": 0,
        "userType": 1,
        "remarks": null,
        "status": 0
      }
      if (this.basicDetailsData == null) {

        // commented code which are giving errors ======>>>

        // this.peopleService.addClient(obj).subscribe(
        //   data => {
        //     console.log(data);
        //     (flag == "Next") ? this.changeTabAndSendData(data) : this.close();
        //   },
        //   err => this.eventService.openSnackBar(err, "Dismiss")
        // )

        // commented code closed which are giving errors ======>>>

      }
      else {
        // commented code which are giving errors ======>>>

        // this.peopleService.editClient(obj).subscribe(
        //   data => {
        //     console.log(data);
        //   },
        //   err => this.eventService.openSnackBar(err, "Dismiss")
        // )

        // commented code closed which are giving errors ======>>>

      }
    }
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
    if (this.basicDetails.invalid && this.invTypeCategory == '1') {
      this.basicDetails.markAllAsTouched();
      return;
    }
    // if (this.minorForm.invalid && this.invTypeCategory == '2') {
    //   this.minorForm.markAllAsTouched();
    //   return;
    // }
    else {
      let obj =
      {
        "id": this.basicDetailsData.id,
        "clientId": this.basicDetailsData.clientId,
        "name": this.basicDetails.controls.fullName.value,
        "displayName": "displayName",
        "dateOfBirth": this.basicDetails.controls.dobAsPerRecord.value,
        "martialStatusId": 1,
        "anniversaryDate": "2000-01-01",
        "genderId": this.basicDetails.controls.gender.value,
        "occupationId": 1,
        "pan": this.basicDetails.controls.pan.value,
        "taxStatusId": this.invTaxStatus,
        "relationshipId": 1,
        "familyMemberType": 1,
        "isKycCompliant": 1,
        "aadhaarNumber": "aadhaarNumber",
        "mobileList": mobileList,
        "bio": null,
        "remarks": null,
        "emailList": [
          {
            "email": this.basicDetails.controls.email.value,
            "verificationStatus": 0
          }
        ],
        "guardianData": {
          "name": "name",
          "birthDate": "2000-01-01",
          "pan": "pan",
          "genderId": 1,
          "relationshipId": 1,
          "aadhaarNumber": "aadhaarNumber",
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
              "email": "c@gmail",
              "verificationStatus": 0
            }
          ]
        }
      }
      this.peopleService.editFamilyMemberDetails(obj).subscribe(
        data => {
          (flag == "Next") ? this.changeTabAndSendData(obj) : this.close();
        },
        err => this.eventService.openSnackBar(err, "Dismiss")
      )
    }
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
