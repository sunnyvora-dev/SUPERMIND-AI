import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT') || 587;
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (host && user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        });
        this.isConfigured = true;
        this.logger.log(`Live Mail Service initialized with SMTP server: ${host}:${port}`);
      } catch (err: any) {
        this.logger.warn(`Failed to initialize SMTP transporter: ${err.message}`);
      }
    } else {
      this.logger.log(
        'SMTP credentials not set in .env. MailService running in Console-Log mode (OTPs logged to terminal).',
      );
    }
  }

  async sendOtpEmail(email: string, otpCode: string, purpose: 'login' | 'register' | 'forgot_password'): Promise<boolean> {
    const from = this.configService.get<string>('SMTP_FROM') || 'SuperMind AI <noreply@supermind.ai>';
    
    const titles = {
      login: 'SuperMind AI — Login 2FA Verification Code',
      register: 'SuperMind AI — Confirm Your Email Address',
      forgot_password: 'SuperMind AI — Reset Password Verification Code',
    };

    const subject = titles[purpose] || 'SuperMind AI Verification Code';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #050814; color: #f8fafc; margin: 0; padding: 40px 20px; }
          .container { max-width: 500px; margin: 0 auto; background-color: #0b0f1f; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; text-align: center; }
          .logo { width: 48px; height: 48px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px; color: #fff; font-size: 24px; font-weight: bold; line-height: 48px; margin: 0 auto 20px; }
          h2 { color: #ffffff; font-size: 22px; font-weight: 800; margin: 0 0 10px; }
          p { color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0 0 24px; }
          .code-box { background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 14px; padding: 18px; font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #818cf8; margin: 0 0 24px; }
          .footer { font-size: 12px; color: #64748b; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">S</div>
          <h2>Verification Code</h2>
          <p>Use the 6-digit code below to complete your authentication for <strong>${email}</strong>.</p>
          <div class="code-box">${otpCode}</div>
          <p style="font-size: 12px; color: #cbd5e1;">This code is valid for <strong>5 minutes</strong>. If you did not request this code, please ignore this email.</p>
          <div class="footer">&copy; ${new Date().getFullYear()} SuperMind AI Inc. All rights reserved.</div>
        </div>
      </body>
      </html>
    `;

    // 1. Log to console for instant developer feedback
    this.logger.log(`📧 [LIVE MAIL OTP] To: ${email} | Purpose: ${purpose.toUpperCase()} | Code: ${otpCode}`);

    // 2. Send via SMTP if configured
    if (this.isConfigured && this.transporter) {
      try {
        await this.transporter.sendMail({
          from,
          to: email,
          subject,
          html: htmlContent,
        });
        this.logger.log(`Successfully dispatched live email to ${email}`);
        return true;
      } catch (err: any) {
        this.logger.error(`Failed to send email to ${email}: ${err.message}`);
        return false;
      }
    }

    return true;
  }
}
