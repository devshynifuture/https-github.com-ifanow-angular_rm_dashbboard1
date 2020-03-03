import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-give-advice',
  templateUrl: './give-advice.component.html',
  styleUrls: ['./give-advice.component.scss']
})
export class GiveAdviceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  advicelist = [{
    name: "Continue holding"
  },
  {
    name: "Additional lumpsum"
  },
  {
    name: "Start SIP"
  },
  {
    name: "Redeem"
  },
  {
    name: "Switch"
  },
  {
    name: "STP"
  },
  {
    name: "Start SIP"
  },
  {
    name: "Non financial advice"
  },
  ]
}
