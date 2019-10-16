import { Component, OnInit, Input } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { SubscriptionService } from '../../../subscription.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
export interface PeriodicElement {
  Invoicenumber: string;
  date: string;
  Servicename: string;
  Billedto: string;
  status:string;
  Duedate:string;
  Amount:string;
  Balancedue:string;
 }
@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  invoiceDesign: any;
  quotationDesignEmail: any;
  selectedInvoiceCount: any;
  countOfSelect: number;
  dataCount;
 

  constructor(public subInjectService:SubscriptionInject, private eventService:EventService, private subService:SubscriptionService,public dialog: MatDialog) { }

  ngOnInit() {
    this.getInvoiceList();
    console.log("CLIENT INVOICE ")
    this.invoiceDesign='true';
    this.dataCount = 0;
  }
  @Input() upperData;
  displayedColumns: string[] = ['checkbox','date','Invoice number','Service name','Billed to', 'status', 'Duedate','Amount','Balance due','icons'];
  dataSource;

  getInvoiceList()
  {
    let obj={
     'id':2970, // pass here client ID as id
     'module':2,
     //'clientId':this.clientData.id
    }
   this.subService.getInvoices(obj).subscribe(
     data => this.getInvoiceListResponse(data)
   )
  }
  selectedInvoice(ele){
    console.log("invoice data",ele)
    if(ele==false){
      this.dataCount++;
    }else{
      this.dataCount--;
    }
    
  }
  changeSelect(data) {
    this.dataCount = 0;
    this.dataSource.forEach(item => {
      console.log('item item ', item);
      if (item.selected) {
        this.dataCount++;
      }
    });
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
    this.dataSource.forEach(item => {
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
    // if(item.selected=="true"){
    //   this.dataCount++;
    // }else{
    //   this.dataCount--;
    // }

  }
  formatter(data)
  {
    data=Math.round(data);
    return data;
  }
  getInvoiceListResponse(data)
  {
    data.forEach(singleData => {
      singleData.isChecked = false;
    });
    console.log('Invoice data for client',data);

    this.dataSource=data
  }
  openInvoice(data,value,state)
  {

    this.eventService.sliderData(value);
    this.subInjectService.rightSliderData(state)
    this.subInjectService.addSingleProfile(data)

  }
  openInvoicesESign(value, state) {
    this.subInjectService.rightSliderData(state)
    this.eventService.sliderData(value)
  }
  changeDisplay(value) {
    this.invoiceDesign = value;
    this.quotationDesignEmail=this.invoiceDesign;
  }
  display(data)
  {
    console.log(data)
    this.ngOnInit()
  }
  deleteModal(value) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete the document GD?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        console.log('11111111111111111111111111111111111111111111');
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    }
    console.log(dialogData+"11111111111111");

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,


    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }
}
