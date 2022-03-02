import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordGuard } from 'src/app/services/guards/reset-password.guard';
import { SocialiteGuard } from 'src/app/services/guards/socialite.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
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
  {
    path: 'reset-password/:token/:signature',
    component: ResetPasswordComponent,
    resolve: { auth: ResetPasswordGuard },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
