import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';

@Component({
  selector: 'app-add-superannuation',
  templateUrl: './add-superannuation.component.html',
  styleUrls: ['./add-superannuation.component.scss'],
  providers: [
    [DatePipe],
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2},
  ],
})
export class AddSuperannuationComponent implements OnInit {
  showHide = false;
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  superannuation: any;
  ownerData: any;

  constructor(private router: Router,private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe) { }

  @Input()
  set data(data) {
    this.inputData = data;
   this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }
  display(value){
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  showLess(value){
    if(value  == true){
      this.showHide = false;
    }else{
      this.showHide = true;
    }
  }
  // getDateYMD(){
  //   let now = moment();
  //   this.tenure =moment(this.recuringDeposit.controls.commencementDate.value).add(this.recuringDeposit.controls.tenure.value, 'months');
  //   this.getDate = this.datePipe.transform(this.tenure , 'yyyy-MM-dd')
  //   return this.getDate;
  // }
  getdataForm(data) {
    if(data == undefined){
      data = {}
    }
    this.superannuation = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      employeeContry: [(data == undefined) ? '' : data.employeesMonthlyContribution, [Validators.required]],
      employerContry: [(data == undefined) ? '' : data.employersMonthlyContribution, [Validators.required]],
      growthEmployer: [(data == undefined) ? '' : data.growthEmployer, [Validators.required]],
      growthEmployee:[(data == undefined) ? '' : data.growthEmployee, [Validators.required]],
      firstDateContry: [(data == undefined)?'':(data.interestCompoundingId)+"", [Validators.required]],
      linkBankAc: [(data == undefined) ? '' : data.linkBankAccount, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      familyMemberId:[[(data == undefined) ? '' : data.familyMemberId], [Validators.required]]
    });
    this.ownerData = this.superannuation.controls;
    this.familyMemberId = this.superannuation.controls.familyMemberId.value
    this.familyMemberId =  this.familyMemberId[0]
    this.superannuation.controls.maturityDate.setValue(new Date(data.maturityDate));
  }
  getFormControl(): any {
    return this.superannuation.controls;
  }
}
