import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { CircleFlag } from "react-circle-flags";
import "../styles/LanguageSelector.css";
import { getLanguages } from "../data/Languages";

const LANGUAGES = getLanguages();

const useDraggable = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const initialPointerPos = useRef<{ x: number; y: number } | null>(null);
  const dragThreshold = 5; // pixels

  const handlePointerMove = (e: PointerEvent) => {
    if (!elementRef.current || !initialPointerPos.current) return;

    const dx = e.clientX - initialPointerPos.current.x;
    const dy = e.clientY - initialPointerPos.current.y;

    if (!isDragging.current && Math.sqrt(dx * dx + dy * dy) > dragThreshold) {
      isDragging.current = true;
    }

    if (isDragging.current) {
      const rect = elementRef.current.getBoundingClientRect();
      elementRef.current.style.left = `${e.clientX - rect.width / 2}px`;
      elementRef.current.style.top = `${e.clientY - rect.height / 2}px`;
    }
  };

  const handlePointerUp = () => {
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
    initialPointerPos.current = null;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    initialPointerPos.current = { x: e.clientX, y: e.clientY };
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  return { elementRef, handlePointerDown, isDragging };
};

const LanguageSelectorComponent = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { elementRef, handlePointerDown, isDragging } = useDraggable();

  const currentLanguage =
    LANGUAGES.find((lang) => i18n.language.startsWith(lang.code)) ??
    LANGUAGES[0];

  const changeLanguage = useCallback(
    (language: string) => {
      i18n.changeLanguage(language);
      setIsOpen(false);
      localStorage.setItem("preferredLanguage", language);
    },
    [i18n],
  );

  const toggleDropdown = () => {
    if (isDragging.current) {
      isDragging.current = false;
      return;
    }
    setIsOpen((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleDropdown();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [elementRef]);

  return (
    <div
      ref={elementRef}
      className="language-selector-container"
      style={{ bottom: "20px", right: "20px", position: "fixed" }}
      onPointerDown={handlePointerDown}
      onClick={toggleDropdown}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-expanded={isOpen}
      aria-label={t("language.selector.label")}
    >
      {/* Bandeira circular externa */}
      <CircleFlag
        countryCode={currentLanguage.flagCode}
        className="outer-language-flag"
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="language-dropdown"
            role="menu"
            aria-orientation="vertical"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className="language-option"
                role="menuitem"
                disabled={lang.code === currentLanguage.code}
                aria-selected={lang.code === currentLanguage.code}
              >
                {/* Bandeira tradicional no dropdown */}
                <lang.Flag className="inner-language-flag" />
                <span>{t(`language.${lang.code}`)}</span>
                {lang.code === currentLanguage.code && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelectorComponent;
