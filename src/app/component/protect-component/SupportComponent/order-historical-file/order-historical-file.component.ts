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
  }

  orderHistoryFileForm = this.fb.group({
    "selectRta": [, Validators.required],
    "selectArnRia": [, Validators.required],
    "fromDate": [, Validators.required],
    "toDate": [, Validators.required],
    "orderingFreq": [, Validators.required],
    "wbr2": [,],
    "wbr2a": [,],
    "wbr49Active": [,],
    "wbr49Close": [,],
    "wbr9": [,],
    "wbr22": [,]
  });

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
