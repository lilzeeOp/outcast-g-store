import { useEffect } from 'react';

export default function useDocumentTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} | Outcast G Store` : 'Outcast G Store — Your #1 Digital Game Store';
    return () => {
      document.title = prev;
    };
  }, [title]);
}
