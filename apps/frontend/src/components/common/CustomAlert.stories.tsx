import type { Meta, StoryObj } from '@storybook/react';
import CustomAlert from './CustomAlert';
import type { CustomAlertProps } from './CustomAlert';

import {
    Info,
    AlertTriangle,
    AlertCircle,
    CheckCircle2,
    LogOut,
    Trash2,
    Download,
} from 'lucide-react';

/**
 * CustomAlert 컴포넌트는 사용자 정의 알림 대화 상자를 생성합니다.
 * 이 컴포넌트는 트리거 버튼을 클릭하면 나타나는 알림 대화 상자를 포함합니다.
 */
const meta = {
    title: 'Components/CustomAlert',
    component: CustomAlert,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        trigger: {
            control: {
                type: 'object',
            },
            defaultValue: {
                text: 'Trigger',
                variant: 'default',
                size: 'default',
                disabled: false,
                icon: null,
            },
        },
        alert: {
            control: {
                type: 'object',
            },
            defaultValue: {
                title: 'Title',
                description: 'Description',
                type: 'info',
                cancelText: 'Cancel',
                confirmText: 'Confirm',
            },
        },
        onConfirm: {
            action: 'confirm',
        },
        onCancel: {},
    },
} satisfies Meta<CustomAlertProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 알럿
export const Default: Story = {
    args: {
        trigger: {
            text: '알럿 열기',
            variant: 'default',
        },
        alert: {
            title: '기본 알럿',
            description: '기본적인 알럿 메시지입니다.',
            type: 'info',
        },
        onConfirm: () => console.log('확인 clicked'),
    },
};

// 정보 알럿
export const InfoType: Story = {
    args: {
        trigger: {
            text: '공지사항',
            variant: 'outline',
            icon: <Info className="h-4 w-4" />,
        },
        alert: {
            type: 'info',
            title: '업데이트 안내',
            description: '새로운 기능이 추가되었습니다. 지금 확인해보세요!',
            confirmText: '확인하기',
        },
        onConfirm: () => console.log('info confirmed'),
    },
};

// 성공 알럿
export const Success: Story = {
    args: {
        trigger: {
            text: '다운로드',
            variant: 'default',
            icon: <Download className="h-4 w-4" />,
        },
        alert: {
            type: 'success',
            title: '다운로드 완료',
            description: '파일이 성공적으로 다운로드되었습니다.',
            confirmText: '확인',
        },
        onConfirm: () => console.log('success confirmed'),
    },
};

// 경고 알럿
export const Warning: Story = {
    args: {
        trigger: {
            text: '나가기',
            variant: 'outline',
            icon: <LogOut className="h-4 w-4" />,
        },
        alert: {
            type: 'warning',
            title: '변경사항이 있습니다',
            description: '저장하지 않고 나가시겠습니까?',
            confirmText: '나가기',
            cancelText: '취소',
        },
        onConfirm: () => console.log('warning confirmed'),
        onCancel: () => console.log('warning cancelled'),
    },
};

// 에러 알럿
export const Error: Story = {
    args: {
        trigger: {
            text: '삭제',
            variant: 'destructive',
            icon: <Trash2 className="h-4 w-4" />,
        },
        alert: {
            type: 'error',
            title: '삭제 확인',
            description: '이 작업은 되돌릴 수 없습니다. 정말 삭제하시겠습니까?',
            confirmText: '삭제',
            cancelText: '취소',
        },
        onConfirm: () => console.log('error confirmed'),
        onCancel: () => console.log('error cancelled'),
    },
};

// 비활성화된 트리거
export const DisabledTrigger: Story = {
    args: {
        trigger: {
            text: '실행 불가',
            variant: 'default',
            disabled: true,
            icon: <AlertCircle className="h-4 w-4" />,
        },
        alert: {
            type: 'info',
            title: '실행할 수 없음',
            description: '현재 이 작업을 실행할 수 없습니다.',
        },
        onConfirm: () => console.log('disabled confirmed'),
    },
};

// 긴 내용의 알럿
export const LongContent: Story = {
    args: {
        trigger: {
            text: '상세 정보',
            variant: 'outline',
            icon: <Info className="h-4 w-4" />,
        },
        alert: {
            type: 'info',
            title: '이용약관 변경 안내',
            description: `이용약관이 변경되었습니다. 주요 변경사항은 다음과 같습니다:
  
        1. 개인정보 보호정책 강화
        2. 서비스 이용규칙 개선
        3. 결제 정책 변경
        
        자세한 내용은 공지사항을 참고해주세요.`,
            confirmText: '확인했습니다',
        },
        onConfirm: () => console.log('long content confirmed'),
    },
};
