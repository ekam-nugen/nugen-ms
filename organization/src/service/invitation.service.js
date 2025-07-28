import crypto from 'crypto';
import logger from '../config/logger.js';
import { Invitation, UserOrganization } from '../schemas/index.js';
import { ValidationError } from '../utils/errors.js';

export const createInvitation = async (
  adminUserId,
  invitationLink,
  companyId,
  { email, deliveryMethod },
) => {
  const userOrg = await UserOrganization.findOne({
    userId: adminUserId,
    companyId,
    role: 'admin',
  });
  if (!userOrg) {
    throw {
      type: 'Authorization Error',
      message: 'Only admins can send invitations',
      statusCode: 403,
    };
  }

  const token = crypto.randomBytes(32).toString('hex');
  // const token =
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  if (!invitationLink) {
    const invitation = new Invitation({
      token,
      email,
      companyId,
      expiresAt,
      status: 'pending',
      createdBy: adminUserId,
    });
    await invitation.save();
  }
  const joinLink = `${process.env.CLIENT_SIDE_BASE_URL}/invitationCard/${token}/company/${companyId}/user/${adminUserId}`;

  if (deliveryMethod === 'email') {
    // await sendEmailInvitation(email, joinLink);
  } else if (deliveryMethod === 'sms') {
    // await sendSmsInvitation(email, joinLink);
  }
  // else {
  //   throw new ValidationError('Invalid delivery method. Use "email" or "sms".');
  // }

  return { token, email, companyId, expiresAt, joinLink };
};

const sendEmailInvitation = async (email, joinLink) => {
  //   const transporter = nodemailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: process.env.SMTP_PORT,
  //     secure: false,
  //     auth: {
  //       user: process.env.SMTP_USER,
  //       pass: process.env.SMTP_PASS,
  //     },
  //   });
  //   const mailOptions = {
  //     from: process.env.SMTP_FROM,
  //     to: email,
  //     subject: 'Invitation to Join Organization',
  //     text: `You have been invited to join an organization. Click the link to join: ${joinLink}`,
  //     html: `<p>You have been invited to join an organization. Click <a href="${joinLink}">here</a> to join.</p>`,
  //   };
  //   try {
  //     await transporter.sendMail(mailOptions);
  //     logger.info(`Invitation email sent to ${email}`);
  //   } catch (err) {
  //     logger.error(`Failed to send email: ${err.message}`);
  //     throw { type: 'Server Error', message: 'Failed to send email invitation', statusCode: 500 };
  //   }
};

const sendSmsInvitation = async (email, joinLink) => {
  // Placeholder for Twilio SMS
  logger.info(
    `SMS invitation would be sent to ${email} with link: ${joinLink}`,
  );
  // To enable Twilio, install `twilio` and configure:
  /*
  import twilio from 'twilio';
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({
    body: `You are invited to join an organization: ${joinLink}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber, // Map email to phone number or require phone input
  });
  */
  //   throw { type: 'Server Error', message: 'SMS service not configured', statusCode: 501 };
};
