import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonAlert,
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonInputPasswordToggle,
  IonList,
  IonModal,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircle, checkmarkCircle, lockClosedOutline, mailOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    CommonModule,
    FormsModule,
    IonInput,
    IonIcon,
    IonList,
    ReactiveFormsModule,
    IonInputPasswordToggle,
    IonButton,
    IonText,
    IonSpinner,
    RouterLink,
    IonCard,
    IonImg,
    IonAlert,
    IonModal,
    IonContent,
    IonToolbar,
  ],
})
export class LoginPage implements OnInit {
  form!: FormGroup;
  isLogin = signal<boolean>(false);

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  isForgot = signal<boolean>(false);
  isFpModal = signal<boolean>(false);
  fpForm!: FormGroup;

  private auth = inject(AuthService);
  // private router = inject(Router);

  constructor() {
    addIcons({mailOutline,lockClosedOutline,alertCircle,checkmarkCircle});
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.value);
    this.login(this.form.value);
  }

  async login(formValue: { email: string; password: string }) {
    try {
      this.setIsLogin(true);
      await this.auth.login(formValue.email, formValue.password);
      this.setIsLogin(false);

      // this.router.navigateByUrl('/tabs', { replaceUrl: true });
      this.auth.navigateByUrl('/tabs');

      this.form.reset();
    } catch (e: any) {
      this.setIsLogin(false);
      console.log('Error code:', e.code);
      let msg: string = 'Could not sign you up, please try again.';
      if (e.code == 'auth/user-not-found')
        msg = 'E-mail address could not be found';
      else if (e.code == 'auth/wrong-password')
        msg = 'Please enter a correct password';

      console.log(msg);
      this.setErrorMessage(msg);
    }
  }

  setIsLogin(value: boolean) {
    this.isLogin.set(value);
  }

  setErrorMessage(value: string | null) {
    this.errorMessage.set(value);
  }

  setSuccessMessage(value: string | null) {
    this.successMessage.set(value);
  }

  setFp(value: boolean) {
    if (value == true) {
      this.fpForm = new FormGroup({
        email: new FormControl(null, {
          validators: [Validators.required, Validators.email],
        }),
      });
    }
    this.isFpModal.set(value);
  }

  setIsForgot(value: boolean) {
    this.isForgot.set(value);
  }

  onFpSubmit() {
    if (this.fpForm.invalid) {
      this.fpForm.markAllAsTouched();
      return;
    }
    console.log(this.fpForm.value);
    this.resetPassword(this.fpForm.value.email);
  }

  

  async resetPassword(email: string) {
    try {
      this.setIsForgot(true);
      await this.auth.resetPassword(email);

      this.setIsForgot(false);
      this.setFp(false);
      this.setSuccessMessage(
        'Reset password link to your email id successfully, Go to your mail and reset your password'
      );
    } catch (e) {
      this.setIsForgot(false);
      console.error('Reset password error: ', e);
      this.setErrorMessage('Could not reset password, please try again.');
    }
  }
}
