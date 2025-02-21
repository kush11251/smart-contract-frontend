import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContractUiRoutingModule } from './contract-ui-routing.module';
import { LandingComponent } from './pages/landing/landing.component';
import { FilesComponent } from './pages/files/files.component';
import { HttpClient } from '@angular/common/http';
import { MetamaskComponent } from './components/metamask/metamask.component';
import { ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [
    LandingComponent,
    FilesComponent,
    MetamaskComponent
  ],
  imports: [
    CommonModule,
    ContractUiRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    HttpClient,
    ToastrService
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class ContractUiModule { }
