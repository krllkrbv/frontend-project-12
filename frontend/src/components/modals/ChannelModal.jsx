import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import AddChannelContent from './AddChannelContent'
import RenameChannelContent from './RenameChannelContent'
import RemoveChannelContent from './RemoveChannelContent'

const TITLES = {
  add: 'modals.titles.addingChannel',
  rename: 'modals.titles.renamingChannel',
  remove: 'modals.titles.deletingChannel',
}

const CONTENTS = {
  add: AddChannelContent,
  rename: RenameChannelContent,
  remove: RemoveChannelContent,
}

const ChannelModal = ({ isOpen, onClose, type, channel }) => {
  const { t } = useTranslation()

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !type) return null

  const Content = CONTENTS[type]

  return (
    <>
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onClose()
        }}
        style={{ zIndex: 1040 }}
      />
      <div
        className="modal fade show"
        style={{ display: 'block', zIndex: 1050, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
        tabIndex="-1"
        data-testid={`${type}-channel-modal`}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h5">
                {t(TITLES[type])}
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              />
            </div>
            <Content onClose={onClose} channel={channel} />
          </div>
        </div>
      </div>
    </>
  )
}

ChannelModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['add', 'rename', 'remove']),
  channel: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
  }),
}

ChannelModal.defaultProps = {
  type: null,
  channel: null,
}

export default ChannelModal
