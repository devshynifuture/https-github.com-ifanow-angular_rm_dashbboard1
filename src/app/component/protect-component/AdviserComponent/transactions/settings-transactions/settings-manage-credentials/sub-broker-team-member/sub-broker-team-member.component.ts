import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-broker-team-member',
  templateUrl: './sub-broker-team-member.component.html',
  styleUrls: ['./sub-broker-team-member.component.scss']
})
export class SubBrokerTeamMemberComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'code', 'euin', 'icons'];
  dataSource = ELEMENT_DATA;
  constructor() { }
  isLoading = false;
  ngOnInit() {
  }

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  code: string;
  euin: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'NSE', name: 'ARN', weight: 'ARN-83865', symbol: 'Ankit Mehta', code: 'ABC123', euin: 'E983726' },
  { position: 'NSE', name: 'ARN', weight: 'ARN-83865', symbol: 'Ankit Mehta', code: 'ABC123', euin: 'E983726' },

];