[**web08-booquiz v1.0.0**](../../../../../README.md) • **Docs**

***

[web08-booquiz v1.0.0](../../../../../modules.md) / [backend/src/quiz-zone/quiz-zone.controller](../README.md) / QuizZoneController

# Class: QuizZoneController

## Constructors

### new QuizZoneController()

> **new QuizZoneController**(`quizZoneService`): [`QuizZoneController`](QuizZoneController.md)

#### Parameters

• **quizZoneService**: [`QuizZoneService`](../../quiz-zone.service/classes/QuizZoneService.md)

#### Returns

[`QuizZoneController`](QuizZoneController.md)

#### Defined in

[apps/backend/src/quiz-zone/quiz-zone.controller.ts:18](https://github.com/boostcampwm-2024/web08-BooQuiz/blob/7e828c98e22bdcb5cd4d46c7c476fd54ffa246ae/apps/backend/src/quiz-zone/quiz-zone.controller.ts#L18)

## Methods

### create()

> **create**(`session`): `Promise`\<`void`\>

#### Parameters

• **session**: `Record`\<`string`, `any`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[apps/backend/src/quiz-zone/quiz-zone.controller.ts:22](https://github.com/boostcampwm-2024/web08-BooQuiz/blob/7e828c98e22bdcb5cd4d46c7c476fd54ffa246ae/apps/backend/src/quiz-zone/quiz-zone.controller.ts#L22)

***

### findAll()

> **findAll**(): `string`

#### Returns

`string`

#### Defined in

[apps/backend/src/quiz-zone/quiz-zone.controller.ts:33](https://github.com/boostcampwm-2024/web08-BooQuiz/blob/7e828c98e22bdcb5cd4d46c7c476fd54ffa246ae/apps/backend/src/quiz-zone/quiz-zone.controller.ts#L33)

***

### findOne()

> **findOne**(`id`): `string`

#### Parameters

• **id**: `string`

#### Returns

`string`

#### Defined in

[apps/backend/src/quiz-zone/quiz-zone.controller.ts:38](https://github.com/boostcampwm-2024/web08-BooQuiz/blob/7e828c98e22bdcb5cd4d46c7c476fd54ffa246ae/apps/backend/src/quiz-zone/quiz-zone.controller.ts#L38)

***

### remove()

> **remove**(`id`): `string`

#### Parameters

• **id**: `string`

#### Returns

`string`

#### Defined in

[apps/backend/src/quiz-zone/quiz-zone.controller.ts:48](https://github.com/boostcampwm-2024/web08-BooQuiz/blob/7e828c98e22bdcb5cd4d46c7c476fd54ffa246ae/apps/backend/src/quiz-zone/quiz-zone.controller.ts#L48)

***

### update()

> **update**(`id`, `updateQuizZoneDto`): `string`

#### Parameters

• **id**: `string`

• **updateQuizZoneDto**: [`UpdateQuizZoneDto`](../../dto/update-quiz-zone.dto/classes/UpdateQuizZoneDto.md)

#### Returns

`string`

#### Defined in

[apps/backend/src/quiz-zone/quiz-zone.controller.ts:43](https://github.com/boostcampwm-2024/web08-BooQuiz/blob/7e828c98e22bdcb5cd4d46c7c476fd54ffa246ae/apps/backend/src/quiz-zone/quiz-zone.controller.ts#L43)
