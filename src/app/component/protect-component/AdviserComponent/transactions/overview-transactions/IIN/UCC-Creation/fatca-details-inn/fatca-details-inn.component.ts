import { Component, OnInit, Input } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { OnlineTransactionService } from '../../../../online-transaction.service';
import { ProcessTransactionService } from '../../../doTransaction/process-transaction.service';
import { SubmitReviewInnComponent } from '../submit-review-inn/submit-review-inn.component';
import { LeftSideInnUccListComponent } from '../left-side-inn-ucc-list/left-side-inn-ucc-list.component';

@Component({
  selector: 'app-fatca-details-inn',
  templateUrl: './fatca-details-inn.component.html',
  styleUrls: ['./fatca-details-inn.component.scss']
})
export class FatcaDetailsInnComponent implements OnInit {
  fatcaDetails: any;
  inputData: any;
  allData: any;
  changedValue: string;
  doneData: any;


  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
    private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService,
    private onlineTransact: OnlineTransactionService, private processTransaction: ProcessTransactionService,
    public eventService: EventService) { }
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('all data in fatca', this.inputData)
    this.allData = data
    this.doneData = {}
    this.doneData.nominee = true
    this.doneData.bank = true
    this.doneData.contact = true
    this.doneData.personal = true
    this.doneData.fatca = false
    this.getdataForm(data.fatcaDetail)
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    if (this.allData.fatcaDetail) {
      this.getdataForm(this.allData.fatcaDetail)
    } else {
      this.getdataForm('')
    }
  }
  close() {
    this.changedValue = 'close'
    const fragmentData = {
      direction: 'top',
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
  openNomineeDetails() {
    const subscription = this.processTransaction.openNominee(this.allData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          subscription.unsubscribe();
        }
      }
    );
  }
  getdataForm(data) {

    this.fatcaDetails = this.fb.group({
      nationality: [(!data) ? '' : data.nationality, [Validators.required]],
      annualIncome: [(!data) ? '' : data.annualIncome, [Validators.required]],
      cityOfBirth: [(!data) ? '' : data.cityOfBirth, [Validators.required]],
      countryOfBirth: [!data ? '' : data.countryOfBirth, [Validators.required]],
      sourceOfWealth: [!data ? '' : data.sourceOfWealth, [Validators.required]],
      occupation: [!data ? '' : data.occupation, [Validators.required]],
      politically: [!data ? '' : data.politically, [Validators.required]],
      taxResidency: [!data ? '' : data.taxResidency, [Validators.required]],

    });
  }
  getFormControl(): any {
    return this.fatcaDetails.controls;
  }
  SendToForm() {
    if (this.fatcaDetails.get('nationality').invalid) {
      this.fatcaDetails.get('nationality').markAsTouched();
      return;
    } else if (this.fatcaDetails.get('annualIncome').invalid) {
      this.fatcaDetails.get('annualIncome').markAsTouched();
      return;
    } else if (this.fatcaDetails.get('cityOfBirth').invalid) {
      this.fatcaDetails.get('cityOfBirth').markAsTouched();
      return;
    } else if (this.fatcaDetails.get('countryOfBirth').invalid) {
      this.fatcaDetails.get('countryOfBirth').markAsTouched();
      return
    } else if (this.fatcaDetails.get('sourceOfWealth').invalid) {
      this.fatcaDetails.get('sourceOfWealth').markAsTouched();
      return;
    } else if (this.fatcaDetails.get('occupation').invalid) {
      this.fatcaDetails.get('occupation').markAsTouched();
      return;
    } else if (this.fatcaDetails.get('politically').invalid) {
      this.fatcaDetails.get('politically').markAsTouched();
      return;
    } else if (this.fatcaDetails.get('taxResidency').invalid) {
      this.fatcaDetails.get('taxResidency').markAsTouched();
      return;
    } else {

      let obj = {
        nationality: this.fatcaDetails.controls.nationality.value,
        annualIncome: this.fatcaDetails.controls.annualIncome.value,
        cityOfBirth: this.fatcaDetails.controls.cityOfBirth.value,
        countryOfBirth: this.fatcaDetails.controls.countryOfBirth.value,
        sourceOfWealth: this.fatcaDetails.controls.sourceOfWealth.value,
        occupation: this.fatcaDetails.controls.occupation.value,
        politically: this.fatcaDetails.controls.politically.value,
        taxResidency: this.fatcaDetails.controls.taxResidency.value,
      }

      let obj1 = {
        ownerName: this.allData.ownerName,
        holdingType: this.allData.holdingType,
        taxStatus: this.allData.taxStatus,
        holderList: this.allData.holderList,
        bankDetailList: this.allData.bankDetailList,
        nomineeList: this.allData.nomineeList,
        generalDetails: this.allData.generalDetails,
        fatcaDetail: obj,
        id: 2,
        aggregatorType: 1,
        familyMemberId: this.allData.familyMemberId,
        clientId: this.allData.clientId,
        advisorId: this.allData.advisorId,
        commMode: 1,
        confirmationFlag: 1,
        tpUserSubRequestClientId1: 2,
      }
      this.openReviwSubmit(obj1);
    }
  }
  openReviwSubmit(data) {
    var temp = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: SubmitReviewInnComponent,
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
  // this.onlineTransact.createIINUCC(obj).subscribe(
  //   data => this.createIINUCCRes(data), (error) => {
  //     this.eventService.showErrorMessage(error);
  //   }
  // );
}