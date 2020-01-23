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
  constructor(private backoffice:BackOfficeService,public sip:SipComponent) { }

  ngOnInit() {
    this.showLoader = false;
  }

  aumReport()
  {
   this.sip.sipComponent=true;
  }
}
