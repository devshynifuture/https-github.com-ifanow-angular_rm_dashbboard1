import { Component, OnInit } from '@angular/core';
import { AumComponent } from '../aum.component';
import { BackOfficeService } from '../../../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-amc-wise',
  templateUrl: './amc-wise.component.html',
  styleUrls: ['./amc-wise.component.scss']
})
export class AmcWiseComponent implements OnInit {
  teamMemberId=2929;
  advisorId: any;
  showLoader=true;
  selectedCategory: any;
  amcList: any;
  totalCurrentValue=0;
  totalWeight=0;

  constructor(public aum:AumComponent,private backoffice:BackOfficeService,private dataService:EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getAmcWiseData();
  }
  aumReport()
  {
   this.aum.aumComponent=true;
  }
  getAmcWiseData(){
    const obj={
      advisorId: this.advisorId,
      arnRiaDetailsId: -1,
      parentId: -1
    }
    this.backoffice.amcWiseGet(obj).subscribe(
      data => this.getReponseAmcWiseGet(data),
      err=>this.getFilerrorResponse(err)
    )
  }
  getReponseAmcWiseGet(data) {
    this.amcList=data;
    this.amcList.forEach(o => {
      o.showAmc = true;
      this.totalCurrentValue+=o.totalAum;
      this.totalWeight+=o.weightInPercentage;
    });
    this.showLoader = false;
  }
  showScheme(amcData) {
    amcData.showAmc=!amcData.showAmc
    amcData.schemes.forEach(o => {
      o.mutualFundSchemeMasterId=amcData.id;
      o.showScheme = true;
    });
    
  }
  showApplicant(schemeData) {
    schemeData.showScheme=!schemeData.showScheme
    schemeData.applicantList=[]
    if(schemeData.showScheme==false){
      const obj={
        advisorId:this.advisorId,
        arnRiaDetailsId:-1,
        parentId:-1,
        schemeMasterId:schemeData.mutualFundSchemeMasterId,
        totalAum:schemeData.totalAum
      }
      this.backoffice.amcWiseApplicantGet(obj).subscribe(
        data =>{
          if(data){
            schemeData.applicantList=data
            console.log(data)
          }
        }
      )
      }
  }
  getApplicantName(){
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailId:12345,
      schemeMasterId:1345,
      totalAum:2000
    }
    this.backoffice.amcWiseApplicantGet(obj).subscribe(
      data => {
        console.log(data);
      }
    )
  }
  getFilerrorResponse(err) {
    this.showLoader = false;
    this.dataService.openSnackBar(err, 'Dismiss')
  }
}
