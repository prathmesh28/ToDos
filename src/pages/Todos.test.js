import React from 'react';
import { shallow } from 'enzyme';
import Todos from './Todos';

describe(`Todos`, () => {
  test(`Todos`, () => {
    const wrapper = shallow(<Todos />);
    expect(wrapper).toMatchSnapshot();
  });
});