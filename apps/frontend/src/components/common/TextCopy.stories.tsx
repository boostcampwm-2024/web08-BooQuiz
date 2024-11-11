import { Meta, StoryObj } from '@storybook/react';
import TextCopy from './TextCopy';
import type { TextCopyProps } from './TextCopy';

const meta: Meta<typeof TextCopy> = {
    title: 'Components/TextCopy',
    component: TextCopy,
    tags: ['autodocs'],
    args: {
        text: '이것은 복사할 텍스트입니다.',
    },
} satisfies Meta<TextCopyProps>;

export default meta;

type Story = StoryObj<typeof TextCopy>;

export const Default: Story = {
    args: {
        text: '이것은 복사할 텍스트입니다.',
    },
};
