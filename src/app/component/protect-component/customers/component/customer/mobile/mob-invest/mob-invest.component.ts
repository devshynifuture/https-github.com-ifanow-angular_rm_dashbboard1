import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { detailStatusObj } from 'src/app/component/protect-component/AdviserComponent/transactions/transactions-list/transaction-detail/detailStatus';
import { OnlineTransactionService } from 'src/app/component/protect-component/AdviserComponent/transactions/online-transaction.service';

@Component({
  selector: 'app-mob-invest',
  templateUrl: './mob-invest.component.html',
  styleUrls: ['./mob-invest.component.scss']
})
export class MobInvestComponent implements OnInit {
  clientId: any;
  advisorId: any;
  clientData: any;
  recentTransactions: any[];
  transactionStatusList = [];
  sliderConfig = {
    slidesToShow: 1,
    infinite: true,
    variableWidth: true,
    outerEdgeLimit: true,
    "nextArrow": "<div style='position: absolute; top: 35%; right: 0; cursor: pointer;' class='nav-btn classNextArrow next-slide'><img src='/assets/images/svg/next-arrow.svg'></div>",
    "prevArrow": "<div style='position: absolute; top: 35%; left: -5px; z-index: 1; cursor: pointer;' class='nav-btn classNextArrow next-slide'><img src='/assets/images/svg/pre-arrow.svg'></div>",
  }
  familyMembers: any;
  selectedtTransaction: any;

  constructor(
    private customerService: CustomerService,
    public eventService: EventService,
    private utils: UtilService,
    private onlineTransact: OnlineTransactionService
  ) { }

  ngOnInit() {
    this.clientId = AuthService.getClientId()
    this.advisorId = AuthService.getAdvisorId()
    this.clientData = AuthService.getClientData()
    this.loadRecentTransactions();
    this.getFamilyMemberList();
  }

  getTnxStatus(id) {
    return UtilService.getTransactionStatusFromStatusId(id);
  }

  getFamilyMemberList() {

    const obj = {
      clientId: this.clientId,
      id: 0
    };
    this.customerService.getFamilyMembers(obj).subscribe(
      data => {
        this.getFamilyMemberListRes(data)
      });

  }

  getFamilyMemberListRes(data) {
    if (data && data.length > 0) {
      data = this.utils.calculateAgeFromCurrentDate(data);
      this.familyMembers = data;
    }
  }

  loadRecentTransactions() {
    const obj = {
      clientId: this.clientData.clientId,
      advisorId: this.advisorId,
      familyMemberId: 0
    }

    this.customerService.getRecentTransactions(obj).subscribe(res => {
      if (res == null) {
        this.recentTransactions = [];
      } else {
        // this.tabsLoaded.recentTransactions.hasData = true;
        this.recentTransactions = res;
      }
      // this.tabsLoaded.recentTransactions.dataLoaded = true;
      // this.tabsLoaded.recentTransactions.isLoading = false;
      // this.loaderFn.decreaseCounter();
    }, err => {
      // this.hasError = true;
      // this.tabsLoaded.recentTransactions.dataLoaded = false;
      // this.tabsLoaded.recentTransactions.isLoading = false;
      this.eventService.openSnackBar(err, "Dismiss")
      // this.loaderFn.decreaseCounter();
    })
  }

  carouselWheelEvent(carousel, event) {
    event.preventDefault();
    if (event.deltaY > 0) {
      carousel.slickNext();
    } else {
      carousel.slickPrev();
    }
  }

  selectTransaction(transactionData) {
    this.selectedtTransaction = transactionData;

    switch (true) {
      case (this.selectedtTransaction.transactionType == 'ORDER' || this.selectedtTransaction.transactionType == 'PURCHASE'):
        this.transactionStatusList = detailStatusObj.transactionDetailStatus.ORDER;
        break;
      case (this.selectedtTransaction.transactionType == 'REDEMPTION'):
        this.transactionStatusList = detailStatusObj.transactionDetailStatus.REDEMPTION;
        break;
      case (this.selectedtTransaction.transactionType == 'SWP'):
        this.transactionStatusList = detailStatusObj.transactionDetailStatus.SWP;
        break;
      case (this.selectedtTransaction.transactionType == 'SWITCH'):
        this.transactionStatusList = detailStatusObj.transactionDetailStatus.SWITCH;
        break;
      case (this.selectedtTransaction.transactionType == 'STP'):
        this.transactionStatusList = detailStatusObj.transactionDetailStatus.STP;
        break;
      case (this.selectedtTransaction.transactionType == 'SIP'):
        this.transactionStatusList = detailStatusObj.transactionDetailStatus.ORDER;
        break;
      default:
        break;
    }
    this.transactionStatusList.forEach(element => {
      (element.status <= transactionData.status) ? element.checked = true : element.checked = false;
    });
    if (transactionData.status == 7) {
      this.transactionStatusList = this.transactionStatusList.filter((item) => item.checked !== false);
    } else if (transactionData.status == 8) {
      this.transactionStatusList = this.transactionStatusList.filter((item) => item.checked !== false);
    }
  }

  refresh(data) {
    this.getTransactionDetail(data);
  }

  getTransactionDetail(data) {
    // this.isLoading = true;
    const obj = {
      id: data.id
    };
    this.onlineTransact.getTransactionDetail(obj).subscribe(
      responseData => {
        // this.isLoading = false;
        this.selectedtTransaction = responseData;
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

}
