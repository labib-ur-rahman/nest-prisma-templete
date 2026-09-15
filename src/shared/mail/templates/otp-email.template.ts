import { baseEmailTemplate } from './base-email.template';

export const getOtpEmailContent = (
    otpCode: string,
    type: string = 'ACCOUNT_VERIFY',
    isResend: boolean = false,
): { subject: string; html: string } => {
    let subject = 'Your Verification Code';
    let title = 'Verification Code';
    let description =
        'Please use the verification code below to complete your authentication process. This code is valid for the next 10 minutes.';

    if (type === 'PASSWORD_RESET') {
        subject = isResend
            ? 'Resend: Password Reset Request'
            : 'Password Reset Request';
        title = isResend ? 'Resend Password Reset Code' : 'Password Reset';
        description = isResend
            ? 'You requested a new verification code to reset your password. Please use the code below to proceed.'
            : 'Please use the verification code below to reset your password. This code is valid for the next 10 minutes.';
    } else if (type === 'ACCOUNT_VERIFY' && isResend) {
        subject = 'Resend: Your Verification Code';
        title = 'Resend Verification Code';
        description =
            'You requested a new verification code to verify your account. Please use the code below to proceed.';
    }

    const content = `
    <p style="color: #cccccc; line-height: 1.6; text-align: center;">
      ${description}
    </p>
    <div style="background-color: rgba(255, 255, 255, 0.1); border: 1px solid #7F41F0; border-radius: 8px; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #fff; margin: 30px 0; text-align: center; max-width: 200px; margin-left: auto; margin-right: auto; max-height: 100px;">
      ${otpCode}
    </div>
    <p style="color: #cccccc; font-size: 14px; text-align: center;">
      If you didn't request this code, you can safely ignore this email.
    </p>
  `;

    return {
        subject,
        html: baseEmailTemplate(title, content),
    };
};