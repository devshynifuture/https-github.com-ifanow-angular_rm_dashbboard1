import {Injectable} from '@angular/core/src/metadata/*';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  expenseList = [
    {
      clientExpenseTypeMasterId: 1,
      expenseType: 'Food & Groceries',
      label: 'Basic'
    },
    {
      clientExpenseTypeMasterId: 2,
      expenseType: 'Clothing',
      label: 'Basic'
    },
    {
      clientExpenseTypeMasterId: 3,
      expenseType: 'Medical expenses',
      label: 'Basic'
    },
    {
      clientExpenseTypeMasterId: 4,
      expenseType: 'Shopping',
      label: 'Basic'
    },
    {
      clientExpenseTypeMasterId: 5,
      expenseType: 'Basic misc.',
      label: 'Basic'
    },
     {
      clientExpenseTypeMasterId: 6,
      expenseType: 'Iron/Laundry',
      label: 'Basic'
    },
    {
      clientExpenseTypeMasterId: 7,
      expenseType: 'Mobile',
      label: 'Bills & Utilities'
    },
    {
      clientExpenseTypeMasterId: 8,
      expenseType: 'Internet',
      label: 'Bills & Utilities'
    },
    {
      clientExpenseTypeMasterId: 9,
      expenseType: 'Electricity',
      label: 'Bills & Utilities'
    },
    {
      clientExpenseTypeMasterId: 10,
      expenseType: 'DTH',
      label: 'Bills & Utilities'
    },
    {
      clientExpenseTypeMasterId: 11,
      expenseType: 'Telephone',
      label: 'Bills & Utilities'
    },
    {
      clientExpenseTypeMasterId: 12,
      expenseType: 'Newspaper & Magazines',
      label: 'Bills & Utilities'
    },
    {
      clientExpenseTypeMasterId: 13,
      expenseType: 'Bills & Utilities misc.',
      label: 'Bills & Utilities'
    },
     {
      clientExpenseTypeMasterId: 14,
      expenseType: 'Gas',
      label: 'Bills & Utilities'
    },
    {
      clientExpenseTypeMasterId: 15,
      expenseType: 'Daily commute',
      label: 'Transport'
    },
    {
      clientExpenseTypeMasterId: 16,
      expenseType: 'Petrol/Diesel',
      label: 'Transport'
    },
    {
      clientExpenseTypeMasterId: 17,
      expenseType: 'Driver\'s salary',
      label: 'Transport'
    },
    {
      clientExpenseTypeMasterId: 18,
      expenseType: 'Parking charges',
      label: 'Transport'
    },
    {
      clientExpenseTypeMasterId: 19,
      expenseType: 'Transport misc.',
      label: 'Transport'
    },
     {
      clientExpenseTypeMasterId: 20,
      expenseType: 'Vehicle Maintenance',
      label: 'Transport'
    },
    {
      clientExpenseTypeMasterId: 21,
      expenseType: 'School/College/University fees',
      label: 'Education'
    },
    {
      clientExpenseTypeMasterId: 22,
      expenseType: 'Tuition fees',
      label: 'Education'
    },
    {
      clientExpenseTypeMasterId: 23,
      expenseType: 'Book & Supplies',
      label: 'Education'
    },
    {
      clientExpenseTypeMasterId: 24,
      expenseType: 'Kids activities',
      label: 'Education'
    },
    {
      clientExpenseTypeMasterId: 25,
      expenseType: 'Education misc.',
      label: 'Education'
    },
    {
      clientExpenseTypeMasterId: 26,
      expenseType: 'Rent',
      label: 'Housing'
    },
    {
      clientExpenseTypeMasterId: 27,
      expenseType: 'Society maintenance',
      label: 'Housing'
    },
    {
      clientExpenseTypeMasterId: 28,
      expenseType: 'Car wash',
      label: 'Housing'
    },
    {
      clientExpenseTypeMasterId: 29,
      expenseType: 'Housing misc.',
      label: 'Housing'
    },
      {
      clientExpenseTypeMasterId: 30,
      expenseType: 'Property Tax',
      label: 'Housing'
    },
      {
      clientExpenseTypeMasterId: 31,
      expenseType: 'Maid/Domestic Helper',
      label: 'Housing'
    },
    {
      clientExpenseTypeMasterId: 32,
      expenseType: 'Movies',
      label: 'Entertainment'
    },
    {
      clientExpenseTypeMasterId: 33,
      expenseType: 'Restaurants',
      label: 'Entertainment'
    },
    {
      clientExpenseTypeMasterId: 34,
      expenseType: 'Amusement',
      label: 'Entertainment'
    },
    {
      clientExpenseTypeMasterId: 35,
      expenseType: 'Vacation',
      label: 'Entertainment'
    },
    {
      clientExpenseTypeMasterId: 36,
      expenseType: 'Entertainment misc.',
      label: 'Entertainment'
    },
    {
      clientExpenseTypeMasterId: 37,
      expenseType: 'Gifts & Donations',
      label: 'Miscellaneous'
    },
    {
      clientExpenseTypeMasterId: 38,
      expenseType: 'Personal care',
      label: 'Miscellaneous'
    },
    {
      clientExpenseTypeMasterId: 39,
      expenseType: 'Health & Fitness',
      label: 'Miscellaneous'
    },
    {
      clientExpenseTypeMasterId: 40,
      expenseType: 'Doctor',
      label: 'Miscellaneous'
    },
    {
      clientExpenseTypeMasterId: 41,
      expenseType: 'Dentist',
      label: 'Miscellaneous'
    },
    {
      clientExpenseTypeMasterId: 42,
      expenseType: 'Miscellaneous',
      label: 'Miscellaneous'
    },  
    {
      clientExpenseTypeMasterId: 43,
      expenseType: 'Professional Fees',
      label: 'Miscellaneous'
    },
    {
      clientExpenseTypeMasterId: 44,
      expenseType: 'Repairs & Maintenance',
      label: 'Miscellaneous'
    },
    {
      clientExpenseTypeMasterId: 45,
      expenseType: 'Nanny - Baby sitting',
      label: 'Miscellaneous'
    },
    {
      clientExpenseTypeMasterId: 46,
      expenseType: 'Saloon & Spa',
      label: 'Miscellaneous'
    },
    {
      clientExpenseTypeMasterId: 47,
      expenseType: 'Parental care',
      label: 'Miscellaneous'
    },
    {
      clientExpenseTypeMasterId: 48,
      expenseType: 'Contribution to parents/siblings',
      label: 'Miscellaneous'
    }   
  ];

  expenseJsonMap = {};

  constructor() {

    this.expenseList.forEach(singleExpense => {
      this.expenseJsonMap[singleExpense.clientExpenseTypeMasterId] = singleExpense;
    });

  }
}
