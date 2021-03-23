import { EnumDataService } from './../../../../../../services/enum-data.service';
import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { BackOfficeService } from '../../back-office.service';

@Component({
  selector: 'app-status-report',
  templateUrl: './status-report.component.html',
  styleUrls: ['./status-report.component.scss']
})
export class StatusReportComponent implements OnInit {
  inputData: any;
  userInfo: any;
  refreshCount: any;
  displayedColumns: string[] = ['name', 'mfoverview', 'status'];
  clientDetails = [];
  isLoading: boolean;
  dataForFilter: any[];
  showResend = false;
  selectAll = false;
  activeFilter;
  disabledResend: boolean = false;
  progressBar: number;
  constructor(
    private subInjectService: SubscriptionInject,
    private backOfficeService: BackOfficeService,
    public enumDataService: EnumDataService,
  ) {
    this.userInfo = AuthService.getUserInfo();
    console.log('info ===', this.userInfo);
  }
  @Input()
  set data(data) {
    this.inputData = data;
    if (data) {
      console.log('This is Input data of proceed ', data);
    }
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.isLoading = false;
    this.refresh();
    this.getLog();
  }
  resendNow(flag) {
    this.disabledResend = true
    const obj = {
      id: this.clientDetails[0].mfBulkEmailRequestId,
      clientIds: []
    };
    const list = [];
    if (flag = "fornotSent") {
      this.clientDetails.forEach(element => {
        if (element.status == 0) {
          list.push(element.clientId);
        }
      });
    } else {
      this.clientDetails.forEach(element => {
        if (element.checked == true) {
          list.push(element.clientId);
        }
      });
    }
    obj.clientIds = list;
    this.backOfficeService.resendNow(obj).subscribe(
      data => {
        if (data) {
          console.log('getLog ==', data);
          this.close(true);
        }
        this.isLoading = false;
      }
    );
  }
  selectAllData(event, data) {
    this.showResend = true;
    this.selectAll = event.checked;
    if (this.selectAll == true) {
      this.clientDetails.forEach(element => {
        element.checked = true;
      });
    } else {
      this.showResend = false;
      this.clientDetails.forEach(element => {
        element.checked = false;
      });
    }
  }
  selectToResend(event, value) {
    this.showResend = true;
    value.checked = event.checked;
    let checkList = this.dataForFilter.filter((x) => x.checked == true);
    if (checkList.length == 0) {
      this.showResend = false
    }
  }
  filterData(type) {
    if (type == 'ALL') {
      this.clientDetails = this.dataForFilter;
      this.displayedColumns = ['name', 'mfoverview', 'status'];
    } else if (type == 'SENT') {
      this.clientDetails = this.dataForFilter.filter((x) => x.status == 1);
      this.displayedColumns = ['name', 'mfoverview', 'status'];
    } else if (type == 'NOT SENT') {
      this.clientDetails = this.dataForFilter.filter((x) => x.status == 0);
      this.displayedColumns = ['checkbox', 'name', 'mfoverview', 'status'];
    }
  }
  refresh() {
    const obj = {
      id: this.inputData.id/// 5125
    };
    this.backOfficeService.refreshCount(obj).subscribe(
      data => {
        console.log('refreshCount ==', data);
        this.refreshCount = data;
        console.log(this.refreshCount);
        this.progressBar = (this.refreshCount.emailSentCount / this.inputData.clientCount) * 100
      }
    );
  }
  getLog() {
    this.isLoading = true;
    const obj = {
      mfBulkEmailRequestId: this.inputData.id/// 5125
    };
    this.backOfficeService.getLog(obj).subscribe(
      data => {
        if (data) {
          console.log('getLog ==', data);
          this.clientDetails = data;
          this.clientDetails.forEach(element => {
            element.checked = false;
            if (element.email) {
              element.email = element.email.split(",")
            }
          });
          this.dataForFilter = this.clientDetails;
          console.log('clientDetails', this.clientDetails);
        } else {
          this.clientDetails = [];
        }
        this.isLoading = false;
      }
    );
  }
  close(flag) {
    this.subInjectService.changeNewRightSliderState({
      state: 'close', refreshRequired: flag
    });
  }
}
