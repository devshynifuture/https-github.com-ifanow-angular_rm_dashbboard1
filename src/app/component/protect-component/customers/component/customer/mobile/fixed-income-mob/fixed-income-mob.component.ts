import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fixed-income-mob',
  templateUrl: './fixed-income-mob.component.html',
  styleUrls: ['./fixed-income-mob.component.scss']
})
export class FixedIncomeMobComponent implements OnInit {
  backToMf;
  showBank;
  assetSubType;
  constructor() { }

  ngOnInit() {
  }
  openSubAsset(subAsset){
 this.assetSubType = subAsset
  }
}
