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
export async function getProjects()  {
  try {

    const config = await getAxiosConfig();
    const response = await axios.get(
    `  ${process.env.NEXT_PUBLIC_API_URL}/projects `,
      config
    );
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    return { data: [] };
  }
}

export async function createProject(projectData: any) {
  const response = await fetch('https://ofgen.cognitron.co.ke/ofgen/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create project');
  }

  return response.json();
}


export async function getProjectById(id: string) {
  const response = await fetch(`https://ofgen.cognitron.co.ke/ofgen/api/projects/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch project');
  }
  return response.json();
}

export async function updateProject(id: string, projectData: any) {
  const response = await fetch(`https://ofgen.cognitron.co.ke/ofgen/api/projects/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update project');
  }
  return response.json();
}

export async function deleteProject(id: string) {
  const response = await fetch(`https://ofgen.cognitron.co.ke/ofgen/api/projects/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete project');
  }
  return response.json();
}
