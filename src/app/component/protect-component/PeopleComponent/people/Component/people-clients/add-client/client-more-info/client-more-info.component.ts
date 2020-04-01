import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ValidatorType, UtilService } from 'src/app/services/util.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-client-more-info',
  templateUrl: './client-more-info.component.html',
  styleUrls: ['./client-more-info.component.scss']
})
export class ClientMoreInfoComponent implements OnInit {
  advisorId: any;
  moreInfoData: any;
  mobileNumberFlag = "Mobile"
  nonindividualForm: any;
  mobileData: any;
  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject, private peopleService: PeopleService, private eventService: EventService, private datePipe: DatePipe) { }
  moreInfoForm;
  validatorType = ValidatorType
  @Input() fieldFlag;
  @Output() tabChange = new EventEmitter();
  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.moreInfoData = data;
    console.log(data);
    (data.invCategory == '2') ? this.getCompanyDetails(data) : '';
    this.moreInfoForm = this.fb.group({
      displayName: [],
      adhaarNo: [],
      taxStatus: [],
      occupation: [],
      maritalStatus: ['1'],
      anniversaryDate: [],
      bio: [],
      myNotes: [],
    })
    this.nonindividualForm = this.fb.group({
      name: [],
      email: [, [Validators.pattern('')]],
      pan: [],
      adhaarNo: [],
      designation: [],
      gender: ['1'],
      maritalStatus: [],
      anniversaryDate: [],
      bio: [],
      myNotes: []
    })
  }
  ngOnInit() {
  }
  getNumberDetails(data) {
    console.log(data);
    this.mobileData = data;
  }
  getCompanyDetails(data) {
    let obj =
    {
      userId: data.userId,
      userType: data.userType
    }
    this.peopleService.getCompanyPersonDetail(obj).subscribe(
      data => {
        console.log(data)
      }, err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  saveNext(flag) {
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
      "advisorId": this.moreInfoData.advisorId,
      "emailList": (this.moreInfoData.invCategory == '1') ? this.moreInfoData.emailList : this.nonindividualForm.value.email,
      "displayName": (this.moreInfoData.invCategory == '1') ? this.moreInfoForm.controls.displayName.value : null,
      "bio": (this.moreInfoData.invCategory == '1') ? this.moreInfoForm.controls.bio.value : this.nonindividualForm.value.bio,
      "martialStatusId": (this.moreInfoData.invCategory == '1') ? this.moreInfoForm.controls.maritalStatus.value : this.nonindividualForm.value.maritalStatus,
      "password": null,
      "clientType": 0,
      "occupationId": (this.moreInfoData.invCategory == '1') ? this.moreInfoForm.controls.occupation.value : null,
      "id": (this.moreInfoData.invCategory == '1') ? this.moreInfoData.id : null,
      "pan": (this.moreInfoData.invCategory == '1') ? this.moreInfoData.pan : this.nonindividualForm.value.pan,
      "clientId": (this.moreInfoData.invCategory == '1') ? this.moreInfoData.clientId : null,
      "kycComplaint": 0,
      "roleId": 0,
      "genderId": (this.moreInfoData.invCategory == '1') ? this.moreInfoData.genderId : this.nonindividualForm.value.genderId,
      "companyStatus": 0,
      "aadharCard": (this.moreInfoData.invCategory == '1') ? this.moreInfoForm.controls.adhaarNo.value : this.nonindividualForm.value.aadhaarNumber,
      "dateOfBirth": this.datePipe.transform(this.moreInfoData.dateOfBirth, 'dd/MM/yyyy'),
      "userName": (this.moreInfoData.invCategory == '1') ? this.moreInfoData.userName : null,
      "userId": (this.moreInfoData.invCategory == '1') ? null : this.moreInfoData.userId,
      "mobileList": (this.moreInfoData.invCategory == '1') ? this.moreInfoData.mobileList : mobileList,
      "referredBy": 0,
      "name": (this.moreInfoData.invCategory == '1') ? this.moreInfoData.name : this.moreInfoForm.value.name,
      "bioRemarkId": 0,
      "userType": 0,
      "remarks": (this.moreInfoData.invCategory == '1') ? this.moreInfoForm.controls.myNotes.value : this.nonindividualForm.value.myNotes,
      "status": 0,
      'companyPersonDetailId': (this.moreInfoData.invCategory == '1') ? null : this.moreInfoData.companyPersonDetailId
    }
    if (this.fieldFlag == 'client') {
      if (this.moreInfoData.invCategory == '1') {
        this.peopleService.editClient(obj).subscribe(
          data => {
            console.log(data);
            (flag == 'Next') ? this.tabChange.emit(1) : this.close();
          },
          err => this.eventService.openSnackBar(err, "Dismiss")
        )
      }
      else {
        this.peopleService.updateCompanyPersonDetail(obj).subscribe(
          data => {
            console.log(data);
            (flag == 'Next') ? this.tabChange.emit(1) : this.close();
          },
          err => this.eventService.openSnackBar(err, "Dismiss")
        )
      }
    }
  }
  saveNextFamilyMember(flag) {
    let obj =
    {
      "isKycCompliant": this.moreInfoData.isKycCompliant,
      "taxStatusId": this.moreInfoData.taxStatusId,
      "emailList": this.moreInfoData.emailList,
      "displayName": this.moreInfoForm.controls.displayName.value,
      "guardianId": 0,
      "martialStatusId": this.moreInfoForm.controls.maritalStatus.value,
      "isActive": 0,
      "addressModelList": null,
      "occupationId": this.moreInfoForm.controls.occupation.value,
      "id": this.moreInfoData.id,
      "dematList": null,
      "pan": this.moreInfoData.pan,
      "familyMemberType": 0,
      "clientId": this.moreInfoData.clientId,
      "genderId": this.moreInfoData.genderId,
      "dateOfBirth": this.moreInfoData.dateOfBirth,
      "bankDetailList": this.moreInfoData.bankDetail,
      "relationshipId": this.moreInfoData.relationshipId,
      "mobileList": this.moreInfoData.mobileList,
      "anniversaryDate": this.moreInfoForm.controls.anniversaryDate.value,
      "aadhaarNumber": this.moreInfoForm.controls.adhaarNo.value,
      "name": this.moreInfoData.name,
      "bioRemarkId": 0,
      "bio": this.moreInfoForm.controls.bio.value,
      "remarks": this.moreInfoForm.controls.myNotes.value,
      "guardianData": this.moreInfoData.guardianData
    }
    this.peopleService.editFamilyMemberDetails(obj).subscribe(
      data => {
        console.log(data);
        (flag == 'Next') ? this.tabChange.emit(1) : this.close();
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
