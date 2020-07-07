import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mobile-document',
  templateUrl: './mobile-document.component.html',
  styleUrls: ['./mobile-document.component.scss']
})
export class MobileDocumentComponent implements OnInit {
  openMenue: boolean =false;
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
    } else if((flag == true)) {
      this.openMenue = false
    }else{
      this.openMenue = true
    }
  }
}
