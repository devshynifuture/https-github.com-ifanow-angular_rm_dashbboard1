import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';
import { DatePipe } from '@angular/common';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { MatDialog, MatInput } from '@angular/material';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-ssy-mob',
  templateUrl: './ssy-mob.component.html',
  styleUrls: ['./ssy-mob.component.scss']
})
export class SsyMobComponent implements OnInit {

  constructor(private dateFormatPipe: DatePipe,
    public utils: UtilService, private eventService: EventService,
    private fb: FormBuilder, private subInjectService: SubscriptionInject,
    private cusService: CustomerService, private datePipe: DatePipe,
    public dialog: MatDialog, private enumService: EnumServiceService) {
  }

  @Input()
  set data(data) {
    this.clientId = AuthService.getClientId();
    this.requestDataForOwnerList.clientId = this.clientId;
    this.requestDataForGuardList.clientId = this.clientId;
    this.isOptionalField = true;
    this.advisorId = AuthService.getAdvisorId();
    this.getdataForm(data);
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }

  /***owner***/

  get getCoOwner() {
    return this.ssySchemeForm.get('getCoOwnerName') as FormArray;
  }

  /***owner***/

  /***nominee***/

  get getNominee() {
    return this.ssySchemeForm.get('getNomineeName') as FormArray;
  }
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
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  validatorType = ValidatorType;
  maxDate = new Date();
  minDate = new Date(2014, 1, 1);
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  ssySchemeForm: any;
  ownerData: any;
  requestDataForOwnerList = { age: 18, greaterOrLesser: 1, clientId: 0 };
  requestDataForGuardList = { age: 18, greaterOrLesser: 2, clientId: 0 };

  isOptionalField: boolean = true;
  advisorId: any;
  editApi: any;
  transactionData: any[] = [];
  clientId: any;
  nomineesListFM: any = [];
  ssyData: any;
  nomineesList: any[] = [];
  nominees: any[];
  commencementDate: any;
  flag: any;
  callMethod: any;
  bankList: any = [];
  backToSS;


  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  transactionViewData =
    {
      optionList: [
        { name: 'Deposit', value: 1 },
        { name: 'Withdrawal', value: 2 }
      ],
      transactionHeader: ['Transaction Type', 'Date', 'Amount']
    };
  @Input() popupHeaderText = 'Add Sukanya samriddhi yojana (SSY)';
  adviceShowHeaderAndFooter = true;
  DOB: any;

  selectOwner: any;

  removedList: any = [];

  getFormDataNominee(data) {
    console.log(data);
    this.nomineesList = data.controls;
  }

  setCommencementDate(date) {
    this.commencementDate = date;
    console.log(this.age(this.selectOwner[0].dateOfBirth), 'owner age', new Date(this.selectOwner[0].dateOfBirth));
    if (new Date(this.selectOwner[0].dateOfBirth).getTime() > new Date(this.ssySchemeForm.get('commDate').value).getTime()) {
      this.ssySchemeForm.get('commDate').setErrors({ before: true });
    } else if (this.age(this.selectOwner[0].dateOfBirth) > 21) {
      this.ssySchemeForm.get('commDate').setErrors({ incorrect: true });
    } else {
      this.ssySchemeForm.get('commDate').setErrors({ before: false });
      this.ssySchemeForm.get('commDate').updateValueAndValidity();
      this.ssySchemeForm.get('commDate').setErrors({ incorrect: false });
      this.ssySchemeForm.get('commDate').updateValueAndValidity();
    }
  }

  age(birthday) {
    birthday = new Date(birthday).getTime();
    // let startDate = new Date(this.ssySchemeForm.value.commDate).getTime();
    // return new Number((new Date().getTime() - birthday.getTime()) / startDate).toFixed(0);
    const dt2 = new Date(this.ssySchemeForm.value.commDate).getTime();

    let diff = (dt2 - birthday) / 1000;
    diff /= (60 * 60 * 24);
    return Math.abs(Math.round(diff / 365.25));
  }

  // ===================owner-nominee directive=====================//
  display(value) {
    console.log('value selected', value);
    this.ownerName = value.userName;
    this.familyMemberId = value.id;
  }

  lisNominee(value) {
    this.ownerData.Fmember = value;
    this.nomineesListFM = Object.assign([], value);
  }

