import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecommendComponent } from './recommend.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/layout/header/header.module';
import { FooterModule } from 'src/app/layout/footer/footer.module';
const route: Routes = [
  {
    path: '',
    component: RecommendComponent,
  }
]
@NgModule({
  declarations: [
    RecommendComponent,
  ],
  imports: [
    CommonModule,
    HeaderModule,
    FooterModule,
    RouterModule.forChild(route),
  ],
  exports: [
    RecommendComponent,
  ]
})
export class RecommendModule { }
