import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import {
  ArrowUpRight,
  AtSign,
  Camera,
  Check,
  ChevronDown,
  Compass,
  GitBranch,
  Lightbulb,
  MessagesSquare,
  Play,
  X,
} from 'lucide-react'
import useMeasure from 'react-use-measure'

// Links organised into seven categories, picked with a dropdown
// disclosure in the pasted style (plain-CSS adaptation).
//
// NOTE: this is the v9 smooth animation (useMeasure + outer motion.div
// width/height spring, AnimatePresence popLayout) with ONE fix: every
// layoutId / layout="position" prop was removed. Those shared-layout
// spans were the blank-pill bug — when a category was picked, the
// trigger mounted with a layoutId whose source lived in the exiting
// option row, and the shared-element projection could start from a
// stale/zero box, rendering the icon + name invisible. Without
// layoutId there is no projection anywhere in this file, so the
// trigger can never go blank, and the spring animation is untouched.
const categories = [
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'All my Instagram accounts',
    icon: Camera,
    links: [
      {
        icon: Camera,
        label: 'Instagram',
        handle: '@xforge.git',
        href: 'https://www.instagram.com/xforge.git',
      },
      {
        icon: Camera,
        label: 'Instagram',
        handle: '@northform_hq',
        href: 'https://www.instagram.com/northform_hq',
      },
    ],
  },
  {
    id: 'website',
    name: 'Website',
    description: 'My sites on the web',
    icon: Compass,
    links: [
      {
        icon: Compass,
        label: 'Website',
        handle: 'xforgegit.vercel.app',
        href: 'https://xforgegit.vercel.app',
      },
      {
        icon: Compass,
        label: 'Website',
        handle: 'northhform.vercel.app',
        href: 'https://northhform.vercel.app',
      },
      {
        icon: Compass,
        label: 'Website',
        handle: 'learnmateit.vercel.app',
        href: 'https://learnmateit.vercel.app',
      },
    ],
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'My code on GitHub',
    icon: GitBranch,
    links: [
      {
        icon: GitBranch,
        label: 'GitHub',
        handle: 'richterbrothers01',
        href: 'https://github.com/richterbrothers01',
      },
    ],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'My YouTube channels',
    icon: Play,
    links: [
      {
        icon: Play,
        label: 'YouTube',
        handle: '@xforge',
        href: 'https://www.youtube.com/channel/UC2TcK9ziMZLuxGy4PWM7MIQ',
      },
      {
        icon: Play,
        label: 'YouTube',
        handle: 'NorthForm',
        href: 'https://www.youtube.com/channel/UCDjKwSw7avXo4Ow2cU6KsqA',
      },
    ],
  },
  {
    id: 'reddit',
    name: 'Reddit',
    description: 'My Reddit posts',
    icon: MessagesSquare,
    links: [
      {
        icon: MessagesSquare,
        label: 'Reddit',
        handle: 'u/xforgegit',
        href: 'https://www.reddit.com/user/xforgegit/',
      },
    ],
  },
  {
    id: 'x',
    name: 'X',
    description: 'My posts on X',
    icon: AtSign,
    links: [
      {
        icon: AtSign,
        label: 'X',
        handle: '@xforgegit',
        href: 'https://x.com/xforgegit',
      },
    ],
  },
  {
    id: 'indiehackers',
    name: 'Indie Hackers',
    description: 'My Indie Hackers posts',
    icon: Lightbulb,
    links: [
      {
        icon: Lightbulb,
        label: 'Indie Hackers',
        handle: 'xforgegit',
        href: 'https://www.indiehackers.com/xforgegit',
      },
    ],
  },
]

export default function LinkSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('instagram')
  const [ref, bounds] = useMeasure()
  const containerRef = useRef(null)

  const selected =
    categories.find((c) => c.id === selectedId) || categories[0]
  const SelectedIcon = selected.icon

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (!isOpen) return undefined
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="links-selector-wrap">
      <MotionConfig
        transition={{ type: 'spring', stiffness: 200, damping: 25, mass: 1 }}
      >
        <motion.div
          ref={containerRef}
          animate={{
            width: bounds.width > 0 ? bounds.width : 'auto',
            height: bounds.height > 0 ? bounds.height : 'auto',
          }}
          className="link-selector"
        >
          <div ref={ref} className="link-selector-inner">
            <AnimatePresence mode="popLayout" initial={false}>
              {!isOpen ? (
                <motion.button
                  key="trigger"
                  type="button"
                  onClick={() => setIsOpen(true)}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  className="link-selector-trigger"
                >
                  <span className="link-selector-icon">
                    <SelectedIcon size={22} strokeWidth={1.75} />
                  </span>
                  <span className="link-selector-name">
                    {selected.name}
                  </span>
                  <span className="link-selector-chevron">
                    <ChevronDown size={24} />
                  </span>
                </motion.button>
              ) : (
                <motion.div
                  key="expanded"
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  className="link-selector-expanded"
                >
                  <div className="link-selector-head">
                    <span className="link-selector-title">
                      Choose a category
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      aria-label="Close menu"
                      title="Close menu"
                      className="link-selector-close"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="link-selector-options">
                    {categories.map((category) => {
                      const active = category.id === selected.id
                      const Icon = category.icon
                      return (
                        <motion.button
                          key={category.id}
                          type="button"
                          onClick={() => {
                            setSelectedId(category.id)
                            setIsOpen(false)
                          }}
                          whileTap={{ scale: 0.97 }}
                          className="link-selector-option"
                        >
                          <span className="link-selector-option-left">
                            <span className="link-selector-icon">
                              <Icon size={22} strokeWidth={1.75} />
                            </span>
                            <span className="link-selector-option-text">
                              <span className="link-selector-option-name">
                                {category.name}
                              </span>
                              <span className="link-selector-option-desc">
                                {category.description}
                              </span>
                            </span>
                          </span>
                          <span
                            className={
                              active
                                ? 'link-selector-check link-selector-check-active'
                                : 'link-selector-check'
                            }
                          >
                            {active && <Check size={16} strokeWidth={3.5} />}
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </MotionConfig>

      <div className="links-list">
        {selected.links.map((link) => (
          <a
            key={link.handle}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="link-row"
          >
            <span className="link-left">
              <link.icon size={20} strokeWidth={1.75} className="link-icon" />
              <span className="link-label">{link.label}</span>
              <span className="link-handle">{link.handle}</span>
            </span>
            <ArrowUpRight size={18} className="link-arrow" />
          </a>
        ))}
      </div>
    </div>
  )
}
