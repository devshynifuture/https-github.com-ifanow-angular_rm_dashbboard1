import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {EventService} from 'src/app/Data-service/event.service';
import {FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import {AuthService} from 'src/app/auth-service/authService';
import {PlanService} from '../../plan.service';

@Component({
  selector: 'app-single-goal-year',
  templateUrl: './single-goal-year.component.html',
  styleUrls: ['./single-goal-year.component.scss']
})
export class SingleGoalYearComponent implements OnInit {
  @Input() goalTypeData:any = {};
  @Input() familyList:any = {};
  @Input() statisticalData:any = {};
  @Output() output = new EventEmitter<any>();
  @Output() backToaddGoal = new EventEmitter();
  Questions: any;
  familyData: any;
  singleYearGoalForm: FormGroup;
  currentYear: number = new Date().getFullYear();
  field3SliderData: any;
  planForFamily:boolean = false;
  imageData: any;
  logoImg: any;
  minAgeYear = 0;
  maxAgeYear = 100;
  clientId: any;
  advisorId: any;
  
  constructor(
    private eventService: EventService, 
    private fb: FormBuilder, 
    private planService: PlanService, 
  ) {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
  }
  
  ngOnInit() {
    this.Questions = this.goalTypeData.questions;
    this.planForFamily = !!this.goalTypeData.questions.Q; // Plan for family question present or not
    this.initializeForm();
    this.setDefaultOwner();
  }
  
  selectOwnerAndUpdateForm(value) {
    this.setMinMaxAgeOrYear(value);
    this.singleYearGoalForm.controls.field2.setValidators([Validators.required, Validators.min(this.minAgeYear), Validators.max(this.maxAgeYear)])
    this.singleYearGoalForm.controls.field2.setValue(this.minAgeYear + this.goalTypeData.defaults.ageIncreament);
    this.singleYearGoalForm.updateValueAndValidity();
  }
  
  createGoalObj() {
    let obj = {
      "clientId": this.clientId,
      "advisorId": this.advisorId,
      "goalName": this.singleYearGoalForm.get('field4').value,
      "notes": this.singleYearGoalForm.get('field5').value,
      "imageUrl": this.logoImg
    }

    switch (this.goalTypeData.id) {
      case 2: // House
        obj['currentAge'] = this.singleYearGoalForm.get('field1').value.age;
        obj['planningThisForId'] = this.singleYearGoalForm.get('field1').value.id;
        obj['clientOrFamilyMember'] = (this.singleYearGoalForm.get('field1').value.relationshipId === 0) ? 1 : 2;
        obj['whatAgeBuyHouse'] = this.singleYearGoalForm.get('field2').value;
        obj['goalPresentValue'] = this.singleYearGoalForm.get('field3').value;
        break;
      case 3: // Car
        obj['currentAge'] = this.singleYearGoalForm.get('field1').value.age;
        obj['whatAgeBuyCar'] = this.singleYearGoalForm.get('field2').value;
        obj['goalPresentValue'] = this.singleYearGoalForm.get('field3').value;
        break;
      case 4: // Marriage
        obj['currentAge'] = this.singleYearGoalForm.get('field1').value.age;
        obj['planningThisForId'] = this.singleYearGoalForm.get('field1').value.id;
        obj['clientOrFamilyMember'] = (this.singleYearGoalForm.get('field1').value.relationshipId === 0) ? 1 : 2;
        obj['marryAtAge'] = this.singleYearGoalForm.get('field2').value;
        obj['goalPresentValue'] = this.singleYearGoalForm.get('field3').value;
        break;
      case 7: // Emergency
        obj['goalTargetInMonth'] = this.singleYearGoalForm.get('field2').value;
        obj['goalFV'] = this.singleYearGoalForm.get('field3').value;
        break;
      case 8: // Wealth Creation
        obj['currentAge'] = this.singleYearGoalForm.get('field1').value.age;
        obj['planningThisForId'] = this.singleYearGoalForm.get('field1').value.id;
        obj['clientOrFamilyMember'] = (this.singleYearGoalForm.get('field1').value.relationshipId === 0) ? 1 : 2;
        obj['goalTargetAge'] = this.singleYearGoalForm.get('field2').value;
        obj['goalFV'] = this.singleYearGoalForm.get('field3').value;
        break;
      case 9: // Big Spends
        obj['goalStartDate'] = this.singleYearGoalForm.get('field2').value;
        obj['goalPresentValue'] = this.singleYearGoalForm.get('field3').value;
        break;
      case 10: // Others
        obj['goalStartDate'] = this.singleYearGoalForm.get('field2').value;
        obj['goalPresentValue'] = this.singleYearGoalForm.get('field3').value;
        break;
      default:
        console.error('unknown goal id found');
    }
    return obj;
  }

  sendDataObj(obj){
    switch (this.goalTypeData.id) {
      case 2: // House
        this.planService.addHouseGoal(obj).subscribe(
          data => {
            this.eventService.changeUpperSliderState({state: 'close', refreshRequired: true});
            this.eventService.openSnackBar("House goal is added");
          },
          error => this.eventService.showErrorMessage(error)
        );
        break;
      case 3: // Car
        this.planService.addCarGoal(obj).subscribe(
          data => {
            this.eventService.changeUpperSliderState({state: 'close', refreshRequired: true});
            this.eventService.openSnackBar("Car goal is added");
          },
          error => this.eventService.showErrorMessage(error)
        );
        break;
      case 4: // Marriage
        this.planService.addMarriageGoal(obj).subscribe(
          data => {
            this.eventService.changeUpperSliderState({state: 'close', refreshRequired: true});
            this.eventService.openSnackBar("Marriage goal is added");
          },
          error => this.eventService.showErrorMessage(error)
        );
        break;
      case 7: // Emergency
        this.planService.addEmergencyGoal(obj).subscribe(
          data => {
            this.eventService.changeUpperSliderState({state: 'close', refreshRequired: true});
            this.eventService.openSnackBar("Emergency goal is added");
          },
          error => this.eventService.showErrorMessage(error)
        );
        break;
      case 8: // Wealth Creation
        this.planService.addWealthCreationGoal(obj).subscribe(
          data => {
            this.eventService.changeUpperSliderState({state: 'close', refreshRequired: true});
            this.eventService.openSnackBar("Wealth Creation goal is added");
          },
          error => this.eventService.showErrorMessage(error)
        );
        break;
      case 9: // Big Spends
        this.planService.addBigSpendsGoal(obj).subscribe(
          data => {
            this.eventService.changeUpperSliderState({state: 'close', refreshRequired: true});
            this.eventService.openSnackBar("Big Spends goal is added");
          },
          error => this.eventService.showErrorMessage(error)
        );
        break;
      case 10: // Others
        this.planService.addOthersGoal(obj).subscribe(
          data => {
            this.eventService.changeUpperSliderState({state: 'close', refreshRequired: true});
            this.eventService.openSnackBar("Others goal is added");
          },
          error => this.eventService.showErrorMessage(error)
        );
        break;
      default:
        console.error('unknown goal id found')
    }
  }

  saveGoal(){
    if(this.singleYearGoalForm.invalid) {
      this.singleYearGoalForm.markAllAsTouched();
    } else {
      let goalObj = this.createGoalObj();
      console.log(goalObj);
      this.sendDataObj(goalObj);
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
  }

  initializeForm(){
    this.singleYearGoalForm = this.fb.group({
      field1: ['', [Validators.required]], // who the goal is for
      field2: ['', [Validators.required]], // age or time
      field3: [this.goalTypeData.defaults.cost, [Validators.required, Validators.min(this.goalTypeData.validations.minCost), Validators.max(this.goalTypeData.validations.maxCost)]], // cost
      field4: [''], // goal name
      field5: [''],  // goal description
      logo: ['']
    });
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

  setDefaultOwner(){
    let owner = this.familyList.find((member) => this.goalTypeData.defaults.planningForRelative.includes(member.relationshipId));
    this.singleYearGoalForm.get('field1').setValue(owner);
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
