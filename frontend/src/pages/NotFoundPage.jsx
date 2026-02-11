import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
const NotFoundPage = () => {
  const { t } = useTranslation()
  return (
    <div className="container-fluid h-100" style={{ backgroundColor: '#f5f7fa' }}>
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid #dee2e6' }}>
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <h1 className="display-1" style={{ color: '#6c757d' }}>
                    {t('errors.notFound')}
                  </h1>
                  <h2 className="h4 mb-4" style={{ color: '#6c757d' }}>
                    {t('errors.notFoundTitle')}
                  </h2>
                  <p className="mb-4" style={{ color: '#6c757d' }}>
                    {t('errors.notFoundMessage')}
                  </p>
                  <Link
                    to="/"
                    className="btn"
                    style={{
                      backgroundColor: '#007bff',
                      borderColor: '#007bff',
                      color: '#ffffff',
                    }}
                  >
                    {t('common.back')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default NotFoundPage
