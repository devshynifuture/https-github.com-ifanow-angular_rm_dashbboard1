import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-other-payables',
  templateUrl: './other-payables.component.html',
  styleUrls: ['./other-payables.component.scss']
})
export class OtherPayablesComponent implements OnInit {
  displayedColumns = ['no', 'name', 'dateOfReceived', 'creditorName', 'amountBorrowed', 'interest', 'dateOfRepayment', 'outstandingBalance', 'description','status', 'icons'];
  // dataSource = ELEMENT_DATA;
  advisorId: any;
  dataSource: any;
  constructor(public custmService:CustomerService,public util:UtilService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getPayables();
  }
  getPayables(){
    let obj={
      'advisorId':this.advisorId,
      'clientId':2978
    }
    this.custmService.getOtherPayables(obj).subscribe(
      data => this.getOtherPayablesRes(data)
    );
  }
  getOtherPayablesRes(data){
    console.log(data);
    this.dataSource=data;
  }
}
export interface PeriodicElement {
  no: string;
  name: string;
  dateOfReceived: string;
  creditorName: string;
  amountBorrowed: string;
  interest: string;
  dateOfRepayment: string;
  outstandingBalance: string;
  description: string;
  status: string;

}

