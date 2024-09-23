import React, { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Region {
  code: string;
  name: string;
  level: "province" | "district" | "city" | "village";
}

interface RegionSelectorProps {
  selectedProvince: string;
  selectedDistrict: string;
  selectedCity: string;
  selectedVillage: string;
  onProvinceChange: (code: string, name: string) => void;
  onDistrictChange: (code: string, name: string) => void;
  onCityChange: (code: string, name: string) => void;
  onVillageChange: (code: string, name: string) => void;
}

const LEVELS = ["province", "district", "city", "village"] as const;
type Level = (typeof LEVELS)[number];

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedProvince,
  selectedDistrict,
  selectedCity,
  selectedVillage,
  onProvinceChange,
  onDistrictChange,
  onCityChange,
  onVillageChange,
}) => {
  const [regions, setRegions] = useState<Record<Level, Region[]>>({
    province: [],
    district: [],
    city: [],
    village: [],
  });

  const homedomain = import.meta.env.PUBLIC_HOME_DOMAIN;

  const fetchRegions = useCallback(
    async (level: Level, parentCode?: string) => {
      try {
        const url = new URL(`${homedomain}/api/regions/`);
        url.searchParams.append("filter[level]", level);
        if (parentCode) url.searchParams.append("filter[code]", parentCode);
        url.searchParams.append("include", "children");
        url.searchParams.append("per_page", "100");

        const response = await fetch(url.toString());
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setRegions((prev) => ({ ...prev, [level]: data.data }));
      } catch (error) {
        console.error(`Kesalahan saat mengambil ${level}:`, error);
        // Tambahkan logika untuk menangani error, misalnya menampilkan pesan error ke pengguna
      }
    },
    [homedomain]
  );

  useEffect(() => {
    fetchRegions("province");
  }, [fetchRegions]);

  useEffect(() => {
    if (selectedProvince) fetchRegions("district", selectedProvince);
  }, [selectedProvince, fetchRegions]);

  useEffect(() => {
    if (selectedDistrict) fetchRegions("city", selectedDistrict);
  }, [selectedDistrict, fetchRegions]);

  useEffect(() => {
    if (selectedCity) fetchRegions("village", selectedCity);
  }, [selectedCity, fetchRegions]);

  const handleChange = useCallback(
    (level: Level) => (value: string) => {
      const selectedRegion = regions[level].find(
        (region) => region.code === value
      );
      if (selectedRegion) {
        const changeHandlers = {
          province: onProvinceChange,
          district: onDistrictChange,
          city: onCityChange,
          village: onVillageChange,
        };
        changeHandlers[level](value, selectedRegion.name);
      }
    },
    [regions, onProvinceChange, onDistrictChange, onCityChange, onVillageChange]
  );

  const renderSelect = useCallback(
    (level: Level, value: string, disabled: boolean) => (
      <Select
        key={level}
        onValueChange={handleChange(level)}
        value={value}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={`Pilih ${level.charAt(0).toUpperCase() + level.slice(1)}`}
          />
        </SelectTrigger>
        <SelectContent>
          {regions[level]?.map((region) => (
            <SelectItem key={region.code} value={region.code}>
              {region.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    [regions, handleChange]
  );

  return (
    <div className="space-y-4 region-selector">
      {LEVELS.map((level, index) =>
        renderSelect(
          level,
          [selectedProvince, selectedDistrict, selectedCity, selectedVillage][
            index
          ],
          index > 0 &&
            ![selectedProvince, selectedDistrict, selectedCity][index - 1]
        )
      )}
    </div>
  );
};

export default RegionSelector;
