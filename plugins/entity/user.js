const hyperid = require('hyperid')({ urlSafe: true });
const moment = require('moment');
const bcrypt = require('bcrypt');
const randomNumber = require('random-number-csprng');
const owaspPasswordStrength = require('owasp-password-strength-test');
const { normalizeEmail, isEmail, isMobilePhone } = require('validator');

module.exports = class User {
  constructor(data = {}) {
    this._id = data.id || hyperid();
    this._tenant = data.tenant || User.DEFAULT_TENANT;
    this._email = data.email || null;
    this._mobile = data.mobile || null;
    this._password = data.password || null;
    this._info = data.info || {};
    this._isSmsTwoFa = data.isSmsTwoFa || false;
    this._roles = data.roles || [];
    this._isEmailVerified = data.isEmailVerified || false;
    this._isMobileVerified = data.isMobileVerified || false;
    this._providers = data.providers || [];
    this._emailVerificationToken = data.emailVerificationToken || null;
    this._emailVerificationExpires = data.emailVerificationExpires || null;
    this._mobileVerificationCode = data.mobileVerificationCode || null;
    this._mobileVerificationExpires = data.mobileVerificationExpires || null;
    this._resetPasswordToken = data.resetPasswordToken || null;
    this._resetPasswordExpires = data.resetPasswordExpires || null;
    this._created = data.created;
    this._updated = data.updated;
  }

  get id() {
    return this._id;
  }
  get tenant() {
    return this._tenant;
  }
  get email() {
    return this._email;
  }
  get password() {
    return this._password;
  }
  get mobile() {
    return this._mobile;
  }
  get info() {
    return JSON.parse(JSON.stringify(this._info));
  }
  get isSmsTwoFa() {
    return this._isSmsTwoFa;
  }
  get roles() {
    return [...this._roles];
  }
  get isEmailVerified() {
    return this._isEmailVerified;
  }
  get isMobileVerified() {
    return this._isMobileVerified;
  }
  get providers() {
    return this._providers.map((item) => JSON.parse(JSON.stringify(item)));
  }
  get emailVerificationToken() {
    return this._emailVerificationToken;
  }
  get emailVerificationExpires() {
    return this._emailVerificationExpires
      ? this._emailVerificationExpires.format()
      : null;
  }
  get mobileVerificationCode() {
    return this._mobileVerificationCode;
  }
  get mobileVerificationExpires() {
    return this._mobileVerificationExpires
      ? this._mobileVerificationExpires.format()
      : null;
  }
  get resetPasswordToken() {
    return this._resetPasswordToken;
  }
  get resetPasswordExpire() {
    return this._resetPasswordExpires
      ? this._resetPasswordExpires.format()
      : null;
  }
  get created() {
    return this._created ? this._created.format() : null;
  }
  get updated() {
    return this._updated ? this._updated.format() : null;
  }

  setEmail(email) {
    let normalized = normalizeEmail(email);
    if (!isEmail(normalized)) {
      throw new Error('Invalid email');
    }
    this._email = normalized;
    return this;
  }

  setMobile(mobile) {
    if (!isMobilePhone(mobile, null, { strictMode: true })) {
      throw new Error('Invalid mobile');
    }
    this._mobile = mobile;
    return this;
  }

  async setPassword(password) {
    const strength = owaspPasswordStrength.test(password);
    if (!strength.strong) {
      throw new Error(strength.errors[0]);
    }
    this._password = await bcrypt.hash(password, 10);
    return this;
  }

  setInfo(info) {
    this._info = JSON.parse(JSON.stringify(info));
    return this;
  }

  setIsSmsTwoFa(value) {
    const isSmsTwoFa = !!value;
    if (isSmsTwoFa && !this.mobile) {
      throw new Error('Cannot set sms 2FA without mobile phone');
    }
    this._isSmsTwoFa = isSmsTwoFa;
    return this;
  }

  addRole(role) {
    if (!Object.values(User.roles).includes(role)) {
      throw new Error('Invalid role');
    }
    if (!this._roles.includes(role)) {
      this._roles.push(role);
    }
    return this;
  }

  removeRole(role) {
    this._roles = this._roles.filter((item) => item === role);
    return this;
  }

  generateEmailVerificationToken(expirationInMinutes) {
    this._emailVerificationToken = hyperid();
    this._emailVerificationExpires = moment()
      .utc()
      .add(expirationInMinutes, 'minutes');
    return this;
  }

  verifyEmail(token) {
    if (
      !this._emailVerificationToken ||
      this._emailVerificationToken !== token ||
      this._emailVerificationExpires.isBefore(moment().utc())
    ) {
      throw new Error('Email verification failed');
    }
    return this;
  }

  async generateMobileVerificationCode(expirationInMinutes) {
    const randomNumberInRange = await randomNumber(1, 999999);
    this._mobileVerificationCode = randomNumberInRange
      .toString()
      .padStart(6, '0');
    this._mobileVerificationExpires = moment()
      .utc()
      .add(expirationInMinutes, 'minutes');
    return this;
  }

  verifyMobile(code) {
    if (
      !this._mobileVerificationCode ||
      this._mobileVerificationCode !== code ||
      this._mobileVerificationExpires.isBefore(moment().utc())
    ) {
      throw new Error('Mobile verification falied');
    }
    return this;
  }

  generateResetPasswordToken(expirationInMinutes) {
    this._resetPasswordToken = hyperid();
    this._resetPasswordExpires = moment()
      .utc()
      .add(expirationInMinutes, 'minutes');
    return this._resetPasswordToken;
  }

  resetPassword(newPassword, token) {
    if (
      !this._resetPasswordToken ||
      this._resetPasswordToken !== token ||
      this._resetPasswordExpires.isBefore(moment().utc())
    ) {
      throw new Error('Reset password falied');
    }
    this.setPassword(newPassword);
    return this;
  }

  async checkPassword(password) {
    const isValid = await bcrypt.compare(password, this.password);
    if (!isValid) {
      throw new Error('Wrong password');
    }
    return this;
  }

  static get roles() {
    return {
      USER: 'user',
      ADMIN: 'admin',
    };
  }

  static get providers() {
    return {
      LOCAL: 'local',
    };
  }

  static get DEFAULT_TENANT() {
    return 'default';
  }
};
