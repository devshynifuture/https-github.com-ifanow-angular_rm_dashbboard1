import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from 'src/app/auth-service/authService';
import {CustomerService} from '../../../../customer.service';
import {EventService} from 'src/app/Data-service/event.service';
import {AddPortfolioComponent} from '../add-portfolio/add-portfolio.component';
import {MatDialog} from '@angular/material';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-portfolio-field',
  templateUrl: './portfolio-field.component.html',
  styleUrls: ['./portfolio-field.component.scss']
})
export class PortfolioFieldComponent implements OnInit {
  advisorId: any;
  clientId: any;
  portfolioList: any;
  familyWisePortfolio: any=[];
  portfolioName:any;
  @Output() outputEvent = new EventEmitter();
  portfolioForm =  this.fb.group({
    portfolioName: ["", [Validators.required]],
  });
  ownerIdData: any;
  constructor(private fb: FormBuilder, public dialog: MatDialog, private cusService: CustomerService, private eventService: EventService) { }
  ngOnInit() {
  }
  portfolioData = new FormControl();
  ownerlist:any;
  @Input() set owner(data) {
    // this.portfolioForm = data;
    console.log("owner", data);
    if(data != undefined)
    this.ownerlist = data.getCoOwnerName;
    this.portfolioName = data.portfolioName;
  }
  @Input() set checkValid(checkValid){
    this.checkFrom(checkValid)
  }

  @Input() set ownerId(data) {
    if (data == undefined) {
      return;
    }
    this.ownerIdData = data;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getPortfolioList()
    this.portfolioForm.get('portfolioName').setValue('');
    if(this.portfolioName != undefined){
     
        this.portfolioForm.get('portfolioName').setValue(this.portfolioName.value);
      
    }
  };

  getPortfolioList() {
    this.familyWisePortfolio = [];
    this.othersWisePortfolio = [];
  
    const obj =
    {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.cusService.getPortfolioDataList(obj).subscribe(
      data => this.getPortfolioListRes(data),
      error => this.eventService.showErrorMessage(error)
    )
  }

  othersWisePortfolio:any = []
  getPortfolioListRes(data) {
    let checkOwnerId = true;
    // this.familyWisePortfolio = data;
    // this.portfolioForm.get('portfolioName').setValue(this.portfolioName.value);
    data.forEach(element => {
      if (element.ownerList[0].familyMemberId == this.ownerIdData.familyMemberId) {
        checkOwnerId = true;
        this.familyWisePortfolio.push(element);
      }
      else{
        element.id = 0;
        this.othersWisePortfolio.push(element);
      }
    });
    console.log(this.familyWisePortfolio,this.othersWisePortfolio, "porfolio list", data);

    this.familyWisePortfolio.forEach(f=> {
      this.othersWisePortfolio.forEach((o,i) => {

        if(f.portfolioName == o.portfolioName){
          this.othersWisePortfolio.splice(i, 1);
        }
      });
    });
    let margeArry = [];
    margeArry = this.familyWisePortfolio.concat(this.othersWisePortfolio);
    this.familyWisePortfolio = margeArry;
    // (checkOwnerId) ? this.familyWisePortfolio : this.familyWisePortfolio = [];
    console.log(this.familyWisePortfolio);
  }



  delete(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.cusService.deletePortfolio([data.id]).subscribe(
          data => {
            this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
            dialogRef.close();
            this.getPortfolioList();
          },
          error => this.eventService.showErrorMessage(error)
        );
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

  openAddPortfolio(data) {
    console.log(this.portfolioData)
    if (!this.ownerIdData) {
      this.eventService.openSnackBar("please select owner", "Dismiss");
      return;
    }
    let obj:any
    if (data) {
      data['portfolioId'] = data.id;
      obj =
      {
        "familyMemberId":  data.ownerList[0].familyMemberId,
        // "ownerName": this.editApiData.portfolioOwner,
        "portfolioName": data.portfolioName,
        "id": data.portfolioId,
        "ownerList": data.ownerList,
        "stockList":data.stockList.length > 0? [
          {
            "ownerList": data.stockList.length > 0?data.stockList[0].ownerList:[],
            "valueAsOn": data.stockList.length > 0?new Date(data.stockList[0].valueAsOn):'',
            "currentMarketValue": data.stockList.length > 0?data.stockList[0].currentMarketValue:'',
            "amountInvested": data.stockList.length > 0?data.stockList[0].amountInvested:'',
            "id": data.stockList.length > 0?data.stockList[0].id:0,
            "stockType": 1,
            "scripNameId": data.scripNameId,
            "transactionorHoldingSummaryList":data.stockList.length > 0? data.stockList[0].transactionorHoldingSummaryList:[]
          }
        ]:[]
      }
    }
    else{
      obj =
      {
        "id":null,
        "clientId": this.clientId,
        "advisorId": this.advisorId,
        "ownerList": this.ownerlist.value,
        "familyMemberId":this.ownerIdData.familyMemberId,
        "portfolioName":""
        // "portfolioName": this.portFolioData,
        // "familyMemberId": this.familyMemberId
      }
    }
        // this.cusService.addPortfolio(obj).subscribe(
        //   data => {
        //     dialogRef.close();
        //     this.eventService.openSnackBar("portfolio is added", "Dismiss");
        //     this.getPortfolioList();
        //   },
        //   error => this.eventService.showErrorMessage(error)
        // )

    const dialogRef = this.dialog.open(AddPortfolioComponent, {
      width: '390px',
      height: '220px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result,'The dialog was closed');
      if(result){
        obj.portfolioName = result;
        // obj.ownerList[0].familyMemberId = this.ownerIdData.familyMemberId;
        if(data) {
          this.cusService.editStockData(obj).subscribe(
            data =>{
              this.familyWisePortfolio = [];
              this.getPortfolioList();
            }, 
            error =>{
              this.eventService.showErrorMessage(error)
            }
          )
        }else{
          this.cusService.addAssetStocks(obj).subscribe(
            data => {
             
              this.eventService.openSnackBar("portfolio is added", "Dismiss");
              this.getPortfolioList();
            },
            error => this.eventService.showErrorMessage(error)
          )
        }
        }
    });
  }
  selectPortfolio(data) {

    this.outputEvent.emit(data);

  }

  checkFrom(checkValid){
    if(checkValid){
      if(this.portfolioForm.invalid){
        this.portfolioForm.get('portfolioName').markAsTouched()
      }
    }
  }
}
