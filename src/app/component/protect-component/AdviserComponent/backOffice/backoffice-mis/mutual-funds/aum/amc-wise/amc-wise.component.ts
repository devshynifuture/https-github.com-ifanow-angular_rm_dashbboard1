import { Component, OnInit } from '@angular/core';
import { AumComponent } from '../aum.component';

@Component({
  selector: 'app-amc-wise',
  templateUrl: './amc-wise.component.html',
  styleUrls: ['./amc-wise.component.scss']
})
export class AmcWiseComponent implements OnInit {

  constructor(public aum:AumComponent) { }

  ngOnInit() {
  }
  aumReport()
  {
   this.aum.aumComponent=true;
  }

}
