import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { createChannel } from '../../slices/channelsSlice'
import { filterProfanity } from '../../utils/profanityFilter'
import { getChannelSchema } from '../../utils/validationSchemas'

const AddChannelContent = ({ onClose }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const channels = useSelector(state => state.channels.items)
  const validationSchema = getChannelSchema(t, channels)

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const filteredName = filterProfanity(values.name.trim())
      await dispatch(createChannel({ name: filteredName })).unwrap()
      resetForm()
      onClose()
    }
    catch {
      // keep modal open on error
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <Formik
      initialValues={{ name: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form data-testid="add-channel-form">
          <div className="modal-body">
            <div className="mb-3">
              <label
                htmlFor="channelName"
                className="form-label"
                style={{ fontSize: '1px', color: '#000', margin: '0', padding: '0', height: '1px', overflow: 'hidden' }}
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
                placeholder={t('modals.addLabel')}
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
              data-testid="cancel-button"
            >
              {t('modals.addBtns.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              data-testid="submit-button"
            >
              {isSubmitting
                ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      {t('loading.creating')}
                    </>
                  )
                : t('modals.addBtns.submit')}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

AddChannelContent.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default AddChannelContent
