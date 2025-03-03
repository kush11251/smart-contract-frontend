import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiCallService } from '../../services/api-call.service';
import { SmartApiService } from '../../services/smart-api.service';

declare global {
  interface Window {
    ethereum?: any;
  }
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  loanForm: FormGroup;
  privateKey: string = '';
  receiverAddress: string = '0x8F9B1E97F6CA00262db581CA66915deABe3181c8';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiCallService,
    private smartApiService: SmartApiService
  ) {
    this.loanForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      loanAmount: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(5),
          Validators.maxLength(8),
        ],
      ],
      loanTenure: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(1),
          Validators.maxLength(3),
        ],
      ],
      loanType: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    if (typeof window !== 'undefined') {
      this.getMetaMaskPrivateKey();
    }
  }

  async getMetaMaskPrivateKey() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        this.privateKey = accounts[0];
        console.log('MetaMask Private Key:', this.privateKey);
      } catch (error) {
        console.error('Error fetching MetaMask account:', error);
      }
    } else {
      console.error('MetaMask is not installed');
    }
  }

  async requestTransaction() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const sender = accounts[0];

        const transactionParameters = {
          to: this.receiverAddress, // Receiver address from form or fixed value
          from: sender,
          value: '0x16345785D8A00', // Sending a fixed amount (0.0001 ETH in Wei)
        };

        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });

        console.log('Transaction Hash:', txHash);

        return txHash;
      } catch (error) {
        console.error('Transaction failed:', error);
        return '';
      }
    } else {
      console.error('MetaMask is not installed');
      return '';
    }
  }

  async onSubmit() {
    if (this.loanForm.valid) {
      console.log('Form Submitted', this.loanForm.value);

      let loanType = '';

      switch (this.loanForm.get('loanType')?.value) {
        case 'Home Loan':
          loanType = 'HL';
          break;
        case 'Personal Loan':
          loanType = 'PL';
          break;
      }

      let reqBody = {
        fileName:
          this.loanForm.get('firstName')?.value +
          '_' +
          this.loanForm.get('lastName')?.value +
          '.html',
        fileType: 'html',
        fileSize: 10,
        fileDescription: 'Loan Html File',
        fileData: {
          firstName: this.loanForm.get('firstName')?.value,
          middleName: this.loanForm.get('middleName')?.value,
          lastName: this.loanForm.get('lastName')?.value,
          loanAmount: this.loanForm.get('loanAmount')?.value,
          loanTenure: this.loanForm.get('loanTenure')?.value,
        },
        loanType: loanType,
        txHash: '',
      };

      let reqBody2 = {
        fullName:
          this.loanForm.get('firstName')?.value + " " +
          this.loanForm.get('middleName')?.value + " " +
          this.loanForm.get('lastName')?.value,
        loanAmount: this.loanForm.get('loanAmount')?.value.toString(),
        loanTenure: this.loanForm.get('loanTenure')?.value.toString(),
        loanType: loanType,
        transactionId: '1231125766',
      };

      await this.requestTransaction().then((res) => {
        if (res && res != '') {
          reqBody2.transactionId = res;

          // this.apiService
          //   .getPostRequest('/uploadFile', reqBody)
          //   .subscribe((resNew: any) => {
          //     console.log(resNew);

          //     if (resNew && resNew?.fileHash) {
          //       prompt('File Generated: ', resNew?.fileHash);
          //     }
          //   });

          this.apiService
            .getPostRequest('/checkApi', reqBody2)
            .subscribe((resNew: any) => {
              console.log(resNew);

              if (resNew && resNew?.transactionId) {
                prompt('File Generated: ', resNew?.transactionId);
              }
            });
        }
      });
    } else {
    }
  }

  redirectoFiles() {
    this.router.navigateByUrl('/files');
  }
}
