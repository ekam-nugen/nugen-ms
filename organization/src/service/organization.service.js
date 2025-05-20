import mongoose from 'mongoose';
import { Organization, UserOrganization } from '../schemas/index.js';
import {
  AuthenticationError,
  TransactionError,
  ValidationError,
} from '../utils/errors.js';

export const createOrganization = async (
  userId,
  {
    companyName,
    email,
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
      'Company name already exists. Please choose a different name.',
    );
  }
  if (existingOrg && !allowed) {
    throw new ValidationError(
      `${email ? 'Email' : 'Mobile'} already exists with this organization. Do you want to proceed with the same ${email ? 'email' : 'mobile'}?`,
    );
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const organization = new Organization({
      companyName,
      email,
      mobile,
      industry,
      employees,
      features,
      logo,
      role,
    });
    await organization.save({ session });

    const userOrg = new UserOrganization({
      userId,
      companyId: organization._id,
      role: 'admin',
    });
    await userOrg.save({ session });

    await session.commitTransaction();

    return {
      id: organization._id,
      name: organization.name,
      email: organization.email,
      mobile: organization.mobile,
      address: organization.address,
      role: 'admin',
    };
  } catch (err) {
    await session.abortTransaction();
    if (err.type && err.statusCode) {
      throw err; // Re-throw validation or custom errors
    }
    throw new TransactionError(
      'Transaction failed while creating organization',
    );
  } finally {
    session.endSession();
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
  const organization = await Organization.findOne(query);
  if (!organization) return null;
  return {
    companyName: organization.companyName,
    email: organization.email,
    mobile: organization.mobile,
    exists: true,
  };
};

export const listOrganizations = async (userId) => {
  const userOrgs = await UserOrganization.find({ userId }).populate(
    'companyId',
  );
  return userOrgs.map((uo) => ({
    userId: uo._id,
    companyId: uo.companyId._id,
    companyName: uo.companyId.companyName,
    companyLogo: uo.companyId.logo,
    companyIndustry: uo.companyId.industry,
    companyEmployees: uo.companyId.employees,
    companyFeatures: uo.companyId.features,
    companyAddress: uo.companyId.address,
    companyCreatedAt: uo.companyId.createdAt,
    companyUpdatedAt: uo.companyId.updatedAt,
  }));
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

export const joinOrganization = async (userId, companyId) => {
  const organization = await Organization.findById(companyId);
  if (!organization) {
    throw new ValidationError('Organization not found or does not exist');
  }
  const existingUserOrg = await UserOrganization.findOne({ userId, companyId });
  if (existingUserOrg) {
    throw new ValidationError(
      `User is already part of the organization ${organization.companyName}`,
    );
  }
  const userOrg = new UserOrganization({ userId, companyId, role: 'member' });
  await userOrg.save();
  return {
    id: organization._id,
    companyName: organization.companyName,
    role: 'member',
  };
};
