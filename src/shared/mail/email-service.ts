import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('mail.host'),
            port: this.configService.get<number>('mail.port'),
            secure: this.configService.get<string>('mail.secure') === 'true',
            auth: {
                user: this.configService.get<string>('mail.user'),
                pass: this.configService.get<string>('mail.pass'),
            },
        });
    }

    async sendEmail(
        to: string,
        subject: string,
        htmlContent: string,
    ): Promise<boolean> {
        try {
            const mailOptions = {
                from: this.configService.get<string>('mail.from'),
                to,
                subject,
                html: htmlContent,
                // attachments: [
                //     {
                //         filename: 'logo.png',
                //         path: path.join(process.cwd(), 'src/assets/logo.png'),
                //         cid: 'logo',
                //         contentDisposition: 'inline' as const,
                //     },
                // ],
            };

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            this.logger.error('Error sending email', error);
            return false;
        }
    }

}