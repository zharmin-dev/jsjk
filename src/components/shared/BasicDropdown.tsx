import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export interface DropdownItem<T extends string | number = string | number> {
  id: T;
  label: string;
  icon?: ReactNode;
}

interface BasicDropdownProps<T extends string | number = string | number> {
  label: string;
  items: DropdownItem<T>[];
  value?: T;
  onChange?: (item: DropdownItem<T>) => void;
  className?: string;
}

export function BasicDropdown<T extends string | number = string | number>({
  label,
  items,
  value,
  onChange,
  className = "",
}: BasicDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonId = useId();
  const selectedItem = items.find((item) => item.id === value) ?? null;

  function handleItemSelect(item: DropdownItem<T>) {
    setIsOpen(false);
    onChange?.(item);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`basic-dropdown ${isOpen ? "open" : ""} ${className}`}>
      <button
        id={buttonId}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="basic-dropdown-trigger"
      >
        <span>{selectedItem ? selectedItem.label : label}</span>
        <ChevronDown className="basic-dropdown-chevron" size={16} aria-hidden />
      </button>

      {isOpen && (
        <div className="basic-dropdown-menu" role="menu" aria-orientation="vertical" aria-labelledby={buttonId}>
          <ul>
            {items.map((item) => {
              const selected = selectedItem?.id === item.id;
              return (
                <li key={item.id} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleItemSelect(item)}
                    className={selected ? "selected" : ""}
                  >
                    {item.icon && <span className="basic-dropdown-icon">{item.icon}</span>}
                    <span>{item.label}</span>
                    {selected && (
                      <svg className="basic-dropdown-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
