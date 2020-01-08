import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-superannuation',
  templateUrl: './add-superannuation.component.html',
  styleUrls: ['./add-superannuation.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class AddSuperannuationComponent implements OnInit {
  showHide = false;
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  superannuation: any;
  ownerData: any;
  advisorId: any;
  isEmployeeContry = false
  isEmployerContry = false
  isGrowthEmployer = false
  isGrowthEmployee = false
  isAssumedRateReturn = false
  isFirstDateContry = false
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
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' })
  }
  showLess(value) {
    if (value == true) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }
  onChange(event, value) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
      this.superannuation.get(value).setValue(event.target.value);
    }
  }
  // getDateYMD(){
  //   let now = moment();
  //   this.tenure =moment(this.recuringDeposit.controls.commencementDate.value).add(this.recuringDeposit.controls.tenure.value, 'months');
  //   this.getDate = this.datePipe.transform(this.tenure , 'yyyy-MM-dd')
  //   return this.getDate;
  // }
  getdataForm(data) {
    if (data == undefined) {
      data = {}
    }
    this.superannuation = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      employeeContry: [(data == undefined) ? '' : data.annualEmployeeContribution, [Validators.required]],
      employerContry: [(data == undefined) ? '' : data.annualEmployerContribution, [Validators.required]],
      growthEmployer: [(data == undefined) ? '' : data.growthRateEmployerContribution, [Validators.required]],
      growthEmployee: [(data == undefined) ? '' : data.growthRateEmployeeContribution, [Validators.required]],
      firstDateContry: [(data == undefined) ? '' : new Date(data.firstContributionDate), [Validators.required]],
      assumedRateReturn: [(data == undefined) ? '' : (data.assumedRateOfReturn), [Validators.required]],
      linkBankAc: [(data == undefined) ? '' : data.bankAccountNumber, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]]
    });
    this.ownerData = this.superannuation.controls;
    this.familyMemberId = this.superannuation.controls.familyMemberId.value
    this.familyMemberId = this.familyMemberId[0]
    // this.superannuation.controls.maturityDate.setValue(new Date(data.maturityDate));
  }
  getFormControl(): any {
    return this.superannuation.controls;
  }
  saveSuperannuation() {
    if (this.superannuation.get('employeeContry').invalid) {
      this.superannuation.get('employeeContry').markAsTouched();
      return;
    } else if (this.superannuation.get('employerContry').invalid) {
      this.superannuation.get('employerContry').markAsTouched();
      return;
    } else if (this.superannuation.get('assumedRateReturn').invalid) {
      this.superannuation.get('assumedRateReturn').markAsTouched();
      return;
    } else if (this.superannuation.get('growthEmployer').invalid) {
      this.superannuation.get('growthEmployer').markAsTouched();
      return;
    } else if (this.superannuation.get('growthEmployee').invalid) {
      this.superannuation.get('growthEmployee').markAsTouched();
      return;
    } else if (this.superannuation.get('firstDateContry').invalid) {
      this.superannuation.get('firstDateContry').markAsTouched();
      return;
    } else {

      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        ownerName: (this.ownerName == undefined) ? this.superannuation.controls.ownerName.value : this.ownerName,
        annualEmployeeContribution: this.superannuation.controls.employeeContry.value,
        annualEmployerContribution: this.superannuation.controls.employerContry.value,
        growthRateEmployeeContribution: this.superannuation.controls.growthEmployee.value,
        growthRateEmployerContribution: this.superannuation.controls.growthEmployer.value,
        firstContributionDate: this.datePipe.transform(this.superannuation.controls.firstDateContry.value, 'yyyy-MM-dd'),
        assumedRateOfReturn: this.superannuation.controls.assumedRateReturn.value,
        bankAccountNumber: this.superannuation.controls.linkBankAc.value,
        description: this.superannuation.controls.description.value,
        id: this.superannuation.controls.id.value
      }
      if (this.superannuation.controls.id.value == undefined) {
        this.custumService.addSuperannuation(obj).subscribe(
          data => this.addSuperannuationRes(data)
        );
      } else {
        //edit call
        this.custumService.editSuperannuation(obj).subscribe(
          data => this.editSuperannuationRes(data)
        );
      }
    }
  }
  addSuperannuationRes(data) {
    console.log('addrecuringDepositRes', data)
    this.event.openSnackBar('Added successfully!', 'dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'addedSuperannuation', state: 'close', data })
  }
  editSuperannuationRes(data) {
    this.event.openSnackBar('Updated successfully!', 'dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'addedSuperannuation', state: 'close', data })
  }
}
