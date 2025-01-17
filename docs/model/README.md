@scramjet/model

# @scramjet/model

## Table of contents

### Classes

- [AppError](classes/apperror.md)
- [CSIControllerError](classes/csicontrollererror.md)
- [CommunicationHandler](classes/communicationhandler.md)
- [DelayedStream](classes/delayedstream.md)
- [HostError](classes/hosterror.md)
- [IDProvider](classes/idprovider.md)
- [RunnerError](classes/runnererror.md)
- [SupervisorError](classes/supervisorerror.md)

### Type aliases

- [ConfiguredMessageHandler](README.md#configuredmessagehandler)
- [ICSIControllerErrorData](README.md#icsicontrollererrordata)
- [IHostErrorData](README.md#ihosterrordata)
- [IRunnerErrorData](README.md#irunnererrordata)
- [ISupervisorErrorData](README.md#isupervisorerrordata)

### Variables

- [MessageUtilities](README.md#messageutilities)

### Functions

- [checkMessage](README.md#checkmessage)
- [deserializeMessage](README.md#deserializemessage)
- [getMessage](README.md#getmessage)
- [serializeMessage](README.md#serializemessage)

## Type aliases

### ConfiguredMessageHandler

Ƭ **ConfiguredMessageHandler**<`T`\>: { `blocking`: `boolean` ; `handler`: `MutatingMonitoringMessageHandler`<`T` extends `MonitoringMessageCode` ? `T` : `never`\>  } \| { `blocking`: `boolean` ; `handler`: `ControlMessageHandler`<`T` extends `ControlMessageCode` ? `T` : `never`\>  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `RunnerMessageCode` \| `SupervisorMessageCode` \| `CPMMessageCode` |

#### Defined in

[packages/model/src/stream-handler.ts:23](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/HEAD/packages/model/src/stream-handler.ts#L23)

___

### ICSIControllerErrorData

Ƭ **ICSIControllerErrorData**: `any`

#### Defined in

[packages/model/src/errors/csi-controller-error.ts:4](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/HEAD/packages/model/src/errors/csi-controller-error.ts#L4)

___

### IHostErrorData

Ƭ **IHostErrorData**: `any`

#### Defined in

[packages/model/src/errors/host-error.ts:4](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/HEAD/packages/model/src/errors/host-error.ts#L4)

___

### IRunnerErrorData

Ƭ **IRunnerErrorData**: `any`

#### Defined in

[packages/model/src/errors/runner-error.ts:4](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/HEAD/packages/model/src/errors/runner-error.ts#L4)

___

### ISupervisorErrorData

Ƭ **ISupervisorErrorData**: `any`

#### Defined in

[packages/model/src/errors/supervisor-error.ts:4](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/HEAD/packages/model/src/errors/supervisor-error.ts#L4)

## Variables

### MessageUtilities

• `Const` **MessageUtilities**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deserializeMessage` | (`msg`: `string`) => `MessageType`<`RunnerMessageCode`\> |
| `serializeMessage` | <T\>(`__namedParameters`: `MessageType`<`T`\>) => `RunnerMessage` \| `SupervisorMessage` \| `CPMMessage` |

#### Defined in

[packages/model/src/index.ts:11](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/HEAD/packages/model/src/index.ts#L11)

## Functions

### checkMessage

▸ `Const` **checkMessage**<`X`\>(`msgCode`, `msgData`): `MessageDataType`<`X`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `X` | extends `RunnerMessageCode` \| `CONFIG` \| `CPMMessageCode` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `msgCode` | `X` |
| `msgData` | `MonitoringMessageData` \| `DescribeSequenceMessageData` \| `ErrorMessageData` \| `SnapshotResponseMessageData` \| `StatusMessageData` \| `KeepAliveMessageData` \| `AcknowledgeMessageData` \| `HandshakeAcknowledgeMessageData` \| `StopSequenceMessageData` \| `MonitoringRateMessageData` \| `EmptyMessageData` \| `STHIDMessageData` \| `LoadCheckStat` \| `NetworkInfo`[] |

#### Returns

`MessageDataType`<`X`\>

#### Defined in

[packages/model/src/get-message.ts:55](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/HEAD/packages/model/src/get-message.ts#L55)

___

### deserializeMessage

▸ **deserializeMessage**(`msg`): `MessageType`<`RunnerMessageCode`\>

Get an object of message type from serialized message.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `msg` | `string` | a stringified and serialized message |

#### Returns

`MessageType`<`RunnerMessageCode`\>

- an object of message type

#### Defined in

[packages/model/src/messages-utils.ts:29](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/HEAD/packages/model/src/messages-utils.ts#L29)

___

### getMessage

▸ `Const` **getMessage**<`X`\>(`msgCode`, `msgData`): `MessageType`<`X`\>

Get an object of message type from serialized message.
A helper method used for deserializing messages.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `X` | extends `RunnerMessageCode` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `msgCode` | `X` | message type code |
| `msgData` | `MessageDataType`<`X`\> | a message object |

#### Returns

`MessageType`<`X`\>

- an object of message type

#### Defined in

[packages/model/src/get-message.ts:102](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/HEAD/packages/model/src/get-message.ts#L102)

___

### serializeMessage

▸ **serializeMessage**<`T`\>(`__namedParameters`): `RunnerMessage` \| `SupervisorMessage` \| `CPMMessage`

Serizalized message.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `RunnerMessageCode` \| `CONFIG` \| `CPMMessageCode` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `MessageType`<`T`\> |

#### Returns

`RunnerMessage` \| `SupervisorMessage` \| `CPMMessage`

- a serializable message in a format [msgCode, {msgBody}]
          where 'msgCode' is a message type code and 'msgBody' is a message body

#### Defined in

[packages/model/src/messages-utils.ts:14](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/HEAD/packages/model/src/messages-utils.ts#L14)
