import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-individual-income-info',
  templateUrl: './individual-income-info.component.html',
  styleUrls: ['./individual-income-info.component.scss']
})
export class IndividualIncomeInfoComponent implements OnInit {

  constructor(private fb:FormBuilder) { }

  ngOnInit() {
  }
  
}
