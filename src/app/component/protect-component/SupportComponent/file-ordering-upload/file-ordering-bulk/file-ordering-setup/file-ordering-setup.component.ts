import { UtilService } from './../../../../../../services/util.service';
import { SubscriptionInject } from './../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-file-ordering-setup',
  templateUrl: './file-ordering-setup.component.html',
  styleUrls: ['./file-ordering-setup.component.scss']
})
export class FileOrderingSetupComponent implements OnInit {

  constructor(
    private subscriptionInject: SubscriptionInject,
    private fb: FormBuilder,
    private utilService: UtilService
  ) { }

  lastPastDate: Date = new Date('1 Jan 1990');

  historicalFileBulkOrderingForm = this.fb.group({
    "selectRta": [, Validators.required],
    "fileType": [, Validators.required],
    "fromDate": [, Validators.required],
    "toDate": [, Validators.required]
  });

  setDateValidation() {
    this.historicalFileBulkOrderingForm.get('selectRta').value === 'cams' ?
      this.lastPastDate = new Date('1 Jan, 1993') : this.lastPastDate = new Date('1 Jan, 1990')
  }

  ngOnInit() {
  }

  dialogClose() {
    this.subscriptionInject.changeNewRightSliderState({ state: 'close' });
  }

  requestForBulkFileOrdering() {
    if (this.utilService.formValidations(this.historicalFileBulkOrderingForm)) {
      // call api for save
      console.log('saved!!!!!!!');
    } else {
      console.log('err');
    }
  }

}
