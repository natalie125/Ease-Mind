import React, { PropsWithChildren } from "react";

interface IProps {
  code: string;
}

const Error = ({code, children}: PropsWithChildren<IProps>) => (
  <div>
    <h1>{code} Error</h1>
    {children}
  </div>
);

export default Error;
