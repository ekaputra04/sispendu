const ButtonCSS =
  "inline-flex justify-center items-center gap-2 disabled:opacity-50 aria-invalid:border-destructive focus-visible:border-ring rounded-md outline-none aria-invalid:ring-destructive/20 focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 font-medium text-sm whitespace-nowrap transition-all [&_svg]:pointer-events-none disabled:pointer-events-none shrink-0 [&_svg]:shrink-0 h-9 px-4 py-2 has-[>svg]:px-3 hover:cursor-pointer ";

export const ButtonDefaultCSS =
  ButtonCSS +
  "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90";

export const ButtonDestructiveCSS =
  ButtonCSS +
  "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60";

export const ButtonOutlineCSS =
  ButtonCSS +
  "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50";

export const ButtonSecondaryCSS =
  ButtonCSS +
  "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80";

export const ButtonGhostCSS =
  ButtonCSS +
  "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50";
export const ButtonLinkCSS =
  ButtonCSS + "text-primary underline-offset-4 hover:underline";

export const ButtonOutlineGreen =
  ButtonCSS +
  "bg-green-100 hover:bg-green-200 border border-green-500 text-green-600 hover:text-green-700";
