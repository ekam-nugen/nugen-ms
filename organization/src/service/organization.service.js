import mongoose, { Types } from 'mongoose';
import {
  Invitation,
  Organization,
  UserOrganization,
} from '../schemas/index.js';
import {
  AuthenticationError,
  TransactionError,
  ValidationError,
} from '../utils/errors.js';
import axios from 'axios';
import sendResponse from '../utils/response.handler.js';

export const createOrganization = async (
  userId,
  email,
  {
    companyName,
    mobile,
    industry,
    employees = 1,
    features,
    logo,
    role,
    allowed = false,
  },
) => {
  let query = {};
  if (email) {
    query = { email: { $regex: new RegExp(`^${email}$`, 'i') } };
  } else if (mobile) {
    query = { mobile };
  } else {
    throw new ValidationError(
      'Email or mobile is required to create an organization',
    );
  }

  const existingOrg = await Organization.findOne(query);
  if (existingOrg && existingOrg.companyName === companyName) {
    throw new ValidationError(
      'Email already exists. Please choose a different email.',
    );
  }

  let checkCompanyNameExist = await Organization.findOne({
    companyName: { $regex: new RegExp(`^${companyName}$`, 'i') },
  });
  if (checkCompanyNameExist) {
    throw new ValidationError(
      'Company name already exists. Please choose a different company name.',
    );
  }

  if (existingOrg && !allowed) {
    return {
      exist: true,
    };
    // throw new ValidationError(
    //   `${email ? 'Email' : 'Mobile'} already exists with this organization. Do you want to proceed with the same ${email ? 'email' : 'mobile'}?`,
    // );
  }

  // const session = await mongoose.startSession();
  try {
    // session.startTransaction();

    const organization = await Organization.create({
      companyName,
      email,
      mobile,
      industry,
      employees,
      features,
      logo,
      role,
    });
    // await organization.save({ session });

    const userOrg = await UserOrganization.create({
      userId,
      companyId: organization._id,
      role: 'admin',
    });
    // await userOrg.save({ session });

    // await session.commitTransaction();

    return userOrg;
  } catch (err) {
    console.log(err);
    // await session.abortTransaction();
    if (err.type && err.statusCode) {
      throw err; // Re-throw validation or custom errors
    }
    throw new TransactionError(
      'Transaction failed while creating organization',
    );
  } finally {
    // session.endSession();
  }
};

export const getOrganizationInfoById = async (orgId) => {
  try {
    const orgInfo = await Organization.findOne({
      _id: orgId,
    });
    return orgInfo;
  } catch (error) {
    console.log(error);
  }
};

export const checkOrganization = async ({ email, mobile }) => {
  const query = {};
  if (mobile) query.mobile = mobile;
  else if (email) query.email = { $regex: new RegExp(`^${email}$`, 'i') };
  if (!email && !mobile) {
    throw new ValidationError(
      'Email or mobile is required to check organization',
    );
  }
  const organization = await Organization.find(query);
  if (!organization) return null;
  return organization;
};

export const listOrganizations = async (userId) => {
  const userOrgs = await UserOrganization.aggregate([
    [
      {
        $match: {
          userId: new Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'organizations',
          localField: 'companyId',
          foreignField: '_id',
          as: 'organizationInfo',
        },
      },
      {
        $unwind: {
          path: '$organizationInfo',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          _id: 1,
          companyId: '$organizationInfo._id',
          companyName: '$organizationInfo.companyName',
          // companyLogo: '$organizationInfo.logo',
          companyLogo:
            'https://cdn.connecteam.com/images/base-line/boarding/widgets/free-credits.svg',
          companyIndustry: '$organizationInfo.industry',
          companyEmployees: '$organizationInfo.employees',
          companyFeatures: '$organizationInfo.features',
          companyAddress: '$organizationInfo.address',
          companyCreatedAt: '$organizationInfo.createdAt',
          companyUpdatedAt: '$organizationInfo.updatedAt',
        },
      },
    ],
  ]);

  return userOrgs;
};

export const updateOrganization = async (
  userId,
  {
    companyId,
    companyName,
    email,
    mobile,
    industry,
    employees,
    features,
    logo,
  },
) => {
  const userOrg = await UserOrganization.findOne({ userId, companyId });
  if (!userOrg) {
    throw new ValidationError(
      'User is not part of this organization or does not exist',
    );
  }
  if (userOrg.role !== 'admin') {
    throw new AuthenticationError(
      'User does not have permission to update this organization',
    );
  }
  const organization = await Organization.findById(companyId);
  if (!organization) {
    throw new ValidationError('Organization not found or does not exist');
  }
  const updatedOrganization = await Organization.updateOne(
    { _id: companyId },
    {
      $set: {
        companyName,
        email,
        mobile,
        industry,
        employees,
        features,
        logo,
      },
    },
  );
  return {
    ...updatedOrganization,
  };
};

export const joinOrganization = async (
  token,
  invitationLink,
  { email, password, firstName, lastName, companyId, invitedBy },
) => {
  if (!invitationLink) {
    const invitation = await Invitation.findOne({ token, status: 'pending' });
    if (!invitation) {
      throw {
        type: 'Validation Error',
        message: 'Invalid or expired invitation token',
        statusCode: 400,
      };
    }
    if (invitation.expiresAt < new Date()) {
      invitation.status = 'expired';
      await invitation.save();
      throw {
        type: 'Validation Error',
        message: 'Invitation has expired',
        statusCode: 400,
      };
    }
    if (invitation.email.toLowerCase() !== email.toLowerCase()) {
      throw {
        type: 'Authorization Error',
        message: 'Email does not match invitation',
        statusCode: 403,
      };
    }
    const organization = await Organization.findById(invitation.companyId);
    if (!organization) {
      throw {
        type: 'Validation Error',
        message: 'Organization not found',
        statusCode: 404,
      };
    }
  }
  const organizationInfo = await Organization.findById({
    _id: companyId,
  });
  if (!organizationInfo) {
    throw {
      type: 'Validation Error',
      message: 'Organization not found',
      statusCode: 404,
    };
  }

  // Sign up user via Authentication Microservice
  let userId;
  try {
    const response = await axios.post(
      `${process.env.AUTH_SERVICE_URL}/email/signup`,
      {
        email,
        password,
        firstName,
        lastName,
        invitationStatus: 'pending',
        invitedBy,
        isInvited: true,
      },
    );
    if (response.data) {
      return response.data;
    }
    console.log('User signed up successfully:', response.data);
  } catch (err) {
    throw {
      type: 'Validation Error',
      message: `Signup failed: ${err.response?.data?.errors?.message || err.message}`,
      statusCode: err.response?.status || 400,
    };
  }
};
