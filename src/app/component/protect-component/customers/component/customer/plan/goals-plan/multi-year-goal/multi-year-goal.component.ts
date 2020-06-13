import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { PlanService } from '../../plan.service';
import { debounceTime } from 'rxjs/operators';
import { Options } from 'ng5-slider';
import { DatePipe } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';
import { AppConstants } from 'src/app/services/app-constants';

@Component({
  selector: 'app-multi-year-goal',
  templateUrl: './multi-year-goal.component.html',
  styleUrls: ['./multi-year-goal.component.scss'],
  providers: [DatePipe]
})
export class MultiYearGoalComponent implements OnInit {
  Questions: any;
  familyData: any;
  multiYearGoalForm: FormGroup;
  currentYear: number = new Date().getFullYear();
  field2SliderData: any;
  field2MinData: any;
  clientId = AuthService.getClientId();
  advisorId = AuthService.getAdvisorId();
  field3SliderData: any;
  planForFamily:boolean = false;
  imageData: any;
  logoImg: any;
  giveDetailedPlan: boolean = false;
  startRange: number = 0;
  detailedPlanning:boolean = false;
  rangeFieldOptions:Options = {
    ceil: 60,
    floor: 2,
    step: 1
  }
  constructor(
    private eventService: EventService, 
    private fb: FormBuilder, 
    private planService: PlanService, 
    private datePipe: DatePipe,
    private utilService: UtilService,
  ) { }

  @Input() goalTypeData:any = {};
  @Input() familyList:any = {};
  @Input() statisticalData:any = {};
  @Output() output = new EventEmitter<any>();
  minAgeYear = 0;
  maxAgeYear = 100;
  

  @Output() backToaddGoal = new EventEmitter();
  ngOnInit() {
    this.Questions = this.goalTypeData.questions;
    this.planForFamily = !!this.goalTypeData.questions.Q; // Plan for family question present or not
    this.initializeForm();
    this.setDefaultOwner();
    this.listenToYearRange();
  }
  
  selectOwnerAndUpdateForm(value) {
    this.setMinMaxAgeOrYear(value);
    this.multiYearGoalForm.controls.field2.setValidators([Validators.required])
    this.multiYearGoalForm.controls.field2.setValue([this.minAgeYear + this.goalTypeData.defaults.gap, this.minAgeYear + this.goalTypeData.defaults.gap*2]);
    this.multiYearGoalForm.updateValueAndValidity();
  }
  
  get detailedSpendingFormArray(){
    let arr = this.multiYearGoalForm.get('detailedSpendings') as FormArray
    return arr.controls
  }

  // TODO:- recheck about the input params to be sent
  createGoalObj() {
    let obj = {
      "clientId": this.clientId,
      "advisorId": this.advisorId,
      "goalName": this.multiYearGoalForm.get('field4').value,
      "notes": this.multiYearGoalForm.get('field5').value,
      "imageUrl": this.logoImg,
      "goalType": this.goalTypeData.id,
      "planningFor": this.multiYearGoalForm.get('field1').value.id,
      "goalAdditionDate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      "frequency": (this.multiYearGoalForm.get('field2').value[1] - this.multiYearGoalForm.get('field2').value[0])
    }
    
    const date = new Date();
    const monthAndDayString = '-' + (date.getMonth() + 1) + '-' + date.getDate();

    switch(this.goalTypeData.id) {
      case AppConstants.VACATION_GOAL:
        obj['planningforGroupHead'] = 1;
        obj['vacationStartYr'] = this.multiYearGoalForm.get('field2').value[0] + monthAndDayString;
        obj['vacationEndYr'] = this.multiYearGoalForm.get('field2').value[1] + monthAndDayString;
          if(this.detailedSpendingFormArray.length > 1) {
            let multiObj = [];
            let startYear = this.multiYearGoalForm.get('field2').value[0];
            for(let i = 0; i < this.detailedSpendingFormArray.length; i++) {
              let spendingsObj = {};
              let objId = startYear + monthAndDayString;
              spendingsObj[objId] = this.detailedSpendingFormArray[i].value;
              multiObj.push(spendingsObj);
              startYear ++;
            }
            obj['goalYrsAndFutureValue'] = multiObj;
          } else {
            obj['presentValue'] = this.detailedSpendingFormArray[0].value;
          }
        break;

      case AppConstants.EDUCATION_GOAL:
        obj['planningforGroupHead'] = this.multiYearGoalForm.get('field1').value.relationshipId === 0 ? 1 : 0;
        obj['ageAttheStartofTheCourse'] = this.multiYearGoalForm.get('field2').value[0];
        obj['ageAtTheEndofTheCourse'] = this.multiYearGoalForm.get('field2').value[1];
        obj['presentValue'] = this.detailedSpendingFormArray[0].value;
        break;
    }

    return obj;
  }

