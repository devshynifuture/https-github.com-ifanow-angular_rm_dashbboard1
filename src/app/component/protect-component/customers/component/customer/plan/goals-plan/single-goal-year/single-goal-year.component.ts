import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {EventService} from 'src/app/Data-service/event.service';
import {FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import {AuthService} from 'src/app/auth-service/authService';
import {PlanService} from '../../plan.service';
import {UtilService} from 'src/app/services/util.service';

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
  currentAge: number;
  minAgeYear = 0;
  maxAgeYear = 100;
  clientId: any;
  advisorId: any;
  
  constructor(
    private eventService: EventService, 
    private fb: FormBuilder, 
    private planService: PlanService, 
    private utilService: UtilService
  ) {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
  }
  
  ngOnInit() {
    this.Questions = this.goalTypeData.questions;
    this.planForFamily = !!this.goalTypeData.questions.Q; // Plan for family question present or not
    this.initializeForm();
  }
  
  selectOwnerAndUpdateForm(value) {
    this.setMinMaxAgeOrYear(value);
    this.singleYearGoalForm.controls.field2.setValidators([Validators.required, Validators.min(this.minAgeYear), Validators.max(this.maxAgeYear)])
    this.singleYearGoalForm.controls.field2.setValue(this.minAgeYear);
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

    /**
     * 2 - house
     * 3 - car
     * 4 - marriage
     * 7 - emergency
     * 8 - wealth creation
     * 9 - big spend
     * 10 - others
     */
    if([2,4,8].includes(this.goalTypeData.id)) {
      obj['planningThisForId'] = this.singleYearGoalForm.get('field1').value.id;
      obj['clientOrFamilyMember'] = (this.singleYearGoalForm.get('field1').value.relationshipId === 0) ? 1 : 2;
    }
    if([2,3,4,8].includes(this.goalTypeData.id)) {
      obj['currentAge'] = this.singleYearGoalForm.get('field1').value.age;
    }
    if([2,3,4,9,10].includes(this.goalTypeData.id)) {
      obj['goalPresentValue'] = this.singleYearGoalForm.get('field3').value;
    }

    switch (this.goalTypeData.id) {
      case 2: // House
        obj['whatAgeBuyHouse'] = this.singleYearGoalForm.get('field2').value;
        break;
      case 3: // Car
        obj['whatAgeBuyCar'] = this.singleYearGoalForm.get('field2').value;
        break;
      case 4: // Marriage
        obj['marryAtAge'] = this.singleYearGoalForm.get('field2').value;
        break;
      case 7: // Emergency
        obj['goalTargetInMonth'] = this.singleYearGoalForm.get('field2').value;
        obj['goalFV'] = this.singleYearGoalForm.get('field3').value;
        break;
      case 8: // Wealth Creation
        obj['goalTargetAge'] = this.singleYearGoalForm.get('field2').value;
        obj['goalFV'] = this.singleYearGoalForm.get('field3').value;
        break;
      case 9: // Big Spends
        obj['goalStartDate'] = this.singleYearGoalForm.get('field2').value;
        break;
      case 10: // Others
        obj['goalStartDate'] = this.singleYearGoalForm.get('field2').value;
        break;
      default:
        console.error('unknown goal id found')
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
    if(this.singleYearGoalForm.invalid) {
      this.singleYearGoalForm.markAllAsTouched();
    } else {
      let goalObj = this.createGoalObj();
      console.log(goalObj);
      // this.sendDataObj(goalObj);
    }
  }

  // set the validation age for the age form field 
  setMinMaxAgeOrYear(value){
    this.currentAge = this.getAge(value.dateOfBirth);
    if(this.goalTypeData.validations.showAge) {
      this.minAgeYear = (this.goalTypeData.validations.minAge || (this.goalTypeData.validations.minAgeFromPresent + this.currentAge));
      this.maxAgeYear = (this.goalTypeData.validations.maxAge || (this.goalTypeData.validations.maxAgeFromPresent + this.currentAge));
    } else {
      this.minAgeYear = (this.goalTypeData.validations.minAgeFromPresent + this.currentYear);
      this.maxAgeYear = (this.goalTypeData.validations.maxAgeFromPresent + this.currentYear);
    }
    if(this.minAgeYear < (this.currentAge + this.goalTypeData.validations.minAgeFromPresent)) {
      this.minAgeYear = this.currentAge + this.goalTypeData.validations.minAgeFromPresent;
    }
  }

  initializeForm(){
    this.singleYearGoalForm = this.fb.group({
      field2: ['', [Validators.required]], // age or time
      field3: ['', [Validators.required, Validators.min(this.goalTypeData.validations.minCost), Validators.max(this.goalTypeData.validations.maxCost)]], // cost
      field4: [''], // goal name
      field5: [''],  // goal description
      logo: ['']
    });

    if(this.planForFamily) {
      this.singleYearGoalForm.addControl('field1', new FormControl('', Validators.required)); // who the goal is for
    }
    this.setMinMaxAgeOrYear(this.familyList[0]);
    this.selectOwnerAndUpdateForm(this.familyList[0]); //set client as the initial owner
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
