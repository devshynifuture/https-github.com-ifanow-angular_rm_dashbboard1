import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { PlanService } from '../../plan.service';
import { debounceTime } from 'rxjs/operators';
import { Options } from 'ng5-slider';
import { DatePipe } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';

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
  

  // TODO:- recheck about the input params to be sent
  createGoalObj() {
    let obj = {
      "clientId": this.clientId,
      "advisorId": this.advisorId,
      "goalName": this.multiYearGoalForm.get('field4').value,
      "notes": this.multiYearGoalForm.get('field5').value,
      "imageUrl": this.logoImg,
      "goalType": this.goalTypeData.id,
    }

    switch(this.goalTypeData.id) {
      case 5: // Vacation
        obj['planningThisForId'] = this.multiYearGoalForm.get('field1').value.id;
        // obj['planningforGroupHead'] = this.multiYearGoalForm.get('field1').value.id;
        obj['ageAttheStartofTheCourse'] = this.multiYearGoalForm.get('field2').value[0];
        obj['ageAtTheEndofTheCourse'] = this.multiYearGoalForm.get('field2').value[1];
        obj['goalAdditionDate'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        break;

      case 6: // Education
        obj['planningThisForId'] = this.multiYearGoalForm.get('field1').value.id;
        // obj['planningforGroupHead'] = this.multiYearGoalForm.get('field1').value.id;
        obj['vacationStartYr'] = this.multiYearGoalForm.get('field2').value[0];
        obj['vacationEndYr'] = this.multiYearGoalForm.get('field2').value[1];
        obj['goalAdditionDate'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        break;
      
    }
    return obj;
  }

  sendDataObj(obj){
    this.planService.addHouseGoal(obj).subscribe(
      data => {
        this.eventService.changeUpperSliderState({state: 'close'});
        this.eventService.openSnackBar("House goal is added");
      },
      error => this.eventService.showErrorMessage(error)
    )
  }

  saveGoal(){
    if(this.multiYearGoalForm.invalid) {
      this.multiYearGoalForm.markAllAsTouched();
    } else {
      let goalObj = this.createGoalObj();
      console.log(goalObj);
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
    let owner = this.familyList.find((member) => this.goalTypeData.defaults.planningForRelative.includes(member.relationshipId));
    this.multiYearGoalForm.get('field1').setValue(owner);
    this.selectOwnerAndUpdateForm(owner);
  }

  listenToYearRange(){
    this.multiYearGoalForm.controls.field2.valueChanges.pipe(debounceTime(600)).subscribe((value)=>{
      if(this.detailedPlanning) {
        let range = value[1] - value[0];
        this.startRange = value[0];
        let difference = range - (this.multiYearGoalForm.controls.detailedSpendings as FormArray).length;
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
