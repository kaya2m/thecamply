declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: any) => void
          prompt: (callback?: (notification: any) => void) => void
          renderButton: (element: HTMLElement, config: any) => void
          cancel: () => void
        }
      }
    }
    FB?: {
      init: (config: {
        appId: string
        cookie?: boolean
        xfbml?: boolean
        version: string
      }) => void
      login: (
        callback: (response: any) => void,
        options?: { scope?: string; return_scopes?: boolean }
      ) => void
      logout: (callback?: (response: any) => void) => void
      getLoginStatus: (callback: (response: any) => void) => void
      api: (path: string, method: string, params: any, callback: (response: any) => void) => void
    }
    fbAsyncInit?: () => void
  }
}

export {}