  sendDataObj(obj){
    this.planService.addMultiYearGoal(obj).subscribe(
      data => {
        this.eventService.changeUpperSliderState({state: 'close'});
        switch (this.goalTypeData.id) {
          case 5:
            this.eventService.openSnackBar("Vacation goal is added");
            break;
          case 6:
            this.eventService.openSnackBar("Education goal is added");
            break;
          default:
            break;
        }
      },
      error => this.eventService.showErrorMessage(error)
    )
  }

  saveGoal(){
    if(this.multiYearGoalForm.invalid) {
      this.multiYearGoalForm.markAllAsTouched();
    } else {
      let goalObj = this.createGoalObj();
      console.log(goalObj)
      // this.sendDataObj(goalObj);
    }
  }

  // set the validation age for the age form field 
  setMinMaxAgeOrYear(value){
    if(this.goalTypeData.validations.showAge) {
      this.minAgeYear = (this.goalTypeData.validations.minAge || (this.goalTypeData.validations.minAgeFromPresent + value.age));
      this.maxAgeYear = (this.goalTypeData.validations.maxAge || (this.goalTypeData.validations.maxAgeFromPresent + value.age));
    } else {
      this.minAgeYear = (this.goalTypeData.validations.minAgeFromPresent + this.currentYear);
      this.maxAgeYear = (this.goalTypeData.validations.maxAgeFromPresent + this.currentYear);
    }
    if(this.minAgeYear < (value.age + this.goalTypeData.validations.minAgeFromPresent)) {
      this.minAgeYear = value.age + this.goalTypeData.validations.minAgeFromPresent;
    }

    const newOptions: Options = Object.assign({}, this.rangeFieldOptions);
    newOptions.floor = this.minAgeYear;
    newOptions.ceil = this.maxAgeYear;
    this.rangeFieldOptions = newOptions;
  }

  initializeForm(){
    this.multiYearGoalForm = this.fb.group({
      field1: ['', [Validators.required]], // who the goal is for
      field2: [[0, 20], [Validators.required]], // age or time
      // cumulated or detailed spending - cumulated will have single controller in array while detailed will have many.
      detailedSpendings: this.fb.array([
        new FormControl(this.goalTypeData.defaults.cost, [Validators.required, Validators.min(this.goalTypeData.validations.minCost), Validators.max(this.goalTypeData.validations.maxCost)])
      ]),
      field4: [''], // goal name
      field5: [''],  // goal description
      logo: ['']
    });
  }

  setDefaultOwner(){
    // TODO:- Check condition for when no children found
    let owner = this.familyList.find((member) => this.goalTypeData.defaults.planningForRelative.includes(member.relationshipId));
    this.multiYearGoalForm.get('field1').setValue(owner);
    this.selectOwnerAndUpdateForm(owner);
  }

  listenToYearRange(){
    this.multiYearGoalForm.controls.field2.valueChanges.pipe(debounceTime(600)).subscribe((value)=>{
      if(this.detailedPlanning) {
        let range = value[1] - value[0];
        this.startRange = value[0];
        let difference = range - this.detailedSpendingFormArray.length;
        if (difference > 0) {
          this.addToFormArray(difference);
        } else {
          this.removeFromFormArray(Math.abs(difference))
        }
      }
    })
  }

  addToFormArray(length) {
    for(let i = 0; i < length; i++) {
      (this.multiYearGoalForm.controls.detailedSpendings as FormArray).push(new FormControl('', [Validators.required, Validators.min(this.goalTypeData.validations.minCost), Validators.max(this.goalTypeData.validations.maxCost)]))
    }
  }

  removeFromFormArray(length) {
    for(let i = 0; i < length; i++) {
      (this.multiYearGoalForm.controls.detailedSpendings as FormArray).removeAt((this.multiYearGoalForm.controls.detailedSpendings as FormArray).length - 1);
    }
  }

  // toggle between detailed planning vs same amount every year
  revisePlanning(){
    this.detailedPlanning = !this.detailedPlanning;
    if (this.detailedPlanning) {
      let range = this.multiYearGoalForm.value.field2[1] - this.multiYearGoalForm.value.field2[0];
      let difference = Math.abs(range - (this.multiYearGoalForm.controls.detailedSpendings as FormArray).length);
      this.addToFormArray(difference);
    } else {
      this.removeFromFormArray((this.multiYearGoalForm.controls.detailedSpendings as FormArray).length - 1);
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
  
  goBack() {
    this.output.emit();
  }
}
