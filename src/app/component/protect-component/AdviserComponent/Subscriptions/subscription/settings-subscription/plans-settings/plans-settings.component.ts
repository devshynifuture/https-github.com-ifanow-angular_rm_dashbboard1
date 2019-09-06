import { Component, OnInit } from '@angular/core';
import { UpperSliderComponent } from '../../common-subscription-component/upper-slider/upper-slider.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-plans-settings',
  templateUrl: './plans-settings.component.html',
  styleUrls: ['./plans-settings.component.scss']
})
export class PlansSettingsComponent implements OnInit {
  button: any;

  constructor( public dialog: MatDialog, ) { }

  ngOnInit() {
  }


  openFragment(data) {
    let Fragmentdata = {
      Flag: data,
    }

    const dialogRef = this.dialog.open(UpperSliderComponent, {
      width: '1400px',
      data: Fragmentdata,
      autoFocus:false,
      panelClass:'dialogBox',
       position: { top: `30px`,
       right: `40px`},
      hasBackdrop: false,
    });
  
    dialogRef.afterClosed().subscribe(result => {
  
    });
  }
   

}
