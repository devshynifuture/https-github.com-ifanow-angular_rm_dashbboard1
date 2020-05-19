import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {EventService} from 'src/app/Data-service/event.service';
import {CustomerService} from 'src/app/component/protect-component/customers/component/customer/customer.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {UtilService, ValidatorType} from 'src/app/services/util.service';
import {FormBuilder, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {OnlineTransactionService} from '../../../../online-transaction.service';
import {ProcessTransactionService} from '../../../doTransaction/process-transaction.service';
import {SubmitReviewInnComponent} from '../submit-review-inn/submit-review-inn.component';
import {MatInput} from '@angular/material';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

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
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  validatorType = ValidatorType;
  clientData: any;
  countryList;
  filterCountryName: Observable<any[]>;


  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
              private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService,
              private onlineTransact: OnlineTransactionService, private processTransaction: ProcessTransactionService,
              public eventService: EventService) {
  }

  @Input()
  set data(data) {
    this.inputData = data;
    this.clientData = data.clientData;
    console.log('all data in fatca', this.inputData);
    this.allData = data;
    this.doneData = {};
    this.doneData.nominee = true;
    this.doneData.bank = true;
    this.doneData.contact = true;
    this.doneData.personal = true;
    this.doneData.fatca = false;
    this.allData.clientData = this.clientData;
    this.getdataForm(data.fatcaDetail);
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    if (this.allData.fatcaDetail) {
      this.getdataForm(this.allData.fatcaDetail);
    } else {
      this.getdataForm('');
    }

    this.processTransaction.getCountryCodeList().subscribe(responseValue => {
      this.countryList = responseValue;
    });
  }

  close() {
    this.changedValue = 'close';
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
      nationality: [(!data) ? '1' : (data.nationality) ? data.nationality + '' : '1', [Validators.required]],
      annualIncome: [(!data) ? '' : data.income, [Validators.required]],
      placeOfBirth: [(!data) ? '' : data.placeOfBirth, [Validators.required]],
      countryOfBirth: [!data ? '' : data.countryOfBirth, [Validators.required]],
      sourceOfWealth: [!data ? '' : data.sourceOfWealth, [Validators.required]],
      occupationCode: [!data ? '' : data.occupationCode, [Validators.required]],
      politically: [!data ? '1' : (data.politically) ? data.politically + '' : '1', [Validators.required]],
      // taxResidency: [!data ? '1' : (data.taxResidency) ? data.taxResidency + '' : '1', [Validators.required]],

    });
    this.fatcaDetails.controls.countryOfBirth.valueChanges.subscribe(newValue => {
      this.filterCountryName = new Observable().pipe(startWith(''), map(value => {
        return this.processTransaction.filterName(newValue, this.countryList);
      }));
    });
    if (!data) {
      this.fatcaDetails.controls.placeOfBirth.setValue(this.inputData.holderList[0].address.city);
      this.fatcaDetails.controls.countryOfBirth.setValue(this.inputData.holderList[0].address.country);
    }
  }

  getFormControl(): any {
    return this.fatcaDetails.controls;
  }

  SendToForm() {
    if (this.fatcaDetails.invalid) {
      for (const element in this.fatcaDetails.controls) {
        console.log(element);
        if (this.fatcaDetails.get(element).invalid) {
          // this.inputs.find(input => !input.ngControl.valid).focus();
          this.fatcaDetails.controls[element].markAsTouched();
        }
      }
    } else {

      const obj = {
        nationality: this.fatcaDetails.controls.nationality.value,
        income: this.fatcaDetails.controls.annualIncome.value,
        placeOfBirth: this.fatcaDetails.controls.placeOfBirth.value,
        countryOfBirth: this.fatcaDetails.controls.countryOfBirth.value,
        sourceOfWealth: this.fatcaDetails.controls.sourceOfWealth.value,
        occupationCode: this.fatcaDetails.controls.occupationCode.value,
        politicallyExposedFlag: (this.fatcaDetails.controls.politically.value == 1) ? 'Y' :
          (this.fatcaDetails.controls.politically.value == 2) ? 'N' : 'R',
        // taxResidency: this.fatcaDetails.controls.taxResidency.value,
      };

      const obj1 = {
        ...this.inputData,
        fatcaDetail: obj,
        commMode: 1,
        confirmationFlag: 1,
      };
      this.openReviwSubmit(obj1);
    }
  }

  openReviwSubmit(data) {
    const temp = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: SubmitReviewInnComponent,
      state: 'open'
    };
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
