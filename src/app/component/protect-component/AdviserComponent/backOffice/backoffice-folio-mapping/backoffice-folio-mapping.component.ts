import { Component, OnInit } from '@angular/core';
import { SelectFolioMapComponent } from './select-folio-map/select-folio-map.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-backoffice-folio-mapping',
  templateUrl: './backoffice-folio-mapping.component.html',
  styleUrls: ['./backoffice-folio-mapping.component.scss']
})
export class BackofficeFolioMappingComponent implements OnInit {
  displayedColumns: string[] = ['checkBoxIcon', 'schemeName', 'number', 'investName'];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openFolio() {
    const dialogRef = this.dialog.open(SelectFolioMapComponent, {
      width: '663px',
      //height: '679px',
    });
    

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  

}


export interface PeriodicElement {
  checkBoxIcon: string;
  schemeName: string;
  number: string;
  investName: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { checkBoxIcon: '', schemeName: 'ICICI Prudential Long Term Equity Fund (Tax Saving) - Growth', number: 'K126860', investName: 'Rahul jain'  },
  {checkBoxIcon: '', schemeName: 'Tata Hybrid Equity Fund Regular Plan- Monthly Dividend Option ', number: 'K126860', investName: 'Devshyani Jadhav'  },
  { checkBoxIcon: '', schemeName: 'ICICI Prudential Long Term Equity Fund (Tax Saving) - Growth', number: 'K126860', investName: 'Rahul jain'  },
  {checkBoxIcon: '', schemeName: 'Tata Hybrid Equity Fund Regular Plan- Monthly Dividend Option ', number: 'K126860', investName: 'Devshyani Jadhav'  },
  { checkBoxIcon: '', schemeName: 'ICICI Prudential Long Term Equity Fund (Tax Saving) - Growth', number: 'K126860', investName: 'Rahul jain'  },
  {checkBoxIcon: '', schemeName: 'Tata Hybrid Equity Fund Regular Plan- Monthly Dividend Option ', number: 'K126860', investName: 'Devshyani Jadhav'  },
  { checkBoxIcon: '', schemeName: 'ICICI Prudential Long Term Equity Fund (Tax Saving) - Growth', number: 'K126860', investName: 'Rahul jain'  },
  {checkBoxIcon: '', schemeName: 'Tata Hybrid Equity Fund Regular Plan- Monthly Dividend Option ', number: 'K126860', investName: 'Devshyani Jadhav'  },
   
];