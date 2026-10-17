import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';

function Button({
  children,
  onClick,
  variant = 'dark',
  type = 'button',
  className = '',
  disabled = false
}) {
  return (
    <BootstrapButton
      type={type}
      variant={variant}
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </BootstrapButton>
  );
}

export default Button;