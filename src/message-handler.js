export function createMessageHandler({ eventEmitter }) {
  return function handleMessage(message) {
    if (!message || !message.event_name) {
      return;
    }

    switch (message.event_name) {
      case 'livechat:customer_profile':
        eventEmitter.emit('customer_profile', message.event_data);
        break;

      case 'livechat:customer_profile_hidden':
        eventEmitter.emit('customer_profile_hidden', message.event_data);
        break;

      case 'livechat:message':
        eventEmitter.emit('message', message.event_data);
        break;

      case 'livechat:customer_details_section_button_click':
        eventEmitter.emit('customer_details_section_button_click', message.event_data);
        break;

      case 'livechat:message_box_text':
        eventEmitter.emit('message_box_text', message.event_data);
        break;
    }
  };
}
