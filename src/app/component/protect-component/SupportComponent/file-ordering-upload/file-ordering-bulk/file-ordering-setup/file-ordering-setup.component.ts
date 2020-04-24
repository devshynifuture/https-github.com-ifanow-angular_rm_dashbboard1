import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from './../../../../../../services/util.service';
import { SubscriptionInject } from './../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SupportService } from '../../../support.service';
import { EventService } from '../../../../../../Data-service/event.service';
import { FileOrderingUploadService } from '../../file-ordering-upload.service';

@Component({
  selector: 'app-file-ordering-setup',
  templateUrl: './file-ordering-setup.component.html',
  styleUrls: ['./file-ordering-setup.component.scss']
})
export class FileOrderingSetupComponent implements OnInit {

  constructor(
    private subscriptionInject: SubscriptionInject,
    private fb: FormBuilder,
    private utilService: UtilService,
    private supportService: SupportService,
    private eventService: EventService,
    private fileOrderingService: FileOrderingUploadService
  ) { }

  data;
  lastPastDate: Date = new Date('1 Jan 1990');
  fileTypeList: any[] = [];
  presentDate = new Date();
  rmId = AuthService.getRmId() ? AuthService.getRmId() : 0;

  historicalFileBulkOrderingForm = this.fb.group({
    rtId: [, Validators.required],
    fileTypeId: [, Validators.required],
    fromDate: [, Validators.required],
    toDate: [, Validators.required]
  });

  rtaList = [
    {
      id: 1,
      name: 'CAMS'
    },
    {
      id: 2,
      name: 'KARVY'
    },
    {
      id: 3,
      name: 'FRANKLIN'
    },
  ]

  setDateValidation() {
    this.historicalFileBulkOrderingForm.get('rtId').value === '1' ?
      this.lastPastDate = new Date('1 Jan, 1993') : this.lastPastDate = new Date('1 Jan, 1990')
  }

  ngOnInit() {
    console.log("sent data::::", this.data)
    this.getFileTypeName();
  }

  getFileTypeName() {
    this.supportService.getFileTypeOrder({})
      .subscribe(res => {
        console.log("file type list:::", res);
        if (res && res.length !== 0) {
          this.fileTypeList = res;
        } else {
          this.eventService.openSnackBar("No File Type List Found", "DISMISS")
        }
      })
  }

  dialogClose() {
    this.subscriptionInject.changeNewRightSliderState({ state: 'close', refreshRequired: true });
  }

  requestForBulkFileOrdering() {
    if (this.utilService.formValidations(this.historicalFileBulkOrderingForm)) {
      // call api for save

      let values = this.historicalFileBulkOrderingForm.value;
      const data = {
        rmId: this.rmId,
        rtId: values.rtId,
        fileTypeId: values.fileTypeId,
        fromDate: values.fromDate.getFullYear() + "-" +
          this.utilService.addZeroBeforeNumber((values.fromDate.getMonth() + 1), 2) + '-' +
          this.utilService.addZeroBeforeNumber((values.fromDate.getDate()), 2),
        toDate: values.toDate.getFullYear() + "-" +
          this.utilService.addZeroBeforeNumber((values.toDate.getMonth() + 1), 2) + '-' +
          this.utilService.addZeroBeforeNumber((values.toDate.getDate()), 2),
      }


      this.fileOrderingService.postFileOrderBulkData(data)
        .subscribe(res => {
          if (res) {
            console.log("this is response::", res);
            this.dialogClose();
          }
        });


    } else {
      console.log('err');
    }
  }

}
