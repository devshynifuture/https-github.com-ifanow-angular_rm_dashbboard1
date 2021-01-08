import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { PlanService } from '../../plan.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { iif, Observable } from 'rxjs';
import { ConstantsService } from 'src/app/constants/constants.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { MatDialog, MatAccordion } from '@angular/material';
import { EditPercentComponent } from '../edit-percent/edit-percent.component';
import { arrayMax } from 'highcharts';
import { startWith, map } from 'rxjs/operators';
import { ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-planinsurance',
  templateUrl: './add-planinsurance.component.html',
  styleUrls: ['./add-planinsurance.component.scss']
})
export class AddPlaninsuranceComponent implements OnInit {
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<any[]>;
  _inputData: any;
  displayedColumns: string[] = ['details', 'outstanding', 'consider', 'edit'];
  dataSource = [];
  displayedColumns1: string[] = ['details', 'amount', 'consider', 'edit'];
  dataSource1 = [];
  displayedColumns2: string[] = ['details', 'amount', 'consider', 'edit'];
  displayedColumns4: string[] = ['details', 'type', 'amount', 'consider', 'edit'];
  dataSource2 = [];
  years;
  advisorId: any;
  clientId: any;
  isLoading: boolean;
  counter: any;
  manualForm: any;
  livingExpense: any;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE & ADD TO PLAN',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,

  };
  barButtonOptions2: MatProgressButtonOptions = {
    active: false,
    text: 'REMOVE FROM PLAN',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
  };
  barButtonOptions3: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
  };
  manualObj: any;
  tab = 0;
  sendObj: any;
  needBase: any;
  id: any;
  insuranceData: any;
  familyList: any;
  needAnalysis: any;
  panelOpenState = false;
  plannerObj = {
    existingAsset: 0, liabilities: 0, lifeInsurancePremiums: 0, livingExpense: 0, dependantNeeds: 0, goalsMeet: 0, GrossLifeinsurance: 0, incomeSource: 0,
    existingLifeInsurance: 0, additionalLifeIns: 0
  }
  familyMemberId: any;
  inflationAdjustedRate: any;
  dependantYears: any;
  plannerNote: any;
  storeData: any;
  dataSource3 = [];
  dataSource4 = [];
  blockExpansion = true;
  @ViewChild('accordion', { static: true }) Accordion: MatAccordion
  plannerNotes: any;
  isLodingNeedAnalysis = true;
  dependent = false;
  isAddtoPlan = false;
  validatorType = ValidatorType;
  age: number;
  showError: boolean;
  dependantYearsSelection: any;
  retirementAgeControl = new FormControl('', [Validators.required]);
  mainDependent = new FormControl('', [Validators.required]);
  expectancy = new FormControl('', [Validators.required]);
  showErrorRetirement = false;
  showErrorExpectancy = false;
  storeDataNeed: any
  plannerNotesNeed: any;
  constructor(private dialog: MatDialog, private subInjectService: SubscriptionInject,
    private eventService: EventService, private fb: FormBuilder,
    private planService: PlanService, private constantService: ConstantsService, private peopleService: PeopleService) {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
  }

  @Input() set data(data) {
    this.insuranceData = data;
    console.log('dataaaaaaaaaaaaaaa', this.insuranceData);
    this.getHolderNames(this.insuranceData)
    console.log(data)
  }

  ngOnInit() {
    this.storeData = this.plannerNote;
    this.panelOpenState = false;
    this.getListFamilyMem()
    this.years = this.constantService.yearsMap;
    this.getdataForm(null)
    this.getAnalysis()
    if (this.insuranceData && this.insuranceData.needAnalysisSaved && this.insuranceData.hasOwnProperty('needAnalysisSaved')) {
      this.isLodingNeedAnalysis = false
    } else {
      this.getNeedBasedAnalysis(0, 0, 0);
    }
    //  this.getNeedBasedAnalysis(0,0,0);

    // if(!this.insuranceData.needAnalysisSaved){
    //   this.getNeedBasedAnalysis(0,0,0);
    // }else{
    //   this.isLodingNeedAnalysis = false;
    // }
    this.filteredOptions = this.expectancy.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value) {
    const filterValue = String(value).toLowerCase();
    return this.years.filter(option => option.value.toLowerCase().indexOf(filterValue) === 0);
  }
  // getErrorMessage() {
  //   if (this.retirementAgeControl.hasError('required')) {
  //     return 'This field is required';
  //   }

  // }
  getHolderNames(obj) {
    if (obj.owners && obj.owners.length > 0) {
      obj.displayHolderName = obj.owners[0].holderName;
      this.familyMemberId = obj.owners[0].ownerId
      if (obj.owners.length > 1) {
        for (let i = 1; i < obj.owners.length; i++) {
          if (obj.owners[i].holderName) {
            const firstName = (obj.owners[i].holderName as string).split(' ')[0];
            obj.displayHolderName += ', ' + firstName;

          }
        }
      }
    } else {
      obj.displayHolderName = '';
    }
  }
  getNeedAnalysisData(data) {
    // if(data.insuranceDetails && data.insuranceDetails.hasOwnProperty('needAnalysis')){
    //   let dependent = data.insuranceDetails.needAnalysis
    //   this.retirementAgeControl.setValue(dependent.retirementAge ? dependent.retirementAge : '');
    //   this.expectancy.setValue(dependent.lifeExpectency ? dependent.lifeExpectency : '');
    //   this.familyList.forEach(element => {
    //     if(element.familyMemberId != 0 && element.familyMemberId == dependent.mainDependentId){
    //       this.mainDependent.setValue(element.name);
    //     }
    //   });

    // }
    if (data.needAnalysisSaved) {
      const needSavedData = JSON.parse(JSON.stringify(data.needAnalysisSaved));
      this.dependent = true;
      this.expectancy.setValue(needSavedData[2.1][0].life_expectency ? needSavedData[2.1][0].life_expectency : '');

      // this.expectancy.value = needSavedData[2.1][0].life_expectency;
      this.filteredOptions = this.expectancy.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
      this.familyMemberId = needSavedData[2.1][0].main_dependent_id;
      this.dependantYears = this.getDependantYears();
      this.inflationAdjustedRate = needSavedData['dependent'][4].inflationAdjustedRate;
      this.retirementAgeControl.setValue(needSavedData[2.1][0].retirement_age ? needSavedData[2.1][0].retirement_age : '');
      this.expectancy.setValue(needSavedData[2.1][0].life_expectency ? needSavedData[2.1][0].life_expectency : '');
      this.familyList.forEach(element => {
        if (element.familyMemberId == needSavedData[2.1][0].main_dependent_id) {
          this.mainDependent.setValue(element.name);
        }
      });
      this.dataSource = this.getFilterData(needSavedData[1], 'liabilities', 'name', 'total_loan_outstanding');
      this.plannerObj.lifeInsurancePremiums = needSavedData[2.1][0].amount;
      this.dataSource1 = this.getFilterData(needSavedData[2.2], 'dependantNeeds', 'name', 'amount');
      this.plannerObj.livingExpense = 0;
      this.dataSource1.forEach(element => {
        if (element.selected) {
          this.plannerObj.livingExpense += (element.amount * element.percent) / 100;
        }
      });
      this.dataSource3 = this.getFilterData(needSavedData[3], 'goalsMeet', 'goalName', 'goalFV')
      this.plannerObj.GrossLifeinsurance = needSavedData[4][0].total_amount;
      this.dataSource4 = this.getFilterData(needSavedData[5], 'incomeSource', 'name', 'amount')
      this.plannerObj.existingLifeInsurance = needSavedData[6][0].total_amount;
      this.dataSource2 = this.getFilterData(needSavedData[7], 'existingAsset', 'ownerName', 'currentValue')
      this.plannerObj.additionalLifeIns = needSavedData[8] ? needSavedData[8][0].total_amount : 0;
      this.calculateGrossAndadditional();
    } else {
      if (!this.mainDependent.value && !this.retirementAgeControl.value && !this.expectancy.value) {
        if (this.familyList.length > 0) {
          this.eventService.openSnackBar('Please select main dependent', 'Dismiss')
        }
      }
      this.plannerObj = this.setAll(this.plannerObj, 0);
    }
  }
  getFilterData(data, totalAmount, name, amount) {
    if (data) {
      data.forEach(element => {
        element[name] = element.name;
        element[amount] = element.amount;
        element.percent = element.percentage;
        element.selected = element.is_selected ? true : false;
      });
      data = data.filter(item => item[amount] > 0)
      this.plannerObj[totalAmount] = data[0].total_amount
    } else {
      data = [];
    }

    return data;
  }
  formatNumber(data, noOfPlaces: number = 0) {
    if (data) {
      data = parseFloat(data)
      if (isNaN(data)) {
        return data;
      } else {
        // console.log(' original ', data);
        const formattedValue = parseFloat((data).toFixed(noOfPlaces)).toLocaleString('en-IN', { 'minimumFractionDigits': noOfPlaces, 'maximumFractionDigits': noOfPlaces });
        // console.log(' original / roundedValue ', data, ' / ', formattedValue);
        return formattedValue;
      }
    } else {
      return '0';
    }
    return data;
  }
  getdataForm(data) {
    this.manualForm = this.fb.group({
      // plannerNote: [(!data) ? '' : (data.plannerNotes) + '', [Validators.required]],
      insuranceAmount: [(!data) ? '' : data.adviceAmount, [Validators.required]],
    });
    this.storeData = data ? data.plannerNotes : '';

    // this.storeDataNeed = this.insuranceData.needAnalysisSaved ? (data ? data.plannerNotes : '') : '';

  }
  saveData(data) {
    this.plannerNotes = data;

  }
  saveDataNeed(data) {
    this.plannerNotesNeed = data;
  }
  getListFamilyMem() {

    const obj = {
      clientId: this.clientId
    };
    this.peopleService.getClientFamilyMemberListAsset(obj).subscribe(
      data => {
        this.familyList = data;
        let familyMemberId = this.insuranceData.owners[0].ownerId
        this.familyList = this.familyList.filter(item => item.familyMemberId != familyMemberId)
        this.getNeedAnalysisData(this.insuranceData);
      }
    );
  }

  getFormControl(): any {
    return this.manualForm.controls;
  }
  getNeedBasedAnalysis(familyId, lifeExpectancy, retirementAge) {
    let obj = {
      id: this.insuranceData.id,
      clientId: this.clientId,
      familyMemberId: familyId,
      lifeExpectancy: lifeExpectancy,
      retirementAge: retirementAge
    }
    this.loader(1);
    this.isLodingNeedAnalysis = true;
    this.planService.getNeedBasedAnalysis(obj).subscribe(
      data => {
        this.isLodingNeedAnalysis = false;
        if (this.Accordion) {
          this.Accordion.closeAll();
        }
        this.plannerObj = this.setAll(this.plannerObj, 0);
        this.needAnalysis = data;
        this.inflationAdjustedRate = this.needAnalysis.inflationAdjustedRate;
        if (!this.dependantYearsSelection) {
          this.dependantYears = this.needAnalysis.dependantYears;
        } else {
          this.dependantYears = this.dependantYearsSelection;
        }
        this.insuranceData.needAnalysisSaved = null;
        console.log('dependent years$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$', this.dependantYears);
        this.dataSource = this.getDataForTable(this.needAnalysis.liabilities, 'total_loan_outstanding', 'liabilities');
        this.dataSource1 = this.getDataForTable(this.needAnalysis.livingExpenses, 'amount', 'livingExpense');
        this.dataSource2 = this.getDataForTable(this.needAnalysis.assets, 'currentValue', 'existingAsset');
        this.dataSource3 = this.getDataForTable(this.needAnalysis.goals, 'goalFV', 'goalsMeet');
        this.dataSource4 = this.getDataForTableWithPMT(this.needAnalysis.income, 'annualIncome', 'incomeSource');
        // if (this.needAnalysis.livingExpenses) {
        //   this.plannerObj.livingExpense = this.needAnalysis.livingExpenses.livingExpense
        // }
        this.plannerObj.existingLifeInsurance = this.needAnalysis.sumAssured;
        this.plannerObj.lifeInsurancePremiums = this.needAnalysis.lifeInsurancePremiums
        this.calculateGrossAndadditional();
        console.log(data);
        if (!lifeExpectancy && this.mainDependent.value && this.retirementAgeControl.value && this.expectancy.value) {
          this.eventService.openSnackBar('Please select main dependent', 'Dismiss')
        }
      },
      err => {
        // this.eventService.openSnackBar('No data found', 'Dismiss');
        if (!lifeExpectancy && this.mainDependent.value && this.retirementAgeControl.value && this.expectancy.value) {
          this.eventService.openSnackBar('Please select main dependent', 'Dismiss')
        }
        this.loader(-1);
        this.isLodingNeedAnalysis = false;
      }
    );
  }
  getDependantYears() {
    let dependentYear;
    if (this.dependent && this.expectancy.value) {
      this.familyList.forEach(element => {
        if (element.familyMemberId == this.familyMemberId) {
          let dob = element.dateOfBirth;
          const bdate = new Date(dob);
          const timeDiff = Math.abs(Date.now() - bdate.getTime());
          this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
          dependentYear = parseInt(this.expectancy.value) - this.age
          let expectancy = parseInt(this.expectancy.value);
          if (expectancy < this.age) {
            this.showError = true;
          } else {
            this.showError = false;
          }
          console.log('ageeeeeeeeeeeeeeeeeeeeeeeeee', dependentYear)
        }
      });
    }
    return dependentYear;
  }
  setAll(obj, val) {
    Object.keys(obj).forEach(function (index) {
      obj[index] = val
    });
    return obj;
  }
  getDataForTable(array, value, name) {
    if (array && array.length > 0) {
      array.forEach(element => {
        element.currentValueDupl = element[value];
        element.selected = true;
        element.percent = 100;
        this.changeValue(element, element.selected, array, name)
      });
      array = array.filter(item => item[value] > 0)
    } else {
      array = [];
    }
    return array;
  }
  getDataForTableWithPMT(array, value, name) {
    if (array && array.length > 0) {
      array.forEach(element => {
        element.amount = element[value];
        element.currentValueDupl = element[value];
        if (element[value] > 0) {
          element[value] = this.PMT(element[value], element.inflationAdjustedIncome ? element.inflationAdjustedIncome : this.inflationAdjustedRate, element.dependentYears ? element.dependentYears : this.dependantYears)
        }
        element.currentValueDupl = element[value];
        element.selected = true;
        element.percent = 100;
        this.changeValue(element, element.selected, array, name)
      });
      array = array.filter(item => item[value] > 0)
    } else {
      array = [];
    }

    return array;
  }
  selectDependent(value, name) {
    this.dependent = true;
    if (name == 'familyMemberId') {
      this.familyMemberId = value || value == 0 ? value : this.familyMemberId;
    }
    this.dependantYearsSelection = this.getDependantYears();
    if (this.mainDependent.value && this.expectancy.value && this.retirementAgeControl.value > 10) {
      if (!this.showError && !this.showErrorExpectancy && !this.showErrorRetirement) {
        this.getNeedBasedAnalysis(this.familyMemberId, this.expectancy.value, this.retirementAgeControl.value)
      }
    } else {
      if (this.expectancy.invalid || this.mainDependent.invalid || this.retirementAgeControl.invalid) {
        this.expectancy.markAllAsTouched();
        this.mainDependent.markAllAsTouched();
        this.retirementAgeControl.markAllAsTouched();
      }
    }
  }
  calculateAge() {

  }
  calculateGrossAndadditional() {

    ///////calculate dependant needs and continuous income source based on the PMT formula////
    /////calculate dependant needs ////////////
    let totalOfPremiumAndLivingExpense = this.plannerObj.livingExpense + this.plannerObj.lifeInsurancePremiums
    this.plannerObj.dependantNeeds = this.PMT(totalOfPremiumAndLivingExpense, this.inflationAdjustedRate, this.dependantYears)
    this.plannerObj.GrossLifeinsurance = this.plannerObj.liabilities + this.plannerObj.dependantNeeds + this.plannerObj.goalsMeet
    this.plannerObj.additionalLifeIns = this.plannerObj.GrossLifeinsurance - this.plannerObj.incomeSource - this.plannerObj.existingLifeInsurance - this.plannerObj.existingAsset
  }
  PMT(PMT, r, n) {
    let PV = PMT * ((1 - Math.pow((1 + r), - n)) / r)
    // let PV = PMT * ( ( 1 - ( ( 1 + r ) ^  - n ) ) / r )
    return PV;
  }
  changeValue(data, value, array, storeObjName) {
    data.selected = value;
    this.plannerObj[storeObjName] = 0;
    if (this.insuranceData && this.insuranceData.hasOwnProperty('needAnalysisSaved') && this.insuranceData.needAnalysisSaved && storeObjName == 'incomeSource') {
      array.forEach(element => {
        element.currentValueDupl = this.PMT(element.amount, element.inflation_adjusted_income ? element.inflation_adjusted_income : this.inflationAdjustedRate, element.dependent_years ? element.dependent_years : this.dependantYears)
      });
    }
    array.forEach(element => {
      if (element.selected) {
        if (storeObjName == 'incomeSource') {
          this.plannerObj[storeObjName] += element.currentValueDupl ? element.currentValueDupl : (element.amount ? element.amount : element.annualIncome)
        } else {
          this.plannerObj[storeObjName] += element.currentValueDupl ? element.currentValueDupl : element.amount
        }
      }
    });
    this.calculateGrossAndadditional();
  }
  isExpansionDisabled(): string {
    if (this.blockExpansion) {
      return 'disabled-pointer';
    }
    return '';
  }
  changePercentage(data, array, storeObjName, cv) {
    const dialogData = {
      percent: data.percent
    }
    const dialogRef = this.dialog.open(EditPercentComponent, {
      width: '300px',
      data: dialogData,
      autoFocus: false,
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.plannerObj[storeObjName] = 0;
          data.currentValueDupl = (data[cv] * result) / 100;
          array.forEach(element => {
            if (element.selected) {
              this.plannerObj[storeObjName] += element.currentValueDupl
            }
          });
          data.percent = result;
          this.calculateGrossAndadditional();
        }
      });
  }
  getAnalysis() {

    let obj = {
      id: this.insuranceData.id,
    }
    this.loader(1);
    this.planService.getLifeInuranceNeedAnalysis(obj).subscribe(
      data => this.getLifeInuranceNeedAnalysisRes(data),
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        this.loader(-1);
      }
    );
  }
  getLifeInuranceNeedAnalysisRes(data) {
    console.log('getLifeInuranceNeedAnalysisRes', data)
    data.forEach(element => {
      if (element.needTypeId == 2) {
        this.getdataForm(element);
        this.plannerNote = element.plannerNotes ? element.plannerNotes.replace(/(<([^>]+)>)/ig, '') : '-';
        this.plannerNotes = element.plannerNotes ? element.plannerNotes : '';
        this.manualObj = element

      } else {
        this.needBase = element
        // this.plannerNote = element.plannerNotes ? element.plannerNotes.replace(/(<([^>]+)>)/ig, '') : '-';
        this.storeDataNeed = element.plannerNotes ? element.plannerNotes : '';
        this.plannerNotesNeed = element.plannerNotes ? element.plannerNotes : '';
      }
    });
    if (this.isAddtoPlan) {
      this.addToPlan()
    }
  }

  onChange(event, value) {
    if (value == 'retirement') {
      if (parseInt(this.retirementAgeControl.value) > parseInt(this.expectancy.value)) {
        this.showErrorRetirement = true;
      } else {
        this.showErrorRetirement = false;
      }
    } else {
      if (parseInt(this.retirementAgeControl.value) > parseInt(this.expectancy.value)) {
        this.showErrorExpectancy = true;
      } else {
        this.showErrorExpectancy = false;
      }
    }

    if (parseInt(event.target.value) > 100) {
      event.target.value = '100';
      if (value == 'retirement') {
        this.retirementAgeControl.setValue(event.target.value);
      } else {
        // if(event.target.value > this.expectancy.value){
        //   this.showErrorRetirement = true;
        // }else{
        //   this.showErrorRetirement = false;
        // }
        this.expectancy.setValue(event.target.value);
      }
    }
  }
  clearAllFeilds() {
    this.expectancy.setValue('');
    this.mainDependent.setValue('');
    this.retirementAgeControl.setValue('');
    this.plannerObj = this.setAll(this.plannerObj, 0);
    this.dataSource = [];
    this.dataSource1 = [];
    this.dataSource2 = [];
    this.dataSource3 = [];
    this.dataSource4 = [];
  }
  getNeedBasedObj() {
    let array = [];
    array = this.getFilteredObj(array, this.dataSource, '1', this.plannerObj.liabilities ? this.plannerObj.liabilities : 0, 'total_loan_outstanding', 'name')
    array.push({ "amount": this.plannerObj.lifeInsurancePremiums ? this.plannerObj.lifeInsurancePremiums : 0, "step": "2.1", "name": "Life Insurance premiums", "percentage": "100", "isSelected": 1, "totalAmount": this.plannerObj.dependantNeeds, dependentYears: 0, "inflationAdjustedIncome": 0 })
    array = this.getFilteredObj(array, this.dataSource1, '2.2', this.plannerObj.dependantNeeds ? this.plannerObj.dependantNeeds : 0, 'amount', 'name')
    array = this.getFilteredObj(array, this.dataSource3, '3', this.plannerObj.goalsMeet ? this.plannerObj.goalsMeet : 0, 'goalFV', 'goalName')
    array.push({ "amount": 0, "step": "4", "name": "Gross Life insurance Required", "percentage": "100", "isSelected": 1, "totalAmount": this.plannerObj.GrossLifeinsurance, dependentYears: 0, "inflationAdjustedIncome": 0 })
    array = this.getFilteredObj(array, this.dataSource4, '5', this.plannerObj.incomeSource ? this.plannerObj.incomeSource : 0, 'amount', 'name')
    array.push({ "amount": 0, "step": "6", "name": "Existing life insurance(sum assured)", "percentage": "100", "isSelected": 1, "totalAmount": this.plannerObj.existingLifeInsurance, dependentYears: 0, "inflationAdjustedIncome": 0 })
    array = this.getFilteredObj(array, this.dataSource2, '7', this.plannerObj.existingAsset ? this.plannerObj.existingAsset : 0, 'currentValue', 'ownerName')
    array.push({ "amount": 0, "step": "8", "name": "Additional life insurance required", "percentage": "100", "isSelected": 1, "totalAmount": this.plannerObj.additionalLifeIns, dependentYears: 0, "inflationAdjustedIncome": 0 })
    return array;
  }
  getFilteredObj(mainArray, array, step, totalAmount, amount, name) {
    array.forEach(element => {
      const obj = {
        "amount": element[amount],
        "step": step,
        "name": element[name],
        "percentage": element.percent,
        "isSelected": (element.selected) ? 1 : 0,
        "totalAmount": totalAmount,
        "dependentYears": element.dependentYears ? element.dependentYears : 0,
        "inflationAdjustedIncome": element.inflationAdjustedIncome ? element.inflationAdjustedIncome : 0
      }
      mainArray.push(obj);
    });
    return mainArray;
  }
  saveAnalysis() {
    if (this.tab == 0) {
      if (this.showError || this.showErrorRetirement || this.showErrorExpectancy || this.expectancy.invalid || this.mainDependent.invalid || this.retirementAgeControl.invalid) {
        this.expectancy.markAllAsTouched();
        this.mainDependent.markAllAsTouched();
        this.retirementAgeControl.markAllAsTouched();
      } else {
        this.barButtonOptions3.active = true;
        let needBasedAnalysis = this.getNeedBasedObj();
        this.sendObj = {
          lifeInsurancePlanningId: this.needBase ? this.needBase.lifeInsurancePlanningId : this.insuranceData.id,
          needTypeId: 1,
          id: this.needBase ? this.needBase.id : 0,
          adviceAmount: null,
          // adviceAmount: this.needBase ? this.needBase.adviceAmount : null,
          // plannerNotes: this.needBase ? (this.needBase.plannerNotes ? this.needBase.plannerNotes : this.plannerNotesNeed) : this.plannerNotesNeed,
          plannerNotes: this.plannerNotesNeed,
          needBasedObject: needBasedAnalysis,
          mainDependentId: this.familyMemberId,
          lifeExpectency: this.expectancy.value,
          retirementAge: this.retirementAgeControl.value,
          isClient: (parseInt(this.familyMemberId) == this.clientId) ? true : false

        }
        this.planService.saveLifeInsuranceAnalysis(this.sendObj).subscribe(
          data => this.saveLifeInsuranceAnalysisRes(data),
          err => {
            this.barButtonOptions3.active = false;
            this.eventService.openSnackBar(err, 'Dismiss');
          }
        );
      }
    } else {
      if (this.manualForm.invalid) {
        this.manualForm.markAllAsTouched();
      } else {
        this.barButtonOptions3.active = true;
        this.sendObj = {
          lifeInsurancePlanningId: this.manualObj ? this.manualObj.lifeInsurancePlanningId : this.insuranceData.id.manualObj ? this.manualObj.lifeInsurancePlanningId : this.insuranceData.id,
          needTypeId: 2,
          adviceAmount: this.manualForm.get('insuranceAmount').value ? this.manualForm.get('insuranceAmount').value : 0,
          // plannerNotes: this.manualObj ? (this.manualObj.plannerNotes ? this.manualObj.plannerNotes : this.plannerNotes) : this.plannerNotes,
          plannerNotes: this.plannerNotes,
        }
        this.planService.saveLifeInsuranceAnalysis(this.sendObj).subscribe(
          data => this.saveLifeInsuranceAnalysisRes(data),
          err => {
            this.barButtonOptions3.active = false;
            this.eventService.openSnackBar(err, 'Dismiss');
          }
        );
      }
    }
  }
  saveLifeInsuranceAnalysisRes(data) {
    this.barButtonOptions3.active = false;
    // this.close();
    this.subInjectService.changeNewRightSliderState({ state: 'close', data: true });
    console.log('saveLifeInsuranceAnalysisRes', data)
  }
  tabChanged(event) {
    console.log('tabChanged', event)
    this.tab = event.index
    if (this.tab == 1 && this.manualObj && this.manualObj.isMapped == 1) {
      this.barButtonOptions3.disabled = true;
    } else {
      this.barButtonOptions3.disabled = false;
    }
  }
  addToPlan() {
    if (this.tab == 1) {
      this.id = this.manualObj.id
    } else {
      this.id = this.needBase.id
    }
    this.loader(1);
    this.planService.addLifeInsuranceAnalysisMapToPlan(this.id).subscribe(
      data => {
        console.log(data);
        this.subInjectService.changeNewRightSliderState({ state: 'close', data: true });

      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        this.loader(-1);
      }
    );
  }
  saveAndAddToPlan() {
    this.isAddtoPlan = true;
    if (this.manualForm.invalid) {
      this.manualForm.markAllAsTouched();
    } else {
      this.barButtonOptions.active = true;
      this.sendObj = {
        lifeInsurancePlanningId: this.manualObj ? this.manualObj.lifeInsurancePlanningId : this.insuranceData.id.manualObj ? this.manualObj.lifeInsurancePlanningId : this.insuranceData.id,
        needTypeId: 2,
        adviceAmount: this.manualForm.get('insuranceAmount').value ? this.manualForm.get('insuranceAmount').value : 0,
        plannerNotes: this.manualObj ? (this.manualObj.plannerNotes ? this.manualObj.plannerNotes : this.plannerNotes) : this.plannerNotes,
      }
      this.planService.saveLifeInsuranceAnalysis(this.sendObj).subscribe(
        data => {
          this.barButtonOptions.active = false;
          this.getAnalysis();
        },
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
        }
      );
    }

  }
  removeToPlan() {

    if (this.tab == 1) {
      this.id = this.manualObj.id
    } else {
      this.id = this.needBase.id
    }
    this.loader(1);
    this.planService.removeLifeInsuranceAnalysisMapToPlan(this.id).subscribe(
      data => {
        console.log(data);
        this.subInjectService.changeNewRightSliderState({ state: 'close', data: true });
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        this.loader(-1);
      }
    );
  }
  loader(increamenter) {
    this.counter += increamenter;
    if (this.counter == 0) {
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }
  }
  close() {
    if (this._inputData) {
      let data = this._inputData
      this.subInjectService.changeNewRightSliderState({ state: 'close', data: true });
    }
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}


export interface PeriodicElement {
  position: string;
  details: string;
  outstanding: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: '', details: 'Home loan | ICICI bank', outstanding: '12,00,000' },

];


export interface PeriodicElement1 {
  details: string;
  amount: string;
  consider: string;
  edit: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { details: 'Food & groceries', amount: '3,60,000', consider: '100%', edit: '' },
  { details: 'Entertainment', amount: '2,70,000', consider: '50%', edit: '' },
  { details: 'Commuting', amount: '3,00,000', consider: '0', edit: '' },

];

export interface PeriodicElement2 {
  details: string;
  amount: string;
  consider: string;
  edit: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { details: 'shreya higher education', amount: '25,00,000', consider: '100%', edit: '' },
  { details: 'shreya marriage ', amount: '12,00,000', consider: '50%', edit: '' },
  { details: 'Legacy planning (Retirment)', amount: '36,00,000', consider: '0', edit: '' },

];
