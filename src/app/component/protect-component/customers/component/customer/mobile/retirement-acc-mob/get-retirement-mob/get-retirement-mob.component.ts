import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-get-retirement-mob',
  templateUrl: './get-retirement-mob.component.html',
  styleUrls: ['./get-retirement-mob.component.scss']
})
export class GetRetirementMobComponent implements OnInit {
  inputData: any;
  asset: any;

  constructor() { }
  @Input()
  set data(data) {
    this.inputData = data;
    if(this.asset){
      this.asset = data.asset.assetList
    }else{
      this.asset = []
    }
    console.log('This is Input data of proceed ', data);
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }

}
