import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { EmailServiceService } from './../../email-service.service';
import { SubscriptionInject } from './../../../Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { EmailInterfaceI } from './../email.interface';

const ELEMENT_DATA: EmailInterfaceI[] = [
  { position: 1, name: 'archive Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'archive Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'archive Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'archive Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'archive Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'archive Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'archive Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'archive Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'archive Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'archive Neon', weight: 20.1797, symbol: 'Ne' },
];



@Component({
  selector: 'app-email-archive',
  templateUrl: './email-archive.component.html',
  styleUrls: ['./email-archive.component.scss']
})
export class EmailArchiveComponent implements OnInit {
  constructor(private subInjectService: SubscriptionInject,
    private emailService: EmailServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<EmailInterfaceI>(ELEMENT_DATA);
  selection = new SelectionModel<EmailInterfaceI>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: EmailInterfaceI): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  gotoEmailView(dataObj: Object) {
    this.emailService.sendNextData(dataObj);
    this.router.navigate(['admin', 'emails', 'inbox', 'view']);
  }

}
