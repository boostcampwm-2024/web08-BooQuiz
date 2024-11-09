[**web08-booquiz v1.0.0**](../../../../../README.md) • **Docs**

***

[web08-booquiz v1.0.0](../../../../../modules.md) / [backend/src/quiz-zone/quiz-zone.service](../README.md) / QuizZoneService

# Class: QuizZoneService

## Constructors

### new QuizZoneService()

> **new QuizZoneService**(`quizZoneRepository`): [`QuizZoneService`](QuizZoneService.md)

#### Parameters

• **quizZoneRepository**: [`QuizZoneRepositoryMemory`](../../quiz-zone.repository.memory/classes/QuizZoneRepositoryMemory.md)

#### Returns

[`QuizZoneService`](QuizZoneService.md)

#### Defined in

[apps/backend/src/quiz-zone/quiz-zone.service.ts:16](https://github.com/boostcampwm-2024/web08-BooQuiz/blob/070f8cd9fc8f2112d3401f93894ddd08f59e2916/apps/backend/src/quiz-zone/quiz-zone.service.ts#L16)

## Methods

### create()

> **create**(`sessionId`): `Promise`\<`void`\>

#### Parameters

• **sessionId**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[apps/backend/src/quiz-zone/quiz-zone.service.ts:18](https://github.com/boostcampwm-2024/web08-BooQuiz/blob/070f8cd9fc8f2112d3401f93894ddd08f59e2916/apps/backend/src/quiz-zone/quiz-zone.service.ts#L18)

***

### findAll()

> **findAll**(): `string`

#### Returns

`string`

#### Defined in

[apps/backend/src/quiz-zone/quiz-zone.service.ts:32](https://github.com/boostcampwm-2024/web08-BooQuiz/blob/070f8cd9fc8f2112d3401f93894ddd08f59e2916/apps/backend/src/quiz-zone/quiz-zone.service.ts#L32)

***

### findOne()

> **findOne**(`id`): `string`

#### Parameters

• **id**: `number`

#### Returns

`string`

#### Defined in

[apps/backend/src/quiz-zone/quiz-zone.service.ts:36](https://github.com/boostcampwm-2024/web08-BooQuiz/blob/070f8cd9fc8f2112d3401f93894ddd08f59e2916/apps/backend/src/quiz-zone/quiz-zone.service.ts#L36)

***

### remove()

> **remove**(`id`): `string`

#### Parameters

• **id**: `number`

#### Returns

`string`

#### Defined in

[apps/backend/src/quiz-zone/quiz-zone.service.ts:44](https://github.com/boostcampwm-2024/web08-BooQuiz/blob/070f8cd9fc8f2112d3401f93894ddd08f59e2916/apps/backend/src/quiz-zone/quiz-zone.service.ts#L44)

***

### update()

> **update**(`id`, `updateQuizZoneDto`): `string`

#### Parameters

• **id**: `number`

• **updateQuizZoneDto**: [`UpdateQuizZoneDto`](../../dto/update-quiz-zone.dto/classes/UpdateQuizZoneDto.md)

#### Returns

`string`

#### Defined in

[apps/backend/src/quiz-zone/quiz-zone.service.ts:40](https://github.com/boostcampwm-2024/web08-BooQuiz/blob/070f8cd9fc8f2112d3401f93894ddd08f59e2916/apps/backend/src/quiz-zone/quiz-zone.service.ts#L40)
