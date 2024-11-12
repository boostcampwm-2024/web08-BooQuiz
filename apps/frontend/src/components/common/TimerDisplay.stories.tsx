import { Meta, StoryObj } from '@storybook/react';
import TimerDisplay from './TimerDisplay';

const meta: Meta<typeof TimerDisplay> = {
    title: 'Components/TimerDisplay',
    component: TimerDisplay,
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof TimerDisplay>;

export const Default: Story = {
    args: {
        time: 10,
        isFulfill: false,
        onTimeEnd: () => {
            alert('time end');
        },
    },
};
