import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { CustomerService } from '../../../../customer.service';

@Component({
  selector: 'app-income-detailed-view',
  templateUrl: './income-detailed-view.component.html',
  styleUrls: ['./income-detailed-view.component.scss']
})
export class IncomeDetailedViewComponent implements OnInit {
  inputData: any;
  // build error
  showInsurance = '';
  // 
  income: any;
  monthlyContribution: any[];
  incomeArr=[];
  allowanceArr=[];
  perquisitesArr=[];
  ReimbursementArr=[];
  RetiralsArr=[];
  OthersArr=[];
  monthlyIncomeArr=[];
  bankList=[];                                                                                                                                  

  constructor(private custumService:CustomerService,public utils: UtilService,private subInjectService: SubscriptionInject,private enumService :EnumServiceService) { }

  ngOnInit() {
    this.income = this.inputData
    this.bankAccountList();

  }
  @Input()
  set data(data) {
    this.inputData = data;
    this.getArrays(this.inputData );
    this.monthlyContribution = [];
    let monthlyData = this.inputData.bonusOrInflowList
    monthlyData.forEach(element => {
      element.date=new Date(element.receivingYear, element.receivingMonth)
    });
    this.monthlyContribution  = monthlyData;
  }

  get data() {
    return this.inputData;
  }
  getArrays(data){
    if (data.basicIncome) {
      this.incomeArr.push({name:'Basic Salary',value:data.basicIncome});
    }
     if (data.deamessAlowance) {
      this.incomeArr.push({name:'DA',value:data.deamessAlowance});
    }
    Object.entries(data.incomePerquisites).forEach(([key, value]) => {
      if (value && key != 'id') {
        let valueOfincome =key ? (key == 'foodCoupon' ? 'Food Coupons' : key == 'giftVouchers' ? 'Gift Vouchers' : key == 'driversSalary' ? "Driver's Salary" : key == 'Other' ? 'Other' : '') : '';
        this.perquisitesArr.push({name:valueOfincome,value:value});
      }
    });
    Object.entries(data.incomeAllowance).forEach(([key, value]) => {
      if (value && key != 'id') {
        let valueOfincome =key ? (key == 'hraReceived' ? 'House Rent Allowance' : key == 'specialAllowance' ? 'Special Allowance' : key == 'specialCompensatoryAllowance' ? 'Special Compensatory Allowance' : key == 'educationAllowance' ? 'Education Allowance' : key == 'transportAllowance' ? 'Transport Allowance' : key == 'medicalAllowance' ? 'Medical Allowance' : key == 'conveyanceAllowance' ? 'Conveyance Allowance' : key == 'leaveTravelAllowance' ? 'Leave Travel Allowance' : key == 'uniformAllowance' ? 'Uniform Allowance' : key == 'carMaintenanceAllowance' ? 'Car Maintenance Allowance' : key == 'residualChoicePay' ? 'Residual Choice pay' : key == 'superannuationAllowance' ? 'Superannuation Allowance' : key == 'otherAllowance' ? 'Other' : '') : '';
        this.allowanceArr.push({name:valueOfincome,value:value});
      }
    });
    Object.entries(data.incomeReimbursement).forEach(([key, value]) => {
      if (value && key != 'id') {
        let valueOfincome =key ? (key == 'mobileOrTelephone' ? 'Mobile/telephone ' : key == 'carCharges' ? 'Car Charges' : key == 'fuelAndMaintenance' ? 'Fuel & Maintenance' : key == 'entertainmentExpense' ? 'Entertainment Expenses' : key == 'otherReimbursement' ? 'Other' : '') : '';
        this.ReimbursementArr.push({name:valueOfincome,value:value});
      }
    });
    Object.entries(data.incomeRetirals).forEach(([key, value]) => {
      if (value && key != 'id') {
        let valueOfincome =key ? (key == 'gratuity' ? 'Gratuity' : key == 'superannuation' ? "Superannuation's" : key == 'nps' ? 'NPS' : key == 'pf' ? 'PF' : '') : ''
        this.RetiralsArr.push({name:valueOfincome,value:value});
      }
    });
    // Object.entries(data.incomeOthers).forEach(([key, value]) => {
    //   if (value && key != 'id') {
    //     let valueOfincome =key ? (key == 'bonus' ? 'Bonus' : key == 'performancePay' ? 'Performance Pay' : '') : '';
    //     this.OthersArr.push({name:valueOfincome,value:value});
    //   }
    // });
    Object.entries(data.monthlyIncomeOptionList).forEach(([key, value]) => {
      if (value && key != 'id') {
        let valueOfincome =key ? (key == 'interestIncome' ? 'Interest Income' : key == 'dividendIncome' ? 'Dividend Income' : key == 'royaltyIncome' ? 'Royalty Income' : key == 'annuityIncome' ? 'Annuity Income' : key == 'pension' ? 'Pension' : key == 'incomeFromNonProfessional' ? 'Income From Non Professional'  : key == 'incomeFromPartTimeJob' ? 'Income from part time job' : key == 'investIncome' ? 'Investment Income' : key == 'alimony' ? 'Alimony' : key == 'farmingOrFishingIncome' ? 'Farming /Fishing Income' : key == 'winningFromLottery' ? 'Winning from lottery ' : key == 'others' ? 'others' : '') : '';
        this.monthlyIncomeArr.push({name:valueOfincome,value:value});
      }
    });
  }
  bankAccountList() {
          
          const obj = {
            userId: this.income.familyMemberId == 0 ?this.income.clientId : this.income.id,
            userType: this.income.familyMemberId == 0 ? 2 : 3 
          };
          this.custumService.getBankList(obj).subscribe(
            (data) => {
              this.bankList = data;
              this.bankList.forEach(element => {
                if (element.id == this.income.linkedBankAccountNumber) {
                  this.income.bankName = element.bankName;
                }
              });
              this.enumService.addBank(this.bankList);
            },
            (err) => {
              this.bankList=[];
            }
          );
        
    
  
    // this.bankList = value;

  }
  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

}
