import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS, MatSort } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
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

  constructor(private event: EventService, private router: Router, private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  showLess(value) {
    if (value == true) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }
  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close',refreshRequired:flag})
  }
  onChange(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
      this.epf.get('annualSalGrowth').setValue(event.target.value);
    }
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {}
    }
    this.epf = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      employeeContry: [(data == undefined) ? '' : data.employeesMonthlyContribution, [Validators.required]],
      employerContry: [(data == undefined) ? '' : data.employersMonthlyContribution, [Validators.required]],
      annualSalGrowth: [(data == undefined) ? '' : data.annualSalaryGrowth, [Validators.required]],
      currentEPFBal: [(data == undefined) ? '' : data.currentEpfBalance, [Validators.required]],
      maturityYear: [(data == undefined) ? '' : (data.maturityYear), [Validators.required]],
      balanceAsOn: [(data == undefined) ? '' : new Date(data.balanceAsOnDate), [Validators.required]],
      EPFNo: [(data == undefined) ? '' : (data.epfNo), [Validators.required]],
      bankAcNo: [(data == undefined) ? '' : data.bankAccountNumber, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]]
    });
    this.ownerData = this.epf.controls;
    this.familyMemberId = this.epf.controls.familyMemberId.value
    this.familyMemberId = this.familyMemberId[0]
  }
  getFormControl(): any {
    return this.epf.controls;
  }
  saveEPF() {

    if (this.epf.get('employeeContry').invalid) {
      this.epf.get('employeeContry').markAsTouched();
      return;
    } else if (this.epf.get('ownerName').invalid) {
      this.epf.get('ownerName').markAsTouched();
      return
    }else if (this.epf.get('employerContry').invalid) {
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
        description: this.epf.controls.maturityYear.value,
        id: this.epf.controls.id.value
      }
      if (this.epf.controls.id.value == undefined) {
        this.custumService.addEPF(obj).subscribe(
          data => this.addEPFRes(data)
        );
      } else {
        //edit call
        this.custumService.editEPF(obj).subscribe(
          data => this.editEPFRes(data)
        );
      }
    }
  }
  addEPFRes(data) {
    console.log('addrecuringDepositRes', data)
    this.event.openSnackBar('Added successfully!', 'dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'added', state: 'close', data ,refreshRequired:true})
  }
  editEPFRes(data) {
    this.event.openSnackBar('Updated successfully!', 'dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'added', state: 'close', data ,refreshRequired:true})
  }
}