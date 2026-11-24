import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'

// One glass toast at a time, bottom-centre, auto-dismissing after 4.5s.
// Mounted at App level so both pages share it. Usage in any page:
//   const { showToast } = useToast()
//   showToast('success', 'Message sent — I\'ll get back to you.')
//   showToast('error', 'Couldn't send — check your connection and try again.')

const ToastContext = createContext({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

const TOAST_DURATION_MS = 4500

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const dismiss = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setToast(null)
  }, [])

  const showToast = useCallback(
    (type, message) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      setToast({ id: Date.now(), type, message })
      timerRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS)
    },
    [],
  )

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 16, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 8, x: '-50%' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <span
              className={`toast-dot toast-dot-${toast.type}`}
              aria-hidden="true"
            />
            <span className="toast-message">{toast.message}</span>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="toast-close"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  )
}
