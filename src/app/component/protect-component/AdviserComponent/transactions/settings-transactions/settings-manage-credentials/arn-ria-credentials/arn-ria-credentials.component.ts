import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-arn-ria-credentials',
  templateUrl: './arn-ria-credentials.component.html',
  styleUrls: ['./arn-ria-credentials.component.scss']
})
export class ArnRiaCredentialsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'aid', 'mid', 'apip', 'euin', 'set', 'icons'];
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

  aid: string;
  mid: string;
  apip: string;
  euin: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'NSE', name: 'ARN', weight: 'ARN-83865', aid: 'MFS83865', mid: 'ABC123', apip: '****', euin: 'E983726' },


];