import * as Yup from 'yup'

export const getSignupSchema = t => Yup.object({
  username: Yup.string()
    .min(3, t('signupPage.usernamePlaceholder'))
    .max(20, t('signupPage.usernamePlaceholder'))
    .required(t('signupPage.required')),
  password: Yup.string()
    .min(6, t('signupPage.passwordPlaceholder'))
    .required(t('signupPage.required')),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], t('signupPage.confirmPasswordPlaceholder'))
    .required(t('signupPage.required')),
})

export const getLoginSchema = t => Yup.object({
  username: Yup.string().required(t('signupPage.required')),
  password: Yup.string().required(t('signupPage.required')),
})

export const getChannelSchema = (t, channels, excludeChannelId = null) => Yup.object({
  name: Yup.string()
    .min(3, t('modals.addErrors.min'))
    .max(20, t('modals.addErrors.max'))
    .required(t('modals.addErrors.required'))
    .test('not-only-spaces', t('modals.addErrors.required'), (value) => {
      if (!value) return false
      return value.trim().length >= 3
    })
    .test('unique', t('modals.addErrors.repeats'), (value) => {
      if (!value) return true
      return !channels.some(ch =>
        ch.id !== excludeChannelId && ch.name.toLowerCase() === value.toLowerCase(),
      )
    }),
})
