[@scramjet/model](../README.md) / HostError

# Class: HostError

## Hierarchy

* [*AppError*](apperror.md)

  ↳ **HostError**

## Implements

* [*IHostErrorData*](../README.md#ihosterrordata)

## Table of contents

### Constructors

- [constructor](hosterror.md#constructor)

### Properties

- [code](hosterror.md#code)
- [data](hosterror.md#data)
- [message](hosterror.md#message)
- [name](hosterror.md#name)
- [prepareStackTrace](hosterror.md#preparestacktrace)
- [stack](hosterror.md#stack)
- [stackTraceLimit](hosterror.md#stacktracelimit)

### Methods

- [captureStackTrace](hosterror.md#capturestacktrace)

## Constructors

### constructor

\+ **new HostError**(`code`: HostErrorCode, `data?`: *any*): [*HostError*](hosterror.md)

#### Parameters:

Name | Type |
------ | ------ |
`code` | HostErrorCode |
`data?` | *any* |

**Returns:** [*HostError*](hosterror.md)

Inherited from: [AppError](apperror.md)

Defined in: [packages/model/src/errors/host-error.ts:6](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/61a9cb1/packages/model/src/errors/host-error.ts#L6)

## Properties

### code

• **code**: AppErrorCode

Inherited from: [AppError](apperror.md).[code](apperror.md#code)

Defined in: [packages/model/src/errors/app-error.ts:8](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/61a9cb1/packages/model/src/errors/app-error.ts#L8)

___

### data

• `Optional` **data**: *any*

Inherited from: [AppError](apperror.md).[data](apperror.md#data)

Defined in: [packages/model/src/errors/app-error.ts:9](https://github.com/scramjet-cloud-platform/scramjet-csi-dev/blob/61a9cb1/packages/model/src/errors/app-error.ts#L9)

___

### message

• **message**: *string*

Inherited from: [AppError](apperror.md).[message](apperror.md#message)

Defined in: node_modules/typedoc/node_modules/typescript/lib/lib.es5.d.ts:974

___

### name

• **name**: *string*

Inherited from: [AppError](apperror.md).[name](apperror.md#name)

Defined in: node_modules/typedoc/node_modules/typescript/lib/lib.es5.d.ts:973

___

### prepareStackTrace

• `Optional` **prepareStackTrace**: *undefined* \| (`err`: Error, `stackTraces`: CallSite[]) => *any*

Optional override for formatting stack traces

**`see`** https://v8.dev/docs/stack-trace-api#customizing-stack-traces

Defined in: packages/model/node_modules/@types/node/globals.d.ts:11

___

### stack

• `Optional` **stack**: *undefined* \| *string*

Inherited from: [AppError](apperror.md).[stack](apperror.md#stack)

Defined in: node_modules/typedoc/node_modules/typescript/lib/lib.es5.d.ts:975

___

### stackTraceLimit

• **stackTraceLimit**: *number*

Defined in: packages/model/node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ **captureStackTrace**(`targetObject`: *object*, `constructorOpt?`: Function): *void*

Create .stack property on a target object

#### Parameters:

Name | Type |
------ | ------ |
`targetObject` | *object* |
`constructorOpt?` | Function |

**Returns:** *void*

Defined in: packages/model/node_modules/@types/node/globals.d.ts:4