import React from "react";

interface ButtonBaseProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  id?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
  style?: React.CSSProperties;
}

interface ButtonAsButton extends ButtonBaseProps {
  as?: "button";
  href?: never;
  type?: "button" | "submit" | "reset";
}

interface ButtonAsAnchor extends ButtonBaseProps {
  as: "a";
  href: string;
  type?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const sizeMap = {
  sm: "px-4 py-2 text-[0.6875rem]",
  md: "px-8 py-3 text-[0.75rem]",
  lg: "px-10 py-4 text-[0.8125rem]",
};

/**
 * Button — METRONARY CTA component.
 *
 * Uses .m-btn + .m-btn-primary / .m-btn-secondary from globals.css.
 * Polymorphic: renders as <a> when `as="a"` + `href` are provided.
 */
export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    children,
    className = "",
    disabled,
    id,
    style,
    onClick,
  } = props;

  const variantCls = variant === "primary" ? "m-btn-primary" : "m-btn-secondary";
  const sizeCls = sizeMap[size];
  const cls = `m-btn ${variantCls} ${sizeCls} ${className}`;

  if (props.as === "a") {
    return (
      <a
        id={id}
        href={props.href}
        className={cls}
        style={style}
        aria-disabled={disabled}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      id={id}
      type={props.type ?? "button"}
      className={cls}
      style={style}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
