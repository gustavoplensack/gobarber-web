import React, { useEffect } from 'react';
import { FiXCircle, FiAlertCircle } from 'react-icons/fi';

import { Container } from './styles';

import { ToastMessage, useToast } from '../../../hooks/toast';

interface ToastProps {
  message: ToastMessage;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    // functions returned by an useEffect will run once the component
    // is deleted.
    return () => {
      clearTimeout(timer);
    };
  }, [message.id, removeToast]);

  return (
    <Container
      type={message.type || 'info'}
      hasDescription={!!message.description}
    >
      <FiAlertCircle size={20} />

      <div>
        <strong>{message.title}</strong>
        <p>{message.description}</p>
      </div>

      <button onClick={() => removeToast(message.id)} type="button">
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
