import { useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';

export default function SideDrawer({ title, children }) {
  const { activeDrawer, closeDrawer } = useDashboard();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeDrawer();
    };
    if (activeDrawer) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [activeDrawer, closeDrawer]);

  if (!activeDrawer) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={closeDrawer} />
      <div className="drawer">
        <div className="drawer-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={closeDrawer}>✕</button>
        </div>
        <div className="drawer-body">
          {children}
        </div>
      </div>
    </>
  );
}
