import { Injectable, InternalServerErrorException } from '@nestjs/common';
import express from 'express';
import { SessionData } from 'express-session';

@Injectable()
export class SessionService {
  public async save(
    req: express.Request,
    session: Partial<SessionData>,
  ): Promise<void> {
    Object.entries(session).forEach(([key, value]) => {
      req.session[key] = value as SessionData[keyof SessionData];
    });

    return new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error('Session Save Error:', err);
          reject(new InternalServerErrorException('Failed to save session.'));
        } else {
          resolve();
        }
      });
    });
  }

  public destroy(req: express.Request): void {
    req.session.destroy((error) => {
      if (error) {
        throw new InternalServerErrorException('Failed to destroy session.');
      }
    });
  }
}
