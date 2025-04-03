import React, { useEffect, useRef, useState } from "react";

type WidthSyncedBoxProps = {
  /** Referência da div que será usada para copiar a largura */
  referenceRef: React.RefObject<HTMLElement | null>;
  /** Conteúdo que será renderizado com a mesma largura */
  children: React.ReactNode;
  /** Estilo extra opcional */
  className?: string;
  /** Estilo inline opcional */
  style?: React.CSSProperties;
};

const WidthSyncedBox: React.FC<WidthSyncedBoxProps> = ({
  referenceRef,
  children,
  className = "",
  style = {},
}) => {
  const [width, setWidth] = useState<number | null>(null);
  const localRef = useRef<HTMLDivElement>(null);

  // Função para copiar largura da referência
  const updateWidth = () => {
    if (referenceRef.current) {
      setWidth(referenceRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateWidth();

    // Tenta usar ResizeObserver se disponível
    let observer: ResizeObserver | null = null;

    if (referenceRef.current && "ResizeObserver" in window) {
      observer = new ResizeObserver(() => updateWidth());
      observer.observe(referenceRef.current);
    } else {
      window.addEventListener("resize", updateWidth);
    }

    return () => {
      if (observer && referenceRef.current) {
        observer.unobserve(referenceRef.current);
      } else {
        window.removeEventListener("resize", updateWidth);
      }
    };
  }, [referenceRef]);

  return (
    <div
      ref={localRef}
      className={className}
      style={{ width: width ?? "auto", ...style }}
    >
      {children}
    </div>
  );
};

export default WidthSyncedBox;
