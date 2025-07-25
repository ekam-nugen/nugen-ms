import * as invitationService from '../service/invitation.service.js';
import sendResponse from '../utils/response.handler.js';

export const createInvitation = async (req, res) => {
  const { invitationLink = false } = req.query;
  const { email, deliveryMethod, companyId } = req.body;
  if (!invitationLink) {
    if (!email || !deliveryMethod) {
      return sendResponse(res, {
        error: {
          type: 'Validation Error',
          message: 'Email and deliveryMethod are required',
          statusCode: 400,
        },
      });
    }
  }
  if (!companyId) {
    return sendResponse(res, {
      error: {
        type: 'Validation Error',
        message: 'companyId is required',
        statusCode: 400,
      },
    });
  }
  try {
    const invitation = await invitationService.createInvitation(
      req.user.userId,
      invitationLink,
      // req.body.companyId,
      companyId,
      {
        email,
        deliveryMethod,
      },
    );
    return sendResponse(res, {
      data: {
        token: invitation.token,
        email,
        companyId: invitation.companyId,
        joinLink: invitation.joinLink,
      },
      message: `Invitation sent to ${email} via ${deliveryMethod}`,
      statusCode: 201,
    });
  } catch (err) {
    return sendResponse(res, { error: err });
  }
};
