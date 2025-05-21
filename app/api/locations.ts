"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios, { AxiosError } from "axios";


export async function handleUnauthorized() {
  "use server";
  redirect("/unauthorized");
}

const getAxiosConfig = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token.value} ` : "",
      "Content-Type": "application/json",
    },
  };    
};

export async function fetchLocations()  {
  try {

    const config = await getAxiosConfig();
    const response = await axios.get(
    `  ${process.env.NEXT_PUBLIC_API_URL}/locations `,
      config
    );
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch Sites:", error);
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    return { data: [] };
  }
}
export async function postLocations({data}: any)  {
  try {

    const config = await getAxiosConfig();
    const response = await axios.post(
    `  ${process.env.NEXT_PUBLIC_API_URL}/locations `,
      data,config
    );
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to Create Site:", error);
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    return { data: [] };
  }
}

export async function fetchLocationById(id: string) {
  const response = await fetch(`https://ofgen.cognitron.co.ke/ofgen/api/locations/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch location by ID")
  }
  return response.json()
}

export async function updateLocationById(id: string, updateData: any) {
  const response = await fetch(`https://ofgen.cognitron.co.ke/ofgen/api/locations/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to update location")
  }
  return response.json()
}

export async function deleteLocationById(id: string) {
  const response = await fetch(`https://ofgen.cognitron.co.ke/ofgen/api/locations/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to delete location")
  }
  return response.json()
}
