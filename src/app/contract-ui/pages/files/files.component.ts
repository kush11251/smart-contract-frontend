import { Component, NgZone, OnInit } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrl: './files.component.css',
})
export class FilesComponent implements OnInit {
  userInput: string = '';

  constructor(
    private apiService: ApiCallService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    // this.apiService.getGetRequest("/contract-data").subscribe((res) => {
    //   console.log(res)
    // })
  }

  logInput(): void {
    console.log('User Input:', this.userInput);

    this.apiService
      .getGetRequest('/getLoanHTML/' + this.userInput)
      .subscribe((res: any) => {
        console.log(res);

        if (res) {
          this.ngZone.run(() => {
            this.router.navigate(['/view-file'], { state: { loanHtml: res?.file } });
          });
        }
      });
  }

  downloadFile(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank'; // Open in a new tab (optional)
    link.download = url.split('/').pop() || 'downloaded-file'; // Extract filename from URL
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
