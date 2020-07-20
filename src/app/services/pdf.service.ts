import * as jsPDF from 'jspdf';
import {ElementRef} from '@angular/core';
import html2pdf from 'html2pdf.js';


// @Injectable({
//   providedIn: 'root'
// })
export class PdfService {
  static generatePdfFromHtmlText(content, opt) {
    html2pdf().set(opt).from(content).save();
  }

  /* static generatePdfFromElement(content: ElementRef, docName: string) {
     const doc = new jsPDF();
     console.log('pdfservice content : ', content.nativeElement);
     doc.html(content.nativeElement, {
       callback: (outputMessage) => {
         console.log('generatePdfFromElement : outputMessage :', outputMessage);
         outputMessage.save(docName);
       }
     })
     ;
   }

   static generatePdfFromCanvas(content, docName: string) {
     const doc = new jsPDF();
     doc.addHTML(content, null, null, {}, (outputMessage) => {
       console.log('generatePdfFromCanvas : outputMessage :', outputMessage);

       doc.save(docName).then(sucessMessage => {
         console.log('generatePdfFromCanvas doc.save sucessMessage :', sucessMessage);

       }).catch(error => {
         console.log('generatePdfFromCanvas doc.save error :', error);
       });
       console.log('generatePdfFromCanvas : success :', docName);
     });
   }

   static generatePdfFromHtmlText(content, docName: string) {
     const doc = new jsPDF();
     doc.addHTML(content, () => {
       doc.save(docName);
     });
   }


   static generateTestDocument() {
     // Default export is a4 paper, portrait, using milimeters for units
     const doc = new jsPDF();

     doc.text('Hello world!', 10, 10);
     doc.save('a4.pdf');
   }*/
}
