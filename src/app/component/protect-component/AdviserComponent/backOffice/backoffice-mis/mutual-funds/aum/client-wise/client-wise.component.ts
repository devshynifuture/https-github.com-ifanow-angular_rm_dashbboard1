import { Component, OnInit } from '@angular/core';
import { AumComponent } from '../aum.component';
import { BackOfficeService } from '../../../../back-office.service';


@Component({
  selector: 'app-client-wise',
  templateUrl: './client-wise.component.html',
  styleUrls: ['./client-wise.component.scss']
})
export class ClientWiseComponent implements OnInit {

  constructor(public aum:AumComponent,private backoffice:BackOfficeService) { }
  
 
  showLoader=true;
  clientList
  selectedClient;
  subList;
  selectedInvestor;
  teamMemberId=2929;
  ngOnInit() {
    this.getClientTotalAum();
  }

  getClientTotalAum()
  {
    let obj={
      'limit':50,
      'offset':1,
      'teamMemberId':this.teamMemberId
    }
    this.backoffice.getAumClientTotalAum(obj).subscribe(
      data => this.clientTotalAum(data)
    )
   
  }
  getClientSCheme(clientname,show,index)
  {
    let obj=
   {
    'clientId':clientname.id,
    'teamMemberId':this.teamMemberId
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
