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
  totalCurrentValue=0;
  totalWeight=0;

  constructor(public aum:AumComponent,private backoffice:BackOfficeService) { }
  
 
  showLoader=true;
  clientList
  selectedClient;
  subList;
  selectedInvestor;
  teamMemberId=2929;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId()
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
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      parentId:-1
    }
    this.backoffice.getAumClientTotalAum(obj).subscribe(
      data => this.clientTotalAum(data),
      err=>{
        this.showLoader=false;
      }
    )
   
  }
  getInvestorName(clientData)
  {
    clientData.show=!clientData.show
    clientData.investorList=[]
    if(clientData.show==false){
      const obj={
        advisorId:this.advisorId,
        arnRiaDetailsId:-1,
        parentId:-1,
        clientId:clientData.id,
        totalAum:clientData.totalAum
      }
      this.backoffice.getAumFamilyMember(obj).subscribe(
        data =>{
          if(data){
            data[0].showInvestor=true
            clientData.investorList=data
            console.log(data)
          }
        }
      )
      }
  }
  clientTotalAum(data)
  {
    this.clientList=data
    if(this.clientList){
      this.clientList.forEach(o => {
        o.show = true;
        this.totalCurrentValue+=o.totalAum;
        this.totalWeight+=o.weightInPercentage;
      });
    }
    this.showLoader=false;
  }
  clientScheme(data,show,index)
  {
   this.subList=data;
   this.selectedClient=index;
   this.clientList[index].subList=this.subList;
   this.clientList[index].show=(show)?show=false:show=true;
  }
  getSchemeName(investorData)
  {
    investorData.showInvestor=!investorData.showInvestor
    investorData.schemeList=[]
    if(investorData.showInvestor==false){
      const obj={
        advisorId:this.advisorId,
        arnRiaDetailsId:-1,
        parentId:-1,
        familyMemberId:investorData.familyMemberId,
        totalAum:investorData.totalAum
      }
      this.backoffice.getAumFamilyMemberScheme(obj).subscribe(
        data =>{
          if(data){
            data[0].showScheme=true;
            data[0].familyMemberId=investorData.familyMemberId;
            investorData.schemeList=data;
            console.log(data)
          }
        }
      )
    }
    
  }
  getFolio(schemeData)
  {
    schemeData.showScheme=!schemeData.showScheme
    schemeData.folioList=[]
    if(schemeData.showScheme==false){
      const obj={
        advisorId:this.advisorId,
        arnRiaDetailsId:-1,
        parentId:-1,
        familyMemberId:schemeData.familyMemberId,
        totalAum:schemeData.totalAum,
        schemeId:schemeData.mutualFundSchemeMasterId
      }
      this.backoffice.getAumFamilyMemberSchemeFolio(obj).subscribe(
        data =>{
          if(data){
            schemeData.folioList=data
            console.log(data)
          }
        }
      )
    }
    
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
