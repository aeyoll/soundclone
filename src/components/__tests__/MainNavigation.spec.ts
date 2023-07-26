import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import MainNavigation from '../AppNavigation.vue';

describe('MainNavigation', () => {
  it('renders properly', () => {
    const wrapper = mount(MainNavigation);
    expect(wrapper.text()).toContain('Home');
  });
});
