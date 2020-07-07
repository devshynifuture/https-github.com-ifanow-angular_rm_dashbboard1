import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mobile-myfeed',
  templateUrl: './mobile-myfeed.component.html',
  styleUrls: ['./mobile-myfeed.component.scss']
})
export class MobileMyfeedComponent implements OnInit {
  openMenue: boolean = false; 
  inputData: any;

  constructor() { }
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of proceed ', data);
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }
  openMenu(flag) {
    if (flag == false) {
      this.openMenue = true
    } else {
      this.openMenue = false
    }
  }
}
