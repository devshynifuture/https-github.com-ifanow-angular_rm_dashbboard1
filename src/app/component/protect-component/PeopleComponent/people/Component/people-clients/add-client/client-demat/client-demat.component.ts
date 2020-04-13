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
  holdingMode: string;

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
    this.holdingMode = (this.userData.dematData) ? String(this.userData.dematData.modeOfHolding) : '1';
    if (this.userData.dematData == undefined && this.fieldFlag) {
      this.createDematForm(null);
      this.getDematList(data);
    }
    else {
      this.createDematForm(this.userData.dematData);
    }
  }


  ownerName: any;
  familyMemberId: any;
  ownerData: any
  callMethod: any;
  nomineesListFM: any = [];
  // ===================owner-nominee directive=====================//
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }

  lisNominee(value) {
    this.ownerData.Fmember = value;
    this.nomineesListFM = Object.assign([], value);
  }

  disabledMember(value, type) {
    this.callMethod = {
      methodName: "disabledMember",
      ParamValue: value,
      disControl: type
    }
  }

  displayControler(con) {
    console.log('value selected', con);
    if (this.dematForm.value.getCoOwnerName) {
      if (con.owner != null && con.owner) {
        this.dematForm.controls.getCoOwnerName = con.owner;
      }
    }
    if (con.nominee != null && con.nominee) {
      this.dematForm.controls.getNomineeName = con.nominee;
    }
  }

  onChangeJointOwnership(data) {
    this.callMethod = {
      methodName: "onChangeJointOwnership",
      ParamValue: data
    }
  }

  /***owner***/

  get getCoOwner() {
    if (this.dematForm.value.getCoOwnerName) {
      return this.dematForm.get('getCoOwnerName') as FormArray;
    }
  }

  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: [data ? data.name : '', [Validators.required]], share: [data ? data.share : '', [Validators.required]], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0]
    }));
    if (data) {
      setTimeout(() => {
        this.disabledMember(null, null);
      }, 1300);
    }

    if (this.getCoOwner.value.length > 1 && !data) {
      let share = 100 / this.getCoOwner.value.length;
      for (let e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        }
        else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }

  }

  removeCoOwner(item) {
    if (this.dematForm.value.getCoOwnerName) {
      this.getCoOwner.removeAt(item);
      if (this.dematForm.value.getCoOwnerName.length == 1) {
        this.getCoOwner.controls['0'].get('share').setValue('100');
      } else {
        let share = 100 / this.getCoOwner.value.length;
        for (let e in this.getCoOwner.controls) {
          if (!Number.isInteger(share) && e == "0") {
            this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
          }
          else {
            this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
          }
        }
      }
      this.disabledMember(null, null);
    }
  }
  /***owner***/

  /***nominee***/

  get getNominee() {
    return this.dematForm.get('getNomineeName') as FormArray;
  }

  removeNewNominee(item) {
    this.getNominee.removeAt(item);
    if (this.dematForm.value.getNomineeName.length == 1) {
      this.getNominee.controls['0'].get('sharePercentage').setValue('100');
    } else {
      let share = 100 / this.getNominee.value.length;
      for (let e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        }
        else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }
  }



  addNewNominee(data) {
    this.getNominee.push(this.fb.group({
      name: [data ? data.name : ''], sharePercentage: [data ? data.sharePercentage : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0]
    }));
    if (!data || this.getNominee.value.length < 1) {
      for (let e in this.getNominee.controls) {
        this.getNominee.controls[e].get('sharePercentage').setValue(0);
      }
    }

    if (this.getNominee.value.length > 1 && !data) {
      let share = 100 / this.getNominee.value.length;
      for (let e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        }
        else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }


  }
  /***nominee***/
  // ===================owner-nominee directive=====================//

  createDematForm(data) {
    (data == undefined) ? data = {} : data;
    this.dematForm = this.fb.group({
      modeOfHolding: [(data.modeOfHolding) ? String(data.modeOfHolding) : '1'],
      depositoryPartName: [data.depositoryParticipantName, [Validators.required]],
      depositoryPartId: [data.depositoryParticipantId, [Validators.required]],
      dematClientId: [data.dematClientId, [Validators.required]],
      brekerName: [data.brokerName],
      brokerAddress: [data.brokerAddress],
      linkedBankAccount: [data.linkedBankAccount],
      powerOfAttName: [data.powerOfAttorneyName],
      powerOfAttMasId: [data.powerOfAttorneyMasterId],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0]
      })]),
    });

    // ==============owner-nominee Data ========================\\
    /***owner***/
    if (this.dematForm.value.getCoOwnerName) {

      if (this.dematForm.value.getCoOwnerName.length == 1) {
        this.getCoOwner.controls['0'].get('share').setValue('100');
      }

      if (data.ownerList) {
        this.getCoOwner.removeAt(0);
        data.ownerList.forEach(element => {
          this.addNewCoOwner(element);
        });
      }
    }

    /***owner***/

    /***nominee***/
    if (data.nomineeList) {
      this.getNominee.removeAt(0);
      data.nomineeList.forEach(element => {
        this.addNewNominee(element);
      });
    }
    /***nominee***/

    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.dematForm }
    // ==============owner-nominee Data ========================\\
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
        if (data && data.length > 0) {
          this.dematList = data[0];
          this.createDematForm(this.dematList)
        }
      }, err => {
        this.dematList = {};
      }
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
            "id": 0,
            "mobileNo": element.get('number').value,
          });
        });
      }
      if (this.holderList) {
        this.holderList.controls.forEach(element => {
          holderList.push({
            // fMDetailTypeId: 1,
            name: element.get('name').value,
            id: element.get('id').value,
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
        "dematClientId": this.dematForm.get('dematClientId').value
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
