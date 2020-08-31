import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { PlanService } from '../../plan.service';
import { AppConstants } from 'src/app/services/app-constants';
import { AppComponent } from 'src/app/app.component';
import { DatePipe } from '@angular/common';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { OrgSettingServiceService } from 'src/app/component/protect-component/AdviserComponent/setting/org-setting-service.service';

@Component({
  selector: 'app-single-goal-year',
  templateUrl: './single-goal-year.component.html',
  styleUrls: ['./single-goal-year.component.scss']
})
export class SingleGoalYearComponent implements OnInit {
  @Input() goalTypeData: any = {};
  @Input() familyList: any = {};
  @Input() statisticalData: any = {};
  @Output() output = new EventEmitter<any>();
  @Output() backToaddGoal = new EventEmitter();
  Questions: any;
  familyData: any;
  singleYearGoalForm: FormGroup;
  currentYear: number = new Date().getFullYear();
  planForFamily: boolean = false;
  imageData: any;
  logoImg: any;
  minAgeYear = 0;
  maxAgeYear = 100;
  clientId: any;
  advisorId: any;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
  };
  idWiseData: any;
  getLifeExpentancy: any;
  dateF: number;

  constructor(
    private eventService: EventService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private orgSetting: OrgSettingServiceService,
    private planService: PlanService,
  ) {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.Questions = this.goalTypeData.questions;
    this.logoImg = this.goalTypeData.imageUrl;
    this.planForFamily = !!this.goalTypeData.questions.Q; // Plan for family question present or not
    this.initializeForm();
    if (this.goalTypeData.id == 1) {
      this.getKeyParameter()
    }
    this.setDefaultOwner();
  }
  getKeyParameter() {
    let obj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getKeyAndParameters(obj).subscribe(
      data => {
        this.getKeyAndParametersRes(data)
      },
      err => {
        this.eventService.openSnackBar(err, "Dismiss")
      }
    );
  }
  getKeyAndParametersRes(data) {
    if (data) {
      this.idWiseData = data.key_Params;
      this.getLifeExpentancy = this.idWiseData.filter(element => element.configurationTypeId == 5)
      this.getLifeExpentancy = this.getLifeExpentancy[0]
    }
  }
  selectOwnerAndUpdateForm(value) {
    this.setMinMaxAgeOrYear(value);
    this.singleYearGoalForm.get('age').setValidators([Validators.required, Validators.min(this.minAgeYear), Validators.max(this.maxAgeYear)])
    this.singleYearGoalForm.get('age').setValue(this.minAgeYear + this.goalTypeData.defaults.ageIncreament);
    this.singleYearGoalForm.updateValueAndValidity();
  }

  createGoalObj() {
    const currentDate = new Date();
    let obj = {
      "clientId": this.clientId,
      "advisorId": this.advisorId,
      "goalName": this.singleYearGoalForm.get('goalName').value,
      "notes": this.singleYearGoalForm.get('goalDescription').value,
      "imageUrl": this.logoImg,
      "goalType": this.goalTypeData.id,
      "savingStartDate": this.datePipe.transform(currentDate, 'yyyy-MM-dd'),
    }

    let ageDiff = 0;
    let futureDate = new Date(currentDate);
    switch (this.goalTypeData.id) {
      case AppConstants.HOUSE_GOAL: // House
        obj['currentAge'] = this.singleYearGoalForm.get('goalMember').value.familyMemberAge;
        obj['planningThisForId'] = this.singleYearGoalForm.get('goalMember').value.id;
        obj['clientOrFamilyMember'] = (this.singleYearGoalForm.get('goalMember').value.relationshipId === 0) ? 1 : 2;
        obj['whatAgeBuyHouse'] = this.singleYearGoalForm.get('age').value;
        obj['goalPresentValue'] = this.singleYearGoalForm.get('cost').value;

        ageDiff = this.singleYearGoalForm.get('age').value - this.singleYearGoalForm.get('goalMember').value.familyMemberAge;
        futureDate = new Date(currentDate);
        futureDate.setFullYear(futureDate.getFullYear() + ageDiff);
        obj['goalStartDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        obj['goalEndDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        obj['savingEndDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        break;
      case AppConstants.RETIREMENT_GOAL: // retirement
        obj['currentAge'] = this.singleYearGoalForm.get('goalMember').value.familyMemberAge;
        obj['goalPresentValue'] = (this.singleYearGoalForm.get('cost').value * Math.abs(100 + this.singleYearGoalForm.get('costReduction').value)) / 100
        ageDiff = this.singleYearGoalForm.get('age').value - this.singleYearGoalForm.get('goalMember').value.familyMemberAge;
        futureDate = new Date(currentDate);
        const data = new Date()
        futureDate.setFullYear(futureDate.getFullYear() + ageDiff);
        const dOB = new Date(this.singleYearGoalForm.get('goalMember').value.dateOfBirth).toISOString()
        if (this.singleYearGoalForm.get('lifeExpectancy').value) {
          this.dateF = data.setFullYear(new Date(dOB).getFullYear() + this.singleYearGoalForm.get('lifeExpectancy').value)
        } else {
          this.dateF = data.setFullYear(new Date(dOB).getFullYear() + this.getLifeExpentancy.parameter)
        }
        obj['goalEndDate'] = this.datePipe.transform(this.dateF, 'yyyy-MM-dd')
        obj['goalStartDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        obj['savingEndDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        obj['monthlyExpense'] = this.singleYearGoalForm.get('cost').value;
        obj['goalAdditionDate'] = this.datePipe.transform(new Date, 'yyyy-MM-dd')
        break;
      case AppConstants.CAR_GOAL: // Car
        obj['currentAge'] = this.singleYearGoalForm.get('goalMember').value.familyMemberAge;
        obj['whatAgeBuyCar'] = this.singleYearGoalForm.get('age').value;
        obj['goalPresentValue'] = this.singleYearGoalForm.get('cost').value;

        ageDiff = this.singleYearGoalForm.get('age').value - this.singleYearGoalForm.get('goalMember').value.familyMemberAge;
        futureDate = new Date(currentDate);
        futureDate.setFullYear(futureDate.getFullYear() + ageDiff);
        obj['goalStartDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        obj['goalEndDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        obj['savingEndDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        break;

      case AppConstants.MARRIAGE_GOAL: // Marriage
        obj['currentAge'] = this.singleYearGoalForm.get('goalMember').value.familyMemberAge;
        obj['planningThisForId'] = this.singleYearGoalForm.get('goalMember').value.id;
        obj['clientOrFamilyMember'] = (this.singleYearGoalForm.get('goalMember').value.relationshipId === 0) ? 1 : 2;
        obj['marryAtAge'] = this.singleYearGoalForm.get('age').value;
        obj['goalPresentValue'] = this.singleYearGoalForm.get('cost').value;

        ageDiff = this.singleYearGoalForm.get('age').value - this.singleYearGoalForm.get('goalMember').value.familyMemberAge;
        futureDate = new Date(currentDate);
        futureDate.setFullYear(futureDate.getFullYear() + ageDiff);
        obj['goalStartDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        obj['goalEndDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        obj['savingEndDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        break;

      case AppConstants.EMERGENCY_GOAL: // Emergency
        obj['goalTargetInMonth'] = this.singleYearGoalForm.get('age').value;
        obj['goalFV'] = this.singleYearGoalForm.get('cost').value;

        futureDate = new Date(currentDate.setMonth(currentDate.getMonth() + this.singleYearGoalForm.get('age').value))
        obj['goalStartDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        obj['goalEndDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        obj['savingEndDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        break;

      case AppConstants.WEALTH_CREATION_GOAL: // Wealth Creation
        obj['currentAge'] = this.singleYearGoalForm.get('goalMember').value.familyMemberAge;
        obj['planningThisForId'] = this.singleYearGoalForm.get('goalMember').value.id;
        obj['clientOrFamilyMember'] = (this.singleYearGoalForm.get('goalMember').value.relationshipId === 0) ? 1 : 2;
        obj['goalTargetAge'] = this.singleYearGoalForm.get('age').value;
        obj['goalFV'] = this.singleYearGoalForm.get('cost').value;

        ageDiff = this.singleYearGoalForm.get('age').value - this.singleYearGoalForm.get('goalMember').value.familyMemberAge;
        futureDate = new Date(currentDate);
        futureDate.setFullYear(futureDate.getFullYear() + ageDiff);
        obj['goalStartDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        obj['goalEndDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        obj['savingEndDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        break;

      case AppConstants.BIG_SPEND_GOAL: // Big Spends
      case AppConstants.OTHERS_GOAL: // Others
        obj['goalPresentValue'] = this.singleYearGoalForm.get('cost').value;

        futureDate = new Date(currentDate.setFullYear(this.singleYearGoalForm.get('age').value));
        obj['goalStartDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        obj['goalEndDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        obj['savingEndDate'] = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
        break;
      default:
        console.error('unknown goal id found');
        break;
    }
    return obj;
  }

  sendDataObj(obj) {
    this.barButtonOptions.active = true;
    this.planService.addSingleYearGoal(obj).subscribe(
      data => {
        switch (this.goalTypeData.id) {
          case AppConstants.HOUSE_GOAL:
            this.eventService.openSnackBar("House goal is added", "Dismiss");
            break;

          case AppConstants.CAR_GOAL:
            this.eventService.openSnackBar("Car goal is added", "Dismiss");
            break;

          case AppConstants.MARRIAGE_GOAL:
            this.eventService.openSnackBar("Marriage goal is added", "Dismiss");
            break;

          case AppConstants.EMERGENCY_GOAL:
            this.eventService.openSnackBar("Emergency goal is added", "Dismiss");
            break;

          case AppConstants.WEALTH_CREATION_GOAL:
            this.eventService.openSnackBar("Wealth creation goal is added", "Dismiss");
            break;

          case AppConstants.BIG_SPEND_GOAL:
            this.eventService.openSnackBar("Big spends goal is added", "Dismiss");
            break;

          case AppConstants.OTHERS_GOAL:
            this.eventService.openSnackBar("Others goal is added", "Dismiss");
            break;

          default:
            console.error("Unidentified goal id found", this.goalTypeData.id)
            break;
        }
        this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: true, data: { resetSelectedCursor: true } });
      },
      error => {
        this.eventService.showErrorMessage(error)
        this.barButtonOptions.active = false;
      }
    );
  }

  saveGoal() {
    if (this.singleYearGoalForm.invalid || this.barButtonOptions.active) {
      this.singleYearGoalForm.markAllAsTouched();
    } else {
      let goalObj = this.createGoalObj();
      this.sendDataObj(goalObj);
    }
  }

  // set the validation age for the age form field 
  setMinMaxAgeOrYear(value) {

    if (this.goalTypeData.validations.showAge) {
      this.minAgeYear = (this.goalTypeData.validations.minAge || (this.goalTypeData.validations.minAgeFromPresent + value.familyMemberAge));
      this.maxAgeYear = (this.goalTypeData.validations.maxAge || (this.goalTypeData.validations.maxAgeFromPresent + value.familyMemberAge));
    } else {
      this.minAgeYear = (this.goalTypeData.validations.minAgeFromPresent + this.currentYear);
      this.maxAgeYear = (this.goalTypeData.validations.maxAgeFromPresent + this.currentYear);
    }
    if (value) {
      if (this.minAgeYear < (value.familyMemberAge + this.goalTypeData.validations.minAgeFromPresent)) {
        this.minAgeYear = value.familyMemberAge + this.goalTypeData.validations.minAgeFromPresent;
      }
    }

  }

  initializeForm() {
    this.singleYearGoalForm = this.fb.group({
      goalMember: ['', [Validators.required]], // who the goal is for
      age: ['', [Validators.required]], // age or time
      cost: [this.goalTypeData.defaults.cost, [Validators.required, Validators.min(this.goalTypeData.validations.minCost), Validators.max(this.goalTypeData.validations.maxCost)]], // cost
      lifeExpectancy: [70, [Validators.min(this.singleYearGoalForm.get('age').value)]],
      goalName: ['', Validators.required], // goal name
      goalDescription: [''],  // goal description
      logo: [''],
    });

    // if goal is retirement
    if (this.goalTypeData.id === 1) {
      this.singleYearGoalForm.addControl('costReduction', new FormControl(this.goalTypeData.defaults.minReduction, [Validators.required]));
      this.singleYearGoalForm.addControl('lifeExpectancy', new FormControl(70,[Validators.min(this.singleYearGoalForm.get('age').value)]));
      this.singleYearGoalForm.addControl('milestoneType1', new FormControl());
      this.singleYearGoalForm.addControl('milestoneType2', new FormControl());
      this.singleYearGoalForm.addControl('milestoneType3', new FormControl());
    }
  }


  previewGoalImage(event) {
    if (event && event.target && event.target.files) {
      const fileList = event.target.files;
      this.imageData = fileList[0];
      this.logoImg = this.imageData;
      const reader = new FileReader();
      reader.onload = e => this.logoImg = reader.result;
      reader.readAsDataURL(this.imageData);
    }
  }

  setDefaultOwner() {
    let owner = this.familyList.find((member) => this.goalTypeData.defaults.planningForRelative.includes(member.relationshipId));
    this.singleYearGoalForm.get('goalMember').setValue(owner);
    this.selectOwnerAndUpdateForm(owner);
  }

  goBack() {
    this.output.emit();
  }

  /**
   * returns the age in years given the time (date obj)
   * @param dateString long date - eg: 655516800000
   */
  getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
