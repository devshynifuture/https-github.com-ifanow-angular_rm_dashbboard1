import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';


import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { SubscriptionPopupComponent } from '../subscription-popup/subscription-popup.component';
import { SubscriptionService } from '../../../subscription.service';
import { ConsentTandCComponent } from '../consent-tand-c/consent-tand-c.component';
import { UtilService } from '../../../../../../../services/util.service';
import { AuthService } from '../../../../../../../auth-service/authService';
import { AddQuotationSubscriptionComponent } from 'src/app/component/protect-component/customers/component/common-component/add-quotation-subscription/add-quotation-subscription.component';
import { CommonFroalaComponent } from '../common-froala/common-froala.component';
import { EmailOnlyComponent } from '../email-only/email-only.component';
import { DatePipe } from '@angular/common';
import { RoleService } from 'src/app/auth-service/role.service';

export interface PeriodicElement {
  document: string;
  plan: string;
  date: string;
  sdate: string;
  cdate: string;
  status: string;
}


@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.scss']
})
export class QuotationsComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @Input() isAdvisor = true;
  noData: string;
  quotationData: any[];

  constructor(public subInjectService: SubscriptionInject, private subService: SubscriptionService, private eventService: EventService, public dialog: MatDialog,
    private subAService: SubscriptionService, private datePipe: DatePipe, public roleService: RoleService) {
    // this.subInjectService.closeRightSlider.subscribe(
    //   data => this.getQuotationDesignData(data)
    // );
    this.subInjectService.singleProfileData.subscribe(
      data => {
        if (data == 'true') {
          this.getQuotationsList();
        }
      }
    )
  }

  isLoading = false;
  quotationDesignEmail;
  quotationDesign;
  dataCount;
  _clientData;
  displayedColumns: string[] = ['checkbox', 'document', 'plan', 'date', 'sdate', 'status', 'send', 'icons'];
  changeEmail = 'footerChange';
  advisorId;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);

  @Input()
  set clientData(clientData) {
    this._clientData = clientData;
    this.getQuotationsList();
  }

  get clientData() {
    return this._clientData;
  }

  ngOnInit() {
    if (!this.isAdvisor) {
      this.displayedColumns = this.displayedColumns.slice(1, -2);
    }


    this.advisorId = AuthService.getAdvisorId();
    this.quotationDesign = 'true';
    // this.getQuotationsList();
    this.dataCount = 0;
  }
  changeSelect() {
    this.dataCount = 0;
    this.dataSource.filteredData.forEach(item => {
      if (item.selected) {
        this.dataCount++;
      }
    });
  }

  addQuotation(value) {
    const fragmentData = {
      flag: value,
      id: 1,
      state: 'open',
      componentName: AddQuotationSubscriptionComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isRefreshRequired(sideBarData)) {
          this.getQuotationsList();
        }
        rightSideDataSub ? rightSideDataSub.unsubscribe() : '';
      }
    );
  }
  Open(value, state, data) {
    if (this.isLoading) {
      return
    }
    if (this.roleService.subscriptionPermission.subModule.clients.subModule.quotationsCapabilityList[2].enabledOrDisabled == 2) {
      return;
    }
    data['sendEsignFlag'] = false;
    data['feeStructureFlag'] = data.documentText.includes('$service_fee');
    data['isAdvisor'] = (this.isAdvisor) ? true : false;
    data['isEmail'] = this.roleService.subscriptionPermission.subModule.clients.subModule.quotationsCapabilityList[4].enabledOrDisabled == 1 ? true : false;
    data['isDownload'] = this.roleService.subscriptionPermission.subModule.clients.subModule.quotationsCapabilityList[5].enabledOrDisabled == 1 ? true : false;
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state,
      componentName: CommonFroalaComponent
    };
    data.userEmailId = this._clientData.userEmailId
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getQuotationsList();
            this.dataCount = 0;
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );

  }

  getQuotationsList() {
    if (!this._clientData) {
      return
    }
    this.isLoading = true;
    const obj = {
      // clientId: 2970
      clientId: this._clientData.id
    };
    this.dataSource.data = [{}, {}, {}];
    this.subAService.getSubscriptionClientsQuotations(obj).subscribe(
      data => this.getQuotationsListResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }

  selectedInvoice() {
    this.dataCount = 0;
    if (this.dataSource != undefined) {
      this.dataSource.filteredData.forEach(item => {
        if (item.selected) {
          this.dataCount++;
        }
      });
    }
  }

  // /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected() {
  //   if (this.dataSource != undefined) {
  //     return this.dataCount === this.dataSource.filteredData.length;
  //   }
  // }

  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selectAll({ checked: false }) : this.selectAll({ checked: true });
  // }

  getQuotationsListResponse(data) {
    this.isLoading = false;
    if (data == undefined) {
      this.dataSource.data = [];
      this.noData = 'No Data Found';
    } else {
      data.forEach(singleData => {
        singleData['sentDateInFormat'] = this.datePipe.transform((singleData.sentDate) ? singleData.sentDate : undefined, "dd/MM/yyyy");
        singleData.selected = false;
      });
      // this.dataSource = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    }
  }

  openQuotationsESign(value, state) {
    this.subInjectService.rightSliderData(state);
    this.eventService.sliderData(value);
  }

  openRightSlider() {

  }

  getQuotationDesignData(data) {
    this.quotationDesign = data;
  }

  changeDisplay(value) {
    this.quotationDesign = value;
    this.quotationDesignEmail = this.quotationDesign;
  }

  list: any = [];

  deleteModal(deleteData) {
    this.list = [];
    if (deleteData == null) {
      this.dataSource.filteredData.forEach(singleElement => {
        if (singleElement.selected) {
          this.list.push(singleElement.id);
        }
      });
    }
    else {
      this.list = [deleteData.id];
    }
    const dialogData = {
      data: 'QUOTATION',
      header: 'DELETE',
      body: 'Are you sure you want to delete the document?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.subService.deleteClientDocumentsMultiple(this.list).subscribe(
          data => {
            this.eventService.openSnackBar('Document is deleted', 'Dismiss');
            // this.valueChange.emit('close');
            this.dataCount = 0;
            this.getQuotationsList();
            dialogRef.close(this.list);
            // this.getRealEstate();
          },
          error => this.eventService.showErrorMessage(error)
        );
      },
      negativeMethod: () => {
        this.list = []
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.list.length > 0) {
        const tempList = []
        this.dataSource.data.forEach(singleElement => {
          if (!singleElement.selected) {
            tempList.push(singleElement);
          }
        });
        this.dataSource.data = tempList;
      }
    });
  }

  openSendEmail(element) {
    this._clientData['clientId'] = this._clientData.id;
    this.quotationData = []
    const data = {
      advisorId: this.advisorId,
      clientData: this._clientData,
      templateType: 2, // 2 is for quotation
      documentList: [],
      showfromEmail: false
    };
    if (this.dataCount == 0) {
      this.quotationData.push(element);
      data.documentList = this.quotationData;
    } else {
      this.dataSource.filteredData.forEach(singleElement => {
        if (singleElement.selected) {
          data.documentList.push(singleElement);
        }
      });
    }
    this.open(data, 'emailOnly');
  }

  // open(data, value) {
  //   const fragmentData = {
  //     flag: value,
  //     data,
  //     id: 1,
  //     state: 'open',
  //     componentName:EmailOnlyComponent
  //   };
  //   const rightSideDataSub = this.subInjectService.changeUpperRightSliderState(fragmentData).subscribe(
  //     sideBarData => {
  //       if (UtilService.isDialogClose(sideBarData)) {
  //         if (UtilService.isRefreshRequired(sideBarData)) {
  //           this.getQuotationsList();

  //         }
  //         rightSideDataSub.unsubscribe();
  //       }
  //     }
  //   );
  // }
  open(data, value) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      componentName: EmailOnlyComponent,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getQuotationsList();


          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  openPopup(data) {
    const Fragmentdata = {
      flag: data,
    };
    const dialogRef = this.dialog.open(SubscriptionPopupComponent, {
      width: '70%',
      data: Fragmentdata,
      autoFocus: false,

    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  OpenConsent(data) {
    const Fragmentdata = {
      flag: data,
    };
    const dialogRef = this.dialog.open(ConsentTandCComponent, {
      width: '50%',
      height: '100%',
      data: Fragmentdata,
      autoFocus: false,

    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  closeDiv() {
    this.quotationDesign = 'true';
  }

  display(data) {
    this.ngOnInit();
  }

  viewQuotation(value, data) {
    // this.quotationDesign = value;
    // this.subInjectService.addSingleProfile(data);
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeUpperRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isRefreshRequired(sideBarData)) {
        }
        rightSideDataSub.unsubscribe();
      }
    );
  }

  selectAll(event) {
    // const checked = event.target.checked;
    // this.dataSource.forEach(item => item.selected = 'checked');

    this.dataCount = 0;
    if (this.dataSource != undefined) {
      this.dataSource.filteredData.forEach(item => {
        item.selected = event.checked;
        if (item.selected) {
          this.dataCount++;
        }
      });
    }
  }

  getSelctedQuotation() {

  }

}
