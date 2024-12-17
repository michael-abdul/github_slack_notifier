import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { SlackService } from 'nestjs-slack';

@Controller('github-webhook')
export class GitHubWebhookController {
  constructor(private readonly slackService: SlackService) {}

  @Post()
  async handlePushEvent(@Body() payload: any) {
    // 마스터 브랜치로의 푸시인지 확인
    if (payload.ref === 'refs/heads/master') {
      const repoName = payload.repository?.name;
      const pusherName = payload.pusher?.name;
      const commitMessage = payload.head_commit?.message;
      const commitUrl = payload.head_commit?.url;
      const authorName = payload.head_commit?.author?.name;
      const authorEmail = payload.head_commit?.author?.email;

      const message = `📦 *${repoName}* 저장소에 새로운 푸시가 발생했습니다.\n` +
                      `👤 *푸셔:* ${pusherName}\n` +
                      `📝 *커밋 메시지:* ${commitMessage}\n` +
                      `🔗 *커밋 URL:* ${commitUrl}\n` +
                      `✍️ *작성자:* ${authorName} (${authorEmail})`;

      try {
        await this.slackService.sendText(message);
      } catch (error) {
        console.error('Slack 메시지 전송 오류:', error.message);
        throw new HttpException('Slack 알림 전송에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
