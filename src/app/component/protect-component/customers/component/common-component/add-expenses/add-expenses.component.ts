import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from 'src/app/auth-service/authService';
import {PlanService} from '../../customer/plan/plan.service';

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


  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject,
              private planService: PlanService) {
  }

  ngOnInit() {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
    this.getListFamilyMem();


    // expenseJsonMap =
    this.getdataForm('');
  }

  preventDefault(e) {
    e.preventDefault();
  }

  getdataForm(data) {
    if (data == undefined) {
      data = {};
    }
    this.expenses = this.fb.group({
      time: [(data == undefined) ? '' : data.time, [Validators.required]],
      date: [(data == undefined) ? '' : new Date(data.date), [Validators.required]],
      amount: [(data == undefined) ? '' : data.amount, [Validators.required]],
      category: [(data == undefined) ? '' : (data.category) + '', [Validators.required]],
      familyMember: [(data == undefined) ? '' : this.familyMember, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      paymentMode: [[(data == undefined) ? '' : data.paymentMode], [Validators.required]]
    });
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

  saveExpenses() {
    if (this.expenses.get('date').invalid) {
      this.expenses.get('date').markAsTouched();
      return;
    } else if (this.expenses.get('time').invalid) {
      this.expenses.get('time').markAsTouched();
      return;
    } else if (this.expenses.get('amount').invalid) {
      this.expenses.get('amount').markAsTouched();
      return;
    } else if (this.expenses.get('category').invalid) {
      this.expenses.get('category').markAsTouched();
      return;
    } else if (this.expenses.get('paymentMode').invalid) {
      this.expenses.get('paymentMode').markAsTouched();
      return;
    } else if (this.expenses.get('familyMember').invalid) {
      this.expenses.get('familyMember').markAsTouched();
      return;
    } else if (this.expenses.get('date').invalid) {
      this.expenses.get('date').markAsTouched();
      return;
    } else if (this.expenses.get('date').invalid) {
      this.expenses.get('date').markAsTouched();
      return;
    } else {
      const obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        // familyMemberId: this.familyMemberId,
        // ownerName: (this.ownerName == undefined) ? this.expenses.controls.ownerName.value : this.ownerName,
        commencementDate: this.expenses.controls.date.value,
        pensionAmount: this.expenses.controls.time.value,
        pensionPayoutFrequencyId: this.expenses.controls.amount.value,
        linkedBankAccount: this.expenses.controls.category.value,
        description: this.expenses.controls.description.value,
        id: this.expenses.controls.id.value
      };
      if (this.expenses.controls.id.value == undefined) {
        this.planService.addExpense(obj).subscribe(
          data => this.addExpenseRes(data)
        );
      } else {
        // edit call
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
