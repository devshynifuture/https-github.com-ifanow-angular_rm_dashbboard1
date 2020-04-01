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
  showAddMoreQuestionBtn = true;

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
      loginId: [this.data.mainData.type, [Validators.required]],
      loginPassword: [this.data.mainData.type, [Validators.required]],
      rtaCamsFundNetSecurityQuestionsList: this.fb.array([]),
    });

    if(this.data.mainData.rtaCamsFundNetSecurityQuestionsList && this.data.mainData.rtaCamsFundNetSecurityQuestionsList.length > 0) {
      for (let index = 0; index < this.data.mainData.rtaCamsFundNetSecurityQuestionsList.length; index++) {
        const secretQuestionsArr = this.camsFundFG.controls.rtaCamsFundNetSecurityQuestionsList as FormArray;
        secretQuestionsArr.push(this.secretQuestionsFG(this.data.mainData.rtaCamsFundNetSecurityQuestionsList[index].questionId, this.data.mainData.rtaCamsFundNetSecurityQuestionsList[index].answer));
      }
    } else {
      this.addMoreQuestion();
    }
  }

  secretQuestionsFG(questionId = '', answer = ''){
    let qObj = {value: questionId, disabled: !!questionId};;
    
    return this.fb.group({
      questionId: [qObj, [Validators.required, this.isQuestionDuplicate()]],
      answer: [answer, [Validators.required]],
    });
  }

  addMoreQuestion() {
    const secretQuestionsArr = this.camsFundFG.controls.rtaCamsFundNetSecurityQuestionsList as FormArray;
    secretQuestionsArr.push(this.secretQuestionsFG());
  }

  removeQuestion(index=1) {
    const secretQuestionsArr = this.camsFundFG.controls.rtaCamsFundNetSecurityQuestionsList as FormArray;
    const questionSet = secretQuestionsArr.controls[index] as FormGroup;
    if(!this.is_add) {
      const questionId = this.data.mainData.rtaCamsFundNetSecurityQuestionsList.map(data => data.questionId);
      const questionExist = questionId.includes(questionSet.controls.questionId.value);
      if(questionExist) {
        const questionToRemove = this.data.mainData.rtaCamsFundNetSecurityQuestionsList.find(data => data.questionId == questionSet.controls.questionId.value).id
        const removeQuestionObj = {id: questionToRemove};
        this.settingService.deleteQuestion(removeQuestionObj).subscribe(res => {
          this.data.mainData.rtaCamsFundNetSecurityQuestionsList.splice(this.data.mainData.rtaCamsFundNetSecurityQuestionsList.findIndex((data)=> data.id == secretQuestionsArr.controls[index].value.id), 1);
          this.eventService.openSnackBar("Question deleted successfully");
        }, err => {
          this.eventService.openSnackBar("Error occured");
        })
      }
    }
    secretQuestionsArr.removeAt(index);
  }

  save(){
    if(this.camsFundFG.invalid) {
      this.camsFundFG.markAllAsTouched();
    } else {
      const jsonObj = this.camsFundFG.value;
      jsonObj.arnOrRia = this.data.arnData.find((data) => this.camsFundFG.controls.arnRiaDetailsId.value == data.id).arnOrRia;
    
      // add action
      if(this.is_add) {
        this.settingService.addMFRTA(jsonObj).subscribe((res)=> {
          this.eventService.openSnackBar("CAMS Fundsnet Added successfully");
          this.Close(true);
        })
      } else {
        let editJson = {
          ...this.data.mainData,
          ...jsonObj
        }
        delete editJson.rtaCamsFundNetSecurityQuestionsList;
        this.settingService.editMFRTA(editJson).subscribe((res)=> {
          this.eventService.openSnackBar("CAMS Fundsnet Modified successfully");
          this.Close(true);
        });
      }
    }
  }
  
  updateAnswer(index) {
    const secretQuestionsArr = this.camsFundFG.controls.rtaCamsFundNetSecurityQuestionsList as FormArray;
    const questionSet = secretQuestionsArr.controls[index] as FormGroup;
    const questionToUpdate = this.data.mainData.rtaCamsFundNetSecurityQuestionsList.find(data => data.questionId == questionSet.controls.questionId.value).id
    const jsonObj = {id: questionToUpdate, answer: secretQuestionsArr.controls[index].value.answer};
    this.settingService.updateAnswer(jsonObj).subscribe(res => {
      this.eventService.openSnackBar("Answer updated successfully");
    }, err => {
      this.eventService.openSnackBar("Error occured");
    })
  }
  

  isQuestionDuplicate(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const questions = this.camsFundFG.controls.rtaCamsFundNetSecurityQuestionsList as FormArray;
      const questionsRaw = questions.getRawValue();
      const questionId = questionsRaw.map(item => item.questionId);
      const hasDuplicate = questionId.some(
        (name, index) => questionId.indexOf(name, index + 1) != -1
      );

      if (hasDuplicate) {
        return { duplicate: true };
      }

      return null;
    }
  }

  addIndividualQuestion(){
    this.showAddMoreQuestionBtn = !this.showAddMoreQuestionBtn;
    this.addMoreQuestion();
  }

  saveIndividualQuestion(element){
    this.showAddMoreQuestionBtn = !this.showAddMoreQuestionBtn;
    const jsonObj = {
      "answer": element.answer,
      "arnRtaDetailsId": this.data.mainData.id,
      "questionId": element.questionId
    };
    this.settingService.addQuestion(jsonObj).subscribe(res => {
      this.eventService.openSnackBar("Question added successfully");
    }, err => {
      this.eventService.openSnackBar("Error occured");
    })
  }

  addOrUpdateIndividualQuestion(index) {
    let questionSet = this.camsFundFG.controls.rtaCamsFundNetSecurityQuestionsList.value;

    if (questionSet.length == (index+1) && !this.showAddMoreQuestionBtn) {
      this.saveIndividualQuestion(questionSet[index]);
    } else {
      this.updateAnswer(index);
    }
  }

  Close(status) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: status });
  }
  trackByFn(index: any, item: any) {
    return index;
  }
}
