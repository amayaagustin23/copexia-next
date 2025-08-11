"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { TranslatedFormMessage } from "@/components/translated-form-message";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalizedPaths } from "@/lib/hooks/useLocalizedPaths";
import { registerProfessionalSchema } from "@/schemas/auth/registerProfessionalSchema";
import { LicenseType, registerUser, Title } from "@/services/authService";
import {
  getAutocompleteSuggestions,
  getPlaceDetails,
} from "@/services/googlePlacesService";
import { Calendar } from "lucide-react";

import { PasswordInput } from "@/components/PasswordInput";
import { RegisterProfessionalData } from "@/types/auth";

export default function RegisterProfessionalPage() {
  const router = useRouter();
  const t = useTranslations("Register");
  const paths = useLocalizedPaths();
  const birthDateRef = useRef<HTMLInputElement>(null);
  const form = useForm<RegisterProfessionalData>({
    resolver: zodResolver(registerProfessionalSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      dni: "",
      phone: "",
      title: Title.BACHELOR,
      licenseNumber: "",
      licenseType: LicenseType.NATIONAL,
      street: "",
      city: "",
      province: "",
      postalCode: "",
    },
    mode: "onBlur",
  });

  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<
    { description: string; place_id: string }[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionListRef = useRef<HTMLUListElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleStreetInputChange = useCallback(
    async (inputValue: string) => {
      form.setValue("street", inputValue);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      if (inputValue.length >= 3) {
        debounceTimeoutRef.current = setTimeout(async () => {
          const suggestions = await getAutocompleteSuggestions(inputValue);
          setAutocompleteSuggestions(suggestions);
          setShowSuggestions(true);
        }, 3000);
      } else {
        setAutocompleteSuggestions([]);
        setShowSuggestions(false);
      }
    },
    [form]
  );

  const handleSuggestionClick = async (
    placeId: string,
    description: string
  ) => {
    form.setValue("street", description, { shouldValidate: true });
    setShowSuggestions(false);

    const details = await getPlaceDetails(placeId);
    if (details) {
      form.setValue("city", details.city, { shouldValidate: true });
      form.setValue("province", details.province, { shouldValidate: true });
      form.setValue("postalCode", details.postalCode, {
        shouldValidate: true,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionListRef.current &&
        !suggestionListRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('input[name="street"]')
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const onSubmit = async (data: RegisterProfessionalData) => {
    const response = await registerUser(data);
    if (response) {
      router.push(paths.auth.login);
    }
  };
  const renderField = (
    fieldName: keyof RegisterProfessionalData,
    type: string = "text",
    colSpan: string = "",
    selectOptions: { value: string; label: string }[] = []
  ) => (
    <FormField
      key={fieldName}
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={colSpan}>
          <FormLabel>{t(`${fieldName}Label`)}</FormLabel>

          {selectOptions.length > 0 ? (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value as string}
              onOpenChange={(open) => !open && field.onBlur()}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t(`${fieldName}Placeholder`)} />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <FormControl>
              {fieldName === "street" ? (
                <div className="relative">
                  <Input
                    type={type}
                    placeholder={t(`${fieldName}Placeholder`)}
                    {...field}
                    onChange={(e) => handleStreetInputChange(e.target.value)}
                    onFocus={() => {
                      if (
                        autocompleteSuggestions.length > 0 &&
                        field.value &&
                        field.value.length >= 3
                      ) {
                        setShowSuggestions(true);
                      }
                    }}
                  />
                  {showSuggestions && autocompleteSuggestions.length > 0 && (
                    <ul
                      ref={suggestionListRef}
                      className="absolute z-10 w-full bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto mt-1"
                    >
                      {autocompleteSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.place_id}
                          className="px-4 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                          onClick={() =>
                            handleSuggestionClick(
                              suggestion.place_id,
                              suggestion.description
                            )
                          }
                        >
                          {suggestion.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : fieldName === "password" ||
                fieldName === "confirmPassword" ? (
                <PasswordInput
                  className=""
                  placeholder={t(`${fieldName}Placeholder`)}
                  {...field}
                />
              ) : fieldName === "birthDate" ? (
                <div className="relative">
                  <Input
                    ref={(el) => {
                      if (fieldName === "birthDate") birthDateRef.current = el;
                    }}
                    type="date"
                    placeholder="dd/mm/aaaa"
                    className="w-full appearance-none pr-10 [&::-webkit-calendar-picker-indicator]:opacity-1"
                    {...field}
                  />
                  <Calendar
                    onClick={() => birthDateRef.current?.showPicker()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer"
                  />
                </div>
              ) : (
                <Input
                  type={type}
                  placeholder={t(`${fieldName}Placeholder`)}
                  {...field}
                />
              )}
            </FormControl>
          )}
          <TranslatedFormMessage name={fieldName} />
        </FormItem>
      )}
    />
  );

  const titleOptions = [
    { value: Title.BACHELOR, label: t("titleBachelor") },
    { value: Title.TECHNICIAN, label: t("titleTechnician") },
  ];

  const licenseTypeOptions = [
    { value: LicenseType.NATIONAL, label: t("licenseTypeNational") },
    { value: LicenseType.PROVINCIAL, label: t("licenseTypeProvincial") },
  ];

  const isFormInvalid = !form.formState.isValid || form.formState.isSubmitting;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-7xl rounded-2xl shadow-sm bg-card text-card-foreground">
        <CardHeader className="flex flex-col items-center pb-0">
          <Image
            src="/images/logo-letter.png"
            alt="Aliviarte"
            width={250}
            height={50}
            className="mb-1"
          />
          <h1 className="text-2xl font-bold mt-4 mb-10">{t("title")}</h1>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {t("personalDataTitle")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {renderField("firstName")}
                  {renderField("lastName")}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                  {renderField("email")}
                  {renderField("password", "password")}
                  {renderField("confirmPassword", "password")}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                  {renderField("birthDate", "date")}
                  {renderField("dni")}
                  {renderField("phone")}
                </div>
              </div>

              <hr className="my-6 border-t border-gray-200" />

              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {t("professionalDataTitle")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {renderField("title", "text", "", titleOptions)}
                  {renderField("licenseNumber")}
                  {renderField("licenseType", "text", "", licenseTypeOptions)}
                </div>
              </div>

              <hr className="my-6 border-t border-gray-200" />

              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {t("addressDataTitle")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {renderField("street")}
                  {renderField("city")}
                  {renderField("province")}
                  {renderField("postalCode")}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-accent mt-6"
                disabled={isFormInvalid}
              >
                {form.formState.isSubmitting
                  ? t("submittingButton")
                  : t("submitButton")}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="text-sm justify-center text-muted-foreground">
          {t("hasAccountPrompt")}
          <Link
            href={paths.auth.login}
            className="ml-1 text-accent hover:underline"
          >
            {t("loginLink")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
