import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-recon-franklin',
  templateUrl: './recon-franklin.component.html',
  styleUrls: ['./recon-franklin.component.scss']
})
export class ReconFranklinComponent implements OnInit {

  constructor() { }
  @Input() rtId;

  ngOnInit() {
    console.log('my id is ::', this.rtId);

  }

}
