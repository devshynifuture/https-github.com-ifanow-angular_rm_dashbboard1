import { DynamicComponentService } from './../../../../../../../../services/dynamic-component.service';
import { SubscriptionInject } from './../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from './../../../../../../../../Data-service/event.service';
import { UtilService } from './../../../../../../../../services/util.service';
import { Component, OnInit, ViewChild, OnDestroy, ViewContainerRef, ViewChildren, QueryList, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatInput } from '@angular/material';

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
    "consentOption": ['1', Validators.required],
  })
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

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
  goBack() {
    this.stepper.previous();
    console.log(this.stepper.selectedIndex, "check selectedIndex");

  }
  addOrNextStep() {
    if (this.stepper) {
      this.stepper.next();
    }
    if (this.stepper == undefined) {
      return;
    }
    // if (this.utilService.formValidations(this.adviceForm)) {
    // if (this.formStep === 1) {
    //   this.stepper.next();
    //   this.formStep = 2;
    // } else {

    let componentRefFormValues;
    let componentRefComponentValues = this.componentRef._component;
    // proceed on creating new suggest
    if (this.adviceForm.invalid) {
      for (let element in this.adviceForm.controls) {
        console.log(element)
        if (this.adviceForm.get(element).invalid) {
          this.adviceForm.controls[element].markAsTouched();
        }
      }
    }else{
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
      case this.childComponentFlag === 'adviceBankAccount' && componentRefComponentValues.isFormValuesForAdviceValid():
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
      case this.childComponentFlag === 'advicePPF' && componentRefComponentValues.isFormValuesForAdviceValid():
        let ppfOptionalFormCopy = Object.assign({}, componentRefComponentValues.optionalppfSchemeForm.value);
        let nomineeListCopyPPF = componentRefComponentValues.nomineesList.slice();
        let transactionDataCopy = componentRefComponentValues.transactionData.slice();

        Object.keys(ppfOptionalFormCopy).map(function (key) {
          if (key == 'nominees') {
            let arr = [];
            nomineeListCopyPPF.forEach(item => {
              arr.push(item.value);
            });
            ppfOptionalFormCopy[key] = arr;
          }
          {
            let arr = [];
            transactionDataCopy.forEach(item => {
              arr.push(item.value);
            });
            ppfOptionalFormCopy['publicprovidendfundtransactionlist'] = arr;
          }
        });
        componentRefFormValues = {
          ...componentRefComponentValues.ppfSchemeForm.value,
          ...ppfOptionalFormCopy
        }
        break;
      case this.childComponentFlag === 'adviceNSC' && componentRefComponentValues.isFormValuesForAdviceValid():
        let nscOptionalFormCopy = Object.assign({}, componentRefComponentValues.nscFormOptionalField.value);
        let nomineeListCopyNsc = componentRefComponentValues.nomineesList.slice();

        Object.keys(nscOptionalFormCopy).map(function (key) {
          if (key == 'nominees') {
            let arr = [];
            nomineeListCopyNsc.forEach(item => {
              arr.push(item.value);
            });
            nscOptionalFormCopy[key] = arr;
          }
        });
        componentRefFormValues = {
          ...componentRefComponentValues.nscFormField.value,
          ...nscOptionalFormCopy
        }
        break;
      case this.childComponentFlag === 'adviceSSY' && componentRefComponentValues.isFormValuesForAdviceValid():
        let ssyOptionalFormCopy = Object.assign({}, componentRefComponentValues.ssySchemeOptionalForm.value);
        let nomineeListCopySsy = componentRefComponentValues.nomineesList.slice();
        let transactionDataCopySsy = componentRefComponentValues.transactionData.slice();

        Object.keys(ssyOptionalFormCopy).map(function (key) {
          if (key == 'nominees') {
            let arr = [];
            nomineeListCopySsy.forEach(item => {
              arr.push(item.value);
            });
            ssyOptionalFormCopy[key] = arr;
          }
          {
            let arr = [];
            transactionDataCopySsy.forEach(item => {
              arr.push(item.value);
            });
            ssyOptionalFormCopy['ssyTransactionList'] = arr;
          }
        });
        componentRefFormValues = {
          ...componentRefComponentValues.ssySchemeForm.value,
          ...ssyOptionalFormCopy
        }
        break;
      case this.childComponentFlag === 'adviceKVP' && componentRefComponentValues.isFormValuesForAdviceValid():
        componentRefFormValues = {
          ...componentRefComponentValues.KVPFormScheme.value,
          ...componentRefComponentValues.KVPOptionalFormScheme.value
        }
        break;
      case this.childComponentFlag === 'adviceSCSS' && componentRefComponentValues.isFormValuesForAdviceValid():
        let scssOptionalFormCopy = Object.assign({}, componentRefComponentValues.scssOptionalSchemeForm.value);
        let nomineeListCopyScss = componentRefComponentValues.nomineesList.slice();
        Object.keys(scssOptionalFormCopy).map(function (key) {
          if (key == 'nominees') {
            let arr = [];
            nomineeListCopyScss.forEach(item => {
              arr.push(item.value);
            });
            scssOptionalFormCopy[key] = arr;
          }
        });
        componentRefFormValues = {
          ...componentRefComponentValues.scssSchemeForm.value,
          ...scssOptionalFormCopy
        }
        break;
      case this.childComponentFlag === 'advicePoSaving' && componentRefComponentValues.isFormValuesForAdviceValid():
        let posavingOptionalFormCopy = Object.assign({}, componentRefComponentValues.poSavingOptionalForm.value);
        let nomineeListCopyPosaving = componentRefComponentValues.nomineesList.slice();
        Object.keys(posavingOptionalFormCopy).map(function (key) {
          if (key == 'nominees') {
            let arr = [];
            nomineeListCopyPosaving.forEach(item => {
              arr.push(item.value);
            });
            posavingOptionalFormCopy[key] = arr;
          }
        });
        componentRefFormValues = {
          ...componentRefComponentValues.poSavingForm.value,
          ...posavingOptionalFormCopy
        }
        break;
      case this.childComponentFlag === 'advicePORD' && componentRefComponentValues.isFormValuesForAdviceValid():
        let pordOptionalFormCopy = Object.assign({}, componentRefComponentValues.PORDFormoptionalForm.value);
        let nomineeListCopyPord = componentRefComponentValues.nomineesList.slice();
        Object.keys(pordOptionalFormCopy).map(function (key) {
          if (key == 'nominees') {
            let arr = [];
            nomineeListCopyPord.forEach(item => {
              arr.push(item.value);
            });
            pordOptionalFormCopy[key] = arr;
          }
        });
        componentRefFormValues = {
          ...componentRefComponentValues.PORDForm.value,
          ...pordOptionalFormCopy
        }
        break;
      case this.childComponentFlag === 'advicePOTD' && componentRefComponentValues.isFormValuesForAdviceValid():
        let potdOptionalFormCopy = Object.assign({}, componentRefComponentValues.POTDOptionalForm.value);
        let nomineeListCopyPotd = componentRefComponentValues.nomineesList.slice();
        Object.keys(potdOptionalFormCopy).map(function (key) {
          if (key == 'nominees') {
            let arr = [];
            nomineeListCopyPotd.forEach(item => {
              arr.push(item.value);
            });
            potdOptionalFormCopy[key] = arr;
          }
        });
        componentRefFormValues = {
          ...componentRefComponentValues.POTDForm.value,
          ...potdOptionalFormCopy
        }
        break;
      case this.childComponentFlag === 'advicePOMIS' && componentRefComponentValues.pomisForm.valid:
        let pomisFormCopy = Object.assign({}, componentRefComponentValues.pomisForm.value);
        let nomineeListCopyPomis = componentRefComponentValues.nomineesList.slice();
        Object.keys(pomisFormCopy).map(function (key) {
          if (key == 'nominees') {
            let arr = [];
            nomineeListCopyPomis.forEach(item => {
              arr.push(item.value);
            });
            pomisFormCopy[key] = arr;
          }
        });
        componentRefFormValues = pomisFormCopy;
        break;
      case this.childComponentFlag === 'adviceEPF' && componentRefComponentValues.epf.valid:
        componentRefFormValues = componentRefComponentValues.epf.value
        break;
      case this.childComponentFlag === 'adviceNPSSummary' && componentRefComponentValues.summaryNPS.valid:
        componentRefFormValues = componentRefComponentValues.summaryNPS.value;
        break;
      case this.childComponentFlag === 'adviceNPSSchemeHolding' && componentRefComponentValues.schemeHoldingsNPS.valid:
        componentRefFormValues = componentRefComponentValues.schemeHoldingsNPS.value;
        break;
      case this.childComponentFlag === 'adviceGratuity' && componentRefComponentValues.gratuity.valid:
        componentRefFormValues = componentRefComponentValues.gratuity.value;
        break;
      case this.childComponentFlag === 'adviceSuperAnnuation' && componentRefComponentValues.superannuation.valid:
        componentRefFormValues = componentRefComponentValues.superannuation.value;
        break;
      case this.childComponentFlag === 'adviceEPS' && componentRefComponentValues.eps.valid:
        componentRefFormValues = componentRefComponentValues.eps.value;
        break;
      case this.childComponentFlag === 'adviceRealEstate' && componentRefComponentValues.addrealEstateForm.valid:
        componentRefFormValues = componentRefComponentValues.addrealEstateForm.value;
        break;
      case this.childComponentFlag === 'adviceFixedDeposit' && componentRefComponentValues.fixedDeposit.valid:
        componentRefFormValues = componentRefComponentValues.fixedDeposit.value;
        break;
      case this.childComponentFlag === 'adviceRecurringDeposit' && componentRefComponentValues.isFormValuesForAdviceValid():
        let arrRecurringDep = [];
        let recurringDepositCopy = Object.assign({}, componentRefComponentValues.recuringDeposit.value);
        componentRefComponentValues.nomineesList.forEach(element => {
          let obj = {
            "name": element.controls.name.value,
            "sharePercentage": element.controls.sharePercentage.value,
            "id": (element.controls.id.value) ? element.controls.id.value : 0,
            "familyMemberId": (element.controls.familyMemberId.value) ? element.controls.familyMemberId.value : 0
          }
          arrRecurringDep.push(obj)
        });
        recurringDepositCopy['nominees'] = arrRecurringDep;
        componentRefFormValues = recurringDepositCopy;
        break;
      case this.childComponentFlag === 'adviceBonds' && componentRefComponentValues.isFormValuesForAdviceValid():
        let arr = [];
        let bondsFormCopy = Object.assign({}, componentRefComponentValues.bonds.value);
        componentRefComponentValues.nomineesList.forEach(element => {
          let obj = {
            "name": element.controls.name.value,
            "sharePercentage": element.controls.sharePercentage.value,
            "id": (element.controls.id.value) ? element.controls.id.value : 0,
            "familyMemberId": (element.controls.familyMemberId.value) ? element.controls.familyMemberId.value : 0
          }
          arr.push(obj)
        });
        bondsFormCopy['nominees'] = arr;
        componentRefFormValues = bondsFormCopy;
        break;
      case this.childComponentFlag === 'adviceAssetStock' && componentRefComponentValues.assetForm.valid:
        componentRefFormValues = componentRefComponentValues.assetForm.value;
        break;
    }

    // console.log(this.adviceForm);
    const bothFormValues = {
      ...this.adviceForm.value,
      ...componentRefFormValues
    }

    console.log("this is form value::::::::::::", bothFormValues);
    // }
    // }
  }
  }

  dialogClose() {
    this.subinject.changeNewRightSliderState({ state: 'close' });
  }
}
