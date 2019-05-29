import { connectToParent } from '@livechat/postmessage/es5';
import { getQueryParam } from './helpers';

export function createConnection({ handleMessage }) {
  const pluginId = getQueryParam('plugin_id');
  const usePlainConnection = getQueryParam('connection') === 'plain';

  const formatMessage = message => ({ ...message, plugin_id: pluginId });

  const createTrustedConnection = () =>
    connectToParent({ handle: handleMessage }).promise.then(child => ({
      send(message) {
        return child.call('handle', formatMessage(message)).then(() => {});
      }
    }));

  const createPlainConnection = () => {
    const origins = {
      'http://my.lc:3000': true,
      'https://my.labs.livechatinc.com': true,
      'https://my.staging.livechatinc.com': true,
      'https://my.livechatinc.com': true
    };

    const isOwnEvent = event => origins[event.origin] === true;

    window.addEventListener('message', event => {
      if (isOwnEvent(event)) {
        handleMessage(event.data);
      }
    });

    return {
      send(message) {
        parent.postMessage(formatMessage(message), '*');
        return Promise.resolve();
      }
    };
  };

  return usePlainConnection
    ? Promise.resolve(createPlainConnection())
    : createTrustedConnection();
}
