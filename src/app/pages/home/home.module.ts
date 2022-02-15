import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
// import { AgmCoreModule } from '@agm/core';
import { RouterModule, Routes } from '@angular/router';
import { FooterModule } from 'src/app/layout/footer/footer.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackdropModule } from 'src/app/share/components/backdrop/backdrop.module';
import { DirectivesModule } from 'src/app/share/directives/directives.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

const route: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    DirectivesModule,
    BackdropModule,
    FooterModule,
    MatAutocompleteModule,
    NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(route),
  ],
  exports: [
    HomeComponent,
    // AgmCoreModule,
  ],
})
export class HomeModule {}
