import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { FilesComponent } from './pages/files/files.component';

const routes: Routes = [
  {
    path: "",
    component: LandingComponent
  },
  {
    path: "files",
    component: FilesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractUiRoutingModule { }
