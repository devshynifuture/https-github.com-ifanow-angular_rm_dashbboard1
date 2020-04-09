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
      loginId: [this.data.mainData.loginId, [Validators.required]],
      loginPassword: [this.data.mainData.loginPassword, [Validators.required]],
      rtaCamsFundNetSecurityQuestionsList: this.fb.array([]),
    });

    if(this.data.mainData.rtaCamsFundNetSecurityQuestionsList && this.data.mainData.rtaCamsFundNetSecurityQuestionsList.length > 0) {
      for (let index = 0; index < this.data.mainData.rtaCamsFundNetSecurityQuestionsList.length; index++) {
        const secretQuestionsArr = this.camsFundFG.controls.rtaCamsFundNetSecurityQuestionsList as FormArray;
        secretQuestionsArr.push(this.secretQuestionsFG(this.data.mainData.rtaCamsFundNetSecurityQuestionsList[index].questionId, this.data.mainData.rtaCamsFundNetSecurityQuestionsList[index].answer));
      }
    } else {
      // instead of a single question we will be adding all 9 questions
      // this.addMoreQuestion();
      this.createAllQuestionSet();
    }
  }

  createAllQuestionSet() {
    let questions = this.data.globalData.rta_cams_fund_net_security_questions_list as Array<any>;
    const secretQuestionsArr = this.camsFundFG.controls.rtaCamsFundNetSecurityQuestionsList as FormArray;

    questions.forEach(question => {
      secretQuestionsArr.push(this.secretQuestionsFG(question.questionId, ''));
    })
  }

  secretQuestionsFG(questionId = '', answer = ''){
    let qObj = {value: questionId, disabled: !!questionId};
    return this.fb.group({
      questionId: [qObj, [Validators.required]],
      answer: [answer, [Validators.required]],
    });
  }
  save(){
    if(this.camsFundFG.invalid) {
      this.camsFundFG.markAllAsTouched();
    } else {
      const jsonObj = this.camsFundFG.value;
      jsonObj.arnOrRia = this.data.arnData.find((data) => this.camsFundFG.controls.arnRiaDetailsId.value == data.id).arnOrRia;
    
      // add action
      if(this.is_add) {
        jsonObj.rtaCamsFundNetSecurityQuestionsList.forEach(element => {
          element.questionId = parseInt(element.questionId);
        });
        this.settingService.addMFRTA(jsonObj).subscribe((res)=> {
          this.eventService.openSnackBar("CAMS Fundsnet Added successfully");
          this.Close(true);
        })
      } else {
        let editJson = {
          ...this.data.mainData,
          ...jsonObj
        }
        this.settingService.editMFRTA(editJson).subscribe((res)=> {
          this.eventService.openSnackBar("CAMS Fundsnet Modified successfully");
          this.Close(true);
        });
      }
    }
  }

  Close(status) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: status });
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  getRtaControlArray(){
    let formarr =  this.camsFundFG.controls.rtaCamsFundNetSecurityQuestionsList as FormArray;
    return formarr.controls;
  }
}
