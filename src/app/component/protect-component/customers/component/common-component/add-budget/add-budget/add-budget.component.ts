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
  familyMemberId: any;

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject,private planService:PlanService,private constantService : ConstantsService) { }

  ngOnInit() {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
    this.getdataForm(this.inputData)
    this.getdataFormRec(this.inputData)
    this.getListFamilyMem()
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
  getListFamilyMem() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.planService.getListOfFamilyByClient(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }

  getListOfFamilyByClientRes(data) {
    console.log('family Memebers', data);
    this.familyMember = data.familyMembersList;
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
      startsFrom:[(data == undefined) ? '' : new Date(data.startsFrom), [Validators.required]],
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
  selectClient(f,data){

  }
  getdataForm(data) {
    if (data == undefined) {
      data = {}
    }
    this.budget = this.fb.group({
      timeInMilliSec: [(data == undefined) ? '' : data.timeInMilliSec, [Validators.required]],
      expenseDoneOn: [(data == undefined) ? '' : new Date(data.expenseDoneOn), [Validators.required]],
      amount: [(data == undefined) ? '' : data.amount, [Validators.required]],
      category: [(data == undefined) ? '' : (data.category) + "", [Validators.required]],
      familyMember: [(data == undefined) ? '' :  this.familyMember, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      isRecuring:[(data == undefined) ? '' : data.isRecuring, [Validators.required]],
      startDate:[(data == undefined) ? '' : data.startDate, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      paymentModeId: [(data == undefined) ? '' : data.paymentModeId, [Validators.required]],
    });
  }
  getFormControl(): any {
    return this.budget.controls;
  }
  close(){
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  saveRecuringExpense(){
    if (this.recuring.get('expenseDoneOn').invalid) {
      this.recuring.get('expenseDoneOn').markAsTouched();
      return
    } else if (this.recuring.get('repeatFrequency').invalid) {
      this.recuring.get('repeatFrequency').markAsTouched();
      return
    } else if (this.recuring.get('amount').invalid) {
      this.recuring.get('amount').markAsTouched();
      return
    }else if (this.recuring.get('category').invalid) {
      this.recuring.get('category').markAsTouched();
      return
    } else if (this.recuring.get('startFrom').invalid) {
      this.recuring.get('startFrom').markAsTouched();
      return
    } else if (this.recuring.get('paymentModeId').invalid) {
      this.recuring.get('paymentModeId').markAsTouched();
      return
    } else if (this.recuring.get('continueTill').invalid) {
      this.recuring.get('continueTill').markAsTouched();
      return
    } else if (this.recuring.get('familyMember').invalid) {
      this.recuring.get('familyMember').markAsTouched();
      return
    }  else {
        let obj = {
          advisorId: this.advisorId,
          clientId: this.clientId,
          familyMemberId: this.familyMemberId,
          expenseDoneOn: this.recuring.controls.expenseDoneOn.value,
          amount: this.recuring.controls.amount.value,
          timeInMilliSec: this.recuring.controls.timeInMilliSec.value,
          paymentModeId:this.recuring.controls.paymentModeId.value,
          expenseCategoryId: this.recuring.controls.category.value,
          description: this.recuring.controls.description.value,
          isRecuring:this.recuring.controls.isRecuring.value,
          
        }
        if (this.recuring.controls.id.value == undefined) {
          this.planService.otherCommitmentsAdd(obj).subscribe(
            data => this.otherCommitmentsAddRes(data)
          );
        } else {
          obj['id']=this.recuring.controls.id.value;
          //edit call
          this.planService.editRecuringExpense(obj).subscribe(
            data => this.editRecuringExpenseRes(data)
          );
        }
      }
  }
  otherCommitmentsAddRes(data){
    console.log(data)
  }
  editRecuringExpenseRes(data){
    console.log(data)
  }
  saveExpenses(){
    if (this.budget.get('expenseDoneOn').invalid) {
      this.budget.get('expenseDoneOn').markAsTouched();
      return
    } else if (this.budget.get('timeInMilliSec').invalid) {
      this.budget.get('timeInMilliSec').markAsTouched();
      return
    } else if (this.budget.get('amount').invalid) {
      this.budget.get('amount').markAsTouched();
      return
    } else if (this.budget.get('category').invalid) {
      this.budget.get('category').markAsTouched();
      return
    } else if (this.budget.get('paymentModeId').invalid) {
      this.budget.get('paymentModeId').markAsTouched();
      return
    } else if (this.budget.get('familyMember').invalid) {
      this.budget.get('familyMember').markAsTouched();
      return
    } else if (this.budget.get('isRecuring').invalid) {
      this.budget.get('isRecuring').markAsTouched();
      return
    } else {
        let obj = {
          advisorId: this.advisorId,
          clientId: this.clientId,
          familyMemberId: this.familyMemberId,
          expenseDoneOn: this.budget.controls.expenseDoneOn.value,
          amount: this.budget.controls.amount.value,
          timeInMilliSec: this.budget.controls.timeInMilliSec.value,
          paymentModeId:this.budget.controls.paymentModeId.value,
          expenseCategoryId: this.budget.controls.category.value,
          description: this.budget.controls.description.value,
          id: this.budget.controls.id.value
        }
        if (this.budget.controls.id.value == undefined) {
          this.planService.addBudget(obj).subscribe(
            data => this.addBudgetRes(data)
          );
        } else {
          //edit call
          this.planService.editBudget(obj).subscribe(
            data => this.editBudgetRes(data)
          );
        }
      }
  }
  addBudgetRes(data){
    console.log(data)
  }
  editBudgetRes(data){
    console.log(data)
  }
}
