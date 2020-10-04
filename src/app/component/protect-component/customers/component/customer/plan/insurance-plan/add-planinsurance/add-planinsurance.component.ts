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

@Component({
  selector: 'app-add-planinsurance',
  templateUrl: './add-planinsurance.component.html',
  styleUrls: ['./add-planinsurance.component.scss']
})
export class AddPlaninsuranceComponent implements OnInit {
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<any[]>;
  _inputData: any;
  displayedColumns: string[] = ['details', 'outstanding', 'consider', 'edit'];
  dataSource = ELEMENT_DATA;
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
  selectedExpectancy = '';
  selectedFamily = '';
  livingExpense: any;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'ADD TO PLAN',
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
    text: 'REMOVE TO PLAN',
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
  constructor(private dialog: MatDialog, private subInjectService: SubscriptionInject,
    private eventService: EventService, private fb: FormBuilder,
    private planService: PlanService, private constantService: ConstantsService, private peopleService: PeopleService) {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
  }

  @Input() set data(data) {
    this.insuranceData = data;
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
    this.getNeedBasedAnalysis(0, 0);
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value) {
    const filterValue = value.toLowerCase();

    return this.years.filter(option => option.value.toLowerCase().indexOf(filterValue) === 0);
  }
  getHolderNames(obj) {
    if (obj.owners && obj.owners.length > 0) {
      obj.displayHolderName = obj.owners[0].holderName;
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

  }
  saveData(data) {
    this.plannerNotes = data;

  }
  getListFamilyMem() {

    const obj = {
      clientId: this.clientId
    };
    this.peopleService.getClientFamilyMemberListAsset(obj).subscribe(
      data => {
        this.familyList = data;

      }
    );
  }

  getFormControl(): any {
    return this.manualForm.controls;
  }
  getNeedBasedAnalysis(familyId, lifeExpectancy) {
    let obj = {
      id: this.insuranceData.id,
      clientId: this.clientId,
      familyMemberId: familyId,
      lifeExpectancy: lifeExpectancy
    }
    this.loader(1);
    this.isLodingNeedAnalysis = true;
    this.planService.getNeedBasedAnalysis(obj).subscribe(
      data => {
        this.isLodingNeedAnalysis = false;
        this.Accordion.closeAll();
        this.plannerObj = this.setAll(this.plannerObj, 0);
        this.needAnalysis = data;
        this.inflationAdjustedRate = this.needAnalysis.inflationAdjustedRate;
        this.dependantYears = this.needAnalysis.dependantYears;
        this.dataSource = this.getDataForTable(this.needAnalysis.liabilities, 'total_loan_outstanding');
        this.dataSource1 = this.getDataForTable(this.needAnalysis.livingExpenses, 'amount');
        this.dataSource2 = this.getDataForTable(this.needAnalysis.assets, 'currentValue');
        this.dataSource3 = this.getDataForTable(this.needAnalysis.goals, 'goalFV');
        this.dataSource4 = this.getDataForTableWithPMT(this.needAnalysis.income, 'annualIncome');
        // if (this.needAnalysis.livingExpenses) {
        //   this.plannerObj.livingExpense = this.needAnalysis.livingExpenses.livingExpense
        // }
        this.plannerObj.existingLifeInsurance = this.needAnalysis.sumAssured;
        this.plannerObj.lifeInsurancePremiums = this.needAnalysis.lifeInsurancePremiums
        this.calculateGrossAndadditional();
        console.log(data);
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        this.loader(-1);
        this.isLodingNeedAnalysis = false;
      }
    );
  }
  setAll(obj, val) {
    Object.keys(obj).forEach(function (index) {
      obj[index] = val
    });
    return obj;
  }
  getDataForTable(array, value) {
    if (array && array.length > 0) {
      array.forEach(element => {
        element.currentValueDupl = element[value];
        element.selected = false;
        element.percent = 100;
      });
    } else {
      array = [];
    }

    return array;
  }
  getDataForTableWithPMT(array, value) {
    if (array && array.length > 0) {
      array.forEach(element => {
        element.amount = element[value]
        element[value] = this.PMT(element[value], element.inflationAdjustedIncome, this.dependantYears)
        element.currentValueDupl = element[value];
        element.selected = false;
        element.percent = 100;
      });
    } else {
      array = [];
    }

    return array;
  }
  selectDependent(value,name) {
    this.dependent = true;
    if(name == 'familyMemberId'){
      this.familyMemberId = value || value  == 0  ? value : this.familyMemberId;
    }
    if (this.selectedFamily && this.selectedExpectancy) {
      this.getNeedBasedAnalysis(this.familyMemberId, this.selectedExpectancy)
    }
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
    data.selected = !value;
    this.plannerObj[storeObjName] = 0;
    array.forEach(element => {

      if (element.selected) {
        this.plannerObj[storeObjName] += element.currentValueDupl
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
        this.manualObj = element

      } else {
        this.needBase = element
        this.plannerNote = element.plannerNotes ? element.plannerNotes.replace(/(<([^>]+)>)/ig, '') : '-';

      }
    });
  }
  getNeedBasedObj() {
    let array = [];
    array = this.getFilteredObj(array, this.dataSource, '1', this.plannerObj.liabilities, 'total_loan_outstanding', 'name')
    array.push({ "amount": this.plannerObj.lifeInsurancePremiums, "step": "2.1", "name": "Life Insurance premiums", "percentage": "100", "isSelected": 1, "totalAmount": this.plannerObj.dependantNeeds })
    array = this.getFilteredObj(array, this.dataSource1, '2.2', this.plannerObj.dependantNeeds, 'amount', 'name')
    array = this.getFilteredObj(array, this.dataSource3, '3', this.plannerObj.goalsMeet, 'goalFV', 'goalName')
    array.push({ "amount": 0, "step": "4", "name": "Gross Life insurance Required", "percentage": "100", "isSelected": 1, "totalAmount": this.plannerObj.GrossLifeinsurance })
    array = this.getFilteredObj(array, this.dataSource4, '5', this.plannerObj.incomeSource, 'amount', 'name')
    array.push({ "amount": 0, "step": "6", "name": "Existing life insurance(sum assured)", "percentage": "100", "isSelected": 1, "totalAmount": this.plannerObj.existingLifeInsurance })
    array = this.getFilteredObj(array, this.dataSource2, '7', this.plannerObj.existingAsset, 'currentValue', 'ownerName')
    array.push({ "amount": 0, "step": "8", "name": "Additional life insurance required", "percentage": "100", "isSelected": 1, "totalAmount": this.plannerObj.additionalLifeIns })
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
        "totalAmount": totalAmount
      }
      mainArray.push(obj);
    });
    return mainArray;
  }
  saveAnalysis() {
    let needBasedAnalysis = this.getNeedBasedObj();
    if (this.tab == 0) {
      this.sendObj = {
        lifeInsurancePlanningId: this.needBase ? this.needBase.lifeInsurancePlanningId : this.insuranceData.id,
        needTypeId: 1,
        id:this.needBase ? this.needBase.id : 0,
        adviceAmount: this.needBase ? this.needBase.adviceAmount : (this.manualForm.get('insuranceAmount').value ? this.manualForm.get('insuranceAmount').value : 0),
        plannerNotes: this.manualObj ? this.manualObj.plannerNotes : this.plannerNotes,
        needBasedObject: needBasedAnalysis
      }
    } else {
      this.sendObj = {
        lifeInsurancePlanningId: this.manualObj ? this.manualObj.lifeInsurancePlanningId : this.insuranceData.id.manualObj ? this.manualObj.lifeInsurancePlanningId : this.insuranceData.id,
        needTypeId: 2,
        adviceAmount: this.manualForm.get('insuranceAmount').value ?this.manualForm.get('insuranceAmount').value : 0,
        plannerNotes: this.manualObj ? this.manualObj.plannerNotes : this.plannerNotes,
      }
    }
    this.planService.saveLifeInsuranceAnalysis(this.sendObj).subscribe(
      data => this.saveLifeInsuranceAnalysisRes(data),
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }
  saveLifeInsuranceAnalysisRes(data) {
    // this.close();
    this.subInjectService.changeNewRightSliderState({ state: 'close', data: true });
    console.log('saveLifeInsuranceAnalysisRes', data)
  }
  tabChanged(event) {
    console.log('tabChanged', event)
    this.tab = event.index
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
