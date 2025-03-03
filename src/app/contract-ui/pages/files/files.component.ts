import { Component, NgZone, OnInit, Renderer2 } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrl: './files.component.css',
})
export class FilesComponent implements OnInit {
  userInput: string = '';

  private pinataApiKey = '0b4b77f453c17f95e661';
  private pinataSecretApiKey = '5475c5d3e35cd289ad746ec948406d48107bdf61d3dade059225b9dfe61f0115';
  private pinataUrl = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  private pinataListUrl = 'https://api.pinata.cloud/data/pinList';

  constructor(
    private apiService: ApiCallService,
    private router: Router,
    private ngZone: NgZone,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {}

  logInput(): void {
    console.log('User Input:', this.userInput);

    this.apiService.getGetRequest('/getLoanHTML/' + this.userInput).subscribe(async (res: any) => {
      console.log(res);
      if (res) {
        console.log('Res File: ', res?.file);
        await this.generatePDF(res?.file, `loan_${this.userInput}.pdf`);
      }
    });
  }

  checkFileOnPinata(pdfBlob: Blob, fileName: string) {
    const headers = {
      'pinata_api_key': this.pinataApiKey,
      'pinata_secret_api_key': this.pinataSecretApiKey,
    };

    fetch(`${this.pinataListUrl}?metadata[name]=${fileName}`, {
      method: 'GET',
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.count > 0) {
          const existingFileHash = data.rows[0].ipfs_pin_hash;
          console.log('File already exists on IPFS:', existingFileHash);
          this.viewFile(existingFileHash);
        } else {
          this.uploadFileToPinata(pdfBlob, fileName);
        }
      })
      .catch((error) => {
        console.error('Error checking file on Pinata:', error);
        this.uploadFileToPinata(pdfBlob, fileName);
      });
  }

  uploadFileToPinata(pdfBlob: Blob, fileName: string) {
    const formData: FormData = new FormData();
    formData.append('file', pdfBlob, fileName);

    fetch(this.pinataUrl, {
      method: 'POST',
      headers: {
        'pinata_api_key': this.pinataApiKey,
        'pinata_secret_api_key': this.pinataSecretApiKey,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Pinata Response:', data);
        if (data.IpfsHash) {
          console.log('File uploaded to IPFS:', data.IpfsHash);
          alert(`File uploaded successfully!\nIPFS Hash: ${data.IpfsHash}`);
          this.viewFile(data.IpfsHash);
        }
      })
      .catch((error) => console.error('Error uploading to Pinata:', error));
  }

  viewFile(ipfsHash: string) {
    const fileUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    window.open(fileUrl, '_blank');
  }

  generatePDF(htmlContent: string, fileName: string): void {
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    html2canvas(container).then(async canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const blob = pdf.output('blob');
      this.checkFileOnPinata(await blob, fileName);

      document.body.removeChild(container);
    });
  }
}
