import { Component, OnInit } from '@angular/core';
import { AumComponent } from '../aum.component';
import { BackOfficeService } from '../../../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';


@Component({
  selector: 'app-client-wise',
  templateUrl: './client-wise.component.html',
  styleUrls: ['./client-wise.component.scss']
})
export class ClientWiseComponent implements OnInit {
  advisorId: any;
  clientId: any;

  constructor(public aum:AumComponent,private backoffice:BackOfficeService) { }
  
 
  showLoader=true;
  clientList
  selectedClient;
  subList;
  selectedInvestor;
  teamMemberId=2929;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getClientSchemeName();
    this.getClientTotalAum();
  }
  getClientSchemeName(){
    let obj={
    'clientId':this.clientId,
    'advisorId':this.advisorId,
    arnRiaDetailsId:123
    }
    this.backoffice.getAumClientScheme(obj).subscribe(
      data =>{
        console.log('dataofClientWiseAum',data);
      }
    )
  }
  getClientTotalAum()
  {
    let obj={
      'limit':50,
      'offset':1,
      'advisorId':this.advisorId
    }
    this.backoffice.getAumClientTotalAum(obj).subscribe(
      data => this.clientTotalAum(data)
    )
   
  }
  getClientSCheme(clientname,show,index)
  {
    let obj=
   {
    'clientId':this.clientId,
    'advisorId':this.advisorId
   }
   if(show==true)
   {
    this.backoffice.getAumClientScheme(obj).subscribe(
      data =>this.clientScheme(data,show,index)
    )
   }
   else{
    this.clientList[index].show=(show)?show=false:show=true;
    return;
   }
  }
  clientTotalAum(data)
  {
    this.clientList=data
    this.showLoader=false;
  }
  clientScheme(data,show,index)
  {
   this.subList=data;
   this.selectedClient=index;
   this.clientList[index].subList=this.subList;
   this.clientList[index].show=(show)?show=false:show=true;
  }
  getSchemeName(index,show)
  {
   this.clientList[this.selectedClient].subList[index].showSubCategory=(show)?show=false:show=true;
   this.selectedInvestor=index;
  }

  getSchemeName1(index,show)
  {
    this.clientList[this.selectedClient].subList[this.selectedInvestor].schemes[index].showScheme=(show)?show=false:show=true;
  }
  aumReport()
  {
   this.aum.aumComponent=true;
  }

}
