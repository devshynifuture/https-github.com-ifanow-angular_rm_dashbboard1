import { Component, EventEmitter, Input, OnInit, Output, ViewChildren, QueryList } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatInput, MatDialog } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { PlanService } from '../../../plan.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ValidatorType } from 'src/app/services/util.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

import { DatePipe } from '@angular/common';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';


export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-individual-income-info',
  templateUrl: './individual-income-info.component.html',
  styleUrls: ['./individual-income-info.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class IndividualIncomeInfoComponent implements OnInit {
  date = new FormControl(moment());
  bankList: any;
  id: any;
  chosenYearHandler(normalizedYear: Moment, form, value) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    // this.date.setValue(ctrlValue);
    form.get(value).setValue(ctrlValue);

  }
  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, form, value) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    form.get(value).setValue(ctrlValue);

    datepicker.close();
  }
  individualIncomeData: any;
  finalIncomeAddList = [];
  addMoreFlag: boolean;
  incomeOption: any;
  singleIndividualIncome: any;
  singleIncomeType: any;
  incomePosition = 0;
  advisorId: any;
  clientId: any;
  editApiData: any;
  finalBonusList: any[];
  bonusList: any;
  showDateError: string;
  expectedBonusForm: any;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  isStatic = true;
  isErractic = false;
  constructor(private dialog: MatDialog,private enumService: EnumServiceService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private planService: PlanService, private eventService: EventService) { }
  validatorType = ValidatorType;
  montlyIncomeObj = { "id": null, "interestIncome": null,"dividendIncome": null,"royaltyIncome": null,"annuityIncome": null,"pension": null,"incomeFromNonProfessional": null,"incomeFromPartTimeJob": null,"investIncome": null,"alimony": null,"farmingOrFishingIncome": null,"winningFromLottery": null,"others": null};
  perquisitesObj = { "id": null, "incomeId": null, "foodCoupon": null, "giftVouchers": null, "driversSalary": null, "otherPerquisites": null };
  allowancesObj = { "id": null, "incomeId": null, "hraReceived": null, "specialAllowance": null, "specialCompensatoryAllowance": null, "educationAllowance": null, "transportAllowance": null, "medicalAllowance": null, "conveyanceAllowance": null, "leaveTravelAllowance": null, "uniformAllowance": null, "carMaintenanceAllowance": null, "residualChoicePay": null, "superannuationAllowance": null, "otherAllowance": null };
  reimbursementsObj = { "id": null, "incomeId": null, "mobileOrTelephone": null, "carCharges": null, "fuelAndMaintenance": null, "entertainmentExpense": null, "otherReimbursement": null };
  retiralsObj = { "id": null, "incomeId": null, "gratuity": null, "superannuation": null, "nps": null, "pf": null };
  othersObj = { "id": null, "incomeId": null, "bonus": null, "performancePay": null };
  monthlyIncArr = [{ name: 'Interest Income', disabled: false, value: '1' }, { name: 'Dividend Income', disabled: false, value: '2' }, { name: 'Royalty Income', disabled: false, value: '3' }, { name: 'Annuity Income', disabled: false, value: '4' }, { name: 'Pension', disabled: false, value: '5' }
    , { name: 'Income From Non Professional', disabled: false, value: '6' }, { name: 'Income from part time job', disabled: false, value: '7' }, { name: 'Investment Income', disabled: false, value: '8' }, { name: 'Alimony', disabled: false, value: '9' },
  { name: 'Farming /Fishing Income', disabled: false, value: '10' }, { name: 'Winning from lottery ', disabled: false, value: '11' }, { name: 'others', disabled: false, value: '12' }];
  basicSalaryArr = [{ name: 'Basic', disabled: false, value: '1' }, { name: 'DA', disabled: false, value: '2' }];
  perquisitesArr = [{ name: 'Food Coupons', disabled: false, value: '1' }, { name: 'Gift Vouchers', disabled: false, value: '2' }, { name: "Driver's Salary", disabled: false, value: '3' }, { name: 'Other', disabled: false, value: '4' }];
  reimbursementsArr = [{ name: 'Mobile/telephone', disabled: false, value: '1' }, { name: 'Car Charges', disabled: false, value: '2' }, { name: 'Fuel & Maintenance', disabled: false, value: '3' }, { name: 'Entertainment Expenses', disabled: false, value: '4' }, { name: 'Other', disabled: false, value: '5' }];
  allowancesArr = [{ name: 'House Rent Allowance', disabled: false, value: '1' }, { name: 'Special Allowance', disabled: false, value: '2' }, { name: 'Special Compensatory Allowance', disabled: false, value: '3' }, { name: 'Education Allowance', disabled: false, value: '4' }, { name: 'Transport Allowance', disabled: false, value: '5' }, { name: 'Medical Allowance', disabled: false, value: '6' },
  { name: 'Conveyance Allowance', disabled: false, value: '7' }, { name: 'Leave Travel Allowance', disabled: false, value: '8' }, { name: 'Uniform Allowance', disabled: false, value: '9' }, { name: 'Car Maintenance Allowance', disabled: false, value: '10' },
  { name: 'Residual Choice pay', disabled: false, value: '11' }, { name: 'Superannuation Allowance', disabled: false, value: '12' }, { name: 'Other', disabled: false, value: '13' }];
  retiralsArr = [{ name: 'Gratuity', disabled: false, value: '1' }, { name: "Superannuation's", disabled: false, value: '2' }, { name: 'NPS', disabled: false, value: '3' }, { name: 'PF', disabled: false, value: '4' }];
  othersArr = [{ name: 'Bonus', disabled: false, value: '1' }, { name: 'Performance pay', disabled: false, value: '2' }];
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    if (!this.editApiData) {
      this.expectedBonusForm = this.fb.group({
        bonusList: new FormArray([])
      })
    }
    this.bankList = this.enumService.getBank();


  }
  incomeNetForm = this.fb.group({
    incomeOption: ['2', [Validators.required]],
    // monthlyAmount: [, [Validators.required]],
    incomeStyle: ['1', [Validators.required]],
    continousTill: [String(1), [Validators.required]],
    continousTillYear: [, []],
    incomeGrowthRate: [, [Validators.required]],
    // basicIncome: [, [Validators.required]],
    // standardDeduction: [, [Validators.required]],
    // deamessAlowance: [, [Validators.required]],
    // hraRecieved: [, [Validators.required]],
    // totalRentPaid: [, [Validators.required]],
    incomeStartDate: [, [Validators.required]],
    incomeEndDate: [, [Validators.required]],
    bankAcNo: [],
    // expectingBonusValue: [, [Validators.required]],
    nextAppraisal: [],
    description: [],
    monthlyIncomeForm: this.fb.array([this.fb.group({
      monthlyIncType: ['',[Validators.required]],
      monthlyIncAmt: [null,[Validators.required]],
      id: null,
    })]),
    basicSalaryForm: this.fb.array([this.fb.group({
      salaryType: ['', [Validators.required]],
      amount: [null, [Validators.required]],
      id: null,
    })]),
    allowancesForm: this.fb.array([this.fb.group({
      allowancesType: ['', [Validators.required]],
      allowancesAmt: [null, [Validators.required]],
      id: null,
    })]),
    perquisitesForm: this.fb.array([this.fb.group({
      perquisitesType: ['', [Validators.required]],
      perquisitesAmt: [null, [Validators.required]],
      id: null,
    })]),
    reimbursementsForm: this.fb.array([this.fb.group({
      reimbursementsType: ['', [Validators.required]],
      reimbursementsAmt: [null, [Validators.required]],
      id: null,
    })]),
    retiralsForm: this.fb.array([this.fb.group({
      retiralsType: ['', [Validators.required]],
      retiralsAmt: [null, [Validators.required]],
      id: null,
    })]),
    othersForm: this.fb.array([this.fb.group({
      othersType: ['', [Validators.required]],
      othersAmt: [null, [Validators.required]],
      id: null,
    })])
  })
  @Output() previousStep = new EventEmitter();
  @Input() set FinalIncomeList(data) {
    if (data == undefined) {
      this.incomeNetForm.controls.inc
      return;
    }
    this.addMoreFlag = false;
    this.incomeOption = "2"
    console.log(data)
    data.forEach(element => {
      if (element.selected) {
        element.incomeTypeList.forEach(checkedData => {
          let cloneElement = Object.assign({}, element)
          if (checkedData.checked) {
            cloneElement['finalIncomeList'] = checkedData;
            this.finalIncomeAddList.push(cloneElement)
          }
        })
      }
    });
    console.log(this.finalIncomeAddList)
    this.individualIncomeData = data
    this.singleIndividualIncome = this.finalIncomeAddList[this.incomePosition];
    console.log(this.singleIncomeType)
  }

  changeValidations() {
    if (this.incomeNetForm.get('continousTill').value == 3) {

      this.incomeNetForm.get('continousTillYear').setValidators([Validators.required]);
      this.incomeNetForm.get('continousTillYear').updateValueAndValidity();
      this.incomeNetForm.controls['continousTillYear'].setErrors({ 'required': true });
    } else {
      this.incomeNetForm.get('continousTillYear').setValidators(null);
      this.incomeNetForm.get('continousTillYear').updateValueAndValidity();
      this.incomeNetForm.controls['continousTillYear'].setErrors(null);
    }
  }
  @Input() set editIncomeData(data) {
    if (data == undefined) {
      this.incomeNetForm.controls.incomeOption.setValue('2');
      this.incomeNetForm.controls.incomeStyle.setValue('1')

      return;
    }
    else {
      this.editApiData = data;
      this.id = data.id;
      this.singleIndividualIncome = data;
      this.singleIndividualIncome['name'] = data.ownerName;
      this.singleIndividualIncome["finalIncomeList"] = { incomeTypeList: data.incomeTypeId }
      this.addMoreFlag = false;
      this.incomeOption = String(data.incomeOption);
      // this.incomeNetForm.controls.incomeOption.setValue((data.incomeTypeId) ? String(data.incomeTypeId) : '2');
      this.incomeNetForm.controls.incomeOption.setValue((data.incomeOption) ? String(data.incomeOption) : '2');
      // this.incomeNetForm.controls.monthlyAmount.setValue(data.monthlyIncome);
      this.incomeNetForm.controls.incomeStyle.setValue(data.incomeStyleId + '');
      this.incomeNetForm.controls.continousTill.setValue(String(data.continueTill));
      this.incomeNetForm.controls.incomeGrowthRate.setValue(data.growthRate);
      // this.incomeNetForm.controls.basicIncome.setValue((data.basicIncome == 0) ? '' : data.basicIncome);
      // this.incomeNetForm.controls.standardDeduction.setValue((data.standardDeduction == 0) ? '' : data.standardDeduction);
      // this.incomeNetForm.controls.deamessAlowance.setValue((data.deamessAlowance == 0) ? '' : data.deamessAlowance);
      // this.incomeNetForm.controls.hraRecieved.setValue((data.hraRecieved == 0) ? '' : data.hraRecieved);
      // this.incomeNetForm.controls.totalRentPaid.setValue((data.totalRentPaid == 0) ? '' : data.totalRentPaid);
      this.incomeNetForm.controls.incomeStartDate.setValue(new Date(data.incomeStartYear, data.incomeStartMonth));
      this.incomeNetForm.controls.incomeEndDate.setValue(new Date(data.incomeEndYear, data.incomeEndMonth));
      this.incomeNetForm.controls.nextAppraisal.setValue(new Date(data.nextAppraisalOrNextRenewal));
      this.incomeNetForm.controls.description.setValue((data.description) ? data.description : '');
      this.incomeNetForm.controls.continousTillYear.setValue((data.numberOfYear) ? data.numberOfYear : '');
      this.incomeNetForm.controls.bankAcNo.setValue((data.userBankMappingId) ? data.userBankMappingId : '');
      if(data.basicIncome || data.deamessAlowance){
        this.basicSalary.removeAt(0);
      }
      if (data.basicIncome) {
        this.addSalary('1', data.basicIncome);
        this.basicSalaryArr[0].disabled = true;
      }
       if(data.deamessAlowance) {
        this.addSalary('2', data.deamessAlowance);
        this.basicSalaryArr[1].disabled = true;
      }
      if (Object.keys(data.monthlyIncomeOptionList).length > 0) {
        let id = data.monthlyIncomeOptionList.id;
        if(data.monthlyIncomeOptionList.interestIncome || data.monthlyIncomeOptionList.dividendIncome || data.monthlyIncomeOptionList.royaltyIncome || data.monthlyIncomeOptionList.annuityIncome || data.monthlyIncomeOptionList.pension ||data.monthlyIncomeOptionList.incomeFromNonProfessional || data.monthlyIncomeOptionList.incomeFromPartTimeJob || data.monthlyIncomeOptionList.investIncome || data.monthlyIncomeOptionList.alimony || data.monthlyIncomeOptionList.farmingOrFishingIncome || data.monthlyIncomeOptionList.winningFromLottery || data.monthlyIncomeOptionList.others){
          this.monthlyIncome.removeAt(0);
        }
        Object.entries(data.monthlyIncomeOptionList).forEach(([key, value]) => {
          let valueOfincome =key ? (key == 'interestIncome' ? '1' : key == 'dividendIncome' ? '2' : key == 'royaltyIncome' ? '3' : key == 'annuityIncome' ? '4' : key == 'pension' ? '5' : key == 'incomeFromNonProfessional' ? '6'  : key == 'incomeFromPartTimeJob' ? '7' : key == 'investIncome' ? '8' : key == 'alimony' ? '9' : key == 'farmingOrFishingIncome' ? '10' : key == 'winningFromLottery' ? '11' : key == 'others' ? '12' : '') : '';
          if (value && key != 'id') {
            this.monthlyIncArr.forEach(ele=>{
              if(valueOfincome == ele.value){
                ele.disabled = true;
              }
            })
            this.addMonthlyIncome(key, value, id);
          }
        });
      }
      if (Object.keys(data.incomePerquisites).length > 0) {
        let id = data.incomePerquisites.id;
        if(id){
          this.perquisites.removeAt(0);
        }
        Object.entries(data.incomePerquisites).forEach(([key, value]) => {
          let valueOfincome =key ? (key == 'foodCoupon' ? '1' : key == 'giftVouchers' ? '2' : key == 'driversSalary' ? '3' : key == 'otherPerquisites' ? '4' : '') : '';
          if (value && key != 'id') {
            this.perquisitesArr.forEach(ele=>{
              if(valueOfincome == ele.value){
                ele.disabled = true;
              }
            })
            this.addPerquisites(key, value, id);
          }
        });
      }
      if (Object.keys(data.incomeAllowance).length > 0) {
        let id = data.incomeAllowance.id;
        if(id){
          this.allowances.removeAt(0);
        }
        Object.entries(data.incomeAllowance).forEach(([key, value]) => {
          let valueOfincome =key ? (key == 'hraReceived' ? '1' : key == 'specialAllowance' ? '2' : key == 'specialCompensatoryAllowance' ? '3' : key == 'educationAllowance' ? '4' : key == 'transportAllowance' ? '5' : key == 'medicalAllowance' ? '6' : key == 'conveyanceAllowance' ? '7' : key == 'leaveTravelAllowance' ? '8' : key == 'uniformAllowance' ? '9' : key == 'carMaintenanceAllowance' ? '10' : key == 'residualChoicePay' ? '11' : key == 'superannuationAllowance' ? '12' : key == 'otherAllowance' ? '13' : '') : '';
          if (value && key != 'id') {
            this.allowancesArr.forEach(ele=>{
              if(valueOfincome == ele.value){
                ele.disabled = true;
              }
            })
            this.addAllowances(key, value, id);
          }
        });
      }
      if (Object.keys(data.incomeReimbursement).length > 0) {
        let id = data.incomeReimbursement.id;
        if(id){
          this.reimbursements.removeAt(0);
        }
        Object.entries(data.incomeReimbursement).forEach(([key, value]) => {
          let valueOfincome =key ? (key == 'mobileOrTelephone' ? '1' : key == 'carCharges' ? '2' : key == 'fuelAndMaintenance' ? '3' : key == 'entertainmentExpense' ? '4' : key == 'otherReimbursement' ? '5' : '') : '';
          if (value && key != 'id') {
            this.reimbursementsArr.forEach(ele=>{
              if(valueOfincome == ele.value){
                ele.disabled = true;
              }
            })
            this.addReimbursements(key, value, id);
          }
        });
      }
      if (Object.keys(data.incomeRetirals).length > 0) {
        let id = data.incomeRetirals.id;
        if(id){
          this.retirals.removeAt(0);
        }
        Object.entries(data.incomeRetirals).forEach(([key, value]) => {
          let valueOfincome =key ? (key == 'gratuity' ? '1' : key == 'superannuation' ? '2' : key == 'nps' ? '3' : key == 'pf' ? '4' : '') : ''
          if (value && key != 'id') {
            this.retiralsArr.forEach(ele=>{
              if(valueOfincome == ele.value){
                ele.disabled = true;
              }
            })
            this.addRetirals(key, value, id);
          }
        });
      }
      if (Object.keys(data.incomeOthers).length > 0) {
        let id = data.incomeOthers.id;
        if(id){
          this.others.removeAt(0);
        }
        Object.entries(data.incomeOthers).forEach(([key, value]) => {
          let valueOfincome =key ? (key == 'bonus' ? '1' : key == 'performancePay' ? '2' : '') : '';
          if (value && key != 'id') {
            this.othersArr.forEach(ele=>{
              if(valueOfincome == ele.value){
                ele.disabled = true;
              }
            })
            this.addOthers(key, value, id);
          }
        });
      }
      this.expectedBonusForm = this.fb.group({
        bonusList: new FormArray([])
      })
      if (data.bonusOrInflowList.length > 0) {
        data.bonusOrInflowList.forEach(element => {
          this.getBonusList.push(this.fb.group({
            id: [element.id],
            bonusOrInflow: [element.bonusOrInflow],
            receivingDate: [new Date(element.receivingYear, element.receivingMonth), [Validators.required]],
            amount: [element.amount, [Validators.required]],
          }))
        });
      } else {
        this.getBonusList.push(this.fb.group({
          id: [, [Validators.required]],
          bonusOrInflow: [, [Validators.required]],
          receivingDate: [, [Validators.required]],
          amount: [, [Validators.required]],
        }))
      }
      // if (data) {
      //   if (data.basicSalary.length > 0) {
      //     this.basicSalary.removeAt(0);
      //     data.basicSalary.forEach(element => {
      //       this.addSalary(element);
      //     });
      //   }
      // }

      // this.incomeNetForm.controls.incomeOption.setValue((data.basicIncome) ? '1' : '2');
      // (data.basicIncome) ? this.incomeOption = '1' : this.incomeOption = '2'
      if (this.incomeNetForm.get('incomeStyle').value == 1) {
        this.isStatic = true;
        this.isErractic = false;
      } else {
        this.isStatic = false;
        this.isErractic = true;
      }
    }
    this.bonusList = data.bonusOrInflows;
  }
  addSalary(value, data) {
    this.basicSalary.push(this.fb.group({
      salaryType: [value ? value : '', [Validators.required]],
      amount: [data ? data : '', [Validators.required]],
      id: [data ? data.id : '']
    }));
  }
  removeSalary(val, item) {
    this.basicSalaryArr.forEach(element => {
      if (val.value.salaryType == element.value) {
        element.disabled = false;
      }
    })
    let data = this.incomeNetForm.get('basicSalaryForm') as FormArray
    if (data.length > 1) {
      this.basicSalary.removeAt(item);
    }
  }
  addAllowances(key, value, id) {
    this.allowances.push(this.fb.group({
      allowancesType: [key ? (key == 'hraReceived' ? '1' : key == 'specialAllowance' ? '2' : key == 'specialCompensatoryAllowance' ? '3' : key == 'educationAllowance' ? '4' : key == 'transportAllowance' ? '5' : key == 'medicalAllowance' ? '6' : key == 'conveyanceAllowance' ? '7' : key == 'leaveTravelAllowance' ? '8' : key == 'uniformAllowance' ? '9' : key == 'carMaintenanceAllowance' ? '10' : key == 'residualChoicePay' ? '11' : key == 'superannuationAllowance' ? '12' : key == 'otherAllowance' ? '13' : '') : '', [Validators.required]],
      allowancesAmt: [(key == 'hraReceived' || key == 'specialAllowance' || key == 'specialCompensatoryAllowance' || key == 'educationAllowance' || key == 'transportAllowance' || key == 'medicalAllowance' || key == 'conveyanceAllowance' || key == 'leaveTravelAllowance' || key == 'uniformAllowance' || key == 'carMaintenanceAllowance' || key == 'residualChoicePay' || key == 'superannuationAllowance' || key == 'otherAllowance') ? value : '', [Validators.required]],
      id: [id]
    }));
  }
  removeAllowances(val, item) {
    this.allowancesArr.forEach(element => {
      if (val.value.allowancesType == element.value) {
        element.disabled = false;
      }
    })
    let data = this.incomeNetForm.get('allowancesForm') as FormArray
    if (data.length > 1) {
      this.allowances.removeAt(item);
    }
    // if(val.value.id){
    //   let id = val.value.id
    //   this.planService.deleteAllowanceIncome(id).subscribe(
    //     data => {
    //     }
    //   );
    //   this.allowances.removeAt(item);
    // }
  }
  addMonthlyIncome(key, value, id) {
    this.monthlyIncome.push(this.fb.group({
      monthlyIncType:  [key ? (key == 'interestIncome' ? '1' : key == 'dividendIncome' ? '2' : key == 'royaltyIncome' ? '3' : key == 'annuityIncome' ? '4' : key == 'pension' ? '5' : key == 'incomeFromNonProfessional' ? '6'  : key == 'incomeFromPartTimeJob' ? '7' : key == 'investIncome' ? '8' : key == 'alimony' ? '9' : key == 'farmingOrFishingIncome' ? '10' : key == 'winningFromLottery' ? '11' : key == 'others' ? '12' : '') : '', [Validators.required]],
      monthlyIncAmt: [(key == 'interestIncome' || key == 'dividendIncome' || key == 'royaltyIncome' || key == 'annuityIncome' || key == 'pension' || key == 'incomeFromNonProfessional' || key == 'incomeFromPartTimeJob' || key == 'investIncome' || key == 'alimony' || key == 'farmingOrFishingIncome' || key == 'winningFromLottery' || key == 'others') ? value : '', [Validators.required]],
      id: [id]
    }));
  }
  removemonthlyIncome(val, item) {
    this.monthlyIncArr.forEach(element => {
      if (val.value.monthlyIncType == element.value) {
        element.disabled = false;
      }
    })
    let data = this.incomeNetForm.get('monthlyIncomeForm') as FormArray
    if (data.length > 1) {
      this.monthlyIncome.removeAt(item);
    }
  }
  addPerquisites(key, value, id) {
    this.perquisites.push(this.fb.group({
      perquisitesType: [key ? (key == 'foodCoupon' ? '1' : key == 'giftVouchers' ? '2' : key == 'driversSalary' ? '3' : key == 'otherPerquisites' ? '4' : '') : '', [Validators.required]],
      perquisitesAmt: [(key == 'foodCoupon' || key == 'giftVouchers' || key == 'driversSalary' || key == 'otherPerquisites') ? value : '', [Validators.required]],
      id: [id]
    }));
  }
  removePerquisites(val, item) {
    this.perquisitesArr.forEach(element => {
      if (val.value.perquisitesType == element.value) {
        element.disabled = false;
      }
    })
    let data = this.incomeNetForm.get('perquisitesForm') as FormArray
    if (data.length > 1) {
      this.perquisites.removeAt(item);
    }
    // if(val.value.id){
    //   let id = val.value.id
    //   this.planService.deletePerquisitesIncome(id).subscribe(
    //     data => {
    //     }
    //   );
    //   this.perquisites.removeAt(item);
    // }

  }
  addReimbursements(key, value, id) {
    this.reimbursements.push(this.fb.group({
      reimbursementsType: [key ? (key == 'mobileOrTelephone' ? '1' : key == 'carCharges' ? '2' : key == 'fuelAndMaintenance' ? '3' : key == 'entertainmentExpense' ? '4' : key == 'otherReimbursement' ? '5' : '') : '', [Validators.required]],
      reimbursementsAmt: [(key == 'mobileOrTelephone' || key == 'carCharges' || key == 'fuelAndMaintenance' || key == 'entertainmentExpense' || key == 'otherReimbursement') ? value : '', [Validators.required]],
      id: [id]
    }));
  }
  removeReimbursements(val, item) {
    this.reimbursementsArr.forEach(element => {
      if (val.value.reimbursementsType == element.value) {
        element.disabled = false;
      }
    })
    let data = this.incomeNetForm.get('reimbursementsForm') as FormArray
    if (data.length > 1) {
      this.reimbursements.removeAt(item);
    }
    // if(val.value.id){
    //   let id = val.value.id
    //   this.planService.deleteReimbursementIncome(id).subscribe(
    //     data => {
    //     }
    //   );
    //   this.reimbursements.removeAt(item);
    // }
  }
  addRetirals(key, value, id) {
    this.retirals.push(this.fb.group({
      retiralsType: [key ? (key == 'gratuity' ? '1' : key == 'superannuation' ? '2' : key == 'nps' ? '3' : key == 'pf' ? '4' : '') : '', [Validators.required]],
      retiralsAmt: [(key == 'gratuity' || key == 'superannuation' || key == 'nps' || key == 'pf') ? value : '', [Validators.required]],
      id: [id]
    }));
  }
  removeRetirals(val, item) {
    this.retiralsArr.forEach(element => {
      if (val.value.retiralsType == element.value) {
        element.disabled = false;
      }
    })
    let data = this.incomeNetForm.get('retiralsForm') as FormArray
    if (data.length > 1) {
      this.retirals.removeAt(item);
    }
    // if(val.value.id){
    //   let id = val.value.id
    //   this.planService.deleteRetiralIncome(id).subscribe(
    //     data => {
    //     }
    //   );
    //   this.retirals.removeAt(item);
    // }
  }
  addOthers(key, value, id) {
    this.others.push(this.fb.group({
      othersType: [key ? (key == 'bonus' ? '1' : key == 'performancePay' ? '2' : '') : '', [Validators.required]],
      othersAmt: [(key == 'bonus' || key == 'performancePay') ? value : '', [Validators.required]],
      id: [id]
    }));
  }
  removeOthers(val, item) {
    this.othersArr.forEach(element => {
      if (val.value.othersType == element.value) {
        element.disabled = false;
      }
    })
    let data = this.incomeNetForm.get('othersForm') as FormArray
    if (data.length > 1) {
      this.others.removeAt(item);
    }
    // if(val.value.id){
    //   let id = val.value.id
    //   this.planService.deleteOtherIncome(id).subscribe(
    //     data => {
    //     }
    //   );
    //   this.others.removeAt(item);
    // }
  }
  openDialog(eventData): void {
    const dialogRef = this.dialog.open(LinkBankComponent, {
        width: '50%',
        data:{bankList: this.bankList, userInfo: true} 
    });

    dialogRef.afterClosed().subscribe(result => {
        setTimeout(() => {
            this.bankList = this.enumService.getBank();
        }, 5000);
    })

}
  onClickValueChange(value) {
    if (value == '1') {
      this.isStatic = true;
      this.isErractic = false
    } else {
      this.isStatic = false;
      this.isErractic = true
    }
    this.incomeNetForm.controls.incomeStyle.setValue(value)

  }
  cancel() {
    const obj =
    {
      data: this.individualIncomeData,
      stpeNo: 2,
      flag: "individualIncome"
    }
    this.previousStep.emit(obj)
  }
  showOptional() {
    (this.addMoreFlag) ? this.addMoreFlag = false : this.addMoreFlag = true;
    if (this.bonusList) {
      return;
    }
    if (!this.editApiData) {
      this.getBonusList.push(this.fb.group({
        receivingDate: [, [Validators.required]],
        amount: [, [Validators.required]],
        id: []
      }))
    }

  }
  chngIncomeOption(data) {
    this.incomeOption = data.value;
    this.addMoreFlag = false;
    this.incomeNetForm.controls.continousTill.setValue('1');
    // let value = parseInt(data.value)
    // this.singleIndividualIncome["finalIncomeList"] = { incomeTypeList: value }


    console.log(data.value)
  }
  checkDateDiff(event) {
    let incomeStartDate;
    let incomeEndDate;

    if (this.incomeNetForm.get('incomeStartDate').value !== null && this.incomeNetForm.get('incomeEndDate').value !== null) {
      incomeStartDate = new Date((this.incomeNetForm.get('incomeStartDate').value._d) ? this.incomeNetForm.get('incomeStartDate').value._d : this.incomeNetForm.get('incomeStartDate').value).getTime();
      incomeEndDate = new Date((this.incomeNetForm.get('incomeEndDate').value._d) ? this.incomeNetForm.get('incomeEndDate').value._d : this.incomeNetForm.get('incomeEndDate').value).getTime();
      (incomeStartDate == undefined && incomeEndDate == undefined) ? ''
        : (incomeEndDate <= incomeStartDate)
          ? this.showDateError = "Due date should be greater than invoice date" :
          this.showDateError = undefined;
    }
  }
  onChange(form, value, event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = '100';
      form.get(value).setValue(event.target.value);
    }
  }
  submitIncomeForm() {
    // let value = parseInt(this.incomeNetForm.get('incomeOption').value)
    // this.singleIndividualIncome["finalIncomeList"] = { incomeTypeList: value }
    // if (this.singleIndividualIncome.finalIncomeList.incomeTypeId == 1) {
    //   this.inputs.find(input => !input.ngControl.valid).focus();
    //   if (this.incomeOption == '1') {
    //     if (this.incomeNetForm.get('basicIncome').invalid) {
    //       this.incomeNetForm.get('basicIncome').markAsTouched();
    //       return;
    //     }
    //     else if (this. .get('standardDeduction').invalid) {
    //       this.incomeNetForm.get('standardDeduction').markAsTouched();

    //       return;
    //     }
    //     else if (this.incomeNetForm.get('deamessAlowance').invalid) {
    //       this.incomeNetForm.get('deamessAlowance').markAsTouched();
    //       return;
    //     }
    //     else if (this.incomeNetForm.get('hraRecieved').invalid) {
    //       this.incomeNetForm.get('hraRecieved').markAsTouched();
    //       return;
    //     }
    //     else if (this.incomeNetForm.get('totalRentPaid').invalid) {
    //       this.incomeNetForm.get('totalRentPaid').markAsTouched();
    //       return;
    //     }
    //   }
    //   else {
    //     if (this.incomeNetForm.get('monthlyAmount').invalid) {
    //       this.incomeNetForm.get('monthlyAmount').markAsTouched();
    //       return;
    //     }
    //   }
    // }
    // if (this.singleIndividualIncome.finalIncomeList.incomeTypeId != 1) {

    // }
    // if (this.incomeNetForm.get('monthlyAmount').invalid) {
    //   this.incomeNetForm.get('monthlyAmount').markAsTouched();
    //   return;
    // }
    // if (this.incomeNetForm.get('incomeGrowthRate').invalid) {
    //   this.incomeNetForm.get('incomeGrowthRate').markAsTouched();
    //   return;
    // }

    // if (this.incomeNetForm.get('incomeStartDate').invalid) {
    //   this.incomeNetForm.get('incomeStartDate').markAsTouched();
    //   return;
    // }
    // if (this.incomeNetForm.get('incomeEndDate').invalid) {
    //   this.incomeNetForm.get('incomeEndDate').markAsTouched();
    //   return;
    // }
    let monthlyIncome= this.incomeNetForm.get('monthlyIncomeForm') as FormArray
    monthlyIncome.controls.forEach(element => {
      switch (element.get('monthlyIncType').value) {
        case '1':
          this.montlyIncomeObj.interestIncome = element.get('monthlyIncAmt').value
          break;
        case '2':
          this.montlyIncomeObj.dividendIncome = element.get('monthlyIncAmt').value
          break;
        case '3':
          this.montlyIncomeObj.royaltyIncome = element.get('monthlyIncAmt').value
          break;
        case '4':
          this.montlyIncomeObj.annuityIncome = element.get('monthlyIncAmt').value
          break;
          case '5':
          this.montlyIncomeObj.pension = element.get('monthlyIncAmt').value
          break;
          case '6':
          this.montlyIncomeObj.incomeFromNonProfessional = element.get('monthlyIncAmt').value
          break;
          case '7':
          this.montlyIncomeObj.incomeFromPartTimeJob = element.get('monthlyIncAmt').value
          break;
          case '8':
          this.montlyIncomeObj.investIncome = element.get('monthlyIncAmt').value
          break;
          case '9':
          this.montlyIncomeObj.alimony = element.get('monthlyIncAmt').value
          break;
          case '10':
          this.montlyIncomeObj.farmingOrFishingIncome = element.get('monthlyIncAmt').value
          break;
          case '11':
          this.montlyIncomeObj.winningFromLottery = element.get('monthlyIncAmt').value
          break;
          case '12':
          this.montlyIncomeObj.others = element.get('monthlyIncAmt').value
          break;

      }
      this.montlyIncomeObj.id = (this.montlyIncomeObj.id) ? this.montlyIncomeObj.id : element.get('id').value
    })
    let perquisites = this.incomeNetForm.get('perquisitesForm') as FormArray
    perquisites.controls.forEach(element => {
      switch (element.get('perquisitesType').value) {
        case '1':
          this.perquisitesObj.foodCoupon = element.get('perquisitesAmt').value
          break;
        case '2':
          this.perquisitesObj.giftVouchers = element.get('perquisitesAmt').value
          break;
        case '3':
          this.perquisitesObj.driversSalary = element.get('perquisitesAmt').value
          break;
        case '4':
          this.perquisitesObj.otherPerquisites = element.get('perquisitesAmt').value
          break;
      }
      this.perquisitesObj.incomeId = (this.perquisitesObj.incomeId) ? this.perquisitesObj.incomeId : element.get('id').value
      this.perquisitesObj.id = (this.perquisitesObj.id) ? this.perquisitesObj.id : element.get('id').value
    })
    let allowances = this.incomeNetForm.get('allowancesForm') as FormArray
    allowances.controls.forEach(element => {
      switch (element.get('allowancesType').value) {
        case '1':
          this.allowancesObj.hraReceived = element.get('allowancesAmt').value
          break;
        case '2':
          this.allowancesObj.specialAllowance = element.get('allowancesAmt').value
          break;
        case '3':
          this.allowancesObj.specialCompensatoryAllowance = element.get('allowancesAmt').value
          break;
        case '4':
          this.allowancesObj.educationAllowance = element.get('allowancesAmt').value
          break;
        case '5':
          this.allowancesObj.transportAllowance = element.get('allowancesAmt').value
          break;
        case '6':
          this.allowancesObj.medicalAllowance = element.get('allowancesAmt').value
          break;
        case '7':
          this.allowancesObj.conveyanceAllowance = element.get('allowancesAmt').value
          break;
        case '8':
          this.allowancesObj.leaveTravelAllowance = element.get('allowancesAmt').value
          break;
        case '9':
          this.allowancesObj.uniformAllowance = element.get('allowancesAmt').value
          break;
        case '10':
          this.allowancesObj.carMaintenanceAllowance = element.get('allowancesAmt').value
          break;
        case '11':
          this.allowancesObj.residualChoicePay = element.get('allowancesAmt').value
          break;
        case '12':
          this.allowancesObj.superannuationAllowance = element.get('allowancesAmt').value
          break;
        case '13':
          this.allowancesObj.otherAllowance = element.get('allowancesAmt').value
          break;
      }
      this.allowancesObj.incomeId = (this.allowancesObj.incomeId) ? this.allowancesObj.incomeId : element.get('id').value
      this.allowancesObj.id = (this.allowancesObj.id) ? this.allowancesObj.id : element.get('id').value
    })
    let reimbursements = this.incomeNetForm.get('reimbursementsForm') as FormArray
    reimbursements.controls.forEach(element => {
      switch (element.get('reimbursementsType').value) {
        case '1':
          this.reimbursementsObj.mobileOrTelephone = element.get('reimbursementsAmt').value
          break;
        case '2':
          this.reimbursementsObj.carCharges = element.get('reimbursementsAmt').value
          break;
        case '3':
          this.reimbursementsObj.fuelAndMaintenance = element.get('reimbursementsAmt').value
          break;
        case '4':
          this.reimbursementsObj.entertainmentExpense = element.get('reimbursementsAmt').value
          break;
        case '5':
          this.reimbursementsObj.otherReimbursement = element.get('reimbursementsAmt').value
          break;
      }
      this.reimbursementsObj.incomeId = (this.reimbursementsObj.incomeId) ? this.reimbursementsObj.incomeId : element.get('id').value
      this.reimbursementsObj.id = (this.reimbursementsObj.id) ? this.reimbursementsObj.id : element.get('id').value
    })
    let retirals = this.incomeNetForm.get('retiralsForm') as FormArray
    retirals.controls.forEach(element => {
      switch (element.get('retiralsType').value) {
        case '1':
          this.retiralsObj.gratuity = element.get('retiralsAmt').value
          break;
        case '2':
          this.retiralsObj.superannuation = element.get('retiralsAmt').value
          break;
        case '3':
          this.retiralsObj.nps = element.get('retiralsAmt').value
          break;
        case '4':
          this.retiralsObj.pf = element.get('retiralsAmt').value
          break;
      }
      this.retiralsObj.incomeId = (this.retiralsObj.incomeId) ? this.retiralsObj.incomeId : element.get('id').value
      this.retiralsObj.id = (this.retiralsObj.id) ? this.retiralsObj.id : element.get('id').value
    })
    let others = this.incomeNetForm.get('othersForm') as FormArray
    others.controls.forEach(element => {
      switch (element.get('othersType').value) {
        case '1':
          this.othersObj.bonus = element.get('othersAmt').value
          break;
        case '2':
          this.othersObj.performancePay = element.get('othersAmt').value
          break;
      }
      this.othersObj.incomeId = (this.othersObj.incomeId) ? this.othersObj.incomeId : element.get('id').value
      this.othersObj.id = (this.othersObj.id) ? this.othersObj.id : element.get('id').value
    })
    if (this.showDateError) {
      return
    }
    // if (this.incomeNetForm.get('incomeOption').value == '2') {
    //   this.incomeNetForm.get('basicIncome').setErrors(null);
    //   this.incomeNetForm.get('standardDeduction').setErrors(null);
    //   this.incomeNetForm.get('deamessAlowance').setErrors(null);
    //   this.incomeNetForm.get('hraRecieved').setErrors(null);
    //   this.incomeNetForm.get('totalRentPaid').setErrors(null);

    // } else {
    //   this.incomeNetForm.get('monthlyAmount').setErrors(null);
    // }
    if (this.incomeNetForm.get('incomeOption').value == '2') {
      let basicSal = this.incomeNetForm.get('basicSalaryForm') as FormArray
      basicSal.controls.forEach(element => {
        element.get('salaryType').setErrors(null);
        element.get('amount').setErrors(null);
      })
      let allowance = this.incomeNetForm.get('allowancesForm') as FormArray
      allowance.controls.forEach(element => {
        element.get('allowancesType').setErrors(null);
        element.get('allowancesAmt').setErrors(null);
      })
      let perquisites = this.incomeNetForm.get('perquisitesForm') as FormArray
      perquisites.controls.forEach(element => {
        element.get('perquisitesType').setErrors(null);
        element.get('perquisitesAmt').setErrors(null);
      })
      let reimbursements = this.incomeNetForm.get('reimbursementsForm') as FormArray
      reimbursements.controls.forEach(element => {
        element.get('reimbursementsType').setErrors(null);
        element.get('reimbursementsAmt').setErrors(null);
      })
      let retirals = this.incomeNetForm.get('retiralsForm') as FormArray
      retirals.controls.forEach(element => {
        element.get('retiralsType').setErrors(null);
        element.get('retiralsAmt').setErrors(null);
      })
      let others = this.incomeNetForm.get('othersForm') as FormArray
      others.controls.forEach(element => {
        element.get('othersType').setErrors(null);
        element.get('othersAmt').setErrors(null);
      })

    } else {
      let monthlyInc = this.incomeNetForm.get('monthlyIncomeForm') as FormArray
      monthlyInc.controls.forEach(element => {
        element.get('monthlyIncType').setErrors(null);
        element.get('monthlyIncAmt').setErrors(null);
      })
    }
    if (this.incomeNetForm.invalid) {

      this.incomeNetForm.markAllAsTouched();
    } else {


      let obj =
      {
        "clientId": this.clientId,
        "advisorId": this.advisorId,
        "familyMemberId": this.singleIndividualIncome.id,
        "ownerName": this.singleIndividualIncome.name,
        // "monthlyIncome": this.incomeNetForm.get('monthlyAmount').value,
        "incomeStartMonth": new Date(this.incomeNetForm.get('incomeStartDate').value).getMonth(),
        "incomeStartYear": new Date(this.incomeNetForm.get('incomeStartDate').value).getFullYear(),
        "incomeEndMonth": new Date(this.incomeNetForm.get('incomeEndDate').value).getMonth(),
        "incomeEndYear": new Date(this.incomeNetForm.get('incomeEndDate').value).getFullYear(),
        "incomeGrowthRateId": 50,
        "growthRate": (this.incomeNetForm.get('incomeGrowthRate').value) ? this.incomeNetForm.get('incomeGrowthRate').value : 0,
        "incomeStyleId": this.incomeNetForm.get('incomeStyle').value,
        // "incomeStyleId":20,
        "continueTill": parseInt(this.incomeNetForm.get("continousTill").value),
        "incomeTypeId": this.singleIndividualIncome.finalIncomeList.incomeTypeList,
        "numberOfYear": parseInt(this.incomeNetForm.get("continousTillYear").value) ? parseInt(this.incomeNetForm.get("continousTillYear").value) : null,
        "nextAppraisalOrNextRenewal": this.incomeNetForm.get('nextAppraisal').value ? this.incomeNetForm.get('nextAppraisal').value : null,
        "realEstateId": 20,
        "basicIncome": null,
        "deamessAlowance": null,
        "incomeOption": this.incomeNetForm.get('incomeOption').value,
        'incomeAllowance': this.allowancesObj,
        'incomePerquisites': this.perquisitesObj,
        'incomeReimbursement': this.reimbursementsObj,
        'incomeRetirals': this.retiralsObj,
        'incomeOthers': this.othersObj,
        "monthlyIncomeOptionList": this.montlyIncomeObj,
        "description": this.incomeNetForm.get('description').value,
        "monthlyDistributionList": [],
        "bonusOrInflowList": [],
        
        'linkedBankAccountNumber': this.incomeNetForm.controls.bankAcNo.value ? this.incomeNetForm.controls.bankAcNo.value : null,
        // 'userBankMappingId': this.incomeNetForm.controls.bankAcNo.value,
      }
      let array = this.incomeNetForm.get('basicSalaryForm') as FormArray
      array.controls.forEach(element => {
        let val = element.get('salaryType').value
        if (val == '1') {
          obj.basicIncome = element.get('amount').value
        } else {
          obj.deamessAlowance = element.get('amount').value
        }
      })
      if (this.getBonusList) {
        this.finalBonusList = []
        this.getBonusList.controls.forEach(element => {
          let obj =
          {
            // "id":0,
            // "bonusOrInflow":0,
            "amount": element.get('amount').value,
            "receivingMonth": new Date(element.get('receivingDate').value).getMonth(),
            "receivingYear": new Date(element.get('receivingDate').value).getFullYear(),
            "id": element.get('id').value ? element.get('id').value : null
          }
          this.finalBonusList.push(obj)
        })
      }
      obj['monthlyDistributionList'] = this.finalBonusList;
      if (obj.monthlyDistributionList.length == 0) {
        obj.monthlyDistributionList = null;
      }
      obj['bonusOrInflowList'] = obj.monthlyDistributionList;

      console.log(obj)
      if (this.editApiData) {
        obj['id'] = this.editApiData.id;
        obj['changesIn'] = 1;
        if (this.editApiData.bonusOrInflowList) {
          obj['bonusOrInflowList'] = obj.monthlyDistributionList;
          delete obj.monthlyDistributionList
        }
        this.planService.editIncomeData(obj).subscribe(
          data => this.submitIncomeFormRes(data),
          error => this.eventService.showErrorMessage(error)
        )
      }
      else {

        this.planService.addIncomeData(obj).subscribe(
          data => this.submitIncomeFormRes(data),
          error => this.eventService.showErrorMessage(error)
        )
      }
    }
  }
  submitIncomeFormRes(data) {
    this.incomePosition++;
    if (this.incomePosition < this.finalIncomeAddList.length) {
      this.singleIndividualIncome = this.finalIncomeAddList[this.incomePosition]
      this.incomeNetForm.reset();
      this.incomeNetForm.controls.incomeStyle.setValue('1')
      this.incomeNetForm.controls.incomeOption.setValue('2')
      this.getExpectedBonusForm.reset();
    }
    else {
      (this.editApiData) ? this.eventService.openSnackBar("Income is edited") : this.eventService.openSnackBar("Income is added")
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
    }
  }
  //  expected bonus array logic

  get getExpectedBonusForm() { return this.expectedBonusForm.controls };
  get getBonusList() { return this.getExpectedBonusForm.bonusList as FormArray };
  get monthlyIncome() {
    return this.incomeNetForm.get('monthlyIncomeForm') as FormArray;
  }
  get basicSalary() {
    return this.incomeNetForm.get('basicSalaryForm') as FormArray;
  }
  get allowances() {
    return this.incomeNetForm.get('allowancesForm') as FormArray;
  }
  get perquisites() {
    return this.incomeNetForm.get('perquisitesForm') as FormArray;
  }
  get reimbursements() {
    return this.incomeNetForm.get('reimbursementsForm') as FormArray;
  }
  get retirals() {
    return this.incomeNetForm.get('retiralsForm') as FormArray;
  }
  get others() {
    return this.incomeNetForm.get('othersForm') as FormArray;
  }
  addExpectedBonus() {
    this.getBonusList.push(this.fb.group({
      id: [, [Validators.required]],
      bonusOrInflow: [, [Validators.required]],
      receivingDate: [, [Validators.required]],
      amount: [, [Validators.required]],
    }))
    console.log(this.getBonusList)
  }
  removeExpectedBonus(index) {
    if (this.getBonusList.controls.length > 1) {
      if (this.getBonusList.controls[index].value.id) {
      let id = this.getBonusList.controls[index].value.id;
        this.planService.deleteBonusInflow(id).subscribe(
          data => {
          }
        );
      }
      this.expectedBonusForm.controls.bonusList.removeAt(index)

    }
  }
  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}
