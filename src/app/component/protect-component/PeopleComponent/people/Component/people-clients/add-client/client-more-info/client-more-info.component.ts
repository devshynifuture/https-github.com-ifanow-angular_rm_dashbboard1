import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ValidatorType } from 'src/app/services/util.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-client-more-info',
  templateUrl: './client-more-info.component.html',
  styleUrls: ['./client-more-info.component.scss']
})
export class ClientMoreInfoComponent implements OnInit {
  advisorId: any;
  moreInfoData: any;

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject, private peopleService: PeopleService, private eventService: EventService) { }
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
      anniversaryStatus: [],
      bio: [],
      myNotes: []
    })
  }
  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.moreInfoData = data;
    console.log(data)
  }
  saveNext() {
    let obj =
    {
      "advisorId": this.moreInfoData.advisorId,
      "emailList": this.moreInfoData.emailList,
      "displayName": this.moreInfoForm.controls,
      "bio": this.moreInfoForm.controls,
      "martialStatusId": this.moreInfoForm.controls,
      "password": null,
      "clientType": 0,
      "occupationId": this.moreInfoForm.controls,
      "id": this.moreInfoData.id,
      "pan": this.moreInfoData.pan,
      "clientId": this.moreInfoData.clientId,
      "kycComplaint": 0,
      "roleId": 0,
      "genderId": this.moreInfoData.genderId,
      "companyStatus": 0,
      "aadharCard": this.moreInfoForm.controls,
      "dateOfBirth": this.moreInfoData.dateOfBirth,
      "userName": this.moreInfoData.userName,
      "userId": null,
      "mobileList": this.moreInfoData.mobileList,
      "referredBy": 0,
      "name": this.moreInfoData.name,
      "bioRemarkId": 0,
      "userType": 0,
      "remarks": null,
      "status": 0
    }
    this.peopleService.editClient(obj).subscribe(
      data => {
        console.log(data);
        this.tabChange.emit(1);
        this.close();
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  saveClose() {
    this.close();
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
