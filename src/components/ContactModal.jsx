import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { TELEGRAM_USERNAME, WHATSAPP_ENABLED, generalMessage, telegramLink, whatsappLink } from '../lib/contact';

export default function ContactModal({ isOpen, onClose, title, message, copyText }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Portal to <body>: a transformed ancestor (animated cards) would otherwise
  // trap the fixed-position modal inside itself.
  return createPortal(
    <div className="overlay is-open contact-overlay" onClick={onClose}>
      <div
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Contact to purchase"
        onClick={(e) => e.stopPropagation()}
      >
            <button className="contact-modal__close" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            <h3>{title || 'Contact to purchase'}</h3>
            <p>Reach out and we'll confirm availability, payment, and delivery directly.</p>

            <div className="contact-modal__options">
              <a
                className="contact-option contact-option--telegram"
                href={telegramLink(message || generalMessage())}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact-option__icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.9 3.5 2.6 11.2c-1.3.5-1.3 1.2-.2 1.6l4.9 1.5 1.9 5.8c.2.6.4.9.9.9.4 0 .6-.2.9-.5l2.2-2.1 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14c.3-1.3-.4-1.9-1.5-1.5ZM8.4 13.6l9.5-6c.5-.3.9-.1.6.2l-8 7.3-.3 3.3-1.5-4Z" />
                  </svg>
                </span>
                <span>
                  <strong>Message on Telegram</strong>
                  <small>@{TELEGRAM_USERNAME} · your message is pre-typed, just tap send</small>
                </span>
              </a>

              {WHATSAPP_ENABLED ? (
              <a
                className="contact-option contact-option--whatsapp"
                href={whatsappLink(message || generalMessage())}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact-option__icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8.9-.1.2-.3.2-.5.1-1.5-.7-2.5-1.3-3.5-3-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.2-1.2 0-.1-.2-.2-.4-.3Z" />
                  </svg>
                </span>
                <span>
                  <strong>Message on WhatsApp</strong>
                  <small>Fastest response</small>
                </span>
              </a>
              ) : (
              <div className="contact-option contact-option--whatsapp contact-option--disabled" aria-disabled="true">
                <span className="contact-option__icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8.9-.1.2-.3.2-.5.1-1.5-.7-2.5-1.3-3.5-3-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.2-1.2 0-.1-.2-.2-.4-.3Z" />
                  </svg>
                </span>
                <span>
                  <strong>WhatsApp</strong>
                  <small>Coming soon — use Telegram for now</small>
                </span>
              </div>
              )}
            </div>

            {copyText && (
              <button
                type="button"
                className="contact-copy"
                onClick={() => {
                  navigator.clipboard?.writeText(copyText).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  });
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
                {copied ? 'Copied! Paste it into the chat' : 'Copy your game list to paste in chat'}
              </button>
            )}

            <a className="contact-qr" href={telegramLink(message || generalMessage())} target="_blank" rel="noopener noreferrer">
              <img src="/brand/telegram-qr-small.png" alt={`Telegram QR code for @${TELEGRAM_USERNAME}`} width="96" height="119" loading="lazy" />
              <span>
                <strong>Scan to chat on Telegram</strong>
                <small>Point your phone camera at the code to open @{TELEGRAM_USERNAME}</small>
              </span>
            </a>

            <p className="contact-modal__note">Telegram is our official channel. Orders are confirmed and keys delivered there.</p>
      </div>
    </div>,
    document.body,
  );
}
