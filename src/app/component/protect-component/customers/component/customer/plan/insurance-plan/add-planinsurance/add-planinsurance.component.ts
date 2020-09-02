import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { PlanService } from '../../plan.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { iif } from 'rxjs';
import { ConstantsService } from 'src/app/constants/constants.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { MatDialog, MatAccordion } from '@angular/material';
import { EditPercentComponent } from '../edit-percent/edit-percent.component';

@Component({
  selector: 'app-add-planinsurance',
  templateUrl: './add-planinsurance.component.html',
  styleUrls: ['./add-planinsurance.component.scss']
})
export class AddPlaninsuranceComponent implements OnInit {
  _inputData: any;
  displayedColumns: string[] = ['details', 'outstanding', 'consider', 'edit'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['details', 'amount', 'consider', 'edit'];
  dataSource1 =[];
  displayedColumns2: string[] = ['details', 'amount', 'consider', 'edit'];
  displayedColumns4: string[] = ['details','type', 'amount','consider', 'edit'];
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
  tab: any;
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
  dataSource3 =[];
  dataSource4 = [];
  blockExpansion = true;
  @ViewChild('accordion',{static:true}) Accordion: MatAccordion
  constructor(private dialog: MatDialog, private subInjectService: SubscriptionInject,
    private eventService: EventService, private fb: FormBuilder,
    private planService: PlanService, private constantService: ConstantsService, private peopleService: PeopleService) {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
  }

  @Input() set data(data) {
    this.insuranceData = data;
    console.log(data)
  }

  ngOnInit() {
    this.storeData = this.plannerNote;
    this.panelOpenState = false;
    this.getListFamilyMem()
    this.years = this.constantService.yearsMap;
    this.getdataForm(null)
    this.getAnalysis()
    this.getNeedBasedAnalysis(0,0);
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
    this.storeData=data ? data.plannerNotes : ''
  }
  saveData(data) {
    this.manualObj.plannerNotes = data;
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
  getNeedBasedAnalysis(familyId,lifeExpectancy) {
    let obj = {
      id: this.insuranceData.id,
      clientId: this.clientId,
      familyMemberId: familyId,
      lifeExpectancy: lifeExpectancy
    }
    this.loader(1);
    this.planService.getNeedBasedAnalysis(obj).subscribe(
      data => {
        this.Accordion.closeAll();
        this.plannerObj = this.setAll(this.plannerObj, 0);
        this.needAnalysis = data;
        this.inflationAdjustedRate = this.needAnalysis.inflationAdjustedRate;
        this.dependantYears =this.needAnalysis.dependantYears;
        this.dataSource = this.getDataForTable(this.needAnalysis.liabilities, 'total_loan_outstanding');
        this.dataSource1 = this.getDataForTable(this.needAnalysis.livingExpenses, 'amount');
        this.dataSource2 = this.getDataForTable(this.needAnalysis.assets, 'currentValue');
        this.dataSource3 = this.getDataForTable(this.needAnalysis.goals, 'goalFV');
        this.dataSource4 = this.getDataForTableWithPMT(this.needAnalysis.income, 'annualIncome');
        // if (this.needAnalysis.livingExpenses) {
        //   this.plannerObj.livingExpense = this.needAnalysis.livingExpenses.livingExpense
        // }
        this.plannerObj.existingLifeInsurance =  this.needAnalysis.sumAssured;
        this.plannerObj.lifeInsurancePremiums = this.needAnalysis.lifeInsurancePremiums
        this.calculateGrossAndadditional();
        console.log(data);
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        this.loader(-1);
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
  getDataForTableWithPMT(array, value){
    if (array && array.length > 0) {
      array.forEach(element => {
        element.amount = element[value]
        element[value] = this.PMT(element[value],element.inflationAdjustedIncome,this.dependantYears)
        element.currentValueDupl = element[value];
        element.selected = false;
        element.percent = 100;
      });
    } else {
      array = [];
    }

    return array;
  }
  selectFamMemId(value){
      this.familyMemberId = value.familyMemberId;
  }
  selectDependent(){
      if(this.selectedFamily && this.selectedExpectancy){
        this.getNeedBasedAnalysis(this.familyMemberId,this.selectedExpectancy) 
      }
  }
  calculateGrossAndadditional(){
   
    ///////calculate dependant needs and continuous income source based on the PMT formula////
    /////calculate dependant needs ////////////
    let totalOfPremiumAndLivingExpense = this.plannerObj.livingExpense + this.plannerObj.lifeInsurancePremiums
    this.plannerObj.dependantNeeds = this.PMT(totalOfPremiumAndLivingExpense,this.inflationAdjustedRate,this.dependantYears)
    this.plannerObj.GrossLifeinsurance = this.plannerObj.liabilities + this.plannerObj.dependantNeeds + this.plannerObj.goalsMeet
    this.plannerObj.additionalLifeIns = this.plannerObj.GrossLifeinsurance - this.plannerObj.incomeSource - this.plannerObj.existingLifeInsurance - this.plannerObj.existingAsset 
  }
  PMT(PMT,r,n){
    let PV = PMT * ( ( 1 - Math.pow( ( 1 + r ) ,  - n ) ) / r )
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
      dependantId: 0,
      lifeExpectancy: 0
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
        this.plannerNote = element.plannerNotes.replace( /(<([^>]+)>)/ig, '');
        this.manualObj = element

      } else {
        this.needBase = element
      }
    });
  }
  saveAnalysis() {
    if (this.tab == 0) {
      this.sendObj = {
        lifeInsurancePlanningId: this.needBase.lifeInsurancePlanningId,
        needTypeId: this.needBase.needTypeId,
        adviceAmount: this.needBase.adviceAmount,
        plannerNotes: this.needBase.plannerNotes
      }
    } else {
      this.sendObj = {
        lifeInsurancePlanningId: this.manualObj.lifeInsurancePlanningId,
        needTypeId: this.manualObj.needTypeId,
        adviceAmount: this.manualObj.adviceAmount,
        plannerNotes: this.manualObj.plannerNotes
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
    this.subInjectService.changeNewRightSliderState({ state: 'close', data : true  });
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
      data => data,
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
      data => data,
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
      this.subInjectService.changeNewRightSliderState({ state: 'close', data : true  });
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
