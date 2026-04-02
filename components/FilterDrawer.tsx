"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { formatModalityName } from "@/lib/utils";

type Filters = {
  modality: string;
  priceRange: string;
  licensedOnly: boolean;
};

export default function FilterDrawer({
  onFilter,
  initialFilters,
}: {
  onFilter: (filters: Filters) => void;
  initialFilters?: Partial<Filters>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    modality: initialFilters?.modality || "",
    priceRange: initialFilters?.priceRange || "",
    licensedOnly: initialFilters?.licensedOnly ?? false,
  });

  const modalityOptions = [
    "swedish",
    "deep_tissue",
    "sports",
    "prenatal",
    "hot_stone",
    "couples",
    "lymphatic",
    "trigger_point",
  ];

  const handleApply = () => {
    onFilter(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const cleared = { modality: "", priceRange: "", licensedOnly: false };
    setFilters(cleared);
    onFilter(cleared);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-secondary gap-2 lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-spa-800 p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-cream">Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-cream/10"
              >
                <X className="h-5 w-5 text-cream" />
              </button>
            </div>

            <FilterContent
              filters={filters}
              setFilters={setFilters}
              modalityOptions={modalityOptions}
            />

            <div className="mt-6 flex gap-3">
              <button onClick={handleClear} className="btn-secondary flex-1">
                Clear All
              </button>
              <button onClick={handleApply} className="btn-primary flex-1">
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <div className="rounded-xl border border-cream/10 bg-card p-5">
          <h3 className="mb-4 font-display text-base font-bold text-cream">Filter Results</h3>
          <FilterContent
            filters={filters}
            setFilters={setFilters}
            modalityOptions={modalityOptions}
          />
          <div className="mt-5 flex gap-3">
            <button
              onClick={handleClear}
              className="btn-secondary flex-1 py-2 text-xs"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="btn-primary flex-1 py-2 text-xs"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function FilterContent({
  filters,
  setFilters,
  modalityOptions,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  modalityOptions: string[];
}) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-semibold text-cream">
          Massage Type
        </label>
        <select
          value={filters.modality}
          onChange={(e) => setFilters({ ...filters, modality: e.target.value })}
          className="input"
        >
          <option value="">All Types</option>
          {modalityOptions.map((m) => (
            <option key={m} value={m}>
              {formatModalityName(m)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-cream">
          Price Range
        </label>
        <div className="space-y-2">
          {[
            { value: "", label: "Any Price" },
            { value: "budget", label: "$ — Budget-Friendly" },
            { value: "mid", label: "$$ — Mid-Range" },
            { value: "premium", label: "$$$ — Premium" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5">
              <input
                type="radio"
                name="priceRange"
                value={opt.value}
                checked={filters.priceRange === opt.value}
                onChange={(e) =>
                  setFilters({ ...filters, priceRange: e.target.value })
                }
                className="h-4 w-4 border-cream/30 text-sage focus:ring-sage"
              />
              <span className="text-sm text-cream/70">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={filters.licensedOnly}
            onChange={(e) =>
              setFilters({ ...filters, licensedOnly: e.target.checked })
            }
            className="h-4 w-4 rounded border-cream/30 text-sage focus:ring-sage"
          />
          <span className="text-sm font-medium text-cream">
            Licensed &amp; Insured Only
          </span>
        </label>
      </div>
    </div>
  );
}
