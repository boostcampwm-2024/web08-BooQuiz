import type { Meta, StoryObj } from '@storybook/react';
import { useState } from '@storybook/preview-api';
import Input from './Input';

const meta: Meta<typeof Input> = {
    title: 'Components/Input',
    component: Input,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'password', 'email', 'number'],
            description: '입력 필드의 타입',
        },
        label: {
            control: 'text',
            description: '입력 필드의 라벨',
        },
        value: {
            control: 'text',
            description: '입력 필드의 값',
        },
        name: {
            control: 'text',
            description: '입력 필드의 이름',
        },
        placeholder: {
            control: 'text',
            description: '입력 필드의 플레이스홀더',
        },
        disabled: {
            control: 'boolean',
            description: '입력 필드의 비활성화 여부',
        },
        error: {
            control: 'text',
            description: '입력 필드의 에러 메시지',
        },
        isUnderline: {
            control: 'boolean',
            description: '밑줄 표시 여부',
        },
    },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
    render: () => {
        const [value, setValue] = useState('');
        return (
            <div className="w-[300px]">
                <Input
                    name="default"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="기본 입력 필드입니다"
                />
            </div>
        );
    },
};

// 라벨이 있는 입력 필드
export const WithLabel: Story = {
    render: () => {
        const [value, setValue] = useState('');
        return (
            <div className="w-[300px]">
                <Input
                    label="이름"
                    name="name"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="이름을 입력하세요"
                />
            </div>
        );
    },
};

// 에러 메시지가 있는 입력 필드
export const WithError: Story = {
    render: () => {
        const [value, setValue] = useState('');
        return (
            <div className="w-[300px]">
                <Input
                    label="이메일"
                    name="email"
                    type="email"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="이메일을 입력하세요"
                    error="올바른 이메일 형식이 아닙니다"
                />
            </div>
        );
    },
};

// 밑줄이 있는 입력 필드
export const WithUnderline: Story = {
    render: () => {
        const [value, setValue] = useState('');
        return (
            <div className="w-[300px]">
                <Input
                    label="제목"
                    name="title"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="제목을 입력하세요"
                    isUnderline
                />
            </div>
        );
    },
};

// 비활성화된 입력 필드
export const Disabled: Story = {
    render: () => {
        return (
            <div className="w-[300px]">
                <Input
                    label="비활성화"
                    name="disabled"
                    value="수정할 수 없는 필드입니다"
                    onChange={() => {}}
                    disabled
                />
            </div>
        );
    },
};

// 다양한 타입의 입력 필드
export const DifferentTypes: Story = {
    render: () => {
        const [values, setValues] = useState({
            text: '',
            password: '',
            email: '',
            number: '',
        });

        const handleChange =
            (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
                setValues((prev) => ({ ...prev, [field]: e.target.value }));
            };

        return (
            <div className="w-[300px] space-y-4">
                <Input
                    type="text"
                    label="텍스트"
                    name="text"
                    value={values.text}
                    onChange={handleChange('text')}
                    placeholder="텍스트를 입력하세요"
                />
                <Input
                    type="password"
                    label="비밀번호"
                    name="password"
                    value={values.password}
                    onChange={handleChange('password')}
                    placeholder="비밀번호를 입력하세요"
                />
                <Input
                    type="email"
                    label="이메일"
                    name="email"
                    value={values.email}
                    onChange={handleChange('email')}
                    placeholder="이메일을 입력하세요"
                />
                <Input
                    type="number"
                    label="숫자"
                    name="number"
                    value={values.number}
                    onChange={handleChange('number')}
                    placeholder="숫자를 입력하세요"
                />
            </div>
        );
    },
};
