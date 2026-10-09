import * as React from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { cn } from '#/lib/utils'
import { Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react'

export interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultFlow?: 'signIn' | 'signUp'
}

export function AuthModal({
  open,
  onOpenChange,
  defaultFlow = 'signIn',
}: AuthModalProps) {
  const { signIn } = useAuthActions()
  const [flow, setFlow] = React.useState<'signIn' | 'signUp'>(defaultFlow)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [name, setName] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  // Reset state when modal opens or closes
  React.useEffect(() => {
    if (open) {
      setFlow(defaultFlow)
      setError(null)
    } else {
      setEmail('')
      setPassword('')
      setName('')
      setError(null)
      setLoading(false)
    }
  }, [open, defaultFlow])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError('Please enter your email address.')
      return
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      const payload: Record<string, string> = {
        email: trimmedEmail,
        password,
        flow,
      }
      if (flow === 'signUp' && name.trim()) {
        payload.name = name.trim()
      }

      await signIn('password', payload)
      onOpenChange(false)
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Authentication failed. Please check your credentials.'

      // Friendly translations of standard errors
      if (message.includes('InvalidAccountId') || message.includes('not found') || message.includes('Invalid credentials')) {
        setError('Invalid email or password.')
      } else if (message.includes('already exists') || message.includes('Account already exists')) {
        setError('An account with this email already exists. Try signing in.')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] p-6 sm:p-7 border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#12100f] shadow-2xl rounded-2xl">
        <DialogHeader className="space-y-1.5 pb-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-6 w-6 rounded-[6px] bg-[#f59e0b] dark:bg-[#d97706] flex items-center justify-center text-white text-xs font-mono font-bold shadow-xs">
              🐝
            </div>
            <span className="text-xs font-mono font-medium tracking-wider text-[#79716b] dark:text-[#a6a09b] uppercase">
              Beelog Access
            </span>
          </div>
          <DialogTitle className="text-xl font-semibold tracking-tight text-[#1c1917] dark:text-[#f5f5f4]">
            {flow === 'signIn' ? 'Welcome back' : 'Create an account'}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#78716c] dark:text-[#a8a29e]">
            {flow === 'signIn'
              ? 'Enter your email and password to access your publications.'
              : 'Sign up to start publishing and syncing articles.'}
          </DialogDescription>
        </DialogHeader>

        {/* Mode switch tabs */}
        <div className="flex rounded-lg bg-[#f5f5f4] dark:bg-[#1c1917] p-1 text-xs mb-5 border border-[#e7e5e4] dark:border-[#292524]">
          <button
            type="button"
            onClick={() => {
              setFlow('signIn')
              setError(null)
            }}
            className={cn(
              'flex-1 py-1.5 font-medium rounded-md transition-all text-center',
              flow === 'signIn'
                ? 'bg-white dark:bg-[#292524] text-[#1c1917] dark:text-[#f5f5f4] shadow-xs'
                : 'text-[#78716c] dark:text-[#a8a29e] hover:text-[#1c1917] dark:hover:text-[#f5f5f4]',
            )}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setFlow('signUp')
              setError(null)
            }}
            className={cn(
              'flex-1 py-1.5 font-medium rounded-md transition-all text-center',
              flow === 'signUp'
                ? 'bg-white dark:bg-[#292524] text-[#1c1917] dark:text-[#f5f5f4] shadow-xs'
                : 'text-[#78716c] dark:text-[#a8a29e] hover:text-[#1c1917] dark:hover:text-[#f5f5f4]',
            )}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 p-3 text-xs text-red-700 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {flow === 'signUp' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-medium text-[#78716c] dark:text-[#a8a29e] uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3 w-3" />
                Name (optional)
              </label>
              <Input
                type="text"
                placeholder="Ada Lovelace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="h-10 text-xs bg-[#fafaf9] dark:bg-[#171514] border-[#e7e5e4] dark:border-[#292524] rounded-lg"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-medium text-[#78716c] dark:text-[#a8a29e] uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="h-3 w-3" />
              Email address
            </label>
            <Input
              type="email"
              placeholder="you@domain.com"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="h-10 text-xs bg-[#fafaf9] dark:bg-[#171514] border-[#e7e5e4] dark:border-[#292524] rounded-lg"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-medium text-[#78716c] dark:text-[#a8a29e] uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="h-3 w-3" />
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="h-10 text-xs bg-[#fafaf9] dark:bg-[#171514] border-[#e7e5e4] dark:border-[#292524] rounded-lg"
            />
            {flow === 'signUp' && (
              <p className="text-[10px] text-[#a8a29e] dark:text-[#78716c] pt-0.5">
                At least 6 characters.
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 mt-2 bg-[#615fff] hover:bg-[#4f39f6] text-white text-xs font-medium rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {flow === 'signIn' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : flow === 'signIn' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {/* Divider & Google OAuth future option */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e7e5e4] dark:border-[#292524]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider text-[#a8a29e]">
            <span className="bg-white dark:bg-[#12100f] px-2">or</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={true}
          title="Google authentication will be enabled soon"
          className="w-full h-9 text-xs opacity-60 cursor-not-allowed border-[#e7e5e4] dark:border-[#292524] flex items-center justify-center gap-2 rounded-lg"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google (Coming Soon)
        </Button>
      </DialogContent>
    </Dialog>
  )
}
