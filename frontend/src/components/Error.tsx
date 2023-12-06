import React, { PropsWithChildren } from 'react';

interface IProps {
  code: string;
}

function Error({ code, children }: PropsWithChildren<IProps>) {
  return (
    <div>
      <h1>
        {code}
        {' '}
        Error
      </h1>
      {children}
    </div>
  );
}

export default Error;
