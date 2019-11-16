import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-ppf-scheme',
  templateUrl: './ppf-scheme.component.html',
  styleUrls: ['./ppf-scheme.component.scss']
})
export class PPFSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;

  constructor(private cusService:CustomerService,private eventService:EventService) { }
  displayedColumns = ['no', 'owner','cvalue','rate','amt','number','mdate','desc','status','icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId=2978;
    this.getPpfSchemeData();
  }
  getPpfSchemeData()
  {
    const obj={
      advisorId:this.advisorId,
      clientId:this.clientId
    }
    this.cusService.getSmallSavingSchemePPFData(obj).subscribe(
      data=>this.getPpfSchemeDataResponse(data),
      err=>this.eventService.openSnackBar("server issues")
    )

  }
  getPpfSchemeDataResponse(data)
  {
    console.log(data)
    this.datasource=data
  }
}
export interface PeriodicElement16 {
  no: string;
  owner: string;
  cvalue:string;
  rate:string;
  amt:string;
  number:string;
  mdate:string;
  desc:string;
  status:string;
}