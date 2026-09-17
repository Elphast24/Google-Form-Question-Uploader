export const EASING_PROFILES = {
  microHover: 'power2.out',
  microPress: 'power1.out',
  stateToggle: 'power2.out(1, 0.8)',
  fieldInsert: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  fieldDelete: 'power2.in',
  panelSwitch: 'power2.inOut',
  staggerReveal: 'power3.out',
  pulseLoop: 'sine.inOut',
  modalEntry: 'power3.out',
} as const;

export const STAGGER_DEFAULTS = {
  textLines: 0.06,
  itemCards: 0.05,
  milestones: 0.12,
  formFields: 0.06,
  options: 0.04,
} as const;
