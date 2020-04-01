import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ValidatorType } from 'src/app/services/util.service';
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

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject, private peopleService: PeopleService, private eventService: EventService, private datePipe: DatePipe) { }
  moreInfoForm;
  validatorType = ValidatorType
  @Input() fieldFlag;
  @Output() tabChange = new EventEmitter();
  ngOnInit() {
    this.moreInfoForm = this.fb.group({
      displayName: [],
      adhaarNo: [],
      taxStatus: [],
      occupation: [],
      maritalStatus: ['1'],
      anniversaryDate: [],
      bio: [],
      myNotes: []
    })
  }
  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.moreInfoData = data;
    console.log(data)
  }
  saveNext(flag) {
    let obj =
    {
      "advisorId": this.moreInfoData.advisorId,
      "emailList": this.moreInfoData.emailList,
      "displayName": this.moreInfoForm.controls.displayName.value,
      "bio": this.moreInfoForm.controls.bio.value,
      "martialStatusId": this.moreInfoForm.controls.maritalStatus.value,
      "password": null,
      "clientType": 0,
      "occupationId": this.moreInfoForm.controls.occupation.value,
      "id": this.moreInfoData.id,
      "pan": this.moreInfoData.pan,
      "clientId": this.moreInfoData.clientId,
      "kycComplaint": 0,
      "roleId": 0,
      "genderId": this.moreInfoData.genderId,
      "companyStatus": 0,
      "aadharCard": this.moreInfoForm.controls.adhaarNo.value,
      "dateOfBirth": this.datePipe.transform(this.moreInfoData.dateOfBirth, 'dd/MM/yyyy'),
      "userName": this.moreInfoData.userName,
      "userId": null,
      "mobileList": this.moreInfoData.mobileList,
      "referredBy": 0,
      "name": this.moreInfoData.name,
      "bioRemarkId": 0,
      "userType": 0,
      "remarks": this.moreInfoForm.controls.myNotes.value,
      "status": 0
    }
    if (this.fieldFlag == 'client') {

      // commented code which are giving errors ======>>>


      this.peopleService.editClient(obj).subscribe(
        data => {
          console.log(data);
          (flag == 'Next') ? this.tabChange.emit(1) : this.close();
        },
        err => this.eventService.openSnackBar(err, "Dismiss")
      )

      // commented code closed which are giving errors ======>>>

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
