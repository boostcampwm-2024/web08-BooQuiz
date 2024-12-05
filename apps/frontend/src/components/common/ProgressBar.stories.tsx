import { Meta, StoryObj } from '@storybook/react';
import ProgressBar from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
    title: 'Components/ProgressBar',
    component: ProgressBar,
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
    args: {
        playTime: 30000,
        time: Date.now(),
        onTimeEnd: () => {
            alert('time end');
        },
    },
};
