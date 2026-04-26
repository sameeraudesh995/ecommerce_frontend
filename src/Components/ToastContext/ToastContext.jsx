import React, { createContext, useContext, useState } from 'react'

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = (type, title, message) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => removeToast(id), 3500)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

const ToastContainer = ({ toasts, removeToast }) => (
  <div style={{
    position: 'fixed', top: '20px', right: '20px',
    display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 9999,
    pointerEvents: 'none'
  }}>
    {toasts.map((t) => (
      <div key={t.id} style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '14px 18px', borderRadius: '12px',
        border: '0.5px solid #e0e0e0', background: '#fff',
        minWidth: '260px', maxWidth: '340px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        animation: 'slideIn 0.35s cubic-bezier(.22,.68,0,1.2)',
        pointerEvents: 'all'
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: '15px', fontWeight: 600,
          background: t.type === 'success' ? '#e6f9f0' : t.type === 'error' ? '#fdecea' : '#fff8e1',
          color: t.type === 'success' ? '#1a7f4e' : t.type === 'error' ? '#c0392b' : '#f39c12'
        }}>
          {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : '!'}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 500, color: '#111' }}>{t.title}</p>
          <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{t.message}</p>
        </div>
        <button onClick={() => removeToast(t.id)} style={{
          background: 'none', border: 'none', color: '#aaa',
          cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: 0
        }}>✕</button>
      </div>
    ))}
    <style>{`
      @keyframes slideIn {
        from { transform: translateX(120%); opacity: 0; }
        to   { transform: translateX(0);    opacity: 1; }
      }
    `}</style>
  </div>
)