import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemModalComponent } from './item-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SizerModule } from './sizer/sizer.module';
import { ModifyArrayModule } from './modify-array/modify-array.module';
import { SectionArrayModule } from './section-array/section-array.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderModule } from 'src/app/layout/header/header.module';

// const route: Routes = [
//   {
//     path: '',
//     // canActivate:[HomeGuard],
//     resolve: { data : ItemResolveService},
//     component: ItemModalComponent,
//   }
// ]

@NgModule({
  declarations: [ItemModalComponent],
  imports: [
    CommonModule,
    NgbModalModule,
    SizerModule,
    ModifyArrayModule,
    SectionArrayModule,
    FormsModule,
    ReactiveFormsModule,
    // RouterModule.forChild(route),
  ],
  exports: [ItemModalComponent],
  // schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ItemModalModule {}
