export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export function buttonStyles(variant: ButtonVariant = "primary", size: ButtonSize = "md"): string {
  const base = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50";
  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-2 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-6 py-3 text-base",
  };
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-red-dark text-white shadow-lg shadow-red/25 hover:bg-[#982733] hover:-translate-y-0.5",
    secondary: "bg-navy text-white hover:bg-indigo",
    outline: "border-2 border-navy/20 bg-white text-navy hover:border-navy/50 hover:bg-cream",
    ghost: "text-navy hover:bg-navy/5",
    danger: "bg-red/10 text-red hover:bg-red hover:text-white",
  };
  return `${base} ${sizes[size]} ${variants[variant]}`;
}
