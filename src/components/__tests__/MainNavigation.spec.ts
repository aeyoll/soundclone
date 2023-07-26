import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import MainNavigation from '../AppNavigation.vue';

describe('MainNavigation', () => {
  it('renders properly', () => {
    const wrapper = mount(MainNavigation);
    expect(wrapper.text()).toContain('Home');
  });
});
