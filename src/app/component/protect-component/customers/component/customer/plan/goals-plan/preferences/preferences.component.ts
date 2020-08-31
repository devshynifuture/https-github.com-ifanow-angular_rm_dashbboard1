import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { DatePipe } from '@angular/common';
import { PlanService } from '../../plan.service';
import { ValidatorType, UtilService } from 'src/app/services/util.service';
import { AppConstants } from 'src/app/services/app-constants';
import { PreferencesService } from './preferences.service';
import { Observable, Subscription } from 'rxjs';
import { Utils } from 'angular-bootstrap-md/lib/free/utils';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  providers: [PreferencesService]
})
export class PreferencesComponent implements OnInit, OnDestroy {
  displayedColumns = ['position', 'name'];
  dataSource = ELEMENT_DATA;
  displayedColumns1 = ['position', 'name'];
  dataSource1 = ELEMENT_DATA1;
  @Input() data: any;
  goalDetailsFG: FormGroup;
  assetAllocationFG: FormGroup;
  inflamationReturnsFG: FormGroup;
  validatorType = ValidatorType;
  months = AppConstants.getMonthsArr();

  goalStartYears = Array(50).fill((new Date().getFullYear())).map((v, idx) => v + idx);
  years = [];

  subscription = new Subscription();


  barButtonOptions: MatProgressButtonOptions = {
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
  obj: any;


  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private planService: PlanService,
    private preferenceService: PreferencesService
  ) { }
  selected = 0;

  ngOnInit() {
    if (this.data.singleOrMulti == 1) {
      this.years = Array((new Date(this.data.remainingData.goalStartDate).getFullYear()) - (new Date().getFullYear()) + 1).fill((new Date().getFullYear())).map((v, idx) => v + idx);
    } else {
      this.years = Array((new Date(this.data.goalEndDate).getFullYear()) - (new Date().getFullYear()) + 1).fill((new Date().getFullYear())).map((v, idx) => v + idx);
    }
    if(this.data.goalType == 1){
      this.years = Array((new Date(this.data.remainingData.goalEndDate).getFullYear()) - (new Date().getFullYear()) + 1).fill((new Date().getFullYear())).map((v, idx) => v + idx);
    }
    this.setForms();
    this.setFormListeners();
  }

  setForms() {
    const remainingData = this.data.remainingData;
    this.createKeyParamsForm(remainingData);
    this.createAssetForm(remainingData);
    this.createAssetFormInflamation(remainingData)
  }

  setFormListeners() {
    this.setKeyParamFormListeners();
    this.setAssetAllocationListeners();
    this.setInflamationReturns();
  }


  // ----------------- key params ----------------------------

  savingsSDError: boolean = false;
  savingsEDError: boolean = false;
  goalSDError: boolean = false;

