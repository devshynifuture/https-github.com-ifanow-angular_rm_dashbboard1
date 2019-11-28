import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detailed-ssy',
  templateUrl: './detailed-ssy.component.html',
  styleUrls: ['./detailed-ssy.component.scss']
})
export class DetailedSsyComponent implements OnInit {

  constructor() { }
  data;
  ngOnInit() {
    console.log('DetailedSsysComponent ngOnInit data : ',this.data)
  }

}
