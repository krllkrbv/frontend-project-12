import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import api from '../services/api'
import { setToken, setUser } from '../slices/authSlice'

const SignupPage = () => {
  const { t } = useTranslation()
  const [signupError, setSignupError] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const validationSchema = Yup.object({
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

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSignupError('')
      const response = await api.post('/signup', {
        username: values.username,
        password: values.password,
      })

      // После успешной регистрации сразу входим
      if (response.status === 201 || response.status === 200) {
        const loginResponse = await api.post('/login', {
          username: values.username,
          password: values.password,
        })

        if (loginResponse.data.token) {
          console.log('SignupPage - login successful, token:', loginResponse.data.token)
          const { token } = loginResponse.data
          const username = loginResponse.data.username || values.username
          dispatch(setToken(token))
          dispatch(setUser({ username }))
          navigate('/')
        }
      }
    }
    catch (error) {
      if (error.response?.status === 409) {
        setSignupError(t('signupPage.signupError'))
      }
      else {
        setSignupError(t('networkError'))
      }
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-fluid h-100" data-testid="signup-page">
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm" data-testid="signup-container">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src="https://frontend-chat-ru.hexlet.app/assets/avatar-DIE1AEpS.jpg" alt="Signup illustration" className="img-fluid" />
              </div>
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <h2 className="text-center mb-4" data-testid="signup-title">
                    {t('signupPage.title')}
                  </h2>
                  {signupError && (
                    <div className="alert alert-danger" role="alert">
                      {signupError}
                    </div>
                  )}
                  <Formik
                    initialValues={{ username: '', password: '', confirmPassword: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form data-testid="signup-form">
                        <div className="mb-3" data-testid="username-group">
                          <label htmlFor="username" className="form-label">
                            {t('signupPage.usernameLabel')}
                          </label>
                          <Field
                            type="text"
                            id="username"
                            name="username"
                            className="form-control"
                            data-testid="username-field"
                            autoComplete="username"
                          />
                          <ErrorMessage name="username" component="div" className="text-danger small" />
                        </div>

                        <div className="mb-3" data-testid="password-group">
                          <label htmlFor="password" className="form-label">
                            {t('signupPage.passwordLabel')}
                          </label>
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            data-testid="password-field"
                            autoComplete="new-password"
                          />
                          <ErrorMessage name="password" component="div" className="text-danger small" />
                        </div>

                        <div className="mb-4" data-testid="confirm-password-group">
                          <label htmlFor="confirmPassword" className="form-label">
                            {t('signupPage.confirmPasswordLabel')}
                          </label>
                          <Field
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control"
                            data-testid="confirm-password-field"
                            autoComplete="new-password"
                          />
                          <ErrorMessage name="confirmPassword" component="div" className="text-danger small" />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-100 btn btn-primary"
                          data-testid="signup-button"
                        >
                          {t('signupPage.signupBtn')}
                        </button>
                      </Form>
                    )}
                  </Formik>
                  <div className="text-center mt-3">
                    <span>
                      {t('signupPage.hasAcc')}
                    </span>

                    <Link to="/login">
                      {t('signupPage.loginLink')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage