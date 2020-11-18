import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-finacial-plan-section',
  templateUrl: './finacial-plan-section.component.html',
  styleUrls: ['./finacial-plan-section.component.scss']
})
export class FinacialPlanSectionComponent implements OnInit {
  loadedSection: any;
  fragmentData = { isSpinner: true }
  constructor(private util: UtilService) { }

  ngOnInit() {
  }
  checkAndLoadPdf(value, sectionName) {
    if (value) {
      this.loadedSection = sectionName
    }

  }
  getOutput(data) {
    console.log(data);
    this.generatePdf(data);
  }
  generatePdf(data) {
    this.fragmentData.isSpinner = true;
    // let para = document.getElementById('template');
    // this.util.htmlToPdf(para.innerHTML, 'Test',this.fragmentData);

    this.util.htmlToPdf('', data.innerHTML, 'Income', 'true', this.fragmentData, '', '', false);

  }
}
