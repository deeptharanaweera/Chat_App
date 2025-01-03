import { Component, input, OnInit, output } from '@angular/core';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { User } from 'src/app/interfaces/user';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [IonHeader, IonButton, IonToolbar, IonTitle, IonButtons,IonIcon, IonContent, IonList, IonItem, IonAvatar, IonLabel, IonImg],
})
export class UsersComponent  implements OnInit {

  users = input<User[] | null>([]);
  close = output<boolean>();
  user = output<User>();

  constructor() { }

  ngOnInit() {}

  closeModal() {
    this.close.emit(true);
  }

  startChat(user: User) {
    this.user.emit(user);
  }

}
