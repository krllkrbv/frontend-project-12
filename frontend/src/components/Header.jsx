import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice'

const Header = () => {
  const { t } = useTranslation()
  const user = useSelector(state => state.auth.user)
  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg bg-light border-bottom">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          {t('title')}
        </Link>
        {(user || token) && (
          <button
            onClick={handleLogout}
            className="btn btn-primary"
          >
            {t('logoutBtn')}
          </button>
        )}
      </div>
    </nav>
  )
}

export default Header