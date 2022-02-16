import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserNameService } from 'src/app/services/apis/user-name.service';
import { UserPasswordService } from 'src/app/services/apis/user-password.service';
import { ErrorsService } from 'src/app/services/local/errors.service';
import { WindowService } from 'src/app/services/local/window.service';
import { MessageService } from 'src/app/share/components/message/message.service';
import { storageKeys } from 'src/app/share/configs';
import { User } from 'src/app/share/types';
import { setLoading } from 'src/app/state/loading/action';
import { LoadingStoreModule } from 'src/app/state/loading/loading.store.module';

@Component({
  selector: 'uo-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  loading = false;
  isName = false;
  isPassword = false;
  user!: User;
  nameForm = this.fb.group({
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
  });
  passwordForm = this.fb.group({
    old_password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
    password_confirmation: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
  });
  oldPasswordToggle: boolean = true;
  newPasswordToggle: boolean = true;
  confirmdPaswordToggle: boolean = true;
  get firstName() {
    return this.nameForm.get('first_name');
  }
  get lastName() {
    return this.nameForm.get('last_name');
  }
  get oldPassword() {
    return this.passwordForm.get('old_password');
  }
  get password() {
    return this.passwordForm.get('password');
  }
  get passwordConfirmation() {
    return this.passwordForm.get('password_confirmation');
  }
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private nameServe: UserNameService,
    private passwordServe: UserPasswordService,
    private messageServe: MessageService,
    private loadingStore$: Store<LoadingStoreModule>,
    private errorServe: ErrorsService
  ) {}
  ngOnInit(): void {
    this.getUser();
  }
  getUser(): void {
    this.loadingStore$.dispatch(setLoading({ loading: true }));
    this.nameServe.getName().subscribe(
      (res) => {
        console.log('res :>> ', res);
        this.user = res.data.item;
        this.firstName?.setValue(res.data.item.first_name);
        this.lastName?.setValue(res.data.item.last_name);
        this.cdr.markForCheck();
        this.loadingStore$.dispatch(setLoading({ loading: false }));
      },
      (err) => {
        this.loadingStore$.dispatch(setLoading({ loading: false }));
      }
    );
  }
  editNameForm(): void {
    this.isName = !this.isName;
    if (this.isPassword) {
      this.isPassword = false;
    }
  }
  editPasswordForm(): void {
    this.isPassword = !this.isPassword;
    if (this.isName) {
      this.isName = false;
    }
  }
  updateName(): void {
    console.log('this.nameForm.value :>> ', this.nameForm.value);
    this.loading = true;
    this.cdr.markForCheck();
    this.nameServe.editName(this.user.id, this.nameForm.value).subscribe(
      (res) => {
        console.log('res :>> ', res);
        this.user = res.data.item;
        this.loading = false;
        this.isName = false;
        this.cdr.markForCheck();
        this.messageServe.success('Change name successfully!');
      },
      (err) => {
        this.loading = false;
        this.isName = false;
      }
    );
  }
  updatePassword(): void {
    console.log('this.passwordForm.value :>> ', this.passwordForm.value);
    this.loading = true;
    this.cdr.markForCheck();
    this.passwordServe
      .editPassword(this.user.id, this.passwordForm.value)
      .subscribe(
        (res) => {
          if (res.data.value == 1) {
            this.messageServe.success('Change password successfully!');
          }
          console.log('res :>> ', res);
          this.loading = false;
          this.isPassword = false;
          this.cdr.markForCheck();
        },
        (err) => {
          console.log('err :>> ', err);
          if (err.error.data.value == 'old_password') {
            this.oldPassword!.setErrors({
              incorrect: 'Old password is not correct!',
            });
          }
          if (err.error.data.value == 'password') {
            this.password!.setErrors({
              password: 'New password must match password confirmation!',
            });
            this.passwordConfirmation!.setErrors({
              password: 'New password must match password confirmation!',
            });
          }
          this.loading = false;
          this.cdr.markForCheck();
        }
      );
  }
}
