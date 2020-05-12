import {Component, Input, OnInit} from '@angular/core';
import {BankDetailsIINComponent} from '../bank-details-iin/bank-details-iin.component';
import {UtilService} from 'src/app/services/util.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {FormBuilder} from '@angular/forms';
import {CustomerService} from 'src/app/component/protect-component/customers/component/customer/customer.service';
import {DatePipe} from '@angular/common';
import {EventService} from 'src/app/Data-service/event.service';
import {NomineeDetailsIinComponent} from '../nominee-details-iin/nominee-details-iin.component';
import {ProcessTransactionService} from '../../../doTransaction/process-transaction.service';
import {FatcaDetailsInnComponent} from '../fatca-details-inn/fatca-details-inn.component';
import {ContactDetailsInnComponent} from '../contact-details-inn/contact-details-inn.component';
import {PersonalDetailsInnComponent} from '../personal-details-inn/personal-details-inn.component';
import {SubmitReviewInnComponent} from '../submit-review-inn/submit-review-inn.component';

@Component({
  selector: 'app-left-side-inn-ucc-list',
  templateUrl: './left-side-inn-ucc-list.component.html',
  styleUrls: ['./left-side-inn-ucc-list.component.scss']
})
export class LeftSideInnUccListComponent implements OnInit {
  inputData: any;

  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
              private processTransaction: ProcessTransactionService,
              private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) {
  }

  ngOnInit() {
  }

  close() {
    const fragmentData = {
      direction: 'top',
      componentName: LeftSideInnUccListComponent,
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }

  openPersonalDetails(data) {

    const fragmentData = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: PersonalDetailsInnComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }

  openBankDetails(data) {
    const fragmentData = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: BankDetailsIINComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }

  openContactDetails(data) {
    const fragmentData = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: ContactDetailsInnComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }

  openFatcaDetails(data) {

    const fragmentData = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: FatcaDetailsInnComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }

  openNomineeDetails(data) {
    const fragmentData = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: NomineeDetailsIinComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }


  openReviewSubmit(data) {
    const fragmentData = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: SubmitReviewInnComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }


}
