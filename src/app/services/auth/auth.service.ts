import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  uid = signal<string | null>(null);

  private fireAuth = inject(Auth);
  private router = inject(Router);
  private api = inject(ApiService);

  constructor() {}

  setData(uid: string | null) {
    if (!this.uid()) this.uid.set(uid);
  }

  getId() {
    const auth = getAuth();
    const uid = auth.currentUser?.uid || null;
    this.setData(uid);
    return uid;
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ id: string }> {
    try {
      const register = await createUserWithEmailAndPassword(
        this.fireAuth,
        data.email,
        data.password
      );

      const id = register.user.uid;
      const userData = {
        name: data.name,
        email: data.email,
        uid: id,
        photo: 'https://i.pravatar.cc/' + this.randomIntFromInterval(200, 400),
      };

      await this.api.setData(`users/${id}`, userData);
      this.setData(id);

      return { id };
    } catch (e) {
      console.error('Registration error: ', e);
      throw e;
    }
  }

  randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async login(email: string, password: string) {
    try {
      const response = await signInWithEmailAndPassword(
        this.fireAuth,
        email,
        password
      );

      if (response?.user) {
        this.setData(response.user.uid);
      }
    } catch (e) {
      console.error('Login error: ', e);
      throw e;
    }
  }

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.fireAuth, email);
    } catch (e) {
      console.error('Reset password error: ', e);
      throw e;
    }
  }

  checkAuth() {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(
      this.fireAuth,
      (user) => {
        resolve(user);
      },
      (error) => {
        console.error('Check auth error: ', error);
        reject(error);
      }
    );
    })
  }

  navigateByUrl(path: string) {
    this.router.navigateByUrl(path, {replaceUrl: true});
  }

  //setting page user profile data
  async getUserData(id: string) {
    try {
      const userRef = this.api.getRef(`users/${id}`);
    const snapshot = await this.api.getData(userRef);
    if(snapshot?.exists()) {
      return snapshot.val();
    }else {
      throw new Error('No such user exists');
    }
    } catch (error) {
      console.error('Error fetching user data: ', error);
      throw error;
    }
    
  }

  async logout() {
    try {
      await this.fireAuth.signOut();

      this.uid.set(null);
      this.navigateByUrl('/login');
      return true;
    } catch (e) {
      console.error('Logout error: ', e);
      throw e;
    }
  }
}
