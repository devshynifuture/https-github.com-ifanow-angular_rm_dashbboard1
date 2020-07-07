import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mobile-profile',
  templateUrl: './mobile-profile.component.html',
  styleUrls: ['./mobile-profile.component.scss']
}) 
export class MobileProfileComponent implements OnInit {
  openMenue: boolean=false;
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
