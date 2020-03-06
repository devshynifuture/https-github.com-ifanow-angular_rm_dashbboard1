import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS, MatSort, MatInput } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
@Component({
  selector: 'app-add-epf',
  templateUrl: './add-epf.component.html',
  styleUrls: ['./add-epf.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class AddEPFComponent implements OnInit {
  validatorType = ValidatorType
  maxDate = new Date();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isBalanceAsOn = false;
  isAnnualSalGrowth = false;
  isCurrentEPFBal = false;
  isEmployerContry = false;
  isEmployeeContry = false;
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  showHide = false;
  epf: any;
  ownerData: any;
  advisorId: any;
  clientId: any;
  isOwnerName = false;
  nomineesListFM: any;
  dataFM = [];
  familyList: any;
  flag: any;
  adviceShowHeaderAndFooter: boolean = true;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  constructor(private event: EventService, private router: Router, private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }

  @Input() popupHeaderText: string = 'Add Employees providend fund (EPF)';

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
    this.isOwnerName = false
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }
  nomineesList() {
    this.dataFM = this.nomineesListFM
    if (this.dataFM.length > 0) {
      let name = this.ownerName
      // var evens = _.reject(this.dataFM, function (n) {
      //   return n.userName == name;
      // });
      let evens = this.dataFM.filter(delData => delData.userName != name)
      this.familyList = evens
    }

    console.log('familyList', this.familyList)
  }

  // getOwnerName(value) {
  //   console.log('selected', value);
  //   value.familyList = this.family;
  //   this.valueChange.emit(value);
  // }
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
  onChange(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
      this.epf.get('annualSalGrowth').setValue(event.target.value);
    }
  }
  getdataForm(data) {
    this.flag = data;
    (!data) ? data = {} : (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : '';
    this.epf = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      employeeContry: [(data == undefined) ? '' : data.employeesMonthlyContribution, [Validators.required]],
      employerContry: [(data == undefined) ? '' : data.employersMonthlyContribution, [Validators.required]],
      annualSalGrowth: [(data == undefined) ? '' : data.annualSalaryGrowthRate, [Validators.required]],
      currentEPFBal: [(data == undefined) ? '' : data.currentEpfBalance, [Validators.required]],
      maturityYear: [(data == undefined) ? '' : (data.maturityYear),],
      balanceAsOn: [(data == undefined) ? '' : new Date(data.balanceAsOnDate), [Validators.required]],
      EPFNo: [(data == undefined) ? '' : (data.epfNo),],
      bankAcNo: [(data == undefined) ? '' : data.bankAccountNumber,],
      description: [(data == undefined) ? '' : data.description,],
      id: [(data == undefined) ? '' : data.id,],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId],]
    });
    this.ownerData = this.epf.controls;
    this.familyMemberId = this.epf.controls.familyMemberId.value
    this.familyMemberId = this.familyMemberId[0]
  }
  getFormControl(): any {
    return this.epf.controls;
  }
  saveEPF() {
    this.inputs.find(input => !input.ngControl.valid).focus();
    if (this.epf.get('ownerName').invalid) {
      this.epf.get('ownerName').markAsTouched();
      return;
    } else if (this.epf.get('employeeContry').invalid) {
      this.epf.get('employeeContry').markAsTouched();
      return;
    }
    else if (this.epf.get('employerContry').invalid) {
      this.epf.get('employerContry').markAsTouched();
      return;
    } else if (this.epf.get('currentEPFBal').invalid) {
      this.epf.get('currentEPFBal').markAsTouched();
      return;
    } else if (this.epf.get('balanceAsOn').invalid) {
      this.epf.get('balanceAsOn').markAsTouched();
      return;
    } else if (this.epf.get('annualSalGrowth').invalid) {
      this.epf.get('annualSalGrowth').markAsTouched();
      return;
    } else {

      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        ownerName: (this.ownerName == undefined) ? this.epf.controls.ownerName.value : this.ownerName,
        employeesMonthlyContribution: this.epf.controls.employeeContry.value,
        employersMonthlyContribution: this.epf.controls.employerContry.value,
        annualSalaryGrowthRate: this.epf.controls.annualSalGrowth.value,
        currentEpfBalance: this.epf.controls.currentEPFBal.value,
        maturityYear: this.epf.controls.maturityYear.value,
        balanceAsOnDate: this.datePipe.transform(this.epf.controls.balanceAsOn.value, 'yyyy-MM-dd'),
        epfNo: this.epf.controls.EPFNo.value,
        bankAccountNumber: this.epf.controls.bankAcNo.value,
        description: this.epf.controls.description.value,
        id: this.epf.controls.id.value
      }
      let adviceObj = {
        advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.epf.controls.id.value == undefined && this.flag != 'adviceEPF') {
        this.custumService.addEPF(obj).subscribe(
          data => this.addEPFRes(data)
        );
      } else if (this.flag == 'adviceEPF') {
        this.custumService.getAdviceEpf(adviceObj).subscribe(
          data => this.getAdviceEpfRes(data),
        );
      } else {
        //edit call
        this.custumService.editEPF(obj).subscribe(
          data => this.editEPFRes(data)
        );
      }
    }
  }
  getAdviceEpfRes(data) {
    this.event.openSnackBar('EPF added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'added', state: 'close', data, refreshRequired: true })

  }
  addEPFRes(data) {
    console.log('addrecuringDepositRes', data)
    this.event.openSnackBar('Added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'added', state: 'close', data, refreshRequired: true })
  }
  editEPFRes(data) {
    this.event.openSnackBar('Updated successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'added', state: 'close', data, refreshRequired: true })
  }
}