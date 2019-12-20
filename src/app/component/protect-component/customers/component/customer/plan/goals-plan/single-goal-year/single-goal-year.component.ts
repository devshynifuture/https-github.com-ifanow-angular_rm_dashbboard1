import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { PlanService } from '../../plan.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-single-goal-year',
  templateUrl: './single-goal-year.component.html',
  styleUrls: ['./single-goal-year.component.scss']
})
export class SingleGoalYearComponent implements OnInit {
  Questions: any;
  goalTypeData: any;
  clientId: any;
  advisorId: any;
  familyData: any;
  singleYearGoalForm;
  yearData: number;
  field2SliderData: any;
  field2MinData: any;
  field3SliderData: any;
  @ViewChild('myInput3', { static: true }) inputRef: ElementRef;
  @ViewChild('mySlider3', { static: true }) sliderRef: ElementRef<object>;
  constructor(private eventService: EventService, private fb: FormBuilder, private planService: PlanService, private utilService: UtilService) { }
  @Input() set goalData(data) {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
    this.getFamilyMember();
    console.log(data)
    if (data == undefined) {
      let name = { name: '' };
      this.goalTypeData = name;
      return;
    }
    this.goalTypeData = data;
    this.Questions = data.questions;
    this.singleYearGoalForm = this.fb.group({
      field1: [, [Validators.required]],
      field2: [, [Validators.required]],
      field3: [, [Validators.required]],
      field4: [, [Validators.required]],
      field5: [, [Validators.required]]
    });
    switch (this.goalTypeData.id) {
      case 3:
        this.yearData = new Date().getFullYear();
        this.singleYearGoalForm.controls['field2'].setValue(this.yearData);
        this.field3SliderData = 500000;
        this.singleYearGoalForm.controls['field3'].setValue(500000);
        break;
      case 7:
        this.singleYearGoalForm.controls['field2'].setValue(1);
        this.singleYearGoalForm.controls['field3'].setValue(100000);
        break;
      case 9:
        this.yearData = new Date().getFullYear();
        this.singleYearGoalForm.controls['field2'].setValue(this.yearData);
        this.singleYearGoalForm.controls['field3'].setValue(100000);
        break;
      case 10:
        this.yearData = new Date().getFullYear();
        this.singleYearGoalForm.controls['field2'].setValue(this.yearData);
        this.singleYearGoalForm.controls['field3'].setValue(500000);
      default:
        return;
    }

  };
  @Output() backToaddGoal = new EventEmitter();
  ngOnInit() {
  }
  inputData(data) {
    console.log(this.sliderRef.nativeElement);
  }
  back() {
    this.backToaddGoal.emit(undefined);
  }
  selectOwner(value) {
    console.log(this.yearData)
    console.log(value)
    switch (this.goalTypeData.id) {
      case 2:
        this.field2SliderData = value.age;
        this.field3SliderData = 500000;
        this.singleYearGoalForm.get('field2').setValue(value.age);
        this.singleYearGoalForm.get('field3').setValue(500000);
        break;
      case 4:
        this.field2SliderData = value.age;
        this.field3SliderData = 100000;
        this.singleYearGoalForm.get('field2').setValue(value.age);
        this.singleYearGoalForm.get('field3').setValue(100000);
        break;
      case 8:
        this.field2SliderData = value.age;
        this.singleYearGoalForm.get('field2').setValue(value.age + 2);
        this.singleYearGoalForm.get('field3').setValue(75000);
        break;
      default:
        console.log("data")
        return;
    }
  }
  close(state) {
    const fragmentData = {
      // direction: 'top',
      // componentName: AddGoalsComponent,
      state: 'close'
    };
    this.eventService.changeUpperSliderState(fragmentData)
  }
  getFamilyMember() {
    const obj =
    {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.planService.getListOfFamilyByClient(obj).subscribe(
      data => {
        this.utilService.calculateAgeFromCurrentDate(data.familyMembersList)
        console.log(data);
        data.familyMembersList.unshift(
          {
            clientId: this.clientId,
            userName: 'sher khan',
            advisorId: this.advisorId,
            relationshipId: '',
            age: 50,
            id: 2
          }
        )
        this.familyData = data.familyMembersList;
      },
      err => this.eventService.openSnackBar(err, "dismiss")
    )
  }
  addSingleYearGoal() {
    switch (true) {
      case (this.singleYearGoalForm.get('field1').invalid && (this.goalTypeData.id == 2 || this.goalTypeData.id == 4 || this.goalTypeData.id == 8)):
        this.singleYearGoalForm.get('field1').markAsTouched();
        break;
      case (this.singleYearGoalForm.get('field2').invalid):
        this.singleYearGoalForm.get('field2').markAsTouched();
        break;
      case (this.singleYearGoalForm.get('field3').invalid):
        this.singleYearGoalForm.get('field3').markAsTouched();
        break;
      case (this.singleYearGoalForm.get('field4').invalid):
        this.singleYearGoalForm.get('field4').markAsTouched();
        break;
      default:
        if (this.goalTypeData.id == 2) {
          const obj =
          {
            "clientId": this.clientId,
            "advisorId": this.advisorId,
            "planningThisForId": this.singleYearGoalForm.get('field1').value.id,
            "clientOrFamilyMember": (this.singleYearGoalForm.get('field1').value.clientId == this.clientId) ? 1 : 2,
            "whatAgeBuyHouse": this.singleYearGoalForm.get('field2').value,
            "currentAge": this.singleYearGoalForm.get('field1').value.age,
            "goalPresentValue": this.singleYearGoalForm.get('field3').value,
            "goalName": this.singleYearGoalForm.get('field4').value,
            "notes": this.singleYearGoalForm.get('field5').value,
            "imageUrl": "image.png"
          }
          this.planService.addHouseGoal(obj).subscribe(
            data => {
              console.log(data);
              this.close('close');
              this.eventService.openSnackBar("House goal is added")
            },
            err => this.eventService.openSnackBar(err)
          )
        }
        else if (this.goalTypeData.id == 3) {
          const obj = {
            "clientId": this.clientId,
            "advisorId": this.advisorId,
            "whatAgeBuyCar": this.singleYearGoalForm.get('field2').value,
            "goalPresentValue": this.singleYearGoalForm.get('field3').value,
            "goalName": this.singleYearGoalForm.get('field4').value,
            "notes": this.singleYearGoalForm.get('field5').value,
            "imageUrl": "image.png"
          }
          this.planService.addCarGoal(obj).subscribe(
            data => {
              console.log(data)
              this.eventService.openSnackBar("Car goal is added", "dismiss");
              this.close('close');
            },
            err => this.eventService.openSnackBar(err)
          )
        }
        else if (this.goalTypeData.id == 4) {
          const obj =
          {
            "clientId": this.clientId,
            "advisorId": this.advisorId,
            "planningThisForId": this.singleYearGoalForm.get('field1').value.id,
            "clientOrFamilyMember": (this.singleYearGoalForm.get('field1').value.clientId == this.clientId) ? 1 : 2,
            "marryAtAge": this.singleYearGoalForm.get('field2').value,
            "currentAge": 11,
            "goalPresentValue": this.singleYearGoalForm.get('field3').value,
            "goalName": this.singleYearGoalForm.get('field4').value,
            "notes": this.singleYearGoalForm.get('field5').value,
            "imageUrl": "image.png"
          }
          this.planService.addMarriageGoal(obj).subscribe(
            data => {
              console.log(data)
              this.eventService.openSnackBar("Marriage goal is added", "dismiss");
              this.close('close');
            },
            err => this.eventService.openSnackBar(err)
          )
        }
        else if (this.goalTypeData.id == 7) {
          const obj = {
            "clientId": this.clientId,
            "advisorId": this.advisorId,
            "goalTargetInMonth": this.singleYearGoalForm.get('field2').value,
            "goalFV": this.singleYearGoalForm.get('field3').value,
            "goalName": this.singleYearGoalForm.get('field4').value,
            "notes": this.singleYearGoalForm.get('field5').value,
            "imageUrl": "image.png"
          }
          this.planService.addEmergencyGoal(obj).subscribe(
            data => {
              console.log(data)
              this.eventService.openSnackBar("Emergency goal is added", "dismiss");
              this.close('close');
            },
            err => this.eventService.openSnackBar(err, "dismiss")
          )
        }
        else if (this.goalTypeData.id == 8) {
          const obj =
          {
            "clientId": this.clientId,
            "advisorId": this.advisorId,
            "planningThisForId": this.singleYearGoalForm.get('field1').value.id,
            "clientOrFamilyMember": (this.singleYearGoalForm.get('field1').value.clientId == this.clientId) ? 1 : 2,
            "currentAge": this.singleYearGoalForm.get('field1').value.age,
            "goalTargetAge": this.singleYearGoalForm.get('field2').value,
            "goalFV": this.singleYearGoalForm.get('field3').value,
            "goalName": this.singleYearGoalForm.get('field4').value,
            "notes": this.singleYearGoalForm.get('field5').value,
            "imageUrl": "image.png"
          }
          this.planService.addWealthCreationGoal(obj).subscribe(
            data => {
              console.log(data)
              this.eventService.openSnackBar("Wealth creation goal is added", "dismiss"),
                this.close('close');
            },
            err => this.eventService.openSnackBar(err, "dismiss")
          )
        }
        else if (this.goalTypeData.id == 9) {
          const obj = {
            "clientId": this.clientId,
            "advisorId": this.advisorId,
            "goalStartDate": this.singleYearGoalForm.get('field2').value + '-01-01',
            "goalPresentValue": this.singleYearGoalForm.get('field3').value,
            "goalName": this.singleYearGoalForm.get('field4').value,
            "notes": this.singleYearGoalForm.get('field5').value,
            "imageUrl": "image.png"
          }
          this.planService.addBigSpendsGoal(obj).subscribe(
            data => {
              console.log(data),
                this.eventService.openSnackBar("Big spends is added", 'dismiss'),
                this.close('close')
            },
            err => this.eventService.openSnackBar(err, "dismiss")
          )
        }
        else {
          const obj = {
            "clientId": this.clientId,
            "advisorId": this.advisorId,
            "goalStartDate": this.singleYearGoalForm.get('field2').value + '-01-01',
            "goalPresentValue": this.singleYearGoalForm.get('field3').value,
            "goalName": this.singleYearGoalForm.get('field4').value,
            "notes": this.singleYearGoalForm.get('field5').value,
            "imageUrl": "image.png"
          }
          this.planService.addOthersGoal(obj).subscribe(
            data => {
              console.log(data),
                this.eventService.openSnackBar("Others spends is added", 'dismiss'),
                this.close('close')
            },
            err => this.eventService.openSnackBar(err, "dismiss")
          )
        }
    }
  }
}
