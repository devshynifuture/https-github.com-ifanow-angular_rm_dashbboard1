import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';

@Component({
  selector: 'app-po-mis-scheme',
  templateUrl: './po-mis-scheme.component.html',
  styleUrls: ['./po-mis-scheme.component.scss']
})
export class PoMisSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;

  constructor(private cusService:CustomerService) { }
  displayedColumns = ['no', 'owner','cvalue','mpayout','rate','amt','mvalue','mdate','desc','status','icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId=2978;
  }
  getPoMisSchemedata()
  {
    const obj={
      advisorId:this.advisorId,
      clientId:this.clientId
    }
    this.cusService.getSmallSavingSchemePOMISData(obj).subscribe(
      data=>this.getPoMisSchemedataResponse(data)
    )
  }
  getPoMisSchemedataResponse(data)
  {
    console.log(data)
    this.datasource=data
  }
}
