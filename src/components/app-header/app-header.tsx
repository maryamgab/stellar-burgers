import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/UserInfoSlice';

export const AppHeader: FC = () => {
  const currentUser = useSelector(selectUser);

  return (
    <>
      <AppHeaderUI userName={currentUser?.name} />
    </>
  );
};
