import React, { useState } from 'react'
import { initialFormState, validateField, validateForm, hasFormErrors } from '../utils/formValidation'

const Contact = () => {
  const [values, setValues] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  const ImageClipBox = ({ src, clipClass }) => (
    <div className={clipClass}>
      <img src={src} />
    </div>
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    const fieldError = validateField(name, value)

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }))
    setSuccessMessage('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const validationErrors = validateForm(values)
    setErrors(validationErrors)

    if (hasFormErrors(validationErrors)) {
      setSuccessMessage('')
      return
    }

    setSuccessMessage('Thank you! Your message was sent successfully.')
    setValues(initialFormState)
  }

  const renderInput = (label, name, type = 'text', placeholder) => (
    <label className='flex flex-col gap-2 text-left'>
      <span className='font-general text-sm uppercase tracking-[0.22em] text-blue-100'>
        {label}
      </span>
      <input
        name={name}
        type={type}
        value={values[name]}
        placeholder={placeholder}
        onChange={handleChange}
        className={`rounded-3xl border px-4 py-3 text-slate-900 outline-none transition-colors duration-200 ${errors[name] ? 'border-rose-500 bg-rose-50' : 'border-slate-400 bg-white/90 focus:border-violet-400'}`}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={`${name}-error`}
      />
      {errors[name] && (
        <span id={`${name}-error`} className='text-sm text-rose-400'>
          {errors[name]}
        </span>
      )}
    </label>
  )

  return (
    <div id='contact' className='my-20 min-h-96 w-screen px-10'>
      <div className='relative rounded-lg bg-black py-24 text-blue-50 sm:overflow-hidden'>
        <div className='absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96'>
          <ImageClipBox
            clipClass='contact-clip-path-1'
            src='img/contact-1.webp'
          />
          <ImageClipBox
            clipClass='contact-clip-path-2 lg:translate-y-40 translate-y-60'
            src='img/contact-2.webp'
          />
        </div>
        <div className='absolute -top-40 left-24 w-60 sm:top-1/2 md:left-auto md:right-6 lg:top-20 lg:w-72'>
          <ImageClipBox
            src='img/swordman-partial.webp'
            clipClass='absolute md:scale-125'
          />
          <ImageClipBox
            src='img/swordman.webp'
            clipClass='sword-man-clip-path md:scale-125'
          />
        </div>

        <div className='relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[1.1fr_0.9fr]'>
          <div className='flex flex-col justify-center gap-6 text-center md:text-left'>
            <p className='font-general text-[10px] uppercase'>Join Zentry</p>
            <p className='special-font w-full font-zentry text-5xl leading-[0.9] md:text-[5.4rem]'>Let's B<b>u</b>ild the <br /> new era of g<b>a</b>ming <br /> t<b>o</b>gether.</p>
            <p className='max-w-xl text-sm text-slate-300'>Share your details and we’ll get back to you with a tailored onboarding plan. All fields are validated instantly so you can correct issues as you type.</p>
          </div>

          <form onSubmit={handleSubmit} className='rounded-[2rem] border border-slate-700 bg-slate-950/90 p-8 shadow-xl shadow-slate-900/30'>
            <div className='grid gap-5'>
              {renderInput('Name', 'name', 'text', 'Enter your full name')}
              {renderInput('Email', 'email', 'email', 'Enter your email address')}
              {renderInput('Password', 'password', 'password', 'Create a strong password')}
              <label className='flex flex-col gap-2 text-left'>
                <span className='font-general text-sm uppercase tracking-[0.22em] text-blue-100'>Message</span>
                <textarea
                  name='message'
                  value={values.message}
                  placeholder='Tell us what you need'
                  onChange={handleChange}
                  rows='5'
                  className={`rounded-3xl border px-4 py-3 text-slate-900 outline-none transition-colors duration-200 ${errors.message ? 'border-rose-500 bg-rose-50' : 'border-slate-400 bg-white/90 focus:border-violet-400'}`}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby='message-error'
                />
                {errors.message && (
                  <span id='message-error' className='text-sm text-rose-400'>
                    {errors.message}
                  </span>
                )}
              </label>
            </div>

            <button
              type='submit'
              className='mt-8 inline-flex w-full items-center justify-center rounded-full bg-violet-50 px-7 py-3 text-sm font-semibold text-black transition hover:bg-violet-100'
            >
              Send request
            </button>

            {successMessage && (
              <p className='mt-6 rounded-3xl bg-emerald-50/10 px-4 py-3 text-sm text-emerald-300'>
                {successMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact