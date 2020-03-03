<<<<<<< HEAD
import { UtilService } from './../../../../../../../../services/util.service';
import { SubscriptionInject } from './../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit, ViewChild } from '@angular/core';
=======
import { Component, OnInit, ViewChild, ViewContainerRef, OnDestroy, ComponentFactoryResolver } from '@angular/core';
>>>>>>> 86ca67d8c29a6a93cc2ceac178be958915fd79ba
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DynamicComponentService } from 'src/app/services/dynamic-component.service';

@Component({
  selector: 'app-suggest-advice',
  templateUrl: './suggest-advice.component.html',
  styleUrls: ['./suggest-advice.component.scss']
})
<<<<<<< HEAD
export class SuggestAdviceComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private subscriptionInject: SubscriptionInject,
    private utilService: UtilService
  ) { }
  @ViewChild('stepper', { static: true }) stepper;

  isLinear = false;
  adviceForm: FormGroup = this.fb.group({
    "header": [, Validators.required],
    "rationale": [, Validators.required],
    "status": [, Validators.required],
    "givenOnDate": [, Validators.required],
    "implementDate": [, Validators.required],
    "withdrawalAmt": [, Validators.required],
    "consentOption": [, Validators.required]
  });

  // firstFormGroup: FormGroup = this.fb.group({
  //   firstCtrl: ['', Validators.required]
  // });

  // secondFormGroup: FormGroup = this.fb.group({
  //   secondCtrl: ['', Validators.required]
  // });

  ngOnInit() { }

  dialogClose() {
    this.subscriptionInject.changeNewRightSliderState({ state: 'close' });
  }

  addOrNextStep() {
    if (this.utilService.formValidations(this.adviceForm)) {
      this.stepper.next();
    }
=======
export class SuggestAdviceComponent implements OnInit, OnDestroy {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  adviceSlider: Subscription;

  @ViewChild('dynamic', {
    read: ViewContainerRef,
    static: true
  }) viewContainerRef: ViewContainerRef;

  constructor(
    private _formBuilder: FormBuilder,
    protected eventService: EventService,
    protected subinject: SubscriptionInject,
    protected dynamicComponentService: DynamicComponentService,
  ) {
  }
inputData = {};
  ngOnInit() {
    this.adviceSlider = this.subinject.newRightSliderDataObs.subscribe((data) => {
      const tempData: any = data;
      if (tempData.componentName) {
        this.addDynamicComponentService(this.viewContainerRef, this.inputData);
      }
    });
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
>>>>>>> 86ca67d8c29a6a93cc2ceac178be958915fd79ba
  }

  addDynamicComponentService(viewContainerRef, inputData) {
    if (viewContainerRef) {
      this.dynamicComponentService.addDynamicComponent(viewContainerRef, inputData.childComponent, inputData.data);
    }
  }
  ngOnDestroy() {
    this.adviceSlider.unsubscribe();
  }

  test():void {
    console.log(this.inputData);
  }
}
