import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-recon-karvy',
  templateUrl: './recon-karvy.component.html',
  styleUrls: ['./recon-karvy.component.scss']
})
export class ReconKarvyComponent implements OnInit {

  constructor() { }
  @Input() rtId;

  ngOnInit() {
    console.log('my id is ::', this.rtId);
  }

}
