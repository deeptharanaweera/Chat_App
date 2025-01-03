import { DatePipe } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import {
  IonIcon,
  IonItem,
  IonNote,
  IonText,
} from '@ionic/angular/standalone';
import { Chat } from 'src/app/interfaces/chat';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
  standalone: true,
  imports: [IonItem, IonText, IonNote, IonIcon, DatePipe],
})
export class ChatBoxComponent  implements OnInit {

  

  chat = input<Chat | null>(null);

  constructor() { }

  ngOnInit() {}

}
