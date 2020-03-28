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
      "advisorId": this.advisorId,
      "emailList": [
        {
          "verificationStatus": 0,
          "id": 0,
          "userType": 0,
          "isActive": 1,
          "userId": 0,
          "email": null
        }
      ],
      "displayName": this.moreInfoForm.controls,
      "bio": this.moreInfoForm.controls,
      "martialStatusId": this.moreInfoForm.controls,
      "password": null,
      "clientType": 0,
      "occupationId": this.moreInfoForm.controls,
      "id": this.moreInfoData.id,
      "pan": null,
      "clientId": null,
      "kycComplaint": 0,
      "roleId": 0,
      "genderId": 0,
      "companyStatus": 0,
      "aadharCard": this.moreInfoForm.controls,
      "dateOfBirth": null,
      "userName": null,
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
      "name": null,
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
