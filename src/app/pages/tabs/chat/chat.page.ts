import { Component, computed, effect, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { callOutline, chatbubblesOutline, checkmarkDoneOutline, send, videocamOutline } from 'ionicons/icons';
import { ChatBoxComponent } from 'src/app/components/chat-box/chat-box.component';
import { EmptyScreenComponent } from 'src/app/components/empty-screen/empty-screen.component';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    ChatBoxComponent,
    EmptyScreenComponent,
    FormsModule,
    IonFooter,
    IonTextarea,
    IonItem,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class ChatPage implements OnInit {

  content = viewChild<IonContent>(IonContent);
  name = signal<string | null>(null);
  id = signal<string | null>(null);
  message = signal<string | null>(null);

  isLoading = signal<boolean>(false);

  model = {
    icon: 'chatbubbles-outline',
    title: 'No Message Available',
    color: 'dark',
  };

  chats = computed(() => this.chatService.chatMessages());

  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);

  constructor() {
    effect(() => {
      if(this.chats() && this.chats()?.length! > 0) {
        setTimeout(() => {
          this.scrollToBottom();
        },500);
      }
    });
    addIcons({callOutline,videocamOutline,send,checkmarkDoneOutline,chatbubblesOutline});
  }

  ngOnInit() {
    const data: any = this.route.snapshot.queryParams;
    if (data?.name) {
      this.name.set(data.name);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    this.id.set(id);
    this.chatService.init(id);

  }

  scrollToBottom() {
    this.content()?.scrollToBottom(500);
  }

  async sendMessage() {
    if(!this.message() || this.message()?.trim() == '') {
      return;
    }

    try {
      this.setIsLoading(true);
      await this.chatService.sendMessage(this.id()!, this.message()!);

      this.message.set('');
      this.setIsLoading(false);

      this.scrollToBottom();
    } catch (e) {
      this.setIsLoading(false);
      console.error('Error sending message: ', e);
    }
  }

  setIsLoading(value: boolean) {
    this.isLoading.set(value);
  }

  ngOnDestroy() {
    this.chatService.unsubscribeChats();
  }

}
