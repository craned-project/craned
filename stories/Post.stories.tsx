// Button.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react';

import Post from './Post';

const meta: Meta<typeof Post> = {
  component: Post,
};

export default meta;
type Story = StoryObj<typeof Post>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    name: 'hansnnn',
    username: 'shitsanupong',
    date: '12/12/2551',
    desc: "test",
    image: "https://i.kym-cdn.com/photos/images/newsfeed/002/409/671/179.png",
    pfp: "https://ih1.redbubble.net/image.3578697790.8184/st,small,507x507-pad,600x600,f8f8f8.u2.jpg"
  },
  component: Post,
};
