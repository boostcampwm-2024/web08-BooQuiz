import type { Meta, StoryObj } from '@storybook/react';
import Typography from './Typogrpahy';

/**
 * Typography 컴포넌트는 일관된 텍스트 스타일링을 위한 기본 컴포넌트입니다.
 * 다양한 크기와 색상 옵션을 제공합니다.
 */
const meta: Meta<typeof Typography> = {
    title: 'Components/Typography',
    component: Typography,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        text: {
            description: '표시할 텍스트 내용',
            control: { type: 'text' },
        },
        size: {
            description: '텍스트의 크기',
            control: {
                type: 'select',
            },
            options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'],
        },
        color: {
            description: '텍스트의 색상',
            control: {
                type: 'select',
            },
            options: ['gray', 'red', 'black'],
        },
    },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof Typography>;

/**
 * 기본 Typography 스타일입니다.
 */
export const Default: Story = {
    args: {
        text: 'Hello World',
        size: 'base',
        color: 'black',
    },
};

/**
 * 가장 작은 크기의 텍스트입니다.
 */
export const ExtraSmall: Story = {
    args: {
        text: 'Extra Small Text',
        size: 'xs',
        color: 'black',
    },
};

/**
 * 작은 크기의 텍스트입니다.
 */
export const Small: Story = {
    args: {
        text: 'Small Text',
        size: 'sm',
        color: 'black',
    },
};

/**
 * 큰 크기의 텍스트입니다.
 */
export const Large: Story = {
    args: {
        text: 'Large Text',
        size: 'lg',
        color: 'black',
    },
};

/**
 * 회색 텍스트 스타일입니다.
 */
export const GrayText: Story = {
    args: {
        text: 'Gray Colored Text',
        size: 'base',
        color: 'gray',
    },
};

/**
 * 빨간색 텍스트 스타일입니다.
 */
export const RedText: Story = {
    args: {
        text: 'Red Colored Text',
        size: 'base',
        color: 'red',
    },
};

/**
 * 모든 크기를 한번에 보여주는 예시입니다.
 */
export const AllSizes: Story = {
    render: () => (
        <div className="space-y-4">
            {(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'] as const).map(
                (size) => (
                    <Typography key={size} text={`${size} size text`} size={size} color="black" />
                ),
            )}
        </div>
    ),
};

/**
 * 모든 색상을 한번에 보여주는 예시입니다.
 */
export const AllColors: Story = {
    render: () => (
        <div className="space-y-4">
            {(['black', 'gray', 'red'] as const).map((color) => (
                <Typography key={color} text={`${color} colored text`} size="xl" color={color} />
            ))}
        </div>
    ),
};
