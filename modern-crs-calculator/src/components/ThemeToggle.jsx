import { useState, useEffect } from 'preact/hooks'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)

    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <div className="theme-switch">
      <input
        id="theme-toggle"
        type="checkbox"
        className="theme-toggle-input sr-only"
        checked={isDark}
        onChange={toggleTheme}
      />
      <label htmlFor="theme-toggle" className="theme-toggle-label">
        <span className="theme-toggle-circle">
          <span className={`theme-icon sun-icon ${isDark ? 'opacity-0' : 'opacity-100'}`}>☀️</span>
          <span className={`theme-icon moon-icon ${isDark ? 'opacity-100' : 'opacity-0'}`}>🌙</span>
        </span>
      </label>
    </div>
  )
}