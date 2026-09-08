import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface InquiryEmailData {
  fullName: string;
  companyName?: string | null;
  email: string;
  phone?: string | null;
  projectType: string;
  budgetRange?: string | null;
  timeline?: string | null;
  description: string;
  inquiryId: string;
  attachmentName?: string | null;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (env.email.provider === 'smtp' && env.email.smtpUser) {
      this.transporter = nodemailer.createTransport({
        host: env.email.smtpHost,
        port: env.email.smtpPort,
        secure: env.email.smtpSecure,
        auth: {
          user: env.email.smtpUser,
          pass: env.email.smtpPass,
        },
      });
      logger.info(`Email service initialized with SMTP (${env.email.smtpHost}:${env.email.smtpPort})`);
    } else {
      logger.info(`Email service initialized in '${env.email.provider}' mode`);
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (env.email.provider === 'console' || !this.transporter) {
        logger.info(`
========== [SIMULATED EMAIL - ${options.subject}] ==========
To: ${options.to}
From: ${env.email.emailFrom}
Subject: ${options.subject}
${options.text || options.html.replace(/<[^>]*>?/gm, '')}
============================================================
        `);
        return true;
      }

      if (env.email.provider === 'resend' && env.email.resendApiKey) {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.email.resendApiKey}`,
          },
          body: JSON.stringify({
            from: env.email.emailFrom,
            to: [options.to],
            subject: options.subject,
            html: options.html,
            text: options.text,
          }),
        });
        if (!res.ok) {
          const errText = await res.text();
          logger.error(`Failed to send email via Resend: ${errText}`);
          return false;
        }
        return true;
      }

      await this.transporter.sendMail({
        from: env.email.emailFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      logger.info(`Email sent successfully to: ${options.to}`);
      return true;
    } catch (error: any) {
      logger.error(`Error sending email to ${options.to}:`, error.message);
      return false;
    }
  }

  async sendClientConfirmation(data: InquiryEmailData): Promise<boolean> {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="color: #0f172a; margin: 0; font-size: 22px;">Slidevance</h2>
          <p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px;">Presentation Design & Strategic Visual Communication</p>
        </div>

        <h3 style="color: #0f172a; margin-top: 0;">Thank you, ${data.fullName}!</h3>
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">
          We have successfully received your project inquiry. Our team is reviewing your requirements and will reach out within 24 hours (or sooner for urgent requests).
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px;">Summary of your submission:</h4>
          <ul style="list-style-type: none; padding: 0; margin: 0; font-size: 14px; line-height: 1.8; color: #475569;">
            <li><strong>Inquiry ID:</strong> ${data.inquiryId}</li>
            <li><strong>Project Type:</strong> ${data.projectType}</li>
            ${data.companyName ? `<li><strong>Company:</strong> ${data.companyName}</li>` : ''}
            ${data.phone ? `<li><strong>Phone:</strong> ${data.phone}</li>` : ''}
            ${data.timeline ? `<li><strong>Timeline:</strong> ${data.timeline}</li>` : ''}
            ${data.budgetRange ? `<li><strong>Budget Range:</strong> ${data.budgetRange}</li>` : ''}
            ${data.attachmentName ? `<li><strong>Attached File:</strong> ${data.attachmentName}</li>` : ''}
          </ul>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #64748b;">
          If you have additional files, brand guidelines, or revisions to share in the meantime, feel free to reply directly to this email.
        </p>

        <div style="border-top: 1px solid #e2e8f0; margin-top: 32px; padding-top: 16px; font-size: 12px; color: #94a3b8; text-align: center;">
          &copy; ${new Date().getFullYear()} Slidevance. All rights reserved.
        </div>
      </div>
    `;

    return this.sendEmail({
      to: data.email,
      subject: 'Thank you for contacting Slidevance.',
      html,
    });
  }

  async sendAdminNotification(data: InquiryEmailData): Promise<boolean> {
    const adminEmail = env.email.adminNotificationEmail;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px;">
        <div style="background-color: #0f172a; color: #ffffff; padding: 16px 20px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 18px;">🚨 New Slidevance Project Inquiry</h2>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
          <tbody>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px; font-weight: bold; width: 140px; color: #475569;">Client Name:</td>
              <td style="padding: 10px; color: #0f172a;">${data.fullName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px; font-weight: bold; color: #475569;">Email:</td>
              <td style="padding: 10px;"><a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px; font-weight: bold; color: #475569;">Company:</td>
              <td style="padding: 10px; color: #0f172a;">${data.companyName || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px; font-weight: bold; color: #475569;">Phone Number:</td>
              <td style="padding: 10px; color: #0f172a;">${data.phone || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px; font-weight: bold; color: #475569;">Project Type:</td>
              <td style="padding: 10px; color: #0f172a;">${data.projectType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px; font-weight: bold; color: #475569;">Budget Range:</td>
              <td style="padding: 10px; color: #0f172a;">${data.budgetRange || 'Not specified'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px; font-weight: bold; color: #475569;">Timeline:</td>
              <td style="padding: 10px; color: #0f172a;">${data.timeline || 'Not specified'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px; font-weight: bold; color: #475569;">Attached File:</td>
              <td style="padding: 10px; color: #0f172a;">${data.attachmentName || 'None'}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 16px;">
          <h4 style="margin: 0 0 8px 0; color: #0f172a;">Project Scope / Description:</h4>
          <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px 16px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${data.description}</div>
        </div>

        <div style="margin-top: 24px; padding: 12px; background-color: #eff6ff; border-radius: 6px; font-size: 13px; color: #1e40af;">
          Log in to the Slidevance Admin Panel to review this inquiry, update status, and download any attachments.
        </div>
      </div>
    `;

    return this.sendEmail({
      to: adminEmail,
      subject: 'New Slidevance Project Inquiry',
      html,
    });
  }
}

export const emailService = new EmailService();
