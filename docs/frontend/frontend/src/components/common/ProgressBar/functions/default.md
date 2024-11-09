[**web08-booquiz v1.0.0**](../../../../../../README.md) • **Docs**

***

[web08-booquiz v1.0.0](../../../../../../modules.md) / [frontend/src/components/common/ProgressBar](../README.md) / default

# Function: default()

> **default**(`__namedParameters`): `Element`

## Parameters

• **\_\_namedParameters**: [`ProgressBarProps`](../interfaces/ProgressBarProps.md)

## Returns

`Element`

렌더링된 진행 막대 컴포넌트입니다.

## Description

ProgressBar 컴포넌트는 시간이 지남에 따라 감소하는 진행 막대를 표시합니다.
최대 시간과 시간이 끝났을 때 호출될 콜백 함수를 받습니다.

## Example

```ts
<ProgressBar maxTime={10} onTimeEnd={() => console.log('Time ended!')} />
```

## Defined in

[apps/frontend/src/components/common/ProgressBar.tsx:23](https://github.com/boostcampwm-2024/web08-BooQuiz/blob/7e828c98e22bdcb5cd4d46c7c476fd54ffa246ae/apps/frontend/src/components/common/ProgressBar.tsx#L23)
