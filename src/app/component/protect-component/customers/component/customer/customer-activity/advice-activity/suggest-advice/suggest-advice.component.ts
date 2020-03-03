import { Component, OnInit, ViewChild, ViewContainerRef, OnDestroy, ComponentFactoryResolver } from '@angular/core';
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
