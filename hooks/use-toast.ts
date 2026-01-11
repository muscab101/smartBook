"use client"

import * as React from "react"

// --- TYPES (Waxa aan ku qeexnay halkan si looga kaaftoomo components maqan) ---
type ToastActionElement = React.ReactElement

interface ToastProps {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: "default" | "destructive"
}

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

// --- REDUCER ---
export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t: any) =>
          t.id === action.toastId || action.toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      }
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: action.toastId === undefined 
          ? [] 
          : state.toasts.filter((t: any) => t.id !== action.toastId),
      }
    default:
      return state
  }
}

const listeners: Array<(state: any) => void> = []
let memoryState: any = { toasts: [] }

function dispatch(action: any) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

// --- MAIN FUNCTIONS ---
export function toast({ ...props }: any) {
  const id = genId()
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })
  
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: any) => {
        if (!open) dismiss()
      },
    },
  })

  return { id, dismiss }
}

export function useToast() {
  const [state, setState] = React.useState(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}