import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { PlanService } from '../../customer/plan/plan.service';
import { ConstantsService } from "../../../../../../constants/constants.service";
import { EventService } from 'src/app/Data-service/event.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';

@Component({
  selector: 'app-add-expenses',
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.scss']
})
export class AddExpensesComponent implements OnInit {
  // expenseList: { "clientExpenseTypeMasterId": number; "expenseType": string; "label": string; }[];
  expenses: any;
  clientId: any;
  advisorId: any;
  familyMember: any;
  familyMemberId: any;
  ownerName: any;
    nomineesListFM: any = [];
  inputData: any;
  isViewInitCalled: any;
  expenseList: {};
  category: any;
  isRecuring = false;
  recuring: any;
  isNoOfYrs: any;
  getFlag: any;
  trnFlag: string;
  budgetFlag: string;

  constructor(private peopleService:PeopleService,private event: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject,
    private planService: PlanService, private constantService: ConstantsService) {
  }
  @Input()
  set data(data) {
    this.inputData = data;

    if (this.isViewInitCalled) {
      if (data.isRecuring == true) {
        this.getdataFormRec(data)
        this.isRecuring = true
      } else {
        this.getdataForm(data);
        this.isRecuring = false
      }
    }
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
    this.getListFamilyMem();
    this.getdataForm(this.inputData);
    this.getdataFormRec(this.inputData)
    this.trnFlag='Transaction';
    this.budgetFlag='Budget';
  }

  display(value) {
    this.ownerName = value.userName;
    this.familyMemberId = value.familyMemberId
  }

  lisNominee(value) {
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }

  preventDefault(e) {
    e.preventDefault();
  }

  getdataForm(data) {
    this.getFlag = data.flag

    if (data == undefined) {
      data = {};
    } if (this.getFlag == 'editBudget' || this.getFlag == 'editExpense') {
      this.isRecuring = data.isRecuring
    }
    this.expenses = this.fb.group({
      timeInMilliSec: [(data == undefined) ? '' : (data.timeInMilliSec == undefined) ? data.time : data.timeInMilliSec, [Validators.required]],
      expenseDoneOn: [(data == undefined) ? '' : new Date((data.expenseDoneOn == undefined) ? data.startsFrom : data.expenseDoneOn), [Validators.required]],
      amount: [(data == undefined) ? '' : data.amount, [Validators.required]],
      description: [(data == undefined) ? '' : data.description],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      category: [(data == undefined) ? null : (data.expenseCategoryId == undefined) ? data.budgetCategoryId : data.expenseCategoryId, [Validators.required]],
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      paymentModeId: [(data.paymentModeId == undefined) ? '' : data.paymentModeId + '', [Validators.required]],
      familyMemberId : [(data == undefined) ? '' : data.familyMemberId + '', [Validators.required]],
      isRecuring: false
    });
    this.expenseList = this.constantService.expenseList;
    this.familyMemberId = this.expenses.controls.familyMemberId.value
  }
  getdataFormRec(data) {
    this.getFlag = data.flag

    if (data == undefined) {
      data = {};
    } if (this.getFlag == 'editExpense' || this.getFlag == 'editBudget') {
      this.isRecuring = data.isRecuring
    }
    this.recuring = this.fb.group({
      timeInMilliSec: [(data == undefined) ? '' : (data.timeInMilliSec == undefined) ? data.time : data.timeInMilliSec, [Validators.required]],
      amount: [(data == undefined) ? '' : data.amount, [Validators.required]],
      repeatFrequency: [(data == undefined) ? null : data.repeatFrequency , [Validators.required]],
      startsFrom: [(data == undefined) ? '' : new Date((data.expenseDoneOn == undefined) ? data.startsFrom : data.expenseDoneOn), [Validators.required]],
      numberOfYearOrNumberOfTime: [(data == undefined) ? '' : (data.numberOfYearOrNumberOfTime), [Validators.required]],
      continueTill: [(data == undefined) ? '' : (data.continueTill), [Validators.required]],
      description: [(data == undefined) ? '' : data.description],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      category: [(data == undefined) ? '' : (data.expenseCategoryId == undefined) ? data.budgetCategoryId : data.expenseCategoryId, [Validators.required]],
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      paymentModeId: [(data.paymentModeId == undefined) ? '' : data.paymentModeId + '', [Validators.required]],
      familyMemberId : [(data == undefined) ? '' : data.familyMemberId + '', [Validators.required]],
      isRecuring: true,
    });
    this.expenseList = this.constantService.expenseList
    this.familyMemberId = this.expenses.controls.familyMemberId.value
  }

