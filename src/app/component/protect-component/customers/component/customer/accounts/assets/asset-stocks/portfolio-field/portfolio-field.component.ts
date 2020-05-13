import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from 'src/app/auth-service/authService';
import {CustomerService} from '../../../../customer.service';
import {EventService} from 'src/app/Data-service/event.service';
import {AddPortfolioComponent} from '../add-portfolio/add-portfolio.component';
import {MatDialog} from '@angular/material';
import {FormBuilder, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-portfolio-field',
  templateUrl: './portfolio-field.component.html',
  styleUrls: ['./portfolio-field.component.scss']
})
export class PortfolioFieldComponent implements OnInit {
  advisorId: any;
  clientId: any;
  portfolioList: any;
  familyWisePortfolio: any[];
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
  @Input() set owner(data) {
    // this.portfolioForm = data;
    console.log("owner", data);
    if(data != undefined)
    this.portfolioName = data.value.portfolioName
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
      this.portfolioForm.get('portfolioName').setValue(this.portfolioName);
    }
  };
  getPortfolioList() {
    const obj =
    {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.cusService.getPortfolioList(obj).subscribe(
      data => this.getPortfolioListRes(data),
      error => this.eventService.showErrorMessage(error)
    )
  }
  getPortfolioListRes(data) {
    console.log(data)
    let checkOwnerId = false;
    this.familyWisePortfolio = [];
    data.forEach(element => {
      if (element.ownerList[0].familyMemberId == this.ownerIdData.familyMemberId) {
        checkOwnerId = true;
        this.familyWisePortfolio.push(element)
      }
    });
    (checkOwnerId) ? this.familyWisePortfolio : this.familyWisePortfolio = [];
    console.log(this.familyWisePortfolio)
    
  }
  openAddPortfolio() {
    console.log(this.portfolioData)
    if (this.ownerIdData) {
      this.eventService.openSnackBar("please select owner", "Dismiss");
      return;
    }
    const dialogData =
    {
      positiveMethod: () => {
        const obj =
        {
          "clientId": this.clientId,
          "advisorId": this.advisorId,
          // "portfolioName": this.portFolioData,
          // "familyMemberId": this.familyMemberId
        }
        this.cusService.addPortfolio(obj).subscribe(
          data => {
            dialogRef.close();
            this.eventService.openSnackBar("portfolio is added", "Dismiss");
            this.getPortfolioList();
          },
          error => this.eventService.showErrorMessage(error)
        )
      },

    }
    const dialogRef = this.dialog.open(AddPortfolioComponent, {
      width: '390px',
      height: '220px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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
