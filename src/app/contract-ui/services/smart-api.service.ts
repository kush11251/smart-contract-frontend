import { Injectable } from '@angular/core';
import { BrowserProvider, Contract, JsonRpcSigner, ethers, ContractTransactionResponse } from 'ethers';

const loanContractABI = [
    "function setLoanDetails(string, uint256, uint256, string, string) public",
    "function getLoanHTML(address) public view returns (string)"
];

@Injectable({
    providedIn: 'root'
})
export class SmartApiService {
    private contractAddress = "0xa030c35c1e364820484459C15734cdB08e860571";
    private provider!: BrowserProvider;
    private signer!: JsonRpcSigner;
    private contract!: Contract;

    constructor() {
        this.initContract();
    }

    private async initContract() {
        if ((window as any).ethereum) {
            this.provider = new BrowserProvider((window as any).ethereum);
            this.signer = await this.provider.getSigner();
            this.contract = new Contract(this.contractAddress, loanContractABI, this.signer);
        } else {
            console.error("MetaMask not found!");
        }
    }

    private async ensureContractInitialized() {
        if (!this.contract) {
            await this.initContract();
        }
    }

    async setLoanDetails(fullName: string, loanAmount: number, loanTenure: number, loanType: string, transactionId: string) {
        await this.ensureContractInitialized();
        const tx = await this.contract['setLoanDetails'](fullName, loanAmount, loanTenure, loanType, transactionId);
        await tx.wait();
        return tx;
    }

    async getLoanHTML(userAddress: string) {
        await this.ensureContractInitialized();
        return await this.contract['getLoanHTML'](userAddress);
    }
}
