import {AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
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
export class FatcaDetailsInnComponent implements OnInit, AfterViewInit {

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
    formId = 'first';
    firstHolderContact: any;
    secondHolderContact: any;
    thirdHolderContact: any;

    constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
                private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService,
                private onlineTransact: OnlineTransactionService, private processTransaction: ProcessTransactionService,
                public eventService: EventService) {
    }

    get data() {
        return this.inputData;
    }

    @Input()
    set data(data) {
        this.inputData = data;
        console.log('Data in fatca detail : ', data);
        this.clientData = data.clientData;
        this.allData = data;
        this.doneData = {};
        this.doneData.nominee = true;
        this.doneData.bank = true;
        this.doneData.contact = true;
        this.doneData.personal = true;
        this.doneData.fatca = false;
        this.allData.clientData = this.clientData;
        if (data && data.holderList) {
            this.firstHolderContact = data.holderList[0];
            this.setDataForm(this.formId, this.firstHolderContact);

            if (data.holderList.length > 1) {
                this.secondHolderContact = data.holderList[1];
            }
            if (data.holderList.length > 2) {
                this.thirdHolderContact = data.holderList[2];
            }
        }
        this.setDataForm(this.formId, this.firstHolderContact);
    }

    ngOnInit() {
        this.setDataForm(this.formId, this.firstHolderContact);


        this.processTransaction.getCountryCodeList().subscribe(responseValue => {
            this.countryList = responseValue;
        });
    }

    ngAfterViewInit(): void {
        // TODO for testing only
        // const dataObj = {
        //   income: '500000', sourceOfWealth: '01',
        //   occupationCode: '41', placeOfBirth: 'India',
        //   countryOfBirth: 'India'
        // };
        // this.getdataForm(dataObj);
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

    setDataForm(formId, holderData) {
        const data = holderData.fatcaDetail;
        this.fatcaDetails = this.fb.group({
            nationality: [(!data) ? '1' : (data.nationality) ? data.nationality + '' : '1', [Validators.required]],
            annualIncome: [(!data) ? '' : data.income, [Validators.required]],
            placeOfBirth: [(!data) ? '' : data.placeOfBirth, [Validators.required]],
            countryOfBirth: [!data ? '' : data.countryOfBirth, [Validators.required]],
            sourceOfWealth: [!data ? '' : data.sourceOfWealth, [Validators.required]],
            occupationCode: [!data ? '' : data.occupationCode, [Validators.required]],
            politically: [!data ? '2' : (data.politically) ? data.politically + '' : '2', [Validators.required]],
            // taxResidency: [!data ? '1' : (data.taxResidency) ? data.taxResidency + '' : '1', [Validators.required]],

        });
        this.fatcaDetails.controls.countryOfBirth.valueChanges.subscribe(newValue => {
            this.filterCountryName = new Observable().pipe(startWith(''), map(value => {
                return this.processTransaction.filterName(newValue, this.countryList);
            }));
        });
        if (!data && holderData.address) {
            this.fatcaDetails.controls.placeOfBirth.setValue(holderData.address.city);
            this.fatcaDetails.controls.countryOfBirth.setValue(holderData.address.country);
        }
    }

    getFormControl(): any {
        return this.fatcaDetails.controls;
    }

    SendToForm(formId, isDone) {

        if (this.saveFormDetail(this.formId)) {
            this.formId = formId;
            if (this.formId == 'second') {
                this.setDataForm(formId, this.secondHolderContact);
            } else if (this.formId == 'third') {
                this.setDataForm(formId, this.thirdHolderContact);
            } else {
                this.setDataForm(formId, this.firstHolderContact);
            }
        } else {
            return;
        }
        if (isDone) {
            if (this.secondHolderContact) {
                if (this.secondHolderContact.fatcaDetail && this.secondHolderContact.fatcaDetail.income) {

                } else {
                    this.eventService.openSnackBar('Please fill second holder fatca details', 'Dismiss');
                    return;
                }
            }
            if (this.thirdHolderContact) {
                if (this.thirdHolderContact.fatcaDetail && this.thirdHolderContact.fatcaDetail.income) {

                } else {
                    this.eventService.openSnackBar('Please fill third holder fatca details', 'Dismiss');
                    return;
                }
            }
        }

        const obj1 = {
            ...this.inputData,
            // fatcaDetail: obj,
            commMode: 1,
            confirmationFlag: 1,
        };
        this.openReviwSubmit(obj1);

    }

    saveFormDetail(formId) {
        if (this.fatcaDetails.invalid) {
            for (const element in this.fatcaDetails.controls) {
                if (this.fatcaDetails.get(element).invalid) {
                    // this.inputs.find(input => !input.ngControl.valid).focus();
                    this.fatcaDetails.controls[element].markAsTouched();
                }
            }
            return false;
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
            if (formId == 'second') {
                this.secondHolderContact.fatcaDetail = obj;
            } else if (formId == 'third') {
                this.thirdHolderContact.fatcaDetail = obj;
            } else {
                this.firstHolderContact.fatcaDetail = obj;
            }
            return true;
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