  createKeyParamsForm(remainingData) {
    this.goalDetailsFG = this.fb.group({
      goalValue: [Math.round(this.preferenceService.getGoalValueForForm(this.data)), [Validators.required]],
      savingStartDateYear: [(new Date(remainingData.savingStartDate).getFullYear()), [Validators.required]],
      savingStartDateMonth: [('0' + (new Date(remainingData.savingStartDate).getMonth() + 1)).slice(-2), [Validators.required]],
      savingEndDateYear: [(new Date(remainingData.savingEndDate).getFullYear()), [Validators.required]],
      savingEndDateMonth: [('0' + (new Date(remainingData.savingEndDate).getMonth() + 1)).slice(-2), [Validators.required]],
      goalStartDateYear: [(new Date(this.data.goalStartDate).getFullYear()), [Validators.required]],
      goalStartDateMonth: [('0' + (new Date(this.data.goalStartDate).getMonth() + 1)).slice(-2), [Validators.required]],
      goalEndDateMonth:[('0' + (new Date(this.data.goalEndDate).getMonth() + 1)).slice(-2), [Validators.required]],
      goalEndDateYear:[(new Date(this.data.goalEndDate).getFullYear()), [Validators.required]],
      savingStatus: [remainingData.savingStatus, [Validators.required]],
      freezeCalculation: [remainingData.freezed],
      notes: [remainingData.notes || remainingData.goalNote],
      name: [this.data.goalName, [Validators.required]],
      archiveGoal: [],
      stepUp: [(remainingData.stepUp)?remainingData.stepUp:'', [Validators.required]]
    })

    if (!remainingData.goalEndDate && this.data.singleOrMulti == 2) {
      this.goalDetailsFG.addControl('goalEndDateYear', this.fb.control(new Date(remainingData.goalEndDate).getFullYear(), [Validators.required]));
      this.goalDetailsFG.addControl('goalEndDateMonth', this.fb.control(('0' + (new Date(remainingData.goalEndDate).getMonth() + 1)).slice(-2), [Validators.required]));
    }
  }
  setKeyParamFormListeners() {
    if (this.data.singleOrMulti == 1) {
      this.subscription.add(
        this.goalDetailsFG.controls.goalStartDateYear.valueChanges.subscribe(year => {
          this.years = Array(year + 1 - (new Date().getFullYear())).fill((new Date().getFullYear())).map((v, idx) => v + idx);
          if (!this.years.includes(this.goalDetailsFG.controls.savingStartDateYear) || !this.years.includes(this.goalDetailsFG.controls.savingEndDateYear)) {
            this.goalDetailsFG.controls.savingStartDateYear.setValue('');
            this.goalDetailsFG.controls.savingEndDateYear.setValue('');
          }
        })
      )
    }
    if(this.data.goalType ==1 || this.data.singleOrMulti == 2) {
      this.subscription.add(
        this.goalDetailsFG.controls.goalEndDateYear.valueChanges.subscribe(year => {
          this.years = Array(year + 1 - new Date().getFullYear()).fill((new Date().getFullYear())).map((v, idx) => v + idx);
          if (!this.years.includes(this.goalDetailsFG.controls.savingStartDateYear) || !this.years.includes(this.goalDetailsFG.controls.savingEndDateYear)) {
            this.goalDetailsFG.controls.savingStartDateYear.setValue('');
            this.goalDetailsFG.controls.savingEndDateYear.setValue('');
          }
        })
      )
    }
  }
  setInflamationReturns() {
      this.dataSource.forEach(element => {
        if (element.position == 'Debt asset class') {
          element.name = (this.data.remainingData.returnsAssumptions.debt_return)+"%"
        } else if (element.position == 'Equity asset class') {
          element.name = this.data.remainingData.returnsAssumptions.equity_return+"%"
        } else if (element.position == 'Debt funds') {
          element.name = this.data.remainingData.returnsAssumptions.debt_fund_returns+"%"
        } else if (element.position == 'Equity funds') {
          element.name = this.data.remainingData.returnsAssumptions.equity_fund_returns+"%"
        } else if (element.position == 'Balanced funds') {
          element.name = this.data.remainingData.returnsAssumptions.balanced_fund_returns+"%"
        } else if (element.position == 'Stocks') {
          element.name = this.data.remainingData.returnsAssumptions.stock_returns+"%"
        }
      });
      this.dataSource1.forEach(element => {
        if (element.position == 'Inflation rate') {
          element.name = this.data.remainingData.inflationRateYearly+"%"
        }
      });
  }
  validateGoalDates() {
    const gstartDate = this.goalDetailsFG.controls.goalStartDateYear.value + '-' + this.goalDetailsFG.controls.goalStartDateMonth.value + '-01';
    const sStartDate = this.goalDetailsFG.controls.savingStartDateYear.value + '-' + this.goalDetailsFG.controls.savingStartDateMonth.value + '-01';
    const sEndtDate = this.goalDetailsFG.controls.savingEndDateYear.value + '-' + this.goalDetailsFG.controls.savingEndDateMonth.value + '-01';

    if (this.data.singleOrMulti == 2) {
      const gendtDate = this.goalDetailsFG.controls.goalEndDateYear.value + '-' + this.goalDetailsFG.controls.goalEndDateMonth.value + '-01';
      // goal start date cannot be greater than end date
      if ([-1].includes(UtilService.compareDates(gstartDate, gendtDate))) {
        this.goalSDError = true;
      } else {
        this.goalSDError = false;
      }

      // savings SD cannot be greater than goal end date
      if ([-1].includes(UtilService.compareDates(sEndtDate, gendtDate))) {
        this.savingsEDError = true;
      } else {
        this.savingsEDError = false;
      }
    } else {
      // savings SD cannot be greater than goal start date
      if ([-1].includes(UtilService.compareDates(sEndtDate, gstartDate))) {
        this.savingsEDError = true;
      } else {
        this.savingsEDError = false;
      }
    }

    // savings start date cannot be greater than end date
    if ([-1].includes(UtilService.compareDates(sStartDate, sEndtDate))) {
      this.savingsSDError = true;
    } else {
      this.savingsSDError = false;
    }

    return this.goalSDError || this.savingsEDError || this.savingsSDError;
  }

