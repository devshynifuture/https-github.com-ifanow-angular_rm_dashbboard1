import { EventService } from './../../../../Data-service/event.service';
import { SubscriptionInject } from './../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-historical-file',
  templateUrl: './order-historical-file.component.html',
  styleUrls: ['./order-historical-file.component.scss']
})
export class OrderHistoricalFileComponent implements OnInit {
  asOnDate: boolean = false;
  formValidationFalseCount: number = 0;
  mainFormValidationValue: boolean = false;
  fromToSameError: boolean = false;
  camsAsOnDatePastMaxDate: Date = new Date("1 January, 1993");
  karvyOrFranklinPastMaxDate = new Date("1 January, 1990");
  dateToday: Date = new Date();
  dateYesterday: Date = new Date(new Date().setDate(new Date().getDate() - 1));
  orderingFreq: {}[] = [
    {
      id: '1',
      name: 'Yearly'
    },
    {
      id: '2',
      name: 'Monthly'
    },
    {
      id: '3',
      name: 'All at once'
    }
  ];

  camsValueChangeSubscription: Subscription;
  karvyValueChangeSubscription: Subscription;
  franklinValueChangeSubscription: Subscription;
  isArnOrRiaSelected: boolean = false;

  constructor(
    private subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private eventService: EventService
  ) { }

  resetDateAsOnDateAndFormCheckbox() {
    if (this.orderHistoryFileForm.get('selectRta').value !== '1') {
      this.asOnDate = false;
      this.orderHistoryFileForm.get('orderingFreq').reset();
      this.orderHistoryFileForm.addControl('fromDate', new FormControl('', Validators.required));
      this.orderHistoryFileForm.addControl('toDate', new FormControl('', Validators.required));

      for (const key in this.orderHistoryFileForm.get('selectFilesToOrder.cams')['controls']) {
        if (this.orderHistoryFileForm.get('selectFilesToOrder.cams')['controls'].hasOwnProperty(key)) {
          const element = this.orderHistoryFileForm.get('selectFilesToOrder.cams')['controls'][key];
          element.value = false;
        }
      }

      for (const key in this.orderHistoryFileForm.get('selectFilesToOrder.karvy')['controls']) {
        if (this.orderHistoryFileForm.get('selectFilesToOrder.karvy')['controls'].hasOwnProperty(key)) {
          const element = this.orderHistoryFileForm.get('selectFilesToOrder.karvy')['controls'][key];
          element.value = false;
        }
      }

      for (const key in this.orderHistoryFileForm.get('selectFilesToOrder.franklin')['controls']) {
        if (this.orderHistoryFileForm.get('selectFilesToOrder.franklin')['controls'].hasOwnProperty(key)) {
          const element = this.orderHistoryFileForm.get('selectFilesToOrder.franklin')['controls'][key];
          element.value = false;
        }
      }
      this.camsAsOnDatePastMaxDate = this.karvyOrFranklinPastMaxDate;
    } else {
      this.camsAsOnDatePastMaxDate = new Date("1 January, 1993");
    }
  }

  orderHistoryFileForm = this.fb.group({
    "selectRta": ['1', Validators.required],
    "selectArnRia": this.fb.group({
      "selectArn": [,],
      "selectRia": [,],
    }, Validators.required),
    "fromDate": [, Validators.required],
    "toDate": [, Validators.required],
    "asOnDate": [,],
    "orderingFreq": [, Validators.required],
    "selectFilesToOrder": this.fb.group({
      "cams": this.fb.group({
        "wbr2": [false,],
        "wbr2a": [false,],
        "wbr49Active": [false,],
        "wbr49Ceased": [false,],
        "wbr9": [false,],
        "wbr22": [false,]
      }),
      "karvy": this.fb.group({
        "mfsd201": [false,],
        "mfsd243Active": [false,],
        "mfsd231Ceased": [false,],
        "mfsd211": [false,],
        "mfsd203": [false,]
      }),
      "franklin": this.fb.group({
        "myTransactionsForAPeriod": [false,],
        "activeSip": [false,],
        "ceasedSip": [false,],
        "investorFolioDetails": [false,],
        "clientsWiseAumOrWhoseBalExceedsN": [false,]
      })
    }),
  });

  ngOnInit() {
    console.log("this is yesterday's date::::   ", this.dateYesterday);
    // this.isOnlyAumSelected()
    this.conditionalRenderingOfForm();

  }

