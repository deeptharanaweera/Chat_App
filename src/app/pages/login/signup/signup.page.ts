import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
// import { RouterLink } from '@angular/router';
import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonInputPasswordToggle,
  IonList,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline, mailOutline, personOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
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
    IonCard,
    IonImg,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonAlert,
  ],
})
export class SignupPage implements OnInit {
  form!: FormGroup;
  isSignup = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  private auth = inject(AuthService);
  // private router = inject(Router);

  constructor() {
    addIcons({ personOutline, mailOutline, lockClosedOutline });
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
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
    this.signup(this.form.value);
  }

  async signup(formValue: { name: string; email: string; password: string }) {
    try {
      this.setIsSignup(true);
      const { id } = await this.auth.register(formValue);
      this.setIsSignup(false);

      // this.router.navigateByUrl('/tabs', { replaceUrl: true });
      this.auth.navigateByUrl('/tabs');

      this.form.reset();
    } catch (e: any) {
      this.setIsSignup(false);
      let msg: string = 'Could not sign you up, please try again.';
      if (e.code == 'auth/email-already-in-use') {
        msg = 'Email already in use';
      }
      this.setErrorMessage(msg);
    }
  }

  setIsSignup(value: boolean) {
    this.isSignup.set(value);
  }

  setErrorMessage(value: string | null) {
    this.errorMessage.set(value);
  }
}