  savePreference() {
    if (this.goalDetailsFG.invalid || this.validateGoalDates() || this.barButtonOptions.active) {
      this.goalDetailsFG.markAllAsTouched();
      return;
    }

    this.barButtonOptions.active = true;
    let observer: Observable<any>;
    const obj = this.preferenceService.createGoalObjForGoalTypes(this.data, this.goalDetailsFG.value);
    if (this.data.singleOrMulti == 1) {
      this.barButtonOptions.active = false;
      observer = this.planService.saveSingleGoalPreference(obj);
    } else {
      this.barButtonOptions.active = false;
      observer = this.planService.saveMultiGoalPreference(obj);
    }


    observer.subscribe(res => {
      this.eventService.openSnackBar("Preference saved", "Dismiss");
      this.close()
      this.barButtonOptions.active = false;
      this.subInjectService.setRefreshRequired();
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
    })
  }
  // ----------------- key params ----------------------------



  // ----------------- asset allocation ----------------------
  today = new Date();
  stages = Array(50).fill(0).map((v, index) => { return { name: index + ' years from today', value: index } });
  createAssetForm(remainingData) {
    this.assetAllocationFG = this.fb.group({
      advisorId: [this.data.remainingData.advisorId],
      equityAllocation: ['', [Validators.required]],
      debtAllocation: ['', [Validators.required]],
      progressiveStages: this.fb.array([this.createStage()]),
      strategicOrTactical: [1, [Validators.required]],
      staticOrProgressive: [1, [Validators.required]],
      goalId: [this.data.remainingData.id],
      goalType: [this.data.goalType],
    })
  }
  createAssetFormInflamation(remainingData) {
    this.inflamationReturnsFG = this.fb.group({
      advisorId: [this.data.remainingData.advisorId],
      name: ['', [Validators.required]],
      position: ['', [Validators.required]],
      goalId: [this.data.remainingData.id],
      goalType: [this.data.goalType],
    })
  }
  setAssetAllocationListeners() {

    if (this.assetAllocationFG.controls.strategicOrTactical.value == 2) {
      // this.assetAllocationFG.controls.equityAllocation.setValue(this.data.remainingData.bifurcation.equity_ratio);
      // this.assetAllocationFG.controls.debtAllocation.setValue(this.data.remainingData.bifurcation.debt_ratio);
      this.assetAllocationFG.controls.equityAllocation.disable();
      this.assetAllocationFG.controls.debtAllocation.disable();
      this.progressiveStageArrayControl.enable();
    } else {
      this.assetAllocationFG.controls.equityAllocation.enable();
      this.assetAllocationFG.controls.debtAllocation.enable();
      this.assetAllocationFG.controls.equityAllocation.setValue(this.data.remainingData.bifurcation.equity_ratio);
      this.assetAllocationFG.controls.debtAllocation.setValue(this.data.remainingData.bifurcation.debt_ratio);
      this.progressiveStageArrayControl.disable();
      for (let i = 1; i < this.progressiveStageArrayControl.controls.length; i++) {
        this.removeStage(i);
      }
      this.progressiveStageArrayControl.controls.forEach(control => {
        control.setValue({
          stageTime: '',
          equityAllocation: '',
          debtAllocation: ''
        });
      })
    }

    this.subscription.add(
      this.assetAllocationFG.controls.strategicOrTactical.valueChanges.subscribe(value => {
        if (value == 1) {
          // some logic here
        } else {
          // some logic here
        }
      })
    )
  }

  addStages() {
    let progressiveStage = this.assetAllocationFG.controls.progressiveStages as FormArray;
    progressiveStage.push(this.createStage());
  }

  removeStage(i) {
    let progressiveStage = this.assetAllocationFG.controls.progressiveStages as FormArray;
    progressiveStage.removeAt(i);
  }

