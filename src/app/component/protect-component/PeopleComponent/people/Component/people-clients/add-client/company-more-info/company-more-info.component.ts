import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-company-more-info',
  templateUrl: './company-more-info.component.html',
  styleUrls: ['./company-more-info.component.scss']
})
export class CompanyMoreInfoComponent implements OnInit {
  companyMoreInfoFormGroup;
  userData: any;
  mobileData: any;

  constructor(private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private peopleService: PeopleService) { }

  ngOnInit() {
  }
  @Input() set data(data) {
    this.userData = data;
    this.getCompanyDetails(data)
  }
  createCompanyForm(data) {
    this.companyMoreInfoFormGroup = this.fb.group({
      name: [],
      email: [],
      pam: [],
      adhaarNo: [],
      designation: [],
      gender: [],
      maritalStatus: [],
      anniversaryDate: [],
      bio: [],
      myNotes: []
    })
  }
  getCompanyDetails(data) {
    let obj =
    {
      userId: data.userId
    }
    this.peopleService.getCompanyPersonDetail(obj).subscribe(
      data => {
        console.log(data)
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  getNumberDetails(data) {
    console.log(data);
    this.mobileData = data;
  }
  saveNext(flag) {
    let mobileList = [];
    if (this.mobileData) {
      this.mobileData.controls.forEach(element => {
        console.log(element);
        mobileList.push({
          "verificationStatus": 0,
          "id": 0,
          "userType": 0,
          "mobileNo": element.get('number').value,
          "isActive": 1,
          "userId": 0
        });
      });
    }
    let obj =
    {

    }
    if (this.userData.id == undefined) {
      this.peopleService.saveCompanyPersonDetail(obj).subscribe(
        data => {
          console.log(data)
        }, err => this.eventService.openSnackBar(err, "Dismiss")
      )
    } else {
      this.peopleService.updateCompanyPersonDetail(obj).subscribe(
        data => {
          console.log(data)
        }, err => this.eventService.openSnackBar(err, "Dismiss")
      )
    }
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
``