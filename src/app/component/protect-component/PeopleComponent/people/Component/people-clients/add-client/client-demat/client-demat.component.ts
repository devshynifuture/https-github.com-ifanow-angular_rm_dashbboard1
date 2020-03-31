import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';

@Component({
  selector: 'app-client-demat',
  templateUrl: './client-demat.component.html',
  styleUrls: ['./client-demat.component.scss']
})
export class ClientDematComponent implements OnInit {
  mobileData: any;

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject, private peopleService: PeopleService, private eventService: EventService) { }
  dematForm;
  userData;
  mobileNumberFlag = "Broker number"
  validatorType = ValidatorType;
  @Output() tabChange = new EventEmitter();
  @Input() set data(data) {
    this.userData = data;
  }
  ngOnInit() {
    this.dematForm = this.fb.group({
      modeOfHolding: ['1'],
      holderNameList: new FormArray([]),
      depositoryPartName: [],
      depositoryPartId: [],
      clientId: [],
      brekerName: [],
      brokerAddress: [],
      brokerPhone: [],
      linkedBankAccount: [],
      powerOfAttName: [],
      powerOfAttMasId: []
    })
    this.addHolders();
  }
  getNumberDetails(data) {
    console.log(data);
    this.mobileData = data;
  }
  get getDematForm() { return this.dematForm.controls };
  get holderNameList() { return this.getDematForm.holderNameList as FormArray };
  addHolders() {
    if (this.holderNameList.length == 3) {
      return;
    }
    this.holderNameList.push(this.fb.group({
      name: ['']
    }));
  }
  removeHolders(index) {
    this.dematForm.controls.transactionFormList.removeAt(index)
  }
  saveNext(flag) {
    if (this.dematForm.invalid) {
      this.dematForm.markAllAsTouched();
      return;
    }
    else {
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
