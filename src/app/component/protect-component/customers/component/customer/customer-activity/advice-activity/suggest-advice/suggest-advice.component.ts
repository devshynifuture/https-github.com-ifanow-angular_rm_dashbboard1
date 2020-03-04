import { DynamicComponentService } from './../../../../../../../../services/dynamic-component.service';
import { SubscriptionInject } from './../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from './../../../../../../../../Data-service/event.service';
import { UtilService } from './../../../../../../../../services/util.service';
import { Component, OnInit, ViewChild, OnDestroy, ViewContainerRef, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

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
  formStep: number = 1;
  componentRef;

  adviceForm: FormGroup = this.fb.group({
    "header": [, Validators.required],
    "rationale": [, Validators.required],
    "status": [, Validators.required],
    "givenOnDate": [, Validators.required],
    "implementDate": [, Validators.required],
    "withdrawalAmt": [, Validators.required],
    "consentOption": [, Validators.required],
  })

  @ViewChild('stepper', { static: true }) stepper;

  @ViewChild('dynamic', {
    read: ViewContainerRef,
    static: true
  }) viewContainerRef: ViewContainerRef;
  childComponentFlag: any;

  constructor(
    private fb: FormBuilder,
    protected eventService: EventService,
    protected subinject: SubscriptionInject,
    protected dynamicComponentService: DynamicComponentService,
    private utilService: UtilService
  ) { }

  inputData;

  ngOnInit() {
    this.adviceSlider = this.subinject.newRightSliderDataObs.subscribe((data) => {
      console.log("suggest", data)
      if (data.childComponent) {
        this.componentRef = this.dynamicComponentService.addDynamicComponent(this.viewContainerRef, data.childComponent, data.childData);
        this.childComponentFlag = data.flag;
      }
    });
  }

  ngOnDestroy() {
    this.adviceSlider.unsubscribe();
  }

  addOrNextStep() {
    // if (this.utilService.formValidations(this.adviceForm)) {
    //   if (this.formStep === 1) {
    //     this.stepper.next();
    //     this.formStep = 2;
    //   } else {

    let componentRefFormValues;
    let componentRefComponentValues = this.componentRef._component;
    // proceed on creating new suggest

    console.log("this is what i need:::::::::::::::", componentRefComponentValues)

    switch (true) {
      case this.childComponentFlag === 'adviceGOLD' && componentRefComponentValues.gold.valid:
        componentRefFormValues = componentRefComponentValues.gold.value;
        break;
      case this.childComponentFlag === 'adviceOTHERS' && componentRefComponentValues.others.valid:
        componentRefFormValues = componentRefComponentValues.others.value;
        break;
      case this.childComponentFlag === 'adviceCashInHand' && componentRefComponentValues.cashInHand.valid:
        componentRefFormValues = componentRefComponentValues.cashInHand.value;
        break;
      case this.childComponentFlag === 'adviceBankAccount' && componentRefComponentValues.bankAccounts.valid && componentRefComponentValues.nomineesList.length !== 0:
        let bankAccValCopy = Object.assign({}, componentRefComponentValues.bankAccounts.value);
        let nomineeListCopy = componentRefComponentValues.nomineesList.slice();
        Object.keys(bankAccValCopy).map(function (key) {
          if (key == 'nomineeList') {
            let arr = [];
            nomineeListCopy.forEach(item => {
              arr.push(item.value);
            });
            bankAccValCopy[key] = arr;
          }
        });

        componentRefFormValues = {
          ...bankAccValCopy
        }
        break;
      case this.childComponentFlag === 'advicePPF' && componentRefComponentValues.ppfSchemeForm.valid && componentRefComponentValues.optionalppfSchemeForm.valid && componentRefComponentValues.nomineesList.length !== 0:
        let ppfOptionalFormCopy = Object.assign({}, componentRefComponentValues.optionalppfSchemeForm.value);
        let nomineeListCopyPPF = componentRefComponentValues.nomineesList.slice();
        let transactionDataCopy = componentRefComponentValues.transactionData.slice();
        Object.keys(ppfOptionalFormCopy).map(function (key) {
          if (key == 'nominees') {
            let arr = [];
            nomineeListCopyPPF.forEach(item => {
              console.log("this is some item that we need:::::::::::::::", nomineeListCopyPPF, item.value);
              arr.push(item.value);
            });
            console.log(arr);
            ppfOptionalFormCopy[key] = arr;
          }
        });
        componentRefFormValues = {
          ...componentRefComponentValues.ppfSchemeForm.value,
          ...ppfOptionalFormCopy,
          ...transactionDataCopy
        }
        break;
      case this.childComponentFlag === 'adviceNSC' && componentRefComponentValues.nscFormField.valid && componentRefComponentValues.nscFormOptionalField.valid:
        componentRefFormValues = {
          ...componentRefComponentValues.ppfSchemeForm.value,
          ...componentRefComponentValues.nscFormOptionalField.value
        }
        break;
      case this.childComponentFlag === 'adviceSSY' && componentRefComponentValues.ssySchemeForm.valid && componentRefComponentValues.ssySchemeOptionalForm.valid:
        componentRefFormValues = {
          ...componentRefComponentValues.ssySchemeForm.value,
          ...componentRefComponentValues.ssySchemeOptionalForm.value
        }
        break;
      case this.childComponentFlag === 'adviceKVP' && componentRefComponentValues.KVPFormScheme.valid && componentRefComponentValues.KVPOptionalFormScheme.valid:
        componentRefFormValues = {
          ...componentRefComponentValues.KVPFormScheme.value,
          ...componentRefComponentValues.KVPOptionalFormScheme.value
        }
        break;
      case this.childComponentFlag === 'adviceSCSS' && componentRefComponentValues.scssSchemeForm.valid && componentRefComponentValues.scssOptionalSchemeForm.valid:
        componentRefFormValues = {
          ...componentRefComponentValues.scssSchemeForm.value,
          ...componentRefComponentValues.scssOptionalSchemeForm.value
        }
        break;
      case this.childComponentFlag === 'advicePoSaving' && componentRefComponentValues.poSavingForm.valid && componentRefComponentValues.poSavingOptionalForm.valid:
        componentRefFormValues = {
          ...componentRefComponentValues.poSavingForm.value,
          ...componentRefComponentValues.poSavingOptionalForm.value
        }
        break;
      case this.childComponentFlag === 'advicePORD' && componentRefComponentValues.PORDForm.valid && componentRefComponentValues.PORDFormoptionalForm.valid:
        componentRefFormValues = {
          ...componentRefComponentValues.PORDForm.value,
          ...componentRefComponentValues.PORDFormoptionalForm.value
        }
        break;
      case this.childComponentFlag === 'advicePOTD' && componentRefComponentValues.POTDForm.valid && componentRefComponentValues.POTDOptionalForm.valid:
        componentRefFormValues = {
          ...componentRefComponentValues.POTDForm.value,
          ...componentRefComponentValues.POTDOptionalForm.value
        }
        break;
      case this.childComponentFlag === 'advicePOMIS' && componentRefComponentValues.pomisForm.valid:
        componentRefFormValues = componentRefComponentValues.pomisForm.value;
        break;
    }

    // console.log(this.adviceForm);
    const bothFormValues = {
      ...this.adviceForm.value,
      ...componentRefFormValues
    }

    console.log("this is form value::::::::::::", bothFormValues);
    //   }
    // }
  }

  dialogClose() {
    this.subinject.changeNewRightSliderState({ state: 'close' });
  }
}
