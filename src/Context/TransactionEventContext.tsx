import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type TransactionChangeType = 'created' | 'updated' | 'deleted';

type TransactionChangeEvent = {
  version: number;
  type: TransactionChangeType;
  accountId: string;
  transactionId?: string;
  changedAt: number;
};

type TransactionEventContextValue = {
  transactionChange: TransactionChangeEvent | null;
  notifyTransactionChanged: (payload: {
    type: TransactionChangeType;
    accountId: string;
    transactionId?: string;
  }) => void;
};

const TransactionEventContext = createContext<TransactionEventContextValue | null>(null);

export function TransactionEventProvider({ children }: { children: React.ReactNode }) {
  const [transactionChange, setTransactionChange] = useState<TransactionChangeEvent | null>(null);

  const notifyTransactionChanged = useCallback(
    (payload: { type: TransactionChangeType; accountId: string; transactionId?: string }) => {
      setTransactionChange((prev) => ({
        version: (prev?.version ?? 0) + 1,
        type: payload.type,
        accountId: payload.accountId,
        transactionId: payload.transactionId,
        changedAt: Date.now(),
      }));
    },
    []
  );

  const value = useMemo(
    () => ({
      transactionChange,
      notifyTransactionChanged,
    }),
    [transactionChange, notifyTransactionChanged]
  );

  return (
    <TransactionEventContext.Provider value={value}>{children}</TransactionEventContext.Provider>
  );
}

export function useTransactionEvent() {
  const context = useContext(TransactionEventContext);

  if (!context) {
    throw new Error('useTransactionEvent must be used inside TransactionEventProvider');
  }

  return context;
}
