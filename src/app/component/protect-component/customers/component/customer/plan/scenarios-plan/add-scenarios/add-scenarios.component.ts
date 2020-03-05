import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-scenarios',
  templateUrl: './add-scenarios.component.html',
  styleUrls: ['./add-scenarios.component.scss']
})
export class AddScenariosComponent implements OnInit {
  _inputData: any;
  displayedColumns: string[] = ['name', 'scenario', 'conflicting'];
  dataSource = ELEMENT_DATA;
  addScenario: any;
  constructor(private subInjectService: SubscriptionInject, private fb: FormBuilder, ) { }

  ngOnInit() {
    this.getdataForm('')
  }

  close() {
    let data = this._inputData;
    this.subInjectService.changeNewRightSliderState({ state: 'close', data });
  }
  getdataForm(data) {

    this.addScenario = this.fb.group({
      Duration: [(!data) ? '' : data.Duration, [Validators.required]],
      prefix: [data ? '' : data.prefix, [Validators.required]],
      choose: [data ? '' : data.choose, [Validators.required]],
    });
  }
  getFormControl(): any {
    return this.addScenario.controls;
  }
  saveScenario() {
    if (this.addScenario.get('Duration').invalid) {
      this.addScenario.get('Duration').markAsTouched();
      return;
    } else if (this.addScenario.get('prefix').invalid) {
      this.addScenario.get('prefix').markAsTouched();
      return;
    } else if (this.addScenario.get('choose').invalid) {
      this.addScenario.get('choose').markAsTouched();
      return
    }else{
      let obj = {
        Duration: this.addScenario.controls.Duration.value,
        prefix: this.addScenario.controls.prefix.value,
        choose: this.addScenario.controls.choose.value,
      }
    }
  }
}

export interface PeriodicElement {
  name: string;
  scenario: string;
  conflicting: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Goal tracker', scenario: 'Scenario 2', conflicting: 'Continue paying premiums' },
  { name: 'Insurance planning', scenario: 'Scenario 1', conflicting: 'Stop paying premiums and make the policy paid up' },
  { name: 'Tax planning', scenario: 'Scenario 1', conflicting: 'Continue paying premiums' },
];