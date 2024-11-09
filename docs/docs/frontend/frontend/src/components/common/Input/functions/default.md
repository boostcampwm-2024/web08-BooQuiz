[**web08-booquiz v1.0.0**](../../../../../../README.md) • **Docs**

***

[web08-booquiz v1.0.0](../../../../../../modules.md) / [frontend/src/components/common/Input](../README.md) / default

# Function: default()

> **default**(`props`): `Element`

## Parameters

• **props**: `InputProps`

Input 컴포넌트의 props

## Returns

`Element`

렌더링된 Input 컴포넌트

## Description

Input 컴포넌트는 다양한 타입의 입력 필드를 렌더링합니다.

## Component

## Example

```tsx
<Input
  type="text"
  label="Username"
  value={username}
  onChange={handleUsernameChange}
  name="username"
  placeholder="Enter your username"
  error={usernameError}
  isUnderline={true}
/>
```

## Defined in

[apps/frontend/src/components/common/Input.tsx:48](https://github.com/boostcampwm-2024/web08-BooQuiz/blob/f96af645f7679e55fbd626cf58ee24bdf8b61d17/apps/frontend/src/components/common/Input.tsx#L48)
