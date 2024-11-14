import type { Meta, StoryObj } from '@storybook/react';
import CommonButton from './CommonButton';
import type { CommonButtonProps } from './CommonButton';

const meta = {
    title: 'Components/Common/CommonButton',
    component: CommonButton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        text: {
            control: 'text',
            description: '버튼에 표시될 텍스트',
        },
        isFulfill: {
            control: 'boolean',
            description: '버튼의 스타일을 결정하는 플래그',
        },
        clickEvent: {
            action: 'clicked',
            description: '버튼 클릭 시 실행될 이벤트 핸들러',
        },
        width: {
            control: 'text',
            description: '버튼의 너비',
        },
        height: {
            control: 'text',
            description: '버튼의 높이',
        },
    },
} satisfies Meta<CommonButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 버튼
export const Default: Story = {
    args: {
        text: '기본 버튼',
        isFulfill: false,
        clickEvent: () => {
            alert('버튼이 클릭되었습니다!');
        },
    },
};

// 활성화된 버튼
export const Fulfilled: Story = {
    args: {
        text: '활성화 버튼',
        isFulfill: true,
        clickEvent: () => {
            alert('버튼이 클릭되었습니다!');
        },
    },
};

// 커스텀 크기 버튼
export const CustomSize: Story = {
    args: {
        text: '커스텀 크기 버튼',
        isFulfill: true,
        width: '300px',
        height: '40px',
        clickEvent: () => {
            alert('버튼이 클릭되었습니다!');
        },
    },
};

// 버튼 클릭 이벤트
export const ClickEvent: Story = {
    args: {
        text: '클릭해보세요',
        isFulfill: true,
        clickEvent: () => {
            alert('버튼이 클릭되었습니다!');
        },
    },
};
