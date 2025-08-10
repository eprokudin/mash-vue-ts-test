import { pickOne, sample, shuffle, randomInt } from '@/utils/random'

export type Mode = 'classic' | 'modern'

export type TabloidKeys = {
  home: string
  partner: string
  job: string
  vehicle: string
  hobby?: string
  perk: string
  twist?: string
  kids?: string
}

/** Return category key mapping based on the selected game mode */
export function modeKeys(mode: Mode): TabloidKeys {
  const isModern = mode === 'modern'
  return {
    home: isModern ? 'Housing' : 'Where You Live',
    partner: isModern ? 'Partner' : 'Life Partner',
    job: 'Job',
    vehicle: isModern ? 'Vehicle' : 'Car',
    hobby: isModern ? 'Hobby' : undefined,
    perk: isModern ? 'Life Perk' : 'Salary',
    twist: isModern ? 'Twist Ending' : undefined,
    kids: !isModern ? 'Kids' : undefined,
  }
}

/** Generate a random newspaper name */
export function generatePaperName(): string {
  return Math.random() > 0.5 ? 'THE DAILY DESTINY' : 'LIFE TIMES'
}

/** Generate a pseudo-random issue number */
export function generateIssueNo(): number {
  return randomInt(1000, 9999)
}

/** Generate a UK-friendly date label */
export function todayString(): string {
  return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

/** Build flash, main and sub headlines from the core picks */
export function generateHeadlines(home: string, partner: string, job: string, vehicle: string) {
  const flash = 'TODAY\'S SHOCK LIFE REVEAL — EXCLUSIVE!'
  const mainHeadline = `LOCAL LEGEND MOVES INTO ${(home || 'A NEW HOME').toUpperCase()} WITH ${(partner || 'A MYSTERIOUS PARTNER').toUpperCase()}`
  const jobPart = job ? `Former ${job.toUpperCase()}` : 'Former HERO'
  const vehPart = vehicle ? `Now Drives a ${vehicle.toUpperCase()}` : 'Now Drives SOMETHING WILD'
  const subHead = `${jobPart} — ${vehPart} — Claims It Was "All Part of the Plan"!!!`
  return { flash, mainHeadline, subHead }
}

/** Compose a dramatic yet tongue-in-cheek body paragraph from the picks */
export function generateBody(params: {
  job?: string
  home?: string
  partner?: string
  vehicle?: string
  hobby?: string
  kids?: string
  perk?: string
  twist?: string
}): string {
  const { job, home, partner, vehicle, hobby, kids, perk, twist } = params
  const bits: string[] = []
  bits.push(
    `In a twist that has stunned friends, family, and several confused onlookers, our hero has embraced a new life as a ${job || 'mystery professional'}, settling into ${home || 'an undisclosed location'} with their long‑time companion ${partner || 'someone intriguing'}.`
  )
  if (vehicle) bits.push(`Seen recently cruising the streets on a ${vehicle}, they insist their future is "better than Love Island and cheaper than therapy."`)
  if (hobby) bits.push(`Insiders whisper they're now obsessed with ${hobby.toLowerCase()}, and frankly, we love that for them.`)
  if (kids) bits.push(`Sources claim the kid situation is officially: ${kids}. Make of that what you will.`)
  if (perk) bits.push(`Close friends say the real perk is: ${perk.toLowerCase()}. Jealous? Absolutely.`)
  if (twist) bits.push(`Final shocker: ${twist}!!!`)
  return bits.join(' ')
}

export type Quote = { quote: string; source: string }
/** Split a formatted line into quote and source */
export function parseQuote(line: string): Quote {
  const parts = line.split(' — ')
  return { quote: parts[0].replace(/^"|"$/g, ''), source: parts[1] || 'Source' }
}

/** Pick 5 quotes from a larger pool */
export function generateQuotes(): Quote[] {
  const pool: Quote[] = [
    parseQuote('"Honestly, I\'m not surprised — this was always on the cards." — Close Friend'),
    parseQuote('"You should\'ve seen the look on their face when it happened." — Eye-Witness'),
    parseQuote('"If anyone could pull this off, it\'s them… or maybe Craig." — Neighbour'),
    parseQuote('"I warned them, but did they listen? No." — Ex-Colleague'),
    parseQuote('"It\'s the talk of the group chat." — Anonymous Source'),
    parseQuote('"We all thought it was a mid-life crisis, but apparently not." — Cousin'),
    parseQuote('"I still don\'t understand the outfit." — Local Bystander'),
    parseQuote('"If that\'s their destiny, I want mine checked again." — Pub Regular'),
    parseQuote('"You don\'t just wake up and decide to live like that… do you?" — Family Member'),
    parseQuote('"They\'ve changed… but in a good way? I think?" — Childhood Friend'),
    parseQuote('"The whole street heard about it before lunch." — Delivery Driver'),
    parseQuote('"I knew something was up when they bought that many baked beans." — Shopkeeper'),
    parseQuote('"Legend. Absolute legend." — Stranger at the Bus Stop'),
    parseQuote('"The way they handled it… pure chaos." — Former Manager'),
    parseQuote('"We\'re all just pretending this is normal now." — Gym Buddy'),
    parseQuote('"I\'ll be honest, I thought it was a prank." — Newsagent'),
    parseQuote('"That\'s not what I meant when I said \'follow your dreams\'." — Life Coach'),
    parseQuote('"I didn\'t believe it until I saw the quad bike." — Passing Cyclist'),
    parseQuote('"You could write a book about it. A very weird book." — Local Historian'),
    parseQuote('"It\'s either genius or madness. Or both." — Online Commenter'),
    parseQuote('"We\'ll be talking about this for years." — Old School Teacher'),
    parseQuote('"No one\'s topped that since the great trampoline incident." — Mate From Work'),
    parseQuote('"I\'ve got questions, but I\'m too afraid to ask." — Taxi Driver'),
    parseQuote('"Fair play. Took guts to do that." — Barmaid'),
    parseQuote('"That\'s the most exciting thing to happen round here in decades." — Postman'),
  ]
  return sample(pool, 5)
}

/** Shuffle generic quote labels */
export function quoteLabels(): string[] {
  return shuffle(['Source says', 'Insider claims', 'Witness reports', 'Analyst notes', 'Allegedly'])
}

export type Banner = { headline: string; blurb: string }
/** Randomize three themed sidebar banners */
export function sidebarBanners(): { shock: Banner; love: Banner; career: Banner } {
  const shockOptions: Banner[] = [
    { headline: 'Destiny Dial Turns to MAX', blurb: 'Experts warn of dramatic scenes ahead.' },
    { headline: 'Fate Picks The Wild Card', blurb: 'Nobody saw this coming, especially the neighbours.' },
    { headline: 'Universe Slides Into DMs', blurb: 'Message reads: "It was meant to be."' },
    { headline: 'Allegations of Serendipity', blurb: 'Timeline accused of "being too perfect."' },
    { headline: 'Local Horoscope Was Right', blurb: 'Capricorns: please calm down.' },
  ]
  const loveOptions: Banner[] = [
    { headline: 'Romance Officially "A Lot"', blurb: 'Friends cite emojis as evidence.' },
    { headline: 'Hearts Racing, Eyebrows Raising', blurb: 'Scandal rating: four out of five gasps.' },
    { headline: 'Couple Seen Sharing Chips', blurb: 'Commitment level: supreme.' },
    { headline: 'Text Read at 2am: "u up?"', blurb: 'Officials decline to comment.' },
    { headline: 'Love Triangle Upgraded', blurb: 'Now a rhombus. Maths teachers delighted.' },
  ]
  const careerOptions: Banner[] = [
    { headline: 'Promotions? Demotions? Emotions.', blurb: 'Boss says: "We love the chaos."' },
    { headline: 'Career Plot Twist Confirmed', blurb: 'CV currently written in caps lock.' },
    { headline: 'New Job Title: "Vibes Coordinator"', blurb: 'Salary: competitive (mysterious).' },
    { headline: 'Office Kettle Names Successor', blurb: 'Tea futures surge.' },
    { headline: 'Monday Meetings Cancelled', blurb: 'Morale skyrockets immediately.' },
  ]
  return {
    shock: pickOne(shockOptions),
    love: pickOne(loveOptions),
    career: pickOne(careerOptions),
  }
}

/** Teaser headline options for the “next issue” footer */
export function nextTeasers(params: { partner?: string; home?: string; job?: string; vehicle?: string }): string[] {
  const { partner, home, job, vehicle } = params
  return [
    'Will the raccoon run for public office?',
    `Exclusive: ${partner || 'A Mysterious Partner'} speaks at last!`,
    `Is ${home || 'their home'} actually haunted? Our experts weigh in.`,
    `Career twist: ${job || 'a bold new job'} reveals shocking side hustle.`,
    `${vehicle || 'This vehicle'}— street legal or wishful thinking?`,
  ]
}