  disabledMember(value, type) {
    this.callMethod = {
      methodName: 'disabledMember',
      ParamValue: value,
      disControl: type
    };
    setTimeout(() => {
      this.selectOwner = this.nomineesListFM.filter((m) => m.id == this.ssySchemeForm.value.getCoOwnerName[0].familyMemberId);
    }, 1000);
    if (value == 'owner') {
      this.ssySchemeForm.get('commDate').reset();
    }
  }

  displayControler(con) {
    console.log('value selected', con);
    if (con.owner != null && con.owner) {
      this.ssySchemeForm.controls.getCoOwnerName = con.owner;
    }
    if (con.nominee != null && con.nominee) {
      this.ssySchemeForm.controls.getNomineeName = con.nominee;
    }
  }

  onChangeJointOwnership(data) {
    this.callMethod = {
      methodName: 'onChangeJointOwnership',
      ParamValue: data
    };
  }

  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: [data ? data.name : '', [Validators.required]],
      share: [data ? data.share : '', [Validators.required]],
      familyMemberId: [data ? data.familyMemberId : 0],
      id: [data ? data.id : 0],
      isClient: [data ? data.isClient : 0]
    }));
    if (data) {
      setTimeout(() => {
        this.disabledMember(null, null);
      }, 1300);
    }

    if (this.getCoOwner.value.length > 1 && !data) {
      const share = 100 / this.getCoOwner.value.length;
      for (const e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == '0') {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        } else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }

  }

  removeCoOwner(item) {
    this.getCoOwner.removeAt(item);
    if (this.ssySchemeForm.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    } else {
      const share = 100 / this.getCoOwner.value.length;
      for (const e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == '0') {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        } else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }
    this.disabledMember(null, null);
  }

  removeNewNominee(item) {
    this.disabledMember(null, null);
    this.getNominee.removeAt(item);
    if (this.ssySchemeForm.value.getNomineeName.length == 1) {
      this.getNominee.controls['0'].get('sharePercentage').setValue('100');
    } else {
      const share = 100 / this.getNominee.value.length;
      for (const e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == '0') {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        } else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }
  }


  addNewNominee(data) {
    this.getNominee.push(this.fb.group({
      name: [data ? data.name : ''],
      sharePercentage: [data ? data.sharePercentage : 0],
      familyMemberId: [data ? data.familyMemberId : 0],
      id: [data ? data.id : 0],
      isClient: [data ? data.isClient : 0]
    }));
    if (!data || this.getNominee.value.length < 1) {
      for (const e in this.getNominee.controls) {
        this.getNominee.controls[e].get('sharePercentage').setValue(0);
      }
    }

    if (this.getNominee.value.length > 1 && !data) {
      const share = 100 / this.getNominee.value.length;
      for (const e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == '0') {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        } else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }


  }

  /***nominee***/
  // ===================owner-nominee directive=====================//
  getdataForm(data) {
    if (data == undefined) {
      data = {};
      this.flag = 'addSSY';
    } else {
      (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : this.editApi = data;
      this.flag = 'editSSY';
    }
    this.ssyData = data;
    this.ssySchemeForm = this.fb.group({
      // ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: [0, [Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient: 0
      })]),
      ssyNo: [data.ssyNo],
      guardian: [data.guardianName ? data.guardianName : '', [Validators.required]],
      accBalance: [data.accountBalance, []],
      balanceAsOn: [new Date(data.balanceAsOn)],
      commDate: [new Date(data.commencementDate), [Validators.required]],
      futureAppx: [data.futureApproxContribution, [Validators.required]],
      frquency: [data.frequency ? data.frequency : '', [Validators.required]],
      description: [data.description],
      linkedAcc: [data.userBankMappingId],
      // bankName: [data.bankName],
      nominees: this.nominees,
      agentName: [data.agentName],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0]
      })])
    });
    // ==============owner-nominee Data ========================\\
    /***owner***/
    if (this.ssySchemeForm.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    }

    if (data.ownerList && data.ownerList.length > 0) {
      this.getCoOwner.removeAt(0);
      data.ownerList.forEach(element => {
        this.addNewCoOwner(element);
      });
    }

    /***owner***/

    /***nominee***/
    if (data.nomineeList) {
      if (data.nomineeList.length > 0) {

        this.getNominee.removeAt(0);
        data.nomineeList.forEach(element => {
          this.addNewNominee(element);
        });
      }
    }
    /***nominee***/

    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.ssySchemeForm };
    // ==============owner-nominee Data ========================\\
    this.DOB = data.dateOfBirth;
    // this.ownerData = this.ssySchemeForm.controls;
    // this.familyMemberId = data.familyMemberId;
  }

  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    this.bankList = this.enumService.getBank();
    this.getdataForm(null);

  }

  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true;
  }

  getFormData(data) {
    console.log(data);
    if (data.removed) {
      this.transactionData = data.data.controls;
      this.removedList = data.removed;
    } else {
      this.commencementDate = this.ssySchemeForm.controls.commDate.value;
      this.transactionData = data.controls;
    }
  }

  addSSYScheme() {
    let transactionFlag, finalTransctList = [];

    this.removedList.forEach(Fg => {
      if (Fg.value) {
        const obj = {
          id: Fg.value.id,
          transactionDate: Fg.value.date,
          amount: Fg.value.amount,
          transactionType: Fg.value.type,
          isActive: Fg.value.isActive
        };
        finalTransctList.push(obj);
      }
    });

    if (this.transactionData.length > 0) {
      this.ssySchemeForm.get('accBalance').setValidators('');
      this.ssySchemeForm.get('accBalance').updateValueAndValidity();
      this.ssySchemeForm.get('balanceAsOn').setValidators(''),
        this.ssySchemeForm.get('balanceAsOn').updateValueAndValidity();
      this.transactionData.forEach(element => {
        if (element.valid) {
          const obj = {
            id: element.value.id,
            transactionDate: element.controls.date.value._d ? element.controls.date.value._d : element.controls.date.value,
            amount: element.controls.amount.value,
            transactionType: element.controls.type.value,
            isActive: element.value.isActive == 0 ? element.value.isActive : 1
          };
          finalTransctList.push(obj);
        } else {
          transactionFlag = false;
        }
      });
    } else {
      this.ssySchemeForm.get('accBalance').setValidators([Validators.required]);
      this.ssySchemeForm.get('accBalance').updateValueAndValidity();
      this.ssySchemeForm.get('balanceAsOn').setValidators([Validators.required]);
      // this.ssySchemeForm.get('balanceAsOn').updateValueAndValidity();
    }

    // this.nominees = []
    // if (this.nomineesList) {

    //   this.nomineesList.forEach(element => {
    //     let obj = {
    //       "name": element.controls.name.value,
    //       "sharePercentage": element.controls.sharePercentage.value,
    //       "id": element.id,
    //       "familyMemberId": element.familyMemberId
    //     }
    //     this.nominees.push(obj)
    //   });
    // }
    if (this.ssySchemeForm.invalid) {
      this.ssySchemeForm.markAllAsTouched();
    } else if (transactionFlag == false) {
      return;
    } else {
      this.barButtonOptions.active = true;
      const obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        id: this.editApi ? this.editApi.id : 0,
        familyMemberId: this.familyMemberId,
        ssyNo: this.ssySchemeForm.value.ssyNo,
        // "ownerName": (this.ownerName == null) ? this.ssySchemeForm.controls.ownerName.value : this.ownerName.userName,
        ownerList: this.ssySchemeForm.value.getCoOwnerName,
        accountBalance: parseInt(this.ssySchemeForm.get('accBalance').value),
        balanceAsOn: this.dateFormatPipe.transform(this.ssySchemeForm.get('balanceAsOn').value, 'dd/MM/yyyy'),
        commencementDate: this.dateFormatPipe.transform(this.ssySchemeForm.get('commDate').value, 'dd/MM/yyyy'),
        description: this.ssySchemeForm.get('description').value,
        // "bankName": this.ssySchemeForm.get('bankName').value,
        linkedBankAccount: this.ssySchemeForm.get('linkedAcc').value,
        userBankMappingId: this.ssySchemeForm.get('linkedAcc').value,
        agentName: this.ssySchemeForm.get('agentName').value,
        guardianName: this.ssySchemeForm.get('guardian').value,
        nominees: this.nominees,
        futureApproxContribution: parseInt(this.ssySchemeForm.get('futureAppx').value),
        frequency: parseInt(this.ssySchemeForm.get('frquency').value),
        transactionList: finalTransctList,
        nomineeList: this.ssySchemeForm.value.getNomineeName,
        familyMemberDob: this.dateFormatPipe.transform(this.selectOwner[0].dateOfBirth, 'dd/MM/yyyy'),
        parentId: 0,
        realOrFictitious: 1
      };

      const adviceObj = {
        // advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: 'manualAssetDescription'
      };

      obj.nomineeList.forEach((element, index) => {
        if (element.name == '') {
          this.removeNewNominee(index);
        }
      });
      obj.nomineeList = this.ssySchemeForm.value.getNomineeName;
      if (this.flag == 'editSSY') {
        this.cusService.editSSYData(obj).subscribe(
          data => this.addSSYSchemeResponse(data),
          error => {
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error);
          }
        );
      } else if (this.flag == 'addSSY') {
        this.cusService.addSSYScheme(obj).subscribe(
          data => this.addSSYSchemeResponse(data),
          error => {
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error);
          }
        );
      } else {
        this.cusService.getAdviceSsy(adviceObj).subscribe(
          data => this.getAdviceSsyRes(data),
          err => {
            this.barButtonOptions.active = false;
            this.eventService.openSnackBar(err, 'Dismiss');
          }
        );
      }
      // let obj =
      // {
      //   "clientId": this.clientId,
      //   "advisorId": this.advisorId,
      //   "familyMemberId": this.familyMemberId,
      //   "ownerName": (this.ownerName == null) ? this.ssySchemeForm.controls.ownerName.value : this.ownerName.userName,
      //   "accountBalance": this.ssySchemeForm.get('accBalance').value,
      //   "balanceAsOn": this.ssySchemeForm.get('balanceAsOn').value,
      //   "commencementDate": this.ssySchemeForm.get('commDate').value,
      //   "description": this.ssySchemeForm.get('description').value,
      //   "bankName": this.ssySchemeForm.get('bankName').value,
      //   "linkedBankAccount": this.ssySchemeForm.get('linkedAcc').value,
      //   "agentName": this.ssySchemeForm.get('agentName').value,
      //   "guardianName": this.ssySchemeForm.get('guardian').value,
      //   "nominees": this.nominees,
      //   "ssyFutureContributionList": [{
      //     "futureApproxContribution": this.ssySchemeForm.get('futureAppx').value,
      //     "frequency": this.ssySchemeForm.get('futureAppx').value,
      //   }],
      //   "ssyTransactionList": finalTransctList,
      //   'familyMemberDob': this.dateFormatPipe.transform(this.ownerName.dateOfBirth, 'dd/MM/yyyy')
      // }


    }
  }

  getAdviceSsyRes(data) {
    this.barButtonOptions.active = false;
    console.log(data);
    this.eventService.openSnackBar('SSY is added', 'Dismiss');
    this.close(true);

  }

  addSSYSchemeResponse(data) {
    this.barButtonOptions.active = false;
    (this.editApi) ? this.eventService.openSnackBar('Updated successfully!', 'Dismiss') : this.eventService.openSnackBar('Added successfully!', 'added');
    console.log(data);
    this.close(true);
  }

  close(flag) {
    this.isOptionalField = true;
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }


  isFormValuesForAdviceValid() {
    if (this.ssySchemeForm.valid ||
      (this.ssySchemeForm.valid && this.ssySchemeForm.valid) ||
      (this.ssySchemeForm.valid && this.ssySchemeForm.valid && this.nomineesList.length !== 0 && this.transactionData.length !== 0)) {
      return true;
    } else {
      return false;
    }
  }


  getBank() {
    if (this.enumService.getBank().length > 0) {
      this.bankList = this.enumService.getBank();
    }
    else {
      this.bankList = [];
    }
    console.log(this.bankList, "this.bankList2");
  }
  // link bank
  openDialog(eventData): void {
    const dialogRef = this.dialog.open(LinkBankComponent, {
      width: '50%',
      data: { bankList: this.bankList, userInfo: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        this.bankList = this.enumService.getBank();
      }, 5000);
    });

  }

  // link bank
}