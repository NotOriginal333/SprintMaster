import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

// Типи ролей (мають співпадати з тими, що в базі/бекенді)
export type UserRole = 'ADMIN' | 'PM' | 'DEV' | 'QA';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user || !user.role) return null;

  // Якщо роль користувача є у списку дозволених
  if (allowedRoles.includes(user.role as UserRole)) {
    return <>{children}</>;
  }

  // Інакше ховаємо компонент
  return null;
};