import { Component, OnInit } from '@angular/core';
import { EnumDataService } from 'src/app/services/enum-data.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

  constructor(private enumDataService: EnumDataService) { }
  value = 1;
  ngOnInit() {
    this.enumDataService.getRoles();
  }

}
