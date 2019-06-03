**Note: if you're developing a new widget, you should use the [Agent App SDK](http://github.com/livechat/agent-app-sdk) instead. This package isn't actively maintained anymore.**

# LiveChat AgentApp Widget SDK

This SDK allows you to create widget applications that can interact with the AgentApp.

## Instalation

The package can be installed directly from NPM.

```
npm install --save @livechat/agent-app-widget-sdk
```

## Usage

Before performing any actions you have to initialize the SDK by calling the asynchronous `init` method. Make sure the returned promise resolves.

```javascript
import LiveChat from '@livechat/agent-app-widget-sdk';

await LiveChat.init();
```

Now you can send commands or subscribe to events coming from the AgentApp.

## Commands

The SDK exposes methods that you can call in order to interact with the AgentApp. All methods return a promise which resolves after the command has been successfully sent.

### `putMessage(text)`

This method will add the given text to the currently opened chat textarea.

```javascript
await Livechat.putMessage('This text will be added to current chat textarea');
```

### `watchMessages()`

Subscribe to all incoming and outgoing chat messages. You can listen to the messages using the `message` event.

```javascript
Livechat.on('message', message => {
  // handle the message here
});

await Livechat.watchMessages();
```

### `modifyCustomerDetailsSection(section)`

This method allows you to modify any custom section that you declared in the initial state of widget in the Developers Console. The `section` argument should be an object conforming to the section defintion schema, for example:

```javascript
const section = {
  title: 'My section',
  components: [
    // ...
    {
      type: 'button',
      data: {
        label: 'My section button',
        id: 'section-button'
      }
    }
    // ...
  ]
};

await Livechat.modifyCustomerDetailsSection(section);
```

The given section `title` must match the one specified in the initial state, otherwise the section won't change. Also, AgentApp ignores commands that do not contain a valid section definition, so make sure that
definition you're sending is correct.

## Listening for events

The SDK allows you to listen for certain events happening in the AgentApp. You can subscribe to them using the standard event emitter interface.

```javascript
LiveChat.on(event, eventHandler);
```

The SDK emits the following events:

### `customer_profile`

Emitted on initialization and on every chat window change, the event contains the currently selected customer's details.

```javascript
Livechat.on('customer_profile', data => {
  console.log(data);
});
```

Example output

```json
{
  "id": "S126126161.O136OJPO1",
  "name": "Mary Brown",
  "email": "mary.brown@email.com",
  "chat": {
    "id": "NY0U96PIT4"
  }
}
```

### `message`

Emitted on every chat message (both outgoing and incoming). You have to subscribe to the events using the `watchMessages` method first.

```javascript
Livechat.on('message', data => {
  console.log(data);
});
```

Example output

```json
{
  "chat": "PL0B4IDJIO",
  "message": "Message content",
  "message_id": "edu65huxyk",
  "message_source": "visitor"
}
```

### `customer_details_section_button_click`

Emitted when a button within custom defined section is clicked in Customer Details. It contains a `buttonId` property, which reflects the `id` specified for the button in the section definition.

```javascript
Livechat.on('customer_details_section_button_click', ({ buttonId }) => {
  console.log(buttonId);
});
```
