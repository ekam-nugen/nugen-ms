export const createOrganizationSchema = {
  type: 'object',
  properties: {
    companyName: { type: 'string', minLength: 1 },
    mobile: { type: 'string', pattern: '^[0-9]{10}$', nullable: true },
    industry: { type: 'string', nullable: true },
    employees: { type: 'string', nullable: true },
    role: { type: 'string', nullable: true },
    features: { type: 'array', items: { type: 'string' } },
    logo: { type: 'string', nullable: true },
    allowed: { type: 'boolean', nullable: true },
  },
  required: ['companyName', 'mobile', 'industry', 'employees', 'role'],
  additionalProperties: false,
  errorMessage: {
    required: {
      companyName: 'Company name is required',
      mobile: 'Mobile is required',
      industry: 'Industry is required',
      employees: 'Employees count is required',
      role: 'Role is required',
    },
    properties: {
      companyName: 'Company name is required',
      mobile: 'Mobile must be a 10-digit number',
      industry: 'Industry must be a string',
      employees: 'Employees must be a string',
      role: 'Role must be a string',
      features: 'Features must be an array of strings',
      logo: 'Logo must be a string',
      allowed: 'Allowed must be a boolean',
    },
  },
};

export const checkOrganizationSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    mobile: { type: 'string', pattern: '^[0-9]{10}$' },
  },
  anyOf: [{ required: ['email'] }, { required: ['mobile'] }],
  additionalProperties: false,
  errorMessage: {
    anyOf: 'Email or mobile is required',
    properties: {
      email: 'Invalid email format',
      mobile: 'Mobile must be a 10-digit number',
    },
  },
};

export const joinOrganizationSchema = {
  type: 'object',
  properties: {
    companyId: { type: 'string' },
  },
  required: ['companyId'],
  additionalProperties: false,
  errorMessage: {
    required: 'Company ID is required',
    properties: {
      companyId: 'Company ID is required',
    },
  },
};

export const updateOrganizationSchema = {
  type: 'object',
  properties: {
    companyId: { type: 'string' },
    companyName: { type: 'string', minLength: 1 },
    mobile: { type: 'string', pattern: '^[0-9]{10}$', nullable: true },
    industry: { type: 'string', nullable: true },
    employees: { type: 'number', nullable: true },
    role: { type: 'string', nullable: true },
    features: { type: 'array', items: { type: 'string' } },
    logo: { type: 'string', nullable: true },
  },
  required: ['companyId'],
  additionalProperties: false,
  errorMessage: {
    required: 'Company ID is required',
    properties: {
      companyId: 'Company ID is required',
      companyName: 'Company name is required',
      mobile: 'Mobile must be a 10-digit number',
      industry: 'Industry must be a string',
      employees: 'Employees must be a number',
      role: 'Role must be a string',
      features: 'Features must be an array of strings',
      logo: 'Logo must be a string',
    },
  },
};

export const createInvitationSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    mobile: { type: 'string', pattern: '^[0-9]{10}$' },
    companyId: { type: 'string' },
    deliveryMethod: {
      type: 'string',
      enum: ['email', 'sms'],
    },
  },
  anyOf: [{ required: ['email'] }, { required: ['mobile'] }],
  additionalProperties: false,
  errorMessage: {
    anyOf: 'Email or mobile is required',
    properties: {
      email: 'Invalid email format',
      mobile: 'Mobile must be a 10-digit number',
      companyId: 'Company ID is required',
      deliveryMethod: 'Delivery method must be either email or sms',
    },
  },
};
