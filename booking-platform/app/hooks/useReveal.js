import { useRef, useEffect } from 'react'

export function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.classList.add('visible')
    }
  }, [])

  return ref
}
