import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {CustomerService} from 'src/app/component/protect-component/customers/component/customer/customer.service';
import {DatePipe} from '@angular/common';
import {UtilService} from 'src/app/services/util.service';
import {EventService} from 'src/app/Data-service/event.service';
import {OnlineTransactionService} from '../../../../online-transaction.service';
import {ProcessTransactionService} from '../../../doTransaction/process-transaction.service';

@Component({
  selector: 'app-iin-ucc-creation',
  templateUrl: './iin-ucc-creation.component.html',
  styleUrls: ['./iin-ucc-creation.component.scss']
})
export class IinUccCreationComponent implements OnInit {
  nomineesListFM: any = [];
  showSpinnerOwner = false;
  familyMemberData: any;
  familyMemberId: any;
  generalDetails: any;

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder, private processTrasaction: ProcessTransactionService,
              private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService,
              private onlineTransact: OnlineTransactionService, public eventService: EventService) {
  }

  ngOnInit() {
    this.getIINUCCRegistration();
    this.getdataForm('');
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({state: 'close', refreshRequired: flag});
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
  openPersonalDetails(data) {

    const subscription = this.processTrasaction.openPersonal(data).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );

    // const fragmentData = {
    //   flag: 'app-upper-customer',
    //   id: 1,
    //   data,
    //   direction: 'top',
    //   componentName: PersonalDetailsInnComponent,
    //   state: 'open'
    // };
    // const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
    //   upperSliderData => {
    //     if (UtilService.isDialogClose(upperSliderData)) {
    //       // this.getClientSubscriptionList();
    //       subscription.unsubscribe();
    //     }
    //   }
    // );
  }
  getIINUCCRegistration() {
    const obj = {
      id: 2,
    };

    this.onlineTransact.getIINUCCRegistration(obj).subscribe(
      data => this.getIINUCCRegistrationRes(data), (error) => {
      }
    );
  }
  getIINUCCRegistrationRes(data) {
    console.log('INN UCC CREATION DATA GET', data);
  }

  lisNominee(value) {
    // this.showSpinnerOwner = false
    if (value == null) {
      // this.transactionAddForm.get('ownerName').setErrors({ 'setValue': 'family member does not exist' });
      // this.transactionAddForm.get('ownerName').markAsTouched();
    }
    console.log(value);
    this.nomineesListFM = Object.assign([], value);
  }
  ownerList(value) {
    if (value == '') {
      this.showSpinnerOwner = false;
    } else {
      this.showSpinnerOwner = true;
    }
  }

  ownerDetails(value) {
    this.familyMemberData = value;
    this.familyMemberId = value.familyMemberId;
    this.familyMemberId = value.id;
  }

  saveGeneralDetails(data) {
    const obj = {
      ownerName: this.generalDetails.controls.ownerName.value,
      holdingNature: this.generalDetails.controls.holdingNature.value,
      familyMemberId: this.familyMemberId,
      clientId: this.familyMemberData.clientId,
      advisorId: this.familyMemberData.advisorId,
      taxStatus: this.generalDetails.controls.taxStatus.value,
    };
    this.openPersonalDetails(obj);
  }
}
