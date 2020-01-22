import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { PlanService } from '../../../customer/plan/plan.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ConstantsService } from 'src/app/constants/constants.service';
import { EventService } from 'src/app/Data-service/event.service';

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

  constructor(private event: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private planService: PlanService, private constantService: ConstantsService) { }

  ngOnInit() {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
    this.getdataForm(this.inputData);
    this.getdataFormRec(this.inputData)
    this.getListFamilyMem()
  }
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of FixedDepositComponent ', data);

    if (this.isViewInitCalled) {
      if (this.isViewInitCalled) {
          this.getdataFormRec(data)
          this.getdataForm(data);
      }
    }
  }

  get data() {
    return this.inputData;
  }
  preventDefault(e) {
    e.preventDefault();
  }
  toggle(value) {
    this.isRecuring = value.checked;
  }
  continuesTill(value) {
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
    }else{
      this.isRecuring = data.isRecuring
    }
    this.recuring = this.fb.group({
      timeInMilliSec: [(data == undefined) ? '' : data.timeInMilliSec, [Validators.required]],
      expenseDoneOn: [(data == undefined) ? '' : new Date(data.expenseDoneOn), [Validators.required]],
      amount: [(data == undefined) ? '' : data.amount, [Validators.required]],
      repeatFrequency: [(data == undefined) ? '' : data.repeatFrequency+'', [Validators.required]],
      startsFrom: [(data == undefined) ? '' : new Date(data.startsFrom), [Validators.required]],
      continuesDate: [(data == undefined) ? '' : new Date(data.continuesDate), [Validators.required]],
      continueTill: [(data == undefined) ? '' : (data.continueTill)+'', [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      numberOfYearOrNumberOfTime:[(data == undefined) ? '' : (data.numberOfYearOrNumberOfTime), [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      category: [(data == undefined) ? '' : data.expenseCategoryId, [Validators.required]],
      familyMember: [(data == undefined) ? '' : data.familyMember, [Validators.required]],
      paymentModeId: [(data == undefined) ? '' : data.paymentModeId+'', [Validators.required]],
      isRecuring: true
    });
    this.expenseList = this.constantService.expenseList
  }
  selectClient(event, selected) {
    console.log(selected)
    this.familyMemberId = selected.id
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {}
    }else{
      this.isRecuring = data.isRecuring
    }
    this.budget = this.fb.group({
      timeInMilliSec: [(data == undefined) ? '' : data.time, [Validators.required]],
      expenseDoneOn: [(data == undefined) ? '' : new Date(data.startsFrom), [Validators.required]],
      amount: [(data == undefined) ? '' : data.amount, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      category: [(data == undefined) ? '' : data.BudgetCategoryId, [Validators.required]],
      familyMember: [(data == undefined) ? '' : data.familyMember, [Validators.required]],
      paymentModeId: [(data == undefined) ? '' : data.paymentModeId+'', [Validators.required]],
      isRecuring: false
    });
    this.expenseList = this.constantService.expenseList
  }
  getFormControl(): any {
    return this.budget.controls;
  }
  getFormControlRec(): any {
    return this.recuring.controls;
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  saveRecuringExpense() {
    if (this.recuring.get('expenseDoneOn').invalid) {
      this.recuring.get('expenseDoneOn').markAsTouched();
      return
    } else if (this.recuring.get('repeatFrequency').invalid) {
      this.recuring.get('repeatFrequency').markAsTouched();
      return
    } else if (this.recuring.get('amount').invalid) {
      this.recuring.get('amount').markAsTouched();
      return
    } else if (this.recuring.get('category').invalid) {
      this.recuring.get('category').markAsTouched();
      return
    } else if (this.recuring.get('startsFrom').invalid) {
      this.recuring.get('startsFrom').markAsTouched();
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
    } else {
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        repeatFrequency:this.recuring.controls.repeatFrequency.value,
        amount: this.recuring.controls.amount.value,
        paymentModeId:this.recuring.controls.paymentModeId.value,
        startsFrom:this.recuring.controls.startsFrom.value,
        continueTill:parseInt(this.recuring.controls.continueTill.value),
        numberOfYearOrNumberOfTime:(this.recuring.controls.numberOfYearOrNumberOfTime.value == undefined)?null:this.recuring.controls.numberOfYearOrNumberOfTime.value,
        expenseCategoryId: this.recuring.controls.category.value,
      }
      if (this.recuring.controls.id.value == undefined) {
        this.planService.otherCommitmentsAdd(obj).subscribe(
          data => this.otherCommitmentsAddRes(data)
        );
      } else {
        obj['id'] = this.recuring.controls.id.value;
        //edit call
        this.planService.editRecuringExpense(obj).subscribe(
          data => this.editRecuringExpenseRes(data)
        );
      }
    }
  }
  otherCommitmentsAddRes(data) {
    console.log(data)
  }
  editRecuringExpenseRes(data) {
    console.log(data)
  }
  saveExpenses() {
    if (this.budget.get('expenseDoneOn').invalid) {
      this.budget.get('expenseDoneOn').markAsTouched();
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
    } else {
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        startsFrom: this.budget.controls.expenseDoneOn.value,
        amount: this.budget.controls.amount.value,
        time: this.budget.controls.timeInMilliSec.value,
        paymentModeId: this.budget.controls.paymentModeId.value,
        BudgetCategoryId: this.budget.controls.category.value,
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
  addBudgetRes(data) {
    console.log(data)
    this.event.openSnackBar('Added successfully!', 'dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'added', state: 'close', data, refreshRequired: true })
  }
  editBudgetRes(data) {
    console.log(data)
    this.event.openSnackBar('Updated successfully!', 'dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'added', state: 'close', data, refreshRequired: true })
  }
}
