import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from './../../../../../../services/util.service';
import { SubscriptionInject } from './../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SupportService } from '../../../support.service';
import { EventService } from '../../../../../../Data-service/event.service';
import { FileOrderingUploadService } from '../../file-ordering-upload.service';
import { ReconciliationService } from '../../../../AdviserComponent/backOffice/backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import { MY_FORMATS2 } from '../../../../../../constants/date-format.constant';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { default as _rollupMoment } from 'node_modules/moment/src/moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter } from 'saturn-datepicker';


const moment = _rollupMoment;
@Component({
  selector: 'app-file-ordering-setup',
  templateUrl: './file-ordering-setup.component.html',
  styleUrls: ['./file-ordering-setup.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class FileOrderingSetupComponent implements OnInit {

  constructor(
    private subscriptionInject: SubscriptionInject,
    private fb: FormBuilder,
    private utilService: UtilService,
    private supportService: SupportService,
    private eventService: EventService,
    private fileOrderingService: FileOrderingUploadService,
    private reconService: ReconciliationService
  ) { }

  data;
  lastPastDate: Date = new Date('1 Jan 1990');
  fileTypeList: any[] = [];
  presentDate = new Date();
  rmId = AuthService.getRmId() ? AuthService.getRmId() : 0;

  historicalFileBulkOrderingForm = this.fb.group({
    rtId: [, Validators.required],
    fileTypeId: [, Validators.required],
    fromDate: [moment(), Validators.required],
    toDate: [moment(), Validators.required]
  });

  rtaList = []

  // setDateValidation() {
  //   this.historicalFileBulkOrderingForm.get('rtId').value === '1' ?
  //     this.lastPastDate = new Date('1 Jan, 1993') : this.lastPastDate = new Date('1 Jan, 1990')
  // }

  ngOnInit() {
    console.log("sent data::::", this.data);
    this.getRtaList();
  }

  getRtaList() {
    this.reconService.getRTListValues({})
      .subscribe(res => {
        if (res && res.length !== 0) {
          res.forEach(element => {
            if (element.name !== 'SUNDARAM' && element.name !== 'PRUDENT' && element.name !== 'NJ_NEW' && element.name !== 'NJ') {
              this.rtaList.push({
                name: element.name == 'FRANKLIN_TEMPLETON' ? 'FRANKLIN' : element.name,
                value: element.id,
                type: 'rta'
              });
            }
          });
          this.getFileTypeName();
        } else {
          this.eventService.openSnackBar("Error In Fetching RTA List", "DISMISS");
        }
      });
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
        rtId: values.rtId.value,
        fileTypeId: values.fileTypeId,
        fromDate: values.fromDate.getFullYear() + "-" +
          this.utilService.addZeroBeforeNumber((values.fromDate.getMonth() + 1), 2) + '-' +
          this.utilService.addZeroBeforeNumber((values.fromDate.getDate()), 2),
        toDate: values.toDate.getFullYear() + "-" +
          this.utilService.addZeroBeforeNumber((values.toDate.getMonth() + 1), 2) + '-' +
          this.utilService.addZeroBeforeNumber((values.toDate.getDate()), 2),
      }


      // this.fileOrderingService.postFileOrderBulkData(data)
      //   .subscribe(res => {
      //     if (res) {
      //       console.log("this is response::", res);
      //       this.dialogClose();
      //     }
      //   });
      console.log(data);

    } else {
      console.log('err');
    }
  }

}
