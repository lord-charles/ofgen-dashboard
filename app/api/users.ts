export async function getUserById(id: string) {
  const response = await fetch(`https://ofgen.cognitron.co.ke/ofgen/api/user/${id}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch user by ID')
  }
  return response.json()
}

export async function updateUserById(id: string, updateData: any) {
  const response = await fetch(`https://ofgen.cognitron.co.ke/ofgen/api/user/${id}` , {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update user')
  }
  return response.json()
}

export async function deleteUserById(id: string) {
  const response = await fetch(`https://ofgen.cognitron.co.ke/ofgen/api/user/${id}` , {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete user')
  }
  return response.json()
}

export async function getUserByNationalId(nationalId: string) {
  const response = await fetch(`https://ofgen.cognitron.co.ke/ofgen/api/user/national-id/${nationalId}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch user by National ID')
  }
  return response.json()
}

export async function getAllUsers() {
  const response = await fetch('https://ofgen.cognitron.co.ke/ofgen/api/users')
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch users')
  }
  return response.json()
}
