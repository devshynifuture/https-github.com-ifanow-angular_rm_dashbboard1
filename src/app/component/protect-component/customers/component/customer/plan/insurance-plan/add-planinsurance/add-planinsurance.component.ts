import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { PlanService } from '../../plan.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { iif } from 'rxjs';
import { ConstantsService } from 'src/app/constants/constants.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';

@Component({
  selector: 'app-add-planinsurance',
  templateUrl: './add-planinsurance.component.html',
  styleUrls: ['./add-planinsurance.component.scss']
})
export class AddPlaninsuranceComponent implements OnInit {
  _inputData: any;
  displayedColumns: string[] = ['position', 'details', 'outstanding'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['details', 'amount', 'consider', 'edit'];
  dataSource1 = ELEMENT_DATA1;
  displayedColumns2: string[] = ['details', 'amount', 'consider', 'edit'];
  dataSource2 = ELEMENT_DATA2;
  years;
  advisorId: any;
  clientId: any;
  isLoading: boolean;
  counter: any;
  manualForm: any;
  selectedExpectancy='';
  selectedFamily='';
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
  constructor(private subInjectService: SubscriptionInject,
    private eventService: EventService, private fb: FormBuilder,
    private planService: PlanService,private constantService: ConstantsService,private peopleService:PeopleService) {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
  }

  @Input() set data(data) {
    this.insuranceData = data;
    console.log(data)
  }

  ngOnInit() {
    this.getListFamilyMem()
    this.years = this.constantService.yearsMap;
    this.getdataForm(null)
    this.getAnalysis()
    this.getNeedBasedAnalysis();
  }

  panelOpenState;

  getdataForm(data) {
    this.manualForm = this.fb.group({
      plannerNote: [(!data) ? '' : (data.plannerNotes) + '', [Validators.required]],
      insuranceAmount: [(!data) ? '' : data.adviceAmount, [Validators.required]],
    });
  }
  getListFamilyMem() {

    const obj = {
      clientId: this.clientId
    };
    this.peopleService.getClientFamilyMemberListAsset(obj).subscribe(
      data => {
       this.familyList =data;
      }
    );
  }
  getFormControl(): any {
    return this.manualForm.controls;
  }
  getNeedBasedAnalysis(){
    let obj = {
      id: this.insuranceData.id,
      clientId: this.clientId,
      familyMemberId: this.insuranceData.familyMemberId,
      lifeExpectancy:0
    }
    this.loader(1);
    this.planService.getNeedBasedAnalysis(obj).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        this.loader(-1);
      }
    );
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
        this.getdataForm(element)
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
      this.subInjectService.changeNewRightSliderState({ state: 'close', data });
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
