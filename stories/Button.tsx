import React from 'react';

type ButtonProps = {
  children: React.ReactNode
}

const Button = ({ children, ...rest }: ButtonProps) => {
  return (
    <button className="button" {...rest}>
      {children}
    </button>
  )
}

export default Button;
