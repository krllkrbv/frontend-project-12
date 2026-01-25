import { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { renameChannel } from '../slices/channelsSlice'
import { filterProfanity } from '../utils/profanityFilter'

const RenameChannelModal = ({ isOpen, onClose, channel }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const channels = useSelector(state => state.channels.items)

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('modals.addErrors.min'))
      .max(20, t('modals.addErrors.max'))
      .required(t('modals.addErrors.required'))
      .test('unique', t('modals.addErrors.repeats'), function (value) {
        if (!value || !channel) return true
        return !channels.some(ch =>
          ch.id !== channel.id && ch.name.toLowerCase() === value.toLowerCase(),
        )
      }),
  })

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const filteredName = filterProfanity(values.name.trim())
      await dispatch(renameChannel({
        channelId: channel.id,
        name: filteredName,
      })).unwrap()
      resetForm()
      onClose()
    }
    catch (error) {
      console.error('Failed to rename channel:', error)
    }
    finally {
      setSubmitting(false)
    }
  }

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
                {t('modals.titles.renamingChannel')}
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              />
            </div>
            <Formik
              initialValues={{ name: channel.name }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label
                        htmlFor="channelName"
                        className="form-label"
                      >
                        {t('modals.addLabel')}
                      </label>
                      <Field
                        type="text"
                        id="channelName"
                        name="name"
                        className="form-control"
                        autoFocus
                        data-testid="channel-name-input"
                        autoComplete="off"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-danger small"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn btn-secondary"
                    >
                      {t('modals.renameBtns.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                    >
                      {isSubmitting
                        ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            />
                            {t('loading.saving')}
                          </>
                        )
                        : t('modals.renameBtns.submit')}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  )
}

RenameChannelModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  channel: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
}

export default RenameChannelModal