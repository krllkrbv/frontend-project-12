import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { fetchChannels, addChannel, removeChannelById, updateChannel } from '../slices/channelsSlice'
import { fetchMessages, addMessage } from '../slices/messagesSlice'
import socketService from '../services/socket'

const ChatPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const { items: channels, currentChannelId, loading: channelsLoading } = useSelector(state => state.channels)
  const { items: messages, loading: messagesLoading } = useSelector(state => state.messages)

  const currentChannel = channels.find(channel => channel.id === currentChannelId)
  const channelMessages = messages.filter(message => message.channelId === currentChannelId)

  const messagesBoxRef = useRef(null)

  useEffect(() => {
    if (!token) return

    dispatch(fetchChannels())
    dispatch(fetchMessages())
  }, [token, dispatch])

  useEffect(() => {
    if (!token) {
      return
    }

    try {
      socketService.connect(token)

      const handleNewMessage = (newMessage) => {
        const username = newMessage.username || 'User'
        const messageWithUsername = { ...newMessage, username }
        dispatch(addMessage(messageWithUsername))
      }

      const handleNewChannel = (newChannel) => {
        dispatch(addChannel(newChannel))
      }

      const handleRemoveChannel = (channelId) => {
        dispatch(removeChannelById(channelId))
      }

      const handleRenameChannel = (updatedChannel) => {
        dispatch(updateChannel(updatedChannel))
      }

      socketService.onNewMessage(handleNewMessage)
      socketService.onNewChannel(handleNewChannel)
      socketService.onRemoveChannel(handleRemoveChannel)
      socketService.onRenameChannel(handleRenameChannel)
    }
    catch (error) {
      console.error('WebSocket connection failed:', error)
    }

    return () => {
      socketService.disconnect()
    }
  }, [token, dispatch])

  useEffect(() => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight
    }
  }, [channelMessages])

  if (channelsLoading || messagesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">
            {t('common.loading')}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid h-100">
      <div className="row g-0 h-100 flex-grow-1">
        <div className="col-4 col-md-3">
          <div className="h-100 border-end bg-light">
            <ChannelsList />
          </div>
        </div>
        <div className="col-8 col-md-9 d-flex flex-column h-100">
          <div className="p-3 border-bottom bg-light flex-shrink-0">
            <div>
              <b>
                {currentChannel ? `# ${currentChannel.name}` : 'Выберите канал'}
              </b>
            </div>
            {currentChannel && (
              <div className="text-muted small">
                {channelMessages.length}
                {t('messages_many')}
              </div>
            )}
          </div>
          <div className="flex-grow-1 overflow-auto p-3" id="messages-box" ref={messagesBoxRef}>
            {messagesLoading
              ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">
                      Загрузка сообщений...
                    </span>
                  </div>
                </div>
              )
              : channelMessages.length === 0
                ? <div />
                : channelMessages.map(message => (
                  <div key={message.id} className="text-break mb-2">
                    <b>
                      {message.username || 'User'}
                    </b>
                    :

                    <span>
                      {message.body}
                    </span>
                  </div>
                ),
                )}
          </div>
          <div className="mt-auto p-3 border-top bg-white flex-shrink-0">
            <MessageForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage