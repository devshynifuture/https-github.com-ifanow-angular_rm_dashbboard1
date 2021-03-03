import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProcessTransactionService } from '../../overview-transactions/doTransaction/process-transaction.service';
import { startWith, map } from 'rxjs/operators';
import { ValidatorType } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { OnlineTransactionService } from '../../online-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-edit-fatca-details',
  templateUrl: './edit-fatca-details.component.html',
  styleUrls: ['./edit-fatca-details.component.scss']
})
export class EditFatcaDetailsComponent implements OnInit {
  fatcaDetails: any;
  filterCountryName: Observable<unknown>;
  countryList: any;
  occupationArray = [{
    name: 'Private Sector',
    code: '41',
    sourceCode: '01'
  }, {
    name: 'Public Sector',
    code: '42',
    sourceCode: '01'
  }, {
    name: 'Business',
    code: '01',
    sourceCode: '02'
  }, {
    name: 'Professional',
    code: '03',
    sourceCode: '01'
  }, {
    name: 'Retired',
    code: '05',
    sourceCode: '08'
  }, {
    name: 'Housewife',
    code: '06',
    sourceCode: '08'
  }, {
    name: 'Student',
    code: '07',
    sourceCode: '08'
  }, {
    name: 'Government Sector',
    code: '44',
    sourceCode: '01'
  }, {
    name: 'Self Employed',
    code: '08',
    sourceCode: '08'
  }];
  occupationFilteredArray = [].concat(this.occupationArray);
  validatorType = ValidatorType;
  inputData: any;

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
  };
  registerData: any;
  constructor(private fb: FormBuilder,
    private subInjectService: SubscriptionInject,
    private processTransaction: ProcessTransactionService,
    private onlineTransact: OnlineTransactionService,
    private eventService: EventService) { }
  @Input()
  set data(data) {
    this.inputData = data
    this.setDataForm(data)
    console.log('input date', data)
  }
  ngOnInit() {
    this.getIINUCCRegistration()
  }
  getIINUCCRegistration() {
    const obj = {
      id: this.inputData.id,
    };

    this.onlineTransact.getIINUCCRegistration(obj).subscribe(
      data => this.getIINUCCRegistrationRes(data), (error) => {
      }
    );
  }
  getIINUCCRegistrationRes(data) {
    console.log('registrastion detaisls', data)
    this.registerData = data
    //this.setDataForm(data)
  }


  setDataForm(holderData) {
    const data = holderData;
    this.fatcaDetails = this.fb.group({
      nationality: [(!data) ? '1' : (data.nationality) ? data.nationality + '' : '1', [Validators.required]],
      annualIncome: [(!data) ? '' : data.income, [Validators.required]],
      placeOfBirth: [(!data) ? '' : data.placeOfBirth, [Validators.required]],
      countryOfBirth: [!data ? '' : data.countryOfBirth, [Validators.required]],
      sourceOfWealth: [!data.sourceOfWealth ? '' : data.sourceOfWealth, [Validators.required]],
      occupationCode: [!data.occupationCode ? '' : data.occupationCode, [Validators.required]],
      name: [!data ? '' : data.clientName, [Validators.required]],
      pan: [!data ? '' : data.pan, [Validators.required]],
      politically: [!data ? '2' : (data.politically) ? data.politically + '' : '2', [Validators.required]],
      // taxResidency: [!data ? '1' : (data.taxResidency) ? data.taxResidency + '' : '1', [Validators.required]],

    });
    this.fatcaDetails.get('pan').disable();
    this.fatcaDetails.controls.countryOfBirth.valueChanges.subscribe(newValue => {
      this.filterCountryName = new Observable().pipe(startWith(''), map(value => {
        return this.processTransaction.filterName(newValue, this.countryList);
      }));
    });
    this.fatcaDetails.controls.sourceOfWealth.valueChanges.subscribe(newValue => {
      this.occupationFilteredArray = this.occupationArray.filter(singleOcc => singleOcc.sourceCode == newValue);
    });
    if (!data && holderData.address) {
      this.fatcaDetails.controls.placeOfBirth.setValue(holderData.address.city);
      this.fatcaDetails.controls.countryOfBirth.setValue(holderData.address.country);
    }
  }
  getFormControl(): any {
    return this.fatcaDetails.controls;
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  save() {
    const obj = {
      tpUserCredentialId: this.inputData.tpUserCredentialId,
      aggregatorType: this.inputData.aggregatorType,
      occupationCode: this.fatcaDetails.get('occupationCode').value,
      panNumber: this.fatcaDetails.get('pan').value,
      clientName: this.fatcaDetails.get('name').value,
      taxStatus: this.inputData.taxStatus,
      addressType: 1,
      placeOfBirth: this.fatcaDetails.get('placeOfBirth').value,
      countryOfBirth: this.fatcaDetails.get('countryOfBirth').value,
      sourceOfWealth: this.fatcaDetails.get('sourceOfWealth').value,
      income: this.fatcaDetails.get('annualIncome').value,
      politicallyExposedFlag: (this.fatcaDetails.get('politically').value == '2') ? 'N' : (this.fatcaDetails.get('politically').value == '1') ? 'Y' : 'R',
      dob: this.registerData.holderList[0].dob,
      newFlag: 2,
      logName: this.registerData.holderList[0].email,
      advisorId: this.inputData.advisorId,
      clientId: this.inputData.clientId,
      familyMemberId: this.inputData.familyMemberId,
    };
    this.onlineTransact.uploadNewFatacaDetails(obj).subscribe(
      data => this.uploadNewFatacaDetailsRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  uploadNewFatacaDetailsRes(data) {

  }
}