  createStage(eq = '', db = '', timeline = '') {
    return this.fb.group({
      stageTime: [timeline, Validators.required],
      equityAllocation: [eq, Validators.required],
      debtAllocation: [db, Validators.required]
    })
  }
  saveInflamatonReturns() {
    this.obj = {}
    this.barButtonOptions.active = true;
    const remainingData = this.data.remainingData;
    this.dataSource.forEach(element => {
      if (element.position == 'Debt asset class') {
        Object.assign(this.obj, { debtAssetClassReturns: parseInt(element.name) });
      } else if (element.position == 'Equity asset class') {
        Object.assign(this.obj, { equityAssetClassReturns: parseInt(element.name) });
      } else if (element.position == 'Debt funds') {
        Object.assign(this.obj, { debtFundReturns: parseInt(element.name) });
      } else if (element.position == 'Equity funds') {
        Object.assign(this.obj, { equityFundReturns: parseInt(element.name) });
      } else if (element.position == 'Balanced funds') {
        Object.assign(this.obj, { balancedFundReturns: parseInt(element.name) });
      } else if (element.position == 'Stocks') {
        Object.assign(this.obj, { stockReturns: parseInt(element.name) });
      }
    });
    this.dataSource1.forEach(element => {
      if (element.position == 'Inflation rate') {
        Object.assign(this.obj, { inflationRate: parseInt(element.name) });
      }
    });
    Object.assign(this.obj, { goalId: this.data.remainingData.id });
    Object.assign(this.obj, { goalType: this.data.goalType });
    Object.assign(this.obj, { advisorId: this.data.remainingData.advisorId });
    console.log('Asset inflamation', this.obj)
    this.planService.saveAssetPreference(this.obj).subscribe(res => {
      this.eventService.openSnackBar("Asset allocation preference saved", "Dismiss");
      this.barButtonOptions.active = false;
      this.subInjectService.setRefreshRequired();
    }, err => {
      this.barButtonOptions.active = false;
      this.eventService.openSnackBar(err, "Dismiss");
    })
  }
  saveAssetAllocation() {
    if (this.assetAllocationFG.invalid || this.validateGoalDates() || this.barButtonOptions.active) {
      this.assetAllocationFG.markAllAsTouched();
      return
    }
    this.barButtonOptions.active = true;
    const remainingData = this.data.remainingData;
    let obj = this.assetAllocationFG.value;
    obj.equityAllocation = parseInt(obj.equityAllocation);
    obj.debtAllocation = parseInt(obj.debtAllocation);
    obj.strategicOrTactical = parseInt(obj.strategicOrTactical);
    obj.staticOrProgressive = parseInt(obj.staticOrProgressive);
    console.log(obj)
    this.planService.saveAssetPreference(obj).subscribe(res => {
      this.eventService.openSnackBar("Asset allocation preference saved", "Dismiss");
      this.barButtonOptions.active = false;
      this.subInjectService.setRefreshRequired();
    }, err => {
      this.barButtonOptions.active = false;
      this.eventService.openSnackBar(err, "Dismiss");
    })
  }

  get progressiveStageArrayControl() {
    return this.assetAllocationFG.controls.progressiveStages as FormArray;
  }

  setOtherBifurcation(mainInput, inputToChange) {
    if (mainInput.value <= 100) {
      const value = 100 - parseInt(mainInput.value);
      inputToChange.setValue(value);
    } else {
      mainInput.setValue(100);
      inputToChange.setValue(0);
    }
  }
  // ----------------- asset allocation ----------------------

  save() {
    switch (this.selected) {
      case 0:
        this.savePreference();
        break;
      case 1:
        this.saveAssetAllocation();
        break;
      case 2:
        this.saveInflamatonReturns();
        break;
      default:
        break;
    }
  }

  close() {
    // this.addMoreFlag = false;
    this.subInjectService.closeNewRightSlider({ state: 'close' });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
export interface PeriodicElement {
  name: string;
  position: string;


}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Debt asset class', name: '7%' },
  { position: 'Equity asset class', name: '17%' },
  { position: 'Debt funds', name: '12%' },
  { position: 'Equity funds', name: '10%' },
  { position: 'Balanced funds', name: '7%' },
  { position: 'Stocks', name: '7%' },
];
export interface PeriodicElement1 {
  name: string;
  position: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { position: 'Inflation rate', name: '6%' },

];
