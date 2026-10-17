import React from 'react';
import { Badge as BootstrapBadge } from 'react-bootstrap';

function Badge({ children, bg = 'secondary' }) {
  return (
    <BootstrapBadge bg={bg} className="me-2">
      {children}
    </BootstrapBadge>
  );
}

export default Badge;