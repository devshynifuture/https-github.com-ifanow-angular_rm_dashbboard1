import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { element } from 'protractor';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';

@Component({
  selector: 'app-client-demat',
  templateUrl: './client-demat.component.html',
  styleUrls: ['./client-demat.component.scss']
})
export class ClientDematComponent implements OnInit {
  mobileData: any;
  holderList: any;

  constructor(private cusService: CustomerService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private peopleService: PeopleService, private eventService: EventService) { }
  dematForm;
  userData;
  mobileNumberFlag = "Broker number"
  validatorType = ValidatorType;
  @Output() tabChange = new EventEmitter();
  @Input() fieldFlag;
  @Input() set data(data) {
    this.userData = data;
    this.createDematForm(data);
  }
  createDematForm(data) {
    (data == undefined) ? data = {} : data;
    this.dematForm = this.fb.group({
      modeOfHolding: ['1'],
      holderNameList: new FormArray([]),
      depositoryPartName: [, [Validators.required]],
      depositoryPartId: [, [Validators.required]],
      clientId: [, [Validators.required]],
      brekerName: [],
      brokerAddress: [],
      brokerPhone: [],
      linkedBankAccount: [],
      powerOfAttName: [],
      powerOfAttMasId: []
    })
  }
  ngOnInit() {
    this.createDematForm(null)
  }
  getHolderList(data) {
    console.log(data)
    this.holderList = data;
  }
  getNumberDetails(data) {
    console.log(data);
    this.mobileData = data;
  }

  saveNext(flag) {
    if (this.dematForm.invalid) {
      this.dematForm.markAllAsTouched();
      return;
    }
    else {
      let mobileList = [];
      let holderList = [];
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
          })
        });
      }
      if (this.holderList) {
        this.holderList.controls.forEach(element => {
          holderList.push({
            "fMDetailTypeId": 1,
            "name": element.get('name').value,
            "id": 1,
            "dematId": 1
          })
        })
      }
      let test =
      {
        "dematList": [
          {
            "id": 3,
            "clientId": this.dematForm.get('clientId').value,
            "depositoryParticipantName": this.dematForm.get('depositoryPartName').value,
            "powerOfAttorneyMasterId": this.dematForm.get('powerOfAttMasId').value,
            "holderNameList": holderList,
            "modeOfHolding": this.dematForm.get('modeOfHolding').value,
            "mobileDataList": mobileList,
            "brokerAddress": this.dematForm.get('brokerAddress').value,
            "depositoryParticipantId": this.dematForm.get('depositoryPartId').value,
            "linkedBankAccount": this.dematForm.get('linkedBankAccount').value,
            "familyMemberid": 1,
            "powerOfAttorneyName": this.dematForm.get('powerOfAttName').value,
            "nomineeList": [
              {
                "assetTypeId": 0,
                "familyMemberId": 1,
                "assetId": 0,
                "name": "name",
                "id": 0,
                "sharePercentage": 100
              }
            ],
            "brokerName": this.dematForm.get('brekerName').value
          }
        ]
      }
      let obj = {
        "modeOfHolding": this.dematForm.get('modeOfHolding').value,
        "depositoryParticipantName": this.dematForm.get('depositoryPartName').value,
        "depositoryParticipantId": this.dematForm.get('depositoryPartId').value,
        "clientId": this.userData.clientId,
        "brokerName": this.dematForm.get('brekerName').value,
        "brokerAddress": this.dematForm.get('brokerAddress').value,
        "linkedBankAccount": this.dematForm.get('linkedBankAccount').value,
        "powerOfAttorneyName": this.dematForm.get('powerOfAttName').value,
        "powerOfAttorneyMasterId": this.dematForm.get('powerOfAttMasId').value
      }

      this.peopleService.addEditClientDemat(obj).subscribe(
        data => {
          console.log(data);
          (flag == 'Next') ? this.tabChange.emit(1) : this.close();
        },
        err => this.eventService.openSnackBar(err, "Dismiss")
      )

    }
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
