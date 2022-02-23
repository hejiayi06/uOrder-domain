import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SocialiteGuard } from 'src/app/services/guards/socialite.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SocialiteComponent } from './socialite/socialite.component';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'auth/socialite',
    component: SocialiteComponent,
    canActivate: [SocialiteGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
