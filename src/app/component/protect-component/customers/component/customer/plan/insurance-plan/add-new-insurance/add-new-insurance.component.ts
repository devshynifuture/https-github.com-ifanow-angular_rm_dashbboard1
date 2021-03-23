import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-add-new-insurance',
  templateUrl: './add-new-insurance.component.html',
  styleUrls: ['./add-new-insurance.component.scss']
})
export class AddNewInsuranceComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'advice', 'icons'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'name', 'weight', 'symbol', 'icons'];
  dataSource1 = ELEMENT_DATA1;
  constructor(
    public authService: AuthService,
  ) { }
  logoText = ''
  ngOnInit() {
  }

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  advice: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'Apollo Munich Optima Restore', name: '27,290/year', weight: 'Rahul Jain | 38Y',
    symbol: '5,00,000', advice: 'Port policy'
  },

];

export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    position: 'ICICI Lombard Health Suraksha (Recommended)',
    name: '32,300/year', weight: 'Rahul Jain | 38Y', symbol: '20,00,000'
  },
  {
    position: 'HDFC Ergo Health Super (Option 2)',
    name: '35,100/year', weight: 'Rahul Jain | 38Y', symbol: '20,00,000'
  },
];
