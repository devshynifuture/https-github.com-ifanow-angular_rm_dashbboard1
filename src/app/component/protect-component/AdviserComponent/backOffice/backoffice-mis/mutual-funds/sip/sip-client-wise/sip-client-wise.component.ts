import { Component, OnInit } from '@angular/core';
import { BackOfficeService } from '../../../../back-office.service';
import {SipComponent} from '../sip.component';
import { AuthService } from 'src/app/auth-service/authService';
@Component({
  selector: 'app-sip-client-wise',
  templateUrl: './sip-client-wise.component.html',
  styleUrls: ['./sip-client-wise.component.scss']
})
export class SipClientWiseComponent implements OnInit {
  showLoader=true;
  clientId: any;
  teamMemberId=2929;
  advisorId: any;
  clientList: any;
  constructor(private backoffice:BackOfficeService,public sip:SipComponent) { }

  ngOnInit() {
    this.showLoader = false;
    this.advisorId=AuthService.getAdvisorId();
    this.clientId=AuthService.getClientId();
    this.clientWiseClientName()
    this.clientWiseApplicantGet()
  }
  aumReport()
  {
   this.sip.sipComponent=true;
  } 
  clientWiseClientName(){
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      parentId:-1
    }
    this.backoffice.sipClientWiseClientName(obj).subscribe(
      data =>{
        this.clientList=data;
        this.clientList.forEach(o => {
          o.showCategory = true;
        });
        console.log(data);
      }
    )
  }
    showSubTableList(index, category,applicantData) {
    applicantData.showCategory=!applicantData.showCategory
    applicantData.applicantList=[]
    if(applicantData.showCategory==false){
      const obj={
        advisorId:this.advisorId,
        arnRiaDetailsId:-1,
        clientId:applicantData.clientId,
        parentId:-1
      }
      this.backoffice.sipClientWiseApplicant(obj).subscribe(
        data =>{
          if(data){
            data[0].showSubCategory=true
            applicantData.applicantList=data
            console.log(data)
          }
        }
      )
    }
  }
  clientWiseApplicantGet(){
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      clientId:this.clientId,
      parentId:-1
    }
    this.backoffice.sipClientWiseApplicant(obj).subscribe(
      data =>{
        console.log(data);
      }
    )
  } 
}
