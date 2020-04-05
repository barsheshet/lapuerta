const moment = require('moment');

module.exports = (User) => {
  return {
    toEntity(data) {
      return new User({
        id: data.id,
        tenant: data.tenant,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        info: data.info,
        isSmsTwoFa: data.is_sms_two_fa,
        roles: data.roles,
        isEmailVerified: data.is_email_verified,
        isMobileVerified: data.is_mobile_verified,
        providers: data.providers,
        emailVerificationToken: data.email_verification_token,
        emailVerificationExpires: moment(data.email_verification_expires),
        mobileVerificationCode: data.mobile_verification_code,
        mobileVerificationExpires: moment(data.mobile_verification_expires),
        resetPasswordToken: data.reset_password_token,
        resetPasswordExpires: moment(data.reset_password_expires),
        created: moment(data.created),
        updated: moment(data.updated),
      });
    },

    toDatabase(user) {
      return {
        id: user.id,
        tenant: user.tenant,
        email: user.email,
        mobile: user.mobile,
        password: user.password,
        info: user.info,
        is_sms_two_fa: user.isSmsTwoFa,
        roles: user.roles,
        is_email_verified: user.isEmailVerified,
        is_mobile_verified: user.isMobileVerified,
        providers: user.providers,
        email_verification_token: user.emailVerificationToken,
        email_verification_expires: user.emailVerificationExpires,
        mobile_verification_code: user.mobileVerificationCode,
        mobile_verification_expires: user.mobileVerificationExpires,
        reset_password_token: user.resetPasswordToken,
        reset_password_expires: user.resetPasswordExpires,
        created: user.created || moment().utc().format(),
        updated: moment().utc().format(),
      };
    },
  };
};
