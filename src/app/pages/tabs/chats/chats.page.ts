import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
  IonModal
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircle, arrowBack } from 'ionicons/icons';
import { EmptyScreenComponent } from 'src/app/components/empty-screen/empty-screen.component';
import { UsersComponent } from 'src/app/components/users/users.component';
import { ChatRoom } from 'src/app/interfaces/chat-room';
import { User } from 'src/app/interfaces/user';
import { ChatRoomService } from 'src/app/services/chat-room/chat-room.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, UsersComponent, EmptyScreenComponent]
})
export class ChatsPage implements OnInit {

  isNewChat = signal<boolean>(false);
  users = computed<User[] | null>(() => this.chatroom.users());
  chatrooms = computed<ChatRoom[] | null>(() => this.chatroom.chatrooms());

  model = {
    icon: 'chatbubbles-outline',
    title: 'No Chats Available',
    color: 'dark',
  }

  private router = inject(Router);
  private chatroom = inject(ChatRoomService);

  constructor() {
    addIcons({
      addCircle,
      arrowBack
    });
   }

  ngOnInit() {
    this.chatroom.init();
  }

  setIsNewChat(value: boolean) {
    if(!this.users() || this.users()?.length! == 0 ) this.chatroom.getUsers();
    this.isNewChat.set(value);
  }

  async startChat(user: User, modal: IonModal) {
    try {
      const room = await this.chatroom.createChatRoom([user.uid], user.name);
      modal.dismiss();

      this.navigateToChat(user?.name, room?.id);
    } catch (e) {
      console.error('Error starting chat: ', e);
    }
    
  }

  getChat(chatroom: ChatRoom) {
    this.navigateToChat(chatroom?.name!, chatroom?.roomId);
  }

  navigateToChat(name: string, id: string) {
    const navData: NavigationExtras = {
      queryParams: {
        name
      }
    };
    this.router.navigate(['/', 'tabs', 'chats', id], navData);
  }

  ngOnDestroy() {
    this.chatroom.cleanup();
  }

}
