import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { removeChannel } from '../../slices/channelsSlice'

const RemoveChannelContent = ({ onClose, channel }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [isRemoving, setIsRemoving] = useState(false)

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

  return (
    <>
      <div className="modal-body">
        <p>
          {t('modals.deleteQuestion')}
          {' '}
          <b>{channel.name}</b>
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
    </>
  )
}

RemoveChannelContent.propTypes = {
  onClose: PropTypes.func.isRequired,
  channel: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
}

export default RemoveChannelContent
