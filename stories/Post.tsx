import React from 'react';

type ButtonProps = {
  children: React.ReactNode
}

const Button = ({ children, name, date, description, image, pfp ...rest }: ButtonProps) => {
  return (
    <button className="button" {...rest}>
      {children}
    </button>
  )
}

export default Button;
