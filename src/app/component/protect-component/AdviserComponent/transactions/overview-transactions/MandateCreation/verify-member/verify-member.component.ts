import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { ProcessTransactionService } from '../../doTransaction/process-transaction.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MandateCreationComponent } from '../mandate-creation/mandate-creation.component';

@Component({
  selector: 'app-verify-member',
  templateUrl: './verify-member.component.html',
  styleUrls: ['./verify-member.component.scss']
})
export class VerifyMemberComponent implements OnInit {
  nomineesListFM: any;
  showSpinnerOwner = false;
  familyMemberData: any;
  familyMemberId: any;
  generalDetails: any;
  clientCodeData: any;

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,private processTrasaction : ProcessTransactionService,
    private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService,
    private onlineTransact: OnlineTransactionService, public eventService: EventService) { }

  ngOnInit() {
    this.getdataForm('')
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag })
  }
  close() {
    const fragmentData = {
      direction: 'top',
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
  getdataForm(data) {

    this.generalDetails = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      holdingNature: [(!data) ? '' : data.ownerName, [Validators.required]],
      taxStatus: [data ? '' : data.ownerName, [Validators.required]],
    });
  }
  getFormControl(): any {
    return this.generalDetails.controls;
  }

 

  lisNominee(value) {
    //this.showSpinnerOwner = false
    if (value == null) {
      // this.transactionAddForm.get('ownerName').setErrors({ 'setValue': 'family member does not exist' });
      // this.transactionAddForm.get('ownerName').markAsTouched();
    }
    console.log(value)
    this.nomineesListFM = Object.assign([], value);
  }
  ownerList(value) {
    if (value == "") {
      this.showSpinnerOwner = false
    } else {
      this.showSpinnerOwner = true
    }
  }
  ownerDetails(value) {
    this.familyMemberData = value;
    this.familyMemberId = value.familyMemberId
    this.familyMemberId = value.id;
    this.ownerDetail()
  }
  saveGeneralDetails(data){
    let obj = {
      ownerName: this.generalDetails.controls.ownerName.value,
      holdingNature: this.generalDetails.controls.holdingNature.value,
      familyMemberId : this.familyMemberId,
      clientId: this.familyMemberData.clientId,
      advisorId: this.familyMemberData.advisorId,
      taxStatus: this.generalDetails.controls.taxStatus.value,
    }
    this.openMandate(null)
  }
  ownerDetail() {
    
      const obj = {
        clientId: this.familyMemberData.clientId,
        advisorId: this.familyMemberData.advisorId,
        familyMemberId: this.familyMemberData.familyMemberId,
        tpUserCredentialId: 292
      }
      // let obj = {
      //   "advisorId": 414,
      //   "familyMemberId": 112166,
      //   "clientId": 53637
      // }
      this.onlineTransact.getClientCodes(obj).subscribe(
        data => {
          console.log(data);
          this.clientCodeData = data;
        },
        err => this.eventService.openSnackBar(err, 'Dismiss')
      );
  }
  selectIINUCC(){
    
  }
  openMandate(data){
    const fragmentData = {
      flag: 'mandate',
      data,
      id: 1,
      state: 'open',
      componentName: MandateCreationComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);

        if (UtilService.isRefreshRequired(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);

        }
        rightSideDataSub.unsubscribe();
      }
    );
  }
}