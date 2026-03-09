import styles from "./Message.module.css";

type MessageVariant = "default" | "success" | "error";

export function MessageCard({
  title,
  subtitle,
  variant = "default",
}: {
  title: string;
  subtitle?: string;
  variant?: MessageVariant;
}) {
  const colorClass =
    variant === "success"
      ? styles.success
      : variant === "error"
      ? styles.error
      : styles.default;

  return (
    <div className={`${styles.box} ${colorClass}`}>
      {title}
      <br />
      {subtitle}
    </div>
  );
};