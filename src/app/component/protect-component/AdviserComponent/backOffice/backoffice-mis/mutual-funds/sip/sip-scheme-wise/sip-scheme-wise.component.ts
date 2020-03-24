import { Component, OnInit } from '@angular/core';
import {SipComponent} from '../sip.component';
import { BackOfficeService } from '../../../../back-office.service';

@Component({
  selector: 'app-sip-scheme-wise',
  templateUrl: './sip-scheme-wise.component.html',
  styleUrls: ['./sip-scheme-wise.component.scss']
})
export class SipSchemeWiseComponent implements OnInit {
  showLoader=true;
  teamMemberId=2929;
  constructor(private backoffice:BackOfficeService,public sip:SipComponent) { }

  ngOnInit() {
    this.showLoader = false;
    this.getSchemeWiseGet();
  }

  aumReport()
  {
   this.sip.sipComponent=true;
  }
  getSchemeWiseGet(){
    this.backoffice.Sip_Schemewise_Get(this.teamMemberId).subscribe(
      data =>{
        console.log(data);
      }
    )
  }
}
