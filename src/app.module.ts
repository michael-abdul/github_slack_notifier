import { Module } from '@nestjs/common';
import { GitHubWebhookController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { SlackModule } from 'nestjs-slack';

@Module({
  imports: [ConfigModule.forRoot(), SlackModule.forRoot({
    type: 'webhook',
    url: process.env.SLACK_WEBHOOK_URL,
  }),],
  controllers: [GitHubWebhookController],
  
})
export class AppModule {}
