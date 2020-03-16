import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class BankAccountsComponent implements OnInit {
  validatorType = ValidatorType
  ownerName: any;
  inputData: any;
  familyMemberId: any;
  isAccountType = false
  isBalanceAsOn = false;
  isAccountBalance = false;
  isInterestRate = false;
  isCompound = false;
  ownerData: any;
  bankAccounts: any;
  showHide = false;
  advisorId: any;
  clientId: any;
  nomineesListFM: any;
  flag: any;
  nomineesList: any[] = [];
  bankData: any;
  nominees: any[];
  adviceShowHeaderAndFooter: boolean = true;
  isAdviceFormValid: boolean = false;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  editData: any;
  constructor(private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) { }

  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  @Input() popupHeaderText: string = 'Add Bank account';

  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }

  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls;
  }

  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }
  showLess(value) {
    if (value == true) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }
  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag })
  }
  onlyTextNotSplChar(event: any) {
    var k = event.keyCode;
    return ((k > 64 && k < 91) || (k == 32) || (k > 96 && k < 123) || k == 8);
  }
  getdataForm(data) {
    this.flag = data;
    // // (!data) ? data = {} : (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : ''
    if (data == undefined) {
      data = {}
      this.flag = "addBANK";
    }
    else {
      this.flag = "editBANK";
      (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : this.editData = data;
    }
    this.bankData = {};
    this.bankAccounts = this.fb.group({
      ownerName: [(data.ownerName == undefined) ? '' : data.ownerName, [Validators.required]],
      accountType: [(data.accountType == undefined) ? '' : (data.accountType) + "", [Validators.required]],
      accountBalance: [(data.accountBalance == undefined) ? '' : data.accountBalance, [Validators.required]],
      balanceAsOn: [(data.balanceAsOn == undefined) ? '' : new Date(data.balanceAsOn), [Validators.required]],
      interestRate: [(data.interestRate == undefined) ? '' : data.interestRate, [Validators.required]],
      compound: [(data.interestCompounding == undefined) ? '' : (data.interestCompounding) + "", [Validators.required]],
      bankName: [(data.bankName == undefined) ? '' : data.bankName,],
      bankAcNo: [(data.accountNo == undefined) ? '' : data.accountNo,],
      description: [(data.description == undefined) ? '' : data.description,],
      // id: [(data.id == undefined) ? '' : data.id,],
      familyMemberId: [[(data.familyMemberId == undefined) ? '' : data.familyMemberId],],
      nomineeList: this.nomineesList
    });
    this.ownerData = this.bankAccounts.controls;
    this.familyMemberId = data.familyMemberId
  }
  onChange(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
      this.bankAccounts.get('interestRate').setValue(event.target.value);
    }
  }
  getFormControl(): any {
    return this.bankAccounts.controls;
  }
  saveCashInHand() {

    if (this.bankAccounts.invalid) {
      this.inputs.find(input => !input.ngControl.valid).focus();
      this.bankAccounts.markAllAsTouched();

    } else {
      this.nominees = []
      if (this.nomineesList) {

        this.nomineesList.forEach(element => {
          let obj = {
            "name": element.controls.name.value,
            "sharePercentage": element.controls.sharePercentage.value,
            "id": (element.controls.id.value) ? element.controls.id.value : 0,
            "familyMemberId": (element.controls.familyMemberId.value) ? element.controls.familyMemberId.value : 0
          }
          this.nominees.push(obj)
        });
      }
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        ownerName: (this.ownerName == undefined) ? this.bankAccounts.controls.ownerName.value : this.ownerName,
        accountType: this.bankAccounts.controls.accountType.value,
        balanceAsOn: this.datePipe.transform(this.bankAccounts.controls.balanceAsOn.value, 'yyyy-MM-dd'),
        bankName: this.bankAccounts.controls.bankName.value,
        interestCompounding: this.bankAccounts.controls.compound.value,
        interestRate: this.bankAccounts.controls.interestRate.value,
        accountBalance: this.bankAccounts.controls.accountBalance.value,
        accountNo: this.bankAccounts.controls.bankAcNo.value,
        description: this.bankAccounts.controls.description.value,
        nominees: this.nominees
      }

      let adviceObj = {
        advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.flag == "addBANK") {
        this.custumService.addBankAccounts(obj).subscribe(
          data => this.addBankAccountsRes(data), (error) => {
            this.eventService.showErrorMessage(error);
          }
        );
      } else if (this.flag == 'adviceBankAccount') {
        this.custumService.getAdviceBankAccount(adviceObj).subscribe(
          data => this.getAdviceBankAccountRes(data), (error) => {
            this.eventService.showErrorMessage(error);
          }
        );
      } else {
        //edit call
        obj['id'] = this.editData.id,
          this.custumService.editBankAcounts(obj).subscribe(
            data => this.editBankAcountsRes(data), (error) => {
              this.eventService.showErrorMessage(error);
            }
          );
      }
    }
  }

  isFormValuesForAdviceValid(): boolean {
    if (this.bankAccounts.valid || (this.bankAccounts.valid && this.nomineesList.length !== 0)) {
      return true;
    } else {
      return false;
    }
  }

  getAdviceBankAccountRes(data) {
    this.eventService.openSnackBar('Bank account added successfully', 'OK');
    this.subInjectService.changeNewRightSliderState({ flag: 'addedbankAc', state: 'close', data, refreshRequired: true })
  }
  addBankAccountsRes(data) {
    console.log('addrecuringDepositRes', data)
    this.subInjectService.changeNewRightSliderState({ flag: 'addedbankAc', state: 'close', data, refreshRequired: true })
    this.eventService.openSnackBar('Added successfully!', 'OK');

  }
  editBankAcountsRes(data) {
    this.subInjectService.changeNewRightSliderState({ flag: 'editedbankAc', state: 'close', data, refreshRequired: true })
    this.eventService.openSnackBar('Updated successfully!', 'OK');

  }
}
