import { Component, OnInit, Input } from '@angular/core';
import { OnlineTransactionService } from '../../../../online-transaction.service';
import { AuthService } from 'src/app/auth-service/authService';
import { Validators, FormBuilder } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { FatcaDetailsInnComponent } from '../fatca-details-inn/fatca-details-inn.component';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-submit-review-inn',
  templateUrl: './submit-review-inn.component.html',
  styleUrls: ['./submit-review-inn.component.scss']
})
export class SubmitReviewInnComponent implements OnInit {
  changedValue: string;
  advisorId: any;
  brokerCredentials: any;
  reviewSubmit: any;
  inputData: any;
  nse: any;
  bse: any;
  allData: any;
  selectedBrokerBse: any;
  selectedBrokerNse: any;
  matValue: any;
  addedNse = false;
  addedBse = false;
  doneData: any;

  constructor(private onlineTransact: OnlineTransactionService, private fb: FormBuilder,
    private eventService: EventService) { }
  @Input()
  set data(data) {
    this.doneData = {}
    this.inputData = data;
    this.allData = data
    this.doneData.nominee = true
    this.doneData.bank = true
    this.doneData.contact = true
    this.doneData.personal = true
    if (data && data.firstHolder) {
      // this.getdataForm(data.firstHolder)
      // this.firstHolder = data.firstHolder
      // this.secondHolder = data.secondHolder
      // this.thirdHolder = data.thirdHolder
      // console.log('return data', data)
    }
    // this.generalDetails = data
  }
  close() {
    const fragmentData = {
      direction: 'top',
      componentName: SubmitReviewInnComponent,
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
    this.changedValue = 'close'
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.changedValue = ''
    this.advisorId = AuthService.getAdvisorId();
    this.getBSECredentials()
    this.advisorId = AuthService.getAdvisorId()
    this.getdataForm('');
    this.matValue = false
  }
  getBSECredentials() {
    let obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    }
    console.log('encode', obj)
    this.onlineTransact.getBSECredentials(obj).subscribe(
      data => this.getBSECredentialsRes(data)
    );
  }
  getBSECredentialsRes(data) {
    console.log('getBSECredentialsRes', data)
    this.brokerCredentials = data

    this.nse = this.brokerCredentials.filter(element => element.aggregatorType == 2)
    this.bse = this.brokerCredentials.filter(element => element.aggregatorType == 1)
    console.log('nse', this.nse)
    console.log('bse', this.bse)
  }
  getdataForm(data) {

    this.reviewSubmit = this.fb.group({
      bseBroker: [!data ? '' : data.bseBroker, [Validators.required]],
      accountNumber: [!data ? '' : data.accountNumber, [Validators.required]],
      nseBroker: [!data ? '' : data.nseBroker, [Validators.required]],
    });
  }
  openFatcaDetails(){
    var data = this.inputData
    var temp = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: FatcaDetailsInnComponent,
      state: 'open'
    }
    const subscription = this.eventService.changeUpperSliderState(temp).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          subscription.unsubscribe();
        }
      }
    );
  }
  getFormControl(): any {
    return this.reviewSubmit.controls;
  }
  selectArn(value) {
    this.selectedBrokerBse = value
  }
  selectArnNse(value) {
    this.selectedBrokerNse = value
  }
  addNse(value) {
    console.log('mat check', value)
    this.addedNse = value.checked
  }
  addBse(value) {
    console.log('mat check', value)
    this.addedBse = value.checked
  }
  submit() {
    this.doneData = true
    if(this.addedBse == true){
      let obj1 = {
        ownerName: this.allData.ownerName,
        holdingType: this.allData.holdingType,
        taxStatus: this.allData.taxStatus,
        holderList: this.allData.holderList,
        bankDetailList: this.allData.bankDetailList,
        nomineeList: this.allData.nomineeList,
        fatcaDetail: this.allData.fatcaDetail,
        id: 2,
        aggregatorType: this.selectedBrokerBse.aggregatorType,
        familyMemberId: this.allData.familyMemberId,
        clientId: this.allData.clientId,
        advisorId: this.allData.advisorId,
        tpUserCredentialId: this.selectedBrokerBse.id,
        commMode: 1,
        confirmationFlag: 1,
        tpUserSubRequestClientId1: 2,
        
      }
      this.onlineTransact.createIINUCC(obj1).subscribe(
        data => this.createIINUCCRes(data), (error) => {
          this.eventService.showErrorMessage(error);
        }
      );
    }else if(this.addedNse == true){
      let obj1 = {
        ownerName: this.allData.ownerName,
        holdingType: this.allData.holdingType,
        taxStatus: this.allData.taxStatus,
        holderList: this.allData.holderList,
        bankDetailList: this.allData.bankDetailList,
        nomineeList: this.allData.nomineeList,
        fatcaDetail: this.allData.fatcaDetail,
        id: 2,
        aggregatorType: this.selectedBrokerNse.aggregatorType,
        familyMemberId: this.allData.familyMemberId,
        clientId: this.allData.clientId,
        advisorId: this.allData.advisorId,
        tpUserCredentialId: this.selectedBrokerBse.id,
        commMode: 1,
        confirmationFlag: 1,
        tpUserSubRequestClientId1: 2,
        
      }
      this.onlineTransact.createIINUCC(obj1).subscribe(
        data => this.createIINUCCRes(data), (error) => {
          this.eventService.showErrorMessage(error);
        }
      );
    }
   
  }
  createIINUCCRes(data) {
    console.log('data respose =', data)
  }
}
