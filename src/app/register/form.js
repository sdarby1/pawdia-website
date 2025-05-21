"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signIn } from "next-auth/react";
import ProviderContainer from "@/components/auth/ProviderContainer";

export const RegisterForm = () => {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const password = watch("password");

  async function onSubmit(data) {
    setServerError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        setServerError(responseData.error || "Something went wrong");
        return;
      }

      // Automatisch einloggen
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (loginRes.ok) {
        router.push("/profile");
      } else {
        setSuccessMessage("Account created, but login failed. Please log in manually.");
      }
    } catch (err) {
      setServerError("An error occurred. Please try again.");
    }
  }

  return (
    <div className="form-ct">
      {serverError && <p className="error">{serverError}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <form className="sign-in-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-container">
          {errors.name && <p className="form-error error">{errors.name.message}</p>}
          <div className="input-field">
            <label htmlFor="name" className="input-label">Name *</label>
            <input
              type="text"
              id="name"
              {...register("name", {
                required: { value: true, message: "Please enter your username" },
                minLength: { value: 4, message: "Your username must be at least 4 characters long" },
                maxLength: { value: 20, message: "Your username can't be more than 20 characters long" },
              })}
            />
          </div>
        </div>

        <div className="input-container">
          {errors.email && <p className="form-error error">{errors.email.message}</p>}
          <div className="input-field">
            <label htmlFor="email" className="input-label">E-mail *</label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: { value: true, message: "Please enter your email" },
                pattern: {
                  value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
          </div>
        </div>

        <div className="input-container">
          {errors.password && <p className="form-error error">{errors.password.message}</p>}
          <div className="input-field">
            <label htmlFor="password" className="input-label">Passwort *</label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: { value: true, message: "Please enter your password" },
                minLength: { value: 8, message: "Your password must be at least 8 characters long" },
              })}
            />
          </div>
        </div>

        <div className="input-container">
          {errors.repeatPassword && (
            <p className="form-error error">{errors.repeatPassword.message}</p>
          )}
          <div className="input-field">
            <label htmlFor="repeatPassword" className="input-label">Passwort wiederholen *</label>
            <input
              type="password"
              id="repeatPassword"
              {...register("repeatPassword", {
                required: { value: true, message: "Please confirm your password" },
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
          </div>
        </div>

        <button type="submit" className="global-btn form-submit-btn" disabled={isSubmitting}>
          Senden
        </button>
      </form>

      <div className="provider-link-ct">
        <p>Oder</p>
        <ProviderContainer />
      </div>

      <p>
        Du hast bereits einen Account? Super, einfach{" "}
        <Link href="/login">hier anmelden</Link>
      </p>
    </div>
  );
};
