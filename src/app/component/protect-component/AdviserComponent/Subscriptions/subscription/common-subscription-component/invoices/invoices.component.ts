import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { SubscriptionService } from '../../../subscription.service';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';

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


  constructor(public subInjectService: SubscriptionInject, private eventService: EventService, private subService: SubscriptionService, public dialog: MatDialog) {
  }
  invoiceDesign: any;
  quotationDesignEmail: any;
  selectedInvoiceCount: any;
  countOfSelect: number;
  dataCount;

  @Input() upperData;
  displayedColumns: string[] = ['checkbox', 'date', 'Invoice number', 'Service name', 'Billed to', 'status', 'Duedate', 'Amount', 'Balance due', 'icons'];
  dataSource;

  ngOnInit() {
    this.isLoading = true;
    this.dataSource = [{}, {}, {}];
    this.getInvoiceList();
    this.advisorId = AuthService.getAdvisorId();
    console.log('CLIENT INVOICE ');
    this.invoiceDesign = 'true';
    this.dataCount = 0;
  }

  getInvoiceList() {
    const obj = {
      id: 2970, // pass here client ID as id
      module: 2,
      // 'clientId':this.clientData.id
    };
    this.subService.getInvoices(obj).subscribe(
      data => this.getInvoiceResponseData(data)
    );
  }
  getInvoiceResponseData(data) {
    this.isLoading = false;
    if (data == undefined) {
      this.dataSource = undefined
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
    console.log('edit', edit);
  }

  selectedInvoice(ele) {
    console.log('invoice data', ele);
    if (ele == false) {
      this.dataCount++;
    } else {
      this.dataCount--;
    }

  }

  changeSelect(data) {
    this.dataCount = 0;
    if (this.dataSource != undefined) {
      this.dataSource.filteredData.forEach(item => {
        console.log('item item ', item);
        if (item.selected) {
          this.dataCount++;
        }
      });
    }
    // if(data.selected==false)
    // {
    //   data.selected = true;
    //   this.dataCount++;
    //   data.dataCountd =this.dataCount;
    // }else{
    //   data.selected = false;
    //   this.dataCount--;
    //   data.dataCountd =this.dataCount;
    // }
  }

  selectAll(event) {
    // const checked = event.target.checked;
    // this.dataSource.forEach(item => item.selected = 'checked');
    this.dataCount = 0;
    if (this.dataSource != undefined) {
      this.dataSource.filteredData.forEach(item => {
        //   if(item.selected==false)
        //   {
        //     item.selected = true;
        //     this.dataCount++;
        //   }else{
        //     item.selected = false;
        //     this.dataCount--;
        //   }
        // });
        item.selected = event.checked;
        if (item.selected) {
          this.dataCount++;
        }
        // if(item.dataCountd>=1){
        //   this.dataCount=1
        // }else{
        //   this.dataCount++
        // }
      });
    }
    // if(item.selected=="true"){
    //   this.dataCount++;
    // }else{
    //   this.dataCount--;
    // }

  }
  openSendEmail() {
    const data = {
      advisorId: this.advisorId,
      clientData: this.upperData,
      templateType: 1, //2 is for quotation
      documentList: [],
      isInv: true
    };
    this.dataSource.forEach(singleElement => {
      if (singleElement.selected) {
        data.documentList.push(singleElement);
      }
    });
    this.open(data, 'email');
  }

  open(data, value) {

    // this.eventService.sliderData(value);
    // this.subInjectService.rightSliderData(state);
    // this.subInjectService.addSingleProfile(data);

    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeUpperRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ');
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
    console.log('Invoice data for client', data);

    this.dataSource = data;
  }

  openInvoice(data, value, state) {

    // this.eventService.sliderData(value);
    // this.subInjectService.rightSliderData(state);
    // this.subInjectService.addSingleProfile(data);
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeUpperRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        this.dataTOget = sideBarData;
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ');
          rightSideDataSub.unsubscribe();
        }
      }

    );
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
    console.log(data);
    this.ngOnInit();
  }

  deleteModal(value) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        console.log('11111111111111111111111111111111111111111111');
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,


    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }
}
