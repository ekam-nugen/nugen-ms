import { Organization, UserOrganization } from '../schemas/index.js';
import { ValidationError } from '../utils/errors.js';

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

  const session = await Organization.startSession();
  try {
    let organization;
    await session.withTransaction(async () => {
      organization = new Organization({
        companyName,
        email,
        mobile,
        industry,
        features,
        logo,
        role,
        employees,
      });
      await organization.save({ session });

      const userOrg = new UserOrganization({
        userId,
        orgId: organization._id,
        role: 'admin',
      });
      await userOrg.save({ session });
    });

    return {
      id: organization._id,
      companyName: organization.companyName,
      email: organization.email,
      mobile: organization.mobile,
      role: organization.role,
      industry: organization.industry,
      employees: organization.employees,
      features: organization.features,
      logo: organization.logo,
    };
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }

  //   const organization = new Organization({
  //     companyName,
  //     email,
  //     mobile,
  //     industry,
  //     features,
  //     logo,
  //     role,
  //     employees,
  //   });
  //   await organization.save();

  //   const userOrg = new UserOrganization({
  //     userId,
  //     companyId: organization._id,
  //     role: 'admin',
  //   });
  //   await userOrg.save();

  //   return {
  //     id: organization._id,
  //     companyName: organization.companyName,
  //     email: organization.email,
  //     mobile: organization.mobile,
  //     role: organization.role,
  //     industry: organization.industry,
  //     employees: organization.employees,
  //     features: organization.features,
  //     logo: organization.logo,
  //   };
};

export const checkOrganization = async ({ email, mobile }) => {
  const query = {};
  if (email) query.email = { $regex: new RegExp(`^${email}$`, 'i') };
  if (mobile) query.mobile = mobile;
  if (!email && !mobile) {
    throw {
      type: 'Validation Error',
      message: 'Email or mobile is required',
      statusCode: 400,
    };
  }
  const organization = await Organization.findOne(query);
  if (!organization) return null;
  return {
    id: organization._id,
    name: organization.name,
    email: organization.email,
    mobile: organization.mobile,
    address: organization.address,
    exists: true,
  };
};

export const listOrganizations = async (userId) => {
  const userOrgs = await UserOrganization.find({ userId }).populate('orgId');
  return userOrgs.map((uo) => ({
    id: uo.id,
    name: uo.name,
    email: uo.email,
    mobile: uo.mobile,
    address: uo.address,
    role: uo.role,
  }));
};