  getFormControl(): any {
    return this.expenses.controls;
  }
  getFormControlRec(): any {
    return this.recuring.controls;
  }
  getListFamilyMem() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };

    // this.planService.getListOfFamilyByClient(obj).subscribe(
      this.peopleService.getClientFamilyMemberListAsset(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }

  getListOfFamilyByClientRes(data) {
    this.familyMember = data;
  }

  selectClient(event, selected) {
    this.familyMemberId = selected.id
  }
  toggle(value) {
    this.isRecuring = value.checked;
    if(value.checked == true && (this.getFlag == 'addExpenses' || this.getFlag == 'editExpenses')){
      this.trnFlag = 'Recurring transaction';
    }else if(value.checked == true && (this.getFlag == 'addBudget' || this.getFlag == 'editBudget')){
      this.budgetFlag = 'Recurring Budget'
    }else if(value.checked == false && (this.getFlag == 'addExpenses' || this.getFlag == 'editExpenses')){
      this.trnFlag = 'Transaction';
    }else{
      this.budgetFlag = 'Budget'

    }
    
  }
  continuesTill(value) {
    this.isNoOfYrs = value;
  }
  saveRecuringExpense() {
    // if (this.recuring.get('repeatFrequency').invalid) {
    //   this.recuring.get('repeatFrequency').markAsTouched();
    //   return
    // } else if (this.recuring.get('amount').invalid) {
    //   this.recuring.get('amount').markAsTouched();
    //   return
    // } else if (this.recuring.get('category').invalid) {
    //   this.recuring.get('category').markAsTouched();
    //   return
    // } else if (this.recuring.get('startsFrom').invalid) {
    //   this.recuring.get('startsFrom').markAsTouched();
    //   return
    // } else if (this.recuring.get('paymentModeId').invalid) {
    //   this.recuring.get('paymentModeId').markAsTouched();
    //   return
    // } else if (this.recuring.get('continueTill').invalid) {
    //   this.recuring.get('continueTill').markAsTouched();
    //   return
    // } else if (this.recuring.get('ownerName').invalid) {
    //   this.recuring.get('ownerName').markAsTouched();
    //   return
    // } else {
      if (this.recuring.invalid) {

        this.recuring.markAllAsTouched();
      } else{
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        repeatFrequency: this.recuring.controls.repeatFrequency.value,
        amount: this.recuring.controls.amount.value,
        paymentModeId: this.recuring.controls.paymentModeId.value,
        startsFrom: this.recuring.controls.startsFrom.value,
        budgetCategoryId: this.recuring.controls.category.value,
        continueTill: parseInt(this.recuring.controls.continueTill.value),
        numberOfYearOrNumberOfTime: this.recuring.controls.numberOfYearOrNumberOfTime.value,
        expenseCategoryId: this.recuring.controls.category.value,
      }
      if (this.getFlag == 'addExpenses') {
        if (this.recuring.controls.id.value == undefined) {
          delete obj.budgetCategoryId;
          this.planService.addRecuringExpense(obj).subscribe(
            data => this.addRecuringExpenseRes(data)
          );
        }
      } else if (this.getFlag == 'editExpenses') {
        //edit call
        delete obj.budgetCategoryId;
        obj['id'] = this.recuring.controls.id.value;
        this.planService.editRecuringExpense(obj).subscribe(
          data => this.editRecuringExpenseRes(data)
        );
      } else if (this.getFlag == 'addBudget') {
        if (this.recuring.controls.id.value == undefined) {
          delete obj.expenseCategoryId;
          this.planService.otherCommitmentsAdd(obj).subscribe(
            data => this.otherCommitmentsAddRes(data)
          );
        }
      } else if (this.getFlag == 'editBudget') {
        delete obj.expenseCategoryId;
        obj['id'] = this.recuring.controls.id.value;

        //edit call
        this.planService.otherCommitmentsEdit(obj).subscribe(
          data => this.otherCommitmentsEditRes(data)
        );
      }
    }
  }
  otherCommitmentsEditRes(data) {
    this.event.openSnackBar('Added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'added', state: 'close', data, refreshRequired: true })
  }
  otherCommitmentsAddRes(data) {
    this.event.openSnackBar('Updated successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'added', state: 'close', data, refreshRequired: true })
  }
  addRecuringExpenseRes(data) {
    this.subInjectService.changeNewRightSliderState({ flag: 'added', state: 'close', data, refreshRequired: true })
  }

  editRecuringExpenseRes(data) {
    this.subInjectService.changeNewRightSliderState({ flag: 'added', state: 'close', data, refreshRequired: true })
  }

  saveExpenses() {
    // if (this.expenses.get('expenseDoneOn').invalid) {
    //   this.expenses.get('expenseDoneOn').markAsTouched();
    //   return
    // } else if (this.expenses.get('timeInMilliSec').invalid) {
    //   this.expenses.get('timeInMilliSec').markAsTouched();
    //   return
    // } else if (this.expenses.get('amount').invalid) {
    //   this.expenses.get('amount').markAsTouched();
    //   return
    // } else if (this.expenses.get('category').invalid) {
    //   this.expenses.get('category').markAsTouched();
    //   return
    // } else if (this.expenses.get('paymentModeId').invalid) {
    //   this.expenses.get('paymentModeId').markAsTouched();
    //   return
    // } else if (this.expenses.get('ownerName').invalid) {
    //   this.expenses.get('ownerName').markAsTouched();
    //   return
    // } else {
          if (this.expenses.invalid) {

        this.expenses.markAllAsTouched();
      }else{
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        expenseDoneOn: this.expenses.controls.expenseDoneOn.value,
        amount: this.expenses.controls.amount.value,
        timeInMilliSec: this.expenses.controls.timeInMilliSec.value,
        time:this.expenses.controls.timeInMilliSec.value,
        startsFrom:this.expenses.controls.expenseDoneOn.value,
        paymentModeId: this.expenses.controls.paymentModeId.value,
        expenseCategoryId: this.expenses.controls.category.value,
        budgetCategoryId: this.expenses.controls.category.value,
        description: this.expenses.controls.description.value,
        id: this.expenses.controls.id.value
      }
      if (this.getFlag == 'addExpenses') {
        if (this.expenses.controls.id.value == undefined) {
          delete obj.budgetCategoryId;
          delete obj.time
          delete obj.startsFrom
          this.planService.addExpense(obj).subscribe(
            data => this.addExpenseRes(data)
          );
        } 
      } else if (this.getFlag == 'editExpenses') {
        //edit call
        delete obj.budgetCategoryId;
        delete obj.time
        delete obj.startsFrom        
          this.planService.editExpense(obj).subscribe(
          data => this.editExpenseRes(data)
        );
      }else if (this.getFlag == 'addBudget') {
        if (this.expenses.controls.id.value == undefined) {
          delete obj.expenseCategoryId;
          delete obj.expenseDoneOn
          delete obj.timeInMilliSec
          this.planService.addBudget(obj).subscribe(
            data => this.addBudgetRes(data)
          );
        }
      } else if (this.getFlag == 'editBudget') {
        //edit call
        delete obj.expenseCategoryId;
        delete obj.expenseCategoryId;
        delete obj.expenseDoneOn
        delete obj.timeInMilliSec
        this.planService.editBudget(obj).subscribe(
          data => this.editBudgetRes(data)
        );
      }

    }
  }
  addBudgetRes(data) {
    this.event.openSnackBar('Added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'added', state: 'close', data, refreshRequired: true })
  }
  editBudgetRes(data) {
    this.event.openSnackBar('Updated successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'added', state: 'close', data, refreshRequired: true })
  }
  addExpenseRes(data) {
    this.event.openSnackBar('Added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'added', state: 'close', data, refreshRequired: true })
  }

  editExpenseRes(data) {
    this.event.openSnackBar('Updated successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'added', state: 'close', data, refreshRequired: true })
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag })
  }
}
