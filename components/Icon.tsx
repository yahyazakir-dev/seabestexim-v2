// Authored line icons, one stroke weight, drawn on a 24-unit grid.
const paths = {
  phone:
    "M6.6 3.5h2.7l1.5 4.2-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4.2 1.5v2.7a2.1 2.1 0 0 1-2.3 2.1C10.6 19 5 13.4 4.5 5.8a2.1 2.1 0 0 1 2.1-2.3Z",
  mail: "M3.5 6.5h17v11h-17z M3.8 7l8.2 6.2L20.2 7",
  arrow: "M4.5 12h14 M13.5 6.5 19 12l-5.5 5.5",
  pin: "M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11Z M12 12.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z",
  clock: "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z M12 7.5V12l3 2",
  menu: "M4 7.5h16 M4 12h16 M4 16.5h16",
  close: "M6 6l12 12 M18 6 6 18",
  snow: "M12 3v18 M4.2 7.5l15.6 9 M4.2 16.5l15.6-9 M9.5 4.5 12 7l2.5-2.5 M9.5 19.5 12 17l2.5 2.5",
  flame: "M12 21c-3.6 0-6-2.5-6-5.8 0-3.8 3.3-5.6 3.9-9.7 2.6 1.5 4.6 4.3 4.6 7 1-.8 1.5-2 1.6-3.3 1.2 1.3 1.9 3.3 1.9 5.6 0 3.6-2.4 6.2-6 6.2Z",
  paw: "M12 20c-2.4 0-5-1.2-5-3.6 0-2.3 2.6-4.9 5-4.9s5 2.6 5 4.9c0 2.4-2.6 3.6-5 3.6Z M6 10.6a1.8 2.3 0 1 0 0-.1Z M18 10.6a1.8 2.3 0 1 0 0-.1Z M9.3 6.8a1.8 2.3 0 1 0 0-.1Z M14.7 6.8a1.8 2.3 0 1 0 0-.1Z",
  cube: "M12 3.5 19.5 7.7v8.6L12 20.5l-7.5-4.2V7.7Z M4.5 7.7 12 12l7.5-4.3 M12 12v8.5",
  ship: "M3.5 15.5h17l-2.2 4H5.7Z M6 15.5V9.5h12v6 M9 9.5V6h6v3.5 M12 3.5V6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  whatsapp:
    "M4 20l1.2-4.1A8.3 8.3 0 1 1 8.4 19L4 20Z M9.2 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .6.5l.7 1.7c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.5.8 1.1 1.5 2 2 .2.1.4.1.5 0l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.4 0 .4-.1 1-.5 1.4-.5.5-1.4.8-2.3.6-1.5-.4-3.6-1.6-4.9-3.6-.9-1.4-.9-2.6-.4-3.3Z",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={paths[name]} />
    </svg>
  );
}
