// src/app/components/loader/loader.component.ts
import { Component } from '@angular/core';
import { LoadingService } from '../../service/loading.service';


@Component({
  selector: 'app-loader',
  template: `
    <div class="overlay" *ngIf="loadingService.loading$ | async">
      <div class="spinner"></div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #ccc;
      border-top-color: #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoaderComponent {
  constructor(public loadingService: LoadingService) {}
}
