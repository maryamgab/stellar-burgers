import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { TModalProps } from './type';
import { ModalUI } from '@ui';

const modalContainer = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  // Обработка нажатия клавиши Escape для закрытия модального окна
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      event.key === 'Escape' && onClose();
    };

    document.addEventListener('keydown', handleEscapeKey);
    // Очистка обработчика при размонтировании
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]); // Зависимость от функции закрытия

  // Отображение модального окна через React Portal
  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={onClose} data-cy='modal'>
      {children}
    </ModalUI>,
    modalContainer as HTMLDivElement
  );
});
