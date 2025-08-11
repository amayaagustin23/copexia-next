// src/services/googlePlacesService.ts

import { BackendEndpoints } from "@/lib/config/apiPath"; // Asumiendo que BackendEndpoints está ahí o ajusta la importación

interface AutocompletePrediction {
  description: string;
  place_id: string;
  // Puedes añadir más campos si los necesitas de la respuesta del backend
}

interface PlaceDetails {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  // Añade aquí cualquier otro detalle que tu backend extraiga de Google Places
}

export const getAutocompleteSuggestions = async (
  input: string
): Promise<AutocompletePrediction[]> => {
  try {
    const response = await fetch(
      `${BackendEndpoints.googlePlaces.autocomplete}?input=${encodeURIComponent(
        input
      )}`
    );
    if (!response.ok) {
      // Manejo de errores básico
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data; // Asume que el backend devuelve un array de predicciones
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error);
    return [];
  }
};

export const getPlaceDetails = async (
  placeId: string
): Promise<PlaceDetails | null> => {
  try {
    const response = await fetch(
      `${BackendEndpoints.googlePlaces.details}?placeId=${encodeURIComponent(
        placeId
      )}`
    );
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data; // Asume que el backend devuelve los detalles del lugar
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
};
