import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { renameChannel } from '../../slices/channelsSlice'
import { filterProfanity } from '../../utils/profanityFilter'
import { getChannelSchema } from '../../utils/validationSchemas'

const RenameChannelContent = ({ onClose, channel }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const channels = useSelector(state => state.channels.items)
  const validationSchema = getChannelSchema(t, channels, channel.id)

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const filteredName = filterProfanity(values.name.trim())
      await dispatch(renameChannel({ channelId: channel.id, name: filteredName })).unwrap()
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

  return (
    <Formik
      initialValues={{ name: channel.name }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="channelName" className="form-label">
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
              <ErrorMessage name="name" component="div" className="text-danger small" />
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
  )
}

RenameChannelContent.propTypes = {
  onClose: PropTypes.func.isRequired,
  channel: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
}

export default RenameChannelContent
