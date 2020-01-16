import {Component, OnInit, Input} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from 'src/app/auth-service/authService';
import {PlanService} from '../../customer/plan/plan.service';
import { ConstantsService } from 'src/app/constants/constants.service';

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
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
    console.log('list of family',this.nomineesListFM)
  }
  preventDefault(e){
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
    });
    this.expenseList = this.constantService.expenseList
  }

  getFormControl(): any {
    return this.expenses.controls;
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
  selectClient(event, selected){
    console.log(selected)
    this.familyMemberId =  selected.id
  }
  saveExpenses() {
    if (this.expenses.get('expenseDoneOn').invalid) {
      this.expenses.get('expenseDoneOn').markAsTouched();
      return
      }else if (this.expenses.get('timeInMilliSec').invalid) {
        this.expenses.get('timeInMilliSec').markAsTouched();
        return
      }else if (this.expenses.get('amount').invalid) {
        this.expenses.get('amount').markAsTouched();
        return
      }else if (this.expenses.get('category').invalid) {
        this.expenses.get('category').markAsTouched();
        return
      }else if (this.expenses.get('paymentModeId').invalid) {
        this.expenses.get('paymentModeId').markAsTouched();
        return
      }else if (this.expenses.get('familyMember').invalid) {
        this.expenses.get('familyMember').markAsTouched();
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
