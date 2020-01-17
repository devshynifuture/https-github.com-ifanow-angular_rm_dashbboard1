import {Component, OnInit, Input} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from 'src/app/auth-service/authService';
import {PlanService} from '../../customer/plan/plan.service';
import {ConstantsService} from "../../../../../../constants/constants.service";

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
  nomineesListFM: any;
  inputData: any;
  isViewInitCalled: any;
  expenseList: {};
  category: any;
  isRecuring = false;
  recuring: any;
  isNoOfYrs: any;

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject,
              private planService: PlanService, private constantService: ConstantsService) {
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
  ngOnInit() {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
    this.getListFamilyMem();
    this.getdataForm(this.inputData);
    this.getdataFormRec(this.inputData)
  }

  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }

  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
    console.log('list of family', this.nomineesListFM)
  }

  preventDefault(e) {
    e.preventDefault();
  }

  getdataForm(data) {
    if (data == undefined) {
      data = {};
    }
    this.expenses = this.fb.group({
      timeInMilliSec: [(data == undefined) ? '' : data.timeInMilliSec, [Validators.required]],
      expenseDoneOn: [(data == undefined) ? '' : new Date(data.expenseDoneOn), [Validators.required]],
      amount: [(data == undefined) ? '' : data.amount, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      category:[(data == undefined) ? '' : data.expenseCategoryId, [Validators.required]],
      familyMember: [(data == undefined) ? '' : data.familyMember, [Validators.required]],
      paymentModeId: [[(data == undefined) ? '' : data.paymentModeId], [Validators.required]],
      isRecuring: [(data == undefined) ? '' : data.isRecuring, [Validators.required]],
    });
    this.expenseList = this.constantService.expenseList
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
    this.planService.getListOfFamilyByClient(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }

  getListOfFamilyByClientRes(data) {
    console.log('family Memebers', data);
    this.familyMember = data.familyMembersList;
  }

  selectClient(event, selected) {
    console.log(selected)
    this.familyMemberId = selected.id
  }
  toggle(value){
    this.isRecuring = value.checked;
  }
  continuesTill(value){
    this.isNoOfYrs = value;
  }
saveRecuringExpense(){
  if (this.expenses.get('expenseDoneOn').invalid) {
    this.expenses.get('expenseDoneOn').markAsTouched();
    return
  } else if (this.expenses.get('repeatFrequency').invalid) {
    this.expenses.get('repeatFrequency').markAsTouched();
    return
  } else if (this.expenses.get('amount').invalid) {
    this.expenses.get('amount').markAsTouched();
    return
  }else if (this.expenses.get('every').invalid) {
    this.expenses.get('every').markAsTouched();
    return
  } else if (this.expenses.get('category').invalid) {
    this.expenses.get('category').markAsTouched();
    return
  } else if (this.expenses.get('startFrom').invalid) {
    this.expenses.get('startFrom').markAsTouched();
    return
  } else if (this.expenses.get('paymentModeId').invalid) {
    this.expenses.get('paymentModeId').markAsTouched();
    return
  } else if (this.expenses.get('continueTill').invalid) {
    this.expenses.get('continueTill').markAsTouched();
    return
  }  else if (this.expenses.get('whatDay').invalid) {
    this.expenses.get('whatDay').markAsTouched();
    return
  } else if (this.expenses.get('familyMember').invalid) {
    this.expenses.get('familyMember').markAsTouched();
    return
  } else if (this.expenses.get('isRecuring').invalid) {
    this.expenses.get('isRecuring').markAsTouched();
    return
  } else {
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        expenseDoneOn: this.expenses.controls.expenseDoneOn.value,
        amount: this.expenses.controls.amount.value,
        timeInMilliSec: this.expenses.controls.timeInMilliSec.value,
        paymentModeId:this.expenses.controls.paymentModeId.value,
        expenseCategoryId: this.expenses.controls.category.value,
        description: this.expenses.controls.description.value,
        isRecuring:this.expenses.controls.isRecuring.value,
        id: this.expenses.controls.id.value
      }
      if (this.expenses.controls.id.value == undefined) {
        this.planService.addRecuringExpense(obj).subscribe(
          data => this.addRecuringExpenseRes(data)
        );
      } else {
        //edit call
        this.planService.editRecuringExpense(obj).subscribe(
          data => this.editRecuringExpenseRes(data)
        );
      }
    }
  }
addRecuringExpenseRes(data) {
  console.log('addRecuringExpenseRes', data);
}

editRecuringExpenseRes(data) {
  console.log('editRecuringExpenseRes', data);
}

  saveExpenses() {
    if (this.expenses.get('expenseDoneOn').invalid) {
      this.expenses.get('expenseDoneOn').markAsTouched();
      return
    } else if (this.expenses.get('timeInMilliSec').invalid) {
      this.expenses.get('timeInMilliSec').markAsTouched();
      return
    } else if (this.expenses.get('amount').invalid) {
      this.expenses.get('amount').markAsTouched();
      return
    } else if (this.expenses.get('category').invalid) {
      this.expenses.get('category').markAsTouched();
      return
    } else if (this.expenses.get('paymentModeId').invalid) {
      this.expenses.get('paymentModeId').markAsTouched();
      return
    } else if (this.expenses.get('familyMember').invalid) {
      this.expenses.get('familyMember').markAsTouched();
      return
    } else if (this.expenses.get('isRecuring').invalid) {
      this.expenses.get('isRecuring').markAsTouched();
      return
    } else {
        let obj = {
          advisorId: this.advisorId,
          clientId: this.clientId,
          familyMemberId: this.familyMemberId,
          expenseDoneOn: this.expenses.controls.expenseDoneOn.value,
          amount: this.expenses.controls.amount.value,
          timeInMilliSec: this.expenses.controls.timeInMilliSec.value,
          paymentModeId:this.expenses.controls.paymentModeId.value,
          expenseCategoryId: this.expenses.controls.category.value,
          description: this.expenses.controls.description.value,
          isRecuring:this.expenses.controls.isRecuring.value,
          id: this.expenses.controls.id.value
        }
        if (this.expenses.controls.id.value == undefined) {
          this.planService.addExpense(obj).subscribe(
            data => this.addExpenseRes(data)
          );
        } else {
          //edit call
          this.planService.editExpense(obj).subscribe(
            data => this.editExpenseRes(data)
          );
        }
      }
    }
  addExpenseRes(data) {
    console.log('addExpenseRes', data);
  }

  editExpenseRes(data) {
    console.log('editExpenseRes', data);
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
