[**web08-booquiz v1.0.0**](../../../../../../README.md) • **Docs**

***

[web08-booquiz v1.0.0](../../../../../../modules.md) / [frontend/src/components/common/TimerDisplay](../README.md) / default

# Function: default()

> **default**(`props`): `Element`

## Parameters

• **props**: `TimerDisplayProps`

TimerDisplay 컴포넌트의 속성.

## Returns

`Element`

TimerDisplay 컴포넌트.

## Description

이 컴포넌트는 주어진 시간에서 시작하여 매 초마다 감소하는 카운트다운 타이머를 표시합니다.
타이머가 0에 도달하면 `onTimeEnd` 콜백 함수를 호출합니다.
타이머의 배경색과 호버 효과는 `isFulfill` 속성에 따라 사용자 정의할 수 있습니다.

## Example

```tsx
<TimerDisplay time={10} isFulfill={true} onTimeEnd={() => console.log('시간 종료!')} />
```

## Defined in

[apps/frontend/src/components/common/TimerDisplay.tsx:32](https://github.com/boostcampwm-2024/web08-BooQuiz/blob/7e828c98e22bdcb5cd4d46c7c476fd54ffa246ae/apps/frontend/src/components/common/TimerDisplay.tsx#L32)
