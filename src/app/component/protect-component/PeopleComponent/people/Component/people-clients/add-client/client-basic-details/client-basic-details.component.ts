import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';

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

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject, private peopleService: PeopleService, private eventService: EventService) { }
  basicDetails;
  @Input() fieldFlag;
  @Output() clientData = new EventEmitter();
  @Output() tabChange = new EventEmitter();
  validatorType = ValidatorType;
  invTypeCategory = '1';
  invTaxStatus = '1';
  ngOnInit() {
    this.createIndividualForm();
  }
  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.basicDetailsData = data.data;
    console.log(data)
  }
  createIndividualForm() {
    this.basicDetails = this.fb.group({
      fullName: [, [Validators.required]],
      email: [, [Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
      mobileNo: new FormArray([]),
      pan: [],
      username: [, [Validators.required]],
      dobAsPerRecord: [],
      dobActual: [],
      gender: ['1', [Validators.required]],
      leadSource: [],
      leaadStatus: [],
      leadRating: [],
      leadOwner: [],
      clientOwner: [, [Validators.required]],
      role: [, [Validators.required]],
    })
    this.addNumber();
  }
  createMinorForm() {
    this.minorForm = this.fb.group({
      minorFullName: [],
      dobAsPerRecord: [],
      dobActual: [],
      gender: ['1'],
      gFullName: [],
      gDobAsPerRecord: [],
      gDobActual: [],
      gGender: ['1'],
      relationWithMinor: [],
      gEmail: [, [Validators.pattern(this.validatorType.EMAIL)]],
      mobileNo: [],
      pan: [],
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
  get getBasicDetails() { return this.basicDetails.controls; }
  get getMobileNumList() { return this.getBasicDetails.mobileNo as FormArray; }
  create
  removeNumber(index) {
    (index == 0) ? '' : this.basicDetails.controls.mobileNo.removeAt(index)
  }
  addNumber() {
    this.getMobileNumList.push(this.fb.group({
      code: [, [Validators.required]],
      number: [, [Validators.required]]
    }))
  }
  changeInvestorType(event) {
    this.invTypeCategory = event.value;
    (event.value == '1') ? this.createIndividualForm() : (event.value == '2') ? this.createMinorForm() : this.createNonIndividualForm();
  }
  changeTaxStatus(event) {
    this.invTaxStatus = event.value;
  }

  saveClose() {

  }
  saveNext() {
    // individual form
    // let obj =
    // {
    //   fullName: this.basicDetails.controls.fullName.value,
    //   email: this.basicDetails.controls.email.value,
    //   mobileNo: this.basicDetails.controls.mobileNo.value,
    //   pan: this.basicDetails.controls.pan.value,
    //   username: this.basicDetails.controls.username.value,
    //   dobAsPerRecord: this.basicDetails.controls.dobAsPerRecord.value,
    //   dobActual: this.basicDetails.controls.dobActual.value,
    //   gender: this.basicDetails.controls.gender.value,
    //   leadSource: this.basicDetails.controls.leadSource.value,
    //   leaadStatus: this.basicDetails.controls.leaadStatus.value,
    //   leadRating: this.basicDetails.controls.leadRating.value,
    //   leadOwner: this.basicDetails.controls.leadOwner.value,
    //   clientOwner: this.basicDetails.controls.clientOwners.value,
    //   role: this.basicDetails.controls.role.value,
    // }
    // minor form
    // let obj =
    // {
    //   minorFullName: this.minorForm.controls.minorFullName.value,
    //   dobAsPerRecord: this.minorForm.controls.dobAsPerRecord.value,
    //   dobActual: this.minorForm.controls.dobActual.value,
    //   gender: this.minorForm.controls.gender.value,
    //   gFullName: this.minorForm.controls.gFullName.value,
    //   gDobAsPerRecord: this.minorForm.controls.gDobAsPerRecord.value,
    //   gDobActual: this.minorForm.controls.gDobActual.gDobActual.value,
    //   gGender: this.minorForm.controls.gGender.value,
    //   relationWithMinor: this.minorForm.controls.relationWithMinor.value,
    //   gEmail: this.minorForm.controls.gEmail.value,
    //   mobileNo: this.minorForm.controls.mobileNo.value,
    //   pan: this.minorForm.controls.pan.value,
    //   username: this.minorForm.controls.username.value,
    //   leadOwner: this.minorForm.controls.leadOwner.value,
    //   role: this.minorForm.controls.role.value
    // }
    // console.log(obj);
    let obj =
    {
      "advisorId": this.advisorId,
      "taxStatusId": this.invTaxStatus,
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
      "clientId": null,
      "kycComplaint": 0,
      "roleId": 0,
      "genderId": this.basicDetails.controls.gender.value,
      "companyStatus": 0,
      "aadharCard": null,
      "dateOfBirth": this.basicDetails.controls.dobAsPerRecord.value,
      "userName": this.basicDetails.controls.username.value,
      "userId": null,
      "mobileList": [
        {
          "verificationStatus": 0,
          "id": 0,
          "userType": 0,
          "mobileNo": 0,
          "isActive": 1,
          "userId": 0
        }
      ],
      "referredBy": 0,
      "name": this.basicDetails.controls.fullName.value,
      "bioRemarkId": 0,
      "userType": 0,
      "remarks": null,
      "status": 0
    }
    if (this.basicDetailsData == null) {
      this.peopleService.addClient(obj).subscribe(
        data => {
          console.log(data);
          // this.close();
          this.clientData.emit(data);
          this.tabChange.emit(1);
        },
        err => this.eventService.openSnackBar(err, "Dismiss")
      )
    }
    else {
      this.peopleService.editClient(obj).subscribe(
        data => {
          console.log(data);
          // this.close();
        },
        err => this.eventService.openSnackBar(err, "Dismiss")
      )
    }
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
