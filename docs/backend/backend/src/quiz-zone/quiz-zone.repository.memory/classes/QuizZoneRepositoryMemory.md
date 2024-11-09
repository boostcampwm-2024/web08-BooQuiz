[**web08-booquiz v1.0.0**](../../../../../README.md) • **Docs**

***

[web08-booquiz v1.0.0](../../../../../modules.md) / [backend/src/quiz-zone/quiz-zone.repository.memory](../README.md) / QuizZoneRepositoryMemory

# Class: QuizZoneRepositoryMemory

## Implements

- [`QuizZoneRepositoryInterface`](../../quiz-zone.repository.interface/interfaces/QuizZoneRepositoryInterface.md)

## Constructors

### new QuizZoneRepositoryMemory()

> **new QuizZoneRepositoryMemory**(`data`): [`QuizZoneRepositoryMemory`](QuizZoneRepositoryMemory.md)

#### Parameters

• **data**: `Record`\<`string`, [`QuizZone`](../../entities/quiz-zone.entity/interfaces/QuizZone.md)\>

#### Returns

[`QuizZoneRepositoryMemory`](QuizZoneRepositoryMemory.md)

#### Defined in

[apps/backend/src/quiz-zone/quiz-zone.repository.memory.ts:7](https://github.com/boostcampwm-2024/web08-BooQuiz/blob/7e828c98e22bdcb5cd4d46c7c476fd54ffa246ae/apps/backend/src/quiz-zone/quiz-zone.repository.memory.ts#L7)

## Methods

### set()

> **set**(`key`, `value`): `Promise`\<`void`\>

#### Parameters

• **key**: `string`

• **value**: [`QuizZone`](../../entities/quiz-zone.entity/interfaces/QuizZone.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`QuizZoneRepositoryInterface`](../../quiz-zone.repository.interface/interfaces/QuizZoneRepositoryInterface.md).[`set`](../../quiz-zone.repository.interface/interfaces/QuizZoneRepositoryInterface.md#set)

#### Defined in

[apps/backend/src/quiz-zone/quiz-zone.repository.memory.ts:12](https://github.com/boostcampwm-2024/web08-BooQuiz/blob/7e828c98e22bdcb5cd4d46c7c476fd54ffa246ae/apps/backend/src/quiz-zone/quiz-zone.repository.memory.ts#L12)
