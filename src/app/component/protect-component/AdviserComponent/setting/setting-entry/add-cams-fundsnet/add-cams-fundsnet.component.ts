import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SettingsService } from '../../settings.service';
import { ValidatorType } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { AppConstants } from 'src/app/services/app-constants';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-cams-fundsnet',
  templateUrl: './add-cams-fundsnet.component.html',
  styleUrls: ['./add-cams-fundsnet.component.scss']
})
export class AddCamsFundsnetComponent implements OnInit, OnDestroy {

  @Input() data:any;

  camsFundFG:FormGroup;
  is_add: boolean;
  advisorId: any;
  showAddMoreQuestionBtn = true;
  formPlaceHolders:any;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
  };
  subscription = new Subscription();

  constructor(
    private subInjectService: SubscriptionInject, 
    private eventService: EventService,
    private settingService: SettingsService,
    private fb: FormBuilder
  ) {
    this.advisorId = AuthService.getAdvisorId();
    this.formPlaceHolders = AppConstants.formPlaceHolders;
  }

  ngOnInit() {
    this.createForm();
    this.is_add = !Object.keys(this.data.mainData).length;
    this.formListeners();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  formListeners(){
    this.subscription.add(
      this.camsFundFG.controls.arnRiaDetailsId.valueChanges.subscribe(id => {
        const arn = this.data.arnData.find(data => data.id == id);
        if(arn.registeredPan && arn.renewalDate) {
          const loginDate = new Date(arn.renewalDate).getDate() + ('0' + new Date(arn.renewalDate).getMonth() + 1).slice(-2);
          this.camsFundFG.controls.loginPassword.setValue(arn.registeredPan.slice(0,4) + loginDate);
        }
      })
    )
  }

  createForm() {
    this.camsFundFG = this.fb.group({
      advisorId: [this.advisorId],
      arnRiaDetailsId: [this.data.mainData.arnRiaDetailsId || '', [Validators.required]],
      arnOrRia: [this.data.mainData.arnOrRia],
      rtTypeMasterid: [this.data.rtType],
      rtExtTypeId: [2], // dbf file extension
      loginId: [this.data.mainData.loginId || '', [Validators.required]],
      loginPassword: [this.data.mainData.loginPassword || '', [Validators.required]],
      rtaCamsFundNetSecurityQuestionsList: this.fb.array([]),
      fileOrderingUseabilityStatusId: [1]
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
      secretQuestionsArr.push(this.secretQuestionsFG(question.id, ''));
    })
  }

  secretQuestionsFG(questionId = '', answer = ''){
    // let qObj = {value: questionId, disabled: !!questionId};
    return this.fb.group({
      questionId: [questionId, [Validators.required]],
      answer: [answer, [Validators.required]],
    });
  }
  save(){
    if(this.camsFundFG.invalid || this.barButtonOptions.active) {
      this.camsFundFG.markAllAsTouched();
    } else {
      this.barButtonOptions.active = true;
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
        }, err=> {
          this.eventService.openSnackBar(err, "Dismiss");
          this.barButtonOptions.active = false;
        })
      } else {
        let editJson = {
          ...this.data.mainData,
          ...jsonObj
        }
        this.settingService.editMFRTA(editJson).subscribe((res)=> {
          this.eventService.openSnackBar("CAMS Fundsnet Modified successfully");
          this.Close(true);
        }, err=> {
          this.eventService.openSnackBar(err, "Dismiss");
          this.barButtonOptions.active = false;
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
