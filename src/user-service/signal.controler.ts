import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { filter, firstValueFrom, lastValueFrom, map } from 'rxjs';
import { Server } from 'socket.io';
import WebSocket from 'ws'; // Czysty klient WebSocket dla bota
import FormData from 'form-data'; // Ważne: import z biblioteki, nie z global scope
import { Subject, Observable } from 'rxjs';
import { SignalMessage } from './types';
import { Readable, PassThrough } from 'stream';
import ffmpeg from 'fluent-ffmpeg';

@Injectable()
@WebSocketGateway({ cors: true }) // To jest Twój serwer Socket.io dla frontendu
export class SignalBridgeService implements OnModuleInit {
  logger = new Logger(SignalBridgeService.name);
  private observable: Observable<SignalMessage>;
  private subject: Subject<SignalMessage>;
  constructor(private readonly httpService: HttpService) {
    this.subject = new Subject<SignalMessage>();
    this.observable = this.subject.asObservable();
  }
  @WebSocketServer()
  server: Server;

  private signalClient: WebSocket;

  onModuleInit() {
    this.initSignalConnection();
    this.obserwer();
  }

  async getSmartResponse(userText: string): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY; // Twój nowy klucz z Groq

    if (!apiKey) {
      throw new Error('GROQ_API_KEY not found in environment variables');
    }

    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const body = {
      model: 'llama-3.3-70b-versatile', // Bardzo mądry model, darmowy na Groq
      messages: [
        {
          role: 'system',
          content:
            'Jesteś pyskatym asystentem domowym. Użytkownik chce otworzyć bramę. Odpowiedz mu złośliwie, ironicznie i bardzo krótko (max 12 słów).',
        },
        { role: 'user', content: userText },
      ],
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, body, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Błąd Groq:', error.response?.data || error.message);
      return 'Nawet zapasowe AI ma cię dość. Wchodź już i nie marudź.';
    }
  }

  async convertToMp3(buffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const inputStream = new Readable();
      inputStream.push(buffer);
      inputStream.push(null);

      const outputStream = new PassThrough();
      const chunks: Buffer[] = [];

      outputStream.on('data', (chunk) => chunks.push(chunk));
      outputStream.on('end', () => resolve(Buffer.concat(chunks)));
      outputStream.on('error', reject);

      ffmpeg(inputStream).toFormat('mp3').on('error', reject).pipe(outputStream);
    });
  }

  async speechToText(audioBuffer: Buffer): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    const url = 'https://api.groq.com/openai/v1/audio/transcriptions';

    const formData = new FormData();

    const mp3Buffer = await this.convertToMp3(audioBuffer);
    formData.append('file', mp3Buffer, {
      filename: 'audio.mp3',
      contentType: 'audio/mpeg',
    });
    formData.append('model', 'whisper-large-v3');
    formData.append('language', 'pl');

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, formData, {
          headers: {
            // To jest kluczowe: biblioteka sama wygeneruje 'content-type' z poprawnym 'boundary'
            ...formData.getHeaders(),
            Authorization: `Bearer ${apiKey}`,
          },
        }),
      );
      return response.data.text;
    } catch (error) {
      console.error('Błąd Whisper:', error.response?.data || error.message);
      return 'Nie zrozumiałem, co tam mruczysz pod bramą.';
    }
  }

  async textToSpeech(text: string): Promise<Buffer> {
    // tl=pl oznacza język polski, client=tw-ob to trik na ominięcie blokad
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=pl&client=tw-ob`;

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0', // Udajemy przeglądarkę
          },
        }),
      );

      return Buffer.from(response.data);
    } catch (error) {
      console.error('Błąd generowania głosu:', error.message);
      throw error;
    }
  }

  private initSignalConnection() {
    // Łączymy się CZYSTYM WebSocketem do bota
    this.signalClient = new WebSocket('ws://signal_bridge:8080/v1/receive/%2B48608447495');

    this.signalClient.on('open', () => {
      console.log('✅ Połączono z botem Signa (Protokół: WS)');
    });

    this.signalClient.on('message', (data) => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const msg: SignalMessage = JSON.parse(data.toString()) as SignalMessage;
      this.subject.next(msg);
    });
  }

  obserwer() {
    this.observable
      .pipe(
        filter((msg) => !!msg.envelope?.dataMessage),
        map((msg) => msg),
      )
      .subscribe(this.d);
  }

  async sendSignalResponse(text: string, number: string) {
    const url = `http://signal_bridge:8080/v1/send`;

    const body = {
      message: text,
      number: '+48608447495', // Numer Twojego BOTA
      recipients: [number], // Numer osoby, której odpowiadamy (np. Basi)
    };
    console.log('🚀 ~ SignalBridgeService ~ sendSignalResponse ~ body:', body);

    try {
      await firstValueFrom(this.httpService.post(url, body));
      this.logger.log(`✅ Wysłano odpowiedź do ${'48883111249'}: ${text}`);
    } catch (error) {
      this.logger.error('❌ Błąd podczas wysyłania wiadomości Signal', error.response?.data || error.message);
    }
  }

  private readonly SIGNAL_URL = 'http://signal_bridge:8080';
  async downloadAttachment(attachmentId: string): Promise<Buffer> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.SIGNAL_URL}/v1/attachments/${attachmentId}`, {
          responseType: 'arraybuffer', // KLUCZOWE: pobieramy surowe bajty
          timeout: 5000,
        }),
      );

      return Buffer.from(response.data);
    } catch (error) {
      console.error('Błąd pobierania z Signal Bridge:', error.message);
      throw error;
    }
  }

  async sendVoiceNote(audioBuffer: Buffer, recipientNumber: string) {
    const url = `${this.SIGNAL_URL}/v2/send`;

    console.log('Rozmiar bufora audio:', audioBuffer.length);
    if (audioBuffer.length === 0) {
      console.error('BŁĄD: Bufor audio jest pustY!');
    }
    const body = {
      // Numer Twojego bota (musi być zarejestrowany w signal-api)
      number: '+48608447495',
      recipients: [recipientNumber],
      message: '',
      // Wiadomość tekstowa może być pusta
      base64_attachments: [`data:audio/aac;base64,${audioBuffer.toString('base64')}`],
      // KLUCZOWE: To sprawia, że załącznik pojawia się jako notatka głosowa (playlista)
      is_voice_note: true,
    };

    try {
      await firstValueFrom(
        this.httpService.post(url, body, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
      this.logger.log(`✅ Wysłano notatkę głosową do ${recipientNumber}`);
    } catch (error) {
      this.logger.error('❌ Błąd wysyłania głosówki:', error.response?.data || error.message);
    }
  }
  d = async (msg: SignalMessage) => {
    this.logger.log('Otrzymano wiadomość:', msg);

    const text = msg?.envelope?.dataMessage?.message;
    const hasText = (text?.trim().length || 0) > 0;

    const attachment = msg?.envelope?.dataMessage?.attachments?.[0];
    const hasAttachments = !!attachment;

    if (hasText) {
      const response = await this.getSmartResponse(text || '');
      await this.sendSignalResponse(response, msg?.envelope?.source || '');
      this.logger.log('Odpowiedź:', response);
    } else if (
      hasAttachments &&
      attachment.contentType.startsWith('audio/')
    ) {
      const buffer = await this.downloadAttachment(attachment.id ?? '');
      const transcript = await this.speechToText(buffer);
      const response = await this.getSmartResponse(transcript || '');
      const sppech = await this.textToSpeech(response);
      await this.sendVoiceNote(sppech, msg?.envelope?.source || '');
      // Scenariusz: Tylko załączniki
      console.log('Same pliki');
    } else {
      // Pusta wiadomość
      console.log('Nic nie wysłano');
    }
  };

  private openGate() {
    console.log('🔓 Otwieram bramę!');
    // Twój kod HTTP PUT do bramy Vidos
  }
}
