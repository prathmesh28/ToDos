import React from 'react';
import { shallow } from 'enzyme';
import HomePage from './HomePage';

describe(`HomePage`, () => {
  test(`HomePage`, () => {
    const wrapper = shallow(<HomePage />);
    expect(wrapper).toMatchSnapshot();
  });
});