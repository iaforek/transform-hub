[@scramjet/api-server](../README.md) / [lib/definitions](../modules/lib_definitions.md) / CeroError

# Class: CeroError

[lib/definitions](../modules/lib_definitions.md).CeroError

## Hierarchy

* *Error*

  ↳ **CeroError**

## Implements

* *APIError*

## Table of contents

### Constructors

- [constructor](lib_definitions.ceroerror.md#constructor)

### Properties

- [cause](lib_definitions.ceroerror.md#cause)
- [code](lib_definitions.ceroerror.md#code)
- [httpMessage](lib_definitions.ceroerror.md#httpmessage)
- [message](lib_definitions.ceroerror.md#message)
- [name](lib_definitions.ceroerror.md#name)
- [type](lib_definitions.ceroerror.md#type)
- [prepareStackTrace](lib_definitions.ceroerror.md#preparestacktrace)
- [stackTraceLimit](lib_definitions.ceroerror.md#stacktracelimit)

### Accessors

- [stack](lib_definitions.ceroerror.md#stack)

### Methods

- [captureStackTrace](lib_definitions.ceroerror.md#capturestacktrace)

## Constructors

### constructor

\+ **new CeroError**(`errCode`: *ERR_NOT_FOUND* \| *ERR_NOT_CURRENTLY_AVAILABLE* \| *ERR_FAILED_FETCH_DATA* \| *ERR_FAILED_TO_SERIALIZE* \| *ERR_INTERNAL_ERROR* \| *ERR_INVALID_CONTENT_TYPE* \| *ERR_CANNOT_PARSE_CONTENT* \| *ERR_UNSUPPORTED_ENCODING*, `cause?`: Error, `extraMessage?`: *string*): [*CeroError*](lib_definitions.ceroerror.md)

#### Parameters:

Name | Type |
------ | ------ |
`errCode` | *ERR_NOT_FOUND* \| *ERR_NOT_CURRENTLY_AVAILABLE* \| *ERR_FAILED_FETCH_DATA* \| *ERR_FAILED_TO_SERIALIZE* \| *ERR_INTERNAL_ERROR* \| *ERR_INVALID_CONTENT_TYPE* \| *ERR_CANNOT_PARSE_CONTENT* \| *ERR_UNSUPPORTED_ENCODING* |
`cause?` | Error |
`extraMessage?` | *string* |

**Returns:** [*CeroError*](lib_definitions.ceroerror.md)

Defined in: [packages/api-server/src/lib/definitions.ts:42](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/61a9cb1/packages/api-server/src/lib/definitions.ts#L42)

## Properties

### cause

• `Optional` **cause**: *undefined* \| Error

Defined in: [packages/api-server/src/lib/definitions.ts:40](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/61a9cb1/packages/api-server/src/lib/definitions.ts#L40)

___

### code

• **code**: *number*

Defined in: [packages/api-server/src/lib/definitions.ts:38](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/61a9cb1/packages/api-server/src/lib/definitions.ts#L38)

___

### httpMessage

• **httpMessage**: *string*

Defined in: [packages/api-server/src/lib/definitions.ts:39](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/61a9cb1/packages/api-server/src/lib/definitions.ts#L39)

___

### message

• **message**: *string*

Defined in: node_modules/typedoc/node_modules/typescript/lib/lib.es5.d.ts:974

___

### name

• **name**: *string*

Defined in: node_modules/typedoc/node_modules/typescript/lib/lib.es5.d.ts:973

___

### type

• **type**: *ERR_NOT_FOUND* \| *ERR_NOT_CURRENTLY_AVAILABLE* \| *ERR_FAILED_FETCH_DATA* \| *ERR_FAILED_TO_SERIALIZE* \| *ERR_INTERNAL_ERROR* \| *ERR_INVALID_CONTENT_TYPE* \| *ERR_CANNOT_PARSE_CONTENT* \| *ERR_UNSUPPORTED_ENCODING*

Defined in: [packages/api-server/src/lib/definitions.ts:41](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/61a9cb1/packages/api-server/src/lib/definitions.ts#L41)

___

### prepareStackTrace

▪ `Optional` `Static` **prepareStackTrace**: *undefined* \| (`err`: Error, `stackTraces`: CallSite[]) => *any*

Optional override for formatting stack traces

**`see`** https://v8.dev/docs/stack-trace-api#customizing-stack-traces

Defined in: packages/api-server/node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: *number*

Defined in: packages/api-server/node_modules/@types/node/globals.d.ts:13

## Accessors

### stack

• **stack**(): *string*

**Returns:** *string*

Defined in: [packages/api-server/src/lib/definitions.ts:60](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/61a9cb1/packages/api-server/src/lib/definitions.ts#L60)

## Methods

### captureStackTrace

▸ `Static`**captureStackTrace**(`targetObject`: *object*, `constructorOpt?`: Function): *void*

Create .stack property on a target object

#### Parameters:

Name | Type |
------ | ------ |
`targetObject` | *object* |
`constructorOpt?` | Function |

**Returns:** *void*

Defined in: packages/api-server/node_modules/@types/node/globals.d.ts:4