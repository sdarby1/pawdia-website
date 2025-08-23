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
      const loginRes = await signIn("user-login", {
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
    <div className="bd-container grid !grid-cols-[auto_1fr] gap-[8rem] pt-[2rem] pb-[5rem]">
      <div className="flex flex-col gap-[3rem] items-center">
        <h1 className='text-center'>Willkommen!</h1>
        <div className="flex flex-col gap-[1rem] w-[100%]">
          <p>Du bist ein:</p>
          <div className="flex gap-[1rem]">
            <Link href="/register" className="global-btn">Tierfreund</Link>
              <Link href="/bewerben" className="global-btn">Tierheim</Link>
          </div>
        </div>

      <form className="sign-in-form" onSubmit={handleSubmit(onSubmit)}>
              {serverError && <p className="error">{serverError}</p>}
              {successMessage && <p className="success">{successMessage}</p>}

        <div className="input-container">
          {errors.name && <p className="form-error error">{errors.name.message}</p>}
          <div className="input-field">
            <input
              type="text"
              placeholder="Nutzername"
                 autoComplete="off"
              id="name"
              {...register("name", {
                required: { value: true, message: "Nutzername ist erforderlich" },
                minLength: { value: 4, message: "Mindestens 4 Zeichen" },
                maxLength: { value: 20, message: "Dein Nutzername darf nicht länger als 30 Zeichen sein" },
              })}
            />
          </div>
        </div>

        <div className="input-container">
          {errors.email && <p className="form-error error">{errors.email.message}</p>}
          <div className="input-field">
            <input
              type="email"
              placeholder="E-Mail"
              autoComplete="off"
              id="email"
              {...register("email", {
                required: { value: true, message: "E-Mail ist erforderlich" },
                pattern: {
                  value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                  message: "Bitte gib eine gültige E-Mail an",
                },
              })}
            />
          </div>
        </div>

        <div className="input-container">
          {errors.password && <p className="form-error error">{errors.password.message}</p>}
          <div className="input-field">
            <input
              type="password"
              placeholder="Passwort"
                 autoComplete="off"
              id="password"
              {...register("password", {
                required: { value: true, message: "Passwort ist erforderlich" },
                minLength: { value: 8, message: "YMindestens 8 Zeichen" },
              })}
            />
          </div>
        </div>

        <div className="input-container">
          {errors.repeatPassword && (
            <p className="form-error error">{errors.repeatPassword.message}</p>
          )}
          <div className="input-field">
            <input
              type="password"
              placeholder="Passwort bestätigen"
              id="repeatPassword"
              {...register("repeatPassword", {
                required: { value: true, message: "Bitte bestätige dein Passwort" },
                validate: (value) =>
                  value === password || "Die Passwörter stimmen nicht überein",
              })}
            />
          </div>
        </div>

        <button type="submit" className="global-btn-bg !w-[100%] form-submit-btn" disabled={isSubmitting}>
          Senden
        </button>
      </form>

       <div className='flex gap-[1rem]'>
          <Link href="" onClick={() => signIn('google')}><img src="/images/signIn/google-icon.svg" /></Link>
          <Link href="" onClick={() => signIn('github')}><img src="/images/signIn/github-icon.svg" /></Link>
        </div>

    </div>
      <div className='w-[100%] h-[100%] flex items-align justify-center'>
        <img className='w-[65%]' src="/images/signIn/allAnimals.svg"></img>
      </div>
    </div>
  );
};
