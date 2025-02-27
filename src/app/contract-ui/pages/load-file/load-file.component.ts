import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-load-file',
  templateUrl: './load-file.component.html',
  styleUrl: './load-file.component.css'
})
export class LoadFileComponent {
  loanHtml: string = '';

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['loanHtml']) {
      this.loanHtml = navigation.extras.state['loanHtml'];
    }
  }
}
