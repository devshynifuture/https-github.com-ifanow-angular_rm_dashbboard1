import { EventService } from './../../../../Data-service/event.service';
import { UtilService } from './../../../../services/util.service';
import { SubscriptionInject } from './../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-historical-file',
  templateUrl: './order-historical-file.component.html',
  styleUrls: ['./order-historical-file.component.scss']
})
export class OrderHistoricalFileComponent implements OnInit {
  asOnDate: boolean = false;

  constructor(
    private subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private utilService: UtilService,
    private eventService: EventService
  ) { }

  ngOnInit() {
    // this.isOnlyAumSelected()
    this.orderHistoryFileForm.get('selectFilesToOrder.cams').valueChanges.subscribe(val => {
      console.log(val);
      if (val['wbr22'] === true) {
        this.asOnDate = true;
      } else {
        this.asOnDate = false;
      }
    });
  }

  orderHistoryFileForm = this.fb.group({
    "selectRta": ['1', Validators.required],
    "selectArnRia": [, Validators.required],
    "fromDate": [, Validators.required],
    "toDate": [, Validators.required],
    "orderingFreq": [, Validators.required],
    "selectFilesToOrder": this.fb.group({
      "cams": this.fb.group({
        "wbr2": [,],
        "wbr2a": [,],
        "wbr49Active": [,],
        "wbr49Ceased": [,],
        "wbr9": [,],
        "wbr22": [false,]
      }),
      "karvy": this.fb.group({
        "mfsd201": [,],
        "mfsd243Active": [,],
        "mfsd231Ceased": [,],
        "mfsd211": [,],
        "mfsd203": [,]
      }),
      "franklin": this.fb.group({
        "myTransactionsForAPeriod": [,],
        "activeSip": [,],
        "ceasedSip": [,],
        "investorFolioDetails": [,],
        "clientsWiseAumOrWhoseBalExceedsN": [,]
      })
    }),
  });

  isOnlyAumSelected() {
    let selectedRta = false;
    let onlyCamsWbr22Selected = false;
    // for (const key in this.orderHistoryFileForm.controls) {
    //   if (this.orderHistoryFileForm.controls.hasOwnProperty(key)) {
    //     const element = this.orderHistoryFileForm.controls[key];
    //     console.log('form key and value:::', key, element);
    //     if (key === 'selectRta' && element.touched && element.value === '1') {
    //       selectedRta = true;
    //     }
    //     if (key === 'selectFilesToOrder' && element['controls'] && selectedRta) {
    //       for (const key in element.get('cams')['controls']) {
    //         if (element.get('cams')['controls'].hasOwnProperty(key)) {
    //           const el = element.get('cams')['controls'][key];
    //           if (el.value === false) {
    //             onlyCamsWbr22Selected = true;
    //           } else {
    //             onlyCamsWbr22Selected = false;
    //           }
    //         }
    //       }
    //       if (onlyCamsWbr22Selected) {
    //         this.asOnDate = true;
    //       } else {
    //         this.asOnDate = false;
    //       }
    //     }
    //   }
    // }
    // this.orderHistoryFileForm.get('selectFilesToOrder').valueChanges.subscribe(val => {
    //   let trueCount = 0;
    //   for (const key in val) {
    //     if (val.hasOwnProperty(key)) {
    //       if (key === 'cams') {
    //         for (const k in val[key]) {
    //           if (val[key].hasOwnProperty(k)) {
    //             const element = val[key][k];
    //             console.log(element);
    //             if (val[key][k] === true) {
    //               trueCount++;
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    //   if (trueCount > 1) {
    //     this.asOnDate = false;
    //   }
    // });
  }

  dialogClose(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  orderHistoricalFileSave() {
    if (this.utilService.formValidations(this.orderHistoryFileForm)) {
      // api call
      this.dialogClose(false);
    } else {
      this.eventService.openSnackBar("Must fill required field", "DISMISS");
    }
  }

}
