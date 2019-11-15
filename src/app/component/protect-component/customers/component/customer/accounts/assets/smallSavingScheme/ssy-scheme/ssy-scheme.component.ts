import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';

@Component({
  selector: 'app-ssy-scheme',
  templateUrl: './ssy-scheme.component.html',
  styleUrls: ['./ssy-scheme.component.scss']
})
export class SsySchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;

  constructor(private cusService:CustomerService) { }
  displayedColumns16 = ['no', 'owner','cvalue','rate','amt','number','mdate','desc','status','icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId=2978;
    this.getSsySchemedata()
  }
  getSsySchemedata()
  {
    const obj={
      advisorId:this.advisorId,
      clientId:this.clientId
    }
    this.cusService.getSmallSavingSchemeSSYData(obj).subscribe(
      data=>this.getSsySchemedataResponse(data)
    )
  }
  getSsySchemedataResponse(data)
  {
    console.log(data)
   this.datasource=data

  }
}