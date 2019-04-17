import mitt from 'mitt';
import { createConnection } from './connection';
import { createMessageHandler } from './message-handler';
import { createComponentProcessor } from './customer-details';
import { startURLMirroring, stopURLMirroring } from './url-mirroring';

export function createSdk() {
  const initMessage = 'plugin_inited';
  let connection;
  let initialized = false;
  let initializer;

  const eventEmitter = mitt();
  const handleMessage = createMessageHandler({ eventEmitter });
  const processCustomerDetailsComponents = createComponentProcessor();

  const getConnection = () => {
    if (connection) {
      return Promise.resolve(connection);
    }

    return createConnection({ handleMessage }).then(
      _connection => (connection = _connection)
    );
  };

  return {
    init() {
      if (!initializer) {
        initializer = this._sendMessage(initMessage).then(() => {
          initialized = true;
        });
      }

      return initializer;
    },

    on: eventEmitter.on,

    off: eventEmitter.off,

    track(eventName = '', eventProperties = {}) {
      if (
        typeof eventName !== 'string' ||
        typeof eventProperties !== 'object'
      ) {
        return false;
      }

      return this._sendMessage('track', {
        event_name: eventName,
        event_properties: eventProperties
      });
    },

    refreshSessionId() {
      return this._sendMessage('plugin_loaded');
    },

    getSessionId() {
      return null;
    },

    putMessage(data) {
      return this._sendMessage('put_message', data);
    },

    watchMessages() {
      return this._sendMessage('watch_messages');
    },

    modifyCustomerDetailsSection(section) {
      if (!section) {
        throw new Error('You need to provide a section defintion');
      }

      const { title, imgUrl, components } = section;

      if (!title) {
        throw new Error(
          `You need to provide a title for the new section using the 'title' property`
        );
      }

      if (!Array.isArray(components) || !components.length) {
        throw new Error(
          `You need to provide an array of component definitions for your section using the 'components' property`
        );
      }

      return this._sendMessage('customer_details_section', {
        title,
        imgUrl,
        components: processCustomerDetailsComponents(components)
      });
    },

    sendQuickReplies(title, buttons) {
      return this._sendMessage('send_quick_replies', {title, buttons});
    },

    sendCards(cards) {
      return this._sendMessage('send_cards', Array.isArray(cards) ? cards : [cards]);
    },

    startURLMirroring: () => {
      startURLMirroring(({url}) => {
        this._sendMessage('new_url', {url});
      });
    },

    stopURLMirroring,

    _sendMessage(message, data = null) {
      if (message !== initMessage && !initialized) {
        throw new Error(
          'Before any operation you must initialize the SDK using the `init` method and wait for it to resolve'
        );
      }

      return getConnection().then(_connection => {
        _connection.send({ message, data });
      });
    }
  };
}
