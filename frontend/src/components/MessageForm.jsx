import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { filterProfanity } from '../utils/profanityFilter'
import api from '../services/api'

const MessageForm = () => {
  const { t } = useTranslation()
  const [message, setMessage] = useState('')
  const { currentChannelId } = useSelector(state => state.channels)
  const user = useSelector(state => state.auth.user)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim() || !currentChannelId) return

    try {
      const filteredMessage = filterProfanity(message.trim())
      const username = user?.username || localStorage.getItem('username') || 'User'

      const messageData = {
        body: filteredMessage,
        channelId: currentChannelId,
        username,
      }

      // Отправляем на сервер HTTP-запросом — сервер сам разошлёт по сокету всем клиентам
      await api.post('/messages', messageData)

      setMessage('')
    }
    catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="input-group">
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('messagePlaceholder')}
        className="form-control"
        name="body"
        aria-label={t('newMessage')}
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className="btn btn-outline-secondary"
      >
        →
        <span className="visually-hidden">
          {t('messageBtnText')}
        </span>
      </button>
    </form>
  )
}

export default MessageForm