  conditionalRenderingOfForm() {
    this.orderHistoryFileForm.valueChanges.subscribe(val => console.log(val));
    this.camsValueChangeSubscription = this.orderHistoryFileForm.get('selectFilesToOrder.cams').valueChanges.subscribe(val => {
      if (val['wbr2']) {
        this.changesDueToCamsSelection(1)
      } else if (val['wbr2a']) {
        this.changesDueToCamsSelection(1);
      } else if (val['wbr49Active']) {
        this.changesDueToCamsSelection(1)
      } else if (val['wbr49Ceased']) {
        this.changesDueToCamsSelection(1)
      } else if (val['wbr9']) {
        this.changesDueToCamsSelection(1)
      } else if (val['wbr22']) {
        this.changesDueToCamsSelection(2);
      } else {
        this.changesDueToCamsSelection(1);
      }
    });
    this.karvyValueChangeSubscription = this.orderHistoryFileForm.get('selectFilesToOrder.karvy').valueChanges.subscribe(val => {
      if (val['mfsd201']) {
        this.changesDueToCamsSelection(1)
      } else if (val['mfsd243Active']) {
        this.changesDueToCamsSelection(1)
      } else if (val['mfsd231Ceased']) {
        this.changesDueToCamsSelection(1)
      } else if (val['mfsd211']) {
        this.changesDueToCamsSelection(1)
      } else if (val['mfsd203']) {
        this.changesDueToCamsSelection(2)
      } else {
        this.changesDueToCamsSelection(1);
      }
    });

    this.franklinValueChangeSubscription = this.orderHistoryFileForm.get('selectFilesToOrder.franklin').valueChanges.subscribe(val => {
      if (val['myTransactionsForAPeriod']) {
        this.changesDueToCamsSelection(1);
      } else if (val['activeSip']) {
        this.changesDueToCamsSelection(1);
      } else if (val['ceasedSip']) {
        this.changesDueToCamsSelection(1);
      } else if (val['investorFolioDetails']) {
        this.changesDueToCamsSelection(1);
      } else if (val['clientsWiseAumOrWhoseBalExceedsN']) {
        this.changesDueToCamsSelection(2);
      } else {
        this.changesDueToCamsSelection(1);
      }
    });
  }

  changesDueToCamsSelection(option) {
    if (option === 1) {
      this.asOnDate = false;
      this.orderHistoryFileForm.get('orderingFreq').reset();
      this.orderHistoryFileForm.get('asOnDate').setValidators([]);
      this.orderHistoryFileForm.addControl('fromDate', new FormControl('', Validators.required));
      this.orderHistoryFileForm.addControl('toDate', new FormControl('', Validators.required));
    } else if (option === 2) {
      this.asOnDate = true;
      this.orderHistoryFileForm.get('orderingFreq').setValue('3');
      this.orderHistoryFileForm.get('asOnDate').setValidators(Validators.required);
      this.orderHistoryFileForm.get('asOnDate').setErrors({ 'error': true });
      this.orderHistoryFileForm.removeControl('fromDate');
      this.orderHistoryFileForm.removeControl('toDate');
    }
  }

  dialogClose(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  validationOfSelectFilesToOrder(rtaValue) {
    let count = 0;
    let selectFormGroup;
    (rtaValue === '1') ? selectFormGroup = 'cams' :
      (rtaValue === '2') ? selectFormGroup = 'karvy' :
        (rtaValue === '3') ? selectFormGroup = 'franklin' : null;

    if (this.orderHistoryFileForm.get('selectRta').value === rtaValue) {
      for (const key in this.orderHistoryFileForm.get(`selectFilesToOrder.${selectFormGroup}`)['controls']) {
        if (this.orderHistoryFileForm.get(`selectFilesToOrder.${selectFormGroup}`)['controls'].hasOwnProperty(key)) {
          const element = this.orderHistoryFileForm.get(`selectFilesToOrder.${selectFormGroup}`)['controls'][key];
          if (element.value === false) {
            count++;
          }
        }
      }
      if (count === (rtaValue === '1' ? 6 : 5)) {
        this.orderHistoryFileForm.get(`selectFilesToOrder.${selectFormGroup}`).setErrors({ 'error': true });
        this.orderHistoryFileForm.get(`selectFilesToOrder.${selectFormGroup}`).markAsTouched();
        return false;
      } else {
        return true;
      }
    }
  }

  formValidations(whichTable) {
    // console.log("this is formGroup::::::::::", whichTable);
    let selectFileOrderValidation = false;
    for (let key in whichTable.controls) {
      if (key === 'selectFilesToOrder') {
        selectFileOrderValidation = this.validationOfSelectFilesToOrder(this.orderHistoryFileForm.get('selectRta').value);
      } else if (key === 'selectArnRia') {
        let isRiaSelected = false;
        if (this.orderHistoryFileForm.get('selectArnRia.selectRia').value !== true) {
          isRiaSelected = true;
        }
        if (this.orderHistoryFileForm.get('selectArnRia.selectArn').value !== true && isRiaSelected) {
          this.orderHistoryFileForm.get('selectArnRia').setErrors({ error: true });
        }

      } else if (whichTable.get(key).invalid) {
        whichTable.get(key).markAsTouched();
        return (selectFileOrderValidation && false);
      }
    }
    return (whichTable.valid) ? (selectFileOrderValidation && true) : (selectFileOrderValidation && false);
  }

  orderHistoricalFileSave() {
    if (this.formValidations(this.orderHistoryFileForm)) {
      // api call
      console.log('must be closed');
      this.dialogClose(false);
    } else {
      this.formValidationFalseCount++;
      this.eventService.openSnackBar("Must fill required field", "DISMISS");
    }
  }

}
