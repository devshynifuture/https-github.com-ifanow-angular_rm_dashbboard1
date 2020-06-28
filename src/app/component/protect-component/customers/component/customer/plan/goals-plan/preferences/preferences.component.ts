import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { DatePipe } from '@angular/common';
import { PlanService } from '../../plan.service';
import { ValidatorType } from 'src/app/services/util.service';
import { AppConstants } from 'src/app/services/app-constants';
import { PreferencesService } from './preferences.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  providers: [PreferencesService]
})
export class PreferencesComponent implements OnInit {
  displayedColumns = ['position', 'name'];
  dataSource = ELEMENT_DATA;
  displayedColumns1 = ['position', 'name'];
  dataSource1 = ELEMENT_DATA1;
  @Input() data:any;
  goalDetailsFG:FormGroup;
  assetAllocationFG:FormGroup;
  validatorType = ValidatorType;
  months = AppConstants.getMonthsArr();
  years = Array(50).fill((new Date().getFullYear())).map((v, idx) => v + idx);


  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService, 
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private planService: PlanService,
    private preferenceService: PreferencesService
  ) { }
  selected;

  ngOnInit() {
    this.selected = 0;
    this.setForms();
  }

  setForms(){
    const remainingData = this.data.remainingData;
    this.goalDetailsFG = this.fb.group({
      goalValue: [Math.round(remainingData.futureValue), [Validators.required]],
      savingStartDateYear: [new Date(remainingData.savingStartDate).getFullYear(), [Validators.required]],
      savingStartDateMonth: [('0' + (new Date(remainingData.savingStartDate).getMonth() + 1)).slice(-2), [Validators.required]],
      savingEndDateYear: [new Date(remainingData.savingEndDate).getFullYear(), [Validators.required]],
      savingEndDateMonth: [('0' + (new Date(remainingData.savingEndDate).getMonth() + 1)).slice(-2), [Validators.required]],
      goalStartDateYear: [new Date(remainingData.goalStartDate).getFullYear(), [Validators.required]],
      goalStartDateMonth: [('0' + (new Date(remainingData.goalStartDate).getMonth() + 1)).slice(-2), [Validators.required]],
      savingStatus: [remainingData.savingType, [Validators.required]],
      stepUp: [remainingData.stepUp, [Validators.required]],
      freezeCalculation: [remainingData.freezed],
      notes: [remainingData.notes],
      name: [this.data.goalName, [Validators.required]],
      archiveGoal: [],
    })

    if(this.data.singleOrMulti == 2) {
      this.goalDetailsFG.addControl('goalEndDateYear',this.fb.control(new Date(remainingData.goalEndDate).getFullYear(), [Validators.required]));
      this.goalDetailsFG.addControl('goalEndDateMonth',this.fb.control(('0' + (new Date(remainingData.goalEndDate).getMonth() + 1)).slice(-2), [Validators.required]));
    }

    this.assetAllocationFG = this.fb.group({
      advisorId: [this.data.remainingData.advisorId],
      equityAllocation: ['', [Validators.required]],
      debtAllocation: ['', [Validators.required]],
      straticOrTactical: [this.data.remainingData.strategicOrTactical, [Validators.required]],
      staticOrProgressive: [this.data.remainingData.staticOrProgressive, [Validators.required]],
      goalId: [this.data.remainingData.id],
      goalType: [this.data.goalType],
    })
  }


  // ----------------- key params ----------------------------
  savePreference(){
    if(this.goalDetailsFG.invalid) {
      this.goalDetailsFG.markAllAsTouched();
      return;
    }

    let observer:Observable<any>;
    const obj = this.preferenceService.createGoalObjForGoalTypes(this.data, this.goalDetailsFG.value);
    if(this.data.singleOrMulti == 1) {
      observer = this.planService.saveSingleGoalPreference(obj);
    } else {
      observer = this.planService.saveMultiGoalPreference(obj);
    }


    observer.subscribe(res => {
      this.eventService.openSnackBar("Preference saved", "Dismiss");
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
    })
  }
  // ----------------- key params ----------------------------

  // ----------------- asset allocation ----------------------
  saveAssetAllocation(){
    if(this.assetAllocationFG.invalid) {
      this.assetAllocationFG.markAllAsTouched();
      return
    }
    const remainingData = this.data.remainingData;
    let obj = this.assetAllocationFG.value;
    console.log(obj)
    this.planService.saveAssetPreference(obj).subscribe(res => {
      this.eventService.openSnackBar("Asset allocation preference saved", "Dismiss");
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
    })
  }
  // ----------------- asset allocation ----------------------

  save(){
    switch (this.selected) {
      case 0:
        this.savePreference();
        break;
      case 1:
        this.saveAssetAllocation();
        break;
      default:
        break;
    }
  }

  close() {
    // this.addMoreFlag = false;
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
export interface PeriodicElement {
  name: string;
  position: string;

 
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 'Debt asset class', name: '7%'},
  {position: 'Equity asset class', name: '17%'},
  {position: 'Debt funds', name: '12%'},
  {position: 'Equity funds', name: '10%'},
  {position: 'Balanced funds', name: '7%'},
  {position: 'Stocks', name: '7%'},
 
];
export interface PeriodicElement1 {
  name: string;
  position: string;
 
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {position: 'Inflation rate', name: '6%'},
 
];