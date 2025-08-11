"use client";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

interface Props {
  name: string;
}

export const TranslatedFormMessage = ({ name }: Props) => {
  const t = useTranslations();
  const {
    formState: { errors },
  } = useFormContext();

  const message = errors[name]?.message as string | undefined;

  return (
    <p
      className={`text-sm min-h-[1rem] ${
        message ? "text-destructive" : "invisible"
      }`}
    >
      {message ? t(message) : "placeholder"}
    </p>
  );
};
