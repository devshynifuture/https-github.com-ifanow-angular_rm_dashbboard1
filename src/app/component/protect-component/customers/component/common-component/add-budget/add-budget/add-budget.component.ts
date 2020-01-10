import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { PlanService } from '../../../customer/plan/plan.service';
import { AuthService } from 'src/app/auth-service/authService';

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

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject,private planService:PlanService) { }

  ngOnInit() {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
    this.expenseList = [
      {
        "clientExpenseTypeMasterId": 1,
        "expenseType": "Food & Groceries",
        "label": "Basic"
      },
      {
        "clientExpenseTypeMasterId": 2,
        "expenseType": "Clothing",
        "label": "Basic"
      },
      {
        "clientExpenseTypeMasterId": 3,
        "expenseType": "Medical expenses",
        "label": "Basic"
      },
      {
        "clientExpenseTypeMasterId": 4,
        "expenseType": "Shopping",
        "label": "Basic"
      },
      {
        "clientExpenseTypeMasterId": 5,
        "expenseType": "Basic misc.",
        "label": "Basic"
      },
      {
        "clientExpenseTypeMasterId": 6,
        "expenseType": "Mobile",
        "label": "Bills & Utilities"
      },
      {
        "clientExpenseTypeMasterId": 7,
        "expenseType": "Internet",
        "label": "Bills & Utilities"
      },
      {
        "clientExpenseTypeMasterId": 8,
        "expenseType": "Electricity",
        "label": "Bills & Utilities"
      },
      {
        "clientExpenseTypeMasterId": 9,
        "expenseType": "DTH",
        "label": "Bills & Utilities"
      },
      {
        "clientExpenseTypeMasterId": 10,
        "expenseType": "Telephone",
        "label": "Bills & Utilities"
      },
      {
        "clientExpenseTypeMasterId": 11,
        "expenseType": "Newspaper & Magazines",
        "label": "Bills & Utilities"
      },
      {
        "clientExpenseTypeMasterId": 12,
        "expenseType": "Bills & Utilities misc.",
        "label": "Bills & Utilities"
      },
      {
        "clientExpenseTypeMasterId": 13,
        "expenseType": "Daily commute",
        "label": "Transport"
      },
      {
        "clientExpenseTypeMasterId": 14,
        "expenseType": "Petrol/Diesel",
        "label": "Transport"
      },
      {
        "clientExpenseTypeMasterId": 15,
        "expenseType": "Driver's salary",
        "label": "Transport"
      },
      {
        "clientExpenseTypeMasterId": 16,
        "expenseType": "Parking charges",
        "label": "Transport"
      },
      {
        "clientExpenseTypeMasterId": 17,
        "expenseType": "Transport misc.",
        "label": "Transport"
      },
      {
        "clientExpenseTypeMasterId": 18,
        "expenseType": "School/College/University fees",
        "label": "Education"
      },
      {
        "clientExpenseTypeMasterId": 19,
        "expenseType": "Tuition fees",
        "label": "Education"
      },
      {
        "clientExpenseTypeMasterId": 20,
        "expenseType": "Book & Supplies",
        "label": "Education"
      },
      {
        "clientExpenseTypeMasterId": 21,
        "expenseType": "Kids activities",
        "label": "Education"
      },
      {
        "clientExpenseTypeMasterId": 22,
        "expenseType": "Education misc.",
        "label": "Education"
      },
      {
        "clientExpenseTypeMasterId": 23,
        "expenseType": "Rent",
        "label": "Housing"
      },
      {
        "clientExpenseTypeMasterId": 24,
        "expenseType": "Society maintenance",
        "label": "Housing"
      },
      {
        "clientExpenseTypeMasterId": 25,
        "expenseType": "Car wash",
        "label": "Housing"
      },
      {
        "clientExpenseTypeMasterId": 26,
        "expenseType": "Housing misc.",
        "label": "Housing"
      },
      {
        "clientExpenseTypeMasterId": 27,
        "expenseType": "Movies",
        "label": "Entertainment"
      },
      {
        "clientExpenseTypeMasterId": 28,
        "expenseType": "Restaurants",
        "label": "Entertainment"
      },
      {
        "clientExpenseTypeMasterId": 29,
        "expenseType": "Amusement",
        "label": "Entertainment"
      },
      {
        "clientExpenseTypeMasterId": 30,
        "expenseType": "Vacation",
        "label": "Entertainment"
      },
      {
        "clientExpenseTypeMasterId": 31,
        "expenseType": "Entertainment misc.",
        "label": "Entertainment"
      },
      {
        "clientExpenseTypeMasterId": 32,
        "expenseType": "Gifts & Donations",
        "label": "Miscellaneous"
      },
      {
        "clientExpenseTypeMasterId": 33,
        "expenseType": "Personal care",
        "label": "Miscellaneous"
      },
      {
        "clientExpenseTypeMasterId": 34,
        "expenseType": "Health & Fitness",
        "label": "Miscellaneous"
      },
      {
        "clientExpenseTypeMasterId": 35,
        "expenseType": "Doctor",
        "label": "Miscellaneous"
      },
      {
        "clientExpenseTypeMasterId": 36,
        "expenseType": "Dentist",
        "label": "Miscellaneous"
      },
      {
        "clientExpenseTypeMasterId": 37,
        "expenseType": "Miscellaneous",
        "label": "Miscellaneous"
      },
      {
        "clientExpenseTypeMasterId": 38,
        "expenseType": "Gas",
        "label": "Bills & Utilities"
      },
      {
        "clientExpenseTypeMasterId": 39,
        "expenseType": "Professional Fees",
        "label": "Miscellaneous"
      },
      {
        "clientExpenseTypeMasterId": 40,
        "expenseType": "Repairs & Maintenance",
        "label": "Miscellaneous"
      },
      {
        "clientExpenseTypeMasterId": 41,
        "expenseType": "Maid/Domestic Helper",
        "label": "Housing"
      },
      {
        "clientExpenseTypeMasterId": 42,
        "expenseType": "Nanny - Baby sitting",
        "label": "Miscellaneous"
      },
      {
        "clientExpenseTypeMasterId": 43,
        "expenseType": "Property Tax",
        "label": "Housing"
      },
      {
        "clientExpenseTypeMasterId": 44,
        "expenseType": "Vehicle Maintenance",
        "label": "Transport"
      },
      {
        "clientExpenseTypeMasterId": 45,
        "expenseType": "Saloon & Spa",
        "label": "Miscellaneous"
      },
      {
        "clientExpenseTypeMasterId": 46,
        "expenseType": "Parental care",
        "label": "Miscellaneous"
      }
    ]
    this.getdataForm('')
  }
  
  preventDefault(e){
    e.preventDefault();
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
