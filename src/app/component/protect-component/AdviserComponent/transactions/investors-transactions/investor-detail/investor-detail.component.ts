import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { FileUploadService } from '../../../../../../services/file-upload.service';
import { apiConfig } from '../../../../../../config/main-config';
import { appConfig } from '../../../../../../config/component-config';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { OnlineTransactionService } from '../../online-transaction.service';
import { EventService } from '../../../../../../Data-service/event.service';
import { MatDialog } from '@angular/material';
import { UtilService } from 'src/app/services/util.service';
import { ConfirmUploadComponent } from './confirm-upload/confirm-upload.component';

@Component({
  selector: 'app-investor-detail',
  templateUrl: './investor-detail.component.html',
  styleUrls: ['./investor-detail.component.scss']
})
export class InvestorDetailComponent implements OnInit {

  num: any = 0;
  numlimit: any;
  num1: any = 0;
  numlimit1: any;
  data;
  details: any;
  transactionData: any;
  isLoading = false;
  isFileUploading = false;
  barWidth1: any = '0%';
  barWidth2: any = '0%';

  statusData = [
    {
      name: 'Request sent', checked: true, status: 0
    },
    {
      name: 'Form uploaded', checked: false, status: 1
    },
    {
      name: 'Investment Ready', checked: false, status: 2
    }
  ];
  statusDetails: any;
  file: any;
  loader2: boolean;
  loader1: boolean;

  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
    private eventService: EventService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.details = this.data;
    console.error('InvestorDetailComponent data : ', this.data);

    this.getFormUploadDetail();
    this.getDataStatus(this.details);
  }

  uploadFormFile(event) {// for pro build param added

  }

  uploadFormImageUpload(event) {// for pro build param added

  }


  recall() {
    if (this.num <= this.numlimit) {
      this.addbarWidth(this.num);
    }
  }

  addbarWidth(c) {
    this.num = c;
    setTimeout(() => {
      if (this.num <= 99) {
        this.num++;
      }
      this.barWidth1 = this.num + '%';
      console.log("1");
      this.recall();
    }, 500);

  }

  recall1() {
    if (this.num1 <= this.numlimit1) {
      this.addbarWidth(this.num1);
    }
  }

  addbarWidth1(c) {
    this.num1 = c;
    setTimeout(() => {
      if (this.num1 <= 99) {
        this.num1++;
      }
      this.barWidth2 = this.num1 + '%';
      console.log("1");
      this.recall1();
    }, 500);

  }


  getDataStatus(data) {
    // this.isLoading = true;
    this.statusDetails = this.statusData;
    if (data.tpUserCredFamilyMappingId && data.tpUserCredFamilyMappingId > 0) {
      this.statusDetails[2].checked = true;
    }
    // this.isLoading = false;
  }

  getInvestorStatus() {
    const obj = { id: this.details.id };
    this.isLoading = true;

    this.onlineTransact.getInvestorStatusCheck(obj).subscribe(resultData => {
      this.statusData[2].checked = true;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.eventService.openSnackBar(error, 'Discuss');
      this.statusData[2].checked = false;
    });
  }

  getFormUploadDetail() {
    const obj = { id: this.details.id };
    this.isLoading = true;
    this.onlineTransact.getInvestorFormUploadDetail(obj).subscribe(resultData => {
      /*if (this.details.aggregatorType == 2) {
        this.statusData[1].checked = true;
      } else*/
      if (resultData && resultData.length > 1) {
        this.statusData[1].checked = true;
      }
      this.isLoading = false;
    }, error => {
      console.error('investor detail form upload data : ', error);
      this.isLoading = false;
      // this.eventService.openSnackBar(error, 'discuss');
      this.statusData[1].checked = false;
    });
  }

  refresh(value) {
    this.getDataStatus(value);
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

  openUploadConfirmBox(value, typeId) {
    console.log(this.details)
    if (typeId == 1 && this.barWidth1 > 0) {
      return
    }
    if (typeId == 4 && this.barWidth2 > 0) {
      return
    }
    const dialogData = {
      data: value,
      header: 'UPLOAD',
      body: UtilService.transactionDocumentsRequired(this.details.taxMasterId),
      // body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'CHOOSE',
      positiveMethod: (fileData) => {
        dialogRef.close();

      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmUploadComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.numlimit = 30;
        if (typeId == 1) {
          this.addbarWidth(1);
          this.loader1 = true
        } else {
          this.addbarWidth1(1);
          this.loader2 = true
        }
        this.getFileDetails(typeId, result)
      }
    });
  }

  getFileDetails(documentType, e) {
    if (e.target.files[0].type !== 'image/tiff') {
      this.eventService.openSnackBar("Please upload the document in TIFF format only with max size up to 5MB", "Dimiss")
      return;
    }
    if (documentType == 1) {
      this.addbarWidth(30);
      this.loader1 = true
    } else {
      this.addbarWidth1(30);
      this.loader2 = true
    }
    this.file = e.target.files[0];
    const file = e.target.files[0];
    const requestMap = {
      tpUserRequestId: this.details.id,
      documentType
    };
    this.isFileUploading = true;
    // this.addbarWidth(50);
    if (documentType == 1) {
      this.addbarWidth(50);
      this.loader1 = true
    } else {
      this.addbarWidth1(0);
      this.loader2 = true
    }
    FileUploadService.uploadFileToServer(apiConfig.TRANSACT + appConfig.UPLOAD_FILE_IMAGE,
      file, requestMap, (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
        this.isFileUploading = false;
        if (documentType == 1) {
          this.addbarWidth(100);
          this.loader1 = true
        } else {
          this.addbarWidth1(100);
          this.loader2 = true
        }
        if (status == 200) {
          (documentType == 1) ? this.loader1 = false : this.loader2 = false;
          const responseObject = JSON.parse(response);
          this.eventService.openSnackBar('File uploaded successfully');
          this.getFormUploadDetail();
        } else {
          (documentType == 1) ? this.loader1 = false : this.loader2 = false
          const responseObject = JSON.parse(response);
          this.eventService.openSnackBar(responseObject.message, 'Dismiss', null, 60000);
        }
      });
  }
}
