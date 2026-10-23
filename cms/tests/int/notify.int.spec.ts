import { describe, expect, it } from 'vitest'
import { shouldNotify } from '@/lib/notifySite'

/**
 * When the website is told to drop its caches.
 *
 * Getting this wrong is cheap to do and annoying to notice: too eager and
 * every autosave flushes the site, too shy and a publish never reaches it.
 */
describe('shouldNotify', () => {
  const draft = { _status: 'draft' }
  const live = { _status: 'published' }

  it('ne prévient pas sur un simple enregistrement de brouillon', () => {
    expect(shouldNotify(draft, draft)).toBe(false)
  })

  it('prévient à la publication', () => {
    expect(shouldNotify(live, draft)).toBe(true)
  })

  it('prévient aussi à la dépublication', () => {
    // Taking a page down has to reach the site as much as putting one up.
    expect(shouldNotify(draft, live)).toBe(true)
  })

  it('prévient quand on republie par-dessus du publié', () => {
    expect(shouldNotify(live, live)).toBe(true)
  })

  it('ne casse pas sur des documents absents ou mal formés', () => {
    expect(shouldNotify(undefined, undefined)).toBe(false)
    expect(shouldNotify(null, {})).toBe(false)
    expect(shouldNotify('published', null)).toBe(false)
  })
})
