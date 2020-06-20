import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { SubscriptionService } from '../../../subscription.service';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { InvoiceComponent } from '../invoice/invoice.component';
import { EmailOnlyComponent } from '../email-only/email-only.component';

export interface PeriodicElement {
  Invoicenumber: string;
  date: string;
  Servicename: string;
  Billedto: string;
  status: string;
  Duedate: string;
  Amount: string;
  Balancedue: string;
}

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  isLoading = false;
  clientList: any;
  dataTOget: object;
  noData: string;
  advisorId: any;
  _clientData: any;
  list: any[];
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  uperDataToClient: any;
  @Input() isAdvisor = true;


  constructor(public subInjectService: SubscriptionInject, private eventService: EventService, private subService: SubscriptionService, public dialog: MatDialog) {
  }
  invoiceDesign: any;
  quotationDesignEmail: any;
  selectedInvoiceCount: any;
  countOfSelect: number;
  dataCount;

  @Input() upperData;
  displayedColumns: string[] = ['checkbox', 'date', 'Invoice number', 'Service name', 'Billed to', 'status', 'Duedate', 'Amount', 'Balance due', 'icons'];


  ngOnInit() {
    if(!this.isAdvisor) {
      this.displayedColumns = this.displayedColumns.slice(1,-1)
    }

    this.getInvoiceList();
    this.advisorId = AuthService.getAdvisorId();
    this.invoiceDesign = 'true';
    this.dataCount = 0;
  }

  getInvoiceList() {
    this.isLoading = true;
    const obj = {
      id: this.upperData.id, // pass here client ID as id
      module: 2,
      // 'clientId':this.clientData.id
    }; this.dataSource.data = [{}, {}, {}];
    this.subService.getInvoices(obj).subscribe(
      data => this.getInvoiceResponseData(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }
  getInvoiceResponseData(data) {
    this.isLoading = false;
    if (data == undefined) {
      this.dataSource.data = [];
      this.noData = "No Data Found";
    } else {
      // const ELEMENT_DATA = data;
      // this.invoiceClientData = data;
      data.forEach(item => item.selected = false);
      // this.dataSource = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this._clientData = this.dataSource;
    }
  }
  openEdit(edit) {
    this.invoiceDesign = edit;
    this.uperDataToClient = this.upperData
  }

  selectedInvoice(ele) {
    if (ele == false) {
      this.dataCount++;
    } else {
      this.dataCount--;
    }

  }

  changeSelect() {
    this.dataCount = 0;
    if (this.dataSource != undefined) {
      this.dataSource.filteredData.forEach(item => {
        if (item.selected) {
          this.dataCount++;
        }
      });
    }
  }

  selectAll(event) {
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
  openSendEmail() {
    const data = {
      advisorId: this.advisorId,
      clientData: this.upperData,
      templateType: 1, //2 is for quotation
      documentList: [],
      isInv: true
    };
    this.dataSource.filteredData.forEach(singleElement => {
      if (singleElement.selected) {
        data.documentList.push(singleElement);
      }
    });
    this.open(data, 'email');
  }

  // open(data, value) {

  //   const fragmentData = {
  //     flag: value,
  //     data: data,
  //     id: 1,
  //     state: 'open',
  //     componenName:EmailOnlyComponent
  //   };
  //   const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
  //     sideBarData => {
  //       if (UtilService.isDialogClose(sideBarData)) {
  //         rightSideDataSub.unsubscribe();
  //       }
  //     }
  //   );
  // }
  open(data, value) {
    if (this.isLoading) {
      return
    }
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open',
      componentName: EmailOnlyComponent
    };

    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getInvoiceList();

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );

  }
  formatter(data) {
    data = Math.round(data);
    return data;
  }

  getInvoiceListResponse(data) {
    data.forEach(singleData => {
      singleData.isChecked = false;
    });

    this.dataSource = data;
  }

  openInvoice(data, value, state) {
    data.isAdvisor = this.isAdvisor;

    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open',
      componentName: InvoiceComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        this.dataTOget = sideBarData;
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getInvoiceList();
          }
          rightSideDataSub.unsubscribe();
        }
      });
  }



  getCancelInvoiceSubscription(data) {
    this.ngOnInit();
  }
  openInvoicesESign(value, state) {
    this.subInjectService.rightSliderData(state);
    this.eventService.sliderData(value);
  }

  changeDisplay(value) {
    this.invoiceDesign = value;
    this.quotationDesignEmail = this.invoiceDesign;
  }

  display(data) {
    this.ngOnInit();
  }

  deleteModal(value) {
    this.list = [];
    let listIndex = [];
    this.dataSource.filteredData.forEach(singleElement => {
      if (singleElement.selected) {
        listIndex.push(this.dataSource.filteredData.indexOf(singleElement));
        this.list.push(singleElement.id);
      }
    });
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.subService.deleteInvoices(this.list).subscribe(
          data => {
            this.dataCount = 0;
            this.eventService.openSnackBar('invoice deleted successfully.', 'Dismiss');
            dialogRef.close(this.list);

          },
          error => this.eventService.showErrorMessage(error)
        );
        dialogRef.close(listIndex);

      },
      negativeMethod: () => {
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.length > 0) {
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
}
