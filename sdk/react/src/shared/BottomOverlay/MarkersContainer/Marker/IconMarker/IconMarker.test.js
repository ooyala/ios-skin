// @flow

import { shallow } from 'enzyme';
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';

import IconMarker from './IconMarker';

describe('IconMarker', () => {
  it('renders matching snapshot', () => {
    const wrapper = shallow(
      <IconMarker
        iconUrl="http://example.com/icon.png"
        imageUrl="http://example.com/image.png"
        onSeek={() => undefined}
        onTouch={() => undefined}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('does not render anything when URLs are empty', () => {
    const wrapper = shallow(
      <IconMarker
        iconUrl={undefined}
        imageUrl={undefined}
        onSeek={() => undefined}
        onTouch={() => undefined}
      />,
    );

    expect(wrapper).toEqual({});
  });

  it('triggers `onSeek` callback every time when pressed if `imageUrl` is empty', () => {
    const onSeekMock = jest.fn();
    const wrapper = shallow(
      <IconMarker
        iconUrl="http://example.com/icon.png"
        imageUrl={undefined}
        onSeek={onSeekMock}
        onTouch={() => undefined}
      />,
    );

    wrapper.find(TouchableWithoutFeedback).simulate('press');

    expect(onSeekMock).toBeCalled();
  });

  it('triggers `onSeek` callback when pressed being expanded', () => {
    const onSeekMock = jest.fn();
    const wrapper = shallow(
      <IconMarker
        iconUrl="http://example.com/icon.png"
        imageUrl="http://example.com/image.png"
        onSeek={onSeekMock}
        onTouch={() => undefined}
      />,
    );

    wrapper.find(TouchableWithoutFeedback).simulate('press');

    expect(onSeekMock).not.toBeCalled();

    wrapper.find(TouchableWithoutFeedback).simulate('press');

    expect(onSeekMock).toBeCalled();
  });

  it('triggers `onTouch` callback every time when pressed', () => {
    const onTouchMock = jest.fn();
    const wrapper = shallow(
      <IconMarker
        iconUrl="http://example.com/icon.png"
        imageUrl={undefined}
        onSeek={() => undefined}
        onTouch={onTouchMock}
      />,
    );

    wrapper.find(TouchableWithoutFeedback).simulate('press');

    expect(onTouchMock).toBeCalled();
  });
});
