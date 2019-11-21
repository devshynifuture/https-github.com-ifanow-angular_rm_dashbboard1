import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-scenarios',
  templateUrl: './add-scenarios.component.html',
  styleUrls: ['./add-scenarios.component.scss']
})
export class AddScenariosComponent implements OnInit {
  displayedColumns: string[] = ['name', 'scenario', 'conflicting'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

 

}                                                                                                     

export interface PeriodicElement {
  name: string;
  scenario: string;
  conflicting: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Goal tracker', scenario: 'Scenario 2', conflicting: 'Continue paying premiums'},                                                                                                      
  {name: 'Insurance planning', scenario: 'Scenario 1', conflicting: 'Stop paying premiums and make the policy paid up'},
  {name: 'Tax planning', scenario: 'Scenario 1', conflicting: 'Continue paying premiums'},
];