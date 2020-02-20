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

  constructor(
    private subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private utilService: UtilService,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.isOnlyAumSelected()
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
        "wbr22": [,]
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
    for (const key in this.orderHistoryFileForm) {
      if (this.orderHistoryFileForm.hasOwnProperty(key)) {
        const element = this.orderHistoryFileForm[key];
        if (key === 'selectFilesToOrder') {

        }
        console.log("this is form control values:::", element);
      }
    }
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
