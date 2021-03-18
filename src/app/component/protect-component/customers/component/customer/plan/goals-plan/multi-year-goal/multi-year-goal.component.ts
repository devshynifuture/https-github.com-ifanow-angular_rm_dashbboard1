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
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { PhotoCloudinaryUploadService } from 'src/app/services/photo-cloudinary-upload.service';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { OrgSettingServiceService } from 'src/app/component/protect-component/AdviserComponent/setting/org-setting-service.service';
import { OpenGalleryPlanComponent } from 'src/app/component/protect-component/AdviserComponent/setting/setting-plan/setting-plan/plan-gallery/open-gallery-plan/open-gallery-plan.component';
import { MatDialog } from '@angular/material';

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
  planForFamily: boolean = false;
  imageData: any;
  logoImg: any;
  giveDetailedPlan: boolean = false;
  startRange: number = 0;
  detailedPlanning: boolean = false;
  rangeFieldOptions: Options = {
    ceil: 60,
    floor: 2,
    step: 1
  }
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
  organizationLogo;
  imgURL: any;
  defaultGallery: any;
  constructor(
    public authService: AuthService,
    private eventService: EventService,
    private fb: FormBuilder,
    private planService: PlanService,
    private datePipe: DatePipe,
    private utilService: UtilService,
    private orgSetting: OrgSettingServiceService,
    private dialog: MatDialog,
  ) { }

  @Input() goalTypeData: any = {};
  @Input() familyList: any = {};
  @Input() statisticalData: any = {};
  @Output() output = new EventEmitter<any>();
  minAgeYear = 0;
  maxAgeYear = 100;


  @Output() backToaddGoal = new EventEmitter();
  ngOnInit() {
    this.Questions = this.goalTypeData.questions;
    this.logoImg = this.goalTypeData.imageUrl;
    this.planForFamily = !!this.goalTypeData.questions.Q; // Plan for family question present or not
    this.initializeForm();
    this.setDefaultOwner();
    this.listenToYearRange();
  }

  selectOwnerAndUpdateForm(value) {
    this.setMinMaxAgeOrYear(value);
    this.multiYearGoalForm.controls.field2.setValidators([Validators.required])
    this.multiYearGoalForm.controls.field2.setValue([this.minAgeYear + this.goalTypeData.defaults.gap, this.minAgeYear + this.goalTypeData.defaults.gap * 2]);
    this.multiYearGoalForm.updateValueAndValidity();
  }

  get detailedSpendingFormArray() {
    let arr = this.multiYearGoalForm.get('detailedSpendings') as FormArray
    return arr.controls
  }

  // TODO:- recheck about the input params to be sent
  createGoalObj() {
    let obj = {
      "clientId": this.clientId,
      "advisorId": this.advisorId,
      "name": this.multiYearGoalForm.get('field4').value,
      "notes": this.multiYearGoalForm.get('field5').value,
      "imageUrl": (this.imgURL) ? this.imgURL : this.logoImg,
      "goalType": this.goalTypeData.goalTypeId,
      "planningFor": this.multiYearGoalForm.get('field1').value.id,
      // "goalAdditionDate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      //"frequency": (this.multiYearGoalForm.get('field3').value),
    }

    const date = new Date();
    const monthAndDayString = '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-01';

    switch (this.goalTypeData.goalTypeId) {
      case AppConstants.VACATION_GOAL:
        obj['planningforGroupHead'] = 1;
        obj['vacationStartYr'] = this.multiYearGoalForm.get('field2').value[0] + monthAndDayString;
        obj['vacationEndYr'] = this.multiYearGoalForm.get('field2').value[1] + monthAndDayString;
        obj['goalEndDate'] = obj['vacationEndYr']
        obj['goalStartDate'] = obj['vacationStartYr']
        obj["savingStartDate"] = this.datePipe.transform(date, 'yyyy-MM-dd');
        obj['savingEndDate'] = obj['goalStartDate']
        if (obj['frequency'] == "") {
          obj['frequency'] = (this.multiYearGoalForm.get('field2').value[1] - this.multiYearGoalForm.get('field2').value[0])
        } else if (this.goalTypeData.goalTypeId == 5) {
          obj['frequency'] = parseInt(this.multiYearGoalForm.get('field3').value);
        }
        if (this.detailedSpendingFormArray.length > 1) {
          let multiObj = {};
          let startYear = this.multiYearGoalForm.get('field2').value[0];
          for (let i = 0; i < this.detailedSpendingFormArray.length; i++) {
            let objId = startYear + monthAndDayString;
            multiObj[objId] = this.detailedSpendingFormArray[i].value;
            startYear++;
          }
          obj['goalYrsAndFutureValue'] = multiObj;
        } else {
          obj['presentValue'] = (this.detailedSpendingFormArray[0].value);
        }
        break;

      case AppConstants.EDUCATION_GOAL:
        const currentDate = new Date();
        let startAge = 0;
        let endAge = 0
        let birth = new Date(currentDate);
        let futureDate = new Date(currentDate);
        let birth2 = new Date(currentDate);
        obj['planningforGroupHead'] = this.multiYearGoalForm.get('field1').value.relationshipId === 0 ? 1 : 0;
        obj['ageAttheStartofTheCourse'] = this.multiYearGoalForm.get('field2').value[0];
        obj['ageAtTheEndofTheCourse'] = this.multiYearGoalForm.get('field2').value[1];
        obj['presentValue'] = this.detailedSpendingFormArray[0].value;
        obj["presentAge"] = this.multiYearGoalForm.get('field1').value.familyMemberAge;
        futureDate = new Date(currentDate);
        obj["savingStartDate"] = this.datePipe.transform(currentDate, 'yyyy-MM-dd'),
          birth.setFullYear(birth.getFullYear() - this.multiYearGoalForm.get('field1').value.familyMemberAge);
        birth2.setFullYear(birth2.getFullYear() - this.multiYearGoalForm.get('field1').value.familyMemberAge);
        startAge = this.multiYearGoalForm.get('field2').value[0];
        endAge = this.multiYearGoalForm.get('field2').value[1];
        birth.setFullYear(birth.getFullYear() + startAge);
        obj['goalStartDate'] = this.datePipe.transform(birth, 'yyyy-MM-dd');
        birth2.setFullYear(birth2.getFullYear() + endAge);
        obj['goalEndDate'] = this.datePipe.transform(birth2, 'yyyy-MM-dd');
        obj['savingEndDate'] = obj['goalStartDate']

        break;
    }

    return obj;
  }

  sendDataObj(obj) {
    this.barButtonOptions.active = true;
    this.planService.addMultiYearGoal(obj).subscribe(
      data => {
        this.eventService.setRefreshRequired();
        switch (this.goalTypeData.goalTypeId) {
          case 5:
            this.eventService.openSnackBar("Vacation goal is added", "Dismiss");
            break;
          case 6:
            this.eventService.openSnackBar("Education goal is added", "Dismiss");
            break;
          default:
            break;
        }
        this.eventService.closeUpperSlider({ state: 'close', data: { resetSelectedCursor: true } });
        this.barButtonOptions.active = false;
      },
      error => {
        this.eventService.showErrorMessage(error)
        this.barButtonOptions.active = false;
      }
    )
  }

  saveGoal() {
    if (this.goalTypeData.goalTypeId != 5) {
      this.multiYearGoalForm.get('field3').setValue(0);
    }
    if (this.multiYearGoalForm.invalid || this.barButtonOptions.active) {
      this.multiYearGoalForm.markAllAsTouched();
    } else {
      let goalObj = this.createGoalObj();
      console.log(goalObj)
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


    const newOptions: Options = Object.assign({}, this.rangeFieldOptions);
    newOptions.floor = this.minAgeYear;
    newOptions.ceil = this.maxAgeYear;
    this.rangeFieldOptions = newOptions;
  }

  initializeForm() {
    this.multiYearGoalForm = this.fb.group({
      field1: ['', [Validators.required]], // who the goal is for
      field2: [[0, 20], [Validators.required]], // age or time
      // cumulated or detailed spending - cumulated will have single controller in array while detailed will have many.
      detailedSpendings: this.fb.array([
        new FormControl(this.goalTypeData.defaults.cost, [Validators.required, Validators.min(this.goalTypeData.validations.minCost), Validators.max(this.goalTypeData.validations.maxCost)])
      ]),
      field3: ["", Validators.required],//vacation frequency
      field4: ['', Validators.required], // goal name
      field5: [''],  // goal description
      logo: ['']
    });
    if (this.goalTypeData.goalTypeId != 5) {
      this.multiYearGoalForm.get('field3').setValue(1)
    }
  }

  setDefaultOwner() {
    // TODO:- Check condition for when no children found
    let owner = this.familyList.find((member) => this.goalTypeData.defaults.planningForRelative.includes(member.relationshipId));
    this.multiYearGoalForm.get('field1').setValue(owner);
    this.selectOwnerAndUpdateForm(owner);
  }

  listenToYearRange() {
    this.multiYearGoalForm.controls.field2.valueChanges.pipe(debounceTime(600)).subscribe((value) => {
      if (this.detailedPlanning) {
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
    for (let i = 0; i < length; i++) {
      (this.multiYearGoalForm.controls.detailedSpendings as FormArray).push(new FormControl('', [Validators.required, Validators.min(this.goalTypeData.validations.minCost), Validators.max(this.goalTypeData.validations.maxCost)]))
    }
  }

  removeFromFormArray(length) {
    for (let i = 0; i < length; i++) {
      (this.multiYearGoalForm.controls.detailedSpendings as FormArray).removeAt((this.multiYearGoalForm.controls.detailedSpendings as FormArray).length - 1);
    }
  }

  // toggle between detailed planning vs same amount every year
  revisePlanning() {
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
      setTimeout(() => {
        this.logoImg = reader.result
        const tags = this.advisorId + ',advisor_profile_logo,';
        const file = this.utilService.convertB64toImageFile(reader.result);
        PhotoCloudinaryUploadService.uploadFileToCloudinary([file], 'advisor_profile_logo', tags,
          (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
            if (status == 200) {
              const responseObject = JSON.parse(response);
              const jsonDataObj = {
                advisorId: this.advisorId,
                goalName: this.multiYearGoalForm.get('field4').value,
                imageURL: responseObject.secure_url,
                goalTypeId: this.goalTypeData.goalTypeId,
              }
              this.orgSetting.uploadPlanPhoto(jsonDataObj).subscribe((res) => {

                this.imgURL = jsonDataObj.imageURL;
                console.log('image gj*****', this.imgURL)
                this.eventService.openSnackBar('Image uploaded sucessfully', 'Dismiss');
              });
            }
          });
      }, 300);
    }
  }
  goBack() {
    this.output.emit();
  }
}
