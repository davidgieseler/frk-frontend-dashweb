import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaCalendarAlt,
  FaSearchMinus,
  FaSearchPlus,
  FaHandPaper,
} from "react-icons/fa";
import { LuImageDown } from "react-icons/lu";
import { ptBR, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

import { frickeImageMaps } from "../data/DashboardMailDailyFrickeImageMaps";
import { balmerImageMaps } from "../data/DashboardMailDailyBalmerImageMaps";
import { useGlobalContext } from "../context/Context.tsx";
import DropdownButton from "../components/DropDownButton.tsx";
import WidthSyncedBox from "../components/WidthSyncedBox.tsx";

const locales = { en: enUS, pt: ptBR };

export const DashboardMailDaily = () => {
  const { t, i18n } = useTranslation();
  const locale = locales[i18n.language as keyof typeof locales] || ptBR;
  const topDivRef = useRef<HTMLDivElement>(null);
  const [, setDropdownWidth] = useState<number | null>(null);

  const { organization } = useGlobalContext();

  // Seleciona o objeto de image maps com base na organização
  const imageMaps = useMemo<Record<string, Record<number, string>>>(() => {
    switch (organization.name) {
      case "Balmer":
        return balmerImageMaps;
      case "Fricke":
      default:
        return frickeImageMaps;
    }
  }, [organization.name]);

  const [selectedImageType, setSelectedImageType] = useState(() => {
    const keys = Object.keys(imageMaps);
    return keys.length > 0 ? keys[0] : "";
  });

  const today = useMemo(() => new Date(), []);
  const yesterday = useMemo(() => {
    const d = new Date(today);
    d.setDate(today.getDate() - 1);
    return d;
  }, [today]);
  const minDate = useMemo(() => {
    const d = new Date(yesterday);
    d.setDate(d.getDate() - 27);
    return d;
  }, [yesterday]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(yesterday);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const datePickerRef = useRef<DatePicker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const dayIndex = useMemo(
    () => (selectedDate ? selectedDate.getDate() + 1 : today.getDate()),
    [selectedDate, today],
  );

  const currentImageMap = imageMaps?.[selectedImageType] || {};
  const imageId = currentImageMap?.[dayIndex] || currentImageMap?.[1];

  useEffect(() => {
    if (zoom === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [zoom]);

  useEffect(() => {
    if (topDivRef.current) {
      setDropdownWidth(topDivRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (topDivRef.current) {
        setDropdownWidth(topDivRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (zoom > 1) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        });
      }
    },
    [zoom, position.x, position.y],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || zoom <= 1) return;

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      if (containerRef.current && imageRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const imageRect = imageRef.current.getBoundingClientRect();

        const maxX = Math.max(0, (imageRect.width - containerRect.width) / 2);
        const maxY = Math.max(0, (imageRect.height - containerRect.height) / 2);

        const limitedX = Math.min(Math.max(newX, -maxX), maxX);
        const limitedY = Math.min(Math.max(newY, -maxY), maxY);

        setPosition({ x: limitedX, y: limitedY });
      }
    },
    [isDragging, zoom, dragStart.x, dragStart.y],
  );

  const stopDragging = useCallback(() => setIsDragging(false), []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLImageElement>) => {
    if (!e.shiftKey) return;

    e.preventDefault();
    e.stopPropagation();

    setZoom((prev) => {
      const newZoom = e.deltaY < 0 ? prev + 0.01 : prev - 0.01;
      return Math.min(Math.max(newZoom, 1), 3);
    });
  }, []);

  const downloadImage = useCallback(async () => {
    if (!imageRef.current) return;
    try {
      const response = await fetch(imageRef.current.src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-[var(--surface-color)] text-[var(--text-color)] shadow-lg rounded-lg border border-[var(--border-color)]">
      {/* Header */}
      <div className="flex gap-2 flex-row items-center justify-center w-full">
        <div className="flex gap-2 items-center justify-center" ref={topDivRef}>
          <FaCalendarAlt
            className="cursor-pointer hover:text-[var(--primary-color)]"
            size={24}
            onClick={() => datePickerRef.current?.setFocus()}
          />
          <DatePicker
            ref={datePickerRef}
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={minDate}
            maxDate={yesterday}
            dateFormat={
              locale?.formatLong?.date({ width: "short" }) || "dd/MM/yyyy"
            }
            locale={locale}
            className="cursor-pointer w-full px-4 py-2 border border-[var(--primary-color)] bg-[var(--background-alt)] text-center text-[var(--text-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          />
          <div className="flex gap-2 p-1 rounded-md">
            <button
              onClick={() => setZoom((prev) => Math.min(prev + 0.02, 3))}
              className="p-2 rounded-full shadow hover:text-[var(--primary-color)] cursor-zoom-in"
              title="Aumentar Zoom (shift + wheel up)"
            >
              <FaSearchPlus size={20} />
            </button>
            <button
              onClick={() => setZoom((prev) => Math.max(prev - 0.02, 1))}
              className="p-2 rounded-full shadow hover:text-[var(--primary-color)] cursor-zoom-out"
              title="Diminuir Zoom (shift + wheel down)"
            >
              <FaSearchMinus size={20} />
            </button>
            {zoom > 1 && (
              <button
                onClick={() => setZoom(1)}
                className="p-2 rounded-full shadow cursor-pointer"
                title={t("reset_zoom")}
              >
                <FaHandPaper
                  size={20}
                  className="text-[var(--primary-color)]"
                />
              </button>
            )}
            <button
              onClick={downloadImage}
              className="p-2 rounded-full shadow"
              title="Download da Imagem"
            >
              <LuImageDown
                size={20}
                className="hover:text-[var(--primary-color)]"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Seletor de Tipo de Imagem */}
      <WidthSyncedBox referenceRef={topDivRef} className="mt-4">
        <DropdownButton
          selected={selectedImageType}
          options={Object.keys(imageMaps)}
          onSelect={(value) => setSelectedImageType(value)}
          getLabel={(key) => imageMaps[key]?.[0] || key}
          className="w-full"
        />
      </WidthSyncedBox>

      {/* Imagem */}
      <div
        ref={containerRef}
        className="mt-4 relative overflow-hidden rounded-lg w-full"
        style={{
          cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            transform: `scale(${zoom})`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          {imageId ? (
            <img
              ref={imageRef}
              src={`https://lh3.googleusercontent.com/d/${imageId}=w4000`}
              className="max-w-full max-h-full object-contain dark:brightness-80"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: isDragging ? "none" : "transform 0.2s ease-out",
              }}
              alt="Dashboard Diário"
              draggable="false"
              onWheel={handleWheel}
            />
          ) : (
            <p>Imagem não encontrada</p>
          )}
        </div>
      </div>
    </div>
  );
};
