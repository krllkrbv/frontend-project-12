import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import api from '../services/api'
import { setToken, setUser } from '../slices/authSlice'
const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [authError, setAuthError] = useState('')
  const validationSchema = Yup.object({
    username: Yup.string().required(t('signupPage.required')),
    password: Yup.string().required(t('signupPage.required')),
  })
  const handleSubmit = async (values, { setSubmitting }) => {
    setAuthError('')
    try {
      const response = await api.post('/login', values)
      if (response.status === 200 && response.data.token) {
        const { token, username } = response.data
        dispatch(setToken(token))
        dispatch(setUser({ username }))
        navigate('/')
      }
    }
    catch (error) {
      console.error('Login error:', error)
      setAuthError(t('loginPage.error'))
    }
    finally {
      setSubmitting(false)
    }
  }
  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src="https://frontend-chat-ru.hexlet.app/assets/avatar-DIE1AEpS.jpg"
                  alt="Login illustration"
                  className="img-fluid"
                />
              </div>
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <div className="text-center" style={{ maxWidth: '400px', width: '100%' }}>
                  <h2 className="mb-4">{t('loginPage.title')}</h2>
                  {authError && (
                    <div className="alert alert-danger" role="alert" data-testid="login-error">
                      {authError}
                    </div>
                  )}
                  <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <div className="mb-3">
                          <label htmlFor="username" className="form-label">
                            {t('loginPage.usernamePlaceholder')}
                          </label>
                          <Field
                            type="text"
                            id="username"
                            name="username"
                            className={`form-control ${authError ? 'is-invalid' : ''}`}
                            autoComplete="username"
                          />
                          <ErrorMessage
                            name="username"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="password" className="form-label">
                            {t('loginPage.passwordPlaceholder')}
                          </label>
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            className={`form-control ${authError ? 'is-invalid' : ''}`}
                            autoComplete="current-password"
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-100 btn btn-primary"
                        >
                          {t('loginPage.loginBtn')}
                        </button>
                      </Form>
                    )}
                  </Formik>
                  <div className="mt-3">
                    <span>
                      {t('loginPage.noAcc')}
                      <Link to="/signup"> 
                        {' '}
                        {t('loginPage.signupLink')}
                      </Link>
                    </span>
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
export default LoginPage
