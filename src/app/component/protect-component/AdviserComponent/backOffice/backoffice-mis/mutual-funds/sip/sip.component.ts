import {Component, OnInit, Input} from '@angular/core';
import {BackOfficeService} from '../../../back-office.service';
import {EventService} from 'src/app/Data-service/event.service';
import {AuthService} from 'src/app/auth-service/authService';
import * as Highcharts from 'highcharts';
import {ReconciliationService} from '../../../backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import {MfServiceService} from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';


@Component({
  selector: 'app-sip',
  templateUrl: './sip.component.html',
  styleUrls: ['./sip.component.scss']
})
export class SipComponent implements OnInit {
  teamMemberId = 2929;
  sipCount;
  sipComponent = true;
  sipcomponentWise;
  sipshow = false;
  showMainWrapperFlag = true;
  advisorId: any;
  clientId: any;
  expiringSip = [{}, {}, {}];
  expiredSip = [{}, {}, {}];
  rejectionSip = [{}, {}, {}];
  sipPanCount: any;
  wbrCount: any;
  clientWithoutSip = 0;
  newSipObj: any;
  ceaseSipObj: any;
  arnRiaList = [];
  arnRiaId = -1;
  viewMode: string;
  isLoading = true;
  parentId;
  adminAdvisorIds = [];
  isExpiringLoading = true;
  isExpiredLoading = true;
  isRejectionLoading = true;
  mode: any;
  objTosend: { arnRiaId: any; parentId: any; adminAdvisorIds: any; arnRiaValue: number; viewMode: string; };
  loaderValue: number;

  constructor(private backoffice: BackOfficeService, private dataService: EventService, private reconService: ReconciliationService, private mfService: MfServiceService) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.parentId = AuthService.getAdminAdvisorId();
    this.clientId = AuthService.getClientId();
    this.arnRiaId = -1;
    this.viewMode = 'All';
    this.teamMemberListGet();
    // if (this.parentId !== 0) {
    //   this.getArnRiaList();
    // } else {
    //   this.initPoint();
    // }
  }

  teamMemberListGet() {
    this.reconService.getTeamMemberListValues({advisorId: this.advisorId})
      .subscribe(data => {
        if (data && data.length !== 0) {
          console.log('team members: ', data);
          data.forEach(element => {
            this.adminAdvisorIds.push(element.adminAdvisorId);
          });
          if (this.parentId !== 0) {
            this.getArnRiaList();
          } else {
            this.initPoint();
          }
          // this.handlingDataVariable();
        } else {
          this.adminAdvisorIds = [this.advisorId];
          if (this.parentId !== 0) {
            this.getArnRiaList();
          } else {
            this.initPoint();
          }
          // this.handlingDataVariable();
          // this.eventService.openSnackBar('No Team Member Found', 'Dismiss');
        }
      }, err => {
        if (this.parentId !== 0) {
          this.getArnRiaList();
        } else {
          this.initPoint();
        }
        // console.log(err);
      });
  }

  initPoint() {
    this.newSip();
    this.sipCountGet();
    this.expiredGet();
    this.expiringGet();
    this.sipRejectionGet();
    this.getSipPanCount();
  }

  changeArnRiaValue(item) {
    this.arnRiaId = item.number;
    if (item.number != 'All') {
      this.arnRiaId = item.id;
    } else {
      this.arnRiaId = -1;
    }
    this.viewMode = item.number;
    this.initPoint();
    this.objTosend = {
      arnRiaId: this.arnRiaId,
      parentId: this.parentId,
      adminAdvisorIds: this.adminAdvisorIds,
      viewMode: this.viewMode,
      arnRiaValue: this.arnRiaId
    };
  }

  getArnRiaList() {
    this.backoffice.getArnRiaList(this.advisorId).subscribe(
      data => {
        if (data) {
          this.arnRiaList = data;
          // this.advisorId = 0;
          const obj = {
            number: 'All'
          };
          this.arnRiaList.unshift(obj);
          this.initPoint();
        } else {
          this.dataService.openSnackBar('No Arn Ria List Found', 'Dismiss');
          this.arnRiaList = [];
          this.initPoint();

        }
      }
    );
  }

  sipCountGet() {
    this.isLoading = true;
    const obj = {
      advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
      arnRiaDetailsId: this.arnRiaId,
      parentId: this.parentId
    };
    this.backoffice.getSipcountGet(obj).subscribe(
      data => this.getsipCountGet(data),
      err => {
        this.isLoading = false;
        this.sipCount = '';
      }
    );
  }

  getsipCountGet(data) {
    this.isLoading = false;
    this.sipCount = data;
  }

  getFilerrorResponse(err) {
    this.dataService.openSnackBar(err, 'Dismiss');
  }

  showMainWrapper() {
    this.sipshow = false;
    this.showMainWrapperFlag = true;
  }

  display(value) {
    this.sipComponent = true;
    setTimeout(() => {
      this.pieChart('pieChartSip');
    }, 1000);
  }

  getAllSip() {
    const obj = {
      limit: 20,
      offset: 0,
      advisorId: this.advisorId,
      arnRiaDetailsId: this.arnRiaId,
      parentId: this.parentId
    };
    this.backoffice.allSipGet(obj).subscribe(
      data => {
      }
    );
  }

  expiredGet() {
    this.isExpiredLoading = true;
    const obj = {
      advisorId: (this.parentId) ? 0 : (this.arnRiaId != -1) ? 0 : [this.adminAdvisorIds],
      arnRiaDetailsId: this.arnRiaId,
      limit: 10,
      offset: 0,
      parentId: this.parentId
    };
    this.backoffice.GET_expired(obj).subscribe(
      data => {
        this.isExpiredLoading = false;
        if (data) {
          const res = this.filterByDate(data);
          this.expiredSip = res;
        } else {
          this.expiredSip = [];
        }
      },
      err => {
        this.isExpiredLoading = false;
        this.expiredSip = [];
      }
    );
  }

  expiringGet() {
    this.isExpiringLoading = true;
    const obj = {
      advisorId: (this.parentId) ? 0 : (this.arnRiaId != -1) ? 0 : [this.adminAdvisorIds],
      arnRiaDetailsId: this.arnRiaId,
      limit: 10,
      offset: 0,
      parentId: this.parentId
    };
    this.backoffice.GET_EXPIRING(obj).subscribe(
      data => {
        this.isExpiringLoading = false;
        if (data) {
          const res = this.filterByDate(data);
          this.expiringSip = res;
        } else {
          this.expiringSip = [];
        }

      },
      err => {
        this.isExpiringLoading = false;
        this.expiringSip = [];

      }
    );
  }

  sipRejectionGet() {
    const obj = {
      advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
      arnRiaDetailsId: this.arnRiaId,
      limit: 10,
      offset: 0,
      parentId: this.parentId
    };
    this.backoffice.GET_SIP_REJECTION(obj).subscribe(
      data => {
        if (data) {
          this.isLoading = false;
          this.rejectionSip = data;
        } else {
          this.isLoading = false;
          this.rejectionSip = [];
        }
      },
      err => {
        this.isLoading = false;
        this.rejectionSip = [];
      }
    );
  }

  getSipPanCount() {
    this.isLoading = true;
    const obj = {
      advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
      arnRiaDetailsId: this.arnRiaId,
      parentId: this.parentId
    };
    this.backoffice.sipSchemePanCount(obj).subscribe(
      data => {
        this.sipPanCount = data.sipCount;
        this.getWbrPanCount();
      },
      err => {
        this.sipPanCount = '';
        this.clientWithoutSip = 0;

      }
    );
  }

  getWbrPanCount() {
    const obj = {
      advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
      arnRiaDetailsId: this.arnRiaId,
      parentId: this.parentId
    };
    this.backoffice.Wbr9anCount(obj).subscribe(
      data => {
        this.isLoading = false;
        this.wbrCount = data.folioCount;
        this.clientWithoutSip = (this.sipPanCount / data.folioCount) * 100;
        this.clientWithoutSip = (!this.clientWithoutSip || this.clientWithoutSip == Infinity) ? 0 : this.clientWithoutSip;
        (this.clientWithoutSip > 100) ? this.clientWithoutSip = 100 : this.clientWithoutSip;
      }
    );
  }

  amcwise() {
    this.sipshow = true;
    this.showMainWrapperFlag = false;
  }

  filterByDate(data) {
    data = data.filter(item => item.dateDiff <= 90);
    data = this.mfService.sorting(data, 'dateDiff');
    return data;
  }

  amcWise(value, mode) {
    this.mode = mode;
    this.sipcomponentWise = value;
    this.sipComponent = false;
    this.objTosend = {
      arnRiaId: this.arnRiaId,
      parentId: this.parentId,
      adminAdvisorIds: this.adminAdvisorIds,
      viewMode: this.viewMode,
      arnRiaValue: this.arnRiaId
    };
  }

  newSip() {
    const obj = {
      advisorId: this.parentId ? 0 : [this.adminAdvisorIds],
      arnRiaDetailsId: this.arnRiaId,
      parentId: this.parentId
    };
    this.backoffice.newSipGet(obj).subscribe(
      data => {
        if (data) {
          this.newSipObj = data;
          this.newSipObj[0].dateDiff = 30;
          this.newSipObj[1].dateDiff = 60;
          this.newSipObj[2].dateDiff = 90;
          this.newSipObj[3].dateDiff = 120;
          this.newSipObj[4].dateDiff = 150;
          this.newSipObj[5].dateDiff = 180;
          this.ceaseSip();

        }


      });
  }

  ceaseSip() {
    const obj = {
      advisorId: this.parentId ? 0 : [this.adminAdvisorIds],
      arnRiaDetailsId: this.arnRiaId,
      parentId: this.parentId
    };
    this.backoffice.ceaseSipGet(obj).subscribe(
      data => {
        this.ceaseSipObj = data;

        this.ceaseSipObj[0].dateDiff = 30;
        this.ceaseSipObj[1].dateDiff = 60;
        this.ceaseSipObj[2].dateDiff = 90;
        this.ceaseSipObj[3].dateDiff = 120;
        this.ceaseSipObj[4].dateDiff = 150;
        this.ceaseSipObj[5].dateDiff = 180;
        this.pieChart('pieChartSip');

      }
    );
  }

  getValuesForGraph(days) {
    const obj = {
      newSipAmount: null,
      ceaseSipAmount: null,
      net: null
    };
    obj.newSipAmount = this.newSipObj.filter(element => element.dateDiff == days);
    obj.newSipAmount = (obj.newSipAmount[0].sipAmount) ? obj.newSipAmount[0].sipAmount : 0;

    obj.ceaseSipAmount = this.ceaseSipObj.filter(element => element.dateDiff == days);
    obj.ceaseSipAmount = (obj.ceaseSipAmount[0].sipAmount) ? obj.ceaseSipAmount[0].sipAmount : 0;

    obj.net = obj.newSipAmount - obj.ceaseSipAmount;
    return obj;
  }

  pieChart(id) {
    const obj30 = this.getValuesForGraph(30);
    const obj60 = this.getValuesForGraph(60);
    const obj90 = this.getValuesForGraph(90);
    const obj120 = this.getValuesForGraph(120);
    const obj150 = this.getValuesForGraph(150);
    const obj180 = this.getValuesForGraph(180);
    Highcharts.chart('pieChartSip', {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: ['0-30days', '31-60days ', '61-90days', '91-120days', '121-150days', '151-180days']
      },
      credits: {
        enabled: false
      },
      series: [{
        type: undefined,
        name: 'New',
        color: '#70ca86',
        data: [obj30.newSipAmount, obj60.newSipAmount, obj90.newSipAmount, obj120.newSipAmount, obj150.newSipAmount, obj180.newSipAmount]
      }, {
        type: undefined,
        name: 'cease',
        color: '#f05050',
        data: [obj30.ceaseSipAmount, obj60.ceaseSipAmount, obj90.ceaseSipAmount, obj120.ceaseSipAmount, obj150.ceaseSipAmount, obj180.ceaseSipAmount]
      }, {
        type: undefined,
        name: 'net',
        color: '#55c3e6',
        data: [obj30.net, obj60.net, obj90.net, obj120.net, obj150.net, obj180.net]
      }]
    });
  }


}
