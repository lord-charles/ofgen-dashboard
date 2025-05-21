export async function createLocation(locationData: any) {
  const response = await fetch("https://ofgen.cognitron.co.ke/ofgen/api/locations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(locationData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to create location")
  }

  return response.json()
}

export async function fetchLocations() {
  const response = await fetch("https://ofgen.cognitron.co.ke/ofgen/api/locations")
  if (!response.ok) {
    throw new Error("Failed to fetch locations")
  }
  return response.json()
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
