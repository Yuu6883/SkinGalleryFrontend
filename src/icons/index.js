import React from 'react';
import icons from './iconsConfig';

export const Icon = ({ name, ...rest }) => {
  const Use = icons[name];
  return <Use {...rest} />;
};

export default Icon;
