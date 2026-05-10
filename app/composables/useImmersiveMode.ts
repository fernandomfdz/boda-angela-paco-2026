/**
 * Shared reactive flag for "immersive mode" — when active, floating UI buttons
 * (theme, audio, envelope reopen) are hidden so they don't break the experience
 * of scroll-locked sections like SectionHistory.
 *
 * Sections opt-in by toggling this state via their own ScrollTrigger callbacks.
 */
export const useImmersiveMode = () => useState<boolean>('immersiveMode', () => false)
