import React from 'react';
import { mount, shallow,configure } from 'enzyme';
import LoginForm from '../components/LoginForm';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});
it('calls onSubmit prop function when login form is submitted', () => {
  const onSubmitFn = jest.fn();
  const handleChange = jest.fn();
  const values = {email: "hello@gmail.com", password: "123456"};
  const wrapper = mount(<LoginForm sumbit={onSubmitFn} handleChange={handleChange} values={values}/>);
  // const form = wrapper.find('form');
  const button = wrapper.find('input').at(3);
  expect(button).toHaveLength(1);
  expect(button.prop('type')).toEqual('submit');
  button.simulate('click', { preventDefault () {} });
  expect(onSubmitFn).toHaveBeenCalledTimes(1);
});