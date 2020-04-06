import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';

@Component({
  selector: 'app-client-demat',
  templateUrl: './client-demat.component.html',
  styleUrls: ['./client-demat.component.scss']
})
export class ClientDematComponent implements OnInit {
  mobileData: any;
  holderList: any;

  mobileNumberFlag = 'Broker number';

  dematForm;
  userData;
  dematList: any;
  modeOfHolding: any;

  constructor(private cusService: CustomerService, private fb: FormBuilder,
    private subInjectService: SubscriptionInject, private peopleService: PeopleService,
    private eventService: EventService) {
  }

  validatorType = ValidatorType;
  @Output() tabChange = new EventEmitter();
  @Input() fieldFlag;

  @Input() set data(data) {
    this.userData = data;
    (this.userData.dematData) ? this.dematList = this.userData.dematData : '';
    this.modeOfHolding = (this.userData.dematData) ? this.userData.dematData.modeOfHolding : '1';
    if (this.userData.dematData == undefined) {
      this.createDematForm(null);
      this.getDematList(data);
    }
    else {
      this.createDematForm(this.userData.dematData);
    }
  }

  createDematForm(data) {
    (data == undefined) ? data = {} : data;
    this.dematForm = this.fb.group({
      modeOfHolding: [(data.modeOfHolding) ? String(data.modeOfHolding) : '1'],
      depositoryPartName: [data.depositoryParticipantName, [Validators.required]],
      depositoryPartId: [data.depositoryParticipantId, [Validators.required]],
      clientId: [, [Validators.required]],
      brekerName: [data.brokerName],
      brokerAddress: [data.brokerAddress],
      linkedBankAccount: [data.linkedBankAccount],
      powerOfAttName: [data.powerOfAttorneyName],
      powerOfAttMasId: [data.powerOfAttorneyMasterId]
    });
  }
  getDematList(data) {
    let obj =
    {
      "userId": (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? this.userData.clientId : this.userData.familyMemberId,
      "userType": (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3
    }
    this.cusService.getDematList(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          this.dematList = data[0];
          this.createDematForm(this.dematList)
        }
      }, err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  ngOnInit() {
  }

  getHolderList(data) {
    console.log(data);
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
    } else {
      const mobileList = [];
      const holderList = [];
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
      if (this.holderList) {
        this.holderList.controls.forEach(element => {
          holderList.push({
            fMDetailTypeId: 1,
            name: element.get('name').value,
            id: 1,
            dematId: (this.userData.dematData) ? this.userData.dematData.dematId : (this.dematList) ? this.dematList.dematId : null
          });
        });
      }
      let obj =
      {
        "depositoryParticipantName": this.dematForm.get('depositoryPartName').value,
        "powerOfAttorneyMasterId": this.dematForm.get('depositoryPartId').value,
        "holderNameList": holderList,
        "modeOfHolding": this.dematForm.get('modeOfHolding').value,
        "mobileDataList": mobileList,
        "dematId": (this.userData.dematData) ? this.userData.dematData.dematId : (this.dematList) ? this.dematList.dematId : null,
        "userId": (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? this.userData.clientId : this.userData.familyMemberId,
        "brokerAddress": this.dematForm.get('brokerAddress').value,
        "depositoryParticipantId": this.dematForm.get('depositoryPartId').value,
        "linkedBankAccount": this.dematForm.get('linkedBankAccount').value,
        "powerOfAttorneyName": this.dematForm.get('powerOfAttName').value,
        "nomineeList": [
          {
            "name": null,
            "id": 0,
            "userType": 0,
            "userId": 0,
            "sharePercentage": 0
          }
        ],
        "userType": (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3,
        "brokerName": this.dematForm.get('brekerName').value,
        "dematClientId": this.dematForm.get('clientId').value
      }
      this.peopleService.addEditClientDemat(obj).subscribe(
        data => {
          console.log(data);
          (flag == 'Next') ? this.tabChange.emit(1) : this.close();
        },
        err => this.eventService.openSnackBar(err, 'Dismiss')
      );

    }
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
