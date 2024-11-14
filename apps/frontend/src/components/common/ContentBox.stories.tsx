import { Meta, StoryObj } from '@storybook/react';
import ContentBox from './ContentBox';

const meta: Meta<typeof ContentBox> = {
    title: 'Components/ContentBox',
    component: ContentBox,
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ContentBox>;

export const Default: Story = {
    args: {
        children: <p>이것은 ContentBox 안에 있는 기본 내용입니다.</p>,
    },
};

export const WithMultipleChildren: Story = {
    args: {
        children: (
            <>
                <h2>ContentBox 제목</h2>
                <p>여러 자식 요소를 포함한 ContentBox 예시입니다.</p>
                <button>버튼</button>
            </>
        ),
    },
};

export const WithLongContent: Story = {
    args: {
        children: (
            <p>
                이것은 긴 내용을 가진 ContentBox 예시입니다. ContentBox는 내용의 길이에 따라
                자동으로 크기가 조절됩니다. 이를 통해 다양한 길이의 콘텐츠를 유연하게 표시할 수
                있습니다.
            </p>
        ),
    },
};
