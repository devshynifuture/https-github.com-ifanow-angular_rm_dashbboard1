import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SettingsService } from '../../settings.service';
import { ValidatorType } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-add-cams-fundsnet',
  templateUrl: './add-cams-fundsnet.component.html',
  styleUrls: ['./add-cams-fundsnet.component.scss']
})
export class AddCamsFundsnetComponent implements OnInit {

  @Input() data:any;

  camsFundFG:FormGroup;
  is_add: boolean;
  advisorId: any;

  constructor(
    private subInjectService: SubscriptionInject, 
    private eventService: EventService,
    private settingService: SettingsService,
    private fb: FormBuilder
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.createForm();
    this.is_add = !Object.keys(this.data.mainData).length;
  }

  createForm() {
    this.camsFundFG = this.fb.group({
      advisorId: [this.advisorId],
      arnRiaDetailsId: [this.data.mainData.arnRiaDetailsId, [Validators.required]],
      arnOrRia: [this.data.mainData.arnOrRia],
      rtTypeMasterid: [this.data.rtType],
      rtExtTypeId: [2], // dbf file extension
      login_id: [this.data.mainData.type, [Validators.required]],
      password: [this.data.mainData.type, [Validators.required]],
      rtaCamsFundNetSecurityQuestionsList: this.fb.array([]),
    });

    if(this.data.mainData.rtaCamsFundNetSecurityQuestionsList && this.data.mainData.rtaCamsFundNetSecurityQuestionsList.length > 0) {
      for (let index = 0; index < this.data.mainData.rtaCamsFundNetSecurityQuestionsList.length; index++) {
        const secretQuestionsArr = this.camsFundFG.controls.rtaCamsFundNetSecurityQuestionsList as FormArray;
        secretQuestionsArr.push(this.secretQuestionsFG(this.data.mainData.rtaCamsFundNetSecurityQuestionsList[index].id, this.data.mainData.rtaCamsFundNetSecurityQuestionsList[index].answer));
      }
    } else {
      this.addMoreQuestion();
    }
  }

  secretQuestionsFG(questionId = '', answer = ''){
    return this.fb.group({
      id: [questionId, [Validators.required, this.isQuestionDuplicate()]],
      answer: [answer, [Validators.required]],
    });
  }

  addMoreQuestion() {
    const secretQuestionsArr = this.camsFundFG.controls.rtaCamsFundNetSecurityQuestionsList as FormArray;
    secretQuestionsArr.push(this.secretQuestionsFG());
  }

  removeQuestion(index=1) {
    const secretQuestionsArr = this.camsFundFG.controls.rtaCamsFundNetSecurityQuestionsList as FormArray;
    secretQuestionsArr.removeAt(index)
  }

  save(){
    if(this.camsFundFG.invalid) {
      this.camsFundFG.markAllAsTouched();
    } else {
      const jsonObj = this.camsFundFG.getRawValue();
      jsonObj.arnOrRia = this.data.arnData.find((data) => this.camsFundFG.controls.arnRiaDetailsId.value == data.id).arnOrRia;
    
      // add action
      if(this.is_add) {
        this.settingService.addMFRTA(jsonObj).subscribe((res)=> {
          this.eventService.openSnackBar("CAMS Fundsnet Added successfully");
          this.Close(true);
        })
      } else {
        this.settingService.editMFRTA(jsonObj).subscribe((res)=> {
          this.eventService.openSnackBar("CAMS Fundsnet Modified successfully");
          this.Close(true);
        })
      }
    }
  }

  isQuestionDuplicate(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const questions = this.camsFundFG.get("rtaCamsFundNetSecurityQuestionsList").value;
      const questionId = questions.map(item => item.id);
      const hasDuplicate = questionId.some(
        (name, index) => questionId.indexOf(name, index + 1) != -1
      );

      if (hasDuplicate) {
        return { duplicate: true };
      }

      return null;
    }
  }


  Close(status) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: status });
  }
  trackByFn(index: any, item: any) {
    return index;
  }
}
