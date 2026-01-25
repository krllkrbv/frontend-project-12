import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { removeChannel } from '../slices/channelsSlice'

const RemoveChannelModal = ({ isOpen, onClose, channel }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleRemove = async () => {
    try {
      setIsRemoving(true)
      await dispatch(removeChannel(channel.id)).unwrap()
      onClose()
    }
    catch (error) {
      console.error('Failed to remove channel:', error)
    }
    finally {
      setIsRemoving(false)
    }
  }

  if (!isOpen || !channel) return null

  return (
    <>
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClose()
          }
        }}
        style={{ zIndex: 1040 }}
      />
      <div
        className="modal fade show"
        style={{ display: 'block', zIndex: 1050 }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h5">
                {t('modals.titles.deletingChannel')}
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <p>
                {t('modals.deleteQuestion')}
                {' '}
                <b>
                  {channel.name}
                </b>
                ?
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                {t('modals.deleteBtns.cancel')}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isRemoving}
                className="btn btn-danger"
              >
                {isRemoving
                  ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      {t('loading.deleting')}
                    </>
                  )
                  : t('modals.deleteBtns.delete')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

RemoveChannelModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  channel: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
}

export default RemoveChannelModal