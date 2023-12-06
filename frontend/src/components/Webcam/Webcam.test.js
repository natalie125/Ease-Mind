/**
 * @jest-environment jsdom
 */

import React from 'react';
import renderer from 'react-test-renderer';
import Webcam from '.';

it('changes the class when hovered', () => {
  const component = renderer.create(<Webcam />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
