import { Component, OnInit } from '@angular/core';
import { EnumDataService } from 'src/app/services/enum-data.service';

@Component({
  selector: 'app-setting-plan',
  templateUrl: './setting-plan.component.html',
  styleUrls: ['./setting-plan.component.scss']
})
export class SettingPlanComponent implements OnInit {

  constructor(public enumDataService: EnumDataService,
  ) { }

  ngOnInit() {
  }

}
