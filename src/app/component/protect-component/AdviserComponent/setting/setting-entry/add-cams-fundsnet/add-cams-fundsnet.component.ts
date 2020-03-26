import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SettingsService } from '../../settings.service';
import { ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-cams-fundsnet',
  templateUrl: './add-cams-fundsnet.component.html',
  styleUrls: ['./add-cams-fundsnet.component.scss']
})
export class AddCamsFundsnetComponent implements OnInit {

  @Input() data:any;

  camsFundFG:FormGroup;

  secretQuestionsSet = [
    {
      id: 1,
      question: 'Which is your place of birth?',
    },
    {
      id: 2,
      question: 'What was the brand name of your first mobile handset?',
    },
    {
      id: 3,
      question: 'What was the brand name of your first vehicle?',
    },
    {
      id: 4,
      question: 'What is your favourite color?',
    },
    {
      id: 5,
      question: 'What is the brand name of your first watch?',
    },
    {
      id: 6,
      question: 'In which bank did you open your first savings account?',
    },
    {
      id: 7,
      question: 'Who was your favourite cartoon character?',
    },
    {
      id: 8,
      question: 'Name the month in which your birthday falls?',
    },
  ];

  constructor(
    private subInjectService: SubscriptionInject, 
    private eventService: EventService,
    private settingService: SettingsService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.camsFundFG = this.fb.group({
      number: [this.data.number, [Validators.required, Validators.pattern(ValidatorType.NUMBER_ONLY)]],
      login_id: [this.data.type, [Validators.required]],
      password: [this.data.type, [Validators.required]],
      secretQuestions: this.fb.array([
        this.secretQuestionsFG()
      ])
    });
  }

  secretQuestionsFG(){
    return this.fb.group({
      question: [this.data.type, [Validators.required]],
      answer: [this.data.type, [Validators.required]],
    });
  }

  addMoreQuestion() {
    const secretQuestionsArr = this.camsFundFG.controls.secretQuestions as FormArray;
    secretQuestionsArr.push(this.secretQuestionsFG());
  }

  removeQuestion(index=1) {
    const secretQuestionsArr = this.camsFundFG.controls.secretQuestions as FormArray;
    secretQuestionsArr.removeAt(index)
  }

  save(){
    if(this.camsFundFG.invalid) {
      this.camsFundFG.markAllAsTouched();
    } else {
      const jsonObj = this.camsFundFG.getRawValue();

      // add action
      if(this.data.pan) {
        this.settingService.addMFRTA(jsonObj).subscribe((res)=> {
          this.eventService.openSnackBar("CAMS Added successfully");
          this.Close(true);
        })
      } else {
        this.settingService.editMFRTA(jsonObj).subscribe((res)=> {
          this.eventService.openSnackBar("CAMS Modified successfully");
          this.Close(true);
        })
      }
    }
  }

  Close(status) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: status });
  }
}
