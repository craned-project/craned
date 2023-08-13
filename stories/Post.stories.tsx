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
  render: () => <Post>Test</Post>,
};
