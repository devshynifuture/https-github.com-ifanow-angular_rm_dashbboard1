import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { PlanService } from '../../../customer/plan/plan.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ConstantsService } from 'src/app/constants/constants.service';

@Component({
  selector: 'app-add-budget',
  templateUrl: './add-budget.component.html',
  styleUrls: ['./add-budget.component.scss']
})
export class AddBudgetComponent implements OnInit {
  budget: any;
  familyMember: any;
  clientId: any;
  advisorId: any;
  expenseList: { "clientExpenseTypeMasterId": number; "expenseType": string; "label": string; }[];
  isRecuring = false;
  isNoOfYrs: any;
  recuring: any;
  isViewInitCalled: any;
  inputData: any;

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject,private planService:PlanService,private constantService : ConstantsService) { }

  ngOnInit() {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
    this.getdataForm(this.inputData)
    this.getdataFormRec(this.inputData)
  }
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of FixedDepositComponent ', data);

    if (this.isViewInitCalled) {
      this.getdataForm(data);
    }
  }

  get data() {
    return this.inputData;
  }
  preventDefault(e){
    e.preventDefault();
  }
  toggle(value){
    this.isRecuring = value.checked;
  }
  continuesTill(value){
    this.isNoOfYrs = value;
  }
  getdataFormRec(data) {
    if (data == undefined) {
      data = {};
    }
    this.recuring = this.fb.group({
      timeInMilliSec: [(data == undefined) ? '' : data.timeInMilliSec, [Validators.required]],
      expenseDoneOn: [(data == undefined) ? '' : new Date(data.expenseDoneOn), [Validators.required]],
      amount: [(data == undefined) ? '' : data.amount, [Validators.required]],
      repeatFrequency:[(data == undefined) ? '' : data.repeatFrequency, [Validators.required]],
      every:[(data == undefined) ? '' : data.every, [Validators.required]],
      startsFrom:[(data == undefined) ? '' : new Date(data.startsFrom), [Validators.required]],
      whatDay:[(data == undefined) ? '' : data.whatDay, [Validators.required]],
      continuesDate:[(data == undefined) ? '' :  new Date(data.continuesDate), [Validators.required]],
      continueTill:[(data == undefined) ? '' :(data.continueTill), [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      category:[(data == undefined) ? '' : data.expenseCategoryId, [Validators.required]],
      familyMember: [(data == undefined) ? '' : data.familyMember, [Validators.required]],
      paymentModeId: [[(data == undefined) ? '' : data.paymentModeId], [Validators.required]],
      isRecuring: [(data == undefined) ? '' : data.isRecuring, [Validators.required]],
    });
    this.expenseList = this.constantService.expenseList
  }
  getFormControlRec(): any {
    return this.recuring.controls;
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {}
    }
    this.budget = this.fb.group({
      time: [(data == undefined) ? '' : data.time, [Validators.required]],
      date: [(data == undefined) ? '' : new Date(data.date), [Validators.required]],
      amount: [(data == undefined) ? '' : data.amount, [Validators.required]],
      category: [(data == undefined) ? '' : (data.category) + "", [Validators.required]],
      familyMember: [(data == undefined) ? '' :  this.familyMember, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      isRecuring:[(data == undefined) ? '' : data.isRecuring, [Validators.required]],
      startDate:[(data == undefined) ? '' : data.startDate, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      paymentMode: [[(data == undefined) ? '' : data.paymentMode], [Validators.required]]
    });
  }
  getFormControl(): any {
    return this.budget.controls;
  }
  close(){
